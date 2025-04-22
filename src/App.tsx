
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Customers from "./pages/Customers";
import CustomerDirectory from "./pages/CustomerDirectory";
import CustomerLedgerReport from "./pages/CustomerLedgerReport";
import CustomerRates from "./pages/CustomerRates";
import CustomerStatement from "./pages/CustomerStatement";
import Products from "./pages/Products";
import ProductRates from "./pages/ProductRates";
import ProductCategories from "./pages/ProductCategories";
import OrderEntry from "./pages/OrderEntry";
import TrackSheet from "./pages/TrackSheet";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import StockManagement from "./pages/StockManagement";
import StockSettings from "./pages/StockSettings";
import Suppliers from "./pages/Suppliers";
import SupplierRates from "./pages/SupplierRates";
import SupplierRateSetting from "./pages/SupplierRateSetting";
import SupplierLedger from "./pages/SupplierLedger";
import SupplierPayments from "./pages/SupplierPayments";
import PurchaseHistory from "./pages/PurchaseHistory";
import OutstandingAmounts from "./pages/OutstandingAmounts";
import BulkRates from "./pages/BulkRates";
import Master from "./pages/Master";
import UserAccess from "./pages/UserAccess";
import FinancialYear from "./pages/FinancialYear";
import Communication from "./pages/Communication";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import VehicleList from "./pages/VehicleList";
import SalesmanList from "./pages/SalesmanList";
import AreaList from "./pages/AreaList";
import { DataProvider } from "./contexts/DataContext";

function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          
          {/* Customer Routes */}
          <Route path="customers" element={<Customers />} />
          <Route path="customer-directory" element={<CustomerDirectory />} />
          <Route path="customer-ledger" element={<CustomerLedgerReport />} />
          <Route path="customer-rates" element={<CustomerRates />} />
          <Route path="customer-statement" element={<CustomerStatement />} />
          
          {/* Order Routes */}
          <Route path="order-entry" element={<OrderEntry />} />
          <Route path="track-sheet" element={<TrackSheet />} />
          <Route path="invoice-generator" element={<InvoiceGenerator />} />
          
          {/* Payment Routes */}
          <Route path="payments" element={<Payments />} />
          
          {/* Product Routes */}
          <Route path="products" element={<Products />} />
          <Route path="product-rates" element={<ProductRates />} />
          <Route path="product-categories" element={<ProductCategories />} />
          <Route path="bulk-rates" element={<BulkRates />} />
          
          {/* Stock Routes */}
          <Route path="stock-management" element={<StockManagement />} />
          <Route path="stock-settings" element={<StockSettings />} />
          
          {/* Supplier Routes */}
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="supplier-rates" element={<SupplierRates />} />
          <Route path="supplier-rate-setting" element={<SupplierRateSetting />} />
          <Route path="supplier-ledger" element={<SupplierLedger />} />
          <Route path="supplier-payments" element={<SupplierPayments />} />
          <Route path="purchase-history" element={<PurchaseHistory />} />
          
          {/* Logistics & Team Routes */}
          <Route path="vehicle-list" element={<VehicleList />} />
          <Route path="salesman-list" element={<SalesmanList />} />
          <Route path="area-list" element={<AreaList />} />
          
          {/* Finance Routes */}
          <Route path="expenses" element={<Expenses />} />
          <Route path="outstanding" element={<OutstandingAmounts />} />
          <Route path="reports" element={<Reports />} />
          
          {/* Settings Routes */}
          <Route path="master" element={<Master />} />
          <Route path="user-access" element={<UserAccess />} />
          <Route path="financial-year" element={<FinancialYear />} />
          <Route path="communication" element={<Communication />} />
          <Route path="settings" element={<Settings />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </DataProvider>
  );
}

export default App;
