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
}

export function CitizenAdvisory({
  advisoryText,
  currentLanguage,
  currentReadingLevel,
  onLanguageChange,
  onReadingLevelChange,
  analytics,
  isLoading,
}: CitizenAdvisoryProps) {
  const overallAQI = analytics?.overallAQI.value || 150;
  const category = analytics?.overallAQI.category || 'Moderate';
  const dominant = analytics?.overallAQI.dominantPollutant.toUpperCase() || 'PM2.5';

  return (
    <div className="space-y-5">
      {/* Language & Reading Level Controls */}
      <div className="space-y-4 border-b border-[var(--color-ink)]/15 pb-4">
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

      {/* Action Bar (Read Aloud + WhatsApp Copy) */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--color-ink)]/5 p-2.5 rounded border border-[var(--color-ink)]/15">
        <span className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider">
          Broadcast Tools:
        </span>
        <div className="flex items-center gap-2">
          <ReadAloud text={advisoryText} language={currentLanguage} />
          <WhatsAppCopy textToCopy={advisoryText} />
        </div>
      </div>

      {/* Main Advisory Content with explicit lang attribute for accessibility */}
      <div
        className="p-4 border-2 border-[var(--color-ink)] rounded bg-[var(--color-paper)] space-y-3"
        lang={currentLanguage}
        role="region"
        aria-label="Citizen Advisory Content"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-ink)]/20 pb-2">
          <h3 className="font-serif font-bold text-base text-[var(--color-ink)]">
            Citizen Public Health Advisory
          </h3>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--color-ink)] text-[var(--color-paper)] uppercase">
            {category} (AQI {overallAQI})
          </span>
        </div>

        <div className="text-xs font-sans text-[var(--color-ink)] whitespace-pre-line leading-relaxed">
          {advisoryText}
        </div>
      </div>

      {/* Vulnerable Population Cards */}
      <div className="space-y-3">
        <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--color-ink)]">
          Special Care Guidance for High-Risk Groups
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
    </div>
  );
}
