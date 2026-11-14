'use client';

import React from 'react';
import { QualityReport as QualityReportType } from '@/lib/cleaning/types';
import { AccessibleChart } from '../ui/AccessibleChart';
import { Badge } from '../ui/Badge';

interface QualityReportProps {
  report: QualityReportType;
}

export const QualityReport = React.memo(function QualityReport({ report }: QualityReportProps) {
  const chartData = Object.entries(report.stationReliability).map(([st, score]) => ({
    label: st,
    value: score,
    category: score >= 80 ? 'High' : score >= 50 ? 'Moderate' : 'Low',
    color:
      score >= 80
        ? 'var(--color-aqi-good)'
        : score >= 50
          ? 'var(--color-marigold)'
          : 'var(--color-brick)',
  }));

  const cleanRows = report.totalRows - report.flaggedRows;
  const cleanRate = report.totalRows > 0 ? Math.round((cleanRows / report.totalRows) * 100) : 100;

  // SVG Gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (report.overallReliability / 100) * circumference;

  const getReliabilityColor = (val: number) => {
    if (val >= 80) return 'var(--color-aqi-good)';
    if (val >= 50) return 'var(--color-marigold)';
    return 'var(--color-brick)';
  };

  return (
    <div className="space-y-4 border border-[var(--color-ink)]/20 p-5 rounded-lg bg-[var(--color-ink)]/[0.02]">
      {/* Header with Title and Gauge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-ink)]/10 pb-4">
        <div>
          <h3 className="font-serif font-bold text-base text-[var(--color-ink)]">
            Data Quality & Reliability Audit
          </h3>
          <p className="text-xs font-mono text-[var(--color-ink)]/60 mt-0.5">
            Deterministic pre-processing & anomaly forensics report
          </p>
        </div>

        {/* Circular Reliability Gauge */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 96 96" aria-hidden="true">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                className="text-[var(--color-ink)]/10"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke={getReliabilityColor(report.overallReliability)}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute font-mono font-bold text-xs text-[var(--color-ink)]">
              {report.overallReliability}%
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-[10px] uppercase text-[var(--color-ink)]/50 block">
              Confidence Index
            </span>
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
              {report.overallReliability >= 80
                ? 'High Reliability'
                : report.overallReliability >= 50
                  ? 'Moderate Drift'
                  : 'Critical Flags'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Forensic Metric Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-3 border border-[var(--color-ink)]/10 rounded-md bg-[var(--color-paper)]">
          <div className="text-[var(--color-ink)]/60 text-[10px] uppercase tracking-wider">
            Total Ingested
          </div>
          <div className="text-lg font-bold text-[var(--color-ink)] mt-0.5">
            {report.totalRows}
          </div>
          <div className="text-[10px] text-[var(--color-ink)]/50 mt-0.5">Telemetry rows</div>
        </div>

        <div className="p-3 border border-[var(--color-ink)]/10 rounded-md bg-[var(--color-paper)]">
          <div className="text-[var(--color-ink)]/60 text-[10px] uppercase tracking-wider">
            Clean Readings
          </div>
          <div className="text-lg font-bold text-[var(--color-aqi-good)] mt-0.5">
            {cleanRows}
          </div>
          <div className="text-[10px] text-[var(--color-ink)]/50 mt-0.5">{cleanRate}% pristine</div>
        </div>

        <div className="p-3 border border-[var(--color-ink)]/10 rounded-md bg-[var(--color-paper)]">
          <div className="text-[var(--color-ink)]/60 text-[10px] uppercase tracking-wider">
            Flagged Anomalies
          </div>
          <div className="text-lg font-bold text-[var(--color-brick)] mt-0.5">
            {report.flaggedRows}
          </div>
          <div className="text-[10px] text-[var(--color-ink)]/50 mt-0.5">10-rule detection</div>
        </div>

        <div className="p-3 border border-[var(--color-ink)]/10 rounded-md bg-[var(--color-paper)]">
          <div className="text-[var(--color-ink)]/60 text-[10px] uppercase tracking-wider">
            Active Stations
          </div>
          <div className="text-lg font-bold text-[var(--color-ink)] mt-0.5">
            {Object.keys(report.stationReliability).length}
          </div>
          <div className="text-[10px] text-[var(--color-ink)]/50 mt-0.5">CAAQMS nodes</div>
        </div>
      </div>

      {/* Detected Anomaly Breakdown */}
      {Object.keys(report.flagCounts).length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--color-ink)]/70 flex items-center justify-between">
            <span>Detected Anomaly Breakdown</span>
            <span className="text-[10px] font-normal text-[var(--color-ink)]/50">
              ISO-Deterministic Flagger
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(report.flagCounts).map(([reason, count]) => {
              const isSevere =
                reason === 'SENTINEL' ||
                reason === 'STUCK_SENSOR' ||
                reason === 'SPIKE' ||
                reason === 'NEGATIVE';
              return (
                <span
                  key={reason}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border rounded-md bg-[var(--color-paper)] ${
                    isSevere
                      ? 'border-[var(--color-brick)]/40 text-[var(--color-brick)]'
                      : 'border-[var(--color-ink)]/20 text-[var(--color-ink)]'
                  }`}
                >
                  <span className="font-bold">{reason}:</span>
                  <span className="font-bold underline">{count}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Station reliability bar visual */}
      <div className="pt-2">
        <AccessibleChart
          title="Reliability Score per Monitoring Station"
          data={chartData}
          unit="%"
          maxValue={100}
        />
      </div>
    </div>
  );
});
