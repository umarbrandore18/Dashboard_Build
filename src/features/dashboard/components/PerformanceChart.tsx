import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TimeSeriesPoint } from '@/types';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface PerformanceChartProps {
  data: TimeSeriesPoint[];
  currency: string;
  selectedRange: '7d' | '30d' | '90d';
  onRangeChange: (range: '7d' | '30d' | '90d') => void;
}

type MetricType = 'payinVolume' | 'payoutVolume' | 'revenue' | 'successRate';

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  currency,
  selectedRange,
  onRangeChange,
}) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('payinVolume');
  const [showComparison, setShowComparison] = useState(true);

  const metricConfigs = {
    payinVolume: {
      label: 'Pay-in Volume',
      color: '#2563EB', // Blue 600
      prevColor: '#93C5FD',
      formatter: (v: number) => formatCurrency(v, currency, true),
      tooltipFormatter: (v: number) => formatCurrency(v, currency, false),
    },
    payoutVolume: {
      label: 'Payout Volume',
      color: '#4F46E5', // Indigo 600
      prevColor: '#C7D2FE',
      formatter: (v: number) => formatCurrency(v, currency, true),
      tooltipFormatter: (v: number) => formatCurrency(v, currency, false),
    },
    revenue: {
      label: 'Net Revenue',
      color: '#059669', // Emerald 600
      prevColor: '#A7F3D0',
      formatter: (v: number) => formatCurrency(v, currency, true),
      tooltipFormatter: (v: number) => formatCurrency(v, currency, false),
    },
    successRate: {
      label: 'Success Rate',
      color: '#0D9488', // Teal 600
      prevColor: '#99F6E4',
      formatter: (v: number) => formatPercent(v),
      tooltipFormatter: (v: number) => formatPercent(v),
    },
  };

  const currentConfig = metricConfigs[activeMetric];

  const prevKey =
    activeMetric === 'payinVolume'
      ? 'prevPayinVolume'
      : activeMetric === 'payoutVolume'
      ? 'prevPayoutVolume'
      : activeMetric === 'revenue'
      ? 'prevRevenue'
      : 'prevSuccessRate';

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentVal = payload[0]?.value;
      const prevVal = payload[1]?.value;
      const diff = prevVal && prevVal > 0 ? ((currentVal - prevVal) / prevVal) * 100 : null;

      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[180px]">
          <p className="text-slate-400 font-medium mb-1.5">{label}</p>
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-slate-300">Current Period:</span>
            <span className="font-bold text-white">
              {currentConfig.tooltipFormatter(currentVal)}
            </span>
          </div>
          {showComparison && prevVal !== undefined && (
            <div className="flex items-center justify-between gap-3 text-slate-400 border-t border-slate-800 pt-1 mt-1">
              <span>Previous Period:</span>
              <span>{currentConfig.tooltipFormatter(prevVal)}</span>
            </div>
          )}
          {diff !== null && (
            <div className="text-[11px] font-semibold mt-1.5 pt-1 border-t border-slate-800 flex justify-between">
              <span className="text-slate-400">Variance:</span>
              <span className={diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {diff >= 0 ? '+' : ''}
                {diff.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="hoverable">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Payment Performance Velocity</CardTitle>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Interactive
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-currency transaction trends and previous-period benchmarks
          </p>
        </div>

        {/* Top Controls: Range switcher + Comparison toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Compare Toggle */}
          <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100">
            <input
              type="checkbox"
              checked={showComparison}
              onChange={(e) => setShowComparison(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-medium">Compare prev. period</span>
          </label>

          {/* Range tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {(['7d', '30d', '90d'] as const).map((rng) => (
              <button
                key={rng}
                onClick={() => onRangeChange(rng)}
                className={cn(
                  'px-2.5 py-1 text-xs font-semibold rounded-md transition-all',
                  selectedRange === rng
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {rng.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Metric Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-none border-b border-slate-100">
          {(Object.keys(metricConfigs) as MetricType[]).map((mKey) => {
            const cfg = metricConfigs[mKey];
            const isSelected = activeMetric === mKey;
            return (
              <button
                key={mKey}
                onClick={() => setActiveMetric(mKey)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 border select-none',
                  isSelected
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Chart View */}
        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="currentMetricGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="prevMetricGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.prevColor} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={currentConfig.prevColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                dy={6}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={currentConfig.formatter}
                dx={-4}
                domain={activeMetric === 'successRate' ? [85, 100] : ['auto', 'auto']}
              />

              <Tooltip content={<CustomTooltip />} />

              {showComparison && (
                <Area
                  type="monotone"
                  dataKey={prevKey}
                  name="Previous Period"
                  stroke={currentConfig.prevColor}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="url(#prevMetricGradient)"
                />
              )}

              <Area
                type="monotone"
                dataKey={activeMetric}
                name="Current Period"
                stroke={currentConfig.color}
                strokeWidth={2.5}
                fill="url(#currentMetricGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

