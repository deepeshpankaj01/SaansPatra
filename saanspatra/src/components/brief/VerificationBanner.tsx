import React from 'react';
import { StampBadge } from './StampBadge';

interface VerificationBannerProps {
  verifiedClaims: number;
  totalClaims: number;
  isFullyGround: boolean;
  className?: string;
}

export function VerificationBanner({
  verifiedClaims,
  totalClaims,
  isFullyGround,
  className = '',
}: VerificationBannerProps) {
  if (totalClaims === 0) return null;

  return (
    <div
      className={`p-3 border rounded flex flex-wrap items-center justify-between gap-3 bg-[var(--color-ink)]/5 border-[var(--color-ink)]/20 ${className}`}
      role="region"
      aria-live="polite"
      aria-label="Briefing Verification Status"
    >
      <div className="flex items-center gap-2">
        <StampBadge
          type={isFullyGround ? 'verified' : 'unverified'}
          label={isFullyGround ? 'ALL CLAIMS VERIFIED' : 'PARTIAL VERIFICATION'}
        />
        <span className="text-xs font-mono font-bold text-[var(--color-ink)]">
          {verifiedClaims} of {totalClaims} findings verified against deterministic data
        </span>
      </div>

      <div className="text-[11px] font-mono text-[var(--color-ink)]/70">
        {isFullyGround
          ? 'Every number and station traceable to evidence records.'
          : 'Unverified claims highlighted for review before municipal action.'}
      </div>
    </div>
  );
}
