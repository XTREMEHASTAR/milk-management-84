
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  outstandingBalance: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  unit: string;
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
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
}
