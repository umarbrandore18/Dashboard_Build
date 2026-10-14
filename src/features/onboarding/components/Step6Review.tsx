import React from 'react';
import { OnboardingFormData, CountryCode } from '@/types';
import { getCountryFlag, getCountryName } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Edit2, CheckCircle2, Building2, User, Globe2, CreditCard, Landmark } from 'lucide-react';

interface Step6Props {
  data: OnboardingFormData;
  onGoToStep: (step: number) => void;
}

export const Step6Review: React.FC<Step6Props> = ({ data, onGoToStep }) => {
  const selectedCountries = data.selectedCountries || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Application Review & Dossier Verification</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Carefully verify all merchant parameters prior to formal onboarding submission. Click "Edit" on any section to revise data.
        </p>
      </div>

      {/* Section 1: Business Information */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-subtle space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Business Information
            </h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGoToStep(1)}
            leftIcon={<Edit2 className="w-3 h-3 text-blue-600" />}
            className="text-xs text-blue-600 hover:text-blue-800 h-7 px-2"
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Legal Name:</span>
            <p className="font-semibold text-slate-900">{data.legalBusinessName || '-'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Trading Name:</span>
            <p className="font-semibold text-slate-900">{data.tradingName || 'Same as Legal'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Registration Number:</span>
            <p className="font-mono font-semibold text-slate-900">{data.registrationNumber || '-'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Incorporation Country:</span>
            <p className="font-semibold text-slate-900">
              {data.registeredCountry ? `${getCountryFlag(data.registeredCountry)} ${getCountryName(data.registeredCountry)}` : '-'}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Entity Type:</span>
            <p className="font-semibold text-slate-900">{data.businessType || '-'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Website:</span>
            <p className="font-semibold text-slate-900 truncate">{data.website || 'None'}</p>
          </div>
          <div className="sm:col-span-3">
            <span className="text-slate-400 font-medium">Registered Address:</span>
            <p className="text-slate-700">{data.businessAddress || '-'}</p>
          </div>
        </div>
      </div>

      {/* Section 2: Primary Contact */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-subtle space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Primary Contact
            </h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGoToStep(2)}
            leftIcon={<Edit2 className="w-3 h-3 text-blue-600" />}
            className="text-xs text-blue-600 hover:text-blue-800 h-7 px-2"
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Representative Name:</span>
            <p className="font-semibold text-slate-900">{data.contactName || '-'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Job Title:</span>
            <p className="font-semibold text-slate-900">{data.jobTitle || '-'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Work Email:</span>
            <p className="font-semibold text-blue-600 truncate">{data.workEmail || '-'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Direct Phone:</span>
            <p className="font-mono font-semibold text-slate-900">{data.phone || '-'}</p>
          </div>
        </div>
      </div>

      {/* Section 3: Operating Markets & Payment Rails */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-subtle space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3 & 4. Operating Markets & Payment Capabilities
            </h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGoToStep(3)}
            leftIcon={<Edit2 className="w-3 h-3 text-blue-600" />}
            className="text-xs text-blue-600 hover:text-blue-800 h-7 px-2"
          >
            Edit
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          {selectedCountries.map((cCode) => {
            const methods = data.selectedPaymentMethods[cCode] || [];
            return (
              <div key={cCode} className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{getCountryFlag(cCode)}</span>
                    <span>{getCountryName(cCode)} Corridor</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {methods.length} rails active
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {methods.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-white border border-slate-200 text-slate-700"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5: Settlement Preferences */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-subtle space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              5. Settlement Preferences
            </h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGoToStep(5)}
            leftIcon={<Edit2 className="w-3 h-3 text-blue-600" />}
            className="text-xs text-blue-600 hover:text-blue-800 h-7 px-2"
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {selectedCountries.map((cCode) => {
            const settlement = data.settlements[cCode];
            return (
              <div key={cCode} className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <span>{getCountryFlag(cCode)}</span>
                  <span>{getCountryName(cCode)}</span>
                </p>
                <p className="text-slate-600 text-[11px]">
                  <strong>Routing:</strong> {settlement?.settlementDestinationRef || 'Pending assignment'}
                </p>
                <p className="text-slate-500 text-[10px] mt-1 font-mono">
                  {settlement?.settlementCurrency} • {settlement?.settlementFrequency}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

