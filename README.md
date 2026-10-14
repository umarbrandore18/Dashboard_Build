# Mobi — Global Payments Operations Platform

> **Integrate once. Operate globally. Manage everything from one platform.**

A unified multi-country payments operations web platform engineered for **Mobi Asia**, comparable in quality, polish, and UX architecture to enterprise payment leaders such as Stripe, Razorpay, and Adyen.

---

## 1. Executive Summary & Product Scope

Mobi provides unified payment gateway orchestration across Southeast Asia and India. This release fulfills **MVP Batch 1**, providing three core functional modules and preserving clear navigation to scheduled Batch 2 modules:

1. **Global Dashboard** — Real-time performance monitoring, multi-currency KPI cards, time-series velocity charts, regional corridor health, localized payment method mix, and actionable operational attention queues.
2. **Merchant Management** — Comprehensive merchant directory with dynamic summary metrics, search, multi-criteria filters, column sorting, pagination, row selection, and CSV export.
3. **Merchant Profile** — Commercial dossier, operating market configurations, settlement parameters, audited immutable activity timeline, edit profile modal, and **Add Country** market expansion.
4. **7-Step Merchant Onboarding Journey** — Guided multi-market onboarding with inline validation, duplicate registration blocking, safe masked settlement references, draft persistence, review summary, and submission to *Under Review*.

---

## 2. Visual System & Design Reference

- **Left Sidebar**: Dark navy (`#0A1120` / `#0F172A`) with active blue states and collapsible navigation.
- **Top Navigation Bar**: Persistent white header with context selectors for Country, Merchant, Currency, Date Range, Global Search, Operational Alerts, Help Modal, and User Profile menu.
- **Main Workspace**: Clean light-slate canvas (`#F8FAFC`).
- **Cards & Data Surfaces**: Crisp white cards with subtle borders (`#E2E8F0`) and soft shadows (`shadow-subtle`).
- **Status Indicators**:
  - **Green** (`#10B981` / `#059669`): Active, Optimal, Approved.
  - **Amber** (`#F59E0B` / `#D97706`): Under Review, Pending, Degraded.
  - **Red** (`#EF4444` / `#DC2626`): Suspended, Failed, Critical Action.
  - **Blue** (`#2563EB` / `#1D4ED8`): Primary actions, Onboarding, Real-time indicators.
  - **Purple** (`#7C3AED`): Batch 2 Roadmap indicators.

---

## 3. Technology Stack

- **Framework**: React 18 with TypeScript 5.7
- **Bundler & Dev Server**: Vite 6.0
- **Styling**: Tailwind CSS 3.4 with custom fintech palette and design tokens
- **Routing**: React Router 6.28
- **Charts**: Recharts 2.15 (Interactive Area Charts with previous-period comparison)
- **Icons**: Lucide React
- **Persistence**: Safe `localStorage` engine with in-memory fallback
- **Validation**: Strict validation with duplicate tax ID detection

---

## 4. Project Structure

```
Dashboard_Build/
├── dist/                          # Production build output
├── src/
│   ├── app/
│   │   ├── App.tsx                # App root with providers
│   │   └── routes.tsx             # Client-side route declarations
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx      # Main layout wrapper
│   │   │   ├── Sidebar.tsx        # Responsive dark navy sidebar
│   │   │   └── TopNav.tsx         # Context selectors & search bar
│   │   └── ui/
│   │       ├── Badge.tsx          # Status badges (Active, Under Review, etc.)
│   │       ├── Button.tsx         # Button with variants and loading state
│   │       ├── Card.tsx           # Card containers & headers
│   │       ├── EmptyState.tsx     # Zero-data and no-match states
│   │       ├── Input.tsx          # Accessible form input with error states
│   │       ├── Modal.tsx          # Accessible modal dialogs
│   │       ├── Select.tsx         # Dropdown select components
│   │       ├── Skeleton.tsx       # Loading shimmering placeholders
│   │       └── Tabs.tsx           # Tab bar with Batch 2 badges
│   ├── context/
│   │   ├── FilterContext.tsx      # Synchronized global filter state
│   │   └── ToastContext.tsx       # Toast notifications engine
│   ├── data/
│   │   ├── sampleData.ts          # Merchant seed data & country catalog
│   │   └── sampleMetrics.ts       # Baseline KPI figures & time-series
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── AttentionRequired.tsx
│   │   │   │   ├── CountryPerformance.tsx
│   │   │   │   ├── KpiCards.tsx
│   │   │   │   ├── OperationalHealth.tsx
│   │   │   │   ├── PaymentMethodPerformance.tsx
│   │   │   │   └── PerformanceChart.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── merchants/
│   │   │   ├── components/
│   │   │   │   ├── AddCountryModal.tsx
│   │   │   │   ├── EditMerchantModal.tsx
│   │   │   │   ├── MerchantFilters.tsx
│   │   │   │   ├── MerchantSummaryCards.tsx
│   │   │   │   └── MerchantTable.tsx
│   │   │   ├── MerchantListPage.tsx
│   │   │   └── MerchantProfilePage.tsx
│   │   ├── onboarding/
│   │   │   ├── components/
│   │   │   │   ├── Step1BusinessInfo.tsx
│   │   │   │   ├── Step2PrimaryContact.tsx
│   │   │   │   ├── Step3Countries.tsx
│   │   │   │   ├── Step4PaymentCapabilities.tsx
│   │   │   │   ├── Step5Settlement.tsx
│   │   │   │   ├── Step6Review.tsx
│   │   │   │   ├── Step7SubmitSuccess.tsx
│   │   │   │   └── StepIndicator.tsx
│   │   │   └── OnboardingPage.tsx
│   │   └── placeholder/
│   │       └── PlaceholderPage.tsx # Standard future batch roadmap view
│   ├── services/
│   │   ├── dashboardService.ts    # Dashboard metrics & time-series queries
│   │   └── merchantService.ts     # CRUD, drafts, duplicate check & storage
│   ├── types/
│   │   └── index.ts               # Complete TypeScript data contracts
│   ├── utils/
│   │   ├── cn.ts                  # ClassName merger
│   │   ├── formatters.ts          # Currencies, percentages, dates
│   │   └── storage.ts             # Safe localStorage persistence
│   ├── main.tsx                   # React DOM mount point
│   └── styles/
│       └── index.css              # Tailwind and typography base styles
├── tests/
│   └── verify.test.mjs            # Production bundle verification test
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Installation & Run Commands

### Development Server

Run with portable local toolchain or system Node:

```bash
# Option 1: Convenience script (automatically picks up Node)
./start.sh

