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
  const levels: { id: ReadingLevel; label: string; desc: string; audience: string }[] = [
    {
      id: 'simple',
      label: 'Class-5 Simple',
      desc: 'Short sentences & easy everyday words without technical jargon',
      audience: 'Primary students & neo-literates',
    },
    {
      id: 'general',
      label: 'General Citizen',
      desc: 'Clear public advisory for residents, commuters & parents',
      audience: 'General public & RWAs',
    },
    {
      id: 'technical',
      label: 'Technical Brief',
      desc: 'Precise concentrations (µg/m³), CPCB legal limits & inversion metrics',
      audience: 'Engineers & health officers',
    },
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink)]">
          Cognitive Reading Level:
        </div>
        <span className="text-[10px] font-mono text-[var(--color-ink)]/50">
          Demographic Adaptability
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="group" aria-label="Reading Level">
        {levels.map((lvl) => {
          const isSelected = lvl.id === currentLevel;
          return (
            <button
              key={lvl.id}
              type="button"
              disabled={disabled}
              onClick={() => onLevelChange(lvl.id)}
              aria-pressed={isSelected}
              className={`p-2.5 text-left rounded-md border-2 min-h-[48px] transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)] shadow-xs'
                  : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-ink)]/20 hover:border-[var(--color-ink)]/50 hover:bg-[var(--color-ink)]/[0.02]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs font-bold">{lvl.label}</div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-aqi-good)]" />
                )}
              </div>
              <div
                className={`text-[10px] font-sans mt-0.5 leading-snug ${
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
