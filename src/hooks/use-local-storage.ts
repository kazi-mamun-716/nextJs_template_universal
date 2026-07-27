"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persists a value to localStorage with SSR safety.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch {
      // Ignore parse errors
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {
        // Ignore storage errors
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
}
