import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Merchant } from '@/types';
import { merchantService } from '@/services/merchantService';
import { MerchantSummaryCards } from './components/MerchantSummaryCards';
import { MerchantFilters } from './components/MerchantFilters';
import { MerchantTable, SortField, SortOrder } from './components/MerchantTable';
import { AddCountryModal } from './components/AddCountryModal';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/context/ToastContext';
import {
  UserPlus,
  Download,
  Users2,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export const MerchantListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'ALL');
  const [selectedOnboardingStatus, setSelectedOnboardingStatus] = useState(
    searchParams.get('onboarding') || 'ALL'
  );

  // Sorting and selection
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Add Country modal state
  const [addCountryModalMerchant, setAddCountryModalMerchant] = useState<Merchant | null>(null);

  const loadMerchants = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await merchantService.getMerchants();
      setMerchants(list);
    } catch (err: any) {
      toast.error('Failed to load merchants', err?.message);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadMerchants();
  }, [loadMerchants]);

  // Sync with URL query parameters if present
  useEffect(() => {
    const countryParam = searchParams.get('country');
    if (countryParam && countryParam !== selectedCountry) {
      setSelectedCountry(countryParam);
    }
    const statusParam = searchParams.get('status');
    if (statusParam && statusParam !== selectedStatus) {
      setSelectedStatus(statusParam);
    }
  }, [searchParams]);

  // Filter and sort merchants
  const filteredMerchants = useMemo(() => {
    return merchants.filter((m) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesId = m.id.toLowerCase().includes(q);
        const matchesReg = m.registrationNumber.toLowerCase().includes(q);
        const matchesTrading = m.tradingName?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesReg && !matchesTrading) return false;
      }

      // Country
      if (selectedCountry !== 'ALL') {
        const inCountry =
          m.registeredCountry === selectedCountry ||
          m.operatingCountries.some((c) => c.countryCode === selectedCountry);
        if (!inCountry) return false;
      }

      // Account Status
      if (selectedStatus !== 'ALL' && m.status !== selectedStatus) {
        return false;
      }

      // Onboarding Status
      if (
        selectedOnboardingStatus !== 'ALL' &&
        m.onboardingStatus !== selectedOnboardingStatus
      ) {
        return false;
      }

      return true;
    });
  }, [merchants, searchQuery, selectedCountry, selectedStatus, selectedOnboardingStatus]);

  // Sorted records
  const sortedMerchants = useMemo(() => {
    const list = [...filteredMerchants];
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'createdAt' || sortField === 'lastActivityAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredMerchants, sortField, sortOrder]);

  // Paginated records
  const paginatedMerchants = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedMerchants.slice(start, start + pageSize);
  }, [sortedMerchants, currentPage, pageSize]);

  // Handle column sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (paginatedMerchants.every((m) => selectedIds.includes(m.id))) {
      setSelectedIds([]);
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...paginatedMerchants.map((m) => m.id)])));
    }
  };

  // CSV Export
  const handleExportCSV = (recordsToExport: Merchant[]) => {
    if (recordsToExport.length === 0) {
      toast.warning('No records to export', 'Adjust filters to include merchants for export.');
      return;
    }

    const headers = [
      'Merchant ID',
      'Legal Business Name',
      'Trading Name',
      'Registration Number',
      'Business Type',
      'Status',
      'Onboarding Status',
      'Registered Country',
      'Operating Markets',
      'Currencies',
      'Enabled Rails Count',
      'Primary Contact Name',
      'Primary Contact Email',
      'Created Date',
      'Last Activity',
    ];

    const rows = recordsToExport.map((m) => [
      `"${m.id}"`,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${(m.tradingName || '').replace(/"/g, '""')}"`,
      `"${m.registrationNumber}"`,
      `"${m.businessType}"`,
      `"${m.status}"`,
      `"${m.onboardingStatus}"`,
      `"${m.registeredCountry}"`,
      `"${m.operatingCountries.map((c) => c.countryCode).join(', ')}"`,
      `"${m.currencies.join(', ')}"`,
      m.enabledPaymentMethods.length,
      `"${m.primaryContact.name}"`,
      `"${m.primaryContact.email}"`,
      `"${m.createdAt}"`,
      `"${m.lastActivityAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mobi-merchants-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV Export Generated', `Exported ${recordsToExport.length} merchant records successfully.`);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCountry('ALL');
    setSelectedStatus('ALL');
    setSelectedOnboardingStatus('ALL');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Merchant Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor merchant accounts, configure multi-market routing, and manage compliance lifecycle
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportCSV(sortedMerchants)}
            leftIcon={<Download className="w-3.5 h-3.5 text-slate-600" />}
            className="text-xs"
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/merchants/new')}
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Add Merchant
          </Button>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <MerchantSummaryCards
        merchants={merchants}
        activeStatusFilter={selectedStatus}
        onSelectStatus={(status) => {
          setSelectedStatus(status);
          setCurrentPage(1);
        }}
      />

      {/* Filter and Search Bar */}
      <MerchantFilters
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedCountry={selectedCountry}
        onCountryChange={(c) => {
          setSelectedCountry(c);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(s) => {
          setSelectedStatus(s);
          setCurrentPage(1);
        }}
        selectedOnboardingStatus={selectedOnboardingStatus}
        onOnboardingStatusChange={(os) => {
          setSelectedOnboardingStatus(os);
          setCurrentPage(1);
        }}
        onResetFilters={resetAllFilters}
        selectedCount={selectedIds.length}
        onExportSelected={() => {
          const selectedRecords = merchants.filter((m) => selectedIds.includes(m.id));
          handleExportCSV(selectedRecords);
        }}
        onClearSelection={() => setSelectedIds([])}
        totalMerchantsCount={sortedMerchants.length}
      />

      {/* Merchant Table or Empty State */}
      {sortedMerchants.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10">
          <EmptyState
            icon={<Users2 className="w-8 h-8 text-slate-400" />}
            title="No Matching Merchants Found"
            description="No merchant accounts match the current filter criteria or search query."
            action={
              <Button variant="primary" size="sm" onClick={resetAllFilters} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                Reset Filters
              </Button>
            }
            secondaryAction={
              <Button variant="outline" size="sm" onClick={() => navigate('/merchants/new')}>
                Onboard New Merchant
              </Button>
            }
          />
        </div>
      ) : (
        <MerchantTable
          merchants={paginatedMerchants}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onOpenAddCountry={(merchant, e) => {
            e.stopPropagation();
            setAddCountryModalMerchant(merchant);
          }}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={sortedMerchants.length}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Country Market Expansion Modal */}
      <AddCountryModal
        isOpen={Boolean(addCountryModalMerchant)}
        onClose={() => setAddCountryModalMerchant(null)}
        merchant={addCountryModalMerchant}
        onSuccess={(updatedMerchant) => {
          setMerchants((prev) =>
            prev.map((m) => (m.id === updatedMerchant.id ? updatedMerchant : m))
          );
        }}
      />
    </div>
  );
};

