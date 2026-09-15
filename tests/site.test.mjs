import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';
import { initGallery } from '../gallery.js';
import { galleryItems } from '../gallery-data.js';
import { initQuote, whatsappLink, validNumber } from '../quote.js';
import { fitImage, boundPan, zoomAt } from '../viewer-math.js';
import { business } from '../business-config.js';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
function setup() {
  const dom = new JSDOM(html, { url: 'https://example.test' });
  const doc = dom.window.document;
  const dialog = doc.querySelector('dialog');
  dialog.showModal = () => dialog.setAttribute('open', '');
  dialog.close = () => { dialog.removeAttribute('open'); dialog.dispatchEvent(new dom.window.Event('close')); };
  const stage = doc.querySelector('#image-stage');
  stage.getBoundingClientRect = () => ({ width: 900, height: 600, left: 0, top: 0 });
  stage.setPointerCapture = () => {};
  const photo = doc.querySelector('#lightbox-image');
  Object.defineProperties(photo, { naturalWidth: { value: 1536 }, naturalHeight: { value: 1024 } });
  return { dom, doc, dialog, stage, photo };
}
function key(dom, node, key, shiftKey = false) { node.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true })); }
function pointer(dom, node, type, id, x, y) { const e = new dom.window.Event(type, { bubbles: true }); Object.assign(e, { pointerId: id, pointerType: 'touch', clientX: x, clientY: y }); node.dispatchEvent(e); }
test('navigation targets exist and business claims are not fabricated', () => {
  const { doc } = setup();
  for (const a of doc.querySelectorAll('a[href^="#"]')) assert.ok(doc.querySelector(a.getAttribute('href')), a.href);
  assert.doesNotMatch(html, /2,400|4\.9\/5|Licensed &amp; insured|Amanda R\.|\(555\)/);
  assert.ok(validNumber(business.whatsappNumber));
});
test('four featured images and three or four relevant images per category', () => {
  const { doc } = setup(); initGallery(doc, galleryItems);
  assert.equal(doc.querySelectorAll('.gallery-card').length, 4);
  for (const filter of doc.querySelectorAll('[data-filter]')) {
    filter.click(); const expected = filter.dataset.filter === 'all' ? 4 : galleryItems.filter(x => x.categories.includes(filter.dataset.filter)).length;
    if (filter.dataset.filter !== 'all') assert.ok(expected >= 3 && expected <= 4);
    assert.equal(doc.querySelectorAll('.gallery-card').length, expected);
    assert.equal(doc.querySelectorAll('[data-filter][aria-pressed="true"]').length, 1);
  }
  doc.querySelector('[data-filter="Gamazine"]').click(); doc.querySelector('.gallery-open').click();
  assert.equal(doc.querySelector('#next-image').disabled, false);
  doc.querySelector('#next-image').click();
  assert.match(doc.querySelector('#lightbox-image').src, /gamazine-courtyard-1536/);
});
test('zoom limits, reset, image navigation, keyboard, focus and load errors', () => {
  const { dom, doc, dialog, photo } = setup(); initGallery(doc, galleryItems);
  const opener = doc.querySelector('.gallery-open'); opener.click();
  assert.equal(dialog.open, true); assert.equal(doc.activeElement.id, 'close-lightbox');
  key(dom, dialog, 'Tab', true); assert.equal(doc.activeElement.id, 'next-image');
  key(dom, dialog, 'Tab'); assert.equal(doc.activeElement.id, 'close-lightbox');
  photo.dispatchEvent(new dom.window.Event('load')); assert.equal(doc.querySelector('#image-status').textContent, '');
  for (let i=0;i<12;i++) key(dom, dialog, '+');
  assert.equal(doc.querySelector('#zoom-level').textContent, '400%');
  assert.equal(doc.querySelector('#zoom-in').disabled, true);
  key(dom, dialog, 'ArrowRight'); assert.equal(doc.querySelector('#lightbox-title').textContent, galleryItems[1].title);
  assert.equal(doc.querySelector('#zoom-level').textContent, '100%');
  key(dom, dialog, 'ArrowLeft'); key(dom, dialog, 'ArrowLeft'); assert.equal(doc.querySelector('#lightbox-title').textContent, galleryItems.filter(item => item.featured).at(-1).title);
  for (let i=0;i<4;i++) key(dom, dialog, '-'); assert.equal(doc.querySelector('#zoom-level').textContent, '100%');
  photo.dispatchEvent(new dom.window.Event('error')); assert.match(doc.querySelector('#image-status').textContent, /could not load/);
  key(dom, dialog, 'Escape'); assert.equal(dialog.open, false); assert.equal(doc.activeElement, opener); assert.equal(doc.body.classList.contains('viewer-open'), false);
});
test('pinch zoom, pan bounds, pointer cancellation, reset and wheel zoom', () => {
  const { dom, doc, stage } = setup(); initGallery(doc, galleryItems); doc.querySelector('.gallery-open').click();
  pointer(dom, stage, 'pointerdown', 1, 300, 300); pointer(dom, stage, 'pointerdown', 2, 600, 300);
  pointer(dom, stage, 'pointermove', 2, 900, 300); assert.equal(doc.querySelector('#zoom-level').textContent, '200%');
  pointer(dom, stage, 'pointerup', 2, 900, 300); pointer(dom, stage, 'pointermove', 1, 10000, 10000);
  assert.match(doc.querySelector('#lightbox-image').style.transform, /translate\(450px, 300px\)/);
  pointer(dom, stage, 'pointercancel', 1, 10000, 10000); doc.querySelector('#reset-zoom').click();
  assert.equal(doc.querySelector('#zoom-level').textContent, '100%');
  stage.dispatchEvent(new dom.window.WheelEvent('wheel', { deltaY: -5000, clientX: 450, clientY: 300, cancelable: true }));
  assert.equal(doc.querySelector('#zoom-level').textContent, '400%');
});
test('portrait images stay bounded when zoomed in a landscape stage', () => {
  assert.deepEqual(fitImage(1000, 600, 600, 1200), { width: 300, height: 600 });
  assert.deepEqual(boundPan(999, -999, 2, 1000, 600, 600, 1200), { x: 0, y: -300 });
  assert.equal(zoomAt({ scale: 2, x: 0, y: 0 }, 9).scale, 4);
});
test('WhatsApp validates missing data and safely encodes complete enquiries', () => {
  const data = { name: 'Zoë & Sam', location: 'Cape Town', service: 'Exterior & boundary walls', description: 'Walls + ceiling?\nApprox. 40 m²' };
  assert.equal(whatsappLink('', data), null); assert.equal(validNumber('555-123'), false);
  assert.equal(whatsappLink('27821234567', { ...data, name: '   ' }), null);
  assert.equal(whatsappLink('27821234567', { ...data, service: 'Invalid' }), null);
  const url = new URL(whatsappLink('27821234567', data));
  assert.equal(url.host, 'wa.me'); assert.equal(url.pathname, '/27821234567'); assert.equal([...url.searchParams.keys()].length, 1);
  assert.match(url.searchParams.get('text'), /Zoë & Sam/); assert.match(url.searchParams.get('text'), /40 m²/);
});
test('missing-number UI does not fake success; configured contact enables form', () => {
  const { dom, doc } = setup(); initQuote(doc, { ...business, whatsappNumber: '' });
  assert.equal(doc.querySelector('#quote-form button').disabled, true);
  doc.querySelector('#quote-form').dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
  assert.match(doc.querySelector('#quote-status').textContent, /not yet available/);
  assert.equal(doc.querySelector('#direct-whatsapp').hidden, true);
  const enabled = setup(); initQuote(enabled.doc, { ...business, serviceArea: 'Cape Town' });
  assert.equal(enabled.doc.querySelector('#quote-form button').disabled, false);
  assert.equal(enabled.doc.querySelector('#direct-whatsapp').href, 'https://wa.me/27794701191');
  assert.match(enabled.doc.querySelector('#service-area').textContent, /Cape Town/);
  enabled.doc.querySelector('[data-service="Gamazine"]').click(); assert.equal(enabled.doc.querySelector('select').value, 'Gamazine');
  assert.equal(enabled.doc.querySelector('#quote-form').checkValidity(), false);
});
test('every full-size gallery asset and thumbnail decodes', async () => {
  for (const item of galleryItems) for (const width of [800,1536]) {
    const path = new URL(`../public/images/${item.image}-${width}.webp`, import.meta.url); await access(path);
    const info = await sharp(await readFile(path)).metadata(); assert.equal(info.width, Math.min(width, item.nativeWidth || width)); if (item.nativeHeight) assert.equal(info.height, item.nativeHeight); else assert.ok(info.height > 400);
  }
});
