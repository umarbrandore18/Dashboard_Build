import React, { createContext, useContext, useState, useEffect } from 'react';
import { GlobalFilterState, CountryCode, Merchant } from '@/types';
import { merchantService } from '@/services/merchantService';

interface FilterContextType {
  filters: GlobalFilterState;
  setCountry: (country: 'ALL' | CountryCode) => void;
  setMerchantId: (id: 'ALL' | string) => void;
  setCurrency: (currency: 'ALL' | string) => void;
  setDateRange: (range: '7d' | '30d' | '90d') => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  merchantsList: Merchant[];
  refreshMerchants: () => Promise<void>;
}

const DEFAULT_FILTERS: GlobalFilterState = {
  country: 'ALL',
  merchantId: 'ALL',
  currency: 'ALL',
  dateRange: '30d',
  searchQuery: '',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<GlobalFilterState>(DEFAULT_FILTERS);
  const [merchantsList, setMerchantsList] = useState<Merchant[]>([]);

  const refreshMerchants = async () => {
    try {
      const list = await merchantService.getMerchants();
      setMerchantsList(list);
    } catch (e) {
      console.error('Failed to load merchants list for filter:', e);
    }
  };

  useEffect(() => {
    refreshMerchants();
  }, []);

  const setCountry = (country: 'ALL' | CountryCode) => {
    setFilters((prev) => ({
      ...prev,
      country,
      // If a specific currency was set that doesn't match country, adapt appropriately
      currency: country === 'MY' ? 'MYR' : country === 'ID' ? 'IDR' : country === 'IN' ? 'INR' : prev.currency,
    }));
  };

  const setMerchantId = (merchantId: 'ALL' | string) => {
    setFilters((prev) => ({ ...prev, merchantId }));
  };

  const setCurrency = (currency: 'ALL' | string) => {
    setFilters((prev) => ({ ...prev, currency }));
  };

  const setDateRange = (dateRange: '7d' | '30d' | '90d') => {
    setFilters((prev) => ({ ...prev, dateRange }));
  };

  const setSearchQuery = (searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setCountry,
        setMerchantId,
        setCurrency,
        setDateRange,
        setSearchQuery,
        resetFilters,
        merchantsList,
        refreshMerchants,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

