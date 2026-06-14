/** Hidden field name — must match frontend HoneypotField */
const HONEYPOT_FIELD = 'website';

/**
 * Reject bot submissions when the honeypot field is filled.
 * @param {{ fakeSuccess?: boolean }} options — return 200 OK without processing (spam forms)
 */
function rejectHoneypot(options = {}) {
  const { fakeSuccess = false } = options;
  return (req, res, next) => {
    const trap = req.body?.[HONEYPOT_FIELD];
    if (trap != null && String(trap).trim() !== '') {
      if (fakeSuccess) {
        return res.json({ success: true, message: 'Submitted successfully' });
      }
      return res.status(400).json({ success: false, message: 'Unable to process request.' });
    }
    next();
  };
}

module.exports = { HONEYPOT_FIELD, rejectHoneypot };
