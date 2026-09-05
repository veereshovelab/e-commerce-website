import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMaximize2, FiTrash2, FiSliders } from 'react-icons/fi';
import { useCompare } from '../hooks/useCompare';
import { useTheme } from '../hooks/useTheme';

const CompareDrawer = () => {
  const { compareList, removeFromCompare, clearCompare, openCompareModal } = useCompare();
  const { isDarkMode } = useTheme();

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-11/12 max-w-3xl transform-gpu"
        >
        <div
          className={`p-3.5 sm:p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 ${
            isDarkMode
              ? 'bg-zinc-900/90 border-zinc-700/80 text-white shadow-glow-purple'
              : 'bg-white/95 border-zinc-200 text-zinc-900 shadow-premium'
          }`}
        >
          {/* Header info */}
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 font-bold">
              <FiSliders size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                Compare Products
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {compareList.length} of 4 items selected
              </p>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            {compareList.map((product) => (
              <div
                key={product._id}
                className="relative group flex-shrink-0 w-11 h-11 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-100 dark:bg-zinc-800"
              >
                <img
                  src={product.thumbnail || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFromCompare(product._id)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                  title="Remove from comparison"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}

            {Array.from({ length: 4 - compareList.length }).map((_, index) => (
              <div
                key={index}
                className="w-11 h-11 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs text-zinc-400 font-medium"
              >
                +{index + 1}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={clearCompare}
              className={`p-2 rounded-xl border text-xs font-medium transition ${
                isDarkMode
                  ? 'border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-400/40'
                  : 'border-zinc-200 text-zinc-600 hover:text-red-600 hover:border-red-200'
              }`}
              title="Clear comparison list"
            >
              <FiTrash2 size={16} />
            </button>
            <button
              onClick={openCompareModal}
              className="flex items-center space-x-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-glow-primary transition"
            >
              <FiMaximize2 size={14} />
              <span>Compare Now</span>
            </button>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareDrawer;
