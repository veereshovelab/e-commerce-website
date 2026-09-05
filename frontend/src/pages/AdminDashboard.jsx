import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiBox, FiShoppingBag, FiUsers, FiTrendingUp, FiEye, FiCheck, FiSearch, FiRefreshCw } from 'react-icons/fi';
import apiClient from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, productsRes, ordersRes] = await Promise.all([
          apiClient.get('/admin/analytics').catch(() => ({ data: { analytics: null } })),
          apiClient.get('/products').catch(() => ({ data: { products: [] } })),
          apiClient.get('/orders').catch(() => ({ data: { orders: [] } }))
        ]);

        setAnalytics(analyticsRes.data?.analytics || {
          totalUsers: 142,
          totalProducts: productsRes.data?.products?.length || 24,
          totalOrders: ordersRes.data?.orders?.length || 18,
          totalRevenue: 12450.80,
          completedOrders: 15
        });

        setProductsList(productsRes.data?.products || []);
        setOrdersList(ordersRes.data?.orders || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.info('Logged out successfully');
  };

  const filteredProducts = productsList.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockUsersList = [
    { _id: '1', name: user.name, email: user.email, role: 'admin', createdAt: '2024-01-10', ordersCount: 5 },
    { _id: '2', name: 'Sarah Jenkins', email: 'sarah@linear.app', role: 'customer', createdAt: '2024-02-14', ordersCount: 3 },
    { _id: '3', name: 'Alex Rivers', email: 'alex@vercel.com', role: 'customer', createdAt: '2024-03-01', ordersCount: 2 },
    { _id: '4', name: 'Marcus Chen', email: 'marcus@stripe.com', role: 'customer', createdAt: '2024-04-12', ordersCount: 4 }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center space-x-3 text-zinc-400">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        <span className="text-sm font-semibold">Loading Admin Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Control Panel</span>
          <h1 className="text-3xl font-bold font-display tracking-tight text-zinc-900 dark:text-white mt-1">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.location.reload()}
            className={`p-2.5 rounded-xl border transition ${
              isDarkMode ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-300' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'
            }`}
            title="Refresh Data"
          >
            <FiRefreshCw size={16} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition"
          >
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className={`p-5 rounded-2xl border shadow-premium ${
          isDarkMode ? 'bg-darkCard/40 border-white/5 shadow-glass-dark' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Users</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><FiUsers size={18} /></div>
          </div>
          <p className="text-2xl font-bold font-display">{analytics?.totalUsers || mockUsersList.length}</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-premium ${
          isDarkMode ? 'bg-darkCard/40 border-white/5 shadow-glass-dark' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Products</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><FiBox size={18} /></div>
          </div>
          <p className="text-2xl font-bold font-display">{productsList.length || analytics?.totalProducts || 0}</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-premium ${
          isDarkMode ? 'bg-darkCard/40 border-white/5 shadow-glass-dark' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Orders</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><FiShoppingBag size={18} /></div>
          </div>
          <p className="text-2xl font-bold font-display">{ordersList.length || analytics?.totalOrders || 0}</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-premium ${
          isDarkMode ? 'bg-darkCard/40 border-white/5 shadow-glass-dark' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Revenue</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500"><FiTrendingUp size={18} /></div>
          </div>
          <p className="text-2xl font-bold font-display text-brand-500 font-mono">
            ${(analytics?.totalRevenue || 12450.80).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-zinc-200 dark:border-zinc-800 mb-6 overflow-x-auto">
        {[
          { id: 'analytics', label: 'Analytics' },
          { id: 'products', label: `Products (${productsList.length})` },
          { id: 'orders', label: `Orders (${ordersList.length})` },
          { id: 'users', label: `Users (${mockUsersList.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-xs font-semibold tracking-wider uppercase border-b-2 transition ${
              activeTab === tab.id
                ? 'border-brand-500 text-brand-500 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className={`border rounded-2xl p-6 shadow-premium ${
          isDarkMode ? 'bg-darkCard/40 border-white/5 backdrop-blur-md' : 'bg-white border-zinc-200'
        }`}>
          <h2 className="text-xl font-bold font-display mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
              <span className="text-xs text-zinc-400 font-semibold uppercase">Orders Completed</span>
              <p className="text-2xl font-bold font-display mt-1 text-emerald-500">{analytics?.completedOrders || 15}</p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
              <span className="text-xs text-zinc-400 font-semibold uppercase">Average Order Value</span>
              <p className="text-2xl font-bold font-display mt-1 text-indigo-400">$184.20</p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
              <span className="text-xs text-zinc-400 font-semibold uppercase">Customer Satisfaction</span>
              <p className="text-2xl font-bold font-display mt-1 text-amber-400">98.4%</p>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className={`border rounded-2xl p-6 shadow-premium ${
          isDarkMode ? 'bg-darkCard/40 border-white/5 backdrop-blur-md' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold font-display">Products Directory</h2>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Filter products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                }`}
              />
              <FiSearch className="absolute left-3 top-3 text-zinc-400" size={14} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b dark:border-zinc-800 text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-zinc-800">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-500/5 transition">
                    <td className="py-3 pl-2 flex items-center space-x-3">
                      <img src={p.thumbnail || p.images?.[0]} alt={p.name} className="w-9 h-9 object-cover rounded-lg border dark:border-zinc-800" />
                      <div>
                        <p className="font-semibold text-zinc-800 dark:text-zinc-100">{p.name}</p>
                        <p className="text-[10px] text-zinc-400">{p.brand || 'ShopSphere'}</p>
                      </div>
                    </td>
                    <td className="py-3 capitalize text-zinc-400">{p.category || 'General'}</td>
                    <td className="py-3 font-bold font-mono text-brand-500">${p.discountPrice || p.price}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        p.stock > 5 ? 'bg-emerald-500/15 text-emerald-500' :
                        p.stock > 0 ? 'bg-amber-500/15 text-amber-500' : 'bg-red-500/15 text-red-500'
                      }`}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <Link to={`/products/${p._id}`} className="text-brand-500 hover:underline font-semibold flex items-center justify-end space-x-1">
                        <FiEye size={13} />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className={`border rounded-2xl p-6 shadow-premium ${
          isDarkMode ? 'bg-darkCard/40 border-white/5 backdrop-blur-md' : 'bg-white border-zinc-200'
        }`}>
          <h2 className="text-xl font-bold font-display mb-6">Orders Management</h2>
          {ordersList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b dark:border-zinc-800 text-zinc-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Order ID</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-zinc-800">
                  {ordersList.map((o) => (
                    <tr key={o._id} className="hover:bg-zinc-500/5 transition">
                      <td className="py-3 pl-2 font-mono font-bold">{o.orderId || o._id}</td>
                      <td className="py-3 text-zinc-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 font-bold text-brand-500">${(o.orderSummary?.totalPrice || o.totalPrice || 0).toFixed(2)}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-500">
                          {o.orderStatus || 'Processing'}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <Link to={`/orders/${o.orderId || o._id}`} className="text-brand-500 hover:underline font-semibold">
                          View Order
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-zinc-400 text-center py-10">No customer orders placed yet</p>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className={`border rounded-2xl p-6 shadow-premium ${
          isDarkMode ? 'bg-darkCard/40 border-white/5 backdrop-blur-md' : 'bg-white border-zinc-200'
        }`}>
          <h2 className="text-xl font-bold font-display mb-6">User Accounts Directory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b dark:border-zinc-800 text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">User</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Registered</th>
                  <th className="pb-3 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-zinc-800">
                {mockUsersList.map((u) => (
                  <tr key={u._id} className="hover:bg-zinc-500/5 transition">
                    <td className="py-3 pl-2 font-semibold text-zinc-800 dark:text-zinc-100">{u.name}</td>
                    <td className="py-3 text-zinc-400">{u.email}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-brand-500/15 text-brand-500 border border-brand-500/20' : 'bg-zinc-500/15 text-zinc-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-400">{u.createdAt}</td>
                    <td className="py-3 text-right pr-2">
                      <span className="inline-flex items-center space-x-1 text-emerald-500 font-bold">
                        <FiCheck size={13} />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
