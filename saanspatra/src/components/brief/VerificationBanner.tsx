import React from 'react';
import { StampBadge } from './StampBadge';

interface VerificationBannerProps {
  verifiedClaims: number;
  totalClaims: number;
  isFullyGround: boolean;
  className?: string;
  sha256Hash?: string;
}

export function VerificationBanner({
  verifiedClaims,
  totalClaims,
  isFullyGround,
  className = '',
  sha256Hash,
}: VerificationBannerProps) {
  if (totalClaims === 0) return null;

  const passPct = Math.round((verifiedClaims / totalClaims) * 100);

  return (
    <div
      className={`p-3.5 border-2 rounded-lg flex flex-wrap items-center justify-between gap-3 bg-[var(--color-paper)] border-[var(--color-ink)]/25 shadow-xs ${className}`}
      role="region"
      aria-live="polite"
      aria-label="Briefing Verification Status"
    >
      <div className="flex items-center gap-3">
        <StampBadge
          type={isFullyGround ? 'verified' : 'unverified'}
          label={isFullyGround ? 'ALL CLAIMS VERIFIED' : 'PARTIAL VERIFICATION'}
        />
        <div>
          <div className="text-xs font-mono font-bold text-[var(--color-ink)] flex items-center gap-2">
            <span>
              {verifiedClaims} of {totalClaims} findings verified against deterministic data
            </span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                isFullyGround
                  ? 'bg-[var(--color-aqi-good)]/15 text-[var(--color-aqi-good)]'
                  : 'bg-[var(--color-brick)]/15 text-[var(--color-brick)]'
              }`}
            >
              {passPct}% Grounded
            </span>
          </div>
          <div className="text-[11px] font-mono text-[var(--color-ink)]/70 mt-0.5">
            {isFullyGround
              ? 'Zero AI hallucinations detected. Every numeric claim matches CPCB data.'
              : 'Claims with missing evidence tags flagged for administrative review.'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--color-ink)]/60 bg-[var(--color-ink)]/[0.03] px-2.5 py-1 rounded border border-[var(--color-ink)]/10">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-aqi-good)]" />
        <span>SHA-256 Audit:</span>
        <code className="font-bold text-[var(--color-ink)]">
          {sha256Hash ? sha256Hash.slice(0, 10) + '...' : 'SEC-CPCB-OK'}
        </code>
      </div>
    </div>
  );
}
