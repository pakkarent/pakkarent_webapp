#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "▶ Installing dependencies..."
npm install

echo "▶ Clean build..."
rm -rf build
npm run build

echo "▶ Generating sitemap.xml..."
export SITE_URL="${SITE_URL:-https://pakkarent.com}"
node scripts/generate-sitemap.js

echo "▶ Generating product ID redirects..."
node scripts/generate-redirects.js

echo "▶ Prerendering SEO HTML pages..."
node scripts/prerender-pages.js

echo "▶ Verifying build output..."
test -f build/sitemap.xml
test -f build/index.html
test -f build/manifest.json
test -f build/og-image.png
test -f build/favicon-32x32.png
test -f build/apple-touch-icon.png
test -f build/serve.json

JS_FILE="$(ls build/static/js/main.*.js | head -1)"
CSS_FILE="$(ls build/static/css/main.*.css | head -1)"
test -n "$JS_FILE"
test -n "$CSS_FILE"
test -s "$JS_FILE"
test -s "$CSS_FILE"

echo "✓ Build OK"
echo "  JS:  $JS_FILE"
echo "  CSS: $CSS_FILE"
