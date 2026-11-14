'use client';

import React, { useState, useEffect } from 'react';

export type Theme = 'light' | 'high-contrast' | 'night-shift';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLargeText, setIsLargeText] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (isLargeText) {
      root.setAttribute('data-text-size', 'large');
    } else {
      root.removeAttribute('data-text-size');
    }
  }, [isLargeText]);

  return (
    <div className="flex flex-wrap items-center gap-2" role="region" aria-label="Display Preferences">
      <div className="inline-flex rounded border border-[var(--color-ink)]/20 p-0.5 bg-[var(--color-paper)]" role="group" aria-label="Theme selection">
        <button
          type="button"
          onClick={() => setTheme('light')}
          aria-pressed={theme === 'light'}
          className={`px-3 py-1.5 text-xs font-mono min-h-[44px] transition-colors rounded ${
            theme === 'light'
              ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold'
              : 'text-[var(--color-ink)] hover:bg-[var(--color-ink)]/10'
          }`}
        >
          Gazette
        </button>
        <button
          type="button"
          onClick={() => setTheme('high-contrast')}
          aria-pressed={theme === 'high-contrast'}
          className={`px-3 py-1.5 text-xs font-mono min-h-[44px] transition-colors rounded ${
            theme === 'high-contrast'
              ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold'
              : 'text-[var(--color-ink)] hover:bg-[var(--color-ink)]/10'
          }`}
        >
          High Contrast
        </button>
        <button
          type="button"
          onClick={() => setTheme('night-shift')}
          aria-pressed={theme === 'night-shift'}
          className={`px-3 py-1.5 text-xs font-mono min-h-[44px] transition-colors rounded ${
            theme === 'night-shift'
              ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold'
              : 'text-[var(--color-ink)] hover:bg-[var(--color-ink)]/10'
          }`}
        >
          Night Shift
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIsLargeText(!isLargeText)}
        aria-pressed={isLargeText}
        className={`px-3 py-1.5 text-xs font-mono min-h-[44px] rounded border border-[var(--color-ink)]/20 transition-colors ${
          isLargeText
            ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold'
            : 'bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-ink)]/10'
        }`}
        title="Toggle large text size"
      >
        A/A+
      </button>
    </div>
  );
}
