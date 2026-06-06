import React from 'react';
import { useTheme } from '../hooks/useTheme';

const LoadingSpinner = ({ size = 'md' }) => {
  const { isDarkMode } = useTheme();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 ${isDarkMode ? 'border-gray-700 border-t-blue-600' : 'border-gray-200 border-t-blue-600'} rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
