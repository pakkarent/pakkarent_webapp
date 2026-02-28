# PakkaRent - Complete Directory Structure

```
pakkarent/
│
├── README.md                          # Complete documentation
├── QUICKSTART.md                      # 5-minute setup guide
├── PROJECT_SUMMARY.md                 # Project overview and statistics
├── STRUCTURE.md                       # This file - directory structure
├── .gitignore                         # Git ignore rules
│
│
├── backend/                           # Node.js + Express Backend
│   ├── server.js                      # Main Express server
│   ├── package.json                   # Dependencies & scripts
│   ├── .env.example                   # Environment variables template
│   │
│   ├── src/
│   │   ├── routes/                    # API Route Handlers
│   │   │   ├── auth.js                # Register, Login endpoints
│   │   │   ├── products.js            # Product CRUD endpoints
│   │   │   ├── categories.js          # Category CRUD endpoints
│   │   │   ├── orders.js              # Order management endpoints
│   │   │   ├── users.js               # User profile endpoints
│   │   │   └── admin.js               # Admin stats & user management
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js                # JWT authentication middleware
│   │   │
│   │   └── models/
│   │       └── db.js                  # PostgreSQL connection pool
│   │
│   └── database/
│       └── schema.sql                 # Database schema & seed data
│
│
├── frontend/                          # React Frontend
│   ├── package.json                   # Dependencies & scripts
│   ├── public/
│   │   └── index.html                 # HTML template
│   │
│   └── src/
│       ├── index.js                   # React entry point
│       ├── index.css                  # Global styles
│       ├── App.js                     # Main app component with routes
│       │
│       ├── pages/                     # Page Components
│       │   ├── Home.js & Home.css                 # Homepage with featured products
│       │   ├── Products.js & Products.css        # Products listing with filters
│       │   ├── ProductDetail.js & ProductDetail.css # Single product page
│       │   ├── Cart.js & Cart.css                # Shopping cart
│       │   ├── Checkout.js & Checkout.css       # Order checkout
│       │   ├── Login.js
│       │   ├── Register.js                       # Auth.css for both
│       │   ├── MyOrders.js & MyOrders.css       # User's order history
│       │   ├── Profile.js & Profile.css         # User profile management
│       │   │
│       │   └── admin/                 # Admin Pages
│       │       ├── AdminDashboard.js             # Dashboard with stats
│       │       ├── AdminProducts.js              # Product management table
│       │       ├── AdminProductForm.js           # Add/edit product form
│       │       ├── AdminOrders.js                # Order management table
│       │       ├── AdminUsers.js                 # User management table
│       │       ├── Admin.css                     # Admin pages styles
│       │       ├── AdminTable.css                # Table styles
│       │       └── AdminForm.css                 # Form styles
│       │
│       ├── components/                # Reusable Components
│       │   └── common/
│       │       ├── Navbar.js & Navbar.css       # Navigation bar
│       │       ├── Footer.js & Footer.css       # Footer component
│       │       └── ProductCard.js & ProductCard.css # Product card component
│       │
│       ├── context/                   # State Management (Context API)
│       │   ├── AuthContext.js         # User authentication state
│       │   ├── CartContext.js         # Shopping cart state
│       │   └── CityContext.js         # Selected city state
│       │
│       └── services/
│           └── api.js                 # Axios API service with interceptors
│
│
└── Documentation Files:
    ├── README.md                      # 300+ lines - Complete guide
    ├── QUICKSTART.md                  # 150+ lines - Quick setup
    ├── PROJECT_SUMMARY.md             # 400+ lines - Full overview
    └── STRUCTURE.md                   # This file - Directory layout
```

## File Organization Logic

### Backend Structure
```
src/routes/          → Each file handles one resource type
src/middleware/      → Reusable middleware functions
src/models/          → Database connection management
database/            → Schema and seed data
```

### Frontend Structure
```
pages/               → Page-level components (each has its CSS)
components/common/  → Reusable UI components
context/            → Global state management
services/           → API communication layer
```

## File Statistics

