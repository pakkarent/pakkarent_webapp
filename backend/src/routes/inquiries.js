const express = require('express');
const router = express.Router();
const { sendInquiryEmail } = require('../utils/mail');

router.post('/', async (req, res) => {
  const { name, phone, email, address, city, items, rentalSummary } = req.body;

  if (!address?.trim()) {
    return res.status(400).json({ success: false, message: 'Address is required' });
  }
  if (!city?.trim()) {
    return res.status(400).json({ success: false, message: 'City is required' });
  }
  if (!name?.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }
  if (!phone?.trim()) {
    return res.status(400).json({ success: false, message: 'Phone is required' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  const payload = {
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim(),
    address: address.trim(),
    city: city.trim(),
    rentalSummary: rentalSummary?.trim(),
    items,
  };

  // Respond immediately — email sends in background so the UI is not blocked
  res.json({
    success: true,
    message: 'Inquiry submitted successfully',
    emailSent: null,
  });

  sendInquiryEmail(payload)
    .then((result) => {
      if (result.sent) console.log(`📧 Inquiry email sent for ${payload.name}`);
      else console.log(`📧 Inquiry logged for ${payload.name} (SMTP not configured)`);
    })
    .catch((err) => {
      console.error('Inquiry email error:', err.message);
    });
});

module.exports = router;
