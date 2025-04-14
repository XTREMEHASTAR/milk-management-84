
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OrderEntry from "./pages/OrderEntry";
import Customers from "./pages/Customers";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import TrackSheet from "./pages/TrackSheet";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import CustomerRates from "./pages/CustomerRates";
import SupplierPayments from "./pages/SupplierPayments";
import StockManagement from "./pages/StockManagement";
import CustomerLedgerReport from "./pages/CustomerLedgerReport";
import Master from "./pages/Master";
import Products from "./pages/Products";
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
            <Route path="payments" element={<Payments />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="reports" element={<Reports />} />
            <Route path="track-sheet" element={<TrackSheet />} />
            <Route path="invoice-generator" element={<InvoiceGenerator />} />
            <Route path="customer-rates" element={<CustomerRates />} />
            <Route path="supplier-payments" element={<SupplierPayments />} />
            <Route path="stock-management" element={<StockManagement />} />
            <Route path="customer-ledger" element={<CustomerLedgerReport />} />
            <Route path="master" element={<Master />} />
            <Route path="products" element={<Products />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
