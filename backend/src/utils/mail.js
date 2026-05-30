const nodemailer = require('nodemailer');

const INQUIRY_TO = process.env.INQUIRY_EMAIL_TO || 'pakkarent@gmail.com';

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

function display(val) {
  const s = val?.trim?.() ?? val;
  return s ? String(s) : '—';
}

function orderTotal(items) {
  return (items || []).reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
}

function formatInquiryText(payload) {
  const items = payload.items || [];
  const total = orderTotal(items);
  const itemLines = items.map((item) => {
    const name = display(item.name).padEnd(28).slice(0, 28);
    const qty = `Qty: ${item.quantity}`.padStart(8);
    const price = `₹${Number(item.lineTotal || 0).toFixed(2)}`.padStart(10);
    return `  ${name}  ${qty}  ${price}`;
  });

  return [
    '══════════════════════════════════════════════════',
    '  NEW ORDER INQUIRY — PakkaRent',
    '══════════════════════════════════════════════════',
    '',
    'CUSTOMER',
    '──────────────────────────────────────────────────',
    `  Name       ${display(payload.name)}`,
    `  Phone      ${display(payload.phone)}`,
    `  Email      ${display(payload.email)}`,
    `  Address    ${display(payload.address)}`,
    `  City       ${display(payload.city)}`,
    '',
    'RENTAL PERIOD',
    '──────────────────────────────────────────────────',
    `  ${display(payload.rentalSummary)}`,
    '',
    'ORDER ITEMS',
    '──────────────────────────────────────────────────',
    '  Product                       Qty        Amount',
    ...itemLines,
    '──────────────────────────────────────────────────',
    `  Total                              ₹${total.toFixed(2)}`,
    '',
    payload.notes ? ['NOTES', '──────────────────────────────────────────────────', `  ${payload.notes}`, ''].join('\n') : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function formatInquiryHtml(payload) {
  const items = payload.items || [];
  const total = orderTotal(items);

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#333;">${display(item.name)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;color:#333;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;color:#333;font-weight:600;">₹${Number(item.lineTotal || 0).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const notesBlock = payload.notes
    ? `
    <div style="margin-top:24px;">
      <h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:#888;">Notes</h3>
      <p style="margin:0;padding:12px 14px;background:#f8f9fa;border-radius:8px;color:#333;line-height:1.5;">${display(payload.notes)}</p>
    </div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#ff6b00;padding:20px 24px;">
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;">New Order Inquiry</h1>
      <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.9);">PakkaRent website</p>
    </div>

    <div style="padding:24px;">
      <h2 style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#888;">Customer</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#888;width:90px;">Name</td><td style="padding:6px 0;color:#222;font-weight:600;">${display(payload.name)}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;color:#222;"><a href="tel:${display(payload.phone)}" style="color:#ff6b00;text-decoration:none;">${display(payload.phone)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;color:#222;">${payload.email?.trim() ? `<a href="mailto:${payload.email}" style="color:#ff6b00;text-decoration:none;">${payload.email}</a>` : '—'}</td></tr>
        <tr><td style="padding:6px 0;color:#888;vertical-align:top;">Address</td><td style="padding:6px 0;color:#222;line-height:1.5;">${display(payload.address)}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">City</td><td style="padding:6px 0;color:#222;">${display(payload.city)}</td></tr>
      </table>

      <div style="margin-top:24px;padding:14px 16px;background:#fff8f3;border-left:4px solid #ff6b00;border-radius:0 8px 8px 0;">
        <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#888;">Rental period</p>
        <p style="margin:0;font-size:15px;font-weight:600;color:#222;">${display(payload.rentalSummary)}</p>
      </div>

      <h2 style="margin:28px 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#888;">Order items</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f8f9fa;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#666;font-weight:600;">Product</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#666;font-weight:600;width:60px;">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#666;font-weight:600;width:90px;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr style="background:#f8f9fa;">
            <td colspan="2" style="padding:12px;text-align:right;font-weight:700;color:#333;">Total</td>
            <td style="padding:12px;text-align:right;font-weight:700;color:#ff6b00;font-size:16px;">₹${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      ${notesBlock}
    </div>

    <div style="padding:16px 24px;background:#f8f9fa;border-top:1px solid #eee;font-size:12px;color:#888;text-align:center;">
      Reply to this email or call the customer to confirm the order.
    </div>
  </div>
</body>
</html>`;
}

async function sendInquiryEmail(payload) {
  const transporter = createTransporter();
  const text = formatInquiryText(payload);
  const html = formatInquiryHtml(payload);
  const subject = `New order: ${payload.name || 'Customer'} · ${payload.city || 'City'} · ₹${orderTotal(payload.items).toFixed(2)}`;

  if (!transporter) {
    console.log('📧 SMTP not configured — inquiry logged to console:\n', text);
    return { sent: false, logged: true };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: INQUIRY_TO,
    replyTo: payload.email || undefined,
    subject,
    text,
    html,
  });

  return { sent: true, logged: false };
}

module.exports = { sendInquiryEmail, INQUIRY_TO };
