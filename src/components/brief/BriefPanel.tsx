'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { PersonaSelector } from './PersonaSelector';
import { VerificationBanner } from './VerificationBanner';
import { FindingsCard } from './FindingsCard';
import { ActionsCard } from './ActionsCard';
import { HotspotMap } from './HotspotMap';
import { Button } from '../ui/Button';
import { BriefingResponse } from '@/lib/gemini/schemas';
import { ValidationReport } from '@/lib/grounding/validator';
import { AnalyticsResult } from '@/lib/analytics/types';
import { PersonaId, PERSONAS } from '@/lib/persona/types';
import { ReadingLevel } from '@/lib/gemini/translation';

// Dynamic code-splitting for CitizenAdvisory tab
const CitizenAdvisory = dynamic(
  () => import('../advisory/CitizenAdvisory').then((mod) => mod.CitizenAdvisory),
  {
    ssr: true,
    loading: () => (
      <div className="p-8 text-center text-xs font-mono text-[var(--color-ink)]/60">
        Loading Citizen Public Health Advisory...
      </div>
    ),
  },
);

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
  onNavigateToAdvisory?: () => void;
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
  onNavigateToAdvisory,
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
      <div className="p-8 text-center space-y-4 border-2 border-[var(--color-ink)]/20 rounded-2xl bg-[var(--color-ink)]/[0.02]">
        <div className="font-serif font-bold text-xl text-[var(--color-ink)]">
          No Briefing Active
        </div>
        <p className="text-xs font-mono text-[var(--color-ink)]/70 max-w-md mx-auto leading-relaxed">
          Select or upload an air quality dataset in the Data Desk (Pane 1) and click &quot;Generate Brief&quot; to synthesize an intelligence dossier.
        </p>
      </div>
    );
  }

  const personaMeta = PERSONAS[selectedPersona];

  const handleSwitchToAdvisory = () => {
    setActiveView('advisory');
    onNavigateToAdvisory?.();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Persona & View Switcher */}
      <div className="p-6 rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] shadow-sm space-y-4">
        <PersonaSelector
          selectedPersona={selectedPersona}
          onSelectPersona={onSelectPersona}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-ink)]/15 pt-3">
          {/* Sub-view switcher */}
          <div className="inline-flex rounded-xl border border-[var(--color-ink)]/20 p-1 bg-[var(--color-paper)]" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'internal'}
              onClick={() => setActiveView('internal')}
              className={`px-4 py-2 text-xs font-mono rounded-lg min-h-[40px] transition-all cursor-pointer ${
                activeView === 'internal'
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold shadow-xs'
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
              className={`px-4 py-2 text-xs font-mono rounded-lg min-h-[40px] transition-all cursor-pointer ${
                activeView === 'advisory'
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)] font-bold shadow-xs'
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
              className="rounded-lg font-mono text-xs"
            >
              Compare Cycles
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onPrint}
              title="Print / Export Official Policy Dossier (PDF)"
              className="rounded-lg font-mono text-xs flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print / Export PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Fallback Notice if Offline */}
      {isFallback && (
        <div className="p-3 rounded-xl text-xs font-mono bg-[var(--color-marigold)]/15 border-2 border-[var(--color-marigold)] text-[var(--color-ink)] flex items-center justify-between">
          <span>Mode: Deterministic Fallback Briefing (Zero external LLM calls).</span>
          <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-[var(--color-marigold)]">
            Offline Safe
          </span>
        </div>
      )}

      {/* INTERNAL BRIEFING NOTE VIEW */}
      {activeView === 'internal' && (
        <div className="space-y-6 print:space-y-4">
          {/* Executive Header Card */}
          <div className="p-6 rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] shadow-sm space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-ink)]/70">
              Department of Municipal Administration & Public Health
            </div>
            <h2 className="text-2xl font-serif font-black text-[var(--color-ink)]">
              Air Quality Intelligence Brief: {personaMeta.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--color-ink)]/80 pt-1">
              <span>Status: <strong className="uppercase text-[var(--color-brick)]">{analytics.overallAQI.category}</strong> (AQI {analytics.overallAQI.value})</span>
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
              isFallback={isFallback}
            />
          )}

          {/* Hotspot Ranking Radar Map */}
          <div className="rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] p-6 shadow-sm">
            <HotspotMap hotspots={analytics.hotspots} />
          </div>

          {/* Traceable Findings Bento Card */}
          <div className="rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-ink)]/10 pb-3">
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--color-ink)]">
                Traceable Intelligence Findings ({briefing.findings.length})
              </h3>
              <span className="text-[10px] font-mono text-[var(--color-ink)]/50">
                Click any [EV-ID] chip to inspect mathematical proof
              </span>
            </div>
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

          {/* Prioritized Actions Card */}
          <div className="rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] p-6 shadow-sm">
            <ActionsCard
              actions={briefing.actions}
              checkedActionIds={checkedActionIds}
              onToggleAction={onToggleAction}
              onSelectEvidence={onSelectEvidence}
            />
          </div>

          {/* Flagged Data Gaps / Unreliable Sensors */}
          {briefing.dataGaps && briefing.dataGaps.length > 0 && (
            <div className="p-5 border-2 border-[var(--color-ink)]/20 rounded-2xl bg-[var(--color-ink)]/[0.03] space-y-2">
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

          {/* Step 3 CTA Card */}
          <div className="p-6 rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--color-ink)]/60 font-bold block">
                Next Stage: Public Health Communication
              </span>
              <h4 className="font-serif font-bold text-lg text-[var(--color-ink)]">
                Broadcast Multilingual Citizen Advisory
              </h4>
              <p className="text-xs font-sans text-[var(--color-ink)]/75 max-w-lg">
                Generate accessible public health notices in 6 Indian languages, tailored for children, seniors, and asthma patients with WhatsApp broadcast.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSwitchToAdvisory}
              className="px-6 py-3.5 rounded-xl bg-[var(--color-ink)] text-[var(--color-paper)] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[var(--color-ink)]/90 active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Step 3: Open Multilingual Citizen Broadcast Studio &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* CITIZEN ADVISORY VIEW */}
      {activeView === 'advisory' && (
        <div className="rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] p-6 shadow-sm">
          <CitizenAdvisory
            advisoryText={advisoryText}
            currentLanguage={currentLanguage}
            currentReadingLevel={currentReadingLevel}
            onLanguageChange={onLanguageChange}
            onReadingLevelChange={onReadingLevelChange}
            analytics={analytics}
            isLoading={isTranslating}
          />
        </div>
      )}
    </div>
  );
}
