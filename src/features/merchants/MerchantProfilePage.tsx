import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Merchant, CountryMarketConfig } from '@/types';
import { merchantService } from '@/services/merchantService';
import { AddCountryModal } from './components/AddCountryModal';
import { EditMerchantModal } from './components/EditMerchantModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/context/ToastContext';
import { formatDate, formatRelativeTime, getCountryFlag, getCountryName } from '@/utils/formatters';
import {
  ArrowLeft,
  Building2,
  Globe2,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  CreditCard,
  Landmark,
  PlusCircle,
  Edit,
  History,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export const MerchantProfilePage: React.FC = () => {
  const { merchantId } = useParams<{ merchantId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [addCountryOpen, setAddCountryOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchMerchant = async () => {
      if (!merchantId) return;
      setIsLoading(true);
      try {
        const found = await merchantService.getMerchantById(merchantId);
        setMerchant(found);
      } catch (err: any) {
        toast.error('Failed to load merchant profile', err?.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMerchant();
  }, [merchantId, toast]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-72 w-full rounded-xl lg:col-span-2" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="py-12 bg-white rounded-2xl border border-slate-200">
        <EmptyState
          icon={<Building2 className="w-10 h-10 text-slate-400" />}
          title="Merchant Not Found"
          description={`No registered merchant record found matching identifier "${merchantId}".`}
          action={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/merchants')}
            >
              Back to Merchant Directory
            </Button>
          }
        />
      </div>
    );
  }

  const profileTabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity History', count: merchant.activityHistory.length },
    { id: 'transactions', label: 'Transactions', isFuturePhase: true },
    { id: 'payins', label: 'Pay-ins', isFuturePhase: true },
    { id: 'payouts', label: 'Payouts', isFuturePhase: true },
    { id: 'settlements', label: 'Settlements', isFuturePhase: true },
    { id: 'payment-methods', label: 'Payment Methods', isFuturePhase: true },
    { id: 'pricing', label: 'Pricing & Fees', isFuturePhase: true },
    { id: 'users', label: 'Authorized Users', isFuturePhase: true },
    { id: 'configuration', label: 'API Configuration', isFuturePhase: true },
  ];

  return (
    <div className="space-y-6">
      {/* Back button link */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/merchants')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Merchant Management</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Merchant Identity */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xl shrink-0 shadow-xs">
                {merchant.name.charAt(0)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    {merchant.name}
                  </h1>
                  <Badge status={merchant.status} showDot size="sm">
                    {merchant.status}
                  </Badge>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {merchant.id}
                  </span>
                </div>

                {merchant.tradingName && (
                  <p className="text-xs font-medium text-slate-500 mb-2">
                    Trading as: <span className="text-slate-800">{merchant.tradingName}</span>
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Reg: {merchant.registrationNumber}
                  </span>

                  <span className="flex items-center gap-1">
                    <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                    Registered: {getCountryFlag(merchant.registeredCountry)} {getCountryName(merchant.registeredCountry)}
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Since: {formatDate(merchant.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditModalOpen(true)}
                leftIcon={<Edit className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Edit Merchant
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setAddCountryOpen(true)}
                leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Add Country
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Navigation Tabs */}
      <Tabs
        tabs={profileTabs}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Tab Content Display */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Operating Markets & Payment Capabilities */}
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-blue-600" />
                  <CardTitle>Regional Operating Markets & Capabilities</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddCountryOpen(true)}
                  leftIcon={<PlusCircle className="w-3.5 h-3.5 text-blue-600" />}
                  className="text-xs text-blue-600"
                >
                  Expand Market
                </Button>
              </CardHeader>

              <CardContent className="pt-2">
                {merchant.operatingCountries.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">
                    No operating markets currently configured. Click "Expand Market" to provision one.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {merchant.operatingCountries.map((market: CountryMarketConfig) => (
                      <div
                        key={market.countryCode}
                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl leading-none">
                              {getCountryFlag(market.countryCode)}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                {getCountryName(market.countryCode)}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono">
                                Added {formatDate(market.addedAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge status={market.status} showDot size="sm">
                              {market.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Enabled Methods */}
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                            Active Payment Rails ({market.enabledMethods.length}):
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {market.enabledMethods.map((m) => (
                              <span
                                key={m}
                                className="px-2 py-0.5 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Settlement Summary */}
                        <div className="p-3 bg-white rounded-lg border border-slate-200/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-semibold text-slate-500">
                              Settlement Routing:
                            </span>
                            <p className="font-mono text-slate-800 text-[11px] mt-0.5">
                              {market.settlementConfig.settlementDestinationRef}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                              {market.settlementConfig.settlementCurrency} •{' '}
                              {market.settlementConfig.settlementFrequency}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Information Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <CardTitle>Business Registration Dossier</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Legal Registered Name:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{merchant.name}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Business Entity Type:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{merchant.businessType}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Registration / Tax ID:</span>
                    <p className="font-mono font-semibold text-slate-900 mt-0.5">
                      {merchant.registrationNumber}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Official Website:</span>
                    <p className="mt-0.5">
                      {merchant.website ? (
                        <a
                          href={merchant.website}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>{merchant.website}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Not provided</span>
                      )}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-medium">Registered Address:</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">
                      {merchant.businessAddress}
                    </p>
                  </div>

                  {merchant.businessDescription && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 font-medium">Commercial Scope:</span>
                      <p className="text-slate-700 mt-0.5 leading-relaxed">
                        {merchant.businessDescription}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (1 span) */}
          <div className="space-y-6">
            {/* Primary Operations Contact */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <CardTitle>Authorized Contact</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="pt-2 text-xs space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {merchant.primaryContact.name}
                  </h4>
                  <p className="text-slate-500">{merchant.primaryContact.jobTitle}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${merchant.primaryContact.email}`}
                      className="text-blue-600 hover:underline truncate"
                    >
                      {merchant.primaryContact.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{merchant.primaryContact.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Status & Settlement Checklist */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <CardTitle>Compliance Checklist</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="pt-2 text-xs space-y-3">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Entity KYB Verification</span>
                  <Badge status="Approved" size="sm">
                    Verified
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Settlement Account</span>
                  <Badge
                    status={merchant.operatingCountries.length > 0 ? 'Approved' : 'Action Required'}
                    size="sm"
                  >
                    {merchant.operatingCountries.length > 0 ? 'Authorized' : 'Pending'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Live API Credentials</span>
                  <Badge status={merchant.status === 'Active' ? 'Approved' : 'Pending Review'} size="sm">
                    {merchant.status === 'Active' ? 'Generated' : 'Under Review'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500">Annual AML Review</span>
                  <span className="font-mono text-slate-500 text-[11px]">Due Q3 2027</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Activity History Tab */}
      {activeTab === 'activity' && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <CardTitle>Audited Account Activity Log</CardTitle>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable ledger of merchant creations, expansions, and operational updates
            </p>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {merchant.activityHistory.map((act) => {
                const isCreation = act.type === 'creation';
                const isExpansion = act.type === 'country_expansion';
                const isStatus = act.type === 'status_change';

                return (
                  <div key={act.id} className="relative">
                    {/* Timeline bullet */}
                    <span
                      className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ${
                        isCreation
                          ? 'bg-blue-600 ring-blue-200'
                          : isExpansion
                          ? 'bg-emerald-600 ring-emerald-200'
                          : isStatus
                          ? 'bg-purple-600 ring-purple-200'
                          : 'bg-slate-500 ring-slate-200'
                      }`}
                    />

                    <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-slate-900">
                          {act.eventName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formatDate(act.timestamp, true)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {act.description}
                      </p>

                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                        <span className="font-medium text-slate-400">Actor:</span>
                        <span className="font-semibold text-slate-700">{act.actor}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 font-mono text-[10px]">{act.id}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Future Phase Placeholder for uncompleted tabs */}
      {activeTab !== 'overview' && activeTab !== 'activity' && (
        <Card className="border-slate-200">
          <CardContent className="py-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <Badge variant="purple" size="md">
              Batch 2 Roadmap
            </Badge>
            <h3 className="text-sm font-bold text-slate-900">
              {profileTabs.find((t) => t.id === activeTab)?.label} Workflow Coming Soon
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              In accordance with MVP Batch 1 scope, detailed money movement, custom host routing, and per-merchant pricing calculators are deferred to subsequent development phases.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('overview')}
              className="mt-2 text-xs"
            >
              Return to Merchant Overview
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AddCountryModal
        isOpen={addCountryOpen}
        onClose={() => setAddCountryOpen(false)}
        merchant={merchant}
        onSuccess={(updated) => setMerchant(updated)}
      />

      <EditMerchantModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        merchant={merchant}
        onSuccess={(updated) => setMerchant(updated)}
      />
    </div>
  );
};

