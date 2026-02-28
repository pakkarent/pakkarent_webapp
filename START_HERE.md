# PakkaRent - Start Here!

Welcome to PakkaRent, a complete full-stack rental platform!

## What You Have

A production-ready full-stack web application built with:
- **Backend:** Node.js + Express + PostgreSQL
- **Frontend:** React 18 + Context API
- **Features:** Complete e-commerce rental system
- **Code:** 60 files, 5,850+ lines of production-ready code

## Get Started in 3 Steps

### 1. Setup Database (2 minutes)
```bash
createdb pakkarent
psql pakkarent < backend/database/schema.sql
```

### 2. Start Backend (2 minutes)
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Start Frontend (1 minute)
```bash
cd frontend
npm install
npm start
```

**That's it!** Your app is running at http://localhost:3000

## Login Credentials

```
Email:    admin@pakkarent.com
Password: Admin@123
```

Or create a new account by signing up!

## What to Do Next

### Explore the App
1. **Homepage** - See featured products and categories
2. **Products** - Browse and filter items
3. **Cart** - Add items and checkout
4. **Profile** - Manage your account
5. **Orders** - View your rental history
6. **Admin Panel** - Manage products and orders (login as admin)

### Understand the Code
- **README.md** - Full documentation (start here for details)
- **QUICKSTART.md** - Setup guide
- **STRUCTURE.md** - How the code is organized
- **PROJECT_SUMMARY.md** - Complete project overview

### Key Files to Know
- `backend/server.js` - Backend entry point
- `frontend/src/App.js` - Frontend routing
- `backend/database/schema.sql` - Database structure
- `backend/src/routes/` - All API endpoints
- `frontend/src/pages/` - All pages

## Features You Have

### Customer Features
- Register/Login
- Browse products by category/price
- Search products
- View product details
- Add to cart
- Choose rental duration (1/3/6/12 months)
- Checkout and place order
- Track orders
- Manage profile

### Admin Features
- Dashboard with statistics
- Add/Edit/Delete products
- Manage orders and update status
- Manage users and roles
- View analytics

## Project Structure

```
pakkarent/
├── backend/              # Node.js API
├── frontend/             # React App
├── README.md             # Full guide
├── QUICKSTART.md         # Quick setup
├── PROJECT_SUMMARY.md    # Overview
└── STRUCTURE.md          # Code organization
```

## Technology Used

**Backend:**
- Node.js, Express.js, PostgreSQL
- JWT Authentication, bcryptjs
- CORS, Input validation

**Frontend:**
- React 18, React Router, Context API
- Axios, CSS3
- Responsive design

## Common Tasks

### Add a New Product
1. Go to Admin Panel → Manage Products
2. Click "Add New Product"
3. Fill in details (name, price, images, specs)
4. Click Save

### Update Order Status
1. Go to Admin Panel → Manage Orders
2. Find the order
3. Change status from dropdown
4. Automatically saved

### Create New User
1. Click "Sign Up" (not logged in)
2. Enter details and city
3. Account created automatically

### Modify Styling
1. Find `.css` file next to component
2. Edit CSS variables at top of `index.css`
3. Changes show immediately

## API Endpoints

All endpoints available at `http://localhost:5000/api/`

**Products:** GET /products, POST /products, PUT /products/:id, DELETE /products/:id

**Orders:** POST /orders, GET /orders/my, GET /orders (admin), PATCH /orders/:id/status

**Auth:** POST /auth/register, POST /auth/login

**Users:** GET /users/me, PUT /users/me

**Admin:** GET /admin/stats, GET /admin/users, PATCH /admin/users/:id/role

See README.md for complete API documentation.

## Troubleshooting

**Can't connect to database?**
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env
- Run schema setup again

**Port already in use?**
- Backend: Change PORT in .env
- Frontend: Change proxy in package.json

**Can't login?**
- Clear browser localStorage
- Try admin@pakkarent.com / Admin@123
- Create a new account

**Frontend not showing?**
- Make sure backend is running on port 5000
- Check browser console for errors
- Clear cache and reload

## Next Steps

1. **Explore** - Click around and test features
2. **Understand** - Read the code in key files
3. **Customize** - Modify colors, add products, change styling
4. **Deploy** - Deploy to Heroku (backend) and Vercel (frontend)
5. **Extend** - Add new features using existing patterns

## Important Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express app setup |
| `backend/src/routes/` | All API endpoints |
| `backend/database/schema.sql` | Database tables |
| `frontend/src/App.js` | React routing |
| `frontend/src/pages/` | All pages |
| `frontend/src/context/` | State management |
| `README.md` | Complete documentation |

## Helpful Commands

```bash
# Backend
cd backend && npm run dev          # Start with hot reload
npm start                           # Production start

# Frontend
cd frontend && npm start            # Start dev server
npm run build                       # Build for production

# Database
psql pakkarent                      # Connect to database
\dt                                # List tables
SELECT * FROM products;            # View products
```

## Sample Data

Database comes with:
- 4 Categories (Appliances, Event Rentals, Kids & Baby, Furniture)
- 10 Products across all categories
- 1 Admin user
- Ready for your own data

## Need More Details?

- **Setup Issues?** → See QUICKSTART.md
- **Understanding Code?** → See STRUCTURE.md
- **Full Documentation?** → See README.md
- **Project Overview?** → See PROJECT_SUMMARY.md

## Support

All documentation is in the project folder:
- README.md (300+ lines - most comprehensive)
- QUICKSTART.md (150 lines - quick setup)
- STRUCTURE.md (code organization)
- PROJECT_SUMMARY.md (complete overview)

## Ready to Build Something?

This is your foundation. You can:
- Add more products
- Integrate payment gateway
- Add email notifications
- Deploy to production
- Extend with new features

The code is organized and ready for extension!

---

**Let's get started! Run the setup commands above and explore!**

Questions? Check the documentation files or review the code - it's well-organized and commented.
