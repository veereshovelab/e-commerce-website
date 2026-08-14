import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCreditCard, FiSmartphone, FiGlobe, FiPocket, FiLock, FiCheck } from 'react-icons/fi';
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
    paymentMethod: 'card',
    paymentDetails: {
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      cardHolder: user?.name || '',
      upiId: '',
      selectedBank: 'HDFC Bank',
      selectedWallet: 'paytm'
    }
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

  const handlePaymentDetailChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        [name]: value
      }
    }));
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-display">Payment Method</h2>
                <span className="flex items-center space-x-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <FiLock size={12} />
                  <span>256-Bit Encrypted</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: FiCreditCard },
                  { id: 'upi', label: 'UPI / Instant Pay', icon: FiSmartphone },
                  { id: 'netbanking', label: 'Net Banking', icon: FiGlobe },
                  { id: 'wallet', label: 'Digital Wallet', icon: FiPocket }
                ].map(({ id, label, icon: Icon }) => (
                  <label
                    key={id}
                    onClick={() => setFormData({ ...formData, paymentMethod: id })}
                    className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.paymentMethod === id
                        ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500'
                        : isDarkMode ? 'border-zinc-800 hover:bg-zinc-800/50' : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={id}
                      checked={formData.paymentMethod === id}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-4 h-4 text-brand-500 focus:ring-brand-500"
                    />
                    <Icon size={18} className={formData.paymentMethod === id ? 'text-brand-500' : 'text-zinc-400'} />
                    <span className="text-xs font-semibold">{label}</span>
                  </label>
                ))}
              </div>

              {/* Method Details Sub-panel */}
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-zinc-500 dark:text-zinc-400">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardHolder"
                        placeholder="John Doe"
                        value={formData.paymentDetails.cardHolder}
                        onChange={handlePaymentDetailChange}
                        className={`w-full px-3 py-2 rounded-lg text-sm border ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-300'} outline-none focus:border-brand-500`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-zinc-500 dark:text-zinc-400">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="4532 •••• •••• 8892"
                        maxLength="19"
                        value={formData.paymentDetails.cardNumber}
                        onChange={handlePaymentDetailChange}
                        className={`w-full px-3 py-2 rounded-lg text-sm border font-mono ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-300'} outline-none focus:border-brand-500`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-zinc-500 dark:text-zinc-400">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          placeholder="12/28"
                          maxLength="5"
                          value={formData.paymentDetails.cardExpiry}
                          onChange={handlePaymentDetailChange}
                          className={`w-full px-3 py-2 rounded-lg text-sm border font-mono ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-300'} outline-none focus:border-brand-500`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-zinc-500 dark:text-zinc-400">CVV</label>
                        <input
                          type="password"
                          name="cardCvv"
                          placeholder="•••"
                          maxLength="4"
                          value={formData.paymentDetails.cardCvv}
                          onChange={handlePaymentDetailChange}
                          className={`w-full px-3 py-2 rounded-lg text-sm border font-mono ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-300'} outline-none focus:border-brand-500`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'upi' && (
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-zinc-500 dark:text-zinc-400">Virtual Payment Address (UPI ID)</label>
                    <input
                      type="text"
                      name="upiId"
                      placeholder="username@okaxis / mobile@paytm"
                      value={formData.paymentDetails.upiId}
                      onChange={handlePaymentDetailChange}
                      className={`w-full px-3 py-2 rounded-lg text-sm border ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-300'} outline-none focus:border-brand-500`}
                    />
                    <div className="flex items-center space-x-1.5 mt-3">
                      <span className="text-[10px] text-zinc-400 font-semibold">Quick handles:</span>
                      {['@okaxis', '@ybl', '@paytm', '@gpay'].map(handle => (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            paymentDetails: {
                              ...prev.paymentDetails,
                              upiId: (prev.paymentDetails.upiId.split('@')[0] || 'user') + handle
                            }
                          }))}
                          className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-md hover:bg-brand-500 hover:text-white transition font-mono"
                        >
                          {handle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'netbanking' && (
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-zinc-500 dark:text-zinc-400">Select Preferred Bank</label>
                    <select
                      name="selectedBank"
                      value={formData.paymentDetails.selectedBank}
                      onChange={handlePaymentDetailChange}
                      className={`w-full px-3 py-2 rounded-lg text-sm border ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-300'} outline-none focus:border-brand-500`}
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Chase Bank">Chase Bank</option>
                      <option value="Bank of America">Bank of America</option>
                    </select>
                  </div>
                )}

                {formData.paymentMethod === 'wallet' && (
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-zinc-500 dark:text-zinc-400">Choose Wallet Provider</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'paytm', name: 'Paytm Wallet' },
                        { id: 'phonepe', name: 'PhonePe' },
                        { id: 'amazonpay', name: 'Amazon Pay' },
                        { id: 'paypal', name: 'PayPal' }
                      ].map(w => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            paymentDetails: { ...prev.paymentDetails, selectedWallet: w.id }
                          }))}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left flex items-center justify-between transition ${
                            formData.paymentDetails.selectedWallet === w.id
                              ? 'border-brand-500 bg-brand-500/10 text-brand-500 font-bold'
                              : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300'
                          }`}
                        >
                          <span>{w.name}</span>
                          {formData.paymentDetails.selectedWallet === w.id && <FiCheck size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
