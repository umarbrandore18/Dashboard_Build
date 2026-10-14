import React from 'react';
import { Search, X, Filter, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MerchantFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCountry: string;
  onCountryChange: (c: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  selectedOnboardingStatus: string;
  onOnboardingStatusChange: (s: string) => void;
  onResetFilters: () => void;
  selectedCount: number;
  onExportSelected: () => void;
  onClearSelection: () => void;
  totalMerchantsCount: number;
}

export const MerchantFilters: React.FC<MerchantFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedStatus,
  onStatusChange,
  selectedOnboardingStatus,
  onOnboardingStatusChange,
  onResetFilters,
  selectedCount,
  onExportSelected,
  onClearSelection,
  totalMerchantsCount,
}) => {
  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCountry !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedOnboardingStatus !== 'ALL';

  return (
    <div className="space-y-3">
      {/* Top Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            placeholder="Search by merchant name, ID, or registration..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors shadow-2xs"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Country Selector */}
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
          >
            <option value="ALL">🌐 All Countries</option>
            <option value="MY">🇲🇾 Malaysia (MY)</option>
            <option value="ID">🇮🇩 Indonesia (ID)</option>
            <option value="IN">🇮🇳 India (IN)</option>
          </select>

          {/* Account Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
          >
            <option value="ALL">Account: All Statuses</option>
            <option value="Active">Active</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Under Review">Under Review</option>
            <option value="Suspended">Suspended</option>
            <option value="Draft">Draft</option>
          </select>

          {/* Onboarding Pipeline Filter */}
          <select
            value={selectedOnboardingStatus}
            onChange={(e) => onOnboardingStatusChange(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
          >
            <option value="ALL">Pipeline: All Stages</option>
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
          </select>

          {/* Reset Filters Action */}
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              leftIcon={<X className="w-3.5 h-3.5" />}
              className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Selection Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-2.5 bg-blue-50/80 border border-blue-200 rounded-lg text-xs text-blue-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-semibold">{selectedCount}</span>
            <span>of {totalMerchantsCount} merchant records selected</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportSelected}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="text-xs bg-white text-blue-700 border-blue-300 hover:bg-blue-50 h-7"
            >
              Export Selected ({selectedCount})
            </Button>
            <button
              type="button"
              onClick={onClearSelection}
              className="text-xs text-blue-600 hover:underline px-2"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

