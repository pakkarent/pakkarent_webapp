# PakkaRent - Full Stack Rental Platform

A complete full-stack web application for renting appliances, baby gear, and event items in Chennai, Bangalore, and Hyderabad.

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** for database
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 18** with Hooks
- **React Router v6** for navigation
- **Context API** for state management
- **Axios** for API calls
- **CSS3** for styling

## Features

### Customer Features
- Browse rental products by category, city, and price range
- Search functionality
- Detailed product information with specifications
- Add items to cart with quantity selection
- Choose rental duration (1, 3, 6, 12 months)
- Secure checkout with delivery address
- Order tracking and management
- User profile management
- Multiple city support (Chennai, Bangalore, Hyderabad)

### Admin Features
- Dashboard with statistics
- Product management (add, edit, delete)
- Order management with status tracking
- User management with role assignment
- Featured product management
- Stock management

## Project Structure

```
pakkarent/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── categories.js
│   │   │   ├── orders.js
│   │   │   ├── users.js
│   │   │   └── admin.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── models/
│   │       └── db.js
│   ├── database/
│   │   └── schema.sql
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Products.js
    │   │   ├── ProductDetail.js
    │   │   ├── Cart.js
    │   │   ├── Checkout.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── MyOrders.js
    │   │   ├── Profile.js
    │   │   └── admin/
    │   │       ├── AdminDashboard.js
    │   │       ├── AdminProducts.js
    │   │       ├── AdminProductForm.js
    │   │       ├── AdminOrders.js
    │   │       └── AdminUsers.js
    │   ├── components/
    │   │   └── common/
    │   │       ├── Navbar.js
    │   │       ├── Footer.js
    │   │       └── ProductCard.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   ├── CartContext.js
    │   │   └── CityContext.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

## Installation & Setup

### 1. Database Setup

Install PostgreSQL and create a database:

```bash
createdb pakkarent
```

Import the schema:

```bash
psql pakkarent < backend/database/schema.sql
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/pakkarent
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The API will run on `http://localhost:5000`

### 3. Frontend Setup

Navigate to the frontend directory (in another terminal):

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The application will open at `http://localhost:3000`

## Admin Credentials

After running the schema, you can login with:

- **Email:** admin@pakkarent.com
- **Password:** Admin@123

The password hash in the schema is pre-hashed for this demo account.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user's orders
- `GET /api/orders` - Get all orders (admin)
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/role` - Update user role

## Color Scheme

- **Primary:** #FF5722 (Orange)
- **Dark:** #1a1a2e (Navy)
- **Accent:** #4CAF50 (Green)
- **Gray Light:** #f3f4f6
- **Gray Border:** #e5e7eb

## Sample Products

The database includes sample products across all categories:

- **Appliances:** Split AC, Washing Machine, Refrigerator, Microwave
- **Event Rentals:** Baby Cradle, Party Backdrop Stand
- **Kids & Baby:** Baby Stroller, Infant Car Seat, High Chair, Play Yard
- **Furniture:** Various furniture items

## Features in Detail

### Product Management
- Filter by category, city, price range
- Search functionality
- Multiple images per product
- Detailed specifications
- Security deposit tracking
- Stock management
- Featured product highlighting

### Rental System
- Flexible rental durations (1, 3, 6, 12 months)
- Discounted pricing for longer rentals
- Security deposit calculation
- Rental start and end date tracking

### Order Management
- Shopping cart with quantity management
- Secure checkout process
- Multiple payment method support (UI prepared)
- Order status tracking
- Delivery address management

### User Features
- Secure authentication with JWT
- User profile management
- Order history
- City-based product filtering
- Persistent cart storage

## Deployment

### Backend Deployment (Heroku/Railway)

1. Create a PostgreSQL database on your hosting platform
2. Update environment variables with database credentials
3. Deploy using git push or platform CLI

```bash
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)

1. Update API endpoint in `src/services/api.js`
2. Deploy:

```bash
npm run build
# Deploy the build folder to Vercel/Netlify
```

## Future Enhancements

- Payment gateway integration (Stripe, Razorpay)
- Email notifications
- SMS notifications
- Real-time chat support
- Mobile app (React Native)
- Advanced analytics dashboard
- AI-based product recommendations
- Review and rating system
- Subscription plans
- Insurance options

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists: `createdb pakkarent`

### Port Already in Use
- Change PORT in .env for backend
- Change port in package.json proxy for frontend

### CORS Issues
- Verify CLIENT_URL in backend .env
- Check frontend proxy setting in package.json

### Authentication Issues
- Clear localStorage on the browser
- Verify JWT_SECRET is set correctly
- Check token expiration (7 days)

## Support

For issues or questions, contact: support@pakkarent.com

## License

All rights reserved. PakkaRent 2024.
