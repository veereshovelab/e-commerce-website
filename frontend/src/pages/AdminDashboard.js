import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import apiClient from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await apiClient.get('/admin/analytics');
        setAnalytics(response.data.analytics);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.info('Logged out successfully');
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-6`}>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
          <p className="text-3xl font-bold">{analytics?.totalUsers || 0}</p>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-green-50 border-green-200'} border rounded-lg p-6`}>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Products</p>
          <p className="text-3xl font-bold">{analytics?.totalProducts || 0}</p>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-6`}>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</p>
          <p className="text-3xl font-bold">{analytics?.totalOrders || 0}</p>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-red-50 border-red-200'} border rounded-lg p-6`}>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
          <p className="text-3xl font-bold">${analytics?.totalRevenue?.toFixed(2) || 0}</p>
        </div>
      </div>

      <div className="tabs flex space-x-4 mb-6">
        {['analytics', 'products', 'orders', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : `${isDarkMode ? 'bg-gray-800 text-gray-300 hover:text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'analytics' && (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
          <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Orders Summary</h3>
              <p className="text-lg">Total Orders: {analytics?.totalOrders}</p>
              <p className="text-lg">Completed Orders: {analytics?.completedOrders}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Revenue</h3>
              <p className="text-lg">Total Revenue: ${analytics?.totalRevenue?.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
          <h2 className="text-2xl font-bold mb-4">Top Products</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Product management features coming soon...</p>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
          <h2 className="text-2xl font-bold mb-4">Orders Management</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Order management features coming soon...</p>
        </div>
      )}

      {activeTab === 'users' && (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
          <h2 className="text-2xl font-bold mb-4">Users Management</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>User management features coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
