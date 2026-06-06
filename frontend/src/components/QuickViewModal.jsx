import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { isDarkMode } = useTheme();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  const handleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-premium ${
              isDarkMode ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-white text-zinc-950'
            } z-10`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full z-20 ${
                isDarkMode ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <FiX size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Gallery Thumbnail */}
              <div className={`relative h-64 md:h-full bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center`}>
                <img
                  src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-brand-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-glow-primary">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Product Content Details */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <span className={`text-xs uppercase font-semibold tracking-wider ${isDarkMode ? 'text-brand-400' : 'text-brand-600'}`}>
                    {product.category}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold font-display mt-1 mb-2 tracking-tight">
                    {product.name}
                  </h2>

                  {/* Rating display */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm">
                          {i < Math.round(product.rating) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>

                  <p className={`text-sm leading-relaxed mb-6 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {product.description || 'Experience the ultimate comfort and quality. Crafted with meticulous attention to detail using premium materials to ensure lasting durability.'}
                  </p>

                  <div className="flex items-baseline space-x-3 mb-6">
                    {product.discountPrice ? (
                      <>
                        <span className="text-2xl font-bold text-brand-500">${product.discountPrice}</span>
                        <span className={`text-base line-through ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
                          ${product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold">${product.price}</span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-brand-500 text-white py-3 px-6 rounded-xl hover:bg-brand-600 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed font-medium shadow-glow-primary hover:shadow-lg transition flex items-center justify-center space-x-2"
                  >
                    <FiShoppingCart size={18} />
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWishlist}
                    className={`p-3 rounded-xl border ${
                      isInWishlist(product._id)
                        ? 'border-red-500 bg-red-500/10 text-red-500'
                        : `border-zinc-300 dark:border-zinc-800 ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700'}`
                    }`}
                  >
                    <FiHeart fill={isInWishlist(product._id) ? 'currentColor' : 'none'} size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
