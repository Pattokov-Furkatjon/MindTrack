import { useState } from 'react';

function resolveInitialValue(initialValue) {
  return typeof initialValue === 'function' ? initialValue() : initialValue;
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const fallbackValue = resolveInitialValue(initialValue);

    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : fallbackValue;
    } catch {
      return fallbackValue;
    }
  });

  const updateValue = (nextValue) => {
    setValue((previousValue) => {
      const resolvedValue =
        typeof nextValue === 'function' ? nextValue(previousValue) : nextValue;

      try {
        window.localStorage.setItem(key, JSON.stringify(resolvedValue));
      } catch {
        return previousValue;
      }

      return resolvedValue;
    });
  };

  return [value, updateValue];
}
