
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import Layout from '@/components/Layout';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import CustomerDirectory from './pages/CustomerDirectory';
import OrderEntry from './pages/OrderEntry';
import Customers from './pages/Customers';
import Payments from './pages/Payments';
import TrackSheet from './pages/TrackSheet';
import Master from './pages/Master';
import StockManagement from './pages/StockManagement';
import StockSettings from './pages/StockSettings';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Products from './pages/Products';
import ProductRates from './pages/ProductRates';
import BulkRates from './pages/BulkRates';
import CustomerRates from './pages/CustomerRates';
import Expenses from './pages/Expenses';
import Suppliers from './pages/Suppliers';
import SupplierRates from './pages/SupplierRates';
import SupplierPayments from './pages/SupplierPayments';
import SupplierLedger from './pages/SupplierLedger';
import InvoiceGenerator from './pages/InvoiceGenerator';
import CustomerStatement from './pages/CustomerStatement';
import OutstandingAmounts from './pages/OutstandingAmounts';
import CustomerLedgerReport from './pages/CustomerLedgerReport';
import Communication from './pages/Communication';
import ProductCategories from './pages/ProductCategories';
import PurchaseHistory from './pages/PurchaseHistory';
import FinancialYear from './pages/FinancialYear';
import UserAccess from './pages/UserAccess';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { OfflineIndicator } from './components/OfflineIndicator';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SonnerToaster richColors position="top-right" />
        <OfflineIndicator />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="customer-directory" element={<CustomerDirectory />} />
              <Route path="order-entry" element={<OrderEntry />} />
              <Route path="customers" element={<Customers />} />
              <Route path="payments" element={<Payments />} />
              <Route path="track-sheet" element={<TrackSheet />} />
              <Route path="master" element={<Master />} />
              <Route path="stock-management" element={<StockManagement />} />
              <Route path="stock-settings" element={<StockSettings />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="products" element={<Products />} />
              <Route path="product-rates" element={<ProductRates />} />
              <Route path="bulk-rates" element={<BulkRates />} />
              <Route path="customer-rates" element={<CustomerRates />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="supplier-rates" element={<SupplierRates />} />
              <Route path="supplier-payments" element={<SupplierPayments />} />
              <Route path="supplier-ledger" element={<SupplierLedger />} />
              <Route path="invoice-generator" element={<InvoiceGenerator />} />
              <Route path="customer-statement" element={<CustomerStatement />} />
              <Route path="outstanding-amounts" element={<OutstandingAmounts />} />
              <Route path="customer-ledger-report" element={<CustomerLedgerReport />} />
              <Route path="communication" element={<Communication />} />
              <Route path="product-categories" element={<ProductCategories />} />
              <Route path="purchase-history" element={<PurchaseHistory />} />
              <Route path="financial-year" element={<FinancialYear />} />
              <Route path="user-access" element={<UserAccess />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
