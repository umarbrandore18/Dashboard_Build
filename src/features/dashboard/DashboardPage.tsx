import React, { useState, useEffect, useCallback } from 'react';
import { useFilters } from '@/context/FilterContext';
import { dashboardService } from '@/services/dashboardService';
import {
  MetricSummary,
  OperationalHealthData,
  TimeSeriesPoint,
  CountryPerformanceItem,
  PaymentMethodPerformanceItem,
  OperationalIssue,
} from '@/types';
import { KpiCards } from './components/KpiCards';
import { PerformanceChart } from './components/PerformanceChart';
import { OperationalHealth } from './components/OperationalHealth';
import { CountryPerformance } from './components/CountryPerformance';
import { PaymentMethodPerformance } from './components/PaymentMethodPerformance';
import { AttentionRequired } from './components/AttentionRequired';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  RotateCcw,
  AlertCircle,
  Sparkles,
  Info,
  SlidersHorizontal,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { filters, setDateRange, resetFilters } = useFilters();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<MetricSummary | null>(null);
  const [health, setHealth] = useState<OperationalHealthData | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [countryPerf, setCountryPerf] = useState<CountryPerformanceItem[]>([]);
  const [methodPerf, setMethodPerf] = useState<PaymentMethodPerformanceItem[]>([]);
  const [issues, setIssues] = useState<OperationalIssue[]>([]);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate realistic micro-latency
      const [m, h, ts, cp, mp, iss] = await Promise.all([
        dashboardService.getMetrics(filters),
        dashboardService.getOperationalHealth(filters.country),
        dashboardService.getTimeSeries(filters.dateRange, filters.country),
        dashboardService.getCountryPerformance(),
        dashboardService.getPaymentMethodPerformance(filters.country),
        dashboardService.getOperationalIssues(filters.country),
      ]);

      setMetrics(m);
      setHealth(h);
      setTimeSeries(ts);
      setCountryPerf(cp);
      setMethodPerf(mp);
      setIssues(iss);
    } catch (err: any) {
      console.error('Failed to load dashboard metrics:', err);
      setError(err?.message || 'Failed to retrieve operational metrics. Please check network connectivity.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (error) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<AlertCircle className="w-8 h-8 text-rose-500" />}
          title="Unable to Load Dashboard Operations"
          description={error}
          action={
            <Button variant="primary" size="sm" onClick={loadDashboardData} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Retry Loading
            </Button>
          }
          secondaryAction={
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Context Overview + Demo Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Global Operations Dashboard
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Mesh
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-currency settlement monitoring and cross-border routing health
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {filters.country !== 'ALL' || filters.merchantId !== 'ALL' || filters.currency !== 'ALL' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />}
              className="text-xs text-blue-700 bg-blue-50/60 border-blue-200"
            >
              Reset Filters
            </Button>
          ) : null}

          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            isLoading={isLoading}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
            title="Refresh dashboard metrics"
            className="text-xs"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Demo Notice Alert */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100/80 border border-slate-200 text-[11px] text-slate-600">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <p>
          <strong>Sample Simulation Data:</strong> All volumes, settlement balances, and bank gateway metrics shown are fictional demonstration records.
        </p>
      </div>

      {/* Loading Skeletons vs Rendered Modules */}
      {isLoading && !metrics ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      ) : (
        <>
          {/* KPI Summary Cards */}
          {metrics && (
            <KpiCards
              metrics={metrics}
              currency={filters.currency !== 'ALL' ? filters.currency : 'MYR'}
            />
          )}

          {/* Attention Required Items */}
          {issues.length > 0 && <AttentionRequired issues={issues} />}

          {/* Operational Health Reliability Matrix */}
          {health && <OperationalHealth health={health} />}

          {/* Interactive Chart */}
          <PerformanceChart
            data={timeSeries}
            currency={filters.currency !== 'ALL' ? filters.currency : 'MYR'}
            selectedRange={filters.dateRange}
            onRangeChange={setDateRange}
          />

          {/* Regional Country Breakdown */}
          <CountryPerformance countries={countryPerf} />

          {/* Payment Method Capabilities by Market */}
          <PaymentMethodPerformance
            methods={methodPerf}
            selectedCountry={filters.country}
          />
        </>
      )}
    </div>
  );
};

