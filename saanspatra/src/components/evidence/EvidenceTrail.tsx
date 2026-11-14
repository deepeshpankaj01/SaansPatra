'use client';

import React from 'react';
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
  if (evidence.length === 0) {
    return (
      <div className="p-4 text-center text-xs font-mono text-[var(--color-ink)]/60">
        No evidence trail generated yet. Load data and run an analysis to view traceable records.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono border-b border-[var(--color-ink)]/15 pb-2">
        <span className="font-bold uppercase tracking-wider text-[var(--color-ink)]">
          Traceable Evidence Logs ({evidence.length})
        </span>
      </div>

      <div className="space-y-2.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
        {evidence.map((ev) => (
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
