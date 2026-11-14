import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function Card({
  children,
  title,
  subtitle,
  action,
  className = '',
}: CardProps) {
  return (
    <section
      className={`bg-[var(--color-paper)] border border-[var(--color-ink)]/20 rounded shadow-xs overflow-hidden ${className}`}
      aria-label={title || 'Section card'}
    >
      {(title || action) && (
        <div className="px-4 py-3 border-b border-[var(--color-ink)]/10 flex items-center justify-between gap-2 bg-[var(--color-ink)]/5">
          <div>
            {title && (
              <h2 className="font-serif font-bold text-sm tracking-tight text-[var(--color-ink)]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs font-mono text-[var(--color-ink)]/70">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
