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
  const groupBadges: Record<VulnerableGroup, { badge: string; color: string; icon: React.ReactNode }> = {
    children: {
      badge: 'Pediatric Care',
      color: 'bg-[var(--color-marigold)]/15 text-[var(--color-ink)] border-[var(--color-marigold)]/30',
      icon: (
        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    seniors: {
      badge: 'Geriatric Risk (60+)',
      color: 'bg-[var(--color-aqi-poor)]/15 text-[var(--color-aqi-poor)] border-[var(--color-aqi-poor)]/30',
      icon: (
        <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    sensitive: {
      badge: 'Respiratory & Cardiac',
      color: 'bg-[var(--color-brick)]/15 text-[var(--color-brick)] border-[var(--color-brick)]/30',
      icon: (
        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  };

  const borders: Record<VulnerableGroup, string> = {
    children: 'border-l-4 border-l-[var(--color-marigold)]',
    seniors: 'border-l-4 border-l-[var(--color-aqi-poor)]',
    sensitive: 'border-l-4 border-l-[var(--color-brick)]',
  };

  const current = groupBadges[group];

  return (
    <div
      className={`p-4 border-2 rounded-lg bg-[var(--color-paper)] space-y-3 shadow-xs hover:border-[var(--color-ink)]/40 transition-all ${borders[group]}`}
      role="region"
      aria-label={`Protective advisory for ${title}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{current.icon}</span>
          <h4 className="font-serif font-bold text-xs text-[var(--color-ink)]">
            {title}
          </h4>
        </div>
        <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border ${current.color}`}>
          {current.badge}
        </span>
      </div>

      <ul className="text-xs font-sans text-[var(--color-ink)]/90 space-y-1.5 list-none">
        {guidelines.map((g, idx) => (
          <li key={idx} className="flex items-start gap-2 leading-relaxed">
            <span className="text-[var(--color-ink)]/40 font-mono text-[10px] mt-0.5">&bull;</span>
            <span>{g}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
