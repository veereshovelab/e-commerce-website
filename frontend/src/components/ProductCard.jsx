import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye, FiSliders } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { useCompare } from '../hooks/useCompare';
import { toast } from 'react-toastify';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { isDarkMode } = useTheme();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare(product._id)) {
      removeFromCompare(product._id);
      toast.info('Removed from comparison list');
    } else {
      const res = addToCompare(product);
      if (res.success) {
        toast.success('Added to comparison list!');
      } else if (res.reason === 'limit_reached') {
        toast.warning('Maximum 4 products can be compared at once.');
      }
    }
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={`group relative rounded-2xl overflow-hidden border ${
          isDarkMode ? 'bg-darkCard/40 border-white/5 backdrop-blur-md shadow-glass-dark hover:border-white/10 hover:shadow-glow-purple' : 'bg-white border-zinc-200 shadow-premium hover:shadow-premium-hover'
        } flex flex-col h-full`}
      >
        {/* Wishlist & Compare Buttons (Floating) */}
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5">
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={handleCompare}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-sm border ${
              isInCompare(product._id)
                ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400 font-bold'
                : `border-zinc-200/50 dark:border-white/5 ${
                    isDarkMode ? 'bg-darkDeep/60 text-zinc-400 hover:text-white hover:border-white/15' : 'bg-white/60 text-zinc-500 hover:text-zinc-900'
                  }`
            } transition-all duration-300`}
            title={isInCompare(product._id) ? 'Remove from compare' : 'Compare product'}
          >
            <FiSliders size={15} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={handleWishlist}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-sm border ${
              isInWishlist(product._id)
                ? 'bg-red-500/10 border-red-500/20 text-red-500'
                : `border-zinc-200/50 dark:border-white/5 ${
                    isDarkMode ? 'bg-darkDeep/60 text-zinc-400 hover:text-white hover:border-white/15' : 'bg-white/60 text-zinc-500 hover:text-zinc-900'
                  }`
            } transition-all duration-300`}
            title="Wishlist"
          >
            <FiHeart fill={isInWishlist(product._id) ? 'currentColor' : 'none'} size={15} />
          </motion.button>
        </div>

        {/* Image Container */}
        <div className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 aspect-[4/3]">
          <img
            src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />

          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-brand-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider shadow-glow-primary z-10 animate-pulse">
              -{discountPercent}% OFF
            </div>
          )}

          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider z-10 flex items-center space-x-1 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>Only {product.stock} left!</span>
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="text-white text-xs font-bold uppercase tracking-wider bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-700">
                Out of Stock
              </span>
            </div>
          )}

          {/* Hover Overlay with Quick Actions */}
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2.5 z-10 backdrop-blur-[2px]">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsQuickViewOpen(true)}
              className="p-3 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 shadow-lg transition-transform duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center justify-center"
              title="Quick View"
            >
              <FiEye size={18} />
            </motion.button>
            {product.stock > 0 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-3 rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-glow-primary transition-transform duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75 flex items-center justify-center"
                title="Add to Cart"
              >
                <FiShoppingCart size={18} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Content Section */}
        <Link to={`/products/${product._id}`} className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-1.5">
              {product.brand || 'Premium Brand'}
            </p>
            <h3 className="font-display font-medium text-sm text-zinc-800 dark:text-white line-clamp-1 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-300 mb-1">
              {product.name}
            </h3>

            {/* Ratings */}
            <div className="flex items-center space-x-1.5 mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xs">
                    {i < Math.round(product.rating) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-400">
                ({product.reviewCount || 0})
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-2 mt-2">
            {product.discountPrice ? (
              <>
                <span className="text-base font-bold text-brand-500 dark:text-brand-400">${product.discountPrice}</span>
                <span className={`text-xs line-through ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-zinc-800 dark:text-white">${product.price}</span>
            )}
          </div>
        </Link>
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
