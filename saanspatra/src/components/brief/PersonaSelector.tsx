'use client';

import React from 'react';
import { PersonaId, PERSONAS } from '@/lib/persona/types';

interface PersonaSelectorProps {
  selectedPersona: PersonaId;
  onSelectPersona: (persona: PersonaId) => void;
  disabled?: boolean;
}

export function PersonaSelector({
  selectedPersona,
  onSelectPersona,
  disabled,
}: PersonaSelectorProps) {
  const personaList = Object.values(PERSONAS);

  return (
    <fieldset className="space-y-2 border border-[var(--color-ink)]/20 p-3 rounded bg-[var(--color-ink)]/[0.02]">
      <legend className="px-2 font-mono text-xs uppercase tracking-wider font-bold text-[var(--color-ink)]">
        Select Target Persona
      </legend>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {personaList.map((p) => {
          const isSelected = p.id === selectedPersona;
          return (
            <label
              key={p.id}
              className={`flex items-start p-2.5 rounded border cursor-pointer transition-colors text-xs font-mono min-h-[44px] ${
                isSelected
                  ? 'border-[var(--color-ink)] bg-[var(--color-marigold)]/15 font-bold shadow-xs'
                  : 'border-[var(--color-ink)]/20 bg-[var(--color-paper)] hover:bg-[var(--color-ink)]/5'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="persona-selection"
                value={p.id}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onSelectPersona(p.id)}
                className="mt-0.5 mr-2 accent-[var(--color-marigold)]"
              />
              <div>
                <div className="text-[var(--color-ink)] font-bold">{p.name}</div>
                <div className="text-[10px] text-[var(--color-ink)]/70 font-normal leading-tight mt-0.5">
                  {p.roleTitle}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
