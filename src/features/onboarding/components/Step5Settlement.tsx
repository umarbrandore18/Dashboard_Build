import React from 'react';
import { OnboardingFormData, CountryCode } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SUPPORTED_COUNTRIES } from '@/data/sampleData';
import { getCountryFlag, getCountryName } from '@/utils/formatters';
import { ShieldAlert, Landmark, Lock, CheckCircle2 } from 'lucide-react';

interface Step5Props {
  data: OnboardingFormData;
  onChange: (updates: Partial<OnboardingFormData>) => void;
  errors: Record<string, string>;
}

export const Step5Settlement: React.FC<Step5Props> = ({ data, onChange, errors }) => {
  const selectedCountries = data.selectedCountries || [];

  const updateSettlementForCountry = (
    countryCode: CountryCode,
    field: string,
    value: any
  ) => {
    const currentForCountry = data.settlements[countryCode] || {
      settlementCurrency: countryCode === 'MY' ? 'MYR' : countryCode === 'ID' ? 'IDR' : 'INR',
      settlementFrequency: 'Daily (T+1)',
      settlementDestinationRef: '',
      authorisedDeclaration: false,
    };

    onChange({
      settlements: {
        ...data.settlements,
        [countryCode]: {
          ...currentForCountry,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Settlement & Clearing Preferences</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure payout destination references and clearing intervals for each active market.
        </p>
      </div>

      {/* Security Disclaimer Banner */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-3">
        <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-xs">Security & Banking Compliance Protocol</p>
          <p className="mt-0.5 text-[11px] text-blue-800 leading-relaxed">
            Never submit unmasked IBANs, raw bank account passwords, or live credentials. Provide verified bank name, clearing branch, and masked account identifiers (e.g., <em>"Maybank Islamic ending in •••• 4821"</em>).
          </p>
        </div>
      </div>

      {/* Per-Market Settlement Forms */}
      <div className="space-y-5">
        {selectedCountries.map((countryCode) => {
          const settlement = data.settlements[countryCode] || {
            settlementCurrency: countryCode === 'MY' ? 'MYR' : countryCode === 'ID' ? 'IDR' : 'INR',
            settlementFrequency: 'Daily (T+1)',
            settlementDestinationRef: '',
            authorisedDeclaration: false,
          };

          const countryInfo = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode);
          const errorForCountry = errors[`settlement_${countryCode}`];

          return (
            <div
              key={countryCode}
              className="p-5 rounded-xl border border-slate-200 bg-white shadow-subtle space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getCountryFlag(countryCode)}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {getCountryName(countryCode)} Settlement Protocol
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Native Market: {countryCode} ({countryInfo?.currency})
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Market #{countryCode}
                </span>
              </div>

              {errorForCountry && (
                <p className="text-xs text-rose-600 font-semibold">{errorForCountry}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Settlement Currency"
                  value={settlement.settlementCurrency}
                  onChange={(e) =>
                    updateSettlementForCountry(countryCode, 'settlementCurrency', e.target.value)
                  }
                  options={[
                    { value: countryInfo?.currency || 'MYR', label: `${countryInfo?.currency} (Local Native)` },
                    { value: 'USD', label: 'USD (Cross-border clearing)' },
                  ]}
                />

                <Select
                  label="Settlement Frequency"
                  value={settlement.settlementFrequency}
                  onChange={(e) =>
                    updateSettlementForCountry(countryCode, 'settlementFrequency', e.target.value)
                  }
                  options={[
                    { value: 'Daily (T+1)', label: 'Daily (T+1 Next Business Day)' },
                    { value: 'Twice Weekly', label: 'Twice Weekly (Tuesday & Friday)' },
                    { value: 'Weekly (T+3)', label: 'Weekly (T+3 Friday Clearing)' },
                    { value: 'Monthly', label: 'Monthly (Last Calendar Day)' },
                  ]}
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Bank Destination Reference (Safe Masked)"
                    required
                    placeholder={
                      countryCode === 'MY'
                        ? 'e.g. Maybank Islamic ending in •••• 4821'
                        : countryCode === 'ID'
                        ? 'e.g. Bank Central Asia ending in •••• 9102'
                        : 'e.g. HDFC Bank Mumbai ending in •••• 7741'
                    }
                    value={settlement.settlementDestinationRef}
                    onChange={(e) =>
                      updateSettlementForCountry(
                        countryCode,
                        'settlementDestinationRef',
                        e.target.value
                      )
                    }
                    helperText="Specify the institutional bank name and masked account number for automated ledger reconciliation."
                  />
                </div>
              </div>

              {/* Authorisation declaration checkbox */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settlement.authorisedDeclaration}
                    onChange={(e) =>
                      updateSettlementForCountry(
                        countryCode,
                        'authorisedDeclaration',
                        e.target.checked
                      )
                    }
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                  <span>
                    I confirm that this settlement reference is an authorized corporate bank account belonging to the legal entity, subject to Mobi Treasury verification before first live payout disbursement.
                  </span>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

