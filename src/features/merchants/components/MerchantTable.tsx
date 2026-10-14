import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Merchant } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatRelativeTime, getCountryFlag } from '@/utils/formatters';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ExternalLink,
  PlusCircle,
  Building2,
  Globe2,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export type SortField = 'name' | 'id' | 'status' | 'createdAt' | 'lastActivityAt';
export type SortOrder = 'asc' | 'desc';

interface MerchantTableProps {
  merchants: Merchant[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onOpenAddCountry: (merchant: Merchant, e: React.MouseEvent) => void;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const MerchantTable: React.FC<MerchantTableProps> = ({
  merchants,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  sortField,
  sortOrder,
  onSort,
  onOpenAddCountry,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}) => {
  const navigate = useNavigate();

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const isAllSelected = merchants.length > 0 && merchants.every((m) => selectedIds.includes(m.id));

  const SortButton = ({ field, label }: { field: SortField; label: string }) => {
    const isActive = sortField === field;
    return (
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-900 group"
      >
        <span>{label}</span>
        {isActive ? (
          sortOrder === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-xs">
              {/* Checkbox select all */}
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  aria-label="Select all merchants"
                />
              </th>
              <th className="py-3 px-3">
                <SortButton field="name" label="Merchant" />
              </th>
              <th className="py-3 px-3">
                <SortButton field="id" label="Merchant ID" />
              </th>
              <th className="py-3 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Markets
              </th>
              <th className="py-3 px-3">
                <SortButton field="status" label="Status" />
              </th>
              <th className="py-3 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Enabled Rails
              </th>
              <th className="py-3 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Currencies
              </th>
              <th className="py-3 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Onboarding
              </th>
              <th className="py-3 px-3">
                <SortButton field="createdAt" label="Created" />
              </th>
              <th className="py-3 px-3">
                <SortButton field="lastActivityAt" label="Last Activity" />
              </th>
              <th className="py-3 px-3 text-right pr-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {merchants.map((merchant) => {
              const isSelected = selectedIds.includes(merchant.id);

              return (
                <tr
                  key={merchant.id}
                  onClick={() => navigate(`/merchants/${merchant.id}`)}
                  className={cn(
                    'group cursor-pointer transition-colors duration-150',
                    isSelected ? 'bg-blue-50/40 hover:bg-blue-50/60' : 'hover:bg-slate-50/80'
                  )}
                >
                  {/* Row Checkbox */}
                  <td
                    className="py-3.5 px-3 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(merchant.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      aria-label={`Select ${merchant.name}`}
                    />
                  </td>

                  {/* Merchant Name & Legal Name */}
                  <td className="py-3.5 px-3 min-w-[200px]">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      <span>{merchant.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                    </div>
                    {merchant.tradingName && (
                      <p className="text-[11px] text-slate-400">Trading as: {merchant.tradingName}</p>
                    )}
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Reg: {merchant.registrationNumber}
                    </p>
                  </td>

                  {/* Merchant ID */}
                  <td className="py-3.5 px-3 font-mono text-[11px] font-medium text-slate-600 whitespace-nowrap">
                    {merchant.id}
                  </td>

                  {/* Operating Countries */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {merchant.operatingCountries.length > 0 ? (
                        merchant.operatingCountries.map((c) => (
                          <span
                            key={c.countryCode}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60"
                            title={`${c.countryCode} - Status: ${c.status}`}
                          >
                            <span>{getCountryFlag(c.countryCode)}</span>
                            <span>{c.countryCode}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">None configured</span>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <Badge status={merchant.status} showDot size="sm">
                      {merchant.status}
                    </Badge>
                  </td>

                  {/* Enabled Payment Methods */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 text-[11px] text-slate-600">
                      <span className="font-semibold font-mono text-slate-800">
                        {merchant.enabledPaymentMethods.length}
                      </span>
                      <span className="text-slate-400">methods</span>
                    </div>
                  </td>

                  {/* Currencies */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {merchant.currencies.map((curr) => (
                        <span
                          key={curr}
                          className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200/80 font-mono"
                        >
                          {curr}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Onboarding Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <Badge status={merchant.onboardingStatus} size="sm">
                      {merchant.onboardingStatus}
                    </Badge>
                  </td>

                  {/* Created Date */}
                  <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                    {formatDate(merchant.createdAt)}
                  </td>

                  {/* Last Activity */}
                  <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                    {formatRelativeTime(merchant.lastActivityAt)}
                  </td>

                  {/* Actions Column */}
                  <td
                    className="py-3.5 px-3 text-right pr-4 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => onOpenAddCountry(merchant, e)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Add Country Market"
                        aria-label={`Add Country to ${merchant.name}`}
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/merchants/${merchant.id}`)}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="View Merchant Profile"
                        aria-label={`View Profile of ${merchant.name}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-900">
            {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-900">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{' '}
          of <span className="font-semibold text-slate-900">{totalItems}</span> merchants
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-7 text-xs px-2.5"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={cn(
                    'w-7 h-7 rounded-md text-xs font-semibold transition-colors',
                    currentPage === p
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-7 text-xs px-2.5"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

