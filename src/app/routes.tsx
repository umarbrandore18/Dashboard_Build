import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { MerchantListPage } from '@/features/merchants/MerchantListPage';
import { MerchantProfilePage } from '@/features/merchants/MerchantProfilePage';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { PlaceholderPage } from '@/features/placeholder/PlaceholderPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Default route redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Module A: Global Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Module B: Merchant Management */}
        <Route path="/merchants" element={<MerchantListPage />} />

        {/* Module C: Merchant Onboarding */}
        <Route path="/merchants/new" element={<OnboardingPage />} />

        {/* Module D: Merchant Profile */}
        <Route path="/merchants/:merchantId" element={<MerchantProfilePage />} />

        {/* Planned Batch 2 Modules (Clear Placeholder Navigation) */}
        <Route
          path="/payins"
          element={
            <PlaceholderPage
              moduleName="Pay-ins Processing"
              category="Money Movement"
              scopeSummary="Detailed multi-rail pay-in transaction streams, gateway settlement logs, and currency conversion workflows will be delivered in Batch 2."
            />
          }
        />
        <Route
          path="/payouts"
          element={
            <PlaceholderPage
              moduleName="Global Payouts & Disbursements"
              category="Money Movement"
              scopeSummary="Batch disbursement queues, IMPS/NEFT routing monitors, and real-time bank ledger balances will be integrated in Batch 2."
            />
          }
        />
        <Route
          path="/settlements"
          element={
            <PlaceholderPage
              moduleName="Settlement Operations"
              category="Money Movement"
              scopeSummary="Multi-currency clearing runs, net merchant payout reconciliations, and fee deduction engines are scheduled for Batch 2."
            />
          }
        />
        <Route
          path="/transactions"
          element={
            <PlaceholderPage
              moduleName="Transaction Ledger"
              category="Money Movement"
              scopeSummary="Raw transactional telemetry, refund state machines, chargeback processing, and retry mechanisms will be implemented in Batch 2."
            />
          }
        />
        <Route
          path="/payment-methods"
          element={
            <PlaceholderPage
              moduleName="Payment Methods Catalog"
              category="Platform & Routing"
              scopeSummary="Merchant rail provisioning, interchange fee overrides, and custom scheme activation will be configurable in Batch 2."
            />
          }
        />
        <Route
          path="/hosts-routing"
          element={
            <PlaceholderPage
              moduleName="Hosts & Smart Routing"
              category="Platform & Routing"
              scopeSummary="Dynamic multi-bank failover matrices, latency balancing rules, and ISO 8583 connector health monitors are planned for Batch 2."
            />
          }
        />
        <Route
          path="/reports"
          element={
            <PlaceholderPage
              moduleName="Financial & Operational Reports"
              category="Platform & Routing"
              scopeSummary="Automated reconciliation statements, tax deduction breakdowns, and audit compliance exports will launch in Batch 2."
            />
          }
        />
        <Route
          path="/settings"
          element={
            <PlaceholderPage
              moduleName="Platform Settings"
              category="System"
              scopeSummary="Organization access control, webhook subscriptions, API signing key rotations, and IP whitelisting will be managed in Batch 2."
            />
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

