'use client';

import React from 'react';
import { DemoDataButton } from './DemoDataButton';
import { FileUploader } from './FileUploader';
import { PasteArea } from './PasteArea';
import { DataPreview } from './DataPreview';
import { QualityReport } from './QualityReport';
import { HeroWelcome } from '../layout/HeroWelcome';
import { Button } from '../ui/Button';
import { CleanedRow, QualityReport as QualityReportType } from '@/lib/cleaning/types';
import { AnalyticsResult } from '@/lib/analytics/types';

interface DataDeskProps {
  onDataLoaded: (raw: string, label: string) => void;
  onGenerateBrief: () => void;
  onNavigateToBrief?: () => void;
  cleanedRows: CleanedRow[];
  totalRows: number;
  qualityReport: QualityReportType | null;
  analytics: AnalyticsResult | null;
  isLoading: boolean;
  activeLabel?: string;
  onResetData?: () => void;
}

export function DataDesk({
  onDataLoaded,
  onGenerateBrief,
  onNavigateToBrief,
  cleanedRows,
  totalRows,
  qualityReport,
  analytics,
  isLoading,
  activeLabel,
  onResetData,
}: DataDeskProps) {
  const isDataActive = cleanedRows.length > 0;

  const handleProceedToBrief = () => {
    onGenerateBrief();
    onNavigateToBrief?.();
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner (Visible when no data is loaded or for fast quickstart) */}
      {!isDataActive && (
        <HeroWelcome onLoadData={onDataLoaded} disabled={isLoading} />
      )}

      {/* Ingestion Console Card */}
      <div className="p-6 rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-ink)]/10 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[var(--color-ink)] flex items-center gap-2">
              <span>Telemetry Ingestion & Delimiter Normalization</span>
            </h3>
            <p className="text-xs font-mono text-[var(--color-ink)]/60 mt-0.5">
              Supports CSV, TSV, JSON &bull; Auto-Sniffing &bull; Header Synonyms &bull; Max 5,000 Rows
            </p>
          </div>

          {isDataActive && onResetData && (
            <button
              type="button"
              onClick={onResetData}
              className="px-3 py-1.5 text-xs font-mono font-bold text-[var(--color-brick)] border border-[var(--color-brick)]/30 rounded-lg hover:bg-[var(--color-brick)]/10 transition-all cursor-pointer"
            >
              &larr; Switch / Ingest New Dataset
            </button>
          )}
        </div>

        {/* Ingestion Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Demo Benchmarks & Live Telemetry Picker */}
          <div className="p-4 rounded-xl border border-[var(--color-ink)]/15 bg-[var(--color-ink)]/[0.02] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--color-ink)]/80">
                1. Ready-To-Test Benchmarks
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-ink)]/10">
                10 Indian Cities
              </span>
            </div>
            <p className="text-[11px] font-sans text-[var(--color-ink)]/70">
              Load official hackathon edge cases (mixed units, stuck sensor flatlines, date chaos) or query live CAAQMS monitors.
            </p>
            <DemoDataButton onLoadData={onDataLoaded} disabled={isLoading} />
          </div>

          {/* File Upload Zone */}
          <div className="p-4 rounded-xl border border-[var(--color-ink)]/15 bg-[var(--color-ink)]/[0.02] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--color-ink)]/80">
                2. Custom File Upload
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-ink)]/10">
                Drag & Drop
              </span>
            </div>
            <FileUploader
              onFileLoaded={(content, filename) => onDataLoaded(content, `File: ${filename}`)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Paste Area Collapsible/Accordion */}
        <div className="pt-1">
          <PasteArea
            onProcess={(text) => onDataLoaded(text, 'Manual Paste')}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Active dataset indicator bar */}
      {activeLabel && (
        <div className="p-4 rounded-2xl bg-[var(--color-marigold)]/15 border-2 border-[var(--color-marigold)] text-xs font-mono flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[var(--color-aqi-good)] animate-ping" />
            <div>
              <span className="font-bold text-[var(--color-ink)] text-sm">Active Dataset:</span>{' '}
              <span className="text-[var(--color-ink)] font-semibold">{activeLabel}</span>
              <div className="text-[10px] text-[var(--color-ink)]/70 mt-0.5">
                {cleanedRows.length} cleaned records &bull; Verified against CPCB breakpoints
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {analytics && (
              <Button
                type="button"
                size="md"
                variant="primary"
                onClick={handleProceedToBrief}
                isLoading={isLoading}
                className="shadow-sm font-bold"
              >
                Generate Brief & Hotspots &rarr;
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Forensic Quality Audit Report */}
      {qualityReport && (
        <div className="rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] p-6 shadow-sm">
          <QualityReport report={qualityReport} />
        </div>
      )}

      {/* Cleaned Data Preview Table */}
      {cleanedRows.length > 0 && (
        <div className="rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] p-6 shadow-sm">
          <DataPreview rows={cleanedRows} totalRows={totalRows} />
        </div>
      )}

      {/* Prominent Next-Step CTA Card when data is ready */}
      {isDataActive && analytics && (
        <div className="p-6 rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-marigold)] font-bold">
              Data Audit Complete &bull; CPCB AQI Calculated
            </div>
            <h4 className="font-serif font-bold text-xl text-[var(--color-paper)]">
              Ready to Generate Executive Intelligence?
            </h4>
            <p className="text-xs font-sans text-[var(--color-paper)]/80 max-w-xl">
              Proceed to the Policy Brief studio to view the Geospatial Hotspot Scope, tailored persona action directives, and grounded findings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleProceedToBrief}
            className="px-6 py-3.5 rounded-xl bg-[var(--color-marigold)] text-[var(--color-ink)] font-mono font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>Step 2: Generate Executive Policy Brief & Hotspot Map &rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
}
