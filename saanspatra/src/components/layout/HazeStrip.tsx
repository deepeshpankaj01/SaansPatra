import React from 'react';
import { getCategory, AQI_COLORS, AQI_TEXT_COLORS, AQI_PATTERNS } from '@/lib/analytics/breakpoints';

interface HazeStripProps {
  values?: number[];
  labels?: string[];
  height?: string;
  className?: string;
}

export function HazeStrip({
  values,
  labels,
  height = 'h-3',
  className = '',
}: HazeStripProps) {
  // If specific time-series values provided, render discrete segmented strip
  if (values && values.length > 0) {
    return (
      <div
        className={`w-full flex overflow-hidden rounded border border-[var(--color-ink)]/20 ${className}`}
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
              className={`flex-1 ${height} flex items-center justify-center relative ${pattern}`}
              style={{ backgroundColor: bg }}
              title={`AQI ${aqi} (${category})`}
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
    );
  }

  // Otherwise render full continuous gradient haze strip
  return (
    <div
      className={`haze-strip ${height} ${className}`}
      role="img"
      aria-label="CPCB AQI Haze Scale from Good (green) to Severe (dark purple)"
    />
  );
}
