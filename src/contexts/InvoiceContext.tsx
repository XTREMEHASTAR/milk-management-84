
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Invoice } from '@/types';
import { InvoiceService } from '@/services/InvoiceService';
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
  generateInvoicePreview: (invoice: Invoice, templateId?: string) => string;
  templates: any[];
}

// Create context
const InvoiceContext = createContext<InvoiceContextValue | undefined>(undefined);

// Provider component
export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // We'll manage invoices directly here without depending on DataContext
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("standard");
  const [companyInfo, setCompanyInfo] = useState(() => InvoiceService.getCompanyInfo());
  const [templates, setTemplates] = useState(() => InvoiceService.getInvoiceTemplates());
  
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
    
    try {
      // Placeholder function without full dependency on DataContext
      return await InvoiceService.downloadInvoice(
        invoice, 
        companyInfo, 
        [], // Simplified without products
        templateId || selectedTemplateId
      );
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
      return false;
    }
  };
  
  // Simplified create invoice from order
  const createInvoiceFromOrderById = (orderId: string) => {
    // Simplified to avoid circular dependencies
    console.log(`Creating invoice from order ${orderId}`);
    return null;
  };

  // Simplified bulk invoice creation
  const createBulkInvoicesForParty = (customerId: string, dateRange?: { from: Date, to: Date }) => {
    // Simplified to avoid circular dependencies
    console.log(`Creating bulk invoices for customer ${customerId}`);
    return [];
  };
  
  // Update company info
  const updateCompanyInfo = (info: any) => {
    setCompanyInfo(info);
    InvoiceService.saveCompanyInfo(info);
  };
  
  // Generate invoice preview
  const generateInvoicePreview = (invoice: Invoice, templateId?: string) => {
    return InvoiceService.generatePreviewUrl(
      invoice,
      companyInfo,
      [], // Simplified without products
      templateId || selectedTemplateId
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
    generateInvoicePreview,
    templates
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

// Function to create the invoice creation callback for DataProvider
export const createInvoiceProviderCallback = (invoiceContext: InvoiceContextValue) => {
  return (orderId: string) => {
    return invoiceContext.createInvoiceFromOrder(orderId);
  };
};
