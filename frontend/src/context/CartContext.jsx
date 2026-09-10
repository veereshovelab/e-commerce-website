import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../utils/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const VALID_COUPONS = {
    'SAVE10': { type: 'percent', value: 10, description: '10% OFF on all items', badge: 'Popular' },
    'WELCOME20': { type: 'percent', value: 20, description: '20% OFF Welcome Bonus', badge: 'New User' },
    'SUMMER30': { type: 'percent', value: 30, minTotal: 150, description: '30% OFF orders over $150', badge: 'Hot Deal' },
    'FREESHIP': { type: 'fixed', value: 15, description: '$15 OFF Shipping Credit', badge: 'Express' },
    'MEGA50': { type: 'fixed', value: 50, minTotal: 200, description: '$50 OFF Orders over $200', badge: 'Best Value' },
    'SUPER100': { type: 'fixed', value: 100, minTotal: 400, description: '$100 OFF Orders over $400', badge: 'VIP' },
  };

  // Load local storage initially
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
  }, []);

  // Fetch backend cart and wishlist when authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const syncBackendData = async () => {
      try {
        const [cartRes, wishlistRes] = await Promise.all([
          apiClient.get('/cart').catch(() => null),
          apiClient.get('/users/wishlist').catch(() => null)
        ]);

        if (cartRes?.data?.cart) {
          setCart(cartRes.data.cart);
        }
        if (wishlistRes?.data?.wishlist) {
          setWishlist(wishlistRes.data.wishlist);
        }
      } catch (err) {
        console.warn('Backend cart sync warning:', err);
      }
    };

    syncBackendData();
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

  const addToCart = async (product, quantity = 1) => {
    const token = localStorage.getItem('token');

    // Optimistic local state update
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

    if (token) {
      try {
        const response = await apiClient.post('/cart/add', {
          productId: product._id,
          quantity
        });
        if (response.data?.cart) {
          setCart(response.data.cart);
        }
      } catch (err) {
        console.warn('Could not sync addToCart to backend:', err);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');

    setCart(prevCart => prevCart.filter(item => item._id !== productId));

    if (token) {
      try {
        const response = await apiClient.delete(`/cart/${productId}`);
        if (response.data?.cart) {
          setCart(response.data.cart);
        }
      } catch (err) {
        console.warn('Could not sync removeFromCart to backend:', err);
      }
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const token = localStorage.getItem('token');

    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );

    if (token) {
      try {
        const response = await apiClient.put(`/cart/${productId}`, { quantity });
        if (response.data?.cart) {
          setCart(response.data.cart);
        }
      } catch (err) {
        console.warn('Could not sync updateCartQuantity to backend:', err);
      }
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    setCart([]);
    setAppliedCoupon(null);

    if (token) {
      try {
        await apiClient.delete('/cart/clear');
      } catch (err) {
        console.warn('Could not sync clearCart to backend:', err);
      }
    }
  };

  const addToWishlist = async (product) => {
    const token = localStorage.getItem('token');

    setWishlist(prevWishlist => {
      if (prevWishlist.find(item => item._id === product._id)) {
        return prevWishlist;
      }
      return [...prevWishlist, product];
    });

    if (token) {
      try {
        const response = await apiClient.post('/users/wishlist/add', {
          productId: product._id
        });
        if (response.data?.wishlist) {
          setWishlist(response.data.wishlist);
        }
      } catch (err) {
        console.warn('Could not sync addToWishlist to backend:', err);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem('token');

    setWishlist(prevWishlist =>
      prevWishlist.filter(item => item._id !== productId)
    );

    if (token) {
      try {
        const response = await apiClient.post('/users/wishlist/remove', {
          productId
        });
        if (response.data?.wishlist) {
          setWishlist(response.data.wishlist);
        }
      } catch (err) {
        console.warn('Could not sync removeFromWishlist to backend:', err);
      }
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const moveAllWishlistToCart = async () => {
    wishlist.forEach(item => {
      addToCart(item, 1);
    });
    setWishlist([]);
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
      return { success: false, message: 'Invalid coupon code. Try SAVE10, WELCOME20, SUMMER30, or MEGA50!' };
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

  const getSavingsTotal = () => {
    const itemDiscounts = cart.reduce((acc, item) => {
      if (item.discountPrice && item.discountPrice < item.price) {
        return acc + (item.price - item.discountPrice) * item.quantity;
      }
      return acc;
    }, 0);
    return itemDiscounts + getDiscountAmount();
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
        clearWishlist,
        moveAllWishlistToCart,
        isInWishlist,
        getCartTotal,
        getCartItemsCount,
        applyCoupon,
        removeCoupon,
        getDiscountAmount,
        getSavingsTotal,
        getFinalTotal,
        VALID_COUPONS
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
