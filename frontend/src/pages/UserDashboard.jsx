import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiUser, FiShoppingBag, FiHeart, FiChevronRight, FiPackage, FiClock, FiShoppingCart, FiMapPin, FiSave } from 'react-icons/fi';
import apiClient from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { wishlist, addToCart } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    savedAddress: user?.savedAddress || {
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        savedAddress: user.savedAddress || {
          addressLine1: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'US'
        }
      });
    }
  }, [user]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUser(profileForm);
    toast.success('Profile and default address saved successfully!');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/orders');
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.info('Logged out successfully');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className={`md:col-span-1 border rounded-3xl p-6 h-fit shadow-premium ${
          isDarkMode ? 'bg-darkCard/40 border-white/5 backdrop-blur-md shadow-glass-dark' : 'bg-white border-zinc-200'
        }`}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-brand-500 to-indigo-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-extrabold text-2xl shadow-glow-primary">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h2 className="text-lg font-bold font-display">{user?.name}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-500 border border-brand-500/20">
              {user?.role || 'Member'} Account
            </span>
          </div>

          <nav className="space-y-1.5 mb-6">
            {[
              { id: 'orders', label: 'My Orders', icon: FiShoppingBag },
              { id: 'profile', label: 'Profile & Address', icon: FiUser },
              { id: 'wishlist', label: 'Saved Wishlist', icon: FiHeart }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === id
                    ? 'bg-brand-500 text-white shadow-glow-primary'
                    : isDarkMode ? 'hover:bg-zinc-800/60 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-semibold transition"
          >
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold font-display">My Orders</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Click any order to view live tracking and download receipts</p>
                </div>
                <span className="text-xs font-mono font-bold text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                  {orders.length} Total Orders
                </span>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16 text-xs text-zinc-400">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mr-3" />
                  <span>Loading order history...</span>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      to={`/orders/${order.orderId || order._id}`}
                      key={order._id}
                      className={`block group border rounded-2xl p-5 shadow-premium transition-all hover:-translate-y-0.5 ${
                        isDarkMode
                          ? 'bg-darkCard/40 border-white/5 backdrop-blur-md hover:border-brand-500/40 shadow-glass-dark'
                          : 'bg-white border-zinc-200 hover:border-brand-500/40'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
                            <FiPackage size={18} />
                          </div>
                          <div>
                            <p className="font-bold font-mono text-base group-hover:text-brand-500 transition">
                              {order.orderId}
                            </p>
                            <p className="text-xs text-zinc-400 flex items-center space-x-1 mt-0.5">
                              <FiClock size={12} />
                              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            order.orderStatus === 'delivered' ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20' :
                            order.orderStatus === 'shipped' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' :
                            order.orderStatus === 'processing' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20' :
                            'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20'
                          }`}>
                            {order.orderStatus || 'Processing'}
                          </span>
                          <FiChevronRight size={18} className="text-zinc-400 group-hover:text-brand-500 group-hover:translate-x-1 transition" />
                        </div>
                      </div>

                      {/* Product Preview Thumbnails if present */}
                      {order.products && order.products.length > 0 && (
                        <div className="flex items-center space-x-2 py-2 border-t border-b dark:border-white/5 border-zinc-100 my-3">
                          {order.products.slice(0, 4).map((p, idx) => (
                            <img
                              key={idx}
                              src={p.image || p.product?.thumbnail}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg border dark:border-zinc-800"
                            />
                          ))}
                          {order.products.length > 4 && (
                            <span className="text-xs text-zinc-400 font-semibold pl-1">
                              +{order.products.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-zinc-400">Total Paid</span>
                        <span className="font-bold font-mono text-base text-brand-500">
                          ${(order.orderSummary?.totalPrice || order.totalPrice || 0).toFixed(2)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-16 rounded-2xl border ${isDarkMode ? 'border-zinc-850 bg-zinc-900/20' : 'border-zinc-200 bg-zinc-50'}`}>
                  <FiShoppingBag className="mx-auto text-zinc-400 mb-3" size={32} />
                  <p className="text-sm font-semibold text-zinc-400">No orders found yet</p>
                  <Link
                    to="/products"
                    className="inline-block mt-4 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-glow-primary transition"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold font-display">Profile & Address Settings</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Manage your personal details and default checkout shipping address</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className={`border rounded-2xl p-6 shadow-premium ${
                  isDarkMode ? 'bg-darkCard/40 border-white/5 backdrop-blur-md' : 'bg-white border-zinc-200'
                }`}>
                  <h3 className="text-base font-bold font-display mb-4 flex items-center space-x-2">
                    <FiUser size={18} className="text-brand-500" />
                    <span>Personal Information</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition focus:ring-1 focus:ring-brand-500 ${
                          isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Email Address (Read Only)</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-400 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition focus:ring-1 focus:ring-brand-500 ${
                          isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Default Shipping Address */}
                <div className={`border rounded-2xl p-6 shadow-premium ${
                  isDarkMode ? 'bg-darkCard/40 border-white/5 backdrop-blur-md' : 'bg-white border-zinc-200'
                }`}>
                  <h3 className="text-base font-bold font-display mb-4 flex items-center space-x-2">
                    <FiMapPin size={18} className="text-brand-500" />
                    <span>Default Shipping Address</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Street Address</label>
                      <input
                        type="text"
                        placeholder="123 Innovation Way, Suite 400"
                        value={profileForm.savedAddress?.addressLine1 || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          savedAddress: { ...prev.savedAddress, addressLine1: e.target.value }
                        }))}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition focus:ring-1 focus:ring-brand-500 ${
                          isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">City</label>
                      <input
                        type="text"
                        placeholder="San Francisco"
                        value={profileForm.savedAddress?.city || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          savedAddress: { ...prev.savedAddress, city: e.target.value }
                        }))}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition focus:ring-1 focus:ring-brand-500 ${
                          isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">State / Province</label>
                      <input
                        type="text"
                        placeholder="CA"
                        value={profileForm.savedAddress?.state || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          savedAddress: { ...prev.savedAddress, state: e.target.value }
                        }))}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition focus:ring-1 focus:ring-brand-500 ${
                          isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">ZIP / Postal Code</label>
                      <input
                        type="text"
                        placeholder="94105"
                        value={profileForm.savedAddress?.zipCode || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          savedAddress: { ...prev.savedAddress, zipCode: e.target.value }
                        }))}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition focus:ring-1 focus:ring-brand-500 ${
                          isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Country</label>
                      <select
                        value={profileForm.savedAddress?.country || 'US'}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          savedAddress: { ...prev.savedAddress, country: e.target.value }
                        }))}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition focus:ring-1 focus:ring-brand-500 ${
                          isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold shadow-glow-primary transition flex items-center space-x-2 text-xs"
                >
                  <FiSave size={16} />
                  <span>Save Profile & Address</span>
                </button>
              </form>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display">Saved Wishlist ({wishlist.length})</h2>
                <Link to="/wishlist" className="text-xs font-semibold text-brand-500 hover:underline">
                  View Full Wishlist &rarr;
                </Link>
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((product) => (
                    <div
                      key={product._id}
                      className={`border rounded-2xl overflow-hidden shadow-premium flex flex-col justify-between transition hover:-translate-y-1 ${
                        isDarkMode ? 'bg-darkCard/40 border-white/5' : 'bg-white border-zinc-200'
                      }`}
                    >
                      <div>
                        <Link to={`/products/${product._id}`} className="block aspect-[4/3] bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
                          <img
                            src={product.thumbnail || product.images?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                          />
                        </Link>
                        <div className="p-4">
                          <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1">{product.brand || 'ShopSphere'}</p>
                          <Link to={`/products/${product._id}`} className="font-semibold text-sm line-clamp-1 hover:text-brand-500 transition">
                            {product.name}
                          </Link>
                          <p className="font-bold text-sm text-brand-500 mt-1">
                            ${product.discountPrice || product.price}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                            toast.success(`Added ${product.name} to cart!`);
                          }}
                          className="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-glow-primary flex items-center justify-center space-x-1.5 transition"
                        >
                          <FiShoppingCart size={14} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-16 rounded-2xl border ${isDarkMode ? 'border-zinc-850 bg-zinc-900/20' : 'border-zinc-200 bg-zinc-50'}`}>
                  <FiHeart className="mx-auto text-zinc-400 mb-3" size={32} />
                  <p className="text-sm font-semibold text-zinc-400">Your wishlist is currently empty</p>
                  <Link
                    to="/products"
                    className="inline-block mt-4 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-glow-primary transition"
                  >
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
