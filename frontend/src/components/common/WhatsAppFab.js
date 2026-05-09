import React from 'react';
import './WhatsAppFab.css';

const WHATSAPP_NUMBER = '919361432697';
const DEFAULT_MESSAGE = "Hi PakkaRent! I'd like to know more about your rentals.";

export default function WhatsAppFab() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-fab"
      aria-label="Chat with us on WhatsApp"
    >
      <svg
        className="wa-fab-icon"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M16.003 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.59 4.46 1.71 6.4l-1.81 6.6 6.76-1.77c1.87 1.02 3.97 1.56 6.13 1.57h.01c7.06 0 12.79-5.73 12.79-12.8s-5.73-12.8-12.79-12.8zm0 23.34h-.01a10.51 10.51 0 0 1-5.36-1.47l-.38-.23-3.99 1.05 1.07-3.89-.25-.4a10.5 10.5 0 0 1-1.61-5.6c0-5.81 4.73-10.54 10.54-10.54 2.81 0 5.46 1.1 7.45 3.09a10.46 10.46 0 0 1 3.09 7.46c0 5.81-4.73 10.53-10.55 10.53zm5.78-7.89c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.81 1.03-.99 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.77-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54l-.61-.01c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.22 3.4 5.39 4.77.75.32 1.34.51 1.79.66.75.24 1.43.21 1.97.13.6-.09 1.88-.77 2.15-1.51.27-.74.27-1.37.19-1.51-.08-.13-.29-.21-.61-.37z"
        />
      </svg>
      <span className="wa-fab-label">Chat</span>
    </a>
  );
}
