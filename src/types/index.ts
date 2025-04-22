
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  outstandingBalance: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  area?: string;
  vehicleId?: string;
  salesmanId?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  unit: string;
  sku: string;
  category: string;
  minStockLevel?: number;
}

export interface OrderItem {
  customerId: string;
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  vehicleId?: string;
  salesmanId?: string;
}

export interface Payment {
  id: string;
  customerId: string;
  date: string;
  amount: number;
  paymentMethod: "cash" | "bank" | "upi" | "other";
  notes?: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: "cash" | "bank" | "upi" | "other";
}

export interface SupplierPayment {
  id: string;
  supplierId: string;
  date: string;
  amount: number;
  paymentMethod: "cash" | "bank" | "upi" | "other";
  invoiceNumber?: string;
  notes?: string;
  billImageUrl?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  category?: string;
  outstandingBalance?: number;
}

export interface CustomerProductRate {
  id: string;
  customerId: string;
  productId: string;
  rate: number;
  effectiveDate: string;
}

export interface SupplierProductRate {
  id: string;
  supplierId: string;
  productId: string;
  rate: number;
  effectiveDate: string;
  remarks?: string;
  isActive: boolean;
}

export interface StockRecord {
  id: string;
  date: string;
  productId: string;
  openingStock: number;
  received: number;
  dispatched: number;
  closingStock: number;
  supplierId?: string;
  minStockLevel?: number;
}

export interface StockEntry {
  id: string;
  date: string;
  supplierId: string;
  items: StockEntryItem[];
  totalAmount: number;
  invoiceNumber?: string;
  invoiceImageUrl?: string;
}

export interface StockEntryItem {
  productId: string;
  quantity: number;
  rate: number;
}

export interface CustomerLedgerEntry {
  date: string;
  orderId?: string;
  paymentId?: string;
  productQuantities: {[productId: string]: number};
  totalQuantity: number;
  amountBilled: number;
  paymentReceived: number;
  closingBalance: number;
  reference?: string;
}

export interface CustomerLedgerReport {
  customerId: string;
  startDate: string;
  endDate: string;
  openingBalance: number;
  entries: CustomerLedgerEntry[];
  totalProductQuantities: {[productId: string]: number};
  totalAmountBilled: number;
  totalPaymentReceived: number;
  closingBalance: number;
}

export interface Vehicle {
  id: string;
  name: string;
  regNumber: string;
  type: string;
  driver?: string;
  capacity?: number;
  capacityUnit?: string;
  driverContact?: string;
  status: "active" | "maintenance";
  notes?: string;
  isActive: boolean;
}

export interface Salesman {
  id: string;
  name: string;
  phone: string;
  address?: string;
  area?: string;
  route?: string;
  joinDate?: string;
  commission?: number;
  salaryType?: "commission" | "fixed";
  salary?: number;
  status?: "active" | "inactive";
  isActive: boolean;
}

export interface Area {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface UISettings {
  theme: "light" | "dark" | "system";
  accentColor: string;
  sidebarStyle: "default" | "compact" | "expanded" | "gradient" | "dark" | "navy" | "teal" | "custom";
  sidebarColor: string;
  tableStyle: "default" | "bordered" | "striped";
}
