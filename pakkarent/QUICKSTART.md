# PakkaRent - Quick Start Guide

## Get Started in 5 Minutes

### Prerequisites
- Node.js v16+
- PostgreSQL running locally

### Step 1: Database Setup (2 minutes)

```bash
# Create database
createdb pakkarent

# Import schema and seed data
psql pakkarent < backend/database/schema.sql
```

### Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env (use default values for local development)
# DATABASE_URL=postgresql://username:password@localhost:5432/pakkarent
# JWT_SECRET=your_super_secret_jwt_key_here
# CLIENT_URL=http://localhost:3000
# PORT=5000

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 3: Frontend Setup (1 minute)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will open at: `http://localhost:3000`

## Login Credentials

**Admin Account:**
- Email: `admin@pakkarent.com`
- Password: `Admin@123`

**Create a New User Account:**
- Click "Sign Up" on the login page
- Fill in your details
- Select your city (Chennai, Bangalore, or Hyderabad)

## Testing the Application

### Customer Flow
1. Login or register as a customer
2. Browse products on the home page
3. Filter by category, city, or price
4. Click on a product to view details
5. Select rental duration and add to cart
6. Click cart icon to view items
7. Proceed to checkout
8. Enter delivery address and start date
9. View your orders in "My Orders"

### Admin Flow
1. Login with admin credentials
2. Click "Admin" in navbar
3. View dashboard statistics
4. Navigate to:
   - **Manage Products:** Add/edit/delete products
   - **Manage Orders:** View and update order statuses
   - **Manage Users:** View users and change roles

## Key Features to Try

### Product Management
- Add a new product with details
- Upload images (paste JSON URLs)
- Set rental prices for different durations
- Mark products as featured

### Order Management
- View pending orders
- Update order status (confirmed, delivered, active, completed)
- Filter orders by status

### Shopping
- Filter products by price range
- Search for products
- Compare rental durations
- Add multiple items to cart
- Adjust quantities

## Sample Data Included

The schema comes with:
- 4 pre-seeded categories
- 10 sample products
- 1 admin user
- 0 regular users (you can create them)

## File Structure

```
pakkarent/
├── backend/          # Node.js + Express API
├── frontend/         # React application
├── README.md         # Full documentation
└── QUICKSTART.md     # This file
```

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql --version

# Reset database
dropdb pakkarent
createdb pakkarent
psql pakkarent < backend/database/schema.sql
```

### Frontend Not Connecting to Backend
- Verify backend is running on port 5000
- Check network tab in browser DevTools
- Clear browser cache and localStorage

## Next Steps

1. Explore the codebase
2. Try adding new products
3. Test checkout flow
4. Modify styling with CSS
5. Add new features

## Support

- Check README.md for detailed documentation
- Review code comments for implementation details
- Test API endpoints using Postman or curl

## Useful Commands

```bash
# Backend
cd backend && npm run dev      # Start with hot reload
npm start                       # Start production

# Frontend
cd frontend && npm start        # Start dev server
npm run build                   # Build for production

# Database
psql pakkarent                  # Connect to database
\dt                            # List all tables
SELECT * FROM products;        # View products
```

---

Happy coding! Explore the full-stack application and customize it as needed.
