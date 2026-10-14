import React from 'react';
import { cn } from '@/utils/cn';
import { MerchantStatus, OnboardingStatus } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';
  status?: MerchantStatus | OnboardingStatus | string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  status,
  size = 'md',
  showDot = false,
  children,
  ...props
}) => {
  // Derive variant from status if not explicitly given
  let computedVariant = variant || 'neutral';

  if (status) {
    switch (status) {
      case 'Active':
      case 'Approved':
      case 'Optimal':
        computedVariant = 'success';
        break;
      case 'Under Review':
      case 'In Progress':
      case 'Pending Review':
      case 'Degraded':
        computedVariant = 'warning';
        break;
      case 'Suspended':
      case 'Rejected':
      case 'Requires Changes':
      case 'Action Required':
        computedVariant = 'error';
        break;
      case 'Onboarding':
      case 'Configuring':
        computedVariant = 'info';
        break;
      case 'Draft':
      case 'Not Started':
      case 'Deactivated':
      default:
        computedVariant = 'neutral';
        break;
    }
  }

  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    error: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-blue-50 text-blue-700 border-blue-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dots = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-400',
    purple: 'bg-indigo-500',
    default: 'bg-slate-400',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1.5',
    md: 'text-xs px-2.5 py-1 font-medium gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border tracking-wide select-none',
        variants[computedVariant],
        sizes[size],
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dots[computedVariant])}
          aria-hidden="true"
        />
      )}
      <span>{children || status}</span>
    </span>
  );
};

