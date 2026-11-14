'use client';

import React, { useState } from 'react';
import { Evidence } from '@/lib/analytics/types';
import { EvidenceItem } from './EvidenceItem';

interface EvidenceTrailProps {
  evidence: Evidence[];
  highlightedId?: string | null;
}

export function EvidenceTrail({
  evidence,
  highlightedId,
}: EvidenceTrailProps) {
  const [filterType, setFilterType] = useState<string>('all');

  if (evidence.length === 0) {
    return (
      <div className="p-6 text-center text-xs font-mono text-[var(--color-ink)]/60 border border-[var(--color-ink)]/15 rounded-lg bg-[var(--color-ink)]/[0.02] space-y-2">
        <div className="font-bold uppercase tracking-wider text-[var(--color-ink)]/80">
          Deterministic Mathematical Ledger
        </div>
        <p className="leading-relaxed">
          No evidence records logged yet. Ingest a dataset in Pane 1 to generate traceable mathematical facts.
        </p>
      </div>
    );
  }

  const filteredEvidence = filterType === 'all'
    ? evidence
    : evidence.filter((e) => e.type === filterType);

  return (
    <div className="space-y-3">
      {/* Ledger Header */}
      <div className="space-y-1.5 border-b border-[var(--color-ink)]/15 pb-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-1.5">
            <span>Traceable Evidence Logs</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--color-ink)]/10">
              {evidence.length}
            </span>
          </span>
          <span className="text-[10px] font-mono text-[var(--color-aqi-good)] font-bold">
            ● 100% Deterministic
          </span>
        </div>
        <p className="text-[10px] font-mono text-[var(--color-ink)]/60">
          Cryptographically hashed row provenance for zero-hallucination audits
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-1 text-[10px] font-mono">
        {['all', 'hotspot', 'stat', 'quality', 'trend'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              filterType === type
                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold border-[var(--color-ink)]'
                : 'bg-[var(--color-paper)] text-[var(--color-ink)]/70 border-[var(--color-ink)]/20 hover:border-[var(--color-ink)]/50'
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Scrollable Ledger Feed */}
      <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
        {filteredEvidence.map((ev) => (
          <EvidenceItem
            key={ev.id}
            evidence={ev}
            isHighlighted={highlightedId === ev.id}
          />
        ))}
      </div>
    </div>
  );
}
