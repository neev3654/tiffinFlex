import { useEffect } from 'react';
import { useFormikContext } from 'formik';

const useFormPersistence = (key) => {
  const { values, setValues } = useFormikContext();

  // Load from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setValues((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse form persistence data', e);
      }
    }
  }, [key, setValues]);

  // Save to sessionStorage on value change
  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(values));
  }, [key, values]);

  // Clear data
  const clearPersistence = () => sessionStorage.removeItem(key);

  return { clearPersistence };
};

export default useFormPersistence;
