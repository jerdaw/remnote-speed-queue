import { useState, useEffect } from 'react';

/**
 * Hook to detect and watch for RemNote's theme changes.
 * RemNote sets the `.dark` class on `document.documentElement` (html element).
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver(() => {
      const darkEnabled = document.documentElement.classList.contains('dark');
      setIsDark(darkEnabled);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return { isDark, theme: isDark ? 'dark' : 'light' };
}
