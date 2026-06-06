import React from 'react';
import { useTheme } from '../hooks/useTheme';

const Skeleton = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg overflow-hidden`}>
      <div className={`skeleton h-48 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
      <div className="p-4 space-y-3">
        <div className={`skeleton h-4 w-3/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        <div className={`skeleton h-4 w-1/2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        <div className={`skeleton h-4 w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        <div className={`skeleton h-8 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
      </div>
    </div>
  );
};

export default Skeleton;
