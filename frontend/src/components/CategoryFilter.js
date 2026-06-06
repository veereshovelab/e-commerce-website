import React from 'react';
import { useTheme } from '../hooks/useTheme';

const CategoryFilter = ({ categories, selected, onChange }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
      <h3 className="font-bold mb-4">Categories</h3>
      <div className="space-y-3">
        {categories.map((category) => (
          <label key={category} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(category)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...selected, category]);
                } else {
                  onChange(selected.filter((c) => c !== category));
                }
              }}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
            />
            <span className="text-sm">{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
