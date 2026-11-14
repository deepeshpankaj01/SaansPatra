'use client';

import React, { useState } from 'react';
import { HotspotEntry } from '@/lib/analytics/types';
import { AQI_COLORS, AQI_PATTERNS } from '@/lib/analytics/breakpoints';
import { Badge } from '../ui/Badge';

interface HotspotMapProps {
  hotspots: HotspotEntry[];
}

export const HotspotMap = React.memo(function HotspotMap({ hotspots }: HotspotMapProps) {
  const [selectedStation, setSelectedStation] = useState<string | null>(
    hotspots[0]?.stationId || null
  );

  if (hotspots.length === 0) return null;

  // Radar geometry
  const size = 260;
  const center = size / 2;
  const maxRadius = center - 24;

  // Plot stations radially
  const angleStep = (2 * Math.PI) / Math.max(hotspots.length, 1);
  const nodes = hotspots.map((h, i) => {
    const angle = i * angleStep - Math.PI / 2;
    // Radial distance normalized to max AQI 500
    const distance = Math.min(maxRadius, Math.max(20, (h.aqi / 500) * maxRadius));
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { ...h, x, y, angle };
  });

  const activeNode = nodes.find((n) => n.stationId === selectedStation) || nodes[0];

  return (
    <div className="space-y-4 border border-[var(--color-ink)]/20 p-4 rounded-lg bg-[var(--color-ink)]/[0.02]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-ink)]/10 pb-3">
        <div>
          <h3 className="font-serif font-bold text-base text-[var(--color-ink)]">
            Local Pollution Hotspot Radar
          </h3>
          <p className="text-xs font-mono text-[var(--color-ink)]/60">
            Ranked by Severity &bull; Exposure Duration &bull; CAAQMS Sensor Nodes
          </p>
        </div>
        <Badge variant="warning" size="sm">
          {hotspots.length} Priority Hotspots
        </Badge>
      </div>

      {/* Interactive Radar & Inspector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* SVG Atmospheric Radar Scope */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-2 rounded-lg bg-[var(--color-paper)] border border-[var(--color-ink)]/15">
          <svg
            className="w-full max-w-[240px] aspect-square select-none"
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label="Geospatial radar showing air quality distribution across monitoring stations"
          >
            {/* Concentric AQI Threshold Circles */}
            <circle
              cx={center}
              cy={center}
              r={maxRadius}
              fill="none"
              stroke="var(--color-aqi-severe)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.3"
            />
            <circle
              cx={center}
              cy={center}
              r={maxRadius * 0.8}
              fill="none"
              stroke="var(--color-aqi-very-poor)"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.3"
            />
            <circle
              cx={center}
              cy={center}
              r={maxRadius * 0.6}
              fill="none"
              stroke="var(--color-aqi-poor)"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.3"
            />
            <circle
              cx={center}
              cy={center}
              r={maxRadius * 0.4}
              fill="none"
              stroke="var(--color-aqi-moderate)"
              strokeWidth="1"
              opacity="0.35"
            />
            <circle
              cx={center}
              cy={center}
              r={maxRadius * 0.2}
              fill="none"
              stroke="var(--color-aqi-good)"
              strokeWidth="1.2"
              opacity="0.4"
            />

            {/* Radar Spokes */}
            {nodes.map((n, i) => (
              <line
                key={`spoke-${i}`}
                x1={center}
                y1={center}
                x2={center + maxRadius * Math.cos(n.angle)}
                y2={center + maxRadius * Math.sin(n.angle)}
                stroke="currentColor"
                strokeWidth="1"
                className="text-[var(--color-ink)]/10"
              />
            ))}

            {/* Center Axis Pin */}
            <circle cx={center} cy={center} r={3} fill="currentColor" className="text-[var(--color-ink)]/50" />

            {/* Station Nodes */}
            {nodes.map((n, i) => {
              const isSelected = n.stationId === selectedStation;
              const isPeak = i === 0;
              const color = AQI_COLORS[n.category] || 'var(--color-brick)';

              return (
                <g
                  key={n.stationId}
                  className="cursor-pointer group"
                  onClick={() => setSelectedStation(n.stationId)}
                >
                  {/* Pulsing ring for peak hotspot */}
                  {isPeak && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={14}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}

                  {/* Active selection glow */}
                  {isSelected && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={12}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[var(--color-ink)]"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isSelected ? 8 : 6}
                    fill={color}
                    stroke="var(--color-paper)"
                    strokeWidth="2"
                    className="transition-transform duration-200 group-hover:scale-125"
                  />

                  {/* Label */}
                  <text
                    x={n.x}
                    y={n.y - 10}
                    textAnchor="middle"
                    className="font-mono text-[9px] font-bold fill-current text-[var(--color-ink)] select-none drop-shadow-xs"
                  >
                    {n.stationId.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="flex items-center justify-between w-full px-2 pt-1 text-[9px] font-mono text-[var(--color-ink)]/50">
            <span>Center = CPCB Good (0)</span>
            <span>Outer Ring = Severe (500)</span>
          </div>
        </div>

        {/* Selected Station Telemetry Card */}
        <div className="md:col-span-6 space-y-3">
          {activeNode && (
            <div className="p-3.5 rounded-lg border border-[var(--color-ink)]/20 bg-[var(--color-paper)] space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--color-ink)]/50">
                    Station Inspector
                  </span>
                  <h4 className="font-serif font-bold text-base text-[var(--color-ink)]">
                    {activeNode.stationId}
                  </h4>
                </div>
                <Badge
                  variant={
                    activeNode.category === 'Severe' || activeNode.category === 'Very Poor'
                      ? 'error'
                      : 'warning'
                  }
                  size="md"
                >
                  AQI {activeNode.aqi} &bull; {activeNode.category}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-[var(--color-ink)]/[0.03] border border-[var(--color-ink)]/10">
                  <div className="text-[10px] text-[var(--color-ink)]/50 uppercase">
                    Dominant Driver
                  </div>
                  <div className="font-bold text-[var(--color-ink)] mt-0.5">
                    {activeNode.dominant.toUpperCase()}
                  </div>
                </div>
                <div className="p-2 rounded bg-[var(--color-ink)]/[0.03] border border-[var(--color-ink)]/10">
                  <div className="text-[10px] text-[var(--color-ink)]/50 uppercase">
                    Hotspot Score
                  </div>
                  <div className="font-bold text-[var(--color-brick)] mt-0.5">
                    {activeNode.score}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[var(--color-ink)]/60">
                <span>Exposure Duration: <strong>{activeNode.duration} hrs</strong></span>
                <span>Confidence: <strong>{Math.round(activeNode.dataConfidence * 100)}%</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ranked Hotspots List */}
      <div className="space-y-2 pt-1">
        <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--color-ink)]/70">
          Ranked Hotspot Hierarchy
        </div>
        <div className="space-y-1.5">
          {hotspots.map((h, rank) => {
            const isSelected = h.stationId === selectedStation;
            const pct = Math.min(100, Math.round((h.aqi / 500) * 100));
            const color = AQI_COLORS[h.category] || 'var(--color-brick)';

            return (
              <div
                key={h.stationId}
                onClick={() => setSelectedStation(h.stationId)}
                className={`p-2.5 rounded-md border cursor-pointer transition-colors text-xs font-mono ${
                  isSelected
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)]/[0.04]'
                    : 'border-[var(--color-ink)]/15 hover:border-[var(--color-ink)]/40 bg-[var(--color-paper)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--color-ink)]/10 text-[var(--color-ink)] inline-flex items-center justify-center text-[10px] font-bold">
                      #{rank + 1}
                    </span>
                    <span className="font-bold text-[var(--color-ink)]">{h.stationId}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--color-ink)]/10 text-[var(--color-ink)]/70">
                      {h.dominant.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-bold" style={{ color }}>
                    AQI {h.aqi} ({h.category})
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-[var(--color-ink)]/10 overflow-hidden">
                  <div
                    className={`h-full ${AQI_PATTERNS[h.category] || ''}`}
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
