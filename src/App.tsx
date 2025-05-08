
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/data/DataContext";
import { InvoiceProvider, useInvoices, createInvoiceProviderCallback } from "./contexts/InvoiceContext";

// Layout
import AppLayout from "./components/layout/AppLayout";
import LoginLayout from "./components/layout/LoginLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import OrderEntry from "./pages/OrderEntry";
import CustomerList from "./pages/CustomerList";
import ProductList from "./pages/ProductList";
import OrderList from "./pages/OrderList";
import CustomerDetail from "./pages/CustomerDetail";
import ProductDetail from "./pages/ProductDetail";
import InvoiceHistory from "./pages/InvoiceHistory";
import InvoiceCreate from "./pages/InvoiceCreate";
import InvoiceDetail from "./pages/InvoiceDetail";
import PaymentCreate from "./pages/PaymentCreate";
import PaymentList from "./pages/PaymentList";
import TrackSheet from "./pages/TrackSheet";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import CompanyProfile from "./pages/CompanyProfile";
import VehicleSalesmanCreate from "./pages/VehicleSalesmanCreate";

// Custom component to handle data flow between InvoiceContext and DataContext
const AppWithProvidersWrapper = () => {
  const [invoiceContextReady, setInvoiceContextReady] = useState(false);
  
  // Store the callback in state so it persists between renders
  const [invoiceCallback, setInvoiceCallback] = useState<Function | null>(null);
  
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* First tier of providers */}
        <DataProvider createInvoiceFunc={invoiceCallback}>
          {/* Second tier connecting the two contexts */}
          <InvoiceContextGlue setCallback={setInvoiceCallback} />
          
          {/* App routes */}
          <Router>
            <Routes>
              <Route path="/login" element={<LoginLayout children={<Login />} />} />
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="order-entry" element={<OrderEntry />} />
                <Route path="customers" element={<CustomerList />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="invoices" element={<InvoiceHistory />} />
                <Route path="invoices/create" element={<InvoiceCreate />} />
                <Route path="invoices/:id" element={<InvoiceDetail />} />
                <Route path="payments" element={<PaymentList />} />
                <Route path="payments/create" element={<PaymentCreate />} />
                <Route path="track-sheet" element={<TrackSheet />} />
                <Route path="vehicles-salesmen" element={<VehicleSalesmanCreate />} />
                <Route path="company" element={<CompanyProfile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
          
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Component to connect InvoiceContext with DataContext
const InvoiceContextGlue = ({ setCallback }: { setCallback: (callback: Function) => void }) => {
  return (
    <InvoiceProvider>
      <InvoiceCallbackHandler setCallback={setCallback} />
    </InvoiceProvider>
  );
};

// Helper component to create the callback from InvoiceContext
const InvoiceCallbackHandler = ({ setCallback }: { setCallback: (callback: Function) => void }) => {
  const invoiceContext = useInvoices();
  
  useEffect(() => {
    // Create a callback function that references the invoice context
    const callback = (orderId: string) => {
      return invoiceContext.createInvoiceFromOrder(orderId);
    };
    
    // Set this callback to be used by DataProvider
    setCallback(callback);
  }, [invoiceContext, setCallback]);
  
  return null; // This component doesn't render anything
};

function App() {
  return <AppWithProvidersWrapper />;
}

export default App;
