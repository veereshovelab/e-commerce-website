import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            className={`w-full flex items-center justify-between p-4 ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
            } transition`}
          >
            <span className="font-semibold">{item.title}</span>
            <FiChevronDown
              className={`transform transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === index && (
            <div className={`p-4 ${isDarkMode ? 'bg-gray-900 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
