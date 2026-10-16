'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

import { THEME_STORAGE_KEY as STORAGE_KEY } from '@/lib/theme';
import { cn } from '@/lib/utils';

/** Sun and moon button that switches between the dark and light themes. */
export function ThemeToggle({ className }) {
  const [light, setLight] = useState(false);

  // The init script already set the theme; read it once mounted.
  useEffect(() => {
    setLight(document.documentElement.dataset.theme === 'light');
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    if (next) document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
    try {
      if (next) localStorage.setItem(STORAGE_KEY, 'light');
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage blocked: the choice lasts for this page view only.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? 'Switch to the dark theme' : 'Switch to the light theme'}
      title={light ? 'Dark theme' : 'Light theme'}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-ember/50 hover:text-white',
        className
      )}
    >
      {light ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
