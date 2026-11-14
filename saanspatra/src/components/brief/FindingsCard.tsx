'use client';

import React from 'react';
import { BriefingFinding } from '@/lib/gemini/schemas';
import { FindingValidation } from '@/lib/grounding/validator';
import { StampBadge } from './StampBadge';
import { Badge } from '../ui/Badge';

interface FindingsCardProps {
  finding: BriefingFinding;
  validation?: FindingValidation;
  onSelectEvidence?: (evidenceId: string) => void;
}

export function FindingsCard({
  finding,
  validation,
  onSelectEvidence,
}: FindingsCardProps) {
  const isVerified = validation ? validation.isVerified : true;

  const severityColors = {
    critical: 'bg-[var(--color-brick)] text-white',
    high: 'bg-[var(--color-aqi-poor)] text-white',
    moderate: 'bg-[var(--color-marigold)] text-[var(--color-ink)]',
    low: 'bg-[var(--color-aqi-good)] text-[var(--color-ink)]',
  };

  const handleEvidenceClick = (ref: string) => {
    onSelectEvidence?.(ref);
    if (typeof document !== 'undefined') {
      const el = document.getElementById(`evidence-${ref}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div
      className={`p-4 border-2 rounded-lg space-y-2.5 transition-all ${
        isVerified
          ? 'bg-[var(--color-paper)] border-[var(--color-ink)]/20 shadow-xs hover:border-[var(--color-ink)]/40'
          : 'bg-[var(--color-brick)]/[0.04] border-[var(--color-brick)]/40'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black text-[var(--color-ink)]/80 px-1.5 py-0.5 rounded bg-[var(--color-ink)]/5">
            {finding.id}
          </span>
          <span
            className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
              severityColors[finding.severity]
            }`}
          >
            {finding.severity}
          </span>
          <Badge variant="neutral" size="sm">
            {finding.confidence} confidence
          </Badge>
        </div>

        <div>
          <StampBadge type={isVerified ? 'verified' : 'unverified'} />
        </div>
      </div>

      <p className="text-xs font-sans text-[var(--color-ink)] leading-relaxed font-medium">
        {finding.claim}
      </p>

      {/* Traceable Evidence References */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--color-ink)]/10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-ink)]/60 flex items-center gap-1">
          <svg className="w-3 h-3 text-[var(--color-ink)]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Mathematical Evidence:
        </span>
        {finding.evidenceRefs.map((ref) => (
          <button
            key={ref}
            type="button"
            onClick={() => handleEvidenceClick(ref)}
            className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-[var(--color-ink)]/5 hover:bg-[var(--color-marigold)]/30 text-[var(--color-ink)] border border-[var(--color-ink)]/20 transition-all cursor-pointer active:scale-95"
            title={`Inspect supporting evidence record ${ref} in Pane 3`}
          >
            [{ref}]
          </button>
        ))}
      </div>

      {/* Unverified explanation banner */}
      {!isVerified && validation?.reason && (
        <div className="p-2 text-[11px] font-mono text-[var(--color-brick)] bg-[var(--color-brick)]/10 border border-[var(--color-brick)]/30 rounded">
          Grounding flag: {validation.reason}
        </div>
      )}
    </div>
  );
}
