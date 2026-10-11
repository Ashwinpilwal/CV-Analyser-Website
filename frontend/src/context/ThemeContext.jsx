import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Only two modes: 'night' (Pure Obsidian Black / Neon) and 'day' (Vibrant Crisp Sunlight)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('auracv_theme');
    if (saved === 'day') return 'day';
    // Default to night mode
    return 'night';
  });

  useEffect(() => {
    localStorage.setItem('auracv_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'night') {
      document.documentElement.classList.add('night-theme');
      document.documentElement.classList.remove('day-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('day-theme');
      document.documentElement.classList.remove('night-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'night' ? 'day' : 'night'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isNight: theme === 'night', isDay: theme === 'day' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

