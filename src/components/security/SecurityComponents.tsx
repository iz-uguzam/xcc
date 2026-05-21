import React from 'react';
import { Shield, AlertTriangle, XCircle, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/constants';

interface RiskBannerProps {
  level: RiskLevel;
  title: string;
  description: string;
  className?: string;
}

const levelConfig: Record<
  RiskLevel,
  { icon: React.ElementType; bgClass: string; borderClass: string; textClass: string }
> = {
  info: {
    icon: Info,
    bgClass: 'bg-blue-500/5',
    borderClass: 'border-blue-500/30',
    textClass: 'text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-orange-500/5',
    borderClass: 'border-orange-500/30',
    textClass: 'text-orange-400',
  },
  danger: {
    icon: XCircle,
    bgClass: 'bg-red-500/5',
    borderClass: 'border-red-500/30',
    textClass: 'text-red-400',
  },
  block: {
    icon: XCircle,
    bgClass: 'bg-red-600/10',
    borderClass: 'border-red-600/50',
    textClass: 'text-red-500',
  },
};

export function RiskBanner({ level, title, description, className }: RiskBannerProps) {
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        config.bgClass,
        config.borderClass,
        className
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.textClass)} />
      <div>
        <p className={cn('font-semibold text-sm', config.textClass)}>{title}</p>
        <p className="text-xs text-sovereign-text-secondary mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

interface SecurityChecklistProps {
  items: { id: string; label: string; passed: boolean }[];
  className?: string;
}

export function SecurityChecklist({ items, className }: SecurityChecklistProps) {
  const allPassed = items.every((item) => item.passed);

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        allPassed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-orange-500/30 bg-orange-500/5',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Shield className={cn('h-4 w-4', allPassed ? 'text-emerald-400' : 'text-orange-400')} />
        <span className={cn('text-sm font-semibold', allPassed ? 'text-emerald-400' : 'text-orange-400')}>
          安全检查 {allPassed ? '✓ 全部通过' : '⚠ 存在风险'}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            {item.passed ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
            )}
            <span className={cn('text-xs', item.passed ? 'text-sovereign-text-secondary' : 'text-red-400')}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SovereigntyDeclarationProps {
  declaration: string;
  confirmed: boolean;
  onConfirm: (confirmed: boolean) => void;
}

export function SovereigntyDeclaration({ declaration, confirmed, onConfirm }: SovereigntyDeclarationProps) {
  return (
    <div className="rounded-lg border border-sovereign-gold/20 bg-sovereign-gold/5 p-4">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-sovereign-gold shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-sovereign-gold mb-1">主权声明</p>
          <p className="text-sm text-sovereign-text-secondary leading-relaxed">{declaration}</p>
          <label className="flex items-center gap-2 mt-3 cursor-pointer group">
            <div
              className={cn(
                'h-5 w-5 rounded border-2 flex items-center justify-center transition-all',
                confirmed
                  ? 'border-sovereign-gold bg-sovereign-gold'
                  : 'border-sovereign-text-muted group-hover:border-sovereign-gold/50'
              )}
            >
              {confirmed && (
                <svg className="h-3 w-3 text-sovereign-dark" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => onConfirm(e.target.checked)}
              className="sr-only"
            />
            <span className="text-sm text-sovereign-text-secondary">我已阅读并确认以上声明</span>
          </label>
        </div>
      </div>
    </div>
  );
}
