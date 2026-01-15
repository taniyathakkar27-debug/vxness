import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MobileTradingApp from "./pages/MobileTradingApp";
import Account from "./pages/Account";
import WalletPage from "./pages/WalletPage";
import OrderBook from "./pages/OrderBook";
import TradingPage from "./pages/TradingPage";
import CopyTradePage from "./pages/CopyTradePage";
import IBPage from "./pages/IBPage";
import ProfilePage from "./pages/ProfilePage";
import SupportPage from "./pages/SupportPage";
import InstructionsPage from "./pages/InstructionsPage";
import AdminLogin from "./pages/AdminLogin";
import AdminOverview from "./pages/AdminOverview";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminAccounts from "./pages/AdminAccounts";
import AdminAccountTypes from "./pages/AdminAccountTypes";
import AdminTransactions from "./pages/AdminTransactions";
import AdminPaymentMethods from "./pages/AdminPaymentMethods";
import AdminTradeManagement from "./pages/AdminTradeManagement";
import AdminFundManagement from "./pages/AdminFundManagement";
import AdminBankSettings from "./pages/AdminBankSettings";
import AdminIBManagement from "./pages/AdminIBManagement";
import AdminForexCharges from "./pages/AdminForexCharges";
import AdminIndianCharges from "./pages/AdminIndianCharges";
import AdminCopyTrade from "./pages/AdminCopyTrade";
import AdminPropFirm from "./pages/AdminPropFirm";
import AdminManagement from "./pages/AdminManagement";
import AdminKYC from "./pages/AdminKYC";
import AdminSupport from "./pages/AdminSupport";
import BuyChallengePage from "./pages/BuyChallengePage";
import ChallengeDashboardPage from "./pages/ChallengeDashboardPage";
import AdminPropTrading from "./pages/AdminPropTrading";
import AdminEarnings from "./pages/AdminEarnings";
import ForgotPassword from "./pages/ForgotPassword";
import AdminThemeSettings from "./pages/AdminThemeSettings";
import BrandedLogin from "./pages/BrandedLogin";
import BrandedSignup from "./pages/BrandedSignup";
import AdminEmailTemplates from "./pages/AdminEmailTemplates";
import HomePage from "./pages/HomePage";

// Get current subdomain
const getSubdomain = () => {
  const hostname = window.location.hostname;
  // Handle localhost for development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Use query param for local testing: ?subdomain=trade or ?subdomain=admin
    const params = new URLSearchParams(window.location.search);
    return params.get('subdomain') || 'www';
  }
  const parts = hostname.split('.');
  // For vxness.com or www.vxness.com -> 'www'
  // For trade.vxness.com -> 'trade'
  // For admin.vxness.com -> 'admin'
  if (parts.length >= 3) {
    return parts[0];
  }
  return 'www';
};

// Home/Landing Routes (vxness.com, www.vxness.com)
function HomeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Trading Platform Routes (trade.vxness.com)
function TradeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mobile" element={<MobileTradingApp />} />
      <Route path="/account" element={<Account />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/orders" element={<OrderBook />} />
      <Route path="/trade/:accountId" element={<TradingPage />} />
      <Route path="/copytrade" element={<CopyTradePage />} />
      <Route path="/ib" element={<IBPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/instructions" element={<InstructionsPage />} />
      <Route path="/buy-challenge" element={<BuyChallengePage />} />
      <Route path="/challenge-dashboard" element={<ChallengeDashboardPage />} />
      <Route path="/:slug/login" element={<BrandedLogin />} />
      <Route path="/:slug/signup" element={<BrandedSignup />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// Admin Routes (admin.vxness.com)
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminOverview />} />
      <Route path="/users" element={<AdminUserManagement />} />
      <Route path="/accounts" element={<AdminAccounts />} />
      <Route path="/account-types" element={<AdminAccountTypes />} />
      <Route path="/transactions" element={<AdminTransactions />} />
      <Route path="/payment-methods" element={<AdminPaymentMethods />} />
      <Route path="/trades" element={<AdminTradeManagement />} />
      <Route path="/funds" element={<AdminFundManagement />} />
      <Route path="/bank-settings" element={<AdminBankSettings />} />
      <Route path="/ib-management" element={<AdminIBManagement />} />
      <Route path="/forex-charges" element={<AdminForexCharges />} />
      <Route path="/indian-charges" element={<AdminIndianCharges />} />
      <Route path="/copy-trade" element={<AdminCopyTrade />} />
      <Route path="/prop-firm" element={<AdminPropFirm />} />
      <Route path="/admin-management" element={<AdminManagement />} />
      <Route path="/kyc" element={<AdminKYC />} />
      <Route path="/support" element={<AdminSupport />} />
      <Route path="/prop-trading" element={<AdminPropTrading />} />
      <Route path="/earnings" element={<AdminEarnings />} />
      <Route path="/theme" element={<AdminThemeSettings />} />
      <Route path="/email-templates" element={<AdminEmailTemplates />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const subdomain = getSubdomain();

  return (
    <Router>
      {subdomain === 'admin' ? (
        <AdminRoutes />
      ) : subdomain === 'trade' ? (
        <TradeRoutes />
      ) : (
        <HomeRoutes />
      )}
    </Router>
  );
}

export default App;
