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

  const getPersonaIcon = (id: PersonaId) => {
    switch (id) {
      case 'ward_officer':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'rwa':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'school':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        );
      case 'citizen':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
    }
  };

  return (
    <fieldset className="space-y-2.5 border border-[var(--color-ink)]/20 p-3.5 rounded-lg bg-[var(--color-ink)]/[0.02]">
      <div className="flex items-center justify-between">
        <legend className="px-1 font-mono text-xs uppercase tracking-wider font-bold text-[var(--color-ink)]">
          Target Operational Persona
        </legend>
        <span className="text-[10px] font-mono text-[var(--color-ink)]/50">
          Tailored Mandates & Action Thresholds
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {personaList.map((p) => {
          const isSelected = p.id === selectedPersona;
          return (
            <label
              key={p.id}
              className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all text-xs font-mono min-h-[48px] ${
                isSelected
                  ? 'border-[var(--color-ink)] bg-[var(--color-marigold)]/15 font-bold shadow-xs'
                  : 'border-[var(--color-ink)]/15 bg-[var(--color-paper)] hover:border-[var(--color-ink)]/40 hover:bg-[var(--color-ink)]/[0.02]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="persona-selection"
                value={p.id}
                checked={isSelected}
                disabled={disabled}
                aria-label={p.name}
                onChange={() => onSelectPersona(p.id)}
                className="mt-1 mr-2.5 accent-[var(--color-marigold)]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-[var(--color-ink)] font-bold flex items-center gap-1.5">
                    <span className="text-[var(--color-ink)]/70">{getPersonaIcon(p.id)}</span>
                    <span>{p.name}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--color-ink)] text-[var(--color-paper)] uppercase font-mono">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[var(--color-ink)]/70 font-normal leading-tight mt-1">
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
