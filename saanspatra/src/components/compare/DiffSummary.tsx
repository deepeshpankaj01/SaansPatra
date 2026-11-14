import React from 'react';
import { DiffResult } from '@/lib/compare/types';
import { formatDelta } from '@/lib/utils/formatting';
import { Badge } from '../ui/Badge';

interface DiffSummaryProps {
  diff: DiffResult;
}

export function DiffSummary({ diff }: DiffSummaryProps) {
  const isWorse = diff.overallAQIDelta > 0;
  const isBetter = diff.overallAQIDelta < 0;

  return (
    <div className="space-y-4 border border-[var(--color-ink)]/20 p-4 rounded bg-[var(--color-paper)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-ink)]/15 pb-2">
        <h3 className="font-serif font-bold text-sm text-[var(--color-ink)]">
          Monitoring Cycle Comparison
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">Regional Delta:</span>
          <span
            className={`font-mono text-xs font-black px-2 py-0.5 rounded ${
              isWorse
                ? 'bg-[var(--color-brick)] text-white'
                : isBetter
                  ? 'bg-[var(--color-aqi-good)] text-[var(--color-ink)]'
                  : 'bg-[var(--color-ink)]/10 text-[var(--color-ink)]'
            }`}
          >
            {formatDelta(diff.overallAQIDelta)} AQI
          </span>
        </div>
      </div>

      {/* Station delta table */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--color-ink)]/70">
          Per-Station AQI Changes
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {diff.stationDeltas.map((sd) => {
            const worsened = sd.delta > 0;
            const improved = sd.delta < 0;

            return (
              <div
                key={sd.stationId}
                className="p-2 border border-[var(--color-ink)]/15 rounded flex items-center justify-between bg-[var(--color-ink)]/[0.02]"
              >
                <div>
                  <span className="font-bold text-[var(--color-ink)]">{sd.stationId}</span>
                  <div className="text-[10px] text-[var(--color-ink)]/60">
                    {sd.previousAQI} ({sd.previousCategory}) → {sd.currentAQI} ({sd.currentCategory})
                  </div>
                </div>

                <span
                  className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                    worsened
                      ? 'text-[var(--color-brick)] bg-[var(--color-brick)]/10'
                      : improved
                        ? 'text-[var(--color-ink)] bg-[var(--color-aqi-good)]/30'
                        : 'text-[var(--color-ink)]/60'
                  }`}
                >
                  {formatDelta(sd.delta)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hotspots: New vs Resolved */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--color-ink)]/10 text-xs font-mono">
        <div>
          <span className="font-bold text-[var(--color-brick)] uppercase tracking-wider text-[11px] block mb-1">
            New Hotspots ({diff.newHotspots.length})
          </span>
          {diff.newHotspots.length === 0 ? (
            <span className="text-[var(--color-ink)]/50">None detected</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {diff.newHotspots.map((h) => (
                <Badge key={h} variant="error">
                  {h}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="font-bold text-[var(--color-aqi-good)] uppercase tracking-wider text-[11px] block mb-1">
            Resolved Hotspots ({diff.resolvedHotspots.length})
          </span>
          {diff.resolvedHotspots.length === 0 ? (
            <span className="text-[var(--color-ink)]/50">None resolved</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {diff.resolvedHotspots.map((h) => (
                <Badge key={h} variant="success">
                  {h}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
