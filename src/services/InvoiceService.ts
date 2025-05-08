
import { ElectronService } from './ElectronService';
import { Invoice } from '@/types';
import { generateInvoicePreview, calculateInvoiceAmounts } from '@/utils/invoiceUtils';
import { toast } from 'sonner';
import { format } from 'date-fns';

type CompanyInfo = {
  companyName: string;
  address: string;
  contactNumber: string;
  email: string;
  gstNumber: string;
  bankDetails: string;
  logoUrl?: string;
};

/**
 * Service for handling invoice-related operations
 */
export class InvoiceService {
  /**
   * Download an invoice as PDF
   */
  static async downloadInvoice(
    invoice: Invoice, 
    companyInfo: CompanyInfo, 
    products: Array<{ id: string; name: string; price: number; description?: string }>,
    templateId: string = "standard"
  ): Promise<boolean> {
    try {
      // Map invoice items to the format expected by generateInvoicePreview
      const items = invoice.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        const rate = product ? product.price : 0;
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          rate,
          amount: rate * item.quantity
        };
      });

      // Create invoice data object
      const invoiceData = {
        id: invoice.id,
        customerName: invoice.customerName,
        date: invoice.date,
        items,
        totalAmount: invoice.amount,
        status: invoice.status
      };

      // Generate PDF preview
      const pdfDataUrl = generateInvoicePreview(
        invoiceData,
        companyInfo,
        products,
        templateId
      );

      if (!pdfDataUrl) {
        throw new Error("Failed to generate PDF");
      }

      // Convert data URL to base64 data
      const base64Data = pdfDataUrl.split(',')[1];

      // If running in Electron, use native save dialog
      if (ElectronService.isElectron()) {
        const fileName = `invoice-${invoice.id.replace(/[^\w-]/g, '_')}.pdf`;
        const result = await ElectronService.exportData(base64Data);
        
        if (result.success) {
          toast.success(`Invoice saved to ${result.filePath}`);
          return true;
        } else {
          toast.error(`Failed to save invoice: ${result.error || 'Unknown error'}`);
          return false;
        }
      } 
      // In web browser, use download attribute
      else {
        // Create a Blob from the base64 data
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${invoice.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        toast.success('Invoice download started');
        return true;
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
      return false;
    }
  }
  
  /**
   * Get company info from local storage or return default values
   */
  static getCompanyInfo(): CompanyInfo {
    try {
      const saved = localStorage.getItem("companyInfo");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading company info:", error);
    }
    
    // Default company info
    return {
      companyName: "Milk Center",
      address: "123 Dairy Lane, Milk City",
      contactNumber: "+91 9876543210",
      email: "info@milkcenter.com",
      gstNumber: "29ABCDE1234F1Z5",
      bankDetails: "Bank Name: ABC Bank\nAccount Number: 1234567890\nIFSC Code: ABCD0001234"
    };
  }
  
  /**
   * Save company info to local storage
   */
  static saveCompanyInfo(companyInfo: CompanyInfo): void {
    try {
      localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
      toast.success("Company information saved successfully");
    } catch (error) {
      console.error("Error saving company info:", error);
      toast.error("Failed to save company information");
    }
  }
  
  /**
   * Generate invoice preview URL
   */
  static generatePreviewUrl(
    invoice: Invoice, 
    companyInfo: CompanyInfo, 
    products: Array<{ id: string; name: string; price: number; description?: string }>,
    templateId: string = "standard"
  ): string {
    try {
      // Map invoice items to the format expected by generateInvoicePreview
      const items = invoice.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        const rate = product ? product.price : 0;
        
        return {
          productId: item.productId,
          quantity: item.quantity,
          rate,
          amount: rate * item.quantity
        };
      });

      // Create invoice data object
      const invoiceData = {
        id: invoice.id,
        customerName: invoice.customerName,
        date: invoice.date,
        items,
        totalAmount: invoice.amount,
        status: invoice.status
      };

      // Generate and return PDF preview URL
      return generateInvoicePreview(
        invoiceData,
        companyInfo,
        products,
        templateId
      );
    } catch (error) {
      console.error("Error generating invoice preview:", error);
      return "";
    }
  }
  
  /**
   * Create invoices from orders for a specific customer or all customers
   */
  static batchCreateInvoicesFromOrders(
    orders: Array<any>, 
    products: Array<any>,
    customers: Array<any>,
    customerId?: string
  ): Invoice[] {
    const invoices: Invoice[] = [];
    
    try {
      // Fix: Add type check before using forEach
      if (!Array.isArray(orders) || orders.length === 0) {
        return [];
      }
      
      // Filter orders by customer if customerId is provided
      const filteredOrders = customerId 
        ? orders.filter(order => order.items.some(item => item.customerId === customerId))
        : orders;
      
      // Check if there are any orders to process
      if (filteredOrders.length === 0) {
        return [];
      }
      
      // Group orders by customer
      const ordersByCustomer = filteredOrders.reduce((acc, order) => {
        // Get customer ID from the first item (assuming all items in an order belong to the same customer)
        const customerId = order.items[0]?.customerId;
        
        if (!customerId) return acc;
        
        if (!acc[customerId]) {
          acc[customerId] = [];
        }
        
        acc[customerId].push(order);
        return acc;
      }, {} as Record<string, any[]>);
      
      // Process orders for each customer
      if (ordersByCustomer && typeof ordersByCustomer === 'object') {
        // Fix: Use type checking to ensure we can iterate over the object
        Object.entries(ordersByCustomer).forEach(([custId, customerOrders]) => {
          const customer = customers.find(c => c.id === custId);
          
          if (!customer) return;
          
          // Create invoice for each order
          // Fix: Add type check for customerOrders before using forEach
          if (Array.isArray(customerOrders)) {
            customerOrders.forEach(order => {
              // Skip if invoice already exists for this order
              if (invoices.some(inv => inv.orderId === order.id)) {
                return;
              }
              
              const invoice = {
                id: `INV-${Date.now().toString().substring(7)}-${Math.floor(1000 + Math.random() * 9000)}`,
                orderId: order.id,
                customerName: customer.name,
                date: order.date,
                amount: order.totalAmount || 0,
                status: "Pending",
                items: order.items
              };
              
              invoices.push(invoice);
            });
          }
        });
      }
    } catch (error) {
      console.error("Error creating batch invoices:", error);
    }
    
    return invoices;
  }
}
