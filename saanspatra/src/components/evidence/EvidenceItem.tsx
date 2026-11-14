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
    stat: 'Metric Calculation',
    hotspot: 'Spatial Hotspot',
    trend: 'Temporal Trend',
    pattern: 'Hourly Diurnal',
    quality: 'Sensor Audit',
  };

  const typeBadgeColors = {
    stat: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    hotspot: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
    trend: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    pattern: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    quality: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  };

  return (
    <div
      id={`evidence-${evidence.id}`}
      className={`p-3 border-2 rounded-lg transition-all space-y-2 ${
        isHighlighted
          ? 'bg-[var(--color-marigold)]/20 border-[var(--color-marigold)] ring-2 ring-[var(--color-marigold)] shadow-md scale-[1.01]'
          : 'bg-[var(--color-paper)] border-[var(--color-ink)]/15 hover:border-[var(--color-ink)]/40 shadow-xs'
      }`}
      role="article"
      aria-label={`Evidence ${evidence.id}`}
    >
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="font-black px-2 py-0.5 rounded bg-[var(--color-ink)] text-[var(--color-paper)] text-[11px]">
            {evidence.id}
          </span>
          <span
            className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${
              typeBadgeColors[evidence.type] || 'bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            {typeLabels[evidence.type] || 'Data'}
          </span>
        </div>
        {evidence.value !== undefined && (
          <span className="font-mono font-bold text-xs text-[var(--color-ink)] bg-[var(--color-ink)]/5 px-2 py-0.5 rounded border border-[var(--color-ink)]/10">
            Val: {evidence.value}
          </span>
        )}
      </div>

      <p className="text-xs font-sans text-[var(--color-ink)] leading-relaxed font-medium">
        {evidence.description}
      </p>

      {/* Row IDs & Metadata Provenance */}
      <div className="pt-1.5 border-t border-[var(--color-ink)]/10 text-[10px] font-mono text-[var(--color-ink)]/60 flex flex-wrap items-center justify-between gap-1">
        <span>Station: <strong className="text-[var(--color-ink)]">{evidence.stationId || 'All Network'}</strong></span>
        {evidence.rowIds.length > 0 && (
          <span>
            Rows: <code className="text-[var(--color-ink)]">{evidence.rowIds.slice(0, 3).join(', ')}{evidence.rowIds.length > 3 ? '...' : ''}</code>
          </span>
        )}
      </div>
    </div>
  );
}
