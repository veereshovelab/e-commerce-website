import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingCart, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useCompare } from '../hooks/useCompare';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const CompareModal = () => {
  const { compareList, isCompareModalOpen, closeCompareModal, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { isDarkMode } = useTheme();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <AnimatePresence>
      {isCompareModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto transform-gpu"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden my-8 ${
              isDarkMode
                ? 'bg-zinc-900 border-zinc-800 text-white'
                : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-zinc-800' : 'border-zinc-100'
          }`}>
            <div>
              <h2 className="text-xl font-bold font-display">Product Comparison</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Comparing {compareList.length} items side-by-side
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearCompare}
                className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-semibold flex items-center space-x-1"
              >
                <FiTrash2 size={13} />
                <span>Clear All</span>
              </button>
              <button
                onClick={closeCompareModal}
                className={`p-2 rounded-full border ${
                  isDarkMode ? 'border-zinc-800 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Content Grid */}
          {compareList.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">No products added for comparison.</p>
            </div>
          ) : (
            <div className="p-6 overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-w-[650px]">
                {compareList.map((product) => (
                  <div
                    key={product._id}
                    className={`rounded-2xl p-4 border flex flex-col justify-between relative ${
                      isDarkMode ? 'bg-zinc-850/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <button
                      onClick={() => removeFromCompare(product._id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                      title="Remove product"
                    >
                      <FiX size={14} />
                    </button>

                    <div>
                      {/* Product Thumbnail */}
                      <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/50">
                        <img
                          src={product.thumbnail || product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Title & Brand */}
                      <span className="text-[10px] uppercase font-bold text-brand-500 tracking-wider">
                        {product.brand || 'Brand'}
                      </span>
                      <h3 className="font-semibold text-sm line-clamp-2 mt-0.5 mb-2">
                        {product.name}
                      </h3>

                      {/* Specs comparison breakdown */}
                      <div className="space-y-2.5 my-4 text-xs border-t border-b py-3 dark:border-zinc-700/50 border-zinc-200">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Price:</span>
                          <span className="font-bold text-brand-500">
                            ${product.discountPrice || product.price}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Rating:</span>
                          <span className="font-semibold text-yellow-500">
                            ★ {product.rating || '4.5'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Category:</span>
                          <span className="capitalize text-zinc-700 dark:text-zinc-300">
                            {product.category || 'General'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Availability:</span>
                          <span className={`font-semibold flex items-center space-x-1 ${
                            product.stock > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {product.stock > 0 ? (
                              <>
                                <FiCheck size={12} />
                                <span>In Stock ({product.stock})</span>
                              </>
                            ) : (
                              <span>Out of Stock</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition ${
                        product.stock > 0
                          ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow-primary'
                          : 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      <FiShoppingCart size={14} />
                      <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareModal;
