
import { createContext, useContext, useState, useEffect } from "react";
import { initialData } from "@/data/initialData";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { 
  Customer, 
  Product, 
  Order, 
  Payment, 
  Expense, 
  Supplier, 
  StockRecord,
  StockEntry,
  Vehicle,
  Salesman,
  UISettings,
  Area
} from "@/types";

interface DataContextType {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  payments: Payment[];
  expenses: Expense[];
  suppliers: Supplier[];
  stockRecords: StockRecord[];
  stockEntries: StockEntry[];
  vehicles: Vehicle[];
  salesmen: Salesman[];
  areas: Area[];
  uiSettings: UISettings;
  
  // Customer operations
  addCustomer: (customer: Omit<Customer, "id">) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Product operations
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Order operations
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  
  // Payment operations
  addPayment: (payment: Omit<Payment, "id">) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  
  // Expense operations
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Supplier operations
  addSupplier: (supplier: Omit<Supplier, "id">) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Stock operations
  addStockRecord: (stockRecord: Omit<StockRecord, "id">) => void;
  updateStockRecord: (id: string, stockRecord: Partial<StockRecord>) => void;
  deleteStockRecord: (id: string) => void;
  
  // Stock Entry operations
  addStockEntry: (stockEntry: Omit<StockEntry, "id">) => void;
  updateStockEntry: (id: string, stockEntry: Partial<StockEntry>) => void;
  deleteStockEntry: (id: string) => void;
  
  // Vehicle operations
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  // Salesman operations
  addSalesman: (salesman: Omit<Salesman, "id">) => void;
  updateSalesman: (id: string, salesman: Partial<Salesman>) => void;
  deleteSalesman: (id: string) => void;
  
  // Area operations
  addArea: (area: Omit<Area, "id">) => void;
  updateArea: (id: string, area: Partial<Area>) => void;
  deleteArea: (id: string) => void;
  
