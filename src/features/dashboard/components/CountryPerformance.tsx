import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CountryPerformanceItem, CountryCode } from '@/types';
import { Globe, ArrowRight, TrendingUp, Users } from 'lucide-react';
import { useFilters } from '@/context/FilterContext';

interface CountryPerformanceProps {
  countries: CountryPerformanceItem[];
}

export const CountryPerformance: React.FC<CountryPerformanceProps> = ({ countries }) => {
  const navigate = useNavigate();
  const { setCountry, filters } = useFilters();

  return (
    <Card className="hoverable">
      <CardHeader className="flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Regional Market Performance</CardTitle>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
              3 Active Markets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational volume, local settlement currencies, and cross-border corridors
          </p>
        </div>

        {filters.country !== 'ALL' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCountry('ALL')}
            className="text-xs text-blue-600"
          >
            Clear Country Filter
          </Button>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {countries.map((c) => {
            const isSelected = filters.country === c.code;

            return (
              <div
                key={c.code}
                className={`p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500 shadow-sm'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Header: Flag, Name, Growth */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl leading-none" role="img" aria-label={c.name}>
                        {c.flag}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {c.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold font-mono">
                          {c.currency} Corridor
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      +{c.growthPercent}%
                    </span>
                  </div>

                  {/* Metrics grid */}
                  <div className="space-y-2 py-2 border-y border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Pay-in Volume:</span>
                      <span className="font-semibold text-slate-900 font-mono text-[11px]">
                        {c.payinFormatted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Payout Volume:</span>
                      <span className="font-semibold text-slate-900 font-mono text-[11px]">
                        {c.payoutFormatted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Net Revenue:</span>
                      <span className="font-semibold text-emerald-700 font-mono text-[11px]">
                        {c.revenueFormatted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Success Rate:</span>
                      <span className="font-semibold text-slate-900 font-mono text-[11px]">
                        {c.successRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Active Merchants:</span>
                      <span className="font-medium text-slate-700 text-[11px] flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        {c.merchantsCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Filter Dashboard / View Merchants */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-1">
                  <Button
                    variant={isSelected ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full text-[11px]"
                    onClick={() => setCountry(isSelected ? 'ALL' : c.code)}
                  >
                    {isSelected ? 'Filtered' : 'Filter View'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[11px] text-blue-600 hover:text-blue-700"
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                    onClick={() => navigate(`/merchants?country=${c.code}`)}
                  >
                    Merchants
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

