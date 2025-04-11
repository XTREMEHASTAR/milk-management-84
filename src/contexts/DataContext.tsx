
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  Customer, Product, Order, Payment, 
  Expense, Supplier, SupplierPayment 
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
  
  addCustomer: (customer: Omit<Customer, "id">) => void;
  updateCustomer: (id: string, customerData: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
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
  };

  const updateSupplierPayment = (id: string, paymentData: Partial<SupplierPayment>) => {
    setSupplierPayments(
      supplierPayments.map((payment) =>
        payment.id === id ? { ...payment, ...paymentData } : payment
      )
    );
  };

  const deleteSupplierPayment = (id: string) => {
    setSupplierPayments(supplierPayments.filter((payment) => payment.id !== id));
  };

  const value = {
    customers,
    products,
    orders,
    payments,
    expenses,
    suppliers,
    supplierPayments,
    
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    addProduct,
    updateProduct,
    deleteProduct,
    
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
    deleteSupplierPayment
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
