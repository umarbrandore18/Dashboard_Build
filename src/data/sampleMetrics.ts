import type {
  MetricSummary,
  OperationalHealthData,
  TimeSeriesPoint,
  CountryPerformanceItem,
  PaymentMethodPerformanceItem,
  OperationalIssue,
  CountryCode,
} from '@/types';

export const BASE_METRICS: MetricSummary = {
  payinVolume: 18_420_000,
  payinVolumeFormatted: 'RM 18.4M',
  payinChangePercent: 12.4,

  payoutVolume: 7_210_000,
  payoutVolumeFormatted: 'RM 7.2M',
  payoutChangePercent: 8.1,

  revenue: 428_000,
  revenueFormatted: 'RM 428K',
  revenueChangePercent: 15.3,

  successRate: 94.8,
  successRateFormatted: '94.8%',
  successRateChangePercent: 0.6,

  activeMerchants: 248,
  activeMerchantsChange: 14,

  activePaymentMethods: 12,
  activeCountriesCount: 3,
};

export const BASE_OPERATIONAL_HEALTH: OperationalHealthData = {
  overallUptimePercent: 99.98,
  payinSuccessRate: 95.2,
  payinSuccessChange: 0.8,
  payoutSuccessRate: 98.6,
  payoutSuccessChange: 0.3,
  failedCount: 1248,
  failedRate: 4.2,
  pendingCount: 342,
  pendingRate: 1.0,
  status: 'Optimal',
};

// Generates time-series data points for charts
export function generateTimeSeries(range: '7d' | '30d' | '90d', country: 'ALL' | CountryCode = 'ALL'): TimeSeriesPoint[] {
  const pointsCount = range === '7d' ? 7 : range === '30d' ? 30 : 12; // 12 weeks for 90d
  const result: TimeSeriesPoint[] = [];

  const countryMultiplier = country === 'MY' ? 0.61 : country === 'ID' ? 0.29 : country === 'IN' ? 0.10 : 1.0;

  const now = new Date('2026-10-14T12:00:00Z');

  if (range === '7d') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

      // Daily volume around ~2.6M total
      const variance = 0.85 + Math.sin(i * 1.2) * 0.25;
      const payin = Math.round(2_600_000 * variance * countryMultiplier);
      const payout = Math.round(1_030_000 * (0.9 + Math.cos(i) * 0.15) * countryMultiplier);
      const rev = Math.round(payin * 0.0232);
      const sr = 94.2 + (Math.sin(i) * 1.2);

      const prevPayin = Math.round(payin * (0.88 + Math.cos(i) * 0.05));
      const prevPayout = Math.round(payout * 0.92);
      const prevRev = Math.round(rev * 0.89);
      const prevSr = 93.6 + Math.cos(i) * 0.8;

      result.push({
        date: d.toISOString().split('T')[0],
        label: dayName,
        payinVolume: payin,
        payoutVolume: payout,
        revenue: rev,
        successRate: Number(sr.toFixed(1)),
        prevPayinVolume: prevPayin,
        prevPayoutVolume: prevPayout,
        prevRevenue: prevRev,
        prevSuccessRate: Number(prevSr.toFixed(1)),
      });
    }
  } else if (range === '30d') {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

      const cycle = Math.sin(i * 0.4) * 0.2 + (i % 7 === 0 || i % 7 === 6 ? -0.15 : 0.1);
      const factor = (0.9 + cycle) * countryMultiplier;

      const payin = Math.round(614_000 * factor);
      const payout = Math.round(240_000 * factor);
      const rev = Math.round(payin * 0.0232);
      const sr = 94.8 + Math.sin(i * 0.5) * 1.1;

      result.push({
        date: d.toISOString().split('T')[0],
        label: dayLabel,
        payinVolume: payin,
        payoutVolume: payout,
        revenue: rev,
        successRate: Number(Math.min(98.5, Math.max(90.2, sr)).toFixed(1)),
        prevPayinVolume: Math.round(payin * 0.89),
        prevPayoutVolume: Math.round(payout * 0.92),
        prevRevenue: Math.round(rev * 0.87),
        prevSuccessRate: 94.1,
      });
    }
  } else {
    // 90 days - weekly aggregations (12 weeks)
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - (i * 7));
      const weekLabel = `Wk ${12 - i} (${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})`;

      const factor = (0.95 + (12 - i) * 0.04) * countryMultiplier;
      const payin = Math.round(1_450_000 * factor);
      const payout = Math.round(580_000 * factor);
      const rev = Math.round(payin * 0.0235);
      const sr = 94.4 + (i % 3) * 0.4;

      result.push({
        date: d.toISOString().split('T')[0],
        label: weekLabel,
        payinVolume: payin,
        payoutVolume: payout,
        revenue: rev,
        successRate: Number(sr.toFixed(1)),
        prevPayinVolume: Math.round(payin * 0.84),
        prevPayoutVolume: Math.round(payout * 0.88),
        prevRevenue: Math.round(rev * 0.82),
        prevSuccessRate: 93.8,
      });
    }
  }

  return result;
}

