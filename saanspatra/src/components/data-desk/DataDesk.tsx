'use client';

import React from 'react';
import { DemoDataButton } from './DemoDataButton';
import { FileUploader } from './FileUploader';
import { PasteArea } from './PasteArea';
import { DataPreview } from './DataPreview';
import { QualityReport } from './QualityReport';
import { Button } from '../ui/Button';
import { CleanedRow, QualityReport as QualityReportType } from '@/lib/cleaning/types';
import { AnalyticsResult } from '@/lib/analytics/types';

interface DataDeskProps {
  onDataLoaded: (raw: string, label: string) => void;
  onGenerateBrief: () => void;
  cleanedRows: CleanedRow[];
  totalRows: number;
  qualityReport: QualityReportType | null;
  analytics: AnalyticsResult | null;
  isLoading: boolean;
  activeLabel?: string;
}

export function DataDesk({
  onDataLoaded,
  onGenerateBrief,
  cleanedRows,
  totalRows,
  qualityReport,
  analytics,
  isLoading,
  activeLabel,
}: DataDeskProps) {
  return (
    <div className="space-y-6">
      {/* Demo Data Quick Load */}
      <div className="space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--color-ink)]/70">
          Built-in Messy Datasets
        </div>
        <DemoDataButton onLoadData={onDataLoaded} disabled={isLoading} />
      </div>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-[var(--color-ink)]/15"></div>
        <span className="flex-shrink mx-3 text-[11px] font-mono uppercase text-[var(--color-ink)]/50">
          or upload your own
        </span>
        <div className="flex-grow border-t border-[var(--color-ink)]/15"></div>
      </div>

      {/* File Upload Zone */}
      <FileUploader
        onFileLoaded={(content, filename) => onDataLoaded(content, `File: ${filename}`)}
        disabled={isLoading}
      />

      {/* Paste Textarea */}
      <PasteArea
        onProcess={(text) => onDataLoaded(text, 'Manual Paste')}
        disabled={isLoading}
      />

      {/* Active dataset indicator */}
      {activeLabel && (
        <div className="p-2.5 bg-[var(--color-marigold)]/15 border border-[var(--color-marigold)] rounded text-xs font-mono flex items-center justify-between">
          <div>
            <span className="font-bold text-[var(--color-ink)]">Active Dataset:</span>{' '}
            <span className="text-[var(--color-ink)]/80">{activeLabel}</span>
          </div>
          {analytics && (
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={onGenerateBrief}
              isLoading={isLoading}
            >
              Generate Brief
            </Button>
          )}
        </div>
      )}

      {/* Data Quality Report */}
      {qualityReport && <QualityReport report={qualityReport} />}

      {/* Cleaned Data Preview Table */}
      {cleanedRows.length > 0 && (
        <DataPreview rows={cleanedRows} totalRows={totalRows} />
      )}
    </div>
  );
}
