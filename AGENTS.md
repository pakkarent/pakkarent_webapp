# AGENTS.md — PakkaRent Agent Handbook

> **Read this first** before making changes. This file is the operational source of truth for AI agents working on the PakkaRent codebase.

## What this project is

**PakkaRent** is a full-stack rental marketplace for South India (Chennai, Bangalore, Hyderabad). Customers browse products, add to cart, and place orders via WhatsApp inquiry. Admins manage products, categories, orders, and pricing.

| Layer | Stack |
|-------|-------|
| Backend | Node.js, Express, PostgreSQL (Supabase) |
| Frontend | React 18 (CRA), React Router v6, Context API |
| Storage | Supabase Storage bucket `pakkarent_images` |
| Auth | JWT + bcrypt; optional Supabase auth |
| Deploy | Render (`render.yaml`) — auto-deploy on `main` push |

**Production URLs**
- Frontend: https://pakkarent-web.onrender.com
- API: https://pakkarent-api.onrender.com
- GitHub: https://github.com/pakkarent/pakkarent_webapp (branch `main`)

---

## Local development

```bash
# Backend (port 5001 locally — see frontend .env)
cd backend && npm install && npm run dev

# Frontend (port 3001)
cd frontend && npm install
REACT_APP_API_URL=http://localhost:5001 PORT=3001 npm start
```

