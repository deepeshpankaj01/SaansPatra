import React from 'react';
import { HotspotEntry } from '@/lib/analytics/types';
import { AccessibleChart } from '../ui/AccessibleChart';
import { AQI_COLORS, AQI_PATTERNS } from '@/lib/analytics/breakpoints';

interface HotspotMapProps {
  hotspots: HotspotEntry[];
}

export function HotspotMap({ hotspots }: HotspotMapProps) {
  if (hotspots.length === 0) return null;

  const chartData = hotspots.map((h) => ({
    label: `${h.stationId} (Dominant: ${h.dominant.toUpperCase()})`,
    value: h.aqi,
    category: h.category,
    color: AQI_COLORS[h.category],
    patternClass: AQI_PATTERNS[h.category],
  }));

  return (
    <div className="space-y-3 border border-[var(--color-ink)]/20 p-4 rounded bg-[var(--color-ink)]/[0.02]">
      <div className="flex items-center justify-between border-b border-[var(--color-ink)]/10 pb-2">
        <h3 className="font-serif font-bold text-sm text-[var(--color-ink)]">
          Local Pollution Hotspot Rankings
        </h3>
        <span className="text-[11px] font-mono text-[var(--color-ink)]/70">
          Ranked by Severity x Exposure Duration x Confidence
        </span>
      </div>

      <AccessibleChart
        title="Hotspot Severity by Station AQI"
        data={chartData}
        unit="AQI"
        maxValue={500}
      />
    </div>
  );
}
