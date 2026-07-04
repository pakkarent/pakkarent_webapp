/** Comma-separated origins from ALLOWED_ORIGINS and CLIENT_URL (no trailing slashes). */
function getAllowedOrigins() {
  const origins = new Set();
  const add = (value) => {
    if (!value) return;
    String(value)
      .split(',')
      .map((o) => o.trim().replace(/\/$/, ''))
      .filter(Boolean)
      .forEach((o) => origins.add(o));
  };

  add(process.env.ALLOWED_ORIGINS);
  add(process.env.CLIENT_URL);

  if (!origins.size) {
    origins.add('http://localhost:3000');
  }

  return [...origins];
}

function corsOptions() {
  const allowed = getAllowedOrigins();

  return {
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, '');
      if (allowed.includes(normalized)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  };
}

module.exports = { getAllowedOrigins, corsOptions };
