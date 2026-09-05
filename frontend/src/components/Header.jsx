import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiMenu, FiX, FiSearch, FiShoppingCart, FiUser, FiLogOut, 
  FiMoon, FiSun, FiHeart, FiSliders, FiClock, FiTrendingUp, FiLoader, FiTrash2, FiMonitor 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { useCompare } from '../hooks/useCompare';
import apiClient from '../utils/api';

const POPULAR_CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Accessories'];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount, wishlist } = useCart();
  const { themeMode, setThemeMode, isDarkMode, toggleTheme } = useTheme();
  const { compareList, openCompareModal } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Load Recent Searches from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load recent searches', e);
    }
  }, []);

  const saveRecentSearch = (queryText) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem('recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent search', e);
      }
      return updated;
    });
  };

  const removeRecentSearch = (e, itemToRemove) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== itemToRemove);
      try {
        localStorage.setItem('recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to remove recent search', e);
      }
      return updated;
    });
  };

  const clearAllRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('recent_searches');
    } catch (e) {
      console.error('Failed to clear recent searches', e);
    }
  };

  // Handle Search Suggestions API
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsLoading(true);
      const delayDebounceFn = setTimeout(async () => {
        try {
          const response = await apiClient.get(`/products?search=${encodeURIComponent(searchQuery)}`);
          setSuggestions(response.data.products?.slice(0, 5) || []);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
      setIsLoading(false);
      setSelectedIndex(-1);
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDesktop = searchRef.current && !searchRef.current.contains(event.target);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target);
      if (isOutsideDesktop && isOutsideMobile) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (searchQuery.trim().length > 1 && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          const selected = suggestions[selectedIndex];
          handleSuggestionClick(selected);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setIsMenuOpen(false);
    }
  };

  const handleSuggestionClick = (item) => {
    saveRecentSearch(item.name);
    navigate(`/products/${item._id}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setIsMenuOpen(false);
  };

  const handleRecentClick = (queryText) => {
    setSearchQuery(queryText);
    saveRecentSearch(queryText);
    navigate(`/products?search=${encodeURIComponent(queryText)}`);
    setShowSuggestions(false);
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-brand-500/20 text-brand-500 font-semibold rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const renderSuggestionsDropdown = () => (
    <AnimatePresence>
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute left-0 right-0 mt-2 rounded-2xl shadow-premium border overflow-hidden backdrop-blur-md z-50 transform-gpu ${
            isDarkMode ? 'bg-zinc-900/95 border-zinc-800 text-white' : 'bg-white/95 border-zinc-100 text-zinc-900'
          }`}
        >
          {searchQuery.trim().length > 1 ? (
            <div className="py-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-6 space-x-2 text-zinc-400">
                  <FiLoader className="animate-spin text-brand-500" size={18} />
                  <span className="text-xs font-medium">Searching products...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div>
                  <div className="px-4 py-1.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                    Products
                  </div>
                  {suggestions.map((item, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                      <div
                        key={item._id}
                        onClick={() => handleSuggestionClick(item)}
                        className={`flex items-center space-x-3 px-4 py-2.5 cursor-pointer transition-colors duration-150 ${
                          isSelected
                            ? isDarkMode ? 'bg-zinc-800' : 'bg-brand-50/80'
                            : isDarkMode ? 'hover:bg-zinc-850/60' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <img
                          src={item.thumbnail || item.images?.[0]}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate text-zinc-800 dark:text-zinc-100">
                            {highlightMatch(item.name, searchQuery)}
                          </p>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">{item.brand}</p>
                        </div>
                        <span className="text-xs font-bold text-brand-500">
                          ${item.discountPrice || item.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-xs text-zinc-400">
                  No products found for "<span className="font-semibold text-zinc-600 dark:text-zinc-300">{searchQuery}</span>"
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center space-x-1.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                      <FiClock size={12} />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      onClick={clearAllRecentSearches}
                      className="text-[11px] text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term, i) => (
                      <div
                        key={i}
                        onClick={() => handleRecentClick(term)}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                        }`}
                      >
                        <span className="text-zinc-700 dark:text-zinc-300 truncate">{term}</span>
                        <button
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="text-zinc-400 hover:text-red-500 p-0.5"
                          title="Remove item"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center space-x-1.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mb-2">
                  <FiTrendingUp size={12} />
                  <span>Popular Categories</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${
                        isDarkMode
                          ? 'border-zinc-800 bg-zinc-850/60 hover:bg-zinc-800 hover:border-brand-500/50 text-zinc-300'
                          : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-brand-500/50 text-zinc-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

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
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className={`w-full pl-4 pr-16 py-1.5 rounded-full text-sm font-sans transition-all duration-300 outline-none border focus:ring-1 focus:ring-brand-500 ${
                  isDarkMode 
                    ? 'bg-zinc-900/60 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-700' 
                    : 'bg-zinc-100/60 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-300'
                }`}
              />
              <div className="absolute right-3.5 top-2 flex items-center space-x-1.5 text-zinc-400">
                {isLoading && <FiLoader size={14} className="animate-spin text-brand-500" />}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="hover:text-zinc-600 dark:hover:text-zinc-200"
                    title="Clear search"
                  >
                    <FiX size={14} />
                  </button>
                )}
                <button type="submit" className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                  <FiSearch size={15} />
                </button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {renderSuggestionsDropdown()}
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

            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.85, rotate: 15 }}
              onClick={toggleTheme}
              className={`relative p-2 rounded-full border transition-colors duration-300 flex items-center justify-center ${
                themeMode === 'system'
                  ? 'border-brand-500/50 bg-brand-500/10 text-brand-500 hover:bg-brand-500/20'
                  : isDarkMode 
                    ? 'border-zinc-800 hover:bg-zinc-900 text-amber-400' 
                    : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'
              }`}
              title={`Current Mode: ${themeMode.toUpperCase()} (Click to toggle Light -> Dark -> System)`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={themeMode}
                  initial={{ y: -10, opacity: 0, rotate: -30 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: 30 }}
                  transition={{ duration: 0.2 }}
                >
                  {themeMode === 'system' ? (
                    <FiMonitor size={17} />
                  ) : isDarkMode ? (
                    <FiSun size={17} />
                  ) : (
                    <FiMoon size={17} />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Compare Drawer Modal Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={openCompareModal}
              className={`relative p-2 rounded-full border hidden sm:block ${
                isDarkMode ? 'border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
              }`}
              title="Compare Products"
            >
              <FiSliders size={17} />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-glow-primary">
                  {compareList.length}
                </span>
              )}
            </motion.button>

            {/* Wishlist Link */}
            <Link to="/wishlist" title="Wishlist" aria-label="Wishlist" className={`relative p-2 rounded-full border hidden sm:block ${
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
            <Link to="/cart" title="Shopping Cart" aria-label="Shopping Cart" className={`relative p-2 rounded-full border ${
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
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
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
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              id="mobile-navigation"
              className={`lg:hidden overflow-hidden pb-6 border-t transform-gpu ${
                isDarkMode ? 'border-zinc-900' : 'border-zinc-100'
              }`}
            >
              {/* Mobile Search Input */}
              <div ref={mobileSearchRef} className="mt-4 mb-4 relative">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    className={`w-full pl-4 pr-16 py-2 rounded-xl text-sm transition-all duration-300 outline-none border ${
                      isDarkMode 
                        ? 'bg-zinc-900 border-zinc-850 text-white placeholder-zinc-500' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                    }`}
                  />
                  <div className="absolute right-3.5 top-2.5 flex items-center space-x-1.5 text-zinc-400">
                    {isLoading && <FiLoader size={14} className="animate-spin text-brand-500" />}
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSuggestions([]);
                          setShowSuggestions(false);
                        }}
                        className="hover:text-zinc-600 dark:hover:text-zinc-200"
                        title="Clear search"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                    <button type="submit" className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                      <FiSearch size={15} />
                    </button>
                  </div>
                </form>

                {/* Mobile Suggestions Dropdown */}
                {renderSuggestionsDropdown()}
              </div>

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

              {/* Mobile Theme Mode Switcher Pill */}
              <div className="px-4 py-2 my-1">
                <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mb-2 flex items-center justify-between">
                  <span>Appearance</span>
                  <span className="text-[10px] text-brand-500 font-mono capitalize">({themeMode})</span>
                </div>
                <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border ${
                  isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                }`}>
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      themeMode === 'light'
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <FiSun size={13} className="text-amber-500" />
                    <span>Light</span>
                  </button>

                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      themeMode === 'dark'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <FiMoon size={13} className="text-indigo-400" />
                    <span>Dark</span>
                  </button>

                  <button
                    onClick={() => setThemeMode('system')}
                    className={`flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      themeMode === 'system'
                        ? isDarkMode ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <FiMonitor size={13} className="text-brand-500" />
                    <span>System</span>
                  </button>
                </div>
              </div>

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

