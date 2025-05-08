
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
  }, []);
  
  // Save invoices to localStorage when they change
  useEffect(() => {
    if (invoices.length > 0) {
      localStorage.setItem("invoices", JSON.stringify(invoices));
    }
  }, [invoices]);
  
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
      toast.error(`Order ${orderId} not found`);
      return null;
    }
    
    // Find customer for this order
    const customerId = order.items[0]?.customerId;
    const customer = customers.find(c => c.id === customerId);
    
    if (!customer) {
      toast.error("Customer not found for this order");
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