**Required env:** copy `backend/.env.example` → `backend/.env`. Needs `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (or anon key for storage), `JWT_SECRET`.

Frontend needs `REACT_APP_API_URL`, `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY` (for image CDN transforms in `frontend/src/utils/media.js`).

**Demo admin** (seeded in DB): `admin@pakkarent.com` / `Admin@123`

---

## Repository layout (agent-relevant)

```
pakkarent/
├── backend/
│   ├── server.js                 # Express app; runs migrations on startup
│   ├── database/
│   │   ├── schema.sql            # Full seed schema (fresh installs)
│   │   └── migrations/           # Numbered SQL migrations (001–011+)
│   ├── scripts/
│   │   ├── relink-product-images-from-storage.js  # Fix images from Supabase folders
│   │   ├── dedupe-products.js                   # Find/deactivate duplicate products
│   │   └── migrate-images-to-supabase.js          # Upload local /uploads → Supabase
│   └── src/routes/               # API route handlers
├── frontend/
│   ├── src/
│   │   ├── pages/                # Route pages (Products, Cart, Blog, Admin…)
│   │   ├── components/common/    # Navbar, CategoryNav, ProductCard…
│   │   ├── content/
│   │   │   ├── blogPosts.js      # All blog articles (static content)
│   │   │   ├── catalogLinks.js   # Internal product URL constants
│   │   │   └── sitePages.js      # About, FAQ, Terms, etc.
│   │   ├── context/              # Auth, Cart, City, Toast
│   │   └── utils/media.js        # Supabase image URL resolution
│   └── public/sitemap.xml
├── render.yaml                   # Render Blueprint (API + web)
└── AGENTS.md                     # This file
```

---

## Database & migrations

- **Migrations run automatically** on API startup via `backend/src/utils/migrations.js`.
- Applied migrations tracked in `_migrations` table.
- **Always add new migrations** as `backend/database/migrations/NNN_description.sql` (next number after highest existing).
- **Do not edit already-applied migrations** on production unless idempotent; prefer a new migration.
- SQL migrations cannot list Supabase Storage — use Node scripts in `backend/scripts/` for bucket operations.

### Category IDs (stable seed IDs)

| ID | Category | Nav sort_order |
|----|----------|----------------|
| 1 | Camping Rental | 7 |
| 2 | Home Appliances Rental | 8 |
| 3 | Event Rental | 1 |
| 4 | Backdrop Rental | 2 |
| 5 | Birthday Rental | 3 |
| 6 | Baby Props Rental | 4 |
| 7 | Kids Toys on Rent | 5 |
| 8 | Games Rental | 6 |

**Event subcategories** (parent_id = 3):

| ID | Name |
|----|------|
| 10 | Cradle |
| 13 | Swings & Oonjal |
| 11 | Chairs & Furniture |
| 9 | Decor & Urli |
| 12 | Props & Stands |

Products use `category_id` = parent (e.g. 3) and `subcategory_id` = child (e.g. 10). Migration `007` normalized rows that incorrectly had `category_id` pointing at subcategory rows.

### Products table conventions

- `images` — JSONB array of Supabase public URLs or `/uploads/...` paths
- `is_active` — soft delete; **never hard-delete** products with order history
- Unique index `products_unique_name_city_active` prevents duplicate active products per name+city
- Event items: priced **per event** (`monthly_price` field used as event price)
- Appliances: monthly + 3/6/12-month tiers in `price_3month`, etc.

---

## Product images (critical)

**Source of truth:** Supabase Storage bucket `pakkarent_images`.

**Upload path pattern** (admin uploads & scraped images):
```
products/{category_slug}/{product_slug}/img_{timestamp}_{random}.ext
```
Slug logic (`backend/src/routes/uploads.js`):
```js
name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
```
Category slug from **parent category name** (e.g. `event_rental`), not subcategory.

**Common image bugs (avoid repeating):**
1. Migration `009` had a broad `WHERE name ILIKE '%cradle%'` rule that assigned the same generic `silver_cradle` image to all cradles — **removed**. Never use blanket name-pattern image updates.
2. After bad image data, run: `cd backend && npm run relink:images` — maps DB `products.images` from Supabase folder structure.
3. Local `frontend/public/uploads/` has only ~39 legacy files; full catalog images live in Supabase (~130 files).

**Frontend resolution:** `frontend/src/utils/media.js` — transforms via Supabase render API when `REACT_APP_SUPABASE_URL` is set.

---

## API patterns

| Route | Notes |
|-------|-------|
| `GET /api/products` | Filters: `city`, `category_id`, `subcategory_id`, `search`, `min_price`, `max_price`, `featured`, `page`, `limit` |
| `GET /api/categories` | Ordered by `sort_order`; use `parents_only`, `parent_id`, `city` |
| `PUT /api/products/:id` | Admin only |
| `DELETE /api/products/:id` | Soft delete (`is_active=false`) |

**Subcategory filter:** when `subcategory_id` is passed, filter is `p.subcategory_id = $id` only (not `category_id`).

**Category filter:** when only `category_id` is passed, includes products in that parent OR any of its subcategories.

---

## Frontend patterns (gotchas)

### Product filters — URL is source of truth
`frontend/src/pages/Products.js` reads `category_id` and `subcategory_id` from **URL search params**, not local state. Sidebar filter clicks must call `setSearchParams` via `setCategoryFilters()`. Breaking this causes “filter selected but wrong products shown”.

### Category navigation order
`getParentCategories()` in `frontend/src/utils/categoryUtils.js` sorts by `sort_order`. Backend `categories.js` orders with `COALESCE(pc.sort_order, c.sort_order)` — not by category `id`.

### CategoryNav submenu
Event dropdown uses a **portal** (`CategoryNav.js`) to avoid `overflow` clipping in the navbar.

### City context
`CityContext.js` — city picker modal; `confirmCityForCatalog()` auto-confirms city on deep-linked product URLs.

### Cart & orders
Cart is client-side (Context). Checkout sends WhatsApp inquiry (`frontend/src/utils/whatsappInquiry.js`), not a payment gateway.

### Blog (static content)
- Listing: `/blog` → `frontend/src/pages/Blog.js`
- Article: `/blog/:slug` → `frontend/src/pages/BlogPost.js`
- **Add/edit posts in** `frontend/src/content/blogPosts.js`
- Internal links: `frontend/src/content/catalogLinks.js`
- Update `frontend/public/sitemap.xml` when adding posts

### SEO
Per-route via `frontend/src/hooks/useSEO.js`. Blog posts include JSON-LD (`BlogPosting`, breadcrumbs).

---

## Admin panel

| Path | Purpose |
|------|---------|
| `/admin` | Dashboard |
| `/admin/products` | Product list |
| `/admin/products/new` | Create product |
| `/admin/categories` | Category CRUD |
| `/admin/orders` | Order management |
| `/admin/pricing` | Pricing offers |

Image upload: `POST /api/uploads/products/:id` (admin auth required).

---

## Operational scripts

```bash
cd backend

