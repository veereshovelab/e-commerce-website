import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuHome, LuShoppingBag } from 'react-icons/lu';
import { useTheme } from '../hooks/useTheme';

const NotFound = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-[80vh] flex items-center justify-center relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 ${
      isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'
    }`}>
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />

      <div className={`max-w-xl w-full p-8 sm:p-12 rounded-3xl border text-center shadow-premium relative z-10 ${
        isDarkMode ? 'bg-zinc-900/60 border-zinc-800 backdrop-blur-xl' : 'bg-white border-zinc-200 backdrop-blur-xl'
      }`}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-brand-500 bg-brand-500/10 mb-6">
          <span>Error 404</span>
        </div>

        <h1 className="text-7xl sm:text-8xl font-display font-extrabold tracking-tight bg-gradient-to-r from-brand-400 via-brand-500 to-indigo-500 bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-white mb-3">
          Page Not Found
        </h2>

        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
          The page you're searching for might have been moved, removed, or doesn't exist in our sphere. Let's get you back on track!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-glow-primary transition duration-200"
          >
            <LuHome size={18} />
            <span>Back to Home</span>
          </button>

          <button
            onClick={() => navigate('/products')}
            className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 border px-6 py-3 rounded-full text-sm font-semibold transition duration-200 ${
              isDarkMode
                ? 'border-zinc-800 hover:bg-zinc-800/80 text-zinc-200'
                : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'
            }`}
          >
            <LuShoppingBag size={18} />
            <span>Browse Products</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
