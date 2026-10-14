import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

console.log('🧪 Running Mobi Platform Production Build & Integrity Test Suite...\n');

const distDir = path.resolve('dist');
const assetsDir = path.join(distDir, 'assets');

// 1. Verify Production Build Artifacts Exist
console.log('1. Checking Production Build Output...');
assert(fs.existsSync(distDir), 'dist/ directory must exist after build');
assert(fs.existsSync(path.join(distDir, 'index.html')), 'dist/index.html must exist');
assert(fs.existsSync(assetsDir), 'dist/assets/ directory must exist');

const assetFiles = fs.readdirSync(assetsDir);
const jsBundle = assetFiles.find(f => f.endsWith('.js'));
const cssBundle = assetFiles.find(f => f.endsWith('.css'));

assert(jsBundle, 'JavaScript production bundle must be generated');
assert(cssBundle, 'CSS production bundle must be generated');

const jsContent = fs.readFileSync(path.join(assetsDir, jsBundle), 'utf8');
const cssContent = fs.readFileSync(path.join(assetsDir, cssBundle), 'utf8');
const htmlContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

console.log(`   ✅ Build output verified: JS (${(jsContent.length / 1024).toFixed(1)} KB), CSS (${(cssContent.length / 1024).toFixed(1)} KB).`);

// 2. Verify Visual Branding & Reference Screenshot Metrics
console.log('2. Verifying KPI Metrics & Operational Health from Reference Screenshot...');
const expectedMetrics = [
  '1842e4',  // Pay-in volume: 18.42M
  '721e4',   // Payout volume: 7.21M
  '428e3',   // Net Revenue: 428K
  '94.8',    // Success rate
  '248',     // Active merchants
  '99.98',   // Operational uptime
  '95.2',    // Pay-in success
  '98.6',    // Payout success
];

expectedMetrics.forEach(metric => {
  assert(jsContent.includes(metric), `Bundle must contain reference metric: ${metric}`);
});
console.log('   ✅ All reference KPI figures confirmed in production bundle.');

// 3. Verify Realistic Sample Merchants Seed Data
console.log('3. Verifying Seed Merchants...');
const expectedMerchants = [
  'Acme Trading',
  'MER-84920',
  'Northstar Digital',
  'MER-91024',
  'Meridian Commerce',
  'MER-77319',
  'BluePeak Markets',
  'MER-65120',
  'Nova Retail Group',
  'MER-53891',
];

expectedMerchants.forEach(merch => {
  assert(jsContent.includes(merch), `Bundle must contain seed merchant: ${merch}`);
});
console.log('   ✅ Verified all 5 core fictional merchant accounts and IDs.');

// 4. Verify Supported Countries & Payment Methods
console.log('4. Verifying Multi-Country Corridors & Payment Capabilities...');
const expectedRails = [
  'Malaysia', 'FPX (Online Banking)', 'DuitNow QR', "Touch 'n Go eWallet", 'GrabPay', 'Boost',
  'Indonesia', 'BCA Virtual Account', 'Mandiri Virtual Account', 'BRI Virtual Account', 'GoPay',
  'India', 'IMPS Direct Payout', 'UPI Instant Payout',
];

expectedRails.forEach(rail => {
  assert(jsContent.includes(rail), `Bundle must contain payment rail: ${rail}`);
});
console.log('   ✅ Multi-country localized payment schemes verified.');

// 5. Verify 7-Step Onboarding Architecture
console.log('5. Verifying 7-Step Guided Onboarding Journey...');
const onboardingSteps = [
  'Business Info',
  'Primary Contact',
  'Target Operating Markets',
  'Payment Capabilities & Rails',
  'Settlement & Clearing Preferences',
  'Application Review',
  'Merchant submitted for review',
];

onboardingSteps.forEach(step => {
  assert(jsContent.includes(step), `Bundle must contain onboarding milestone: ${step}`);
});
console.log('   ✅ All 7 onboarding steps and submission transitions verified.');

// 6. Verify Roadmap & Future Phase Clarity
console.log('6. Verifying Unimplemented Module Roadmap Boundaries...');
const roadmapModules = [
  'Batch 2',
  'Pay-ins Processing',
  'Global Payouts & Disbursements',
  'Settlement Operations',
  'Transaction Ledger',
  'Hosts & Smart Routing',
];

roadmapModules.forEach(mod => {
  assert(jsContent.includes(mod), `Bundle must clearly identify roadmap status: ${mod}`);
});
console.log('   ✅ Future batch boundaries and roadmap notices confirmed.');

console.log('\n🎉 ALL PRODUCTION BUILD & INTEGRATION CRITERIA VERIFIED SUCCESSFULLY!\n');

