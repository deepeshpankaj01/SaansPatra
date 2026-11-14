import React from 'react';

export type VulnerableGroup = 'children' | 'seniors' | 'sensitive';

interface VulnerableCardProps {
  group: VulnerableGroup;
  title: string;
  guidelines: string[];
}

export function VulnerableCard({
  group,
  title,
  guidelines,
}: VulnerableCardProps) {
  const icons: Record<VulnerableGroup, string> = {
    children: '[CHILD HEALTH]',
    seniors: '[SENIOR CITIZENS]',
    sensitive: '[RESPIRATORY & CARDIAC]',
  };

  const borders: Record<VulnerableGroup, string> = {
    children: 'border-l-4 border-l-[var(--color-marigold)]',
    seniors: 'border-l-4 border-l-[var(--color-aqi-poor)]',
    sensitive: 'border-l-4 border-l-[var(--color-brick)]',
  };

  return (
    <div
      className={`p-3.5 border border-[var(--color-ink)]/20 rounded bg-[var(--color-paper)] space-y-2 ${borders[group]}`}
      role="region"
      aria-label={`Protective advisory for ${title}`}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-serif font-bold text-xs text-[var(--color-ink)]">
          {title}
        </h4>
        <span className="font-mono text-[10px] font-bold text-[var(--color-ink)]/70">
          {icons[group]}
        </span>
      </div>

      <ul className="text-xs font-sans text-[var(--color-ink)]/90 space-y-1 list-disc list-inside">
        {guidelines.map((g, idx) => (
          <li key={idx} className="leading-relaxed">
            {g}
          </li>
        ))}
      </ul>
    </div>
  );
}
