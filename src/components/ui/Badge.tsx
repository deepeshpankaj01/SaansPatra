import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'error' | 'success' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const base =
    'inline-flex items-center font-mono font-medium uppercase tracking-wider rounded border select-none';

  const variants = {
    neutral: 'bg-[var(--color-ink)]/5 text-[var(--color-ink)] border-[var(--color-ink)]/20',
    info: 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]',
    warning: 'bg-[var(--color-marigold)]/20 text-[var(--color-ink)] border-[var(--color-marigold)]',
    error: 'bg-[var(--color-brick)]/15 text-[var(--color-brick)] border-[var(--color-brick)] font-bold',
    success: 'bg-[var(--color-aqi-good)]/30 text-[var(--color-ink)] border-[var(--color-aqi-good)]',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
