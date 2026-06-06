import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

const Carousel = ({ items, renderItem, autoPlay = false, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);
  const { isDarkMode } = useTheme();

  React.useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);
  const next = () => setCurrent((prev) => (prev + 1) % items.length);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${current * 100}%)` }}>
          {items.map((item, index) => (
            <div key={index} className="min-w-full">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full ${isDarkMode ? 'bg-black/50 text-white hover:bg-black/70' : 'bg-white/50 text-black hover:bg-white/70'} transition z-10`}
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full ${isDarkMode ? 'bg-black/50 text-white hover:bg-black/70' : 'bg-white/50 text-black hover:bg-white/70'} transition z-10`}
      >
        <FiChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === current ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
