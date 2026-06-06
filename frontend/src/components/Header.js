import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`${isDarkMode ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'} border-b sticky top-0 z-50 shadow-sm`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              ShopSphere
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link to="/products" className={`px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition`}>Products</Link>
            <Link to="/wishlist" className={`px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition`}>Wishlist</Link>
            <Link to="/about" className={`px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition`}>About</Link>
            <Link to="/faq" className={`px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition`}>FAQ</Link>
            <Link to="/contact" className={`px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition`}>Contact</Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
              title="Toggle theme"
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
              <FiShoppingCart size={20} />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard" className="hidden sm:flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
                  <FiUser size={20} />
                  <span className="hidden md:inline text-sm">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden pb-4 space-y-2 ${isDarkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'}`}>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border focus:outline-none`}
                />
              </div>
            </form>
            <Link to="/products" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              Products
            </Link>
            <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              Wishlist
            </Link>
            <Link to="/about" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              About
            </Link>
            <Link to="/faq" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              FAQ
            </Link>
            <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              Contact
            </Link>
            <div className={`my-2 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} border-t`}></div>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  My Orders
                </Link>
                <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  My Wishlist
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-blue-600 font-semibold">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
