import React from 'react';
import { ActionCarryOverItem } from '@/lib/compare/types';
import { Badge } from '../ui/Badge';

interface ActionCarryOverProps {
  items: ActionCarryOverItem[];
}

export function ActionCarryOver({ items }: ActionCarryOverProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2.5 border-2 border-[var(--color-ink)]/20 p-4 rounded-lg bg-[var(--color-paper)] shadow-xs">
      <div className="flex items-center justify-between text-xs font-mono border-b border-[var(--color-ink)]/10 pb-2">
        <span className="font-bold uppercase tracking-wider text-[var(--color-ink)] flex items-center gap-1.5">
          <span>Carried-Over Action Directives</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--color-ink)]/10">
            {items.length}
          </span>
        </span>
        <span className="text-[11px] text-[var(--color-ink)]/60">
          Cross-Cycle Accountability
        </span>
      </div>

      <div className="space-y-2 text-xs font-mono">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-md border flex items-center justify-between gap-3 transition-colors ${
              item.wasChecked
                ? 'bg-[var(--color-ink)]/[0.03] border-[var(--color-ink)]/15 text-[var(--color-ink)]/70'
                : 'bg-[var(--color-paper)] border-[var(--color-ink)]/25 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--color-ink)]/50">
                #{idx + 1}
              </span>
              <span className={item.wasChecked ? 'line-through text-[var(--color-ink)]/60' : 'font-medium text-[var(--color-ink)]'}>
                {item.action}
              </span>
            </div>

            <Badge variant={item.wasChecked ? 'success' : 'warning'}>
              {item.wasChecked ? 'Completed' : 'Pending'}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
