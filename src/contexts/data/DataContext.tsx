
import { createContext, useContext, ReactNode } from "react";
import { DataContextType } from './types';
import { useCustomerState } from './useCustomerState';
import { useProductState } from './useProductState';
import { useOrderState } from './useOrderState';
import { usePaymentState } from './usePaymentState';
import { useExpenseState } from './useExpenseState';
import { useSupplierState } from './useSupplierState';
import { useProductRateState } from './useProductRateState';
import { useStockState } from './useStockState';
import { useVehicleSalesmanState } from './useVehicleSalesmanState';
import { useUISettingsState } from './useUISettingsState';

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize all state hooks
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomerState();
  const { products, addProduct, updateProduct, deleteProduct, updateProductMinStock } = useProductState();
  const { orders, addOrder, updateOrder, deleteOrder } = useOrderState();
  const { payments, addPayment, updatePayment, deletePayment } = usePaymentState(customers, updateCustomer);
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenseState();
  
  const { 
    suppliers, 
    supplierPayments, 
    addSupplier, 
    updateSupplier, 
    deleteSupplier, 
    addSupplierPayment, 
    updateSupplierPayment, 
    deleteSupplierPayment 
  } = useSupplierState();
  
  const {
    customerProductRates,
    supplierProductRates, 
    addCustomerProductRate, 
    updateCustomerProductRate, 
    deleteCustomerProductRate,
    getCustomerProductRates,
    getProductRateForCustomer,
    addSupplierProductRate,
    updateSupplierProductRate,
    deleteSupplierProductRate,
    getSupplierProductRates,
    getProductRateForSupplier,
    getSupplierRateHistory
  } = useProductRateState(products);
  
  const {
    stockRecords,
    stockEntries,
    addStockRecord,
    updateStockRecord,
    deleteStockRecord,
    addStockEntry,
    updateStockEntry,
    deleteStockEntry
  } = useStockState(updateSupplier);
  
  const {
    vehicles,
    salesmen,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addSalesman,
    updateSalesman,
    deleteSalesman
  } = useVehicleSalesmanState();
  
  const { uiSettings, updateUISettings } = useUISettingsState();

  const contextValue: DataContextType = {
    customers,
    products,
    orders,
    payments,
    expenses,
    suppliers,
    supplierPayments,
    customerProductRates,
    stockRecords,
    stockEntries,
    supplierProductRates,
    vehicles,
    salesmen,
    uiSettings,
    
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductMinStock,
    
    addOrder,
    updateOrder,
    deleteOrder,
    
    addPayment,
    updatePayment,
    deletePayment,
    
    addExpense,
    updateExpense,
    deleteExpense,
    
    addSupplier,
    updateSupplier,
    deleteSupplier,
    
    addSupplierPayment,
    updateSupplierPayment,
    deleteSupplierPayment,
    
    addCustomerProductRate,
    updateCustomerProductRate,
    deleteCustomerProductRate,
    getCustomerProductRates,
    getProductRateForCustomer,
    
    addSupplierProductRate,
    updateSupplierProductRate,
    deleteSupplierProductRate,
    getSupplierProductRates,
    getProductRateForSupplier,
    getSupplierRateHistory,
    
    addStockRecord,
    updateStockRecord,
    deleteStockRecord,
    
    addStockEntry,
    updateStockEntry,
    deleteStockEntry,
    
    addVehicle,
    updateVehicle,
    deleteVehicle,
    
    addSalesman,
    updateSalesman,
    deleteSalesman,
    
    updateUISettings
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
