import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { effectivePriceForTenure } from '../utils/pricingDisplay';
import {
  isMonthlyRentalProduct,
  rentalDaysInclusive,
  MIXED_CART_MSG,
  todayYMD,
  addDaysYMD,
} from '../utils/rentalModel';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const CART_KEY = 'pakkarent_cart';
const RENTAL_DATES_KEY = 'pakkarent_rental_dates';

function loadCartFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function loadInitialRentalDates(cart) {
  if (!cart.length || cart.every(isMonthlyRentalProduct)) {
    return { rentStart: '', rentEnd: '' };
  }
  try {
    const r = JSON.parse(localStorage.getItem(RENTAL_DATES_KEY) || '{}');
    const rs = r.rentStart || todayYMD();
    const re = r.rentEnd || addDaysYMD(rs, 1);
    return { rentStart: rs, rentEnd: re };
  } catch {
    const rs = todayYMD();
    return { rentStart: rs, rentEnd: addDaysYMD(rs, 1) };
  }
}

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState(() => loadCartFromStorage());
  const [tenure, setTenure] = useState(1);
  const [rentStart, setRentStart] = useState(() => {
    const c = loadCartFromStorage();
    return loadInitialRentalDates(c).rentStart;
  });
  const [rentEnd, setRentEnd] = useState(() => {
    const c = loadCartFromStorage();
    return loadInitialRentalDates(c).rentEnd;
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (cart.length && !cart.every(isMonthlyRentalProduct)) {
      localStorage.setItem(RENTAL_DATES_KEY, JSON.stringify({ rentStart, rentEnd }));
    }
  }, [cart, rentStart, rentEnd]);

  const resetRentalFields = useCallback(() => {
    setTenure(1);
    setRentStart('');
    setRentEnd('');
    try {
      localStorage.removeItem(RENTAL_DATES_KEY);
    } catch { /* ignore */ }
  }, []);

  const getItemPrice = useCallback((product) => {
    if (isMonthlyRentalProduct(product)) {
      return effectivePriceForTenure(product, tenure);
    }
    const days = rentalDaysInclusive(rentStart, rentEnd);
    if (days < 1) return 0;
    return Number(product.monthly_price) * days;
  }, [tenure, rentStart, rentEnd]);

  const addToCart = useCallback(
    (product, qty = 1, options = {}) => {
      const quantity = Math.max(1, Number(qty) || 1);
      const incomingMonthly = isMonthlyRentalProduct(product);
      let blocked = false;

      setCart((prev) => {
        if (prev.length > 0) {
          const existingMonthly = isMonthlyRentalProduct(prev[0]);
          if (existingMonthly !== incomingMonthly) {
            blocked = true;
            return prev;
          }
        }

        const exists = prev.find((i) => i.id === product.id);
        if (!exists && !incomingMonthly) {
          const rs = options.rentStart || todayYMD();
          const re = options.rentEnd || addDaysYMD(rs, 1);
          queueMicrotask(() => {
            setRentStart(rs);
            setRentEnd(re);
          });
        }

        if (exists) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { ...product, quantity }];
      });

      if (blocked) {
        if (showToast) showToast(MIXED_CART_MSG, { type: 'error' });
        return;
      }
      if (showToast) {
        const label = product?.name ? `${product.name} added to cart` : 'Added to cart';
        showToast(label, { type: 'success' });
      }
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (id) => {
      setCart((prev) => {
        const next = prev.filter((i) => i.id !== id);
        if (next.length === 0) resetRentalFields();
        return next;
      });
    },
    [resetRentalFields]
  );

  const updateQuantity = useCallback(
    (id, qty) => {
      if (qty < 1) {
        removeFromCart(id);
        return;
      }
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    resetRentalFields();
  }, [resetRentalFields]);

  const cartTotal = cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const depositTotal = cart.reduce((sum, item) => sum + (item.security_deposit || 0) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        depositTotal,
        cartCount,
        tenure,
        setTenure,
        rentStart,
        setRentStart,
        rentEnd,
        setRentEnd,
        getItemPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
