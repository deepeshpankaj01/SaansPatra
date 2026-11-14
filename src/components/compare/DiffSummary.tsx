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
    <div className="space-y-4 border-2 border-[var(--color-ink)]/20 p-4 rounded-lg bg-[var(--color-paper)] shadow-xs">
      {/* Header & Regional Delta Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-ink)]/15 pb-3">
        <div>
          <h3 className="font-serif font-bold text-sm text-[var(--color-ink)]">
            Monitoring Cycle Comparison & GrAP Audit
          </h3>
          <p className="text-[10px] font-mono text-[var(--color-ink)]/60">
            Deterministic spatial and temporal delta analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--color-ink)]/70">Regional Delta:</span>
          <span
            className={`font-mono text-xs font-black px-2.5 py-1 rounded-md shadow-xs ${
              isWorse
                ? 'bg-[var(--color-brick)] text-white'
                : isBetter
                  ? 'bg-[var(--color-aqi-good)] text-[var(--color-ink)] font-bold'
                  : 'bg-[var(--color-ink)]/10 text-[var(--color-ink)]'
            }`}
          >
            {formatDelta(diff.overallAQIDelta)} AQI
          </span>
        </div>
      </div>

      {/* Station delta grid */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--color-ink)]/70 flex items-center justify-between">
          <span>Per-Station AQI Changes</span>
          <span className="text-[10px] font-normal text-[var(--color-ink)]/50">
            Period A &rarr; Period B
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
          {diff.stationDeltas.map((sd) => {
            const worsened = sd.delta > 0;
            const improved = sd.delta < 0;

            return (
              <div
                key={sd.stationId}
                className="p-3 border rounded-lg flex items-center justify-between bg-[var(--color-ink)]/[0.02] border-[var(--color-ink)]/15 hover:border-[var(--color-ink)]/30 transition-colors"
              >
                <div>
                  <span className="font-bold text-[var(--color-ink)]">{sd.stationId}</span>
                  <div className="text-[10px] text-[var(--color-ink)]/60 mt-0.5">
                    {sd.previousAQI} ({sd.previousCategory}) &rarr; {sd.currentAQI} ({sd.currentCategory})
                  </div>
                </div>

                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    worsened
                      ? 'text-[var(--color-brick)] bg-[var(--color-brick)]/10 border border-[var(--color-brick)]/20'
                      : improved
                        ? 'text-[var(--color-aqi-good)] bg-[var(--color-aqi-good)]/15 border border-[var(--color-aqi-good)]/30 font-bold'
                        : 'text-[var(--color-ink)]/60 bg-[var(--color-ink)]/5'
                  }`}
                >
                  {formatDelta(sd.delta)} AQI
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hotspots: New vs Resolved */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-[var(--color-ink)]/10 text-xs font-mono">
        <div className="p-2.5 rounded-md bg-[var(--color-brick)]/[0.04] border border-[var(--color-brick)]/20">
          <span className="font-bold text-[var(--color-brick)] uppercase tracking-wider text-[11px] block mb-1">
            New Hotspots ({diff.newHotspots.length})
          </span>
          {diff.newHotspots.length === 0 ? (
            <span className="text-[var(--color-ink)]/50 text-[11px]">None detected &bull; Stable boundaries</span>
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

        <div className="p-2.5 rounded-md bg-[var(--color-aqi-good)]/[0.06] border border-[var(--color-aqi-good)]/20">
          <span className="font-bold text-[var(--color-aqi-good)] uppercase tracking-wider text-[11px] block mb-1">
            Resolved Hotspots ({diff.resolvedHotspots.length})
          </span>
          {diff.resolvedHotspots.length === 0 ? (
            <span className="text-[var(--color-ink)]/50 text-[11px]">None resolved</span>
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
