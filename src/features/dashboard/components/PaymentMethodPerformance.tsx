import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PaymentMethodPerformanceItem, CountryCode } from '@/types';
import { CreditCard, QrCode, Smartphone, Building, ArrowUpRight, Zap } from 'lucide-react';
import { getCountryFlag, getCountryName } from '@/utils/formatters';

interface PaymentMethodPerformanceProps {
  methods: PaymentMethodPerformanceItem[];
  selectedCountry: 'ALL' | CountryCode;
}

export const PaymentMethodPerformance: React.FC<PaymentMethodPerformanceProps> = ({
  methods,
  selectedCountry,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | CountryCode>(selectedCountry);

  // Sync if parent updates
  React.useEffect(() => {
    setActiveTab(selectedCountry);
  }, [selectedCountry]);

  const filteredMethods =
    activeTab === 'ALL' ? methods : methods.filter((m) => m.country === activeTab);

  const getMethodIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bank transfer':
      case 'virtual account':
        return <Building className="w-4 h-4 text-blue-600" />;
      case 'national qr':
        return <QrCode className="w-4 h-4 text-teal-600" />;
      case 'ewallet':
        return <Smartphone className="w-4 h-4 text-indigo-600" />;
      case 'payout corridor':
        return <ArrowUpRight className="w-4 h-4 text-purple-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <Card className="hoverable">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3">
        <div>
          <CardTitle>Payment Method Capabilities & Mix</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time routing throughput by localized rails and payment schemes
          </p>
        </div>

        {/* Country filter tabs */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          {(['ALL', 'MY', 'ID', 'IN'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 select-none ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{getCountryFlag(tab)}</span>
              <span>{tab === 'ALL' ? 'All Rails' : tab}</span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-2 pl-2">Rail / Method</th>
                <th className="pb-2">Country Market</th>
                <th className="pb-2">Category</th>
                <th className="pb-2 text-right">Volume</th>
                <th className="pb-2 text-right">Network Share</th>
                <th className="pb-2 text-right">Success Rate</th>
                <th className="pb-2 text-right pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredMethods.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 pl-2 font-medium text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                        {getMethodIcon(m.type)}
                      </div>
                      <span className="font-semibold">{m.name}</span>
                    </div>
                  </td>

                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                      <span>{getCountryFlag(m.country)}</span>
                      <span>{getCountryName(m.country)}</span>
                    </span>
                  </td>

                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {m.type}
                    </span>
                  </td>

                  <td className="py-2.5 text-right font-mono text-[11px] font-semibold text-slate-900">
                    {m.volumeFormatted}
                  </td>

                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono text-[11px] text-slate-600">{m.sharePercent}%</span>
                      <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${Math.min(100, m.sharePercent * 2.5)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 text-right font-mono text-[11px] font-bold text-slate-900">
                    {m.successRate}%
                  </td>

                  <td className="py-2.5 text-right pr-2">
                    <Badge
                      status={m.status === 'healthy' ? 'Optimal' : 'Degraded'}
                      showDot
                      size="sm"
                    >
                      {m.status === 'healthy' ? 'Healthy' : 'Degraded'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

