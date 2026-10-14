import {
  MetricSummary,
  OperationalHealthData,
  TimeSeriesPoint,
  CountryPerformanceItem,
  PaymentMethodPerformanceItem,
  OperationalIssue,
  GlobalFilterState,
  CountryCode,
} from '@/types';
import {
  BASE_METRICS,
  BASE_OPERATIONAL_HEALTH,
  COUNTRY_PERFORMANCE,
  PAYMENT_METHOD_PERFORMANCE,
  OPERATIONAL_ISSUES,
  generateTimeSeries,
} from '@/data/sampleMetrics';
import { merchantService } from './merchantService';
import { formatCurrency, formatPercent } from '@/utils/formatters';

export const dashboardService = {
  /**
   * Fetch aggregate KPI metrics according to global filter state
   */
  async getMetrics(filters: GlobalFilterState): Promise<MetricSummary> {
    // Derive active merchants dynamically from stored merchants
    const allMerchants = await merchantService.getMerchants();
    const activeCount = allMerchants.filter((m) => m.status === 'Active').length;

    let payin = BASE_METRICS.payinVolume;
    let payout = BASE_METRICS.payoutVolume;
    let revenue = BASE_METRICS.revenue;
    let successRate = BASE_METRICS.successRate;

    // Filter adjustments by country
    if (filters.country !== 'ALL') {
      const countryData = COUNTRY_PERFORMANCE.find((c) => c.code === filters.country);
      if (countryData) {
        payin = countryData.payinVolume;
        payout = countryData.payoutVolume;
        revenue = countryData.revenue;
        successRate = countryData.successRate;
      }
    }

    // Filter adjustments by merchant
    if (filters.merchantId !== 'ALL') {
      const merchant = await merchantService.getMerchantById(filters.merchantId);
      if (merchant) {
        // Sample scaled merchant share
        const scale = filters.merchantId === 'MER-84920' ? 0.38 : 0.12;
        payin = Math.round(payin * scale);
        payout = Math.round(payout * scale);
        revenue = Math.round(revenue * scale);
        successRate = merchant.status === 'Suspended' ? 71.4 : 96.1;
      }
    }

    // Date range multiplier
    const rangeMultiplier = filters.dateRange === '7d' ? 0.23 : filters.dateRange === '90d' ? 2.85 : 1.0;
    payin = Math.round(payin * rangeMultiplier);
    payout = Math.round(payout * rangeMultiplier);
    revenue = Math.round(revenue * rangeMultiplier);

    const currencyCode = filters.currency !== 'ALL' ? filters.currency : 'MYR';

    return {
      payinVolume: payin,
      payinVolumeFormatted: formatCurrency(payin, currencyCode, true),
      payinChangePercent: BASE_METRICS.payinChangePercent,

      payoutVolume: payout,
      payoutVolumeFormatted: formatCurrency(payout, currencyCode, true),
      payoutChangePercent: BASE_METRICS.payoutChangePercent,

      revenue: revenue,
      revenueFormatted: formatCurrency(revenue, currencyCode, true),
      revenueChangePercent: BASE_METRICS.revenueChangePercent,

      successRate: successRate,
      successRateFormatted: formatPercent(successRate),
      successRateChangePercent: BASE_METRICS.successRateChangePercent,

      activeMerchants: filters.merchantId !== 'ALL' ? 1 : filters.country !== 'ALL' 
        ? allMerchants.filter((m) => m.status === 'Active' && m.operatingCountries.some((c) => c.countryCode === filters.country)).length
        : activeCount,
      activeMerchantsChange: 14,

      activePaymentMethods: filters.country === 'MY' ? 5 : filters.country === 'ID' ? 6 : filters.country === 'IN' ? 3 : 12,
      activeCountriesCount: filters.country !== 'ALL' ? 1 : 3,
    };
  },

  /**
   * Fetch time-series chart data for selected range and country
   */
  async getTimeSeries(range: '7d' | '30d' | '90d', country: 'ALL' | CountryCode = 'ALL'): Promise<TimeSeriesPoint[]> {
    return generateTimeSeries(range, country);
  },

  /**
   * Fetch operational health stats
   */
  async getOperationalHealth(country: 'ALL' | CountryCode = 'ALL'): Promise<OperationalHealthData> {
    if (country === 'ID') {
      return {
        ...BASE_OPERATIONAL_HEALTH,
        overallUptimePercent: 99.85,
        payinSuccessRate: 93.4,
        payinSuccessChange: -1.2,
        failedRate: 5.6,
        pendingCount: 214,
        pendingRate: 2.1,
        status: 'Degraded',
      };
    }
    if (country === 'MY') {
      return {
        ...BASE_OPERATIONAL_HEALTH,
        overallUptimePercent: 99.99,
        payinSuccessRate: 96.2,
        payinSuccessChange: 0.5,
        failedRate: 3.2,
        pendingCount: 88,
        pendingRate: 0.6,
        status: 'Optimal',
      };
    }
    return BASE_OPERATIONAL_HEALTH;
  },

  /**
   * Fetch country performance comparison
   */
  async getCountryPerformance(): Promise<CountryPerformanceItem[]> {
    return COUNTRY_PERFORMANCE;
  },

  /**
   * Fetch payment method performance filtered by country
   */
  async getPaymentMethodPerformance(country: 'ALL' | CountryCode = 'ALL'): Promise<PaymentMethodPerformanceItem[]> {
    if (country === 'ALL') {
      return PAYMENT_METHOD_PERFORMANCE;
    }
    return PAYMENT_METHOD_PERFORMANCE.filter((pm) => pm.country === country);
  },

  /**
   * Fetch operational issues requiring attention
   */
  async getOperationalIssues(country: 'ALL' | CountryCode = 'ALL'): Promise<OperationalIssue[]> {
    if (country === 'ALL') {
      return OPERATIONAL_ISSUES;
    }
    return OPERATIONAL_ISSUES.filter((issue) => issue.affectedMarket === country);
  },
};

