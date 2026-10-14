export type CountryCode = 'MY' | 'ID' | 'IN' | 'VN' | 'TH' | 'PH';

export interface CountryInfo {
  code: CountryCode;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  isOperating: boolean;
  notes?: string;
}

export type MerchantStatus = 
  | 'Draft'
  | 'Onboarding'
  | 'Under Review'
  | 'Active'
  | 'Suspended'
  | 'Rejected'
  | 'Deactivated';

export type OnboardingStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Under Review'
  | 'Approved'
  | 'Requires Changes'
  | 'Rejected';

export interface PrimaryContact {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
}

export interface SettlementConfig {
  settlementCurrency: string;
  settlementFrequency: 'Daily (T+1)' | 'Twice Weekly' | 'Weekly (T+3)' | 'Monthly';
  settlementDestinationRef: string;
  market: CountryCode;
  reviewStatus: 'Approved' | 'Pending Review' | 'Action Required';
}

export interface CountryMarketConfig {
  countryCode: CountryCode;
  currencies: string[];
  enabledMethods: string[];
  status: 'Active' | 'Under Review' | 'Configuring' | 'Suspended';
  addedAt: string;
  settlementConfig: SettlementConfig;
}

export interface ActivityEvent {
  id: string;
  eventName: string;
  description: string;
  timestamp: string;
  actor: string;
  type: 'creation' | 'update' | 'country_expansion' | 'status_change' | 'compliance';
}

export interface Merchant {
  id: string;
  name: string;
  tradingName?: string;
  registrationNumber: string;
  businessType: string;
  website?: string;
  registeredCountry: CountryCode;
  businessAddress: string;
  businessDescription?: string;
  primaryContact: PrimaryContact;
  status: MerchantStatus;
  onboardingStatus: OnboardingStatus;
  operatingCountries: CountryMarketConfig[];
  currencies: string[];
  enabledPaymentMethods: string[];
  createdAt: string;
  lastActivityAt: string;
  activityHistory: ActivityEvent[];
}

export interface PaymentMethodOption {
  id: string;
  name: string;
  country: CountryCode;
  category: 'payin' | 'payout' | 'both';
  type: 'bank_transfer' | 'qr' | 'ewallet' | 'payout_channel' | 'virtual_account';
  description: string;
  iconName: string;
  badge?: string;
}

export interface OnboardingFormData {
  // Step 1: Business Information
  legalBusinessName: string;
  tradingName: string;
  registrationNumber: string;
  businessType: string;
  website: string;
  registeredCountry: CountryCode | '';
  businessAddress: string;
  businessDescription: string;

  // Step 2: Primary Contact
  contactName: string;
  workEmail: string;
  phone: string;
  jobTitle: string;

  // Step 3: Countries and Markets
  selectedCountries: CountryCode[];

  // Step 4: Payment Capabilities
  selectedPaymentMethods: {
    [key in CountryCode]?: string[];
  };

  // Step 5: Settlement Configuration
  settlements: {
    [key in CountryCode]?: {
      settlementCurrency: string;
      settlementFrequency: 'Daily (T+1)' | 'Twice Weekly' | 'Weekly (T+3)' | 'Monthly';
      settlementDestinationRef: string;
      authorisedDeclaration: boolean;
    };
  };
}

export interface OnboardingDraft {
  draftId: string;
  merchantId?: string;
  merchantName?: string;
  currentStep: number;
  lastUpdated: string;
  formData: OnboardingFormData;
}

export interface GlobalFilterState {
  country: 'ALL' | CountryCode;
  merchantId: 'ALL' | string;
  currency: 'ALL' | string;
  dateRange: '7d' | '30d' | '90d';
  searchQuery: string;
}

export interface MetricSummary {
  payinVolume: number;
  payinVolumeFormatted: string;
  payinChangePercent: number;

  payoutVolume: number;
  payoutVolumeFormatted: string;
  payoutChangePercent: number;

  revenue: number;
  revenueFormatted: string;
  revenueChangePercent: number;

  successRate: number;
  successRateFormatted: string;
  successRateChangePercent: number;

  activeMerchants: number;
  activeMerchantsChange: number;

  activePaymentMethods: number;
  activeCountriesCount: number;
}

export interface TimeSeriesPoint {
  date: string;
  label: string;
  payinVolume: number;
  payoutVolume: number;
  revenue: number;
  successRate: number;
  prevPayinVolume?: number;
  prevPayoutVolume?: number;
  prevRevenue?: number;
  prevSuccessRate?: number;
}

export interface OperationalHealthData {
  overallUptimePercent: number;
  payinSuccessRate: number;
  payinSuccessChange: number;
  payoutSuccessRate: number;
  payoutSuccessChange: number;
  failedCount: number;
  failedRate: number;
  pendingCount: number;
  pendingRate: number;
  status: 'Optimal' | 'Degraded' | 'Attention Required';
}

export interface OperationalIssue {
  id: string;
  title: string;
  description: string;
  affectedMarket: CountryCode;
  marketName: string;
  affectedMerchant?: string;
  impactMetric: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  nextActionLabel: string;
  actionRoute: string;
  filterAction?: {
    type: 'merchant' | 'country';
    value: string;
  };
}

export interface PaymentMethodPerformanceItem {
  id: string;
  name: string;
  country: CountryCode;
  type: string;
  volume: number;
  volumeFormatted: string;
  sharePercent: number;
  successRate: number;
  status: 'healthy' | 'degraded' | 'maintenance';
}

export interface CountryPerformanceItem {
  code: CountryCode;
  name: string;
  currency: string;
  flag: string;
  payinVolume: number;
  payinFormatted: string;
  payoutVolume: number;
  payoutFormatted: string;
  revenue: number;
  revenueFormatted: string;
  successRate: number;
  merchantsCount: number;
  growthPercent: number;
}

