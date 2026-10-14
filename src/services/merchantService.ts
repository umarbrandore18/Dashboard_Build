import {
  Merchant,
  OnboardingDraft,
  OnboardingFormData,
  CountryCode,
  ActivityEvent,
  CountryMarketConfig,
} from '@/types';
import { INITIAL_MERCHANTS, PAYMENT_METHODS_CATALOG } from '@/data/sampleData';
import { storage } from '@/utils/storage';

const STORAGE_KEYS = {
  MERCHANTS: 'mobi_merchants_v1',
  DRAFTS: 'mobi_onboarding_drafts_v1',
};

// Initialize default data if not present
function getStoredMerchants(): Merchant[] {
  const existing = storage.get<Merchant[] | null>(STORAGE_KEYS.MERCHANTS, null);
  if (existing && Array.isArray(existing) && existing.length > 0) {
    return existing;
  }
  // Initialize with sample merchants
  storage.set(STORAGE_KEYS.MERCHANTS, INITIAL_MERCHANTS);
  return INITIAL_MERCHANTS;
}

function getStoredDrafts(): OnboardingDraft[] {
  return storage.get<OnboardingDraft[]>(STORAGE_KEYS.DRAFTS, []);
}

export const merchantService = {
  /**
   * Fetch all merchants with optional filtering
   */
  async getMerchants(filter?: {
    search?: string;
    country?: string;
    status?: string;
    onboardingStatus?: string;
  }): Promise<Merchant[]> {
    let list = getStoredMerchants();

    if (!filter) return list;

    if (filter.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          (m.tradingName && m.tradingName.toLowerCase().includes(q)) ||
          m.registrationNumber.toLowerCase().includes(q)
      );
    }

    if (filter.country && filter.country !== 'ALL') {
      list = list.filter(
        (m) =>
          m.registeredCountry === filter.country ||
          m.operatingCountries.some((c) => c.countryCode === filter.country)
      );
    }

    if (filter.status && filter.status !== 'ALL') {
      list = list.filter((m) => m.status === filter.status);
    }

    if (filter.onboardingStatus && filter.onboardingStatus !== 'ALL') {
      list = list.filter((m) => m.onboardingStatus === filter.onboardingStatus);
    }

    return list;
  },

  /**
   * Get single merchant by ID
   */
  async getMerchantById(id: string): Promise<Merchant | null> {
    const list = getStoredMerchants();
    return list.find((m) => m.id.toLowerCase() === id.toLowerCase()) || null;
  },

  /**
   * Check if a registration number already exists (excluding a specific merchant ID if updating)
   */
  async checkRegistrationExists(regNumber: string, excludeMerchantId?: string): Promise<boolean> {
    const list = getStoredMerchants();
    const clean = regNumber.trim().toLowerCase().replace(/[\s-()]/g, '');
    return list.some((m) => {
      if (excludeMerchantId && m.id === excludeMerchantId) return false;
      const existingClean = m.registrationNumber.trim().toLowerCase().replace(/[\s-()]/g, '');
      return existingClean === clean;
    });
  },

  /**
   * Submit new onboarding data as an Under Review merchant
   */
  async submitOnboarding(formData: OnboardingFormData, draftIdToClean?: string): Promise<Merchant> {
    const list = getStoredMerchants();

    // Check duplicate registration
    const isDuplicate = await this.checkRegistrationExists(formData.registrationNumber);
    if (isDuplicate) {
      throw new Error(`A merchant with registration number "${formData.registrationNumber}" already exists.`);
    }

    // Generate Merchant ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newId = `MER-${randomSuffix}`;
    const nowIso = new Date().toISOString();

    // Assemble operating countries
    const operatingCountries: CountryMarketConfig[] = (formData.selectedCountries || []).map((cCode) => {
      const methods = formData.selectedPaymentMethods[cCode] || [];
      const settlement = formData.settlements[cCode];

      return {
        countryCode: cCode,
        currencies: [settlement?.settlementCurrency || (cCode === 'MY' ? 'MYR' : cCode === 'ID' ? 'IDR' : 'INR')],
        enabledMethods: methods,
        status: 'Under Review',
        addedAt: nowIso,
        settlementConfig: {
          settlementCurrency: settlement?.settlementCurrency || (cCode === 'MY' ? 'MYR' : cCode === 'ID' ? 'IDR' : 'INR'),
          settlementFrequency: settlement?.settlementFrequency || 'Daily (T+1)',
          settlementDestinationRef: settlement?.settlementDestinationRef || 'Pending bank verification',
          market: cCode,
          reviewStatus: 'Pending Review',
        },
      };
    });

    const allCurrencies = Array.from(
      new Set(operatingCountries.flatMap((c) => c.currencies))
    );

    const allMethods = Array.from(
      new Set(operatingCountries.flatMap((c) => c.enabledMethods))
    );

    const activityHistory: ActivityEvent[] = [
      {
        id: `act-${Date.now()}-1`,
        eventName: 'Merchant Submitted for Review',
        description: `New onboarding application submitted for ${formData.legalBusinessName}. Status transitioned to Under Review.`,
        timestamp: nowIso,
        actor: formData.contactName || 'Onboarding Portal',
        type: 'creation',
      },
    ];

    const newMerchant: Merchant = {
      id: newId,
      name: formData.legalBusinessName,
      tradingName: formData.tradingName || undefined,
      registrationNumber: formData.registrationNumber,
      businessType: formData.businessType,
      website: formData.website || undefined,
      registeredCountry: (formData.registeredCountry as CountryCode) || 'MY',
      businessAddress: formData.businessAddress,
      businessDescription: formData.businessDescription || undefined,
      primaryContact: {
        name: formData.contactName,
        email: formData.workEmail,
        phone: formData.phone,
        jobTitle: formData.jobTitle,
      },
      status: 'Under Review', // Requirements: submitted merchant must become Under Review, not Active
      onboardingStatus: 'Under Review',
      operatingCountries,
      currencies: allCurrencies.length > 0 ? allCurrencies : ['MYR'],
      enabledPaymentMethods: allMethods,
      createdAt: nowIso,
      lastActivityAt: nowIso,
      activityHistory,
    };

    const updatedList = [newMerchant, ...list];
    storage.set(STORAGE_KEYS.MERCHANTS, updatedList);

    // If there was a draft, delete it
    if (draftIdToClean) {
      this.deleteDraft(draftIdToClean);
    }

    return newMerchant;
  },

  /**
   * Add a new country / market expansion to an existing merchant
   */
  async addCountryMarket(
    merchantId: string,
    params: {
      countryCode: CountryCode;
      paymentMethods: string[];
      settlementCurrency: string;
      settlementFrequency: 'Daily (T+1)' | 'Twice Weekly' | 'Weekly (T+3)' | 'Monthly';
      settlementDestinationRef: string;
      actorName?: string;
    }
  ): Promise<Merchant> {
    const list = getStoredMerchants();
    const index = list.findIndex((m) => m.id === merchantId);

    if (index === -1) {
      throw new Error(`Merchant with ID ${merchantId} not found.`);
    }

    const merchant = list[index];
    const nowIso = new Date().toISOString();

    // Check if country already exists
    if (merchant.operatingCountries.some((c) => c.countryCode === params.countryCode)) {
      throw new Error(`Country ${params.countryCode} is already configured for this merchant.`);
    }

    const newMarketConfig: CountryMarketConfig = {
      countryCode: params.countryCode,
      currencies: [params.settlementCurrency],
      enabledMethods: params.paymentMethods,
      status: 'Under Review', // Requirement: Adding a country must not automatically mark that market as operational
      addedAt: nowIso,
      settlementConfig: {
        settlementCurrency: params.settlementCurrency,
        settlementFrequency: params.settlementFrequency,
        settlementDestinationRef: params.settlementDestinationRef,
        market: params.countryCode,
        reviewStatus: 'Pending Review',
      },
    };

    const updatedCountries = [...merchant.operatingCountries, newMarketConfig];
    const updatedCurrencies = Array.from(new Set([...merchant.currencies, params.settlementCurrency]));
    const updatedMethods = Array.from(new Set([...merchant.enabledPaymentMethods, ...params.paymentMethods]));

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      eventName: `Market Expansion Requested: ${params.countryCode}`,
      description: `Market expansion submitted for ${params.countryCode} with ${params.paymentMethods.length} payment capabilities. Application placed Under Review.`,
      timestamp: nowIso,
      actor: params.actorName || 'Operations Console',
      type: 'country_expansion',
    };

    const updatedMerchant: Merchant = {
      ...merchant,
      operatingCountries: updatedCountries,
      currencies: updatedCurrencies,
      enabledPaymentMethods: updatedMethods,
      lastActivityAt: nowIso,
      activityHistory: [newActivity, ...merchant.activityHistory],
    };

    list[index] = updatedMerchant;
    storage.set(STORAGE_KEYS.MERCHANTS, list);

    return updatedMerchant;
  },

  /**
   * Update merchant basic details (e.g. from profile edit)
   */
  async updateMerchantDetails(
    merchantId: string,
    updates: Partial<Merchant>,
    actorName: string = 'Operations Team'
  ): Promise<Merchant> {
    const list = getStoredMerchants();
    const index = list.findIndex((m) => m.id === merchantId);

    if (index === -1) {
      throw new Error(`Merchant with ID ${merchantId} not found.`);
    }

    const merchant = list[index];
    const nowIso = new Date().toISOString();

    const activityEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      eventName: 'Merchant Information Updated',
      description: 'Profile business parameters and contact information updated.',
      timestamp: nowIso,
      actor: actorName,
      type: 'update',
    };

    const updatedMerchant: Merchant = {
      ...merchant,
      ...updates,
      lastActivityAt: nowIso,
      activityHistory: [activityEvent, ...merchant.activityHistory],
    };

    list[index] = updatedMerchant;
    storage.set(STORAGE_KEYS.MERCHANTS, list);

    return updatedMerchant;
  },

  /**
   * Save onboarding draft
   */
  saveDraft(formData: OnboardingFormData, currentStep: number, draftId?: string): OnboardingDraft {
    const drafts = getStoredDrafts();
    const id = draftId || `draft-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const draftIndex = drafts.findIndex((d) => d.draftId === id);

    const draftItem: OnboardingDraft = {
      draftId: id,
      merchantName: formData.legalBusinessName || 'Untitled Merchant Draft',
      currentStep,
      lastUpdated: nowIso,
      formData,
    };

    if (draftIndex >= 0) {
      drafts[draftIndex] = draftItem;
    } else {
      drafts.unshift(draftItem);
    }

    storage.set(STORAGE_KEYS.DRAFTS, drafts);
    return draftItem;
  },

  /**
   * Get draft by ID or latest
   */
  getDraft(draftId?: string): OnboardingDraft | null {
    const drafts = getStoredDrafts();
    if (draftId) {
      return drafts.find((d) => d.draftId === draftId) || null;
    }
    return drafts[0] || null;
  },

  /**
   * Get all drafts
   */
  getAllDrafts(): OnboardingDraft[] {
    return getStoredDrafts();
  },

  /**
   * Delete draft
   */
  deleteDraft(draftId: string): void {
    const drafts = getStoredDrafts();
    const filtered = drafts.filter((d) => d.draftId !== draftId);
    storage.set(STORAGE_KEYS.DRAFTS, filtered);
  },

  /**
   * Reset data to initial sample
   */
  resetToSampleData(): Merchant[] {
    storage.set(STORAGE_KEYS.MERCHANTS, INITIAL_MERCHANTS);
    storage.set(STORAGE_KEYS.DRAFTS, []);
    return INITIAL_MERCHANTS;
  },
};

