
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/data/DataContext";
import { InvoiceProvider } from "./contexts/InvoiceContext";

// Pages
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import ProductRates from "./pages/ProductRates";
import ProductCategories from "./pages/ProductCategories";

// A simple theme provider component since it's missing
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Create a simpler App structure without missing components
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InvoiceProvider>
          <DataProvider createInvoiceFunc={null}>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<ProductRates />} />
                  <Route path="product-rates" element={<ProductRates />} />
                  <Route path="product-categories" element={<ProductCategories />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Router>
            <Toaster />
          </DataProvider>
        </InvoiceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
