import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Merchant } from '@/types';
import { merchantService } from '@/services/merchantService';
import { useToast } from '@/context/ToastContext';

interface EditMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: Merchant | null;
  onSuccess: (updated: Merchant) => void;
}

export const EditMerchantModal: React.FC<EditMerchantModalProps> = ({
  isOpen,
  onClose,
  merchant,
  onSuccess,
}) => {
  const toast = useToast();

  const [tradingName, setTradingName] = useState('');
  const [website, setWebsite] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (merchant) {
      setTradingName(merchant.tradingName || '');
      setWebsite(merchant.website || '');
      setBusinessAddress(merchant.businessAddress || '');
      setBusinessDescription(merchant.businessDescription || '');
      setContactName(merchant.primaryContact.name || '');
      setWorkEmail(merchant.primaryContact.email || '');
      setPhone(merchant.primaryContact.phone || '');
      setJobTitle(merchant.primaryContact.jobTitle || '');
    }
  }, [merchant]);

  if (!merchant) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await merchantService.updateMerchantDetails(merchant.id, {
        tradingName: tradingName.trim() || undefined,
        website: website.trim() || undefined,
        businessAddress: businessAddress.trim(),
        businessDescription: businessDescription.trim() || undefined,
        primaryContact: {
          name: contactName.trim(),
          email: workEmail.trim(),
          phone: phone.trim(),
          jobTitle: jobTitle.trim(),
        },
      });

      toast.success('Merchant Details Updated', 'Profile modifications persisted successfully.');
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update merchant details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Merchant: ${merchant.name}`}
      description="Update commercial parameters and primary point-of-contact information."
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Trading / Brand Name"
            value={tradingName}
            onChange={(e) => setTradingName(e.target.value)}
            placeholder="e.g. Acme Commerce"
          />

          <Input
            label="Company Website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://acmetrading.com"
          />

          <div className="sm:col-span-2">
            <Input
              label="Registered Business Address"
              required
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business Description
            </label>
            <textarea
              rows={2}
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <h4 className="text-xs font-bold text-slate-800 mb-2">Primary Operations Contact</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Contact Full Name"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />

            <Input
              label="Work Email Address"
              type="email"
              required
              value={workEmail}
              onChange={(e) => setWorkEmail(e.target.value)}
            />

            <Input
              label="Direct Phone Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              label="Job Title / Role"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

