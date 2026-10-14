import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OnboardingFormData, Merchant, OnboardingDraft } from '@/types';
import { merchantService } from '@/services/merchantService';
import { StepIndicator } from './components/StepIndicator';
import { Step1BusinessInfo } from './components/Step1BusinessInfo';
import { Step2PrimaryContact } from './components/Step2PrimaryContact';
import { Step3Countries } from './components/Step3Countries';
import { Step4PaymentCapabilities } from './components/Step4PaymentCapabilities';
import { Step5Settlement } from './components/Step5Settlement';
import { Step6Review } from './components/Step6Review';
import { Step7SubmitSuccess } from './components/Step7SubmitSuccess';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  FileCheck2,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

const INITIAL_FORM_DATA: OnboardingFormData = {
  legalBusinessName: '',
  tradingName: '',
  registrationNumber: '',
  businessType: 'Private Limited (Sdn Bhd / PT / Pvt Ltd)',
  website: '',
  registeredCountry: 'MY',
  businessAddress: '',
  businessDescription: '',
  contactName: '',
  workEmail: '',
  phone: '',
  jobTitle: '',
  selectedCountries: ['MY'],
  selectedPaymentMethods: {
    MY: ['FPX (Online Banking)', 'DuitNow QR'],
  },
  settlements: {
    MY: {
      settlementCurrency: 'MYR',
      settlementFrequency: 'Daily (T+1)',
      settlementDestinationRef: '',
      authorisedDeclaration: true,
    },
  },
};

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeDraftId, setActiveDraftId] = useState<string | undefined>(undefined);
  const [pendingDraft, setPendingDraft] = useState<OnboardingDraft | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMerchant, setSubmittedMerchant] = useState<Merchant | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Check for saved draft on mount
  useEffect(() => {
    const draftIdFromUrl = searchParams.get('draft');
    const draft = merchantService.getDraft(draftIdFromUrl || undefined);
    if (draft && (!draftIdFromUrl || draft.draftId === draftIdFromUrl)) {
      setPendingDraft(draft);
    }
  }, [searchParams]);

  const handleResumeDraft = (draft: OnboardingDraft) => {
    setFormData(draft.formData);
    setCurrentStep(draft.currentStep || 1);
    setActiveDraftId(draft.draftId);
    setPendingDraft(null);
    toast.info('Draft Resumed', `Continuing onboarding for ${draft.merchantName || 'saved draft'}.`);
  };

  const handleDiscardDraft = (draftId: string) => {
    merchantService.deleteDraft(draftId);
    setPendingDraft(null);
    toast.info('Draft Discarded', 'Starting new merchant onboarding journey.');
  };

  const handleDataChange = (updates: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear field-specific error when modified
    const updatedKeys = Object.keys(updates);
    if (updatedKeys.length > 0) {
      setErrors((prev) => {
        const copy = { ...prev };
        updatedKeys.forEach((k) => delete copy[k]);
        return copy;
      });
    }
  };

  // Validate step requirements before continuing
  const validateCurrentStep = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.legalBusinessName.trim()) {
        newErrors.legalBusinessName = 'Legal business name is required.';
      }
      if (!formData.registrationNumber.trim()) {
        newErrors.registrationNumber = 'Registration number is required.';
      } else {
        const isDuplicate = await merchantService.checkRegistrationExists(formData.registrationNumber);
        if (isDuplicate) {
          newErrors.registrationNumber = `Registration number ${formData.registrationNumber} already exists in records.`;
        }
      }
      if (!formData.registeredCountry) {
        newErrors.registeredCountry = 'Registered incorporation country is required.';
      }
      if (!formData.businessType) {
        newErrors.businessType = 'Business entity type is required.';
      }
      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = 'Business address is required.';
      }
      if (formData.website.trim() && !/^https?:\/\//i.test(formData.website.trim())) {
        newErrors.website = 'Website must start with http:// or https://';
      }
    } else if (currentStep === 2) {
      if (!formData.contactName.trim()) {
        newErrors.contactName = 'Representative contact name is required.';
      }
      if (!formData.jobTitle.trim()) {
        newErrors.jobTitle = 'Job title is required.';
      }
      if (!formData.workEmail.trim()) {
        newErrors.workEmail = 'Work email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail.trim())) {
        newErrors.workEmail = 'Please provide a valid email address.';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Contact phone number is required.';
      }
    } else if (currentStep === 3) {
      if (!formData.selectedCountries || formData.selectedCountries.length === 0) {
        newErrors.selectedCountries = 'Please select at least one target operating market.';
      }
    } else if (currentStep === 4) {
      const missingMethods = (formData.selectedCountries || []).some(
        (c) => !formData.selectedPaymentMethods[c] || formData.selectedPaymentMethods[c]!.length === 0
      );
      if (missingMethods) {
        newErrors.paymentMethods = 'Please select at least one active payment rail for each selected country.';
      }
    } else if (currentStep === 5) {
      (formData.selectedCountries || []).forEach((c) => {
        const s = formData.settlements[c];
        if (!s || !s.settlementDestinationRef.trim()) {
          newErrors[`settlement_${c}`] = `Destination reference required for ${c} market.`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      if (currentStep < 6) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (currentStep === 6) {
        // Step 6 review -> Proceed to submission
        handleSubmitForReview();
      }
    } else {
      toast.error('Validation Incomplete', 'Please correct the highlighted fields before proceeding.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraft = () => {
    const saved = merchantService.saveDraft(formData, currentStep, activeDraftId);
    setActiveDraftId(saved.draftId);
    toast.success('Draft Saved', `Onboarding draft preserved. You can resume anytime from Step ${currentStep}.`);
  };

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
    try {
      const created = await merchantService.submitOnboarding(formData, activeDraftId);
      setSubmittedMerchant(created);
      setCurrentStep(7);
      toast.success(
        'Merchant Submitted for Review',
        `Assigned ID ${created.id}. Status set to Under Review.`
      );
    } catch (err: any) {
      toast.error('Submission Failed', err?.message || 'Failed to submit onboarding application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedMerchant && currentStep === 7) {
    return <Step7SubmitSuccess merchant={submittedMerchant} />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Pending Draft Resume Banner */}
      {pendingDraft && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <FileCheck2 className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-900">
                Saved Onboarding Draft Available
              </p>
              <p className="text-[11px] text-blue-700">
                "{pendingDraft.merchantName || 'Untitled Draft'}" (Step {pendingDraft.currentStep} of 7)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDiscardDraft(pendingDraft.draftId)}
              className="text-xs text-slate-600 h-7"
            >
              Discard
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleResumeDraft(pendingDraft)}
              className="text-xs h-7"
            >
              Resume Draft
            </Button>
          </div>
        </div>
      )}

      {/* Top Header & Navigation Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Merchant Onboarding
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Step {currentStep} of 7
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Guided 7-step journey for business verification, market access, and payment setup
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCancelModalOpen(true)}
            leftIcon={<X className="w-4 h-4 text-slate-400" />}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            Cancel
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            leftIcon={<Save className="w-3.5 h-3.5 text-slate-500" />}
            className="text-xs"
          >
            Save Draft
          </Button>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        totalSteps={7}
        onStepClick={(s) => {
          if (s < currentStep) setCurrentStep(s);
        }}
      />

      {/* Active Step Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-subtle">
        {currentStep === 1 && (
          <Step1BusinessInfo
            data={formData}
            onChange={handleDataChange}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <Step2PrimaryContact
            data={formData}
            onChange={handleDataChange}
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <Step3Countries
            data={formData}
            onChange={handleDataChange}
            errors={errors}
          />
        )}

        {currentStep === 4 && (
          <Step4PaymentCapabilities
            data={formData}
            onChange={handleDataChange}
            errors={errors}
          />
        )}

        {currentStep === 5 && (
          <Step5Settlement
            data={formData}
            onChange={handleDataChange}
            errors={errors}
          />
        )}

        {currentStep === 6 && (
          <Step6Review
            data={formData}
            onGoToStep={(stepNumber) => setCurrentStep(stepNumber)}
          />
        )}

        {/* Step Navigation Controls Footer */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleBack}
            disabled={currentStep === 1}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="text-xs"
          >
            Back
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handleSaveDraft}
              leftIcon={<Save className="w-3.5 h-3.5 text-slate-400" />}
              className="text-xs hidden sm:inline-flex"
            >
              Save Draft
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              isLoading={isSubmitting}
              rightIcon={currentStep === 6 ? undefined : <ArrowRight className="w-4 h-4" />}
              className="text-xs"
            >
              {currentStep === 6 ? 'Submit for Review' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Discard or Save Changes?"
        description="You have an active onboarding application in progress. Do you wish to save a draft before leaving?"
        size="sm"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => {
                setCancelModalOpen(false);
                navigate('/merchants');
              }}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Exit Without Saving
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelModalOpen(false)}
              >
                Keep Editing
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleSaveDraft();
                  setCancelModalOpen(false);
                  navigate('/merchants');
                }}
              >
                Save & Exit
              </Button>
            </div>
          </div>
        }
      >
        <div className="text-xs text-slate-600 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p>
            Leaving without saving will lose any uncommitted entries for this session. Saved drafts can be reopened at any time from Merchant Management.
          </p>
        </div>
      </Modal>
    </div>
  );
};

