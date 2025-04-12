
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  Customer, Product, Order, Payment, 
  Expense, Supplier, SupplierPayment, CustomerProductRate,
  StockRecord, StockEntry
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
  
  addStockRecord: (record: Omit<StockRecord, "id">) => void;
  updateStockRecord: (id: string, recordData: Partial<StockRecord>) => void;
  deleteStockRecord: (id: string) => void;
  
  addStockEntry: (entry: StockEntry) => void;
  updateStockEntry: (id: string, entryData: Partial<StockEntry>) => void;
  deleteStockEntry: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Load data from localStorage or use initial data
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

  // Save data to localStorage when it changes
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

  // Customer CRUD operations
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

  // Product CRUD operations
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

  // Order CRUD operations
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

  // Payment CRUD operations
  const addPayment = (payment: Omit<Payment, "id">) => {
    const newPayment = {
      ...payment,
      id: `pay${Date.now()}`
    };
    setPayments([...payments, newPayment]);
    
    // Update customer's outstanding balance
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
    
    // Update customer's outstanding balance if amount changed
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
      // Restore customer's outstanding balance
      const customer = customers.find(c => c.id === payment.customerId);
      if (customer) {
        updateCustomer(customer.id, {
          outstandingBalance: customer.outstandingBalance + payment.amount
        });
      }
    }
    
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  // Expense CRUD operations
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

  // Supplier CRUD operations
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

  // Supplier Payment CRUD operations
  const addSupplierPayment = (payment: Omit<SupplierPayment, "id">) => {
    const newPayment = {
      ...payment,
      id: `sp${Date.now()}`
    };
    setSupplierPayments([...supplierPayments, newPayment]);
    
    // Update supplier's outstanding balance if applicable
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
    
    // Update supplier's outstanding balance if amount changed
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
      // Restore supplier's outstanding balance if applicable
      const supplier = suppliers.find(s => s.id === payment.supplierId);
      if (supplier && supplier.outstandingBalance !== undefined) {
        updateSupplier(supplier.id, {
          outstandingBalance: supplier.outstandingBalance + payment.amount
        });
      }
    }
    
    setSupplierPayments(supplierPayments.filter((payment) => payment.id !== id));
  };
  
  // Customer Product Rate operations
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
    
    // Return default product price if no custom rate is set
    const product = products.find(p => p.id === productId);
    return product ? product.price : 0;
  };
  
  // Stock Record operations
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
  
  // Stock Entry operations
  const addStockEntry = (entry: StockEntry) => {
    setStockEntries([...stockEntries, entry]);
    
    // Update each product's stock received
    entry.items.forEach(item => {
      // Find the latest stock record for this product
      const latestRecord = [...stockRecords]
        .filter(record => record.productId === item.productId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      if (latestRecord) {
        // Add a new record with updated received amount
        addStockRecord({
          date: entry.date,
          productId: item.productId,
          openingStock: latestRecord.closingStock,
          received: item.quantity,
          dispatched: 0,
          minStockLevel: latestRecord.minStockLevel
        });
      } else {
        // No previous record, create a new one
        addStockRecord({
          date: entry.date,
          productId: item.productId,
          openingStock: 0,
          received: item.quantity,
          dispatched: 0
        });
      }
    });
    
    // Update supplier's outstanding balance if applicable
    const supplier = suppliers.find(s => s.id === entry.supplierId);
    if (supplier) {
      const newBalance = (supplier.outstandingBalance || 0) + entry.totalAmount;
      updateSupplier(supplier.id, {
        outstandingBalance: newBalance
      });
    }
  };

  const updateStockEntry = (id: string, entryData: Partial<StockEntry>) => {
    // This is complex as it may affect stock records
    // Simplified implementation
    setStockEntries(
      stockEntries.map((entry) =>
        entry.id === id ? { ...entry, ...entryData } : entry
      )
    );
  };

  const deleteStockEntry = (id: string) => {
    // This is complex as it may affect stock records
    // Simplified implementation
    setStockEntries(stockEntries.filter((entry) => entry.id !== id));
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
    
    addStockRecord,
    updateStockRecord,
    deleteStockRecord,
    
    addStockEntry,
    updateStockEntry,
    deleteStockEntry
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
