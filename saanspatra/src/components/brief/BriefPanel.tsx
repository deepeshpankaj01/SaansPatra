'use client';

import React, { useState } from 'react';
import { PersonaSelector } from './PersonaSelector';
import { VerificationBanner } from './VerificationBanner';
import { FindingsCard } from './FindingsCard';
import { ActionsCard } from './ActionsCard';
import { HotspotMap } from './HotspotMap';
import { CitizenAdvisory } from '../advisory/CitizenAdvisory';
import { Button } from '../ui/Button';
import { BriefingResponse } from '@/lib/gemini/schemas';
import { ValidationReport } from '@/lib/grounding/validator';
import { AnalyticsResult } from '@/lib/analytics/types';
import { PersonaId, PERSONAS } from '@/lib/persona/types';
import { ReadingLevel } from '@/lib/gemini/translation';

interface BriefPanelProps {
  briefing: BriefingResponse | null;
  validation: ValidationReport | null;
  analytics: AnalyticsResult | null;
  selectedPersona: PersonaId;
  onSelectPersona: (persona: PersonaId) => void;
  checkedActionIds: string[];
  onToggleAction: (actionText: string) => void;
  onSelectEvidence?: (evidenceId: string) => void;
  onOpenCompare: () => void;
  advisoryText: string;
  currentLanguage: string;
  currentReadingLevel: ReadingLevel;
  onLanguageChange: (lang: string) => void;
  onReadingLevelChange: (level: ReadingLevel) => void;
  isTranslating: boolean;
  isFallback: boolean;
  onPrint: () => void;
}

export function BriefPanel({
  briefing,
  validation,
  analytics,
  selectedPersona,
  onSelectPersona,
  checkedActionIds,
  onToggleAction,
  onSelectEvidence,
  onOpenCompare,
  advisoryText,
  currentLanguage,
  currentReadingLevel,
  onLanguageChange,
  onReadingLevelChange,
  isTranslating,
  isFallback,
  onPrint,
}: BriefPanelProps) {
  const [activeView, setActiveView] = useState<'internal' | 'advisory'>('internal');

  if (!analytics || !briefing) {
    return (
      <div className="p-8 text-center space-y-4 border border-[var(--color-ink)]/20 rounded bg-[var(--color-ink)]/[0.02]">
        <div className="font-serif font-bold text-lg text-[var(--color-ink)]">
          No Briefing Active
        </div>
        <p className="text-xs font-mono text-[var(--color-ink)]/70 max-w-sm mx-auto leading-relaxed">
          Select or upload an air quality dataset in the Data Desk (Pane 1) and click &quot;Generate Brief&quot; to produce an intelligence briefing.
        </p>
      </div>
    );
  }

  const personaMeta = PERSONAS[selectedPersona];

  return (
    <div className="space-y-6">
      {/* Top Controls: Persona & View Switcher */}
      <div className="space-y-3">
        <PersonaSelector
          selectedPersona={selectedPersona}
          onSelectPersona={onSelectPersona}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-ink)]/15 pb-2">
          {/* Sub-view switcher */}
          <div className="inline-flex rounded border border-[var(--color-ink)]/20 p-0.5 bg-[var(--color-paper)]" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'internal'}
              onClick={() => setActiveView('internal')}
              className={`px-3 py-1.5 text-xs font-mono rounded min-h-[38px] ${
                activeView === 'internal'
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold'
                  : 'text-[var(--color-ink)] hover:bg-[var(--color-ink)]/10'
              }`}
            >
              Internal Briefing Note
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'advisory'}
              onClick={() => setActiveView('advisory')}
              className={`px-3 py-1.5 text-xs font-mono rounded min-h-[38px] ${
                activeView === 'advisory'
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold'
                  : 'text-[var(--color-ink)] hover:bg-[var(--color-ink)]/10'
              }`}
            >
              Citizen Advisory
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onOpenCompare}
              title="Compare with baseline brief in IndexedDB"
            >
              Compare Cycles
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onPrint}
              title="Print formal gazette briefing"
            >
              Print Note
            </Button>
          </div>
        </div>
      </div>

      {/* Fallback Notice if Offline */}
      {isFallback && (
        <div className="p-2.5 text-xs font-mono bg-[var(--color-marigold)]/15 border border-[var(--color-marigold)] rounded text-[var(--color-ink)] flex items-center justify-between">
          <span>Mode: Deterministic Fallback Briefing (No external LLM calls).</span>
          <span className="font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-marigold)]">
            Offline Safe
          </span>
        </div>
      )}

      {/* INTERNAL BRIEFING NOTE VIEW */}
      {activeView === 'internal' && (
        <div className="space-y-6 print:space-y-4">
          {/* Executive Header */}
          <div className="border-b-2 border-[var(--color-ink)] pb-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-ink)]/70">
              Department of Municipal Administration & Public Health
            </div>
            <h2 className="text-xl font-serif font-black text-[var(--color-ink)] mt-0.5">
              Air Quality Intelligence Brief: {personaMeta.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--color-ink)]/80 mt-1">
              <span>Status: <strong className="uppercase">{analytics.overallAQI.category}</strong> (AQI {analytics.overallAQI.value})</span>
              <span>Primary Driver: <strong>{analytics.overallAQI.dominantPollutant.toUpperCase()}</strong></span>
              <span>Worst Station: <strong>{analytics.overallAQI.dominantStation}</strong></span>
            </div>
          </div>

          {/* Grounding Verification Banner */}
          {validation && (
            <VerificationBanner
              verifiedClaims={validation.verifiedClaims}
              totalClaims={validation.totalClaims}
              isFullyGround={validation.isFullyGround}
            />
          )}

          {/* Traceable Findings */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--color-ink)]">
              Traceable Intelligence Findings ({briefing.findings.length})
            </h3>
            <div className="space-y-3">
              {briefing.findings.map((finding) => (
                <FindingsCard
                  key={finding.id}
                  finding={finding}
                  validation={validation?.findingResults[finding.id]}
                  onSelectEvidence={onSelectEvidence}
                />
              ))}
            </div>
          </div>

          {/* Hotspot Ranking Visualization */}
          <HotspotMap hotspots={analytics.hotspots} />

          {/* Prioritized Actions for Active Persona */}
          <ActionsCard
            actions={briefing.actions}
            checkedActionIds={checkedActionIds}
            onToggleAction={onToggleAction}
            onSelectEvidence={onSelectEvidence}
          />

          {/* Flagged Data Gaps / Unreliable Sensors */}
          {briefing.dataGaps && briefing.dataGaps.length > 0 && (
            <div className="p-3 border border-[var(--color-ink)]/20 rounded bg-[var(--color-ink)]/[0.03] space-y-1.5">
              <div className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--color-ink)]">
                Monitoring Coverage & Data Integrity Gaps
              </div>
              <ul className="text-xs font-sans text-[var(--color-ink)]/80 space-y-1 list-disc list-inside">
                {briefing.dataGaps.map((gap, i) => (
                  <li key={i}>{gap}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* CITIZEN ADVISORY VIEW */}
      {activeView === 'advisory' && (
        <CitizenAdvisory
          advisoryText={advisoryText}
          currentLanguage={currentLanguage}
          currentReadingLevel={currentReadingLevel}
          onLanguageChange={onLanguageChange}
          onReadingLevelChange={onReadingLevelChange}
          analytics={analytics}
          isLoading={isTranslating}
        />
      )}
    </div>
  );
}
