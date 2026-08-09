import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft, FiTag, FiCheck, FiX } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    getFinalTotal,
    VALID_COUPONS
  } = useCart();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      toast.success(res.message);
      setCouponInput('');
    } else {
      toast.error(res.message);
    }
  };

  const handlePresetClick = (code) => {
    const res = applyCoupon(code);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>Add some products to get started!</p>
        <Link to="/products" className="inline-block bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold shadow-glow-primary transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const discount = getDiscountAmount();
  const tax = (subtotal - discount) * 0.1;
  const finalTotal = getFinalTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-brand-500 hover:text-brand-600 mb-8 font-medium">
        <FiArrowLeft />
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold mb-8 font-display">Shopping Cart ({getCartItemsCount()} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className={`${isDarkMode ? 'bg-zinc-850 border-zinc-800' : 'bg-white border-zinc-200'} border rounded-2xl p-4 flex space-x-4 shadow-sm`}
            >
              {/* Image */}
              <img
                src={item.thumbnail || item.images?.[0]}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl border dark:border-zinc-700"
              />

              {/* Details */}
              <div className="flex-1">
                <Link to={`/products/${item._id}`} className="font-semibold hover:text-brand-500 transition line-clamp-1">
                  {item.name}
                </Link>
                <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} uppercase mt-0.5`}>{item.brand}</p>
                <p className="font-bold text-lg mt-2 text-brand-500">
                  ${(item.discountPrice || item.price).toFixed(2)}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center border rounded-xl overflow-hidden h-fit self-center dark:border-zinc-700">
                <button
                  onClick={() => updateCartQuantity(item._id, Math.max(1, item.quantity - 1))}
                  className="px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateCartQuantity(item._id, Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-12 text-center border-0 focus:outline-none text-sm font-bold ${isDarkMode ? 'bg-zinc-850' : 'bg-white'}`}
                />
                <button
                  onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                  className="px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right flex flex-col justify-between items-end">
                <p className="font-bold text-lg">
                  ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => {
                    removeFromCart(item._id);
                    toast.info('Item removed from cart');
                  }}
                  className="text-red-500 hover:text-red-600 p-1 rounded-lg transition"
                  title="Remove item"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="space-y-4">
          <div className={`${isDarkMode ? 'bg-zinc-850 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} border rounded-2xl p-6 shadow-sm`}>
            <h2 className="text-xl font-bold mb-4 font-display">Order Summary</h2>

            {/* Promo Code Input Box */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">
                Promo Code / Coupon
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-xs font-semibold">
                  <div className="flex items-center space-x-2">
                    <FiCheck size={16} />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied</span>
                  </div>
                  <button
                    onClick={() => {
                      removeCoupon();
                      toast.info('Coupon removed');
                    }}
                    className="p-1 hover:bg-green-500/20 rounded-lg text-red-500"
                    title="Remove Coupon"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. SAVE10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className={`flex-1 px-3 py-2 text-xs rounded-xl border outline-none font-mono uppercase ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white text-xs font-bold rounded-xl transition"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Available Coupons Chips */}
              <div className="mt-3">
                <p className="text-[10px] text-zinc-400 font-semibold mb-1.5 flex items-center space-x-1">
                  <FiTag size={12} />
                  <span>Available Promo Codes:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(VALID_COUPONS).map((code) => (
                    <button
                      key={code}
                      onClick={() => handlePresetClick(code)}
                      className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md border transition ${
                        appliedCoupon?.code === code
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'border-zinc-300 dark:border-zinc-700 hover:border-brand-500 text-zinc-600 dark:text-zinc-300'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 border-t border-b py-4 dark:border-zinc-700 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Estimated Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mt-4 mb-6">
              <span>Total</span>
              <span className="text-brand-500">${finalTotal.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl text-center block mb-3 shadow-glow-primary transition"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={() => {
                clearCart();
                toast.info('Cart cleared');
              }}
              className={`w-full border ${isDarkMode ? 'border-zinc-700 hover:bg-red-500/10 hover:border-red-500/30' : 'border-zinc-300 hover:bg-red-50'} py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-red-500 transition`}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
