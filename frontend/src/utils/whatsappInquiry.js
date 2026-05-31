/** PakkaRent business WhatsApp (digits only, with country code). */
export const PAKKARENT_WHATSAPP_NUMBER =
  (process.env.REACT_APP_WHATSAPP_NUMBER || '919361432697').replace(/\D/g, '');

export const WHATSAPP_GREETING = "Hi PakkaRent! I'd like to know more about your rentals.";

function display(val) {
  const s = val?.trim?.() ?? val;
  return s ? String(s) : '—';
}

function orderTotal(items) {
  return (items || []).reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
}

/** Pre-filled WhatsApp message for a cart inquiry. */
export function formatInquiryWhatsAppMessage(payload) {
  const items = payload.items || [];
  const total = orderTotal(items);
  const itemLines = items.map((item, i) => {
    const qty = item.quantity > 1 ? ` x${item.quantity}` : '';
    return `${i + 1}. ${display(item.name)}${qty} — ₹${Number(item.lineTotal || 0).toFixed(2)}`;
  });

  return [
    '*New order inquiry — PakkaRent*',
    '',
    '*Customer*',
    `Name: ${display(payload.name)}`,
    `Phone: ${display(payload.phone)}`,
    `Email: ${display(payload.email)}`,
    `Address: ${display(payload.address)}`,
    `City: ${display(payload.city)}`,
    '',
    '*Rental*',
    display(payload.rentalSummary),
    '',
    '*Items*',
    ...itemLines,
    '',
    `*Total: ₹${total.toFixed(2)}*`,
  ].join('\n');
}

export function buildWhatsAppUrl(message, number = PAKKARENT_WHATSAPP_NUMBER) {
  const digits = String(number).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildInquiryWhatsAppUrl(payload) {
  return buildWhatsAppUrl(formatInquiryWhatsAppMessage(payload));
}

export function openWhatsAppUrl(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
