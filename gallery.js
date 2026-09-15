import { clamp, boundPan, zoomAt } from './viewer-math.js';
export function initGallery(doc, items) {
  const grid = doc.querySelector('#gallery');
  const dialog = doc.querySelector('#lightbox');
  const stage = doc.querySelector('#image-stage');
  const photo = doc.querySelector('#lightbox-image');
  const imageStatus = doc.querySelector('#image-status');
  const closeButton = doc.querySelector('#close-lightbox');
  const prev = doc.querySelector('#prev-image');
  const next = doc.querySelector('#next-image');
  const minus = doc.querySelector('#zoom-out');
  const plus = doc.querySelector('#zoom-in');
  const reset = doc.querySelector('#reset-zoom');
  const count = doc.querySelector('#gallery-count');
  const pointers = new Map();
  const featured = items.filter(item => item.featured).slice(0, 4);
  let visible = featured, index = 0, opener, state = { scale: 1, x: 0, y: 0 }, gesture = null, requestId = 0;
  function render() {
    grid.replaceChildren();
    for (const item of visible) {
      const figure = doc.createElement('figure'); figure.className = 'gallery-card';
      const button = doc.createElement('button'); button.type = 'button'; button.className = 'gallery-open'; button.setAttribute('aria-label', `View ${item.title}`);
      const image = doc.createElement('img'); image.src = `/images/${item.image}-800.webp`; image.alt = item.alt; image.srcset = `/images/${item.image}-800.webp 800w, /images/${item.image}-1536.webp 1536w`; image.sizes = '(max-width: 760px) 100vw, 50vw'; image.loading = 'lazy'; image.width = 800; image.height = 533;
      const icon = doc.createElement('span'); icon.className = 'expand-icon'; icon.setAttribute('aria-hidden', 'true'); icon.textContent = '↗';
      button.append(image, icon); button.addEventListener('click', () => open(item.id, button));
      const caption = doc.createElement('figcaption'); const text = doc.createElement('div'); const title = doc.createElement('h3'); title.textContent = item.title;
      const credit = doc.createElement('p'); credit.textContent = item.credit; const subtitle = doc.createElement('p'); subtitle.className = 'gallery-subtitle'; subtitle.textContent = item.subtitle; text.append(title, subtitle, credit);
      const category = doc.createElement('span'); category.textContent = item.categories[0]; caption.append(text, category);
      figure.append(button, caption); grid.append(figure);
    }
    count.textContent = `${visible.length} ${visible.length === 1 ? 'image' : 'images'}`;
    if (!visible.length) { const p = doc.createElement('p'); p.className = 'gallery-empty'; p.textContent = 'No inspiration images in this category yet.'; grid.append(p); }
  }
  doc.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    doc.querySelectorAll('[data-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    visible = button.dataset.filter === 'all' ? featured : items.filter(item => item.categories.includes(button.dataset.filter));
    render();
  }));
  function apply() {
    const bounds = stage.getBoundingClientRect();
    const pan = boundPan(state.x, state.y, state.scale, bounds.width, bounds.height, photo.naturalWidth, photo.naturalHeight);
    state = { ...state, ...pan };
    photo.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    stage.style.cursor = state.scale > 1 ? (pointers.size ? 'grabbing' : 'grab') : 'default';
    doc.querySelector('#zoom-level').textContent = `${Math.round(state.scale * 100)}%`;
    minus.disabled = state.scale <= 1;
    plus.disabled = state.scale >= 4;
  }
  function resetView() { state = { scale: 1, x: 0, y: 0 }; pointers.clear(); gesture = null; apply(); }
  function setZoom(value, x = 0, y = 0) { state = zoomAt(state, value, x, y); apply(); }
  function display() {
    const item = visible[index];
    const request = ++requestId;
    resetView();
    photo.style.visibility = 'hidden';
    photo.alt = item.alt;
    doc.querySelector('#lightbox-title').textContent = item.title;
    doc.querySelector('#lightbox-position').textContent = `${index + 1} / ${visible.length} · FINISH INSPIRATION`;
    const credit = doc.querySelector('#lightbox-credit'); credit.replaceChildren();
    const creditText = doc.createElement(item.source ? 'a' : 'span'); creditText.textContent = item.credit;
    if (item.source) { creditText.href = item.source; creditText.target = '_blank'; creditText.rel = 'noopener noreferrer'; }
    credit.append(creditText, doc.createTextNode(` — ${item.note}`));
    imageStatus.textContent = 'Loading image…';
    photo.onload = () => { if (request !== requestId) return; photo.style.visibility = 'visible'; imageStatus.textContent = ''; apply(); };
    photo.onerror = () => { if (request !== requestId) return; photo.style.visibility = 'hidden'; imageStatus.textContent = 'This image could not load. Please try another image or reopen the viewer.'; };
    photo.src = `/images/${item.image}-1536.webp`;
    prev.disabled = next.disabled = visible.length < 2;
  }
  function open(id, button) {
    index = visible.findIndex(item => item.id === id); if (index < 0) return;
    opener = button;
    dialog.showModal(); doc.body.classList.add('viewer-open'); display(); closeButton.focus();
  }
  function advance(direction) { if (visible.length < 2) return; index = (index + direction + visible.length) % visible.length; display(); }
  dialog.addEventListener('close', () => { pointers.clear(); gesture = null; requestId++; doc.body.classList.remove('viewer-open'); opener?.focus(); });
  closeButton.addEventListener('click', () => dialog.close());
  prev.addEventListener('click', () => advance(-1)); next.addEventListener('click', () => advance(1));
  plus.addEventListener('click', () => setZoom(state.scale + .5)); minus.addEventListener('click', () => setZoom(state.scale - .5)); reset.addEventListener('click', resetView);
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); advance(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); advance(-1); }
    else if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(state.scale + .5); }
    else if (event.key === '-') { event.preventDefault(); setZoom(state.scale - .5); }
    else if (event.key === '0') { event.preventDefault(); resetView(); }
    else if (event.key === 'Tab') {
      const focusable = [...dialog.querySelectorAll('button:not(:disabled),a[href]')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  stage.addEventListener('wheel', event => { event.preventDefault(); const rect = stage.getBoundingClientRect(); setZoom(state.scale * Math.exp(-event.deltaY * .002), event.clientX - rect.left - rect.width / 2, event.clientY - rect.top - rect.height / 2); }, { passive: false });
  function beginGesture() {
    const points = [...pointers.values()];
    if (points.length >= 2) {
      const [a, b] = points;
      gesture = { ...state, distance: Math.hypot(b.x - a.x, b.y - a.y), center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
    } else if (points.length) { gesture = { ...state, point: points[0] }; }
    else gesture = null;
  }
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    stage.setPointerCapture(event.pointerId); pointers.set(event.pointerId, { x: event.clientX, y: event.clientY }); beginGesture(); apply();
  });
  stage.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.values()];
    if (points.length >= 2 && gesture?.distance) {
      const [a, b] = points; const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; const rect = stage.getBoundingClientRect();
      const scale = clamp(gesture.scale * Math.hypot(b.x - a.x, b.y - a.y) / gesture.distance, 1, 4);
      state = zoomAt(gesture, scale, gesture.center.x - rect.left - rect.width / 2, gesture.center.y - rect.top - rect.height / 2);
      state.x += center.x - gesture.center.x; state.y += center.y - gesture.center.y;
    } else if (gesture?.point && state.scale > 1) { state.x = gesture.x + event.clientX - gesture.point.x; state.y = gesture.y + event.clientY - gesture.point.y; }
    apply();
  });
  function endPointer(event) { if (!pointers.delete(event.pointerId)) return; beginGesture(); apply(); }
  stage.addEventListener('pointerup', endPointer); stage.addEventListener('pointercancel', endPointer); stage.addEventListener('lostpointercapture', endPointer);
  doc.defaultView.addEventListener('resize', () => { if (dialog.open) { apply(); beginGesture(); } });
  render();
}
