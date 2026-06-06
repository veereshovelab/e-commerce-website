import React from 'react';
import { FiStar } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

const Rating = ({ value = 0, count = 0, onChange, interactive = false, size = 'md' }) => {
  const { isDarkMode } = useTheme();
  const [hover, setHover] = React.useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {stars.map((star) => (
          <button
            key={star}
            onClick={() => interactive && onChange?.(star)}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            className={`transition-colors ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
            disabled={!interactive}
          >
            <FiStar
              className={`${sizes[size]} ${
                star <= (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {count > 0 && (
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          ({count})
        </span>
      )}
    </div>
  );
};

export default Rating;
