import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  Customer, Product, Order, Payment, 
  Expense, Supplier, SupplierPayment, CustomerProductRate,
  StockRecord, StockEntry, SupplierProductRate, Vehicle, Salesman, UISettings
} from "@/types";
import { 
  initialCustomers, initialProducts, initialOrders, 
  initialPayments, initialExpenses, initialSuppliers 
} from "@/data/initialData";

interface DataContextType {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  payments: Payment[];
  expenses: Expense[];
  suppliers: Supplier[];
  supplierPayments: SupplierPayment[];
  customerProductRates: CustomerProductRate[];
  stockRecords: StockRecord[];
  stockEntries: StockEntry[];
  supplierProductRates: SupplierProductRate[];
  vehicles: Vehicle[];
  salesmen: Salesman[];
  uiSettings: UISettings;
  
  addCustomer: (customer: Omit<Customer, "id">) => void;
  updateCustomer: (id: string, customerData: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductMinStock: (id: string, minStockLevel: number) => void;
  
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrder: (id: string, orderData: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  
  addPayment: (payment: Omit<Payment, "id">) => void;
  updatePayment: (id: string, paymentData: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expenseData: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  addSupplier: (supplier: Omit<Supplier, "id">) => void;
  updateSupplier: (id: string, supplierData: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  addSupplierPayment: (payment: Omit<SupplierPayment, "id">) => void;
  updateSupplierPayment: (id: string, paymentData: Partial<SupplierPayment>) => void;
  deleteSupplierPayment: (id: string) => void;
  
  addCustomerProductRate: (rate: Omit<CustomerProductRate, "id">) => void;
  updateCustomerProductRate: (id: string, rateData: Partial<CustomerProductRate>) => void;
  deleteCustomerProductRate: (id: string) => void;
  getCustomerProductRates: (customerId: string) => CustomerProductRate[];
  getProductRateForCustomer: (customerId: string, productId: string) => number;
  
  addSupplierProductRate: (rate: Omit<SupplierProductRate, "id">) => void;
  updateSupplierProductRate: (id: string, rateData: Partial<SupplierProductRate>) => void;
  deleteSupplierProductRate: (id: string) => void;
  getSupplierProductRates: (supplierId: string) => SupplierProductRate[];
  getProductRateForSupplier: (supplierId: string, productId: string) => number | null;
  getSupplierRateHistory: (supplierId: string, productId: string) => SupplierProductRate[];
  
  addStockRecord: (record: Omit<StockRecord, "id">) => void;
  updateStockRecord: (id: string, recordData: Partial<StockRecord>) => void;
  deleteStockRecord: (id: string) => void;
  
  addStockEntry: (entry: StockEntry) => void;
  updateStockEntry: (id: string, entryData: Partial<StockEntry>) => void;
  deleteStockEntry: (id: string) => void;
  
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  updateVehicle: (id: string, vehicleData: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  addSalesman: (salesman: Omit<Salesman, "id">) => void;
  updateSalesman: (id: string, salesmanData: Partial<Salesman>) => void;
  deleteSalesman: (id: string) => void;
  
  updateUISettings: (settings: Partial<UISettings>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultUISettings: UISettings = {
  theme: "light",
  accentColor: "teal",
  sidebarStyle: "default",
  sidebarColor: "default",
  tableStyle: "default"
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem("customers");
    return saved ? JSON.parse(saved) : initialCustomers;
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : initialProducts;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : initialOrders;
  });
  
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem("payments");
    return saved ? JSON.parse(saved) : initialPayments;
  });
  
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : initialExpenses;
  });
  
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem("suppliers");
    return saved ? JSON.parse(saved) : initialSuppliers;
  });
  
  const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>(() => {
    const saved = localStorage.getItem("supplierPayments");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [customerProductRates, setCustomerProductRates] = useState<CustomerProductRate[]>(() => {
    const saved = localStorage.getItem("customerProductRates");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stockRecords, setStockRecords] = useState<StockRecord[]>(() => {
    const saved = localStorage.getItem("stockRecords");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(() => {
    const saved = localStorage.getItem("stockEntries");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [supplierProductRates, setSupplierProductRates] = useState<SupplierProductRate[]>(() => {
    const saved = localStorage.getItem("supplierProductRates");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem("vehicles");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [salesmen, setSalesmen] = useState<Salesman[]>(() => {
    const saved = localStorage.getItem("salesmen");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [uiSettings, setUISettings] = useState<UISettings>(() => {
    const saved = localStorage.getItem("uiSettings");
    return saved ? JSON.parse(saved) : defaultUISettings;
  });

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);
  
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);
  
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);
  
  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);
  
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);
  
  useEffect(() => {
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
  }, [suppliers]);
  
  useEffect(() => {
    localStorage.setItem("supplierPayments", JSON.stringify(supplierPayments));
  }, [supplierPayments]);
  
  useEffect(() => {
    localStorage.setItem("customerProductRates", JSON.stringify(customerProductRates));
  }, [customerProductRates]);
  
  useEffect(() => {
    localStorage.setItem("stockRecords", JSON.stringify(stockRecords));
  }, [stockRecords]);
  
  useEffect(() => {
    localStorage.setItem("stockEntries", JSON.stringify(stockEntries));
  }, [stockEntries]);
  
  useEffect(() => {
    localStorage.setItem("supplierProductRates", JSON.stringify(supplierProductRates));
  }, [supplierProductRates]);
  
  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }, [vehicles]);
  
  useEffect(() => {
    localStorage.setItem("salesmen", JSON.stringify(salesmen));
  }, [salesmen]);
  
  useEffect(() => {
    localStorage.setItem("uiSettings", JSON.stringify(uiSettings));
  }, [uiSettings]);

  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newCustomer = {
      ...customer,
      id: `c${Date.now()}`
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === id ? { ...customer, ...customerData } : customer
      )
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: `p${Date.now()}`
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, ...productData } : product
      )
    );
  };
  
  const updateProductMinStock = (id: string, minStockLevel: number) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, minStockLevel } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = {
      ...order,
      id: `o${Date.now()}`
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrder = (id: string, orderData: Partial<Order>) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, ...orderData } : order
      )
    );
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const addPayment = (payment: Omit<Payment, "id">) => {
    const newPayment = {
      ...payment,
      id: `pay${Date.now()}`
    };
    setPayments([...payments, newPayment]);
    
    const customer = customers.find(c => c.id === payment.customerId);
    if (customer) {
      updateCustomer(customer.id, {
        outstandingBalance: customer.outstandingBalance - payment.amount,
        lastPaymentDate: payment.date,
        lastPaymentAmount: payment.amount
      });
    }
  };

  const updatePayment = (id: string, paymentData: Partial<Payment>) => {
    const oldPayment = payments.find(p => p.id === id);
    
    setPayments(
      payments.map((payment) =>
        payment.id === id ? { ...payment, ...paymentData } : payment
      )
    );
    
    if (oldPayment && paymentData.amount && oldPayment.amount !== paymentData.amount) {
      const customer = customers.find(c => c.id === oldPayment.customerId);
      if (customer) {
        const difference = paymentData.amount - oldPayment.amount;
        updateCustomer(customer.id, {
          outstandingBalance: customer.outstandingBalance - difference,
          lastPaymentAmount: paymentData.amount,
          lastPaymentDate: paymentData.date || oldPayment.date
        });
      }
    }
  };

  const deletePayment = (id: string) => {
    const payment = payments.find(p => p.id === id);
    
    if (payment) {
      const customer = customers.find(c => c.id === payment.customerId);
      if (customer) {
        updateCustomer(customer.id, {
          outstandingBalance: customer.outstandingBalance + payment.amount
        });
      }
    }
    
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: `exp${Date.now()}`
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, expenseData: Partial<Expense>) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, ...expenseData } : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const addSupplier = (supplier: Omit<Supplier, "id">) => {
    const newSupplier = {
      ...supplier,
      id: `s${Date.now()}`
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const updateSupplier = (id: string, supplierData: Partial<Supplier>) => {
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === id ? { ...supplier, ...supplierData } : supplier
      )
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  const addSupplierPayment = (payment: Omit<SupplierPayment, "id">) => {
    const newPayment = {
      ...payment,
      id: `sp${Date.now()}`
    };
    setSupplierPayments([...supplierPayments, newPayment]);
    
    const supplier = suppliers.find(s => s.id === payment.supplierId);
    if (supplier && supplier.outstandingBalance !== undefined) {
      updateSupplier(supplier.id, {
        outstandingBalance: supplier.outstandingBalance - payment.amount
      });
    }
  };

  const updateSupplierPayment = (id: string, paymentData: Partial<SupplierPayment>) => {
    const oldPayment = supplierPayments.find(p => p.id === id);
    
    setSupplierPayments(
      supplierPayments.map((payment) =>
        payment.id === id ? { ...payment, ...paymentData } : payment
      )
    );
    
    if (oldPayment && paymentData.amount && oldPayment.amount !== paymentData.amount) {
      const supplier = suppliers.find(s => s.id === oldPayment.supplierId);
      if (supplier && supplier.outstandingBalance !== undefined) {
        const difference = paymentData.amount - oldPayment.amount;
        updateSupplier(supplier.id, {
          outstandingBalance: supplier.outstandingBalance - difference
        });
      }
    }
  };

  const deleteSupplierPayment = (id: string) => {
    const payment = supplierPayments.find(p => p.id === id);
    
    if (payment) {
      const supplier = suppliers.find(s => s.id === payment.supplierId);
      if (supplier && supplier.outstandingBalance !== undefined) {
        updateSupplier(supplier.id, {
          outstandingBalance: supplier.outstandingBalance + payment.amount
        });
      }
    }
    
    setSupplierPayments(supplierPayments.filter((payment) => payment.id !== id));
  };

  const addCustomerProductRate = (rate: Omit<CustomerProductRate, "id">) => {
    const newRate = {
      ...rate,
      id: `cpr${Date.now()}`
    };
    setCustomerProductRates([...customerProductRates, newRate]);
  };

  const updateCustomerProductRate = (id: string, rateData: Partial<CustomerProductRate>) => {
    setCustomerProductRates(
      customerProductRates.map((rate) =>
        rate.id === id ? { ...rate, ...rateData } : rate
      )
    );
  };

  const deleteCustomerProductRate = (id: string) => {
    setCustomerProductRates(customerProductRates.filter((rate) => rate.id !== id));
  };
  
  const getCustomerProductRates = (customerId: string) => {
    return customerProductRates.filter(rate => rate.customerId === customerId);
  };
  
  const getProductRateForCustomer = (customerId: string, productId: string) => {
    const customRate = customerProductRates.find(
      rate => rate.customerId === customerId && rate.productId === productId
    );
    
    if (customRate) {
      return customRate.rate;
    }
    
    const product = products.find(p => p.id === productId);
    return product ? product.price : 0;
  };

  const addSupplierProductRate = (rate: Omit<SupplierProductRate, "id">) => {
    const newRate = {
      ...rate,
      id: `spr${Date.now()}`
    };
    setSupplierProductRates([...supplierProductRates, newRate]);
  };

  const updateSupplierProductRate = (id: string, rateData: Partial<SupplierProductRate>) => {
    setSupplierProductRates(
      supplierProductRates.map((rate) =>
        rate.id === id ? { ...rate, ...rateData } : rate
      )
    );
  };

  const deleteSupplierProductRate = (id: string) => {
    setSupplierProductRates(supplierProductRates.filter((rate) => rate.id !== id));
  };
  
  const getSupplierProductRates = (supplierId: string) => {
    return supplierProductRates.filter(rate => 
      rate.supplierId === supplierId && rate.isActive
    );
  };
  
  const getProductRateForSupplier = (supplierId: string, productId: string) => {
    const supplierRates = supplierProductRates
      .filter(rate => 
        rate.supplierId === supplierId && 
        rate.productId === productId && 
        rate.isActive
      )
      .sort((a, b) => 
        new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
      );
    
    if (supplierRates.length > 0) {
      return supplierRates[0].rate;
    }
    
    return null;
  };
  
  const getSupplierRateHistory = (supplierId: string, productId: string) => {
    return supplierProductRates
      .filter(rate => rate.supplierId === supplierId && rate.productId === productId)
      .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
  };

  const addStockRecord = (record: Omit<StockRecord, "id">) => {
    const newRecord = {
      ...record,
      id: `sr${Date.now()}`
    };
    setStockRecords([...stockRecords, newRecord]);
  };

  const updateStockRecord = (id: string, recordData: Partial<StockRecord>) => {
    setStockRecords(
      stockRecords.map((record) =>
        record.id === id ? { ...record, ...recordData } : record
      )
    );
  };

  const deleteStockRecord = (id: string) => {
    setStockRecords(stockRecords.filter((record) => record.id !== id));
  };
  
  const addStockEntry = (entry: StockEntry) => {
    setStockEntries([...stockEntries, entry]);
    
    entry.items.forEach(item => {
      const latestRecord = [...stockRecords]
        .filter(record => record.productId === item.productId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      if (latestRecord) {
        const closingStock = latestRecord.closingStock + item.quantity;
        addStockRecord({
          date: entry.date,
          productId: item.productId,
          openingStock: latestRecord.closingStock,
          received: item.quantity,
          dispatched: 0,
          closingStock: closingStock,
          minStockLevel: latestRecord.minStockLevel
        });
      } else {
        addStockRecord({
          date: entry.date,
          productId: item.productId,
          openingStock: 0,
          received: item.quantity,
          dispatched: 0,
          closingStock: item.quantity
        });
      }
    });
    
    const supplier = suppliers.find(s => s.id === entry.supplierId);
    if (supplier) {
      const newBalance = (supplier.outstandingBalance || 0) + entry.totalAmount;
      updateSupplier(supplier.id, {
        outstandingBalance: newBalance
      });
    }
  };

  const updateStockEntry = (id: string, entryData: Partial<StockEntry>) => {
    setStockEntries(
      stockEntries.map((entry) =>
        entry.id === id ? { ...entry, ...entryData } : entry
      )
    );
  };

  const deleteStockEntry = (id: string) => {
    setStockEntries(stockEntries.filter((entry) => entry.id !== id));
  };

  const addVehicle = (vehicle: Omit<Vehicle, "id">) => {
    const newVehicle = {
      ...vehicle,
      id: `v${Date.now()}`
    };
    setVehicles([...vehicles, newVehicle]);
  };
  
  const updateVehicle = (id: string, vehicleData: Partial<Vehicle>) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, ...vehicleData } : vehicle
      )
    );
  };
  
  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
  };
  
  const addSalesman = (salesman: Omit<Salesman, "id">) => {
    const newSalesman = {
      ...salesman,
      id: `sm${Date.now()}`
    };
    setSalesmen([...salesmen, newSalesman]);
  };
  
  const updateSalesman = (id: string, salesmanData: Partial<Salesman>) => {
    setSalesmen(
      salesmen.map((salesman) =>
        salesman.id === id ? { ...salesman, ...salesmanData } : salesman
      )
    );
  };
  
  const deleteSalesman = (id: string) => {
    setSalesmen(salesmen.filter((salesman) => salesman.id !== id));
  };
  
  const updateUISettings = (settings: Partial<UISettings>) => {
    setUISettings({
      ...uiSettings,
      ...settings
    });
  };

  const value = {
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

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
