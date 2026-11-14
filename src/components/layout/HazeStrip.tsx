import React from 'react';
import {
  getCategory,
  AQI_COLORS,
  AQI_TEXT_COLORS,
  AQI_PATTERNS,
} from '@/lib/analytics/breakpoints';

interface HazeStripProps {
  values?: number[];
  labels?: string[];
  height?: string;
  className?: string;
  activeAqi?: number;
  activeStation?: string;
}

export function HazeStrip({
  values,
  labels,
  height = 'h-2.5',
  className = '',
  activeAqi,
  activeStation,
}: HazeStripProps) {
  // If specific time-series values provided, render discrete segmented strip
  if (values && values.length > 0) {
    return (
      <div className={`w-full flex flex-col ${className}`}>
        <div
          className={`w-full flex overflow-hidden border-y border-[var(--color-ink)]/20 ${height}`}
          role="img"
          aria-label={`Air quality progression across ${values.length} observations`}
        >
          {values.map((aqi, idx) => {
            const category = getCategory(aqi);
            const bg = AQI_COLORS[category];
            const fg = AQI_TEXT_COLORS[category];
            const pattern = AQI_PATTERNS[category];
            const label = labels?.[idx] || `${aqi}`;

            return (
              <div
                key={idx}
                className={`flex-1 ${height} flex items-center justify-center relative ${pattern} transition-all duration-300 hover:brightness-110`}
                style={{ backgroundColor: bg }}
                title={`Reading ${idx + 1}: AQI ${aqi} (${category})`}
              >
                <span
                  className="text-[9px] font-mono font-bold select-none opacity-80"
                  style={{ color: fg }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Continuous gradient haze strip with animated scanning pulse
  const maxAqi = activeAqi ?? 345;
  const activeCategory = getCategory(maxAqi);

  return (
    <div className={`relative w-full overflow-hidden border-y border-[var(--color-ink)]/15 ${className}`}>
      <div
        className={`haze-strip ${height} w-full`}
        role="img"
        aria-label={`CPCB National Air Quality Scale (Current status: ${activeCategory}, AQI ${maxAqi})`}
      />
      {activeAqi !== undefined && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-3 text-[9px] font-mono font-bold text-[var(--color-paper)] drop-shadow-xs">
          <span>
            ATMOSPHERIC TELEMETRY: {activeCategory.toUpperCase()} (AQI {activeAqi})
          </span>
          {activeStation && <span>CAAQMS: {activeStation.toUpperCase()}</span>}
        </div>
      )}
    </div>
  );
}