# Re-link product.images from Supabase storage folders (run after bad image migration)
npm run relink:images

# Dry-run duplicate detection; add --apply to deactivate
npm run dedupe:products
npm run dedupe:products -- --apply

# Upload local frontend/public/uploads files to Supabase
npm run migrate:images
```

---

## Deployment

1. Push to `main` on GitHub → Render auto-builds both services.
2. API startup runs pending SQL migrations against Supabase PostgreSQL.
3. **Image relink / dedupe scripts do NOT run on deploy** — run manually against production DB if needed (scripts use `backend/.env` `DATABASE_URL`).
4. Do **not** commit `.env`, credentials, or `scripts/compare-products.py` (local QA artifact).

```bash
git push origin main   # triggers Render deploy
```

Render config: `render.yaml` (Singapore region, free tier).

---

## Agent workflow rules

### Do
- Read surrounding code before editing; match existing style.
- Keep diffs minimal and scoped to the task.
- Add numbered SQL migrations for schema/data changes.
- Use `catalogLinks.js` for blog → product internal links.
- Test API filter behavior when touching products/categories.
- Run `npm run build` in `frontend/` after significant UI changes.

### Don't
- Commit unless the user explicitly asks (see user rules).
- Force-push `main` or skip git hooks.
- Use broad `ILIKE '%keyword%'` rules for product images or bulk updates.
- Store secrets in committed files.
- Create duplicate products without checking `products_unique_name_city_active` index.
- Assume sidebar filter state without syncing URL params.

### Bot protection
- **Rate limits** (`backend/src/middleware/rateLimit.js`): login 10/15min, register 5/hour, inquiries 5/15min per IP.
- **Honeypot** field `website` — hidden on Login, Register, Cart; validated in `backend/src/middleware/honeypot.js`.
- `app.set('trust proxy', 1)` required on Render for correct IP-based limits.

---

## Known data gaps (as of 2026-06)

These active products may still lack images in Supabase (no scraped folder yet):
- Baby Blue Backdrop, Baby Car for Birthday, Baby Jeep Rental
- Camping Lantern, Marquee Letters, Charming Peach Backdrop, Red Carpet

---

## Quick debugging

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| All cradles show same image | Bad `products.images` in DB | `npm run relink:images` |
| Duplicate products in grid | Re-import without dedupe | `npm run dedupe:products -- --apply`; check migration 011 |
| Subcategory filter shows all parent products | URL missing `subcategory_id` | Fix `Products.js` `setCategoryFilters` |
| Event missing from nav | Products linked to subcategory as `category_id` | Migration 007 pattern |
| Images broken locally | Missing `REACT_APP_SUPABASE_URL` | Set frontend env vars |
| Nav order wrong | `sort_order` in DB | Migration 010 values; check API sort |

---

## Related docs

| File | Purpose |
|------|---------|
| `README.md` | User-facing setup & features |
| `QUICKSTART.md` | Fast local start |
| `STRUCTURE.md` | Directory tree |
| `PROJECT_SUMMARY.md` | Feature checklist (may be slightly stale) |
| `render.yaml` | Production env var wiring |

---

*Last updated: 2026-06-13 — reflects blog section, filter fix, image relink, dedupe migrations, and nav reorder.*
