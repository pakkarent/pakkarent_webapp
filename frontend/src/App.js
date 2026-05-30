import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CityProvider } from './context/CityContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WhatsAppFab from './components/common/WhatsAppFab';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import InfoPage from './pages/InfoPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminPricing from './pages/admin/AdminPricing';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function AppContent() {
  return (
    <BrowserRouter>
      <Navbar />
      <main id="main-content"><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<InfoPage pageKey="about" />} />
        <Route path="/how-it-works" element={<InfoPage pageKey="how-it-works" />} />
        <Route path="/blog" element={<InfoPage pageKey="blog" />} />
        <Route path="/contact" element={<InfoPage pageKey="contact" />} />
        <Route path="/faq" element={<InfoPage pageKey="faq" />} />
        <Route path="/delivery-info" element={<InfoPage pageKey="delivery" />} />
        <Route path="/terms" element={<InfoPage pageKey="terms" />} />
        <Route path="/privacy" element={<InfoPage pageKey="privacy" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
      </Routes></main>
      <Footer />
      <WhatsAppFab />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CityProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </CityProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