export const COUNTRY_PERFORMANCE: CountryPerformanceItem[] = [
  {
    code: 'MY',
    name: 'Malaysia',
    currency: 'MYR',
    flag: '🇲🇾',
    payinVolume: 11_236_000,
    payinFormatted: 'RM 11.2M',
    payoutVolume: 3_820_000,
    payoutFormatted: 'RM 3.8M',
    revenue: 264_000,
    revenueFormatted: 'RM 264K',
    successRate: 96.2,
    merchantsCount: 142,
    growthPercent: 14.8,
  },
  {
    code: 'ID',
    name: 'Indonesia',
    currency: 'IDR',
    flag: '🇮🇩',
    payinVolume: 5_384_000,
    payinFormatted: 'RM 5.4M (Rp 18.9B)',
    payoutVolume: 1_890_000,
    payoutFormatted: 'RM 1.9M (Rp 6.6B)',
    revenue: 118_000,
    revenueFormatted: 'RM 118K',
    successRate: 93.4,
    merchantsCount: 78,
    growthPercent: 18.2,
  },
  {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    flag: '🇮🇳',
    payinVolume: 1_800_000,
    payinFormatted: 'RM 1.8M (₹ 3.5Cr)',
    payoutVolume: 1_500_000,
    payoutFormatted: 'RM 1.5M (₹ 2.9Cr)',
    revenue: 46_000,
    revenueFormatted: 'RM 46K',
    successRate: 94.1,
    merchantsCount: 28,
    growthPercent: 22.4,
  },
];

