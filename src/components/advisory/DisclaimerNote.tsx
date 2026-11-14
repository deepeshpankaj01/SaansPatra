import React from 'react';

export function DisclaimerNote() {
  return (
    <div
      className="p-3 border border-[var(--color-ink)]/20 rounded bg-[var(--color-ink)]/[0.03] text-[11px] font-mono text-[var(--color-ink)]/75 space-y-1"
      role="note"
      aria-label="Medical disclaimer"
    >
      <div className="font-bold text-[var(--color-ink)] uppercase tracking-wider">
        Notice: Not Medical Advice
      </div>
      <p>
        This advisory is generated from civic environmental monitoring data and algorithmic intelligence for community awareness. It does not replace professional medical diagnosis, individualized clinical counsel, or emergency care. Persons with chronic pulmonary, cardiovascular, or other sensitive health conditions should follow instructions from their treating medical practitioner.
      </p>
    </div>
  );
}
