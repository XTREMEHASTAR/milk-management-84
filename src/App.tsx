
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider, useData } from "./contexts/data/DataContext";
import { InvoiceProvider } from "./contexts/InvoiceContext";

// Layouts
import { Layout } from "./components/Layout";
import LoginLayout from "./components/layout/LoginLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import ProductRates from "./pages/ProductRates";
import ProductCategories from "./pages/ProductCategories";
import OrderList from "./pages/OrderList";
import ProductList from "./pages/ProductList";
import CustomerList from "./pages/CustomerList";
import PaymentList from "./pages/PaymentList";
import CustomerDetail from "./pages/CustomerDetail";
import ProductDetail from "./pages/ProductDetail";
import InvoiceCreate from "./pages/InvoiceCreate";
import PaymentCreate from "./pages/PaymentCreate";
import CompanyProfile from "./pages/CompanyProfile";
import OrderEntry from "./pages/OrderEntry";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import TrackSheet from "./pages/TrackSheet";
import InvoiceHistory from "./pages/InvoiceHistory";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import Payments from "./pages/Payments";
import Products from "./pages/Products";
import CustomerStatement from "./pages/CustomerStatement";
import Master from "./pages/Master";
import StockSettings from "./pages/StockSettings";
import Suppliers from "./pages/Suppliers";
import SupplierDirectory from "./pages/SupplierDirectory";
import UserAccess from "./pages/UserAccess";
import VehicleTracking from "./pages/VehicleTracking";
import AreaManagement from "./pages/AreaManagement";
import CustomerDirectory from "./pages/CustomerDirectory";
import Expenses from "./pages/Expenses";
import CustomerLedger from "./pages/CustomerLedger";
import SupplierLedger from "./pages/SupplierLedger";
import PurchaseHistory from "./pages/PurchaseHistory";
import SupplierPayments from "./pages/SupplierPayments";
import Outstanding from "./pages/Outstanding";
import OutstandingDues from "./pages/OutstandingDues";
import FinancialYear from "./pages/FinancialYear";
import Communication from "./pages/Communication";
import StockManagement from "./pages/StockManagement";
import BulkRates from "./pages/BulkRates";

function App() {
  const [createInvoiceFunc, setCreateInvoiceFunc] = useState<Function | null>(null);

  return (
    <AuthProvider>
      <DataProvider createInvoiceFunc={createInvoiceFunc}>
        <AppContent setCreateInvoiceFunc={setCreateInvoiceFunc} />
      </DataProvider>
    </AuthProvider>
  );
}

// Create a separate component to consume the data context
interface AppContentProps {
  setCreateInvoiceFunc: React.Dispatch<React.SetStateAction<Function | null>>;
}

function AppContent({ setCreateInvoiceFunc }: AppContentProps) {
  const dataContext = useData();
  
  return (
    <InvoiceProvider 
      products={dataContext.products} 
      customers={dataContext.customers}
      orders={dataContext.orders}
    >
      <Router>
        <Routes>
          <Route path="/login" element={
            <LoginLayout>
              <Login />
            </LoginLayout>
          } />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Dashboard and Main Routes */}
              <Route index element={<Index />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Order Management */}
              <Route path="order-entry" element={<OrderEntry />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="track-sheet" element={<TrackSheet />} />
              <Route path="vehicle-tracking" element={<VehicleTracking />} />
              <Route path="area-management" element={<AreaManagement />} />
              
              {/* Invoice Management */}
              <Route path="invoice-generator" element={<InvoiceGenerator />} />
              <Route path="invoice-history" element={<InvoiceHistory />} />
              <Route path="invoice-create" element={<InvoiceCreate />} />
              <Route path="invoice-list" element={<InvoiceHistory />} />
              
              {/* Customer Management */}
              <Route path="customers" element={<Customers />} />
              <Route path="customer-list" element={<CustomerList />} />
              <Route path="customer-directory" element={<CustomerDirectory />} />
              <Route path="customer/:id" element={<CustomerDetail />} />
              <Route path="customer/:id/statement" element={<CustomerStatement />} />
              <Route path="customer-statement" element={<CustomerStatement />} />
              <Route path="customer-ledger" element={<CustomerLedger />} />
              <Route path="customer-rates" element={<CustomerList />} />
              
              {/* Payment Management */}
              <Route path="payments" element={<Payments />} />
              <Route path="payment-list" element={<PaymentList />} />
              <Route path="payment-create" element={<PaymentCreate />} />
              <Route path="payment-history" element={<PaymentList />} />
              
              {/* Product Management */}
              <Route path="products" element={<Products />} />
              <Route path="product-list" element={<ProductList />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="product-rates" element={<ProductRates />} />
              <Route path="product-categories" element={<ProductCategories />} />
              <Route path="stock-management" element={<StockManagement />} />
              <Route path="stock-settings" element={<StockSettings />} />
              <Route path="bulk-rates" element={<BulkRates />} />
              
              {/* Supplier Management */}
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="supplier-directory" element={<SupplierDirectory />} />
              <Route path="supplier-ledger" element={<SupplierLedger />} />
              <Route path="supplier-payments" element={<SupplierPayments />} />
              <Route path="purchase-history" element={<PurchaseHistory />} />
              
              {/* Financial Management */}
              <Route path="expenses" element={<Expenses />} />
              <Route path="outstanding" element={<Outstanding />} />
              <Route path="outstanding-dues" element={<OutstandingDues />} />
              <Route path="reports" element={<Reports />} />
              <Route path="reports/sales" element={<Reports />} />
              <Route path="reports/customers" element={<Reports />} />
              
              {/* Master Module */}
              <Route path="master" element={<Master />} />
              <Route path="user-access" element={<UserAccess />} />
              <Route path="financial-year" element={<FinancialYear />} />
              <Route path="communication" element={<Communication />} />
              
              {/* Settings */}
              <Route path="settings" element={<Settings />} />
              <Route path="company-profile" element={<CompanyProfile />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </InvoiceProvider>
  );
}

export default App;
