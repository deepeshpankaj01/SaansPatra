'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DataDesk } from '@/components/data-desk/DataDesk';
import { BriefPanel } from '@/components/brief/BriefPanel';
import { EvidenceTrail } from '@/components/evidence/EvidenceTrail';
import { ComparePanel } from '@/components/compare/ComparePanel';
import { CleanedRow, QualityReport as QualityReportType } from '@/lib/cleaning/types';
import { AnalyticsResult } from '@/lib/analytics/types';
import { BriefingResponse } from '@/lib/gemini/schemas';
import { ValidationReport } from '@/lib/grounding/validator';
import { PersonaId } from '@/lib/persona/types';
import { ReadingLevel } from '@/lib/gemini/translation';
import { BriefSnapshot, DiffResult } from '@/lib/compare/types';
import { ComparisonNarration } from '@/lib/gemini/schemas';
import {
  saveSnapshot,
  getAllSnapshots,
} from '@/lib/storage/indexedDb';
import { generateFallbackAdvisory } from '@/lib/gemini/fallback';
import { hashObject } from '@/lib/utils/hash';

export default function HomePage() {
  // --- Data State ---
  const [cleanedRows, setCleanedRows] = useState<CleanedRow[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [qualityReport, setQualityReport] = useState<QualityReportType | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);
  const [activeDatasetLabel, setActiveDatasetLabel] = useState<string>('');

  // --- Briefing & Persona State ---
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('ward_officer');
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [validation, setValidation] = useState<ValidationReport | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [checkedActionIds, setCheckedActionIds] = useState<string[]>([]);

  // --- Advisory State ---
  const [advisoryText, setAdvisoryText] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [currentReadingLevel, setCurrentReadingLevel] = useState<ReadingLevel>('general');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // --- Comparison & Snapshots State ---
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<BriefSnapshot[]>([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>('');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [comparisonNarration, setComparisonNarration] = useState<ComparisonNarration | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // --- Evidence Highlighting ---
  const [highlightedEvidenceId, setHighlightedEvidenceId] = useState<string | null>(null);

  // --- Processing States ---
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load saved snapshots from IndexedDB on mount
  useEffect(() => {
    async function loadSnapshots() {
      try {
        const list = await getAllSnapshots();
        setSnapshots(list);
        if (list.length > 0) {
          setSelectedSnapshotId(list[0].id);
        }
      } catch (err) {
        console.warn('IndexedDB unavailable:', err);
      }
    }
    loadSnapshots();
  }, []);

  // 1. Generate Brief
  const generateBrief = useCallback(
    async (
      targetAnalytics: AnalyticsResult | null,
      persona: PersonaId,
    ) => {
      if (!targetAnalytics) return;
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await fetch('/api/brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stats: targetAnalytics,
            persona,
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Failed to generate brief.');
        }

        setBriefing(json.brief);
        setValidation(json.validation);
        setIsFallback(Boolean(json.isFallback));

        // Generate base advisory in English
        const baseAdvisory = generateFallbackAdvisory(targetAnalytics);
        setAdvisoryText(baseAdvisory);

        // Save snapshot to IndexedDB
        const snapshot: BriefSnapshot = {
          id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          createdAt: new Date().toISOString(),
          label: activeDatasetLabel,
          statsHash: hashObject(targetAnalytics),
          analytics: targetAnalytics,
          briefing: json.brief,
          persona,
          checkedActionIds,
        };

        try {
          await saveSnapshot(snapshot);
          const updatedList = await getAllSnapshots();
          setSnapshots(updatedList);
          if (updatedList.length > 1) {
            // Default baseline to the immediate previous one
            setSelectedSnapshotId(updatedList[1].id);
          }
        } catch (storageErr) {
          console.warn('Could not save snapshot to IndexedDB:', storageErr);
        }
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Briefing failed.');
      } finally {
        setIsLoading(false);
      }
    },
    [activeDatasetLabel, checkedActionIds],
  );

  // 2. Process Raw Data (called from file upload, paste, or demo load)
  const handleDataLoaded = useCallback(
    async (rawText: string, label: string) => {
      setIsLoading(true);
      setErrorMessage(null);
      setActiveDatasetLabel(label);

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: rawText }),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Failed to analyze data.');
        }

        setCleanedRows(json.dataset.previewRows || []);
        setTotalRowCount(json.dataset.rowCount || 0);
        setQualityReport(json.qualityReport || null);
        setAnalytics(json.analytics || null);

        // Auto-generate initial brief
        await generateBrief(json.analytics, selectedPersona);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Analysis failed.');
      } finally {
        setIsLoading(false);
      }
    },
    [generateBrief, selectedPersona],
  );

  // 3. Switch Persona (regenerates briefing tailored to persona)
  const handleSelectPersona = (newPersona: PersonaId) => {
    setSelectedPersona(newPersona);
    if (analytics) {
      generateBrief(analytics, newPersona);
    }
  };

  // 4. Toggle Action Checked State
  const handleToggleAction = (actionText: string) => {
    setCheckedActionIds((prev) =>
      prev.includes(actionText)
        ? prev.filter((id) => id !== actionText)
        : [...prev, actionText],
    );
  };

  // 5. Select Evidence Item from Finding click (scrolls & highlights)
  const handleSelectEvidence = (evidenceId: string) => {
    setHighlightedEvidenceId(evidenceId);
    const element = document.getElementById(`evidence-${evidenceId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 6. Handle Translation / Reading Level Change
  const handleTranslate = async (lang: string, level: ReadingLevel) => {
    if (!analytics) return;
    setIsTranslating(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: generateFallbackAdvisory(analytics),
          language: lang,
          readingLevel: level,
          statsFallback: analytics,
        }),
      });

      const json = await res.json();
      if (res.ok && json.translation) {
        setAdvisoryText(json.translation);
        setCurrentLanguage(lang);
        setCurrentReadingLevel(level);
      }
    } catch (err) {
      console.warn('Translation failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // 7. Run Comparison with Selected Snapshot
  const handleCompare = async () => {
    if (!analytics || !briefing || !selectedSnapshotId) return;
    const baseSnapshot = snapshots.find((s) => s.id === selectedSnapshotId);
    if (!baseSnapshot) return;

    setIsComparing(true);
    try {
      const currentSnapshot: BriefSnapshot = {
        id: 'current-live',
        createdAt: new Date().toISOString(),
        statsHash: hashObject(analytics),
        analytics,
        briefing,
        persona: selectedPersona,
        checkedActionIds,
      };

      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSnapshot,
          previousSnapshot: baseSnapshot,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setDiffResult(json.diff);
        setComparisonNarration(json.narration);
      }
    } catch (err) {
      console.warn('Comparison failed:', err);
    } finally {
      setIsComparing(false);
    }
  };

  // 8. Print Note Handler
  const handlePrint = () => {
    window.print();
  };

  // Haze values for masthead header strip
  const hazeValues = analytics?.stations.map((s) => s.aqi.overall);

  return (
    <AppShell
      hazeValues={hazeValues}
      datasetLabel={activeDatasetLabel}
      rowCount={cleanedRows.length}
      overallReliability={qualityReport?.overallReliability}
      dataDesk={
        <div className="space-y-4">
          {errorMessage && (
            <div
              className="p-3 text-xs font-mono text-[var(--color-brick)] bg-[var(--color-brick)]/10 border border-[var(--color-brick)]/30 rounded"
              role="alert"
            >
              {errorMessage}
            </div>
          )}
          <DataDesk
            onDataLoaded={handleDataLoaded}
            onGenerateBrief={() => generateBrief(analytics, selectedPersona)}
            cleanedRows={cleanedRows}
            totalRows={totalRowCount}
            qualityReport={qualityReport}
            analytics={analytics}
            isLoading={isLoading}
            activeLabel={activeDatasetLabel}
          />
        </div>
      }
      brief={
        isCompareOpen ? (
          <ComparePanel
            diff={diffResult}
            narration={comparisonNarration}
            snapshots={snapshots}
            selectedSnapshotId={selectedSnapshotId}
            onSelectSnapshot={setSelectedSnapshotId}
            onCompare={handleCompare}
            isLoading={isComparing}
            onClose={() => setIsCompareOpen(false)}
          />
        ) : (
          <BriefPanel
            briefing={briefing}
            validation={validation}
            analytics={analytics}
            selectedPersona={selectedPersona}
            onSelectPersona={handleSelectPersona}
            checkedActionIds={checkedActionIds}
            onToggleAction={handleToggleAction}
            onSelectEvidence={handleSelectEvidence}
            onOpenCompare={() => setIsCompareOpen(true)}
            advisoryText={advisoryText}
            currentLanguage={currentLanguage}
            currentReadingLevel={currentReadingLevel}
            onLanguageChange={(l) => handleTranslate(l, currentReadingLevel)}
            onReadingLevelChange={(lvl) => handleTranslate(currentLanguage, lvl)}
            isTranslating={isTranslating}
            isFallback={isFallback}
            onPrint={handlePrint}
          />
        )
      }
      evidence={
        <EvidenceTrail
          evidence={analytics?.evidence || []}
          highlightedId={highlightedEvidenceId}
        />
      }
    />
  );
}
