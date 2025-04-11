
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
    name: "Amul Taaza",
    price: 52,
    description: "Pasteurized toned milk",
    unit: "Liter"
  },
  {
    id: "p2",
    name: "Gold Cow H",
    price: 62,
    description: "Full cream milk",
    unit: "Liter"
  },
  {
    id: "p3",
    name: "Farm Fresh",
    price: 58,
    description: "Pasteurized cow milk",
    unit: "Liter"
  },
  {
    id: "p4",
    name: "Pure Dairy",
    price: 68,
    description: "A2 milk",
    unit: "Liter"
  },
  {
    id: "p5",
    name: "Buffalo Gold",
    price: 65,
    description: "Premium buffalo milk",
    unit: "Liter"
  },
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
