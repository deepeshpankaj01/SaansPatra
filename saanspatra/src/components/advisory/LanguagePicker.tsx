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
      <div className="flex items-center justify-between">
        <label
          htmlFor="lang-select"
          className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink)]"
        >
          Regional Language Broadcast:
        </label>
        <span className="text-[10px] font-mono text-[var(--color-ink)]/50">
          6 Indian Official Languages
        </span>
      </div>

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
              className={`px-3 py-1.5 text-xs font-mono rounded-md min-h-[44px] border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold border-[var(--color-ink)] shadow-xs'
                  : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-ink)]/20 hover:border-[var(--color-ink)]/50 hover:bg-[var(--color-ink)]/[0.03]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="font-hindi">{lang.nativeName}</span>
              <span className="text-[10px] opacity-75 ml-1.5">({lang.name})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
