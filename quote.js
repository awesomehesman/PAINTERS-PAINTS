export const services = ['Gamazine', 'Glamourcotes', 'Interior painting', 'Exterior & boundary walls', 'Ceiling finishes', 'Multiple services / advice'];
export function validNumber(number) { return /^[1-9]\d{7,14}$/.test(number); }
export function whatsappLink(number, data) {
  if (!validNumber(number)) return null;
  const values = Object.fromEntries(['name', 'location', 'service', 'description'].map(key => [key, String(data[key] ?? '').trim()]));
  if (Object.values(values).some(value => !value) || !services.includes(values.service)) return null;
  if (values.name.length > 100 || values.location.length > 150 || values.description.length > 2000) return null;
  const message = `Hello Painters & Paints! I'd like to request a quote.\n\nName: ${values.name}\nLocation: ${values.location}\nService: ${values.service}\n\nProject details:\n${values.description}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export function initQuote(doc, business) {
  const form = doc.querySelector('#quote-form');
  const status = doc.querySelector('#quote-status');
  const available = validNumber(business.whatsappNumber);
  const button = form.querySelector('button[type="submit"]');
  const contact = doc.querySelector('#contact-availability');
  const direct = doc.querySelector('#direct-whatsapp');
  const area = doc.querySelector('#service-area');
  if (business.serviceArea.trim()) { area.hidden = false; area.textContent = `Service area: ${business.serviceArea}`; }
  button.disabled = !available;
  if (available) {
    status.textContent = 'Your message opens in WhatsApp for you to review and send.';
    contact.textContent = `+${business.whatsappNumber}`;
    direct.hidden = false;
    direct.href = `https://wa.me/${business.whatsappNumber}`;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!available) { status.textContent = 'WhatsApp enquiries are not yet available. The business contact number is being confirmed.'; return; }
    for (const field of form.querySelectorAll('input, textarea')) {
      field.setCustomValidity(field.value.trim() ? '' : 'Please enter your project details.');
    }
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new doc.defaultView.FormData(form));
    const url = whatsappLink(business.whatsappNumber, data);
    if (!url) { status.textContent = 'Please check the required fields and try again.'; return; }
    // Navigate in the current tab to avoid blocked popups. The customer sends in WhatsApp.
    doc.defaultView.location.assign(url);
  });
  form.addEventListener('input', event => event.target.setCustomValidity?.(''));
  doc.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
    form.elements.service.value = link.dataset.service;
  }));
}
