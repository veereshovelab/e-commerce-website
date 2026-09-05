import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiX, FiTrash2, FiShoppingCart, FiChevronRight, FiEye } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const RecentlyViewedDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const { isDarkMode } = useTheme();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const loadItems = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setItems(stored);
    } catch (e) {
      console.error('Failed to parse recently viewed items:', e);
      setItems([]);
    }
  };

  useEffect(() => {
    loadItems();

    // Listen for custom event when new product is viewed
    const handleUpdate = () => loadItems();
    window.addEventListener('recentlyViewedUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('recentlyViewedUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleClearAll = (e) => {
    e.stopPropagation();
    try {
      localStorage.removeItem('recentlyViewed');
      setItems([]);
      toast.info('Recently viewed history cleared');
      setIsOpen(false);
    } catch (e) {
      console.error('Failed to clear recently viewed:', e);
    }
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(item, 1);
    toast.success(`Added ${item.name} to cart!`);
  };

  return (
    <>
      {/* Floating Trigger Pill at Bottom Left */}
      <AnimatePresence>
        {!isOpen && items.length > 0 && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-5 left-5 z-40 px-3.5 py-2 rounded-full border shadow-premium backdrop-blur-md flex items-center space-x-2 text-xs font-semibold transition-colors duration-300 ${
              isDarkMode
                ? 'bg-zinc-900/90 border-zinc-800 text-white hover:border-brand-500/50 shadow-glass-dark'
                : 'bg-white/90 border-zinc-200 text-zinc-800 hover:border-brand-500/50'
            }`}
            title="View Recently Viewed Products"
          >
            <div className="relative">
              <FiClock size={15} className="text-brand-500" />
              <span className="absolute -top-1.5 -right-2 bg-brand-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {items.length}
              </span>
            </div>
            <span className="hidden sm:inline pl-1">Recently Viewed</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Main Drawer Box */}
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`relative w-full max-w-4xl rounded-t-3xl sm:rounded-3xl border overflow-hidden shadow-2xl z-10 ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white text-zinc-900'
              }`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
                    <FiClock size={16} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base">Recently Viewed Products</h3>
                    <p className="text-[10px] text-zinc-400">Quickly pick up where you left off ({items.length} items)</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleClearAll}
                    className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition"
                    title="Clear viewing history"
                  >
                    <FiTrash2 size={13} />
                    <span className="hidden sm:inline">Clear History</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-full transition ${
                      isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </div>

              {/* Drawer Content Carousel */}
              <div className="p-4 sm:p-6 overflow-x-auto max-h-[70vh]">
                <div className="flex gap-4 min-w-max pb-2">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className={`relative w-44 sm:w-48 p-3 rounded-2xl border transition group flex flex-col justify-between ${
                        isDarkMode
                          ? 'bg-zinc-850/60 border-zinc-800 hover:border-brand-500/40'
                          : 'bg-zinc-50 border-zinc-200 hover:border-brand-500/40'
                      }`}
                    >
                      <Link
                        to={`/products/${item._id}`}
                        onClick={() => setIsOpen(false)}
                        className="block mb-2"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                          <img
                            src={item.thumbnail || item.images?.[0]}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <p className="text-[9px] text-zinc-400 uppercase font-semibold tracking-wider">
                          {item.brand || 'ShopSphere'}
                        </p>
                        <h4 className="text-xs font-semibold truncate text-zinc-800 dark:text-zinc-100 group-hover:text-brand-500 transition">
                          {item.name}
                        </h4>
                        <p className="text-xs font-bold text-brand-500 mt-1">
                          ${item.discountPrice || item.price}
                        </p>
                      </Link>

                      <div className="flex items-center space-x-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                          onClick={(e) => handleAddToCart(e, item)}
                          className="flex-1 py-1.5 px-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[10px] font-semibold flex items-center justify-center space-x-1 shadow-glow-primary transition"
                        >
                          <FiShoppingCart size={11} />
                          <span>Add to Cart</span>
                        </button>
                        <Link
                          to={`/products/${item._id}`}
                          onClick={() => setIsOpen(false)}
                          className={`p-1.5 rounded-lg border transition ${
                            isDarkMode
                              ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'
                              : 'border-zinc-200 hover:bg-zinc-100 text-zinc-600'
                          }`}
                          title="View Product Details"
                        >
                          <FiEye size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer navigation prompt */}
              <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950/80 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Items stay saved in your browser history</span>
                <Link
                  to="/products"
                  onClick={() => setIsOpen(false)}
                  className="text-brand-500 font-semibold flex items-center space-x-1 hover:underline"
                >
                  <span>Browse All Products</span>
                  <FiChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RecentlyViewedDrawer;
