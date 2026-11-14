'use client';

import React from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/gemini/translation';

interface LanguagePickerProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  disabled?: boolean;
}

export function LanguagePicker({
  currentLanguage,
  onLanguageChange,
  disabled,
}: LanguagePickerProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor="lang-select"
        className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink)]"
      >
        Regional Language:
      </label>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select advisory language">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = lang.code === currentLanguage;
          return (
            <button
              key={lang.code}
              type="button"
              disabled={disabled}
              onClick={() => onLanguageChange(lang.code)}
              aria-pressed={isSelected}
              className={`px-3 py-1.5 text-xs font-mono rounded min-h-[44px] border transition-colors ${
                isSelected
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold border-[var(--color-ink)]'
                  : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/10'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>{lang.nativeName}</span>
              <span className="text-[10px] opacity-75 ml-1">({lang.name})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
