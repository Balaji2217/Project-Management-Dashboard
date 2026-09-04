import { useEffect, useState } from "react";

export default function useLocalStorage(
  key,
  initialValue
) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);

      if (stored !== null) {
        return JSON.parse(stored);
      }

      return typeof initialValue === "function"
        ? initialValue()
        : initialValue;
    } catch (error) {
      console.error(error);

      return typeof initialValue === "function"
        ? initialValue()
        : initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  return [value, setValue];
}