/** PakkaRent business WhatsApp (digits only, with country code). */
export const PAKKARENT_WHATSAPP_NUMBER =
  (process.env.REACT_APP_WHATSAPP_NUMBER || '919361432697').replace(/\D/g, '');

export const WHATSAPP_GREETING = "Hi PakkaRent! I'd like to know more about your rentals.";

function display(val) {
  const s = val?.trim?.() ?? val;
  return s ? String(s) : '—';
}

function formatIndianMoney(amount) {
  return Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatIndianDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function orderTotal(items) {
  return (items || []).reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
}

export function buildMapLink(lat, lng) {
  if (lat == null || lng == null) return '';
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function rentalLines(payload) {
  if (payload.rentalDays != null && payload.rentStart && payload.rentEnd) {
    const days = payload.rentalDays;
    return [
      `• Duration: ${days} day${days !== 1 ? 's' : ''}`,
      `• Dates: ${formatIndianDate(payload.rentStart)} → ${formatIndianDate(payload.rentEnd)}`,
    ];
  }
  if (payload.tenure) {
    const lines = [`• Duration: ${payload.tenure} month${payload.tenure !== 1 ? 's' : ''}`];
    if (payload.rentStart) lines.push(`• Start: ${formatIndianDate(payload.rentStart)}`);
    return lines;
  }
  return [`• ${display(payload.rentalSummary)}`];
}

/** Pre-filled WhatsApp message for a cart inquiry. */
export function formatInquiryWhatsAppMessage(payload) {
  const items = payload.items || [];
  const total = orderTotal(items);
  const itemLines = items.map((item, i) => {
    const qty = item.quantity > 1 ? ` (×${item.quantity})` : '';
    return `${i + 1}. ${display(item.name)}${qty}\n   ₹${formatIndianMoney(item.lineTotal)}`;
  });

  const customerLines = [
    `• Name: ${display(payload.name)}`,
    `• Phone: ${display(payload.phone)}`,
  ];
  if (payload.email?.trim()) {
    customerLines.push(`• Email: ${display(payload.email)}`);
  }

  const deliveryLines = [
    `• City: ${display(payload.city)}`,
    `• Address: ${display(payload.address)}`,
  ];
  const mapLink = payload.mapLink || buildMapLink(payload.lat, payload.lng);
  if (mapLink) {
    deliveryLines.push(`• Map: ${mapLink}`);
  }

  return [
    '📦 *NEW ORDER — PakkaRent*',
    '────────────────────',
    '',
    '👤 *Customer*',
    ...customerLines,
    '',
    '📍 *Delivery*',
    ...deliveryLines,
    '',
    '📅 *Rental*',
    ...rentalLines(payload),
    '',
    '🛒 *Items*',
    ...itemLines,
    '',
    '────────────────────',
    `💰 *Total: ₹${formatIndianMoney(total)}*`,
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
