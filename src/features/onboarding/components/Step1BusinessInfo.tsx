import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { OnboardingFormData, CountryCode } from '@/types';
import { merchantService } from '@/services/merchantService';
import { AlertCircle, Building2, ShieldAlert } from 'lucide-react';

interface Step1Props {
  data: OnboardingFormData;
  onChange: (updates: Partial<OnboardingFormData>) => void;
  errors: Record<string, string>;
}

export const Step1BusinessInfo: React.FC<Step1Props> = ({ data, onChange, errors }) => {
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Debounced duplicate check
  useEffect(() => {
    const checkDuplicate = async () => {
      if (!data.registrationNumber.trim() || data.registrationNumber.trim().length < 5) {
        setDuplicateWarning(null);
        return;
      }
      try {
        const exists = await merchantService.checkRegistrationExists(data.registrationNumber);
        if (exists) {
          setDuplicateWarning(
            `Registration number "${data.registrationNumber}" is already registered in the system. Duplicate applications cannot be processed.`
          );
        } else {
          setDuplicateWarning(null);
        }
      } catch (e) {
        console.error('Failed to verify registration number uniqueness:', e);
      }
    };

    const timer = setTimeout(checkDuplicate, 400);
    return () => clearTimeout(timer);
  }, [data.registrationNumber]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900">Legal Business Profile</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide officially registered entity information as documented in government registrar filings.
        </p>
      </div>

      {duplicateWarning && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Duplicate Registration Detected</p>
            <p className="mt-0.5 leading-relaxed">{duplicateWarning}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Legal Business Name */}
        <div className="sm:col-span-2">
          <Input
            label="Legal Business Name"
            required
            placeholder="e.g. Acme Trading Sdn Bhd / PT Meridian Commerce"
            value={data.legalBusinessName}
            onChange={(e) => onChange({ legalBusinessName: e.target.value })}
            error={errors.legalBusinessName}
            helperText="Exact name as printed on certificate of incorporation."
          />
        </div>

        {/* Trading Name */}
        <div>
          <Input
            label="Trading / Brand Name (Optional)"
            placeholder="e.g. Acme Commerce"
            value={data.tradingName}
            onChange={(e) => onChange({ tradingName: e.target.value })}
            helperText="Brand or consumer-facing storefront identifier."
          />
        </div>

        {/* Registration Number */}
        <div>
          <Input
            label="Business Registration Number"
            required
            placeholder="e.g. 202101034928 (1432920-K) or 02.849.201.4-012.000"
            value={data.registrationNumber}
            onChange={(e) => onChange({ registrationNumber: e.target.value })}
            error={errors.registrationNumber || (duplicateWarning ? duplicateWarning : undefined)}
          />
        </div>

        {/* Registered Country */}
        <div>
          <Select
            label="Registered Incorporation Country"
            required
            value={data.registeredCountry}
            onChange={(e) => onChange({ registeredCountry: e.target.value as CountryCode })}
            error={errors.registeredCountry}
          >
            <option value="">Select country of incorporation</option>
            <option value="MY">🇲🇾 Malaysia</option>
            <option value="ID">🇮🇩 Indonesia</option>
            <option value="IN">🇮🇳 India</option>
          </Select>
        </div>

        {/* Business Type */}
        <div>
          <Select
            label="Business Entity Type"
            required
            value={data.businessType}
            onChange={(e) => onChange({ businessType: e.target.value })}
            error={errors.businessType}
          >
            <option value="">Select entity structure</option>
            <option value="Private Limited (Sdn Bhd / PT / Pvt Ltd)">
              Private Limited (Sdn Bhd / PT / Pvt Ltd)
            </option>
            <option value="Public Limited Company">Public Limited Company</option>
            <option value="Partnership / LLP">Partnership / LLP</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
          </Select>
        </div>

        {/* Website */}
        <div className="sm:col-span-2">
          <Input
            label="Company Website / URL (Optional)"
            type="url"
            placeholder="https://example.com"
            value={data.website}
            onChange={(e) => onChange({ website: e.target.value })}
            error={errors.website}
            helperText="Include protocol prefix https://"
          />
        </div>

        {/* Business Address */}
        <div className="sm:col-span-2">
          <Input
            label="Registered Business Address"
            required
            placeholder="Street address, building, city, postal code"
            value={data.businessAddress}
            onChange={(e) => onChange({ businessAddress: e.target.value })}
            error={errors.businessAddress}
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nature of Business & Primary Activities (Optional)
          </label>
          <textarea
            rows={2}
            value={data.businessDescription}
            onChange={(e) => onChange({ businessDescription: e.target.value })}
            placeholder="Brief overview of goods or digital services offered..."
            className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

