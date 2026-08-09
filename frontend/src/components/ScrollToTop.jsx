import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-2xl border backdrop-blur-md transition-colors ${
            isDarkMode
              ? 'bg-zinc-800/90 border-zinc-700 text-brand-400 hover:bg-zinc-700 shadow-glow-purple'
              : 'bg-white/90 border-zinc-200 text-brand-600 hover:bg-zinc-100 shadow-premium'
          }`}
          title="Scroll to Top"
        >
          <FiArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