  // UI Settings operations
  updateUISettings: (settings: Partial<UISettings>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage or default data
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const savedCustomers = localStorage.getItem("customers");
    return savedCustomers ? JSON.parse(savedCustomers) : initialData.customers;
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : initialData.products;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : initialData.orders;
  });
  
  const [payments, setPayments] = useState<Payment[]>(() => {
    const savedPayments = localStorage.getItem("payments");
    return savedPayments ? JSON.parse(savedPayments) : initialData.payments;
  });
  
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : initialData.expenses;
  });
  
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    return savedSuppliers ? JSON.parse(savedSuppliers) : initialData.suppliers;
  });
  
  const [stockRecords, setStockRecords] = useState<StockRecord[]>(() => {
    const savedStockRecords = localStorage.getItem("stockRecords");
    return savedStockRecords ? JSON.parse(savedStockRecords) : initialData.stockRecords;
  });
  
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(() => {
    const savedStockEntries = localStorage.getItem("stockEntries");
    return savedStockEntries ? JSON.parse(savedStockEntries) : initialData.stockEntries;
  });
  
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const savedVehicles = localStorage.getItem("vehicles");
    return savedVehicles ? JSON.parse(savedVehicles) : initialData.vehicles || [];
  });
  
  const [salesmen, setSalesmen] = useState<Salesman[]>(() => {
    const savedSalesmen = localStorage.getItem("salesmen");
    return savedSalesmen ? JSON.parse(savedSalesmen) : initialData.salesmen || [];
  });
  
  const [areas, setAreas] = useState<Area[]>(() => {
    const savedAreas = localStorage.getItem("areas");
    return savedAreas ? JSON.parse(savedAreas) : initialData.areas || [];
  });
  
  const [uiSettings, setUISettings] = useState<UISettings>(() => {
    const savedSettings = localStorage.getItem("uiSettings");
    return savedSettings ? JSON.parse(savedSettings) : initialData.uiSettings || {
      theme: "dark",
      accentColor: "#1cd7b6",
      sidebarStyle: "gradient",
      sidebarColor: "#3B365E",
      tableStyle: "default"
    };
  });
  
  // Save to localStorage whenever state changes
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
    localStorage.setItem("stockRecords", JSON.stringify(stockRecords));
  }, [stockRecords]);
  
  useEffect(() => {
    localStorage.setItem("stockEntries", JSON.stringify(stockEntries));
  }, [stockEntries]);
  
  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }, [vehicles]);
  
  useEffect(() => {
    localStorage.setItem("salesmen", JSON.stringify(salesmen));
  }, [salesmen]);
  
  useEffect(() => {
    localStorage.setItem("areas", JSON.stringify(areas));
  }, [areas]);
  
  useEffect(() => {
    localStorage.setItem("uiSettings", JSON.stringify(uiSettings));
  }, [uiSettings]);
  
  // CRUD operations for Customers
  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newCustomer = { ...customer, id: uuidv4() };
    setCustomers([...customers, newCustomer]);
  };
  
  const updateCustomer = (id: string, updatedFields: Partial<Customer>) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === id ? { ...customer, ...updatedFields } : customer
      )
    );
  };
  
  const deleteCustomer = (id: string) => {
    // Check if customer has orders
    const customerOrders = orders.filter(order => 
      order.items.some(item => item.customerId === id)
    );
    
    if (customerOrders.length > 0) {
      toast.error("Cannot delete customer that has orders");
      return;
    }
    
    // Check if customer has payments
    const customerPayments = payments.filter(payment => payment.customerId === id);
    if (customerPayments.length > 0) {
      toast.error("Cannot delete customer that has payments");
      return;
    }
    
    setCustomers(customers.filter((customer) => customer.id !== id));
  };
  
  // CRUD operations for Products
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: uuidv4() };
    setProducts([...products, newProduct]);
  };
  
  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, ...updatedFields } : product
      )
    );
  };
  
  const deleteProduct = (id: string) => {
    // Check if product is referenced in orders
    const productInOrders = orders.some(order => 
      order.items.some(item => item.productId === id)
    );
    
    if (productInOrders) {
      toast.error("Cannot delete product that is used in orders");
      return;
    }
    
    // Check if product is referenced in stock records
    const productInStock = stockRecords.some(record => record.productId === id);
    if (productInStock) {
      toast.error("Cannot delete product that has stock records");
      return;
    }
    
    setProducts(products.filter((product) => product.id !== id));
  };
  
  // CRUD operations for Orders
  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = { ...order, id: uuidv4() };
    
    // Update customer balances based on order items
    const newCustomerBalances: Record<string, number> = {};
    
    newOrder.items.forEach(item => {
      const { customerId, productId, quantity } = item;
      const product = products.find(p => p.id === productId);
      
      if (product) {
        const amount = quantity * product.price;
        
        if (!newCustomerBalances[customerId]) {
          newCustomerBalances[customerId] = 0;
        }
        
        newCustomerBalances[customerId] += amount;
      }
    });
    
    // Update customer outstanding balances
    const updatedCustomers = customers.map(customer => {
      if (newCustomerBalances[customer.id]) {
        return {
          ...customer,
          outstandingBalance: customer.outstandingBalance + newCustomerBalances[customer.id]
        };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
    setOrders([...orders, newOrder]);
  };
  
  const updateOrder = (id: string, updatedFields: Partial<Order>) => {
    // Complex logic needed if updating items to adjust customer balances
    // For simplicity, just update the order for now
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, ...updatedFields } : order
      )
    );
  };
  
  const deleteOrder = (id: string) => {
    const orderToDelete = orders.find(order => order.id === id);
    
    if (orderToDelete) {
      // Adjust customer balances
      const customerBalanceChanges: Record<string, number> = {};
      
      orderToDelete.items.forEach(item => {
        const { customerId, productId, quantity } = item;
        const product = products.find(p => p.id === productId);
        
        if (product) {
          const amount = quantity * product.price;
          
          if (!customerBalanceChanges[customerId]) {
            customerBalanceChanges[customerId] = 0;
          }
          
          customerBalanceChanges[customerId] -= amount; // Negative because we're removing the charge
        }
      });
      
      // Update customer outstanding balances
      const updatedCustomers = customers.map(customer => {
        if (customerBalanceChanges[customer.id]) {
          return {
            ...customer,
            outstandingBalance: Math.max(0, customer.outstandingBalance + customerBalanceChanges[customer.id])
          };
        }
        return customer;
      });
      
      setCustomers(updatedCustomers);
    }
    
    setOrders(orders.filter((order) => order.id !== id));
  };
  
  // CRUD operations for Payments
  const addPayment = (payment: Omit<Payment, "id">) => {
    const newPayment = { ...payment, id: uuidv4() };
    
    // Update customer balance and payment info
    const updatedCustomers = customers.map(customer => {
      if (customer.id === payment.customerId) {
        return {
          ...customer,
          outstandingBalance: Math.max(0, customer.outstandingBalance - payment.amount),
          lastPaymentAmount: payment.amount,
          lastPaymentDate: payment.date
        };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
    setPayments([...payments, newPayment]);
  };
  
  const updatePayment = (id: string, updatedFields: Partial<Payment>) => {
    const oldPayment = payments.find(p => p.id === id);
    
    if (oldPayment && (updatedFields.amount !== undefined || updatedFields.customerId !== undefined)) {
      // Handle payment amount change or customer change (more complex)
      // For simplicity, just update the payment for now
      toast.warning("Changing payment amount or customer requires manual balance adjustment");
    }
    
    setPayments(
      payments.map((payment) =>
        payment.id === id ? { ...payment, ...updatedFields } : payment
      )
    );
  };
  
  const deletePayment = (id: string) => {
    const paymentToDelete = payments.find(payment => payment.id === id);
    
    if (paymentToDelete) {
      // Adjust customer balance
      const updatedCustomers = customers.map(customer => {
        if (customer.id === paymentToDelete.customerId) {
          return {
            ...customer,
            outstandingBalance: customer.outstandingBalance + paymentToDelete.amount
          };
        }
        return customer;
      });
      
      setCustomers(updatedCustomers);
    }
    
    setPayments(payments.filter((payment) => payment.id !== id));
  };
  
  // CRUD operations for Expenses
  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: uuidv4() };
    setExpenses([...expenses, newExpense]);
  };
  
  const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedFields } : expense
      )
    );
  };
  
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };
  
  // CRUD operations for Suppliers
  const addSupplier = (supplier: Omit<Supplier, "id">) => {
    const newSupplier = { ...supplier, id: uuidv4() };
    setSuppliers([...suppliers, newSupplier]);
  };
  
  const updateSupplier = (id: string, updatedFields: Partial<Supplier>) => {
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === id ? { ...supplier, ...updatedFields } : supplier
      )
    );
  };
  
  const deleteSupplier = (id: string) => {
    // Check if supplier is referenced in stock entries
    const supplierInStockEntries = stockEntries.some(entry => entry.supplierId === id);
    
    if (supplierInStockEntries) {
      toast.error("Cannot delete supplier that is used in stock entries");
      return;
    }
    
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };
  
  // CRUD operations for Stock Records
  const addStockRecord = (stockRecord: Omit<StockRecord, "id">) => {
    const newStockRecord = { ...stockRecord, id: uuidv4() };
    setStockRecords([...stockRecords, newStockRecord]);
  };
  
  const updateStockRecord = (id: string, updatedFields: Partial<StockRecord>) => {
    setStockRecords(
      stockRecords.map((record) =>
        record.id === id ? { ...record, ...updatedFields } : record
      )
    );
  };
  
  const deleteStockRecord = (id: string) => {
    setStockRecords(stockRecords.filter((record) => record.id !== id));
  };
  
  // CRUD operations for Stock Entries
  const addStockEntry = (stockEntry: Omit<StockEntry, "id">) => {
    const newStockEntry = { ...stockEntry, id: uuidv4() };
    
    // Update stock records for each product in the entry
    stockEntry.items.forEach(item => {
      const { productId, quantity } = item;
      
      // Find most recent stock record for this product
      const latestRecord = [...stockRecords]
        .filter(record => record.productId === productId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      if (latestRecord) {
        // Create new stock record
        const newRecord: Omit<StockRecord, "id"> = {
          date: stockEntry.date,
          productId,
          openingStock: latestRecord.closingStock,
          received: quantity,
          dispatched: 0,
          closingStock: latestRecord.closingStock + quantity,
          supplierId: stockEntry.supplierId,
          minStockLevel: latestRecord.minStockLevel
        };
        
        addStockRecord(newRecord);
      } else {
        // No previous record, create first one
        const newRecord: Omit<StockRecord, "id"> = {
          date: stockEntry.date,
          productId,
          openingStock: 0,
          received: quantity,
          dispatched: 0,
          closingStock: quantity,
          supplierId: stockEntry.supplierId
        };
        
        addStockRecord(newRecord);
      }
    });
    
    setStockEntries([...stockEntries, newStockEntry]);
  };
  
  const updateStockEntry = (id: string, updatedFields: Partial<StockEntry>) => {
    // Updating stock entries is complex as it would need to update stock records too
    // For simplicity, just update the entry for now
    setStockEntries(
      stockEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updatedFields } : entry
      )
    );
  };
  
  const deleteStockEntry = (id: string) => {
    // Deleting stock entries is complex as it would need to update stock records too
    // For simplicity, just delete the entry but warn user
    toast.warning("Deleting stock entry does not adjust inventory records");
    setStockEntries(stockEntries.filter((entry) => entry.id !== id));
  };
  
  // CRUD operations for Vehicles
  const addVehicle = (vehicle: Omit<Vehicle, "id">) => {
    const newVehicle = { ...vehicle, id: uuidv4() };
    setVehicles([...vehicles, newVehicle]);
  };
  
  const updateVehicle = (id: string, updatedFields: Partial<Vehicle>) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, ...updatedFields } : vehicle
      )
    );
  };
  
  const deleteVehicle = (id: string) => {
    // Check if vehicle is referenced by any customers
    const vehicleInUse = customers.some(customer => customer.vehicleId === id);
    
    if (vehicleInUse) {
      toast.error("Cannot delete vehicle that is assigned to customers");
      return;
    }
    
    // Check if vehicle is referenced in orders
    const vehicleInOrders = orders.some(order => order.vehicleId === id);
    
    if (vehicleInOrders) {
      toast.error("Cannot delete vehicle that is used in orders");
      return;
    }
    
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
  };
  
  // CRUD operations for Salesmen
  const addSalesman = (salesman: Omit<Salesman, "id">) => {
    const newSalesman = { ...salesman, id: uuidv4() };
    setSalesmen([...salesmen, newSalesman]);
  };
  
  const updateSalesman = (id: string, updatedFields: Partial<Salesman>) => {
    setSalesmen(
      salesmen.map((salesman) =>
        salesman.id === id ? { ...salesman, ...updatedFields } : salesman
      )
    );
  };
  
  const deleteSalesman = (id: string) => {
    // Check if salesman is referenced by any customers
    const salesmanInUse = customers.some(customer => customer.salesmanId === id);
    
    if (salesmanInUse) {
      toast.error("Cannot delete salesman that is assigned to customers");
      return;
    }
    
    // Check if salesman is referenced in orders
    const salesmanInOrders = orders.some(order => order.salesmanId === id);
    
    if (salesmanInOrders) {
      toast.error("Cannot delete salesman that is used in orders");
      return;
    }
    
    setSalesmen(salesmen.filter((salesman) => salesman.id !== id));
  };
  
  // CRUD operations for Areas
  const addArea = (area: Omit<Area, "id">) => {
    const newArea = { ...area, id: uuidv4() };
    setAreas([...areas, newArea]);
  };
  
  const updateArea = (id: string, updatedFields: Partial<Area>) => {
    const oldArea = areas.find(a => a.id === id);
    const updatedArea = { ...oldArea, ...updatedFields };
    
    setAreas(
      areas.map((area) =>
        area.id === id ? updatedArea : area
      )
    );
    
    // Update area name in customers if it changed
    if (oldArea && updatedFields.name && oldArea.name !== updatedFields.name) {
      setCustomers(
        customers.map(customer => 
          customer.area === oldArea.name 
            ? { ...customer, area: updatedFields.name } 
            : customer
        )
      );
    }
  };
  
  const deleteArea = (id: string) => {
    const areaToDelete = areas.find(area => area.id === id);
    
    if (areaToDelete) {
      // Check if area is used by customers
      const areaInUse = customers.some(customer => customer.area === areaToDelete.name);
      
      if (areaInUse) {
        toast.error(`Cannot delete area "${areaToDelete.name}" that is assigned to customers`);
        return;
      }
    }
    
    setAreas(areas.filter((area) => area.id !== id));
  };
  
  // UI Settings operations
  const updateUISettings = (settings: Partial<UISettings>) => {
    setUISettings({ ...uiSettings, ...settings });
  };

  // Expose all data and operations through context
  const value = {
    customers,
    products,
    orders,
    payments,
    expenses,
    suppliers,
    stockRecords,
    stockEntries,
    vehicles,
    salesmen,
    areas,
    uiSettings,
    
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
    
    addArea,
    updateArea,
    deleteArea,
    
    updateUISettings
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  
  return context;
};