# Option 2: Standard npm command
npm run dev
```

The application runs locally on: **`http://localhost:3000`**

### Production Build

```bash
npm run build
```

Build output is generated into the `dist/` folder.

### Verification Test Suite

```bash
npm test
```

Verifies all KPI metrics, merchants, multi-market corridors, 7-step onboarding milestones, and roadmap boundaries.

---

## 6. Key User Journeys Implemented

### Journey 1: Global Dashboard Monitoring & Triage
1. View aggregate KPI summary cards matching reference figures: **Pay-in RM 18.4M**, **Payout RM 7.2M**, **Revenue RM 428K**, **Success Rate 94.8%**, **Active Merchants 248**, **Active Rails 12**.
2. Switch chart metrics between Pay-in, Payout, Revenue, and Success Rate across **7d**, **30d**, and **90d** intervals. Toggle previous-period comparison lines.
3. Review **Operational Health** metrics (99.98% uptime, 95.2% pay-in success, 1,248 failed, 342 pending).
4. Review **Regional Market Performance** for Malaysia, Indonesia, and India. Click **"Filter View"** or **"Merchants"** to drill down into that country.
5. In **Attention Required**, click **"View Malaysia Merchants"**, **"Filter Indonesia Merchants"**, or **"View Acme Profile"** to navigate directly to relevant operational views.
6. Change top navigation selectors (Country, Merchant, Currency, Date Range) to dynamically update all views.

### Journey 2: Merchant Management Operations
1. Browse merchant directory with dynamic summary counts (**Total, Active, Onboarding, Under Review, Suspended**).
2. Filter by search query (name, trading name, ID, registration number).
3. Filter by Operating Country, Account Status, and Pipeline Stage.
4. Sort by Merchant Name, ID, Created Date, or Status.
5. Select individual rows or bulk-select all to trigger **Export Selected**.
6. Click **Export CSV** to generate a real `.csv` file download of merchant records.
7. Click any merchant row to inspect their dedicated profile.

### Journey 3: Merchant Profile & Add Country Market Expansion
1. View legal registration dossier, authorized primary contact, and operating market checklist.
2. In **Operating Markets**, view localized rails, settlement destination reference, and review status.
3. Switch to **Activity History** to review the immutable audit log of creations and updates.
4. Click **Edit Merchant** to update commercial parameters or contact details with instant persistence.
5. Click **Add Country** to provision an additional market (e.g., India or Indonesia) without creating a duplicate merchant account.
6. New market expansion is placed in **"Under Review"** status in compliance with gateway risk protocols.

### Journey 4: 7-Step Guided Merchant Onboarding
1. Click **Add Merchant** (`/merchants/new`).
2. **Step 1 (Business Info)**: Enter legal name, registration number, business type, and address. Inline duplicate checking warns and blocks identical registration numbers.
3. **Step 2 (Primary Contact)**: Provide name, corporate email, phone, and job title.
4. **Step 3 (Markets)**: Select one or more active corridors (Malaysia, Indonesia, India).
5. **Step 4 (Payment Capabilities)**: Select eligible localized payment schemes (FPX, DuitNow QR, eWallets, Virtual Accounts, Payout rails).
6. **Step 5 (Settlement)**: Set settlement currency, clearing frequency (Daily T+1, etc.), safe masked bank reference, and declaration.
7. **Step 6 (Review)**: Review complete application dossier with direct "Edit" buttons to jump to any step.
8. **Step 7 (Submission)**: Submit application. Merchant transitions to **"Under Review"** with auto-assigned ID (`MER-XXXXX`).
9. **Draft Persistence**: Click **Save Draft** at any step. If user exits, an unfinished draft banner allows one-click resumption with all entered fields preserved.

---

## 7. Roadmap & Scope Boundaries

In strict adherence to MVP Batch 1 specifications, money movement and system configuration tabs (**Pay-in, Payout, Settlement, Transactions, Refunds, Requery/Retry, Payment Methods, Hosts & Routing, Reports, Settings**) are visible in the navigation shell with **"Batch 2 Roadmap"** badges. They provide clear explanations of upcoming features rather than fabricated mock workflows.

---

## 8. Demo Notice

All data displayed within this application represents fictional simulation records for demonstration and training purposes. No real bank credentials or live funds are handled.
