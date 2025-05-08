
import { Invoice } from "@/types";
import { format } from "date-fns";
import { generatePdfPreview } from "./pdfUtils";

// Invoice template definitions
export const INVOICE_TEMPLATES = [
  {
    id: "standard",
    name: "Standard Invoice",
    description: "Classic invoice format with company details and logo",
    previewImage: "standard-invoice.png"
  },
  {
    id: "modern",
    name: "Modern Invoice",
    description: "Clean, contemporary design with minimalist layout",
    previewImage: "modern-invoice.png"
  },
  {
    id: "detailed",
    name: "Detailed Invoice",
    description: "Comprehensive format with item details and tax breakdown",
    previewImage: "detailed-invoice.png"
  },
  {
    id: "simple",
    name: "Simple Invoice",
    description: "Streamlined format with just the essentials",
    previewImage: "simple-invoice.png"
  },
];

// Function to generate a random invoice number
export const generateInvoiceNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `INV-${randomNum}`;
};

// Function to generate a PDF preview for an invoice
export const generateInvoicePreview = (
  invoice: {
    id: string;
    customerName: string;
    date: string;
    items: Array<{
      productId: string;
      quantity: number;
      rate: number;
      amount: number;
    }>;
    totalAmount: number;
    notes?: string;
    terms?: string;
    status?: string;
  },
  companyInfo: {
    companyName: string;
    address: string;
    contactNumber: string;
    email: string;
    gstNumber: string;
    bankDetails: string;
  },
  products: Array<{
    id: string;
    name: string;
    price: number;
  }>,
  templateId: string = "standard",
) => {
  // Create column headers based on template
  const columns = ["Item", "Quantity", "Rate", "Amount"];
  
  // Map items to rows with product names
  const data = invoice.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return [
      product ? product.name : "Unknown Product",
      item.quantity.toString(),
      `₹${item.rate.toFixed(2)}`,
      `₹${item.amount.toFixed(2)}`
    ];
  });
  
  // Add total row
  data.push(["", "", "Total", `₹${invoice.totalAmount.toFixed(2)}`]);
  
  // Generate additional info based on template
  const additionalInfo = [
    { label: "Customer", value: invoice.customerName || "Unknown" },
    { label: "Status", value: invoice.status || "Draft" },
    { label: "GST No.", value: companyInfo.gstNumber }
  ];
  
  // Generate PDF preview with different styling based on template
  return generatePdfPreview(
    columns,
    data,
    {
      title: companyInfo.companyName,
      subtitle: `Invoice #: ${invoice.id}`,
      dateInfo: `Date: ${format(new Date(invoice.date), "dd MMMM yyyy")}`,
      additionalInfo: additionalInfo,
      landscape: templateId === "detailed",
      fontSizeAdjustment: templateId === "modern" ? -1 : 0,
      filename: `invoice-${invoice.id}.pdf`
    }
  );
};

// Function to create an invoice object from form data
export const createInvoiceFromFormData = (
  formData: {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    customerId: string;
    customerName: string;
    items: Array<{
      productId: string;
      quantity: number;
      rate: number;
      amount: number;
    }>;
    notes?: string;
    terms?: string;
  }
): Invoice => {
  const totalAmount = formData.items.reduce((sum, item) => sum + item.amount, 0);
  
  return {
    id: formData.invoiceNumber,
    orderId: `ORD-${Date.now().toString().substring(7)}`,
    customerName: formData.customerName,
    date: formData.invoiceDate,
    amount: totalAmount,
    status: "Pending",
    items: formData.items.map(item => ({
      customerId: formData.customerId,
      productId: item.productId,
      quantity: item.quantity
    }))
  };
};
