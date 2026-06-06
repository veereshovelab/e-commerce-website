import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import apiClient from '../utils/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount, wishlist } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Handle Search Suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const response = await apiClient.get(`/products?search=${encodeURIComponent(searchQuery)}`);
          setSuggestions(response.data.products?.slice(0, 5) || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-lg transition-all duration-300 ${
      isDarkMode 
        ? 'bg-darkDeep/60 border-white/5 text-white shadow-glass-dark' 
        : 'bg-white/80 border-zinc-200 text-zinc-900 shadow-premium'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-brand-500 to-indigo-500 bg-clip-text text-transparent">
              ShopSphere
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-sm mx-6 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                className={`w-full pl-4 pr-10 py-1.5 rounded-full text-sm font-sans transition-all duration-300 outline-none border focus:ring-1 focus:ring-brand-500 ${
                  isDarkMode 
                    ? 'bg-zinc-900/60 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-700' 
                    : 'bg-zinc-100/60 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-300'
                }`}
              />
              <button type="submit" className="absolute right-3.5 top-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                <FiSearch size={16} />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute left-0 right-0 mt-2 rounded-2xl shadow-premium border overflow-hidden backdrop-blur-md z-50 ${
                    isDarkMode ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/95 border-zinc-100'
                  }`}
                >
                  <div className="py-2">
                    {suggestions.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSuggestionClick(item._id)}
                        className={`flex items-center space-x-3 px-4 py-2.5 cursor-pointer transition-colors duration-200 ${
                          isDarkMode ? 'hover:bg-zinc-850/60' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <img
                          src={item.thumbnail || item.images?.[0]}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate text-zinc-800 dark:text-zinc-100">{item.name}</p>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">{item.brand}</p>
                        </div>
                        <span className="text-xs font-bold text-brand-500">
                          ${item.discountPrice || item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/products" className={`text-sm font-medium nav-link-hover ${isActive('/products') ? 'nav-link-active text-brand-500 dark:text-brand-400 font-semibold' : 'text-zinc-650 dark:text-zinc-350 hover:text-brand-500 dark:hover:text-brand-400'}`}>Products</Link>
            <Link to="/about" className={`text-sm font-medium nav-link-hover ${isActive('/about') ? 'nav-link-active text-brand-500 dark:text-brand-400 font-semibold' : 'text-zinc-655 dark:text-zinc-355 hover:text-brand-500 dark:hover:text-brand-400'}`}>About</Link>
            <Link to="/faq" className={`text-sm font-medium nav-link-hover ${isActive('/faq') ? 'nav-link-active text-brand-500 dark:text-brand-400 font-semibold' : 'text-zinc-650 dark:text-zinc-350 hover:text-brand-500 dark:hover:text-brand-400'}`}>FAQ</Link>
            <Link to="/contact" className={`text-sm font-medium nav-link-hover ${isActive('/contact') ? 'nav-link-active text-brand-500 dark:text-brand-400 font-semibold' : 'text-zinc-650 dark:text-zinc-355 hover:text-brand-500 dark:hover:text-brand-400'}`}>Contact</Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">

            {/* Wishlist Link */}
            <Link to="/wishlist" className={`relative p-2 rounded-full border hidden sm:block ${
              isDarkMode ? 'border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
            }`}>
              <FiHeart size={17} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-glow-primary">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className={`relative p-2 rounded-full border ${
              isDarkMode ? 'border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
            }`}>
              <FiShoppingCart size={17} />
              <AnimatePresence>
                {getCartItemsCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="absolute -top-1 -right-1 bg-brand-500 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-glow-primary"
                  >
                    {getCartItemsCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User Details / Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard" className={`hidden sm:flex items-center space-x-1.5 p-1.5 pl-2.5 pr-2.5 rounded-full border text-xs font-medium ${
                  isDarkMode ? 'border-zinc-800 hover:bg-zinc-900' : 'border-zinc-200 hover:bg-zinc-100'
                }`}>
                  <FiUser size={14} className="text-zinc-400" />
                  <span className="truncate max-w-[80px]">{user?.name?.split(' ')[0]}</span>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className={`p-2 rounded-full border ${
                    isDarkMode ? 'border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-red-400' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-red-500'
                  }`}
                  title="Logout"
                >
                  <FiLogOut size={16} />
                </motion.button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login" className="text-xs font-semibold px-4 py-2 hover:text-brand-500 dark:text-zinc-350 dark:hover:text-brand-400">
                  Login
                </Link>
                <Link to="/register" className="text-xs font-semibold px-5 py-2.5 bg-brand-500 text-white rounded-full hover:bg-brand-600 dark:btn-glow-primary shadow-glow-primary transition">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Navigation Trigger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-full border ${
                isDarkMode ? 'border-zinc-800 hover:bg-zinc-900' : 'border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              {isMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden overflow-hidden pb-6 border-t ${
                isDarkMode ? 'border-zinc-900' : 'border-zinc-100'
              }`}
            >
              {/* Mobile Search Input */}
              <form onSubmit={handleSearchSubmit} className="mt-4 mb-4 relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-4 pr-10 py-2 rounded-xl text-sm transition-all duration-300 outline-none border ${
                    isDarkMode 
                      ? 'bg-zinc-900 border-zinc-850 text-white placeholder-zinc-500' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                  }`}
                />
                <button type="submit" className="absolute right-3.5 top-2.5 text-zinc-400">
                  <FiSearch size={16} />
                </button>
              </form>

              <div className="space-y-1">
                <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  Products
                </Link>
                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  Wishlist
                </Link>
                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  About
                </Link>
                <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  FAQ
                </Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  Contact
                </Link>
              </div>

              <div className={`my-3 border-t ${isDarkMode ? 'border-zinc-900' : 'border-zinc-100'}`} />

              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    My Account
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-brand-500 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-4 mt-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-center text-xs font-semibold py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-center text-xs font-semibold py-3 bg-brand-500 text-white rounded-xl shadow-glow-primary">
                    Sign Up
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
