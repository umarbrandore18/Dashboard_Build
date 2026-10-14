import React from 'react';
import { OnboardingFormData, CountryCode } from '@/types';
import { SUPPORTED_COUNTRIES } from '@/data/sampleData';
import { Check, Globe2, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface Step3Props {
  data: OnboardingFormData;
  onChange: (updates: Partial<OnboardingFormData>) => void;
  errors: Record<string, string>;
}

export const Step3Countries: React.FC<Step3Props> = ({ data, onChange, errors }) => {
  const activeCountries = SUPPORTED_COUNTRIES.filter((c) => c.isOperating);
  const plannedCountries = SUPPORTED_COUNTRIES.filter((c) => !c.isOperating);

  const toggleCountry = (code: CountryCode) => {
    const current = data.selectedCountries || [];
    let updated: CountryCode[];

    if (current.includes(code)) {
      updated = current.filter((c) => c !== code);
    } else {
      updated = [...current, code];
    }

    onChange({ selectedCountries: updated });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900">Target Operating Markets</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Select one or more regional jurisdictions where the merchant intends to accept payments or disburse payouts.
        </p>
      </div>

      {errors.selectedCountries && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errors.selectedCountries}</span>
        </div>
      )}

      {/* Active Operating Markets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Available Operating Corridors ({activeCountries.length})
          </span>
          <span className="text-[11px] text-slate-400">
            Payment rails automatically provisioned per market
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {activeCountries.map((country) => {
            const isSelected = (data.selectedCountries || []).includes(country.code);

            return (
              <div
                key={country.code}
                onClick={() => toggleCountry(country.code)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xl" role="img" aria-label={country.name}>
                      {country.flag}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{country.name}</h4>
                  <p className="text-[11px] font-semibold text-blue-700 mt-0.5 font-mono">
                    Currency: {country.currency} ({country.currencySymbol})
                  </p>

                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {country.notes}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>Routing: Local Gateway</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                    Live Rail
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Planned Expansion Markets (Extensible Architecture) */}
      <div className="pt-2 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">
            Upcoming Expansion Markets (Roadmap)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 opacity-60">
          {plannedCountries.map((country) => (
            <div
              key={country.code}
              className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 select-none cursor-not-allowed"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <span className="font-semibold text-xs text-slate-700">{country.name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-600 rounded font-semibold font-mono">
                  {country.currency}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{country.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

