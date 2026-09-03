import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeModeState] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
      return savedMode;
    }
    const legacy = localStorage.getItem('theme');
    if (legacy === 'dark' || legacy === 'light') {
      return legacy;
    }
    return 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Track system dark mode preference changes
  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemIsDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const isDarkMode = themeMode === 'system' ? systemIsDark : themeMode === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const setThemeMode = useCallback((mode) => {
    if (mode === 'light' || mode === 'dark' || mode === 'system') {
      setThemeModeState(mode);
      localStorage.setItem('themeMode', mode);
      localStorage.setItem('theme', mode === 'system' ? (systemIsDark ? 'dark' : 'light') : mode);
    }
  }, [systemIsDark]);

  const toggleTheme = useCallback(() => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  }, [themeMode, setThemeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


