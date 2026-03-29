import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';

const mapping = { en, ru, uz };
const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [locale, setLocale] = useLocalStorage('mindtrack_locale', 'en');
  const t = (key) => mapping[locale]?.[key] || mapping.en[key] || key;

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
