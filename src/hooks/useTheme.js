import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('mindtrack_theme', 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
