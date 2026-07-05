import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CityProvider } from './context/CityContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import WhatsAppFab from './components/common/WhatsAppFab';
import CityPickerModal from './components/common/CityPickerModal';
import PageLoader from './components/common/PageLoader';
import AdminSeo from './components/common/AdminSeo';

const Home = React.lazy(() => import('./pages/Home'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const ProductIdRedirect = React.lazy(() => import('./pages/ProductIdRedirect'));
const LegacyProductRoute = React.lazy(() => import('./pages/LegacyProductRoute'));
const LegacyStoreRoute = React.lazy(() => import('./pages/LegacyStoreRoute'));
const NotFoundRedirect = React.lazy(() => import('./pages/NotFoundRedirect'));
const ProductsSlugRouter = React.lazy(() => import('./pages/ProductsSlugRouter'));
const CityLanding = React.lazy(() => import('./pages/CityLanding'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'));
const MyOrders = React.lazy(() => import('./pages/MyOrders'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const InfoPage = React.lazy(() => import('./pages/InfoPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminProductForm = React.lazy(() => import('./pages/admin/AdminProductForm'));
const AdminPricing = React.lazy(() => import('./pages/admin/AdminPricing'));
const AdminCategories = React.lazy(() => import('./pages/admin/AdminCategories'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return (
    <>
      <AdminSeo />
      {children}
    </>
  );
};

function AppContent() {
  return (
    <BrowserRouter>
      <CityProvider>
      <ScrollToTop />
      <CityPickerModal />
      <Navbar />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chennai" element={<CityLanding />} />
        <Route path="/bangalore" element={<CityLanding />} />
        <Route path="/hyderabad" element={<CityLanding />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:a/:b" element={<ProductsSlugRouter />} />
        <Route path="/rent/:slug/:city" element={<ProductDetail />} />
        <Route path="/store/*" element={<LegacyStoreRoute />} />
        <Route path="/:prefix/products/:category/:filename" element={<LegacyProductRoute />} />
        <Route path="/products/:id" element={<ProductIdRedirect />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<InfoPage pageKey="about" />} />
        <Route path="/how-it-works" element={<InfoPage pageKey="how-it-works" />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<InfoPage pageKey="contact" />} />
        <Route path="/faq" element={<InfoPage pageKey="faq" />} />
        <Route path="/delivery-info" element={<InfoPage pageKey="delivery" />} />
        <Route path="/terms" element={<InfoPage pageKey="terms" />} />
        <Route path="/privacy" element={<InfoPage pageKey="privacy" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
        <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/pricing" element={<AdminRoute><AdminPricing /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="*" element={<NotFoundRedirect />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFab />
      </CityProvider>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
