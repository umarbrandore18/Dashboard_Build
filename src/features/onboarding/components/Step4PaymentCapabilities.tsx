import React from 'react';
import { OnboardingFormData, CountryCode } from '@/types';
import { PAYMENT_METHODS_CATALOG, SUPPORTED_COUNTRIES } from '@/data/sampleData';
import { getCountryFlag, getCountryName } from '@/utils/formatters';
import { Check, AlertCircle, Inbox, CreditCard, Building, Smartphone, ArrowUpRight } from 'lucide-react';

interface Step4Props {
  data: OnboardingFormData;
  onChange: (updates: Partial<OnboardingFormData>) => void;
  errors: Record<string, string>;
}

export const Step4PaymentCapabilities: React.FC<Step4Props> = ({
  data,
  onChange,
  errors,
}) => {
  const selectedCountries = data.selectedCountries || [];

  const handleToggleMethod = (countryCode: CountryCode, methodName: string) => {
    const currentForCountry = data.selectedPaymentMethods[countryCode] || [];
    let updatedForCountry: string[];

    if (currentForCountry.includes(methodName)) {
      updatedForCountry = currentForCountry.filter((m) => m !== methodName);
    } else {
      updatedForCountry = [...currentForCountry, methodName];
    }

    onChange({
      selectedPaymentMethods: {
        ...data.selectedPaymentMethods,
        [countryCode]: updatedForCountry,
      },
    });
  };

  const handleSelectAllForCountry = (countryCode: CountryCode) => {
    const allForCountry = PAYMENT_METHODS_CATALOG.filter((pm) => pm.country === countryCode).map(
      (pm) => pm.name
    );
    onChange({
      selectedPaymentMethods: {
        ...data.selectedPaymentMethods,
        [countryCode]: allForCountry,
      },
    });
  };

  if (selectedCountries.length === 0) {
    return (
      <div className="py-8 text-center bg-slate-50 border border-slate-200 rounded-xl p-6">
        <Inbox className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-800">No Operating Countries Selected</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Please return to Step 3 and select at least one regional market before provisioning payment rails.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Payment Capabilities & Rails</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Select eligible payment instruments per authorized market. Unsupported cross-border rail combinations are automatically restricted.
        </p>
      </div>

      {errors.paymentMethods && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errors.paymentMethods}</span>
        </div>
      )}

      {selectedCountries.map((countryCode) => {
        const countryMethods = PAYMENT_METHODS_CATALOG.filter((pm) => pm.country === countryCode);
        const selectedForCountry = data.selectedPaymentMethods[countryCode] || [];
        const isAllSelected =
          countryMethods.length > 0 && selectedForCountry.length === countryMethods.length;

        return (
          <div
            key={countryCode}
            className="p-4 rounded-xl border border-slate-200 bg-white shadow-subtle space-y-3"
          >
            {/* Country Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getCountryFlag(countryCode)}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {getCountryName(countryCode)}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {countryCode === 'MY'
                      ? 'Online banking, national QR and consumer mobile wallets'
                      : countryCode === 'ID'
                      ? 'Tier-1 Virtual Accounts and top national consumer wallets'
                      : 'Real-time commercial payout routing rails'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectAllForCountry(countryCode)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                {isAllSelected ? 'All Selected' : 'Select All Rails'}
              </button>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {countryMethods.map((pm) => {
                const isChecked = selectedForCountry.includes(pm.name);

                return (
                  <div
                    key={pm.id}
                    onClick={() => handleToggleMethod(countryCode, pm.name)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isChecked
                        ? 'border-blue-600 bg-blue-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">{pm.name}</span>
                        {pm.badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {pm.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {pm.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

