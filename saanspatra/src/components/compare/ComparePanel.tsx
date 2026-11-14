'use client';

import React from 'react';
import { DiffSummary } from './DiffSummary';
import { ActionCarryOver } from './ActionCarryOver';
import { DiffResult, BriefSnapshot } from '@/lib/compare/types';
import { ComparisonNarration } from '@/lib/gemini/schemas';
import { Button } from '../ui/Button';

interface ComparePanelProps {
  diff: DiffResult | null;
  narration: ComparisonNarration | null;
  snapshots: BriefSnapshot[];
  selectedSnapshotId?: string;
  onSelectSnapshot: (id: string) => void;
  onCompare: () => void;
  isLoading: boolean;
  onClose: () => void;
}

export function ComparePanel({
  diff,
  narration,
  snapshots,
  selectedSnapshotId,
  onSelectSnapshot,
  onCompare,
  isLoading,
  onClose,
}: ComparePanelProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-[var(--color-ink)]/15 pb-3">
        <div>
          <h2 className="font-serif font-bold text-base text-[var(--color-ink)]">
            Compare with Previous Brief
          </h2>
          <p className="text-xs font-mono text-[var(--color-ink)]/70">
            Deterministic delta and AI narration of environmental shifts.
          </p>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Snapshot selector */}
      <div className="space-y-2">
        <label
          htmlFor="snapshot-select"
          className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink)]"
        >
          Select Baseline Snapshot (IndexedDB):
        </label>

        {snapshots.length === 0 ? (
          <div className="p-3 border border-[var(--color-ink)]/20 rounded text-xs font-mono text-[var(--color-ink)]/60 bg-[var(--color-ink)]/[0.02]">
            No previous snapshots saved in browser storage yet. Generate a brief first to save a baseline!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <select
              id="snapshot-select"
              value={selectedSnapshotId || ''}
              onChange={(e) => onSelectSnapshot(e.target.value)}
              className="flex-1 p-2 text-xs font-mono border border-[var(--color-ink)]/30 rounded bg-[var(--color-paper)] focus:outline-hidden focus:border-[var(--color-ink)]"
            >
              {snapshots.map((s) => (
                <option key={s.id} value={s.id}>
                  {new Date(s.createdAt).toLocaleString('en-IN')} | AQI {s.analytics.overallAQI.value} ({s.persona})
                </option>
              ))}
            </select>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onCompare}
              isLoading={isLoading}
              disabled={!selectedSnapshotId}
            >
              Run Comparison
            </Button>
          </div>
        )}
      </div>

      {/* Narration of "What Changed" */}
      {narration && (
        <div className="p-4 border-2 border-[var(--color-marigold)] rounded bg-[var(--color-marigold)]/10 space-y-3">
          <div className="font-serif font-bold text-sm text-[var(--color-ink)] flex items-center justify-between">
            <span>Executive Narration: What Changed</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-ink)] text-[var(--color-paper)] uppercase">
              Gemini AI
            </span>
          </div>

          <p className="text-xs font-sans text-[var(--color-ink)] font-medium leading-relaxed">
            {narration.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans pt-2 border-t border-[var(--color-marigold)]/30">
            <div>
              <span className="font-mono text-[11px] font-bold text-[var(--color-aqi-good)] uppercase block mb-1">
                Positive Developments:
              </span>
              <ul className="list-disc list-inside space-y-1 text-[var(--color-ink)]/90">
                {narration.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-mono text-[11px] font-bold text-[var(--color-brick)] uppercase block mb-1">
                Primary Concerns:
              </span>
              <ul className="list-disc list-inside space-y-1 text-[var(--color-ink)]/90">
                {narration.concerns.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Deterministic Diff Summary */}
      {diff && <DiffSummary diff={diff} />}

      {/* Action Carry-Over */}
      {diff && <ActionCarryOver items={diff.actionCarryOver} />}
    </div>
  );
}
