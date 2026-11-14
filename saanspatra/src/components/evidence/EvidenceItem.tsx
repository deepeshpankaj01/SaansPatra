import React from 'react';
import { Evidence } from '@/lib/analytics/types';

interface EvidenceItemProps {
  evidence: Evidence;
  isHighlighted?: boolean;
}

export function EvidenceItem({
  evidence,
  isHighlighted = false,
}: EvidenceItemProps) {
  const typeLabels = {
    stat: 'Metric',
    hotspot: 'Hotspot',
    trend: 'Trend',
    pattern: 'Hourly',
    quality: 'Quality',
  };

  return (
    <div
      id={`evidence-${evidence.id}`}
      className={`p-3 border rounded transition-all space-y-1.5 ${
        isHighlighted
          ? 'bg-[var(--color-marigold)]/20 border-[var(--color-marigold)] ring-2 ring-[var(--color-marigold)] shadow-xs'
          : 'bg-[var(--color-paper)] border-[var(--color-ink)]/15 hover:border-[var(--color-ink)]/40'
      }`}
      role="article"
      aria-label={`Evidence ${evidence.id}`}
    >
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-bold px-2 py-0.5 rounded bg-[var(--color-ink)] text-[var(--color-paper)]">
          {evidence.id}
        </span>
        <span className="text-[10px] uppercase font-bold text-[var(--color-ink)]/60">
          [{typeLabels[evidence.type] || 'Data'}]
        </span>
      </div>

      <p className="text-xs font-sans text-[var(--color-ink)] leading-snug">
        {evidence.description}
      </p>

      {/* Row IDs & Metadata */}
      <div className="pt-1 border-t border-[var(--color-ink)]/10 text-[10px] font-mono text-[var(--color-ink)]/60 flex flex-wrap items-center justify-between gap-1">
        <span>Station: {evidence.stationId || 'All'}</span>
        {evidence.rowIds.length > 0 && (
          <span>Row IDs: {evidence.rowIds.slice(0, 3).join(', ')}</span>
        )}
      </div>
    </div>
  );
}
