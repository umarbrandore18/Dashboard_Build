import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  ChevronDown,
  Globe,
  Building2,
  Coins,
  Calendar,
  Check,
  RefreshCw,
  AlertTriangle,
  User,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { useFilters } from '@/context/FilterContext';
import { useToast } from '@/context/ToastContext';
import { CountryCode } from '@/types';
import { merchantService } from '@/services/merchantService';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface TopNavProps {
  onMobileMenuOpen: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMobileMenuOpen }) => {
  const navigate = useNavigate();
  const { filters, setCountry, setMerchantId, setCurrency, setDateRange, merchantsList, refreshMerchants } = useFilters();
  const toast = useToast();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResultsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetData = () => {
    merchantService.resetToSampleData();
    refreshMerchants();
    toast.success('Sample Data Reset', 'Merchant and onboarding records restored to default demo state.');
    setProfileOpen(false);
  };

  const filteredMerchantsForSearch = searchQuery.trim()
    ? merchantsList.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        {/* Left: Mobile menu button + Selectors */}
        <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onMobileMenuOpen}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Context Selectors Group */}
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {/* Country Selector */}
            <div className="relative">
              <select
                value={filters.country}
                onChange={(e) => setCountry(e.target.value as 'ALL' | CountryCode)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-7 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors"
                title="Filter by Operating Country"
              >
                <option value="ALL">🌐 All Countries</option>
                <option value="MY">🇲🇾 Malaysia</option>
                <option value="ID">🇮🇩 Indonesia</option>
                <option value="IN">🇮🇳 India</option>
              </select>
              <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Merchant Selector */}
            <div className="relative max-w-[190px]">
              <select
                value={filters.merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-7 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors truncate"
                title="Filter by Specific Merchant"
              >
                <option value="ALL">🏢 All Merchants</option>
                {merchantsList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id})
                  </option>
                ))}
              </select>
              <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <select
                value={filters.currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-7 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors"
                title="Settlement / Operational Currency"
              >
                <option value="ALL">🪙 All Currencies</option>
                <option value="MYR">MYR (Ringgit)</option>
                <option value="IDR">IDR (Rupiah)</option>
                <option value="INR">INR (Rupee)</option>
                <option value="USD">USD (Dollar)</option>
              </select>
              <Coins className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Date Range Selector */}
            <div className="relative">
              <select
                value={filters.dateRange}
                onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d')}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-7 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors"
                title="Reporting Period"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Search, Help, Notifications, User */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Global Search Bar */}
          <div ref={searchRef} className="relative hidden xl:block w-64">
            <input
              type="text"
              placeholder="Search merchants, IDs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchResultsOpen(true);
              }}
              onFocus={() => setSearchResultsOpen(true)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

            {/* Search Dropdown Results */}
            {searchResultsOpen && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 max-h-72 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Merchants ({filteredMerchantsForSearch.length})
                </div>
                {filteredMerchantsForSearch.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-slate-500 italic">No merchants matching "{searchQuery}"</p>
                ) : (
                  filteredMerchantsForSearch.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        navigate(`/merchants/${m.id}`);
                        setSearchResultsOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{m.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{m.id} • {m.registeredCountry}</p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {m.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Application Help & Scope"
            aria-label="Application Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Operational Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-slate-900">Operational Alerts</h4>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                      3 Active
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Real-time</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">FPX Degradation in Malaysia</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Success rate dropped 3.8% across Bank Islam/RHB routes.</p>
                        <button
                          onClick={() => {
                            setNotificationsOpen(false);
                            navigate('/merchants?country=MY');
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:underline mt-1 inline-block"
                        >
                          View affected merchants &rarr;
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">BCA Virtual Account Queue</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">214 pending acknowledgements awaiting clearing confirmation.</p>
                        <button
                          onClick={() => {
                            setNotificationsOpen(false);
                            navigate('/merchants?country=ID');
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:underline mt-1 inline-block"
                        >
                          Filter Indonesia merchants &rarr;
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Acme Trading Volume Decline</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Weekly volume dropped 28% after key rotation.</p>
                        <button
                          onClick={() => {
                            setNotificationsOpen(false);
                            navigate('/merchants/MER-84920');
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:underline mt-1 inline-block"
                        >
                          Inspect Acme Profile &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-[1px] bg-slate-200 mx-1" />

          {/* User Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
              aria-label="User profile menu"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center border border-blue-200 shrink-0">
                FA
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">Farhan Azman</p>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Head of Operations</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Farhan Azman</p>
                  <p className="text-[11px] text-slate-500">farhan.azman@mobi.asia</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                    Operations SuperAdmin
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleResetData}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    Reset Sample Demo Data
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1 px-4 py-1.5 text-[10px] text-slate-400">
                  Mobi Gateway v1.0.4 (Batch 1)
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Help Modal */}
      <Modal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Mobi Global Payments Operations — Platform Guide"
        description="Integrate once. Operate globally. Manage everything from one platform."
        size="lg"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900">
            <p className="font-semibold text-xs">Current Scope: MVP Batch 1</p>
            <p className="text-[11px] mt-1 leading-relaxed text-blue-800">
              This operational release delivers 3 fully functional core modules: <strong>Global Dashboard</strong>, <strong>Merchant Management</strong>, and the <strong>7-Step Merchant Onboarding Journey</strong>. All money movement and routing tabs are reserved for Batch 2.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Key Operational Principles</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 leading-relaxed">
              <li><strong>Interactive Top Selectors:</strong> Select Country, Merchant, Currency, or Date Range to dynamically filter KPI metrics, chart curves, and merchant rosters.</li>
              <li><strong>Seven-Step Onboarding:</strong> Complete business information, primary contact, country capabilities, payment methods, settlement configuration, review, and submission.</li>
              <li><strong>Market Expansion:</strong> Existing merchants can request expansion into additional supported markets (Malaysia, Indonesia, India) without duplicating merchant entities.</li>
              <li><strong>Draft Resilience:</strong> Partial onboarding drafts can be saved and resumed at any step. All modifications persist across browser refreshes via localStorage.</li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <h4 className="font-semibold text-slate-900 mb-1">Demonstration Notice</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              All merchant entities, registration numbers, transaction figures, and bank identifiers shown are fictional sample demonstration data. No real funds or banking rails are connected.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

