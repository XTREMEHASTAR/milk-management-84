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
import { DataProvider } from "./contexts/DataContext";

import "./App.css";

function App() {
  return (
    <DataProvider>
      <Router>
        <Toaster position="top-right" />
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
            <Route path="supplier-ledger" element={<SupplierLedger />} />
            <Route path="purchase-history" element={<PurchaseHistory />} />
            <Route path="stock-settings" element={<StockSettings />} />
            <Route path="product-categories" element={<ProductCategories />} />
            <Route path="outstanding" element={<OutstandingAmounts />} />
            <Route path="customer-statement/:customerId" element={<CustomerStatement />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
