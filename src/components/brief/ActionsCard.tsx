'use client';

import React from 'react';
import { BriefingAction } from '@/lib/gemini/schemas';
import { Badge } from '../ui/Badge';

interface ActionsCardProps {
  actions: BriefingAction[];
  checkedActionIds: string[];
  onToggleAction: (actionText: string) => void;
  onSelectEvidence?: (evidenceId: string) => void;
}

export function ActionsCard({
  actions,
  checkedActionIds,
  onToggleAction,
  onSelectEvidence,
}: ActionsCardProps) {
  if (actions.length === 0) {
    return (
      <div className="p-4 border border-[var(--color-ink)]/20 rounded-lg text-center text-xs font-mono text-[var(--color-ink)]/60">
        No specific municipal actions required for this persona; refer to the Citizen Advisory for public health guidance.
      </div>
    );
  }

  const priorityStyles = {
    P1: 'bg-[var(--color-brick)] text-white border-[var(--color-brick)]',
    P2: 'bg-[var(--color-marigold)] text-[var(--color-ink)] border-[var(--color-ink)]/30 font-bold',
    P3: 'bg-[var(--color-ink)]/10 text-[var(--color-ink)] border-[var(--color-ink)]/20',
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
    <div className="space-y-3.5">
      <div className="flex items-center justify-between text-xs font-mono border-b border-[var(--color-ink)]/15 pb-2.5">
        <span className="font-bold uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-2">
          <span>Prioritized Action Directives</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--color-ink)]/10">
            {actions.length}
          </span>
        </span>
        <span className="text-[11px] text-[var(--color-ink)]/70">
          {checkedActionIds.length} of {actions.length} completed
        </span>
      </div>

      <div className="space-y-3">
        {actions.map((act, idx) => {
          const isChecked = checkedActionIds.includes(act.action);

          return (
            <div
              key={idx}
              className={`p-3.5 border-2 rounded-lg transition-all ${
                isChecked
                  ? 'bg-[var(--color-ink)]/[0.03] border-[var(--color-ink)]/15 opacity-70'
                  : 'bg-[var(--color-paper)] border-[var(--color-ink)]/25 shadow-xs hover:border-[var(--color-ink)]/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`action-${idx}`}
                  checked={isChecked}
                  onChange={() => onToggleAction(act.action)}
                  className="mt-1 h-4 w-4 rounded border-[var(--color-ink)] text-[var(--color-ink)] accent-[var(--color-marigold)] cursor-pointer"
                />

                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${
                        priorityStyles[act.priority]
                      }`}
                    >
                      {act.priority}
                    </span>
                    <Badge variant="neutral" size="sm">
                      Owner: {act.owner}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      Effort: {act.effort}
                    </Badge>
                    <span className="text-[10px] font-mono text-[var(--color-ink)]/60 bg-[var(--color-ink)]/[0.03] px-1.5 py-0.5 rounded border border-[var(--color-ink)]/10">
                      Window: {act.timeframe}
                    </span>
                  </div>

                  <label
                    htmlFor={`action-${idx}`}
                    className={`block text-xs font-sans font-medium cursor-pointer ${
                      isChecked
                        ? 'line-through text-[var(--color-ink)]/60'
                        : 'text-[var(--color-ink)] font-semibold'
                    }`}
                  >
                    {act.action}
                  </label>

                  <p className="text-[11px] font-sans text-[var(--color-ink)]/75">
                    <strong className="font-mono text-[10px] uppercase text-[var(--color-ink)]/60">
                      Rationale:
                    </strong>{' '}
                    {act.rationale}
                  </p>

                  {/* Evidence link buttons */}
                  {act.evidenceRefs && act.evidenceRefs.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono text-[var(--color-ink)]/50">
                        Evidence Citations:
                      </span>
                      {act.evidenceRefs.map((ref) => (
                        <button
                          key={ref}
                          type="button"
                          onClick={() => handleEvidenceClick(ref)}
                          className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--color-ink)]/5 hover:bg-[var(--color-marigold)]/30 text-[var(--color-ink)] border border-[var(--color-ink)]/15 transition-colors cursor-pointer"
                        >
                          [{ref}]
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
