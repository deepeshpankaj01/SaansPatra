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

  return (
    <div
      className={`p-3.5 border rounded space-y-2 transition-all ${
        isVerified
          ? 'bg-[var(--color-paper)] border-[var(--color-ink)]/20 shadow-xs'
          : 'bg-[var(--color-brick)]/[0.04] border-[var(--color-brick)]/40'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold text-[var(--color-ink)]/70">
            {finding.id}
          </span>
          <span
            className={`px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
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

      <p className="text-xs font-sans text-[var(--color-ink)] leading-relaxed">
        {finding.claim}
      </p>

      {/* Traceable Evidence References */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[var(--color-ink)]/10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-ink)]/60">
          Traceable Evidence:
        </span>
        {finding.evidenceRefs.map((ref) => (
          <button
            key={ref}
            type="button"
            onClick={() => onSelectEvidence?.(ref)}
            className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-[var(--color-ink)]/10 hover:bg-[var(--color-marigold)]/30 text-[var(--color-ink)] border border-[var(--color-ink)]/20 transition-colors"
            title={`Inspect supporting evidence record ${ref}`}
          >
            {ref}
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
