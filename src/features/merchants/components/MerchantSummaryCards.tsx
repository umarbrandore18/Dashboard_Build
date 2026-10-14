import React from 'react';
import { Card } from '@/components/ui/Card';
import { Merchant } from '@/types';
import { Users2, CheckCircle2, Clock, ShieldAlert, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MerchantSummaryCardsProps {
  merchants: Merchant[];
  activeStatusFilter: string;
  onSelectStatus: (status: string) => void;
}

export const MerchantSummaryCards: React.FC<MerchantSummaryCardsProps> = ({
  merchants,
  activeStatusFilter,
  onSelectStatus,
}) => {
  // Dynamically calculate counts directly from records
  const total = merchants.length;
  const active = merchants.filter((m) => m.status === 'Active').length;
  const onboarding = merchants.filter((m) => m.status === 'Onboarding').length;
  const underReview = merchants.filter((m) => m.status === 'Under Review').length;
  const suspended = merchants.filter((m) => m.status === 'Suspended').length;

  const cards = [
    {
      id: 'ALL',
      title: 'Total Merchants',
      count: total,
      icon: Users2,
      color: 'text-slate-700 bg-slate-100 border-slate-200',
      activeRing: 'border-slate-800 ring-1 ring-slate-800',
    },
    {
      id: 'Active',
      title: 'Active Operating',
      count: active,
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      activeRing: 'border-emerald-600 ring-1 ring-emerald-600',
    },
    {
      id: 'Onboarding',
      title: 'In Onboarding',
      count: onboarding,
      icon: Clock,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      activeRing: 'border-blue-600 ring-1 ring-blue-600',
    },
    {
      id: 'Under Review',
      title: 'Under Review',
      count: underReview,
      icon: AlertCircle,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      activeRing: 'border-amber-600 ring-1 ring-amber-600',
    },
    {
      id: 'Suspended',
      title: 'Suspended / Action',
      count: suspended,
      icon: ShieldAlert,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      activeRing: 'border-rose-600 ring-1 ring-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeStatusFilter === c.id;

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectStatus(isSelected ? 'ALL' : c.id)}
            className="text-left w-full focus:outline-none"
          >
            <Card
              className={cn(
                'p-3.5 transition-all duration-150 cursor-pointer hover:shadow-xs',
                isSelected ? c.activeRing : 'border-slate-200/80 hover:border-slate-300'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 truncate">{c.title}</span>
                <div
                  className={cn(
                    'w-6 h-6 rounded-lg border flex items-center justify-center shrink-0',
                    c.color
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-slate-900">{c.count}</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {total > 0 ? `${Math.round((c.count / total) * 100)}%` : '0%'}
                </span>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
};

