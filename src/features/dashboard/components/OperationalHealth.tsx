import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { OperationalHealthData } from '@/types';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface OperationalHealthProps {
  health: OperationalHealthData;
}

export const OperationalHealth: React.FC<OperationalHealthProps> = ({ health }) => {
  const isOptimal = health.status === 'Optimal';

  return (
    <Card className="hoverable">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <CardTitle>Operational Health & Reliability</CardTitle>
            <Badge status={health.status} showDot size="sm">
              {health.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{health.overallUptimePercent}% Uptime</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pay-in Success */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Pay-in Success</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900">{health.payinSuccessRate}%</span>
              <span
                className={cn(
                  'text-[11px] font-semibold flex items-center',
                  health.payinSuccessChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                )}
              >
                {health.payinSuccessChange >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {health.payinSuccessChange >= 0 ? '+' : ''}
                {health.payinSuccessChange}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${health.payinSuccessRate}%` }}
              />
            </div>
          </div>

          {/* Payout Success */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Payout Success</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900">{health.payoutSuccessRate}%</span>
              <span
                className={cn(
                  'text-[11px] font-semibold flex items-center',
                  health.payoutSuccessChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                )}
              >
                {health.payoutSuccessChange >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {health.payoutSuccessChange >= 0 ? '+' : ''}
                {health.payoutSuccessChange}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${health.payoutSuccessRate}%` }}
              />
            </div>
          </div>

          {/* Failed Transactions */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Failed Volume</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900">
                {health.failedCount.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-rose-600">
                {health.failedRate}% fail rate
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${health.failedRate * 5}%` }}
              />
            </div>
          </div>

          {/* Pending In-Flight */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Pending In-Flight</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900">
                {health.pendingCount.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-amber-600">
                {health.pendingRate}% queue
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${health.pendingRate * 15}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

