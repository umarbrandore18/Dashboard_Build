import type { CountryCode } from '@/types';

export function formatCurrency(
  amount: number,
  currency: string = 'MYR',
  compact: boolean = false
): string {
  if (isNaN(amount)) return '-';

  const currencyMap: Record<string, { symbol: string; locale: string }> = {
    MYR: { symbol: 'RM ', locale: 'en-MY' },
    IDR: { symbol: 'Rp ', locale: 'id-ID' },
    INR: { symbol: '₹ ', locale: 'en-IN' },
    USD: { symbol: '$ ', locale: 'en-US' },
    SGD: { symbol: 'S$ ', locale: 'en-SG' },
  };

  const config = currencyMap[currency] || { symbol: `${currency} `, locale: 'en-US' };

  if (compact) {
    if (Math.abs(amount) >= 1_000_000_000) {
      return `${config.symbol}${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    if (Math.abs(amount) >= 1_000_000) {
      return `${config.symbol}${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `${config.symbol}${(amount / 1_000).toFixed(0)}K`;
    }
    return `${config.symbol}${amount.toLocaleString()}`;
  }

  return `${config.symbol}${amount.toLocaleString(config.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercent(value: number, includeSign: boolean = false): string {
  if (isNaN(value)) return '0.0%';
  const prefix = includeSign && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

export function formatDate(dateString: string, includeTime: boolean = false): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
    };

    return new Intl.DateTimeFormat('en-GB', options).format(d);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function getCountryName(code: CountryCode | string): string {
  const map: Record<string, string> = {
    MY: 'Malaysia',
    ID: 'Indonesia',
    IN: 'India',
    VN: 'Vietnam',
    TH: 'Thailand',
    PH: 'Philippines',
    ALL: 'All countries',
  };
  return map[code] || code;
}

export function getCountryFlag(code: CountryCode | string): string {
  const map: Record<string, string> = {
    MY: '🇲🇾',
    ID: '🇮🇩',
    IN: '🇮🇳',
    VN: '🇻🇳',
    TH: '🇹🇭',
    PH: '🇵🇭',
    ALL: '🌐',
  };
  return map[code] || '🌐';
}
