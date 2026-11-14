import React from 'react';
import { QualityReport as QualityReportType } from '@/lib/cleaning/types';
import { AccessibleChart } from '../ui/AccessibleChart';
import { Badge } from '../ui/Badge';

interface QualityReportProps {
  report: QualityReportType;
}

export function QualityReport({ report }: QualityReportProps) {
  const chartData = Object.entries(report.stationReliability).map(([st, score]) => ({
    label: st,
    value: score,
    category: score >= 80 ? 'High' : score >= 50 ? 'Moderate' : 'Low',
    color: score >= 80 ? 'var(--color-aqi-good)' : score >= 50 ? 'var(--color-marigold)' : 'var(--color-brick)',
  }));

  return (
    <div className="space-y-4 border border-[var(--color-ink)]/20 p-4 rounded bg-[var(--color-ink)]/[0.02]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-ink)]/10 pb-3">
        <h3 className="font-serif font-bold text-sm text-[var(--color-ink)]">
          Data Quality & Reliability Audit
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">Overall Reliability:</span>
          <Badge
            variant={
              report.overallReliability >= 80
                ? 'success'
                : report.overallReliability >= 50
                  ? 'warning'
                  : 'error'
            }
            size="md"
          >
            {report.overallReliability}%
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-2 border border-[var(--color-ink)]/10 rounded bg-[var(--color-paper)]">
          <div className="text-[var(--color-ink)]/60 text-[10px] uppercase">Total Readings</div>
          <div className="text-base font-bold text-[var(--color-ink)]">{report.totalRows}</div>
        </div>
        <div className="p-2 border border-[var(--color-ink)]/10 rounded bg-[var(--color-paper)]">
          <div className="text-[var(--color-ink)]/60 text-[10px] uppercase">Flagged Readings</div>
          <div className="text-base font-bold text-[var(--color-brick)]">{report.flaggedRows}</div>
        </div>
        <div className="p-2 border border-[var(--color-ink)]/10 rounded bg-[var(--color-paper)] col-span-2 sm:col-span-1">
          <div className="text-[var(--color-ink)]/60 text-[10px] uppercase">Clean Rows</div>
          <div className="text-base font-bold text-[var(--color-ink)]">
            {report.totalRows - report.flaggedRows}
          </div>
        </div>
      </div>

      {/* Flag reason breakdown */}
      {Object.keys(report.flagCounts).length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--color-ink)]/70">
            Detected Anomaly Breakdown
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(report.flagCounts).map(([reason, count]) => (
              <span
                key={reason}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-mono border rounded bg-[var(--color-paper)] border-[var(--color-ink)]/20"
              >
                <span className="font-bold text-[var(--color-ink)]">{reason}:</span>
                <span className="text-[var(--color-brick)] font-bold">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Station reliability bar visual */}
      <AccessibleChart
        title="Reliability Score per Monitoring Station"
        data={chartData}
        unit="%"
        maxValue={100}
      />
    </div>
  );
}
