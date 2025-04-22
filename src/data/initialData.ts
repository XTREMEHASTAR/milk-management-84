
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
  Area,
  UISettings,
  SupplierPayment,
  CustomerProductRate,
  SupplierProductRate
} from "@/types";

interface InitialData {
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
  supplierPayments: SupplierPayment[];
  customerProductRates: CustomerProductRate[];
  supplierProductRates: SupplierProductRate[];
}

// Create mock data for initial app state
export const initialData: InitialData = {
  customers: [
    {
      id: "c1",
      name: "John Doe",
      phone: "9876543210",
      address: "123 Main St, Mumbai",
      email: "john@example.com",
      outstandingBalance: 5000,
      lastPaymentDate: "2025-04-01",
      lastPaymentAmount: 2000,
      area: "Bandra",
      vehicleId: "v1",
      salesmanId: "s1"
    },
    {
      id: "c2",
      name: "Jane Smith",
      phone: "8765432109",
      address: "456 Park Ave, Delhi",
      outstandingBalance: 3000,
      area: "Dwarka",
      vehicleId: "v2",
      salesmanId: "s2"
    }
  ],
  products: [
    {
      id: "p1",
      name: "Full Cream Milk",
      price: 60,
      description: "Farm fresh full cream milk",
      unit: "L",
      sku: "FCM-001",
      category: "Milk",
      minStockLevel: 50
    },
    {
      id: "p2",
      name: "Toned Milk",
      price: 45,
      description: "Healthy toned milk",
      unit: "L",
      sku: "TM-001",
      category: "Milk",
      minStockLevel: 80
    },
    {
      id: "p3",
      name: "Butter",
      price: 130,
      description: "Pure butter",
      unit: "pack",
      sku: "BTR-001",
      category: "Dairy Products"
    }
  ],
  orders: [
    {
      id: "o1",
      date: "2025-04-10",
      items: [
        {
          customerId: "c1",
          productId: "p1",
          quantity: 5
        },
        {
          customerId: "c1",
          productId: "p2",
          quantity: 3
        }
      ],
      vehicleId: "v1",
      salesmanId: "s1"
    }
  ],
  payments: [
    {
      id: "pm1",
      customerId: "c1",
      date: "2025-04-01",
      amount: 2000,
      paymentMethod: "cash"
    }
  ],
  expenses: [
    {
      id: "e1",
      date: "2025-04-05",
      amount: 5000,
      category: "Wages",
      description: "Weekly labor wages",
      paymentMethod: "cash"
    }
  ],
  suppliers: [
    {
      id: "sup1",
      name: "Mountain Dairy Farm",
      phone: "9876543210",
      address: "123 Farm Road, Nashik",
      email: "mountain@example.com",
      category: "Milk Supplier",
      outstandingBalance: 12000
    },
    {
      id: "sup2",
      name: "Pure Dairy Products",
      phone: "8765432109",
      address: "456 Industry Area, Pune",
      email: "pure@example.com",
      category: "Dairy Products",
      outstandingBalance: 8000
    }
  ],
  stockRecords: [
    {
      id: "sr1",
      date: "2025-04-10",
      productId: "p1",
      openingStock: 200,
      received: 100,
      dispatched: 50,
      closingStock: 250,
      supplierId: "sup1",
      minStockLevel: 50
    }
  ],
  stockEntries: [
    {
      id: "se1",
      date: "2025-04-10",
      supplierId: "sup1",
      items: [
        {
          productId: "p1",
          quantity: 100,
          rate: 45
        }
      ],
      totalAmount: 4500,
      invoiceNumber: "INV-001"
    }
  ],
  vehicles: [
    {
      id: "v1",
      name: "Vehicle 1",
      regNumber: "MH 01 AB 1234",
      type: "Van",
      driver: "Ramesh",
      capacity: 500,
      capacityUnit: "L",
      driverContact: "9876543210",
      status: "active",
      isActive: true
    },
    {
      id: "v2",
      name: "Vehicle 2",
      regNumber: "MH 01 CD 5678",
      type: "Rickshaw",
      driver: "Suresh",
      capacity: 200,
      capacityUnit: "L",
      driverContact: "8765432109",
      status: "active",
      isActive: true
    }
  ],
  salesmen: [
    {
      id: "s1",
      name: "Rajesh Kumar",
      phone: "9876543210",
      address: "123 Staff Quarters, Mumbai",
      area: "Bandra, Khar",
      joinDate: "2024-01-15",
      commission: 5,
      salaryType: "commission",
      status: "active",
      isActive: true
    },
    {
      id: "s2",
      name: "Mahesh Singh",
      phone: "8765432109",
      address: "456 Staff Quarters, Delhi",
      area: "Dwarka, Janakpuri",
      joinDate: "2024-02-10",
      salaryType: "fixed",
      salary: 15000,
      status: "active",
      isActive: true
    }
  ],
  areas: [
    {
      id: "a1",
      name: "Bandra",
      description: "Bandra West and East area",
      isActive: true
    },
    {
      id: "a2",
      name: "Dwarka",
      description: "Dwarka Sectors 1-12",
      isActive: true
    }
  ],
  uiSettings: {
    theme: "dark",
    accentColor: "#1cd7b6",
    sidebarStyle: "gradient",
    sidebarColor: "#3B365E",
    tableStyle: "default"
  },
  supplierPayments: [
    {
      id: "sp1",
      supplierId: "sup1",
      date: "2025-04-05",
      amount: 10000,
      paymentMethod: "bank",
      invoiceNumber: "INV-001"
    }
  ],
  customerProductRates: [
    {
      id: "cpr1",
      customerId: "c1",
      productId: "p1",
      rate: 58,
      effectiveDate: "2025-04-01"
    }
  ],
  supplierProductRates: [
    {
      id: "spr1",
      supplierId: "sup1",
      productId: "p1",
      rate: 45,
      effectiveDate: "2025-04-01",
      isActive: true
    }
  ]
};

// Helper functions for rate handling
export const getCustomerProductRates = (customerId: string) => {
  return initialData.customerProductRates.filter(rate => rate.customerId === customerId);
};

export const getSupplierProductRates = (supplierId: string) => {
  return initialData.supplierProductRates.filter(rate => rate.supplierId === supplierId);
};

export const getProductRateForCustomer = (customerId: string, productId: string) => {
  const rates = initialData.customerProductRates.filter(
    rate => rate.customerId === customerId && rate.productId === productId
  );
  
  if (rates.length === 0) {
    const product = initialData.products.find(p => p.id === productId);
    return product ? product.price : 0;
  }
  
  // Sort by date descending and get most recent rate
  const mostRecent = rates.sort(
    (a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
  )[0];
  
  return mostRecent.rate;
};

export const getSupplierRateHistory = (supplierId: string, productId: string) => {
  return initialData.supplierProductRates
    .filter(rate => rate.supplierId === supplierId && rate.productId === productId)
    .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
};
