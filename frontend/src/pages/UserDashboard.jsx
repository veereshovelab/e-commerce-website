import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiShoppingBag, FiHeart } from 'react-icons/fi';
import apiClient from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className={`md:col-span-1 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user?.email}</p>
          </div>

          <nav className="space-y-2 mb-6">
            {[
              { id: 'orders', label: 'My Orders', icon: FiShoppingBag },
              { id: 'profile', label: 'Profile', icon: FiUser },
              { id: 'wishlist', label: 'Wishlist', icon: FiHeart }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  activeTab === id
                    ? 'bg-blue-600 text-white'
                    : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Orders</h2>
              {loading ? (
                <p>Loading...</p>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-lg">{order.orderId}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="font-bold">${order.orderSummary.totalPrice.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No orders yet</p>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Profile</h2>
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <p className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <p className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <p className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Wishlist ({wishlist.length})</h2>
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {wishlist.map((product) => (
                    <div
                      key={product._id}
                      className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden`}
                    >
                      <img
                        src={product.thumbnail || product.images?.[0]}
                        alt={product.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        <p className="font-semibold">{product.name}</p>
                        <p className="font-bold text-blue-600">${product.discountPrice || product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Your wishlist is empty</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
