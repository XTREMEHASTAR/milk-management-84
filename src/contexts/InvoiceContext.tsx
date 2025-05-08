
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Invoice } from '@/types';
import { InvoiceService } from '@/services/InvoiceService';
import { useData } from './DataContext';
import { createInvoiceFromOrder, generateInvoiceNumber } from '@/utils/invoiceUtils';
import { toast } from 'sonner';

// Define interface for the context value
interface InvoiceContextValue {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getInvoicesByCustomerId: (customerId: string) => Invoice[];
  downloadInvoice: (id: string, templateId?: string) => Promise<boolean>;
  createInvoiceFromOrder: (orderId: string) => Invoice | null;
  createBulkInvoicesForParty: (customerId: string, dateRange?: { from: Date, to: Date }) => Invoice[];
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  companyInfo: any;
  updateCompanyInfo: (info: any) => void;
  generateInvoicePreview: (invoice: Invoice) => string;
}

// Create context
const InvoiceContext = createContext<InvoiceContextValue | undefined>(undefined);

// Provider component
export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { orders, products, customers } = useData();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("standard");
  const [companyInfo, setCompanyInfo] = useState(() => InvoiceService.getCompanyInfo());
  
  // Load invoices from localStorage on mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem("invoices");
    if (savedInvoices) {
      try {
        setInvoices(JSON.parse(savedInvoices));
      } catch (error) {
        console.error("Error parsing saved invoices:", error);
        setInvoices([]);
      }
    } else {
      // Generate initial invoices from orders if none exist
      const generatedInvoices = generateInitialInvoicesFromOrders();
      if (generatedInvoices.length > 0) {
        setInvoices(generatedInvoices);
      }
    }

    // Load selected template
    const savedTemplate = localStorage.getItem("selectedInvoiceTemplate");
    if (savedTemplate) {
      setSelectedTemplateId(savedTemplate);
    }
  }, []);
  
  // Save invoices to localStorage when they change
  useEffect(() => {
    if (invoices.length > 0) {
      localStorage.setItem("invoices", JSON.stringify(invoices));
    }
  }, [invoices]);

  // Save selected template to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("selectedInvoiceTemplate", selectedTemplateId);
  }, [selectedTemplateId]);
  
  // Generate initial invoices from existing orders
  const generateInitialInvoicesFromOrders = (): Invoice[] => {
    if (!orders || !products || !customers) return [];
    
    return InvoiceService.batchCreateInvoicesFromOrders(orders, products, customers);
  };
  
  // Add a new invoice
  const addInvoice = (invoice: Invoice) => {
    setInvoices(prevInvoices => [...prevInvoices, invoice]);
    toast.success(`Invoice ${invoice.id} created successfully`);
  };
  
  // Update an existing invoice
  const updateInvoice = (id: string, data: Partial<Invoice>) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === id ? { ...invoice, ...data } : invoice
      )
    );
    toast.success(`Invoice ${id} updated successfully`);
  };
  
  // Delete an invoice
  const deleteInvoice = (id: string) => {
    setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== id));
    toast.success(`Invoice ${id} deleted successfully`);
  };
  
  // Get an invoice by ID
  const getInvoiceById = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };
  
  // Get invoices by customer ID
  const getInvoicesByCustomerId = (customerId: string) => {
    return invoices.filter(invoice => 
      invoice.items.some(item => item.customerId === customerId)
    );
  };
  
  // Download an invoice as PDF
  const downloadInvoice = async (id: string, templateId?: string) => {
    const invoice = getInvoiceById(id);
    if (!invoice) {
      toast.error(`Invoice ${id} not found`);
      return false;
    }
    
    return await InvoiceService.downloadInvoice(
      invoice, 
      companyInfo, 
      products,
      templateId || selectedTemplateId
    );
  };
  
  // Create a new invoice from an existing order
  const createInvoiceFromOrderById = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      console.error(`Order ${orderId} not found`);
      return null;
    }
    
    // Check if invoice already exists for this order
    const existingInvoice = invoices.find(inv => inv.orderId === orderId);
    if (existingInvoice) {
      console.log(`Invoice already exists for order ${orderId}`);
      return existingInvoice;
    }
    
    // Find customer for this order (first item's customer)
    const customerId = order.items[0]?.customerId;
    const customer = customers.find(c => c.id === customerId);
    
    if (!customer) {
      console.error("Customer not found for this order");
      return null;
    }
    
    // Create invoice
    const invoice = createInvoiceFromOrder(
      order,
      products,
      customer.id,
      customer.name
    );
    
    // Add to invoices
    addInvoice(invoice);
    return invoice;
  };

  // Create invoices in bulk for a specific customer/party
  const createBulkInvoicesForParty = (customerId: string, dateRange?: { from: Date, to: Date }) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
      toast.error("Customer not found");
      return [];
    }
    
    // Filter orders for this customer
    const customerOrders = orders.filter(order => 
      order.items.some(item => item.customerId === customerId)
    );
    
    // Filter by date range if provided
    let filteredOrders = customerOrders;
    if (dateRange) {
      filteredOrders = customerOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= dateRange.from && orderDate <= dateRange.to;
      });
    }
    
    // Check which orders don't already have invoices
    const ordersWithoutInvoices = filteredOrders.filter(order => 
      !invoices.some(invoice => invoice.orderId === order.id)
    );
    
    if (ordersWithoutInvoices.length === 0) {
      toast.info("No new orders found to create invoices");
      return [];
    }
    
    // Create new invoices
    const newInvoices: Invoice[] = [];
    
    ordersWithoutInvoices.forEach(order => {
      const invoice = createInvoiceFromOrder(
        order,
        products,
        customer.id,
        customer.name
      );
      
      newInvoices.push(invoice);
    });
    
    // Add all new invoices to state
    setInvoices(prev => [...prev, ...newInvoices]);
    
    toast.success(`Created ${newInvoices.length} new invoices for ${customer.name}`);
    return newInvoices;
  };
  
  // Update company info
  const updateCompanyInfo = (info: any) => {
    setCompanyInfo(info);
    InvoiceService.saveCompanyInfo(info);
  };
  
  // Generate invoice preview
  const generateInvoicePreview = (invoice: Invoice) => {
    return InvoiceService.generatePreviewUrl(
      invoice,
      companyInfo,
      products,
      selectedTemplateId
    );
  };
  
  // Context value
  const contextValue: InvoiceContextValue = {
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    getInvoicesByCustomerId,
    downloadInvoice,
    createInvoiceFromOrder: createInvoiceFromOrderById,
    createBulkInvoicesForParty,
    selectedTemplateId,
    setSelectedTemplateId,
    companyInfo,
    updateCompanyInfo,
    generateInvoicePreview
  };
  
  return (
    <InvoiceContext.Provider value={contextValue}>
      {children}
    </InvoiceContext.Provider>
  );
};

// Hook to use the invoice context
export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};
