import React from 'react';
import { ActionCarryOverItem } from '@/lib/compare/types';
import { Badge } from '../ui/Badge';

interface ActionCarryOverProps {
  items: ActionCarryOverItem[];
}

export function ActionCarryOver({ items }: ActionCarryOverProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2 border border-[var(--color-ink)]/20 p-4 rounded bg-[var(--color-paper)]">
      <div className="flex items-center justify-between text-xs font-mono border-b border-[var(--color-ink)]/10 pb-1.5">
        <span className="font-bold uppercase tracking-wider text-[var(--color-ink)]">
          Carried-Over Action Directives ({items.length})
        </span>
        <span className="text-[11px] text-[var(--color-ink)]/60">
          From previous cycle
        </span>
      </div>

      <div className="space-y-2 text-xs font-mono">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded border flex items-center justify-between gap-2 ${
              item.wasChecked
                ? 'bg-[var(--color-ink)]/[0.03] border-[var(--color-ink)]/15 text-[var(--color-ink)]/70'
                : 'bg-[var(--color-paper)] border-[var(--color-ink)]/25'
            }`}
          >
            <span className={item.wasChecked ? 'line-through' : 'font-medium'}>
              {item.action}
            </span>

            <Badge variant={item.wasChecked ? 'success' : 'warning'}>
              {item.wasChecked ? 'Completed' : 'Pending'}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
