import {
    business
} from './business-config.js';
import {
    galleryItems
} from './gallery-data.js';
import {
    initGallery
} from './gallery.js';
import {
    initQuote
} from './quote.js';
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#navigation');

function setNavigation(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}
toggle.addEventListener('click', () => setNavigation(toggle.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setNavigation(false)));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setNavigation(false);
        toggle.focus();
    }
});
document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setNavigation(false);
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
    if (event.matches) setNavigation(false);
});
document.querySelector('#year').textContent = new Date().getFullYear();
initGallery(document, galleryItems);
initQuote(document, business);