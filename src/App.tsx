
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OrderEntry from "./pages/OrderEntry";
import Customers from "./pages/Customers";
import CustomerDirectory from "./pages/CustomerDirectory";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import TrackSheet from "./pages/TrackSheet";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import CustomerRates from "./pages/CustomerRates";
import ProductRates from "./pages/ProductRates";
import BulkRates from "./pages/BulkRates";
import SupplierPayments from "./pages/SupplierPayments";
import StockManagement from "./pages/StockManagement";
import CustomerLedgerReport from "./pages/CustomerLedgerReport";
import Master from "./pages/Master";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import SupplierLedger from "./pages/SupplierLedger";
import PurchaseHistory from "./pages/PurchaseHistory";
import StockSettings from "./pages/StockSettings";
import ProductCategories from "./pages/ProductCategories";
import OutstandingAmounts from "./pages/OutstandingAmounts";
import CustomerStatement from "./pages/CustomerStatement";
import FinancialYear from "./pages/FinancialYear";
import UserAccess from "./pages/UserAccess";
import Communication from "./pages/Communication";
import Settings from "./pages/Settings";
import SupplierRates from "./pages/SupplierRates";
import { DataProvider } from "./contexts/DataContext";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { useEffect } from "react";

import "./App.css";

function App() {
  // Check for storage compatibility and warn if not available
  useEffect(() => {
    const isStorageAvailable = (type: string) => {
      try {
        const storage = window[type as keyof Window];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
      } catch (e) {
        return false;
      }
    };
    
    if (!isStorageAvailable('localStorage')) {
      alert('Local storage is not available in your browser. This application requires local storage to function properly.');
    }
    
    // Apply saved theme from storage if available
    const savedTheme = localStorage.getItem('uiSettings');
    if (savedTheme) {
      try {
        const settings = JSON.parse(savedTheme);
        if (settings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.error('Error parsing theme settings', e);
      }
    }
  }, []);

  return (
    <DataProvider>
      <Router>
        <Toaster position="top-right" />
        <OfflineIndicator />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="order-entry" element={<OrderEntry />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customer-directory" element={<CustomerDirectory />} />
            <Route path="payments" element={<Payments />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="reports" element={<Reports />} />
            <Route path="track-sheet" element={<TrackSheet />} />
            <Route path="invoice-generator" element={<InvoiceGenerator />} />
            <Route path="customer-rates" element={<CustomerRates />} />
            <Route path="product-rates" element={<ProductRates />} />
            <Route path="bulk-rates" element={<BulkRates />} />
            <Route path="supplier-payments" element={<SupplierPayments />} />
            <Route path="stock-management" element={<StockManagement />} />
            <Route path="customer-ledger" element={<CustomerLedgerReport />} />
            <Route path="master" element={<Master />} />
            <Route path="products" element={<Products />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="supplier-rates" element={<SupplierRates />} />
            <Route path="supplier-ledger" element={<SupplierLedger />} />
            <Route path="purchase-history" element={<PurchaseHistory />} />
            <Route path="stock-settings" element={<StockSettings />} />
            <Route path="product-categories" element={<ProductCategories />} />
            <Route path="outstanding" element={<OutstandingAmounts />} />
            <Route path="customer-statement/:customerId" element={<CustomerStatement />} />
            <Route path="financial-year" element={<FinancialYear />} />
            <Route path="user-access" element={<UserAccess />} />
            <Route path="communication" element={<Communication />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
