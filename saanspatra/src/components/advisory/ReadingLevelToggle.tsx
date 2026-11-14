'use client';

import React from 'react';
import { ReadingLevel } from '@/lib/gemini/translation';

interface ReadingLevelToggleProps {
  currentLevel: ReadingLevel;
  onLevelChange: (level: ReadingLevel) => void;
  disabled?: boolean;
}

export function ReadingLevelToggle({
  currentLevel,
  onLevelChange,
  disabled,
}: ReadingLevelToggleProps) {
  const levels: { id: ReadingLevel; label: string; desc: string }[] = [
    {
      id: 'simple',
      label: 'Class-5 Simple',
      desc: 'Short sentences, simple everyday words',
    },
    {
      id: 'general',
      label: 'General Citizen',
      desc: 'Clear public advisory for residents & commuters',
    },
    {
      id: 'technical',
      label: 'Technical Brief',
      desc: 'Includes µg/m³ concentrations & legal limits',
    },
  ];

  return (
    <div className="space-y-1.5">
      <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink)]">
        Reading Level:
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5" role="group" aria-label="Reading Level">
        {levels.map((lvl) => {
          const isSelected = lvl.id === currentLevel;
          return (
            <button
              key={lvl.id}
              type="button"
              disabled={disabled}
              onClick={() => onLevelChange(lvl.id)}
              aria-pressed={isSelected}
              className={`p-2 text-left rounded border min-h-[44px] transition-colors ${
                isSelected
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                  : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/10'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="font-mono text-xs font-bold">{lvl.label}</div>
              <div
                className={`text-[10px] font-sans mt-0.5 ${
                  isSelected ? 'text-[var(--color-paper)]/80' : 'text-[var(--color-ink)]/60'
                }`}
              >
                {lvl.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
