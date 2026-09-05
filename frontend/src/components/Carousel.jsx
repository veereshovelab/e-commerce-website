import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const Carousel = ({ items = [], renderItem, autoPlay = false, interval = 5000 }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const { isDarkMode } = useTheme();

  const currentIndex = Math.abs(page % (items.length || 1));

  const paginate = (newDirection) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  };

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const timer = setInterval(() => {
      paginate(1);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative overflow-hidden group">
      <div className="relative w-full overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.25 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000 || offset.x < -100) {
                paginate(1);
              } else if (swipe > 10000 || offset.x > 100) {
                paginate(-1);
              }
            }}
            className="w-full transform-gpu cursor-grab active:cursor-grabbing"
          >
            {renderItem(items[currentIndex])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            className={`absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full border backdrop-blur-md transition-opacity opacity-80 group-hover:opacity-100 z-10 ${
              isDarkMode
                ? 'bg-zinc-900/80 border-zinc-700 text-white hover:bg-zinc-800'
                : 'bg-white/80 border-zinc-200 text-zinc-900 hover:bg-white shadow-md'
            }`}
            title="Previous slide"
          >
            <FiChevronLeft size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full border backdrop-blur-md transition-opacity opacity-80 group-hover:opacity-100 z-10 ${
              isDarkMode
                ? 'bg-zinc-900/80 border-zinc-700 text-white hover:bg-zinc-800'
                : 'bg-white/80 border-zinc-200 text-zinc-900 hover:bg-white shadow-md'
            }`}
            title="Next slide"
          >
            <FiChevronRight size={18} />
          </motion.button>

          {/* Indicators */}
          <div className="flex justify-center items-center space-x-1.5 mt-4">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setPage([index, index > currentIndex ? 1 : -1])}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-6 bg-brand-500'
                    : `w-2 ${isDarkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-300 hover:bg-zinc-400'}`
                }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
