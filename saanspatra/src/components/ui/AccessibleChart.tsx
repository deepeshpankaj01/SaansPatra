'use client';

import React, { useState } from 'react';
import { Table } from './Table';

export interface ChartDatum {
  label: string;
  value: number;
  color?: string;
  patternClass?: string;
  category?: string;
}

interface AccessibleChartProps {
  title: string;
  data: ChartDatum[];
  unit?: string;
  maxValue?: number;
  className?: string;
}

export function AccessibleChart({
  title,
  data,
  unit = '',
  maxValue,
  className = '',
}: AccessibleChartProps) {
  const [showTable, setShowTable] = useState(false);

  const highest = maxValue || Math.max(...data.map((d) => d.value), 1);

  const tableHeaders = ['Station / Category', `Measured Value (${unit || 'Index'})`, 'Classification'];
  const tableRows = data.map((d) => [
    d.label,
    `${d.value} ${unit}`.trim(),
    d.category || 'N/A',
  ]);

  return (
    <div className={`space-y-3 ${className}`} role="region" aria-label={title}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink)]">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          className="text-xs font-mono underline hover:text-[var(--color-brick)] min-h-[32px] px-2 py-1"
          aria-expanded={showTable}
        >
          {showTable ? 'Switch to Bar Visual' : 'View Data Table'}
        </button>
      </div>

      {showTable ? (
        <Table headers={tableHeaders} rows={tableRows} caption={title} />
      ) : (
        <div className="space-y-2 border border-[var(--color-ink)]/15 p-3 rounded bg-[var(--color-paper)]">
          {data.map((item, idx) => {
            const pct = Math.min(100, Math.round((item.value / highest) * 100));
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-medium text-[var(--color-ink)]">{item.label}</span>
                  <span className="font-bold">
                    {item.value} {unit} {item.category ? `(${item.category})` : ''}
                  </span>
                </div>
                <div className="w-full h-4 bg-[var(--color-ink)]/10 rounded overflow-hidden flex border border-[var(--color-ink)]/20">
                  <div
                    className={`h-full ${item.patternClass || ''}`}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: item.color || 'var(--color-marigold)',
                    }}
                    role="img"
                    aria-label={`${item.label}: ${item.value} ${unit}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
