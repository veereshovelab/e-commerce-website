import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { isDarkMode } = useTheme();

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : `${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`} transition`}
      >
        <FiChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => page !== '...' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 rounded-lg transition ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : page === '...'
                ? 'cursor-default'
                : `${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : `${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`} transition`}
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
