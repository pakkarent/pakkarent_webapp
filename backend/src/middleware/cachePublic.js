/** Short CDN/browser cache for public GET JSON (reduces repeat API bandwidth). */
function cachePublic(maxAgeSeconds) {
  const maxAge = Math.max(0, Number(maxAgeSeconds) || 0);
  return (req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
      res.set('Cache-Control', `public, max-age=${maxAge}`);
    }
    next();
  };
}

module.exports = { cachePublic };
