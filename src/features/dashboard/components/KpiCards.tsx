import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { MetricSummary } from '@/types';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users2,
  CreditCard,
  Percent,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface KpiCardsProps {
  metrics: MetricSummary;
  currency: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics, currency }) => {
  const cards = [
    {
      id: 'payin-volume',
      title: 'Pay-in Volume',
      value: metrics.payinVolumeFormatted,
      change: metrics.payinChangePercent,
      changeLabel: 'vs previous period',
      isPositive: metrics.payinChangePercent >= 0,
      icon: ArrowDownToLine,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      id: 'payout-volume',
      title: 'Payout Volume',
      value: metrics.payoutVolumeFormatted,
      change: metrics.payoutChangePercent,
      changeLabel: 'vs previous period',
      isPositive: metrics.payoutChangePercent >= 0,
      icon: ArrowUpFromLine,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      id: 'revenue',
      title: 'Net Revenue',
      value: metrics.revenueFormatted,
      change: metrics.revenueChangePercent,
      changeLabel: 'vs previous period',
      isPositive: metrics.revenueChangePercent >= 0,
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      id: 'success-rate',
      title: 'Overall Success Rate',
      value: metrics.successRateFormatted,
      change: metrics.successRateChangePercent,
      changeLabel: 'vs previous period',
      isPositive: metrics.successRateChangePercent >= 0,
      icon: Percent,
      color: 'text-teal-600 bg-teal-50 border-teal-100',
    },
    {
      id: 'active-merchants',
      title: 'Active Merchants',
      value: metrics.activeMerchants.toLocaleString(),
      change: metrics.activeMerchantsChange,
      changeLabel: 'newly activated',
      isPositive: true,
      icon: Users2,
      color: 'text-sky-600 bg-sky-50 border-sky-100',
      isCount: true,
    },
    {
      id: 'active-methods',
      title: 'Active Payment Methods',
      value: metrics.activePaymentMethods.toString(),
      subtext: `Across ${metrics.activeCountriesCount} active markets`,
      icon: CreditCard,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.id} className="p-4 flex flex-col justify-between hoverable">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-500 truncate" title={card.title}>
                  {card.title}
                </span>
                <div
                  className={cn(
                    'w-7 h-7 rounded-lg border flex items-center justify-center shrink-0',
                    card.color
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              {card.change !== undefined ? (
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      'inline-flex items-center font-semibold text-[11px]',
                      card.isPositive ? 'text-emerald-600' : 'text-rose-600'
                    )}
                  >
                    {card.isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    {card.isPositive ? '+' : ''}
                    {card.change}%
                  </span>
                  <span className="text-slate-400 truncate text-[10px]">
                    {card.changeLabel}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 truncate text-[10px]">{card.subtext}</span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

