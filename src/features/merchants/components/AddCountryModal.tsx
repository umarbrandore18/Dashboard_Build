import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Merchant, CountryCode } from '@/types';
import { SUPPORTED_COUNTRIES, PAYMENT_METHODS_CATALOG } from '@/data/sampleData';
import { merchantService } from '@/services/merchantService';
import { useToast } from '@/context/ToastContext';
import { Check, Globe2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AddCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: Merchant | null;
  onSuccess: (updatedMerchant: Merchant) => void;
}

export const AddCountryModal: React.FC<AddCountryModalProps> = ({
  isOpen,
  onClose,
  merchant,
  onSuccess,
}) => {
  const toast = useToast();

  const [selectedCountry, setSelectedCountry] = useState<CountryCode | ''>('');
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [settlementCurrency, setSettlementCurrency] = useState('MYR');
  const [settlementFrequency, setSettlementFrequency] = useState<
    'Daily (T+1)' | 'Twice Weekly' | 'Weekly (T+3)' | 'Monthly'
  >('Daily (T+1)');
  const [settlementDestinationRef, setSettlementDestinationRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!merchant) return null;

  // Filter out already operating countries
  const existingCodes = merchant.operatingCountries.map((c) => c.countryCode);
  const availableCountries = SUPPORTED_COUNTRIES.filter(
    (c) => c.isOperating && !existingCodes.includes(c.code)
  );

  const handleCountryChange = (cCode: CountryCode) => {
    setSelectedCountry(cCode);
    const countryObj = SUPPORTED_COUNTRIES.find((c) => c.code === cCode);
    if (countryObj) {
      setSettlementCurrency(countryObj.currency);
      // Pre-select popular methods for this country
      const methodsForCountry = PAYMENT_METHODS_CATALOG.filter((pm) => pm.country === cCode);
      setSelectedMethods(methodsForCountry.slice(0, 2).map((m) => m.name));
    }
  };

  const toggleMethod = (methodName: string) => {
    setSelectedMethods((prev) =>
      prev.includes(methodName) ? prev.filter((m) => m !== methodName) : [...prev, methodName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry) {
      setError('Please select an available market.');
      return;
    }
    if (selectedMethods.length === 0) {
      setError('Please enable at least one payment capability.');
      return;
    }
    if (!settlementDestinationRef.trim()) {
      setError('Please provide a settlement destination reference or account placeholder.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await merchantService.addCountryMarket(merchant.id, {
        countryCode: selectedCountry as CountryCode,
        paymentMethods: selectedMethods,
        settlementCurrency,
        settlementFrequency,
        settlementDestinationRef,
      });

      toast.success(
        'Market Expansion Submitted',
        `Expansion to ${selectedCountry} submitted for compliance review.`
      );
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit market expansion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const eligibleMethods = PAYMENT_METHODS_CATALOG.filter(
    (pm) => pm.country === selectedCountry
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request Market Expansion: ${merchant.name}`}
      description="Configure cross-border settlement and regional payment capabilities under this existing entity."
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-slate-400">
            * Market expansion requires Operations approval
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!selectedCountry || availableCountries.length === 0}
            >
              Submit Expansion for Review
            </Button>
          </div>
        </div>
      }
    >
      {availableCountries.length === 0 ? (
        <div className="py-8 text-center space-y-3">
          <Globe2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-800">All Supported Markets Operating</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {merchant.name} is already provisioned across all currently operating gateways (Malaysia, Indonesia, India).
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Market Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Operating Market <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {availableCountries.map((c) => {
                const isSelected = selectedCountry === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountryChange(c.code)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{c.flag}</span>
                      <span className="font-bold text-slate-900">{c.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">{c.currency} settlement</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Capabilities for Market */}
          {selectedCountry && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Eligible Payment Capabilities <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50 max-h-48 overflow-y-auto">
                {eligibleMethods.map((pm) => {
                  const isChecked = selectedMethods.includes(pm.name);
                  return (
                    <label
                      key={pm.id}
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMethod(pm.name)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 text-xs">{pm.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 font-medium">
                            {pm.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {pm.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Settlement Configuration */}
          {selectedCountry && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <Select
                label="Settlement Currency"
                value={settlementCurrency}
                onChange={(e) => setSettlementCurrency(e.target.value)}
                options={[
                  { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
                  { value: 'IDR', label: 'IDR - Indonesian Rupiah' },
                  { value: 'INR', label: 'INR - Indian Rupee' },
                  { value: 'USD', label: 'USD - US Dollar' },
                ]}
              />

              <Select
                label="Settlement Frequency"
                value={settlementFrequency}
                onChange={(e) =>
                  setSettlementFrequency(
                    e.target.value as 'Daily (T+1)' | 'Twice Weekly' | 'Weekly (T+3)' | 'Monthly'
                  )
                }
                options={[
                  { value: 'Daily (T+1)', label: 'Daily (T+1 Next Business Day)' },
                  { value: 'Twice Weekly', label: 'Twice Weekly (Tue / Fri)' },
                  { value: 'Weekly (T+3)', label: 'Weekly (T+3 Friday)' },
                  { value: 'Monthly', label: 'Monthly (Last Business Day)' },
                ]}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Settlement Bank Reference"
                  required
                  placeholder="e.g. Bank Central Asia ending in •••• 9201"
                  value={settlementDestinationRef}
                  onChange={(e) => setSettlementDestinationRef(e.target.value)}
                  helperText="Use safe placeholder references only. Do not input unmasked live bank account credentials."
                />
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Review Principle:</strong> In accordance with payment security policies, adding a country transitions that market into <em>Under Review</em> status until cross-border compliance verifies the business registration in the destination jurisdiction.
            </span>
          </div>
        </form>
      )}
    </Modal>
  );
};

