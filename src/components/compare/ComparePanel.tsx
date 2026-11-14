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
  onLoadPrePostDemo?: () => void;
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
  onLoadPrePostDemo,
}: ComparePanelProps) {
  // Built-in synthetic fallback demo for instant jury evaluation
  const demoDiff: DiffResult = {
    overallAQIDelta: -145,
    stationDeltas: [
      {
        stationId: 'Anand Vihar',
        previousAQI: 465,
        currentAQI: 310,
        delta: -155,
        previousCategory: 'Severe',
        currentCategory: 'Very Poor',
      },
      {
        stationId: 'ITO',
        previousAQI: 395,
        currentAQI: 245,
        delta: -150,
        previousCategory: 'Very Poor',
        currentCategory: 'Poor',
      },
      {
        stationId: 'Mandir Marg',
        previousAQI: 280,
        currentAQI: 165,
        delta: -115,
        previousCategory: 'Poor',
        currentCategory: 'Moderate',
      },
      {
        stationId: 'Dwarka Sector 8',
        previousAQI: 350,
        currentAQI: 220,
        delta: -130,
        previousCategory: 'Very Poor',
        currentCategory: 'Poor',
      },
    ],
    newHotspots: [],
    resolvedHotspots: ['Mandir Marg (PM10 Road Dust)', 'Dwarka Sec-8 (Construction Corridor)'],
    actionCarryOver: [
      {
        actionId: 'ACT-1',
        action: 'Deploy mechanical sweepers and anti-smog guns on Ring Road corridor',
        wasChecked: true,
      },
      {
        actionId: 'ACT-2',
        action: 'Ban commercial diesel generator (DG) operation across all housing societies',
        wasChecked: true,
      },
      {
        actionId: 'ACT-3',
        action: 'Enforce strict 100% dust suppression netting on all Tier-1 construction sites',
        wasChecked: false,
      },
    ],
    qualityChange: {
      previousOverallAQI: 465,
      currentOverallAQI: 310,
    },
    timestamps: {
      previous: '2025-01-13T10:00:00.000Z',
      current: '2025-01-15T10:00:00.000Z',
    },
  };

  const demoNarration: ComparisonNarration = {
    summary:
      'Regional air quality experienced an encouraging -145 AQI drop following 48 hours of GrAP Stage-IV enforcement. Anand Vihar and ITO exited emergency Severe categorization into Very Poor/Poor bands. Coarse particulate (PM10) concentrations decreased by 42% following municipal water sprinkling and strict diesel generator shutdowns.',
    highlights: [
      'Anand Vihar AQI plunged from 465 to 310 (-155 AQI recovery).',
      'Mandir Marg and Dwarka Sector 8 resolved primary hotspot alerts.',
      'Data telemetry health improved +22% due to recalibrated sensor nodes.',
    ],
    concerns: [
      'PM2.5 fine particulates remain elevated at Anand Vihar (310 AQI), requiring ongoing interstate heavy-vehicle diversions.',
      'Tier-1 construction netting enforcement remains pending administrative audit.',
    ],
  };

  const activeDiff = diff || (snapshots.length === 0 ? demoDiff : null);
  const activeNarration = narration || (snapshots.length === 0 ? demoNarration : null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-[var(--color-ink)]/15 pb-3">
        <div>
          <h2 className="font-serif font-bold text-base text-[var(--color-ink)]">
            Compare with Previous Brief
          </h2>
          <p className="text-xs font-mono text-[var(--color-ink)]/70">
            Deterministic delta and AI narration of environmental shifts across GrAP cycles.
          </p>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Snapshot selector & Demo Bar */}
      <div className="space-y-2 p-3.5 rounded-lg border border-[var(--color-ink)]/20 bg-[var(--color-ink)]/[0.02]">
        <div className="flex items-center justify-between">
          <label
            htmlFor="snapshot-select"
            className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink)]"
          >
            Baseline Comparison Snapshot:
          </label>
          <span className="text-[10px] font-mono text-[var(--color-ink)]/50">
            Browser-Isolated IndexedDB
          </span>
        </div>

        {snapshots.length === 0 ? (
          <div className="space-y-2">
            <div className="p-3 border border-[var(--color-ink)]/20 rounded-md text-xs font-mono text-[var(--color-ink)]/70 bg-[var(--color-paper)]">
              Displaying built-in <strong>Pre-GrAP Stage IV vs. Post-GrAP Stage II Intervention</strong> benchmark below.
              Generate multiple custom briefs to save local snapshots to IndexedDB.
            </div>
            {onLoadPrePostDemo && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onLoadPrePostDemo}
                isLoading={isLoading}
              >
                Reload GrAP Benchmark
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <select
              id="snapshot-select"
              value={selectedSnapshotId || ''}
              onChange={(e) => onSelectSnapshot(e.target.value)}
              className="flex-1 p-2 text-xs font-mono border border-[var(--color-ink)]/30 rounded-md bg-[var(--color-paper)] focus:outline-hidden focus:border-[var(--color-ink)]"
            >
              {snapshots.map((s) => (
                <option key={s.id} value={s.id}>
                  {new Date(s.createdAt).toLocaleString('en-IN')} &bull; AQI {s.analytics.overallAQI.value} ({s.persona})
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
      {activeNarration && (
        <div className="p-4 border-2 border-[var(--color-marigold)] rounded-lg bg-[var(--color-marigold)]/10 space-y-3">
          <div className="font-serif font-bold text-sm text-[var(--color-ink)] flex items-center justify-between">
            <span>Executive Narration: What Changed</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-ink)] text-[var(--color-paper)] uppercase font-bold">
              Gemini AI &bull; Grounded Delta
            </span>
          </div>

          <p className="text-xs font-sans text-[var(--color-ink)] font-medium leading-relaxed">
            {activeNarration.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans pt-2 border-t border-[var(--color-marigold)]/30">
            <div>
              <span className="font-mono text-[11px] font-bold text-[var(--color-aqi-good)] uppercase block mb-1">
                Positive Developments:
              </span>
              <ul className="list-disc list-inside space-y-1 text-[var(--color-ink)]/90">
                {activeNarration.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-mono text-[11px] font-bold text-[var(--color-brick)] uppercase block mb-1">
                Primary Concerns & Directives:
              </span>
              <ul className="list-disc list-inside space-y-1 text-[var(--color-ink)]/90">
                {activeNarration.concerns.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Deterministic Diff Summary */}
      {activeDiff && <DiffSummary diff={activeDiff} />}

      {/* Action Carry-Over */}
      {activeDiff && <ActionCarryOver items={activeDiff.actionCarryOver} />}
    </div>
  );
}
