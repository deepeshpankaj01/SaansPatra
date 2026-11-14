import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  statusText?: string;
  className?: string;
}

export function ProgressBar({
  value,
  label,
  statusText,
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full space-y-1 ${className}`} aria-live="polite">
      {(label || statusText) && (
        <div className="flex justify-between text-xs font-mono">
          {label && <span className="font-bold text-[var(--color-ink)]">{label}</span>}
          {statusText && <span className="text-[var(--color-ink)]/70">{statusText}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
        className="w-full h-2.5 bg-[var(--color-ink)]/10 rounded overflow-hidden border border-[var(--color-ink)]/20"
      >
        <div
          className="h-full bg-[var(--color-marigold)] transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
