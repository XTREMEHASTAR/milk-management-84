
import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePicker } from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { format } from "date-fns";
import { FileText, Download, Printer, Save } from "lucide-react";
import { Customer, Product, Order } from "@/types";
import jsPDF from "jspdf";
import "jspdf-autotable";

type InvoiceItem = {
  productId: string;
  quantity: number;
  rate: number;
  amount: number;
};

type InvoiceData = {
  invoiceNumber: string;
  date: Date;
  customer: Customer | null;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: "paid" | "partially_paid" | "unpaid";
  amountPaid: number;
  balance: number;
  notes: string;
};

const InvoiceGenerator = () => {
  const { customers, products, orders } = useData();
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date(),
    customer: null,
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    paymentStatus: "unpaid",
    amountPaid: 0,
    balance: 0,
    notes: "",
  });

  // Calculate subtotal, tax, and total when items change
  useEffect(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = 0; // Add tax calculation if needed
    const total = subtotal + tax;
    const balance = total - invoice.amountPaid;

    setInvoice((prev) => ({
      ...prev,
      subtotal,
      tax,
      total,
      balance,
    }));
  }, [invoice.items, invoice.amountPaid]);

  const handleCustomerChange = (customerId: string) => {
    const selectedCustomer = customers.find((c) => c.id === customerId) || null;
    
    // Reset items when customer changes
    setInvoice((prev) => ({
      ...prev,
      customer: selectedCustomer,
      items: [],
    }));
    
    // Auto-fill items based on latest order for this customer
    if (selectedCustomer) {
      const customerOrders = orders
        .filter((order) => order.items.some(item => item.customerId === customerId))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (customerOrders.length > 0) {
        const latestOrder = customerOrders[0];
        const customerItems = latestOrder.items.filter(item => item.customerId === customerId);
        
        const invoiceItems: InvoiceItem[] = customerItems.map(item => {
          const product = products.find(p => p.id === item.productId);
          const rate = product ? product.price : 0;
          const quantity = item.quantity;
          
          return {
            productId: item.productId,
            quantity,
            rate,
            amount: quantity * rate,
          };
        });
        
        setInvoice(prev => ({
          ...prev,
          items: invoiceItems,
        }));
        
        toast.success("Auto-filled items from latest order");
      } else {
        toast.info("No previous orders found for this customer");
      }
    }
  };

  const handleAddItem = () => {
    if (products.length === 0) {
      toast.error("No products available");
      return;
    }

    const firstProduct = products[0];
    const newItem: InvoiceItem = {
      productId: firstProduct.id,
      quantity: 1,
      rate: firstProduct.price,
      amount: firstProduct.price,
    };

    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setInvoice((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      // Recalculate amount when quantity or rate changes
      if (field === "quantity" || field === "rate") {
        updatedItems[index].amount =
          updatedItems[index].quantity * updatedItems[index].rate;
      }

      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const handlePaymentStatusChange = (status: "paid" | "partially_paid" | "unpaid") => {
    let amountPaid = 0;
    
    if (status === "paid") {
      amountPaid = invoice.total;
    } else if (status === "unpaid") {
      amountPaid = 0;
    }
    
    setInvoice((prev) => ({
      ...prev,
      paymentStatus: status,
      amountPaid: status === "partially_paid" ? prev.amountPaid : amountPaid,
      balance: status === "paid" ? 0 : status === "unpaid" ? prev.total : prev.total - prev.amountPaid,
    }));
  };

  const handleAmountPaidChange = (value: number) => {
    const amountPaid = Math.min(value, invoice.total);
    const balance = invoice.total - amountPaid;
    const paymentStatus = 
      amountPaid === 0 ? "unpaid" : 
      amountPaid === invoice.total ? "paid" : 
      "partially_paid";
    
    setInvoice((prev) => ({
      ...prev,
      amountPaid,
      balance,
      paymentStatus,
    }));
  };

  const generatePDF = () => {
    if (!invoice.customer) {
      toast.error("Please select a customer");
      return;
    }

    if (invoice.items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add invoice header
      doc.setFontSize(20);
      doc.text("INVOICE", 105, 15, { align: "center" });
      
      doc.setFontSize(10);
      doc.text("Vikas Milk Centers & Manali Enterprises", 105, 22, { align: "center" });
      doc.text("123 Milk Street, Dairy District", 105, 27, { align: "center" });
      doc.text("Phone: +91 98765 43210", 105, 32, { align: "center" });
      
      // Add invoice details
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoice.invoiceNumber}`, 15, 45);
      doc.text(`Date: ${format(invoice.date, "dd/MM/yyyy")}`, 15, 52);
      
      // Add customer details
      doc.text("Bill To:", 15, 65);
      doc.text(`${invoice.customer.name}`, 15, 72);
      doc.text(`${invoice.customer.address || ""}`, 15, 79);
      doc.text(`Phone: ${invoice.customer.phone || ""}`, 15, 86);
      
      // Add items table
      const tableColumn = ["#", "Product", "Qty", "Rate", "Amount"];
      const tableRows = invoice.items.map((item, index) => {
        const product = products.find(p => p.id === item.productId);
        return [
          (index + 1).toString(),
          product ? product.name : "Unknown Product",
          item.quantity.toString(),
          `₹${item.rate.toFixed(2)}`,
          `₹${item.amount.toFixed(2)}`,
        ];
      });
      
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 95,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        foot: [
          ["", "", "", "Subtotal:", `₹${invoice.subtotal.toFixed(2)}`],
          ["", "", "", "Tax:", `₹${invoice.tax.toFixed(2)}`],
          ["", "", "", "Total:", `₹${invoice.total.toFixed(2)}`],
          ["", "", "", "Paid:", `₹${invoice.amountPaid.toFixed(2)}`],
          ["", "", "", "Balance:", `₹${invoice.balance.toFixed(2)}`],
        ],
        footStyles: { fillColor: [240, 240, 240], textColor: 0 },
      });
      
      // Add payment status
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Payment Status: ${invoice.paymentStatus.replace("_", " ").toUpperCase()}`, 15, finalY);
      
      if (invoice.notes) {
        doc.text(`Notes: ${invoice.notes}`, 15, finalY + 10);
      }
      
      // Save the PDF
      doc.save(`Invoice-${invoice.invoiceNumber}-${invoice.customer.name}.pdf`);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate invoice");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice Generator</h1>
          <p className="text-muted-foreground">
            Create and download invoices for your customers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>
              Basic information for this invoice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    invoiceNumber: e.target.value,
                  }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label>Invoice Date</Label>
              <DatePicker
                date={invoice.date}
                setDate={(date) =>
                  setInvoice((prev) => ({
                    ...prev,
                    date: date || new Date(),
                  }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select
                onValueChange={handleCustomerChange}
                value={invoice.customer?.id || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {invoice.customer && (
              <div className="rounded-md bg-muted p-4 text-sm">
                <div><strong>Address:</strong> {invoice.customer.address}</div>
                <div><strong>Phone:</strong> {invoice.customer.phone}</div>
                <div><strong>Outstanding:</strong> ₹{invoice.customer.outstandingBalance}</div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={invoice.notes}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Additional notes"
              />
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <RadioGroup
                value={invoice.paymentStatus}
                onValueChange={(value: "paid" | "partially_paid" | "unpaid") =>
                  handlePaymentStatusChange(value)
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid" className="cursor-pointer">Paid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partially_paid" id="partially_paid" />
                  <Label htmlFor="partially_paid" className="cursor-pointer">Partially Paid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unpaid" id="unpaid" />
                  <Label htmlFor="unpaid" className="cursor-pointer">Unpaid</Label>
                </div>
              </RadioGroup>
            </div>
            
            {invoice.paymentStatus === "partially_paid" && (
              <div className="space-y-2">
                <Label htmlFor="amountPaid">Amount Paid</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  value={invoice.amountPaid}
                  onChange={(e) => handleAmountPaidChange(Number(e.target.value))}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Invoice Items</CardTitle>
                <CardDescription>
                  Add products to this invoice
                </CardDescription>
              </div>
              <Button onClick={handleAddItem}>Add Item</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="w-24 text-right">Quantity</TableHead>
                  <TableHead className="w-32 text-right">Rate (₹)</TableHead>
                  <TableHead className="w-32 text-right">Amount (₹)</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No items added. Click "Add Item" to add products.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoice.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={item.productId}
                          onValueChange={(value) =>
                            handleItemChange(index, "productId", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue>
                              {products.find((p) => p.id === item.productId)?.name ||
                                "Select product"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} - ₹{product.price}/{product.unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-20 ml-auto text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "rate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-24 ml-auto text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{item.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                        >
                          ✕
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col items-end space-y-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-64 text-sm">
              <div className="text-right text-muted-foreground">Subtotal:</div>
              <div className="text-right">₹{invoice.subtotal.toFixed(2)}</div>
              <div className="text-right text-muted-foreground">Tax:</div>
              <div className="text-right">₹{invoice.tax.toFixed(2)}</div>
              <div className="text-right font-medium">Total:</div>
              <div className="text-right font-medium">₹{invoice.total.toFixed(2)}</div>
              <div className="text-right text-muted-foreground">Amount Paid:</div>
              <div className="text-right">₹{invoice.amountPaid.toFixed(2)}</div>
              <div className="text-right font-medium">Balance Due:</div>
              <div className="text-right font-medium">₹{invoice.balance.toFixed(2)}</div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
