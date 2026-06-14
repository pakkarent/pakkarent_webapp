import React from 'react';
import './HoneypotField.css';

/** Bot trap — hidden from users; leave empty. Bots often auto-fill "website". */
export default function HoneypotField({ value = '', onChange }) {
  return (
    <div className="hp-field" aria-hidden="true">
      <label htmlFor="hp-website">Website</label>
      <input
        type="text"
        id="hp-website"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

/** Client-side check before WhatsApp-only flows (no API). */
export function isHoneypotFilled(website) {
  return website != null && String(website).trim() !== '';
}