### Backend (10 files)
- 6 route files (auth, products, categories, orders, users, admin)
- 1 middleware file (authentication)
- 1 database model file
- 1 main server file
- 1 package.json
- 1 .env template

### Frontend (48 files)
- 9 page files
- 9 CSS files (for pages)
- 5 admin page files
- 3 admin CSS files
- 3 component files
- 3 component CSS files
- 3 context files
- 1 API service file
- 1 App.js
- 1 index.js
- 1 index.css
- 1 public/index.html
- 1 package.json

### Documentation (4 files)
- README.md (complete guide)
- QUICKSTART.md (quick start)
- PROJECT_SUMMARY.md (overview)
- STRUCTURE.md (this file)

### Configuration (1 file)
- .gitignore

## Code Organization Principles

### Backend
- **Routes:** Organized by resource (products, orders, users, etc.)
- **Middleware:** Shared authentication logic
- **Models:** Database connection management
- **Database:** Schema with proper relationships

### Frontend
- **Pages:** Full-screen components with their own styles
- **Components:** Reusable UI elements
- **Context:** Global state management separated by concern
- **Services:** API calls isolated in one layer

## Naming Conventions

### Files
- Components: PascalCase (Home.js, ProductCard.js)
- Styles: Same as component (Home.css, ProductCard.css)
- Utils/Services: camelCase (api.js)
- Routes: lowercase (auth.js)

### Directories
- lowercase (routes, pages, components, context, services)
- Plural for collections (routes, pages, components)
- Descriptive names (common, admin)

## Import/Export Patterns

### Backend
```javascript
const express = require('express');
const { authenticate, adminOnly } = require('../middleware/auth');
module.exports = router;
```

### Frontend
```javascript
import React from 'react';
import { Link } from 'react-router-dom';
export default function Home() { }
```

## How to Navigate the Codebase

### Adding a New Feature
1. Create route in `backend/src/routes/newfeature.js`
2. Add to backend `server.js`
3. Create API call in `frontend/src/services/api.js`
4. Create page in `frontend/src/pages/NewFeature.js`
5. Add route in `frontend/src/App.js`

### Modifying Products
- API: `backend/src/routes/products.js`
- Frontend List: `frontend/src/pages/Products.js`
- Frontend Detail: `frontend/src/pages/ProductDetail.js`
- Component: `frontend/src/components/common/ProductCard.js`

### Adding Admin Feature
- API: `backend/src/routes/admin.js`
- Page: `frontend/src/pages/admin/AdminFeature.js`
- Add to: `frontend/src/App.js` (AdminRoute)

## Quick Reference

### To modify:
- **User authentication** → `backend/src/routes/auth.js` & `frontend/src/context/AuthContext.js`
- **Product listing** → `backend/src/routes/products.js` & `frontend/src/pages/Products.js`
- **Shopping cart** → `frontend/src/context/CartContext.js` & `frontend/src/pages/Cart.js`
- **Styling** → Find `.css` file next to component
- **Database** → `backend/database/schema.sql`

### To add:
- **New page** → Create in `frontend/src/pages/` with CSS, add route to `App.js`
- **New API route** → Create in `backend/src/routes/` or add to existing file
- **New API method** → Add to `frontend/src/services/api.js`
- **New context** → Create in `frontend/src/context/`

## Total Line Count (Estimated)

- **Backend Code:** 1,200+ lines
- **Frontend Code:** 2,500+ lines
- **Styling:** 1,000+ lines
- **Database:** 150+ lines
- **Documentation:** 1,000+ lines
- **Total:** 5,850+ lines

## Version Control

- Backend dependencies in `backend/package.json`
- Frontend dependencies in `frontend/package.json`
- Environment config in `.env` (use .env.example as template)
- All node_modules ignored via `.gitignore`

## Deployment Structure

When deploying:
1. **Backend:** Deploy to Node.js host (Heroku, Railway, AWS, etc.)
2. **Frontend:** Build with `npm run build`, deploy to CDN (Vercel, Netlify, etc.)
3. **Database:** Setup PostgreSQL instance
4. **Environment:** Configure .env files on hosting platforms

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Status:** Complete & Organized
