import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      ...props
    },
    ref,
  ) => {
    const base =
      'inline-flex items-center justify-center font-mono font-medium rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[44px]';

    const variants = {
      primary:
        'bg-[var(--color-marigold)] text-[var(--color-ink)] hover:brightness-95 border border-[var(--color-ink)] font-bold active:translate-y-px',
      secondary:
        'bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-ink)] hover:bg-[var(--color-ink)]/10 active:translate-y-px',
      danger:
        'bg-[var(--color-brick)] text-white hover:brightness-90 border border-[var(--color-brick)] active:translate-y-px',
      ghost:
        'bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-ink)]/10',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
