
import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "./components/Layout";
import { DataProvider } from "./contexts/DataContext";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { LoadingSpinner } from "./components/LoadingSpinner";

// Eagerly load Index page for better initial load experience
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all other pages
const OrderEntry = lazy(() => import("./pages/OrderEntry"));
const Customers = lazy(() => import("./pages/Customers"));
const CustomerDirectory = lazy(() => import("./pages/CustomerDirectory"));
const Payments = lazy(() => import("./pages/Payments"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Reports = lazy(() => import("./pages/Reports"));
const TrackSheet = lazy(() => import("./pages/TrackSheet"));
const InvoiceGenerator = lazy(() => import("./pages/InvoiceGenerator"));
const CustomerRates = lazy(() => import("./pages/CustomerRates"));
const ProductRates = lazy(() => import("./pages/ProductRates"));
const BulkRates = lazy(() => import("./pages/BulkRates"));
const SupplierPayments = lazy(() => import("./pages/SupplierPayments"));
const StockManagement = lazy(() => import("./pages/StockManagement"));
const CustomerLedgerReport = lazy(() => import("./pages/CustomerLedgerReport"));
const Master = lazy(() => import("./pages/Master"));
const Products = lazy(() => import("./pages/Products"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const SupplierLedger = lazy(() => import("./pages/SupplierLedger"));
const PurchaseHistory = lazy(() => import("./pages/PurchaseHistory"));
const StockSettings = lazy(() => import("./pages/StockSettings"));
const ProductCategories = lazy(() => import("./pages/ProductCategories"));
const OutstandingAmounts = lazy(() => import("./pages/OutstandingAmounts"));
const CustomerStatement = lazy(() => import("./pages/CustomerStatement"));
const FinancialYear = lazy(() => import("./pages/FinancialYear"));
const UserAccess = lazy(() => import("./pages/UserAccess"));
const Communication = lazy(() => import("./pages/Communication"));
const Settings = lazy(() => import("./pages/Settings"));
const SupplierRates = lazy(() => import("./pages/SupplierRates"));

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
            
            {/* All other routes are lazy loaded with suspense */}
            <Route path="order-entry" element={
              <Suspense fallback={<LoadingSpinner />}>
                <OrderEntry />
              </Suspense>
            } />
            <Route path="customers" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Customers />
              </Suspense>
            } />
            <Route path="customer-directory" element={
              <Suspense fallback={<LoadingSpinner />}>
                <CustomerDirectory />
              </Suspense>
            } />
            <Route path="payments" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Payments />
              </Suspense>
            } />
            <Route path="expenses" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Expenses />
              </Suspense>
            } />
            <Route path="reports" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Reports />
              </Suspense>
            } />
            <Route path="track-sheet" element={
              <Suspense fallback={<LoadingSpinner />}>
                <TrackSheet />
              </Suspense>
            } />
            <Route path="invoice-generator" element={
              <Suspense fallback={<LoadingSpinner />}>
                <InvoiceGenerator />
              </Suspense>
            } />
            <Route path="customer-rates" element={
              <Suspense fallback={<LoadingSpinner />}>
                <CustomerRates />
              </Suspense>
            } />
            <Route path="product-rates" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProductRates />
              </Suspense>
            } />
            <Route path="bulk-rates" element={
              <Suspense fallback={<LoadingSpinner />}>
                <BulkRates />
              </Suspense>
            } />
            <Route path="supplier-payments" element={
              <Suspense fallback={<LoadingSpinner />}>
                <SupplierPayments />
              </Suspense>
            } />
            <Route path="stock-management" element={
              <Suspense fallback={<LoadingSpinner />}>
                <StockManagement />
              </Suspense>
            } />
            <Route path="customer-ledger" element={
              <Suspense fallback={<LoadingSpinner />}>
                <CustomerLedgerReport />
              </Suspense>
            } />
            <Route path="master" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Master />
              </Suspense>
            } />
            <Route path="products" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Products />
              </Suspense>
            } />
            <Route path="suppliers" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Suppliers />
              </Suspense>
            } />
            <Route path="supplier-rates" element={
              <Suspense fallback={<LoadingSpinner />}>
                <SupplierRates />
              </Suspense>
            } />
            <Route path="supplier-ledger" element={
              <Suspense fallback={<LoadingSpinner />}>
                <SupplierLedger />
              </Suspense>
            } />
            <Route path="purchase-history" element={
              <Suspense fallback={<LoadingSpinner />}>
                <PurchaseHistory />
              </Suspense>
            } />
            <Route path="stock-settings" element={
              <Suspense fallback={<LoadingSpinner />}>
                <StockSettings />
              </Suspense>
            } />
            <Route path="product-categories" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProductCategories />
              </Suspense>
            } />
            <Route path="outstanding" element={
              <Suspense fallback={<LoadingSpinner />}>
                <OutstandingAmounts />
              </Suspense>
            } />
            <Route path="customer-statement/:customerId" element={
              <Suspense fallback={<LoadingSpinner />}>
                <CustomerStatement />
              </Suspense>
            } />
            <Route path="financial-year" element={
              <Suspense fallback={<LoadingSpinner />}>
                <FinancialYear />
              </Suspense>
            } />
            <Route path="user-access" element={
              <Suspense fallback={<LoadingSpinner />}>
                <UserAccess />
              </Suspense>
            } />
            <Route path="communication" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Communication />
              </Suspense>
            } />
            <Route path="settings" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Settings />
              </Suspense>
            } />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
