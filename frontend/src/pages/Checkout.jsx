import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import apiClient from '../utils/api';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, appliedCoupon, getDiscountAmount, getFinalTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: {
      fullName: user?.name || '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    paymentMethod: 'card'
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>You need to sign in to checkout.</p>
        <button onClick={() => navigate('/login')} className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold shadow-glow-primary">
          Sign In
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>Add products before checking out.</p>
        <button onClick={() => navigate('/products')} className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold shadow-glow-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const discount = getDiscountAmount();
  const tax = (subtotal - discount) * 0.1;
  const total = getFinalTotal();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      shippingAddress: {
        ...formData.shippingAddress,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const orderData = {
        products: cart.map(item => ({
          product: item._id,
          name: item.name,
          image: item.thumbnail || item.images?.[0],
          price: item.discountPrice || item.price,
          quantity: item.quantity
        })),
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.shippingAddress,
        orderSummary: {
          subtotal,
          discount,
          appliedCoupon: appliedCoupon?.code || null,
          tax,
          totalPrice: total
        },
        paymentMethod: formData.paymentMethod
      };

      const response = await apiClient.post('/orders', orderData);
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/cart')} className="flex items-center space-x-2 text-brand-500 hover:text-brand-600 mb-8 font-medium">
        <FiArrowLeft />
        <span>Back to Cart</span>
      </button>

      <h1 className="text-3xl font-bold mb-8 font-display">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div className={`${isDarkMode ? 'bg-zinc-850 border-zinc-800' : 'bg-white border-zinc-200'} border rounded-2xl p-6 shadow-sm`}>
              <h2 className="text-xl font-bold mb-4 font-display">Shipping Address</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.shippingAddress.fullName}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-300'} focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.shippingAddress.phoneNumber}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-300'} focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Address Line 1</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.shippingAddress.addressLine1}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-300'} focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.shippingAddress.addressLine2}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-300'} focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.shippingAddress.city}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-300'} focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.shippingAddress.state}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-300'} focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.shippingAddress.zipCode}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-300'} focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.shippingAddress.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-300'} focus:outline-none focus:ring-1 focus:ring-brand-500`}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className={`${isDarkMode ? 'bg-zinc-850 border-zinc-800' : 'bg-white border-zinc-200'} border rounded-2xl p-6 shadow-sm`}>
              <h2 className="text-xl font-bold mb-4 font-display">Payment Method</h2>
              <div className="space-y-3">
                {['card', 'upi', 'netbanking', 'wallet'].map((method) => (
                  <label key={method} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-4 h-4 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="capitalize text-sm font-semibold">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-zinc-400 text-white font-bold py-3.5 rounded-xl shadow-glow-primary transition"
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className={`${isDarkMode ? 'bg-zinc-850 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} border rounded-2xl p-6 h-fit shadow-sm`}>
          <h2 className="text-xl font-bold mb-4 font-display">Order Summary</h2>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="truncate max-w-[180px]">{item.name} <strong className="text-zinc-400">x{item.quantity}</strong></span>
                <span className="font-medium">${((item.discountPrice || item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className={`border-t ${isDarkMode ? 'border-zinc-700' : 'border-zinc-300'} pt-4 space-y-2 text-sm`}>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                <span>Coupon ({appliedCoupon?.code})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t dark:border-zinc-700">
              <span>Total</span>
              <span className="text-brand-500">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
