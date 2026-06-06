import React from 'react';
import { useTheme } from '../hooks/useTheme';

const PriceFilter = ({ min, max, onMinChange, onMaxChange, minPrice = 0, maxPrice = 1000 }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
      <h3 className="font-bold mb-4">Price Range</h3>
      <div className="space-y-4">
        {/* Min Price */}
        <div>
          <label className="text-sm font-medium mb-2 block">Min Price: ${min}</label>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={min}
            onChange={(e) => onMinChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="text-sm font-medium mb-2 block">Max Price: ${max}</label>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={max}
            onChange={(e) => onMaxChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Price Display */}
        <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
          <span className="text-sm">${min}</span>
          <span className="text-sm font-bold">-</span>
          <span className="text-sm">${max}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
