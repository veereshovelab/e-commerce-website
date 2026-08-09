import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Available Coupons Dictionary
  const VALID_COUPONS = {
    'SAVE10': { type: 'percent', value: 10, description: '10% OFF on all items' },
    'WELCOME20': { type: 'percent', value: 20, description: '20% OFF Welcome Bonus' },
    'FREESHIP': { type: 'fixed', value: 15, description: '$15 OFF Shipping Credit' },
    'MEGA50': { type: 'fixed', value: 50, minTotal: 200, description: '$50 OFF Orders over $200' },
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save coupon to localStorage
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('appliedCoupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const addToWishlist = (product) => {
    setWishlist(prevWishlist => {
      if (prevWishlist.find(item => item._id === product._id)) {
        return prevWishlist;
      }
      return [...prevWishlist, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prevWishlist =>
      prevWishlist.filter(item => item._id !== productId)
    );
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + ((item.discountPrice || item.price) * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[cleanCode];
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try SAVE10, WELCOME20, or FREESHIP!' };
    }
    const subtotal = getCartTotal();
    if (coupon.minTotal && subtotal < coupon.minTotal) {
      return { success: false, message: `Minimum order amount of $${coupon.minTotal} required for ${cleanCode}.` };
    }
    setAppliedCoupon({ code: cleanCode, ...coupon });
    return { success: true, message: `Coupon "${cleanCode}" applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getCartTotal();
    if (appliedCoupon.type === 'percent') {
      return (subtotal * appliedCoupon.value) / 100;
    }
    if (appliedCoupon.type === 'fixed') {
      return Math.min(appliedCoupon.value, subtotal);
    }
    return 0;
  };

  const getFinalTotal = () => {
    const subtotal = getCartTotal();
    const discount = getDiscountAmount();
    const tax = (subtotal - discount) * 0.1;
    return Math.max(0, subtotal - discount + tax);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getCartTotal,
        getCartItemsCount,
        applyCoupon,
        removeCoupon,
        getDiscountAmount,
        getFinalTotal,
        VALID_COUPONS
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

