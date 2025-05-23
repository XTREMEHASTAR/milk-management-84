
import { Customer, Product, Order, Payment, Expense, Supplier } from "@/types";

export const initialCustomers: Customer[] = [
  {
    id: "c1",
    name: "Ganesh Apartment",
    phone: "9876543210",
    address: "123 Main St",
    outstandingBalance: 1200,
    lastPaymentDate: "2025-04-05",
    lastPaymentAmount: 2500
  },
  {
    id: "c2",
    name: "Sharma Stores",
    phone: "9876543211",
    address: "456 Market Rd",
    outstandingBalance: 950,
    lastPaymentDate: "2025-04-07",
    lastPaymentAmount: 1800
  },
  {
    id: "c3",
    name: "Patel Dairy",
    phone: "9876543212",
    address: "789 Milk Lane",
    outstandingBalance: 780,
    lastPaymentDate: "2025-04-08",
    lastPaymentAmount: 1500
  },
  {
    id: "c4",
    name: "Sunrise Cafe",
    phone: "9876543213",
    address: "101 Cafe Street",
    outstandingBalance: 450,
    lastPaymentDate: "2025-04-09",
    lastPaymentAmount: 1200
  },
  {
    id: "c5",
    name: "Green Valley School",
    phone: "9876543214",
    address: "202 Education Rd",
    outstandingBalance: 350,
    lastPaymentDate: "2025-04-10",
    lastPaymentAmount: 2000
  },
];

export const initialProducts: Product[] = [
  {
    id: "p1",
    name: "AMUL TAZZA",
    price: 52,
    description: "Pasteurized toned milk",
    unit: "Liter",
    sku: "AMUL-TZ-01",
    category: "Amul"
  },
  {
    id: "p2",
    name: "AMUL COW",
    price: 60,
    description: "Cow milk",
    unit: "Liter",
    sku: "AMUL-CW-01",
    category: "Amul"
  },
  {
    id: "p3",
    name: "AMUL A2",
    price: 70,
    description: "A2 milk",
    unit: "Liter",
    sku: "AMUL-A2-01",
    category: "Amul"
  },
  {
    id: "p4",
    name: "MAHA",
    price: 56,
    description: "Pasteurized milk",
    unit: "Liter",
    sku: "MAHA-01",
    category: "Mahananda"
  },
  {
    id: "p5",
    name: "G.COW H",
    price: 62,
    description: "Full cream milk",
    unit: "Liter",
    sku: "GOKUL-CH-01",
    category: "Gokul"
  },
  {
    id: "p6",
    name: "G.COW F",
    price: 60,
    description: "Full cream milk",
    unit: "Liter",
    sku: "GOKUL-CF-01",
    category: "Gokul"
  },
  {
    id: "p7",
    name: "G.SPL H",
    price: 65,
    description: "Special milk",
    unit: "Liter",
    sku: "GOKUL-SH-01",
    category: "Gokul"
  },
  {
    id: "p8",
    name: "G.SPL F",
    price: 63,
    description: "Special milk",
    unit: "Liter",
    sku: "GOKUL-SF-01",
    category: "Gokul"
  },
  {
    id: "p9",
    name: "G.SHAKTI",
    price: 58,
    description: "High protein milk",
    unit: "Liter",
    sku: "GOKUL-SK-01",
    category: "Gokul"
  },
  {
    id: "p10",
    name: "G.DAHI H",
    price: 72,
    description: "Curd - half kg",
    unit: "Pack",
    sku: "GOKUL-DH-01",
    category: "Curd"
  },
  {
    id: "p11",
    name: "G.DAHI F",
    price: 70,
    description: "Curd - full kg",
    unit: "Pack",
    sku: "GOKUL-DF-01",
    category: "Curd"
  },
  {
    id: "p12",
    name: "TONE H",
    price: 54,
    description: "Toned milk - half liter",
    unit: "Pack",
    sku: "TONE-H-01",
    category: "Toned Milk"
  },
  {
    id: "p13",
    name: "TONE F",
    price: 52,
    description: "Toned milk - full liter",
    unit: "Pack",
    sku: "TONE-F-01",
    category: "Toned Milk"
  },
  {
    id: "p14",
    name: "SPL H",
    price: 64,
    description: "Special milk - half liter",
    unit: "Pack",
    sku: "SPL-H-01",
    category: "Special Milk"
  },
  {
    id: "p15",
    name: "SPL F",
    price: 62,
    description: "Special milk - full liter",
    unit: "Pack",
    sku: "SPL-F-01",
    category: "Special Milk"
  },
  {
    id: "p16",
    name: "SPL J",
    price: 45,
    description: "Special milk - jar",
    unit: "Jar",
    sku: "SPL-J-01",
    category: "Special Milk"
  },
  {
    id: "p17",
    name: "AKSHARA",
    price: 58,
    description: "Akshara milk",
    unit: "Liter",
    sku: "AKSH-01",
    category: "Akshara"
  },
  {
    id: "p18",
    name: "SARTHI",
    price: 56,
    description: "Sarthi milk",
    unit: "Liter",
    sku: "SARTHI-01",
    category: "Sarthi"
  },
  {
    id: "p19",
    name: "WARNA SPL",
    price: 64,
    description: "Warna special milk",
    unit: "Liter",
    sku: "WARNA-SPL-01",
    category: "Warna"
  },
  {
    id: "p20",
    name: "WARNA COW",
    price: 60,
    description: "Warna cow milk",
    unit: "Liter",
    sku: "WARNA-COW-01",
    category: "Warna"
  },
  {
    id: "p21",
    name: "WARNA TAZZA",
    price: 52,
    description: "Warna tazza milk",
    unit: "Liter",
    sku: "WARNA-TZ-01",
    category: "Warna"
  },
  {
    id: "p22",
    name: "A. TAAK",
    price: 45,
    description: "Amul buttermilk",
    unit: "Bottle",
    sku: "AMUL-TAAK-01",
    category: "Buttermilk"
  },
  {
    id: "p23",
    name: "W.TAAK",
    price: 43,
    description: "Warna buttermilk",
    unit: "Bottle",
    sku: "WARNA-TAAK-01",
    category: "Buttermilk"
  },
  {
    id: "p24",
    name: "W.DAHI",
    price: 68,
    description: "Warna curd",
    unit: "Pack",
    sku: "WARNA-DAHI-01",
    category: "Curd"
  },
  {
    id: "p25",
    name: "100 W",
    price: 100,
    description: "100ml cream",
    unit: "Pack",
    sku: "CREAM-100-01",
    category: "Cream"
  },
  {
    id: "p26",
    name: "150 W",
    price: 150,
    description: "150ml cream",
    unit: "Pack",
    sku: "CREAM-150-01",
    category: "Cream"
  },
  {
    id: "p27",
    name: "80 A",
    price: 80,
    description: "80ml Amul cream",
    unit: "Pack",
    sku: "AMUL-CREAM-80-01",
    category: "Cream"
  },
  {
    id: "p28",
    name: "200 A",
    price: 200,
    description: "200ml Amul cream",
    unit: "Pack",
    sku: "AMUL-CREAM-200-01",
    category: "Cream"
  }
];

export const initialOrders: Order[] = [];

export const initialPayments: Payment[] = [];

export const initialExpenses: Expense[] = [];

export const initialSuppliers: Supplier[] = [
  {
    id: "s1",
    name: "Mountain Dairy Farm",
    phone: "9876543215",
    address: "Rural Route 5",
    email: "mountain@example.com"
  },
  {
    id: "s2",
    name: "Valley Milk Co-op",
    phone: "9876543216",
    address: "Co-op Road 10",
  },
];