export const PAYMENT_METHOD_PERFORMANCE: PaymentMethodPerformanceItem[] = [
  // Malaysia
  {
    id: 'my-fpx',
    name: 'FPX (Online Banking)',
    country: 'MY',
    type: 'Bank Transfer',
    volume: 6_240_000,
    volumeFormatted: 'RM 6.2M',
    sharePercent: 33.9,
    successRate: 95.8,
    status: 'healthy',
  },
  {
    id: 'my-duitnow-qr',
    name: 'DuitNow QR',
    country: 'MY',
    type: 'National QR',
    volume: 2_890_000,
    volumeFormatted: 'RM 2.9M',
    sharePercent: 15.7,
    successRate: 97.4,
    status: 'healthy',
  },
  {
    id: 'my-tng',
    name: "Touch 'n Go eWallet",
    country: 'MY',
    type: 'eWallet',
    volume: 1_420_000,
    volumeFormatted: 'RM 1.4M',
    sharePercent: 7.7,
    successRate: 96.1,
    status: 'healthy',
  },
  {
    id: 'my-grabpay',
    name: 'GrabPay',
    country: 'MY',
    type: 'eWallet',
    volume: 686_000,
    volumeFormatted: 'RM 686K',
    sharePercent: 3.7,
    successRate: 95.2,
    status: 'healthy',
  },

  // Indonesia
  {
    id: 'id-bca-va',
    name: 'BCA Virtual Account',
    country: 'ID',
    type: 'Virtual Account',
    volume: 2_640_000,
    volumeFormatted: 'RM 2.6M (Rp 9.2B)',
    sharePercent: 14.3,
    successRate: 94.1,
    status: 'healthy',
  },
  {
    id: 'id-mandiri-va',
    name: 'Mandiri Virtual Account',
    country: 'ID',
    type: 'Virtual Account',
    volume: 1_490_000,
    volumeFormatted: 'RM 1.5M (Rp 5.2B)',
    sharePercent: 8.1,
    successRate: 93.8,
    status: 'healthy',
  },
  {
    id: 'id-gopay',
    name: 'GoPay',
    country: 'ID',
    type: 'eWallet',
    volume: 840_000,
    volumeFormatted: 'RM 840K (Rp 2.9B)',
    sharePercent: 4.6,
    successRate: 94.6,
    status: 'healthy',
  },
  {
    id: 'id-shopeepay',
    name: 'ShopeePay',
    country: 'ID',
    type: 'eWallet',
    volume: 414_000,
    volumeFormatted: 'RM 414K (Rp 1.4B)',
    sharePercent: 2.2,
    successRate: 92.5,
    status: 'degraded',
  },

  // India
  {
    id: 'in-imps',
    name: 'IMPS Direct Payout',
    country: 'IN',
    type: 'Payout Corridor',
    volume: 980_000,
    volumeFormatted: 'RM 980K (₹ 1.9Cr)',
    sharePercent: 5.3,
    successRate: 96.8,
    status: 'healthy',
  },
  {
    id: 'in-upi-payout',
    name: 'UPI Instant Payout',
    country: 'IN',
    type: 'Payout Corridor',
    volume: 520_000,
    volumeFormatted: 'RM 520K (₹ 1.0Cr)',
    sharePercent: 2.8,
    successRate: 97.2,
    status: 'healthy',
  },
];

export const OPERATIONAL_ISSUES: OperationalIssue[] = [
  {
    id: 'issue-001',
    title: 'FPX success rate decreased in Malaysia',
    description: 'Bank Islam and RHB gateway upstream timeouts observed during afternoon peak trading. Failover routing to secondary host active.',
    affectedMarket: 'MY',
    marketName: 'Malaysia',
    impactMetric: '-3.8% success rate drop (last 4 hours)',
    severity: 'warning',
    timestamp: '2026-10-14T11:20:00Z',
    nextActionLabel: 'View Malaysia Merchants',
    actionRoute: '/merchants?country=MY',
    filterAction: {
      type: 'country',
      value: 'MY',
    },
  },
  {
    id: 'issue-002',
    title: 'Pending payment volume increased in Indonesia',
    description: 'Batch settlement acknowledgement delay from BCA Virtual Account network clearing window. Re-query job running every 60s.',
    affectedMarket: 'ID',
    marketName: 'Indonesia',
    impactMetric: '214 transactions queued (Rp 420M pending)',
    severity: 'warning',
    timestamp: '2026-10-14T09:45:00Z',
    nextActionLabel: 'Filter Indonesia Merchants',
    actionRoute: '/merchants?country=ID',
    filterAction: {
      type: 'country',
      value: 'ID',
    },
  },
  {
    id: 'issue-003',
    title: "Acme Trading transaction volume declined",
    description: 'Week-over-week checkout volume dropped by 28% following API v2 credentials key rotation on merchant e-commerce platform.',
    affectedMarket: 'MY',
    marketName: 'Malaysia',
    affectedMerchant: 'Acme Trading Sdn Bhd (MER-84920)',
    impactMetric: '-RM 48,200 below 7-day rolling average',
    severity: 'critical',
    timestamp: '2026-10-14T08:10:00Z',
    nextActionLabel: 'View Acme Profile',
    actionRoute: '/merchants/MER-84920',
    filterAction: {
      type: 'merchant',
      value: 'MER-84920',
    },
  },
];
