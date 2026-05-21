import React from 'react';
import { cn } from '@/lib/utils';

interface SovereignCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'danger' | 'success';
  glow?: boolean;
}

export function SovereignCard({
  children,
  className,
  variant = 'default',
  glow = false,
}: SovereignCardProps) {
  const variantStyles = {
    default: 'border-sovereign-border bg-sovereign-surface',
    gold: 'border-sovereign-gold/30 bg-sovereign-gold/5',
    danger: 'border-red-500/30 bg-red-500/5',
    success: 'border-emerald-500/30 bg-emerald-500/5',
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-5 backdrop-blur-sm transition-all',
        variantStyles[variant],
        glow && 'shadow-[0_0_30px_rgba(255,215,0,0.1)]',
        className
      )}
    >
      {children}
    </div>
  );
}

interface SovereignButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function SovereignButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: SovereignButtonProps) {
  const variantStyles = {
    primary:
      'bg-sovereign-gold text-sovereign-dark hover:bg-sovereign-gold-light font-bold shadow-[0_0_20px_rgba(255,215,0,0.2)]',
    secondary:
      'border border-sovereign-gold/30 text-sovereign-gold hover:bg-sovereign-gold/10',
    danger: 'border border-red-500/30 text-red-400 hover:bg-red-500/10',
    ghost: 'text-sovereign-text-secondary hover:text-sovereign-text hover:bg-sovereign-surface',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
}

interface SovereignInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: string;
}

export function SovereignInput({
  label,
  error,
  suffix,
  className,
  ...props
}: SovereignInputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-sovereign-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            'w-full rounded-lg border border-sovereign-border bg-sovereign-dark/50 px-4 py-2.5 text-sovereign-text placeholder-sovereign-text-muted focus:border-sovereign-gold focus:outline-none focus:ring-1 focus:ring-sovereign-gold/50 transition-all',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
            suffix && 'pr-16',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-sovereign-text-muted">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

interface SovereignBadgeProps {
  variant?: 'gold' | 'info' | 'warning' | 'danger' | 'success';
  children: React.ReactNode;
}

export function SovereignBadge({ variant = 'gold', children }: SovereignBadgeProps) {
  const styles = {
    gold: 'bg-sovereign-gold/10 text-sovereign-gold border-sovereign-gold/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
