'use client';

import React from 'react';
import { LanguagePicker } from './LanguagePicker';
import { ReadingLevelToggle } from './ReadingLevelToggle';
import { VulnerableCard } from './VulnerableCard';
import { WhatsAppCopy } from './WhatsAppCopy';
import { ReadAloud } from './ReadAloud';
import { DisclaimerNote } from './DisclaimerNote';
import { ReadingLevel } from '@/lib/gemini/translation';
import { AnalyticsResult } from '@/lib/analytics/types';

interface CitizenAdvisoryProps {
  advisoryText: string;
  currentLanguage: string;
  currentReadingLevel: ReadingLevel;
  onLanguageChange: (lang: string) => void;
  onReadingLevelChange: (level: ReadingLevel) => void;
  analytics?: AnalyticsResult | null;
  isLoading?: boolean;
  onOpenCompare?: () => void;
}

export const CitizenAdvisory = React.memo(function CitizenAdvisory({
  advisoryText,
  currentLanguage,
  currentReadingLevel,
  onLanguageChange,
  onReadingLevelChange,
  analytics,
  isLoading,
  onOpenCompare,
}: CitizenAdvisoryProps) {
  const overallAQI = analytics?.overallAQI.value || 150;
  const category = analytics?.overallAQI.category || 'Moderate';
  const dominant = analytics?.overallAQI.dominantPollutant.toUpperCase() || 'PM2.5';

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="p-6 rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] shadow-sm space-y-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[var(--color-ink)]">
            Multilingual Citizen Broadcast Studio
          </h2>
          <p className="text-xs font-mono text-[var(--color-ink)]/60 mt-0.5">
            Public health messaging calibrated by reading comprehension and clinical vulnerability
          </p>
        </div>

        {/* Language & Reading Level Controls */}
        <div className="space-y-4 border-t border-[var(--color-ink)]/15 pt-4">
          <LanguagePicker
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
            disabled={isLoading}
          />

          <ReadingLevelToggle
            currentLevel={currentReadingLevel}
            onLevelChange={onReadingLevelChange}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Broadcast Tools (Read Aloud + WhatsApp Copy) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--color-ink)]/5 p-4 rounded-2xl border-2 border-[var(--color-ink)]/15 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-aqi-good)] animate-ping" />
          <span className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider">
            Audio & Social Broadcast Channels:
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ReadAloud text={advisoryText} language={currentLanguage} />
          <WhatsAppCopy textToCopy={advisoryText} />
        </div>
      </div>

      {/* Main Advisory Content with explicit lang attribute for accessibility */}
      <div
        className="p-6 border-2 border-[var(--color-ink)] rounded-2xl bg-[var(--color-paper)] space-y-4 shadow-sm"
        lang={currentLanguage}
        role="region"
        aria-label="Citizen Advisory Content"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-ink)]/20 pb-3">
          <h3 className="font-serif font-bold text-lg text-[var(--color-ink)]">
            Citizen Public Health Advisory
          </h3>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] uppercase">
            {category} (AQI {overallAQI})
          </span>
        </div>

        <div className="text-sm font-sans text-[var(--color-ink)] whitespace-pre-line leading-relaxed">
          {advisoryText}
        </div>
      </div>

      {/* Vulnerable Population Cards */}
      <div className="p-6 rounded-2xl border-2 border-[var(--color-ink)]/15 bg-[var(--color-paper)] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-ink)]/10 pb-3">
          <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--color-ink)]">
            Special Care Guidance for High-Risk Groups
          </h4>
          <span className="text-[10px] font-mono text-[var(--color-ink)]/50">
            Targeted clinical interventions for vulnerable populations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VulnerableCard
            group="children"
            title="Children & School Students"
            guidelines={[
              'Suspend outdoor sports and vigorous field play.',
              'Schedule classroom activities indoors during morning commute hours.',
              'Ensure hydrated commute with well-fitted pediatric N95 masks if travelling on two-wheelers.',
            ]}
          />

          <VulnerableCard
            group="seniors"
            title="Senior Citizens (60+)"
            guidelines={[
              'Avoid morning walks; exercise indoors after 11:00 AM when the inversion layer lifts.',
              'Keep rooms closed with gentle cross-ventilation during sunny afternoon periods.',
              'Stay hydrated and monitor blood pressure regularly.',
            ]}
          />

          <VulnerableCard
            group="sensitive"
            title="Asthma & Respiratory Patients"
            guidelines={[
              `Keep emergency rescue inhalers and bronchodilators readily accessible.`,
              `Exposure to ${dominant} may trigger acute airway hyper-responsiveness.`,
              `Seek immediate medical care if wheezing, shortness of breath, or chest tightness occurs.`,
            ]}
          />
        </div>
      </div>

      {/* Medical Disclaimer */}
      <DisclaimerNote />

      {/* Step 4 CTA Card (Compare Lab) */}
      {onOpenCompare && (
        <div className="p-6 rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[var(--color-ink)]/60 font-bold block">
              Continuous Governance Cycle
            </span>
            <h4 className="font-serif font-bold text-lg text-[var(--color-ink)]">
              Track Environmental Shifts Across GrAP Stages
            </h4>
            <p className="text-xs font-sans text-[var(--color-ink)]/75 max-w-lg">
              Compare this briefing against historical cycle snapshots in IndexedDB to verify pollution drops, resolution of hotspots, and carry-over enforcement checklists.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCompare}
            className="px-6 py-3.5 rounded-xl bg-[var(--color-ink)] text-[var(--color-paper)] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[var(--color-ink)]/90 active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>Step 4: Launch Period Comparison Lab &rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
});
