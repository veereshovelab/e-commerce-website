import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingCart, FiHeart, FiPlus, FiMinus, FiShield, FiTruck, FiExternalLink } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { isDarkMode } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Reset quantity and selected image when product changes or opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedImageIndex(0);
    }
  }, [product, isOpen]);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.thumbnail || 'https://via.placeholder.com/400'];

  const activeImage = images[selectedImageIndex] || images[0];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
    onClose();
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
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-3xl overflow-hidden rounded-3xl shadow-2xl transform-gpu ${
              isDarkMode ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-white text-zinc-950'
            } z-10`}
          >
            {/* Close Button */}
            <motion.button
              whileTap={{ scale: 0.85, rotate: 90 }}
              onClick={onClose}
              className={`absolute top-4 right-4 p-2.5 rounded-full z-20 transition-colors ${
                isDarkMode ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white' : 'bg-zinc-100/80 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900'
              }`}
              title="Close modal"
            >
              <FiX size={20} />
            </motion.button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Gallery Section */}
              <div className="p-6 bg-zinc-50 dark:bg-zinc-950/60 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 mb-4 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-brand-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-glow-primary">
                      -{discountPercent}% OFF
                    </span>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="absolute bottom-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Only {product.stock} Left!
                    </span>
                  )}
                </div>

                {/* Thumbnails list if multiple */}
                {images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                          selectedImageIndex === idx
                            ? 'border-brand-500 ring-2 ring-brand-500/30'
                            : 'border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Content Details */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs uppercase font-bold tracking-widest ${isDarkMode ? 'text-brand-400' : 'text-brand-600'}`}>
                      {product.category || 'Product Category'}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      product.stock > 0
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight mb-2">
                    {product.name}
                  </h2>

                  {/* Rating display */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm">
                          {i < Math.round(product.rating || 4.5) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      ({product.reviewCount || 12} customer reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline space-x-3 mb-4">
                    {product.discountPrice ? (
                      <>
                        <span className="text-2xl font-extrabold text-brand-500">${product.discountPrice}</span>
                        <span className={`text-base line-through ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          ${product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-extrabold">${product.price}</span>
                    )}
                  </div>

                  <p className={`text-xs md:text-sm leading-relaxed mb-6 line-clamp-3 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {product.description || 'Experience premium performance and sleek design. Engineered with high-grade components for long-lasting durability.'}
                  </p>

                  {/* Feature Badges */}
                  <div className="grid grid-cols-2 gap-2 mb-6 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center space-x-1.5 bg-zinc-100 dark:bg-zinc-800/60 p-2 rounded-lg">
                      <FiTruck className="text-brand-500" size={14} />
                      <span>Fast Express Shipping</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-zinc-100 dark:bg-zinc-800/60 p-2 rounded-lg">
                      <FiShield className="text-emerald-500" size={14} />
                      <span>2-Year Warranty</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Actions */}
                <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  {/* Quantity selector */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Quantity:
                    </span>
                    <div className="flex items-center space-x-2 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 bg-zinc-50 dark:bg-zinc-800/50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 transition-colors"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex-1 bg-brand-500 text-white py-3 px-4 rounded-xl hover:bg-brand-600 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed font-medium text-sm shadow-glow-primary hover:shadow-lg transition flex items-center justify-center space-x-2"
                    >
                      <FiShoppingCart size={16} />
                      <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleWishlist}
                      className={`p-3 rounded-xl border transition-colors ${
                        isInWishlist(product._id)
                          ? 'border-red-500 bg-red-500/10 text-red-500'
                          : `border-zinc-200 dark:border-zinc-800 ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'}`
                      }`}
                      title="Add to Wishlist"
                    >
                      <FiHeart fill={isInWishlist(product._id) ? 'currentColor' : 'none'} size={18} />
                    </motion.button>
                  </div>

                  {/* View Full Product Link */}
                  <div className="text-center pt-2">
                    <Link
                      to={`/products/${product._id}`}
                      onClick={onClose}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
                    >
                      <span>View Full Product Details</span>
                      <FiExternalLink size={12} />
                    </Link>
                  </div>
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
