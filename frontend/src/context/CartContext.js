import React, { createContext, useContext, useState, useEffect } from 'react';
import { effectivePriceForTenure } from '../utils/pricingDisplay';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pakkarent_cart')) || []; } catch { return []; }
  });
  const [tenure, setTenure] = useState(1);

  useEffect(() => {
    localStorage.setItem('pakkarent_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQuantity = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  const getItemPrice = (product) => effectivePriceForTenure(product, tenure);

  const cartTotal = cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const depositTotal = cart.reduce((sum, item) => sum + (item.security_deposit || 0) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, depositTotal, cartCount, tenure, setTenure, getItemPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
