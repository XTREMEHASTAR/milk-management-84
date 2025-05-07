
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Check, PlusCircle, Save, Trash, FileText, Download, Copy, Templates } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";

// Define invoice template types
const INVOICE_TEMPLATES = [
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

export default function InvoiceGenerator() {
  const { customers, products } = useData();
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedItems, setSelectedItems] = useState([{ productId: "", quantity: 1, rate: 0, amount: 0 }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [dueDate, setDueDate] = useState(format(new Date(new Date().setDate(new Date().getDate() + 15)), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("standard");

  // Company profile form
  const { register, watch } = useForm({
    defaultValues: {
      companyName: "Milk Center",
      address: "123 Dairy Lane, Milk City",
      contactNumber: "+91 9876543210",
      email: "info@milkcenter.com",
      gstNumber: "29ABCDE1234F1Z5",
      bankDetails: "Bank Name: ABC Bank\nAccount Number: 1234567890\nIFSC Code: ABCD0001234",
    }
  });

  const companyFormValues = watch();

  // Generate random invoice number on load
  useEffect(() => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setInvoiceNumber(`INV-${randomNum}`);
  }, []);

  // Calculate total amount whenever selected items change
  useEffect(() => {
    const total = selectedItems.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
  }, [selectedItems]);

  // Handle product selection
  const handleProductChange = (index: number, productId: string) => {
    const newItems = [...selectedItems];
    const product = products.find(p => p.id === productId);
    const quantity = newItems[index].quantity;
    
    if (product) {
      newItems[index] = {
        productId,
        quantity,
        rate: product.price || 0,
        amount: quantity * (product.price || 0)
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        productId,
        rate: 0,
        amount: 0
      };
    }
    
    setSelectedItems(newItems);
  };

  // Handle quantity change
  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...selectedItems];
    const productId = newItems[index].productId;
    const product = products.find(p => p.id === productId);
    
    newItems[index] = {
      productId,
      quantity,
      rate: product?.price || newItems[index].rate,
      amount: quantity * (product?.price || newItems[index].rate)
    };
    
    setSelectedItems(newItems);
  };

  // Handle rate change
  const handleRateChange = (index: number, rate: number) => {
    const newItems = [...selectedItems];
    newItems[index] = {
      ...newItems[index],
      rate,
      amount: newItems[index].quantity * rate
    };
    
    setSelectedItems(newItems);
  };

  // Add new item row
  const addItem = () => {
    setSelectedItems([...selectedItems, { productId: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  // Remove item row
  const removeItem = (index: number) => {
    if (selectedItems.length > 1) {
      const newItems = [...selectedItems];
      newItems.splice(index, 1);
      setSelectedItems(newItems);
    } else {
      toast.error("Invoice must have at least one item");
    }
  };

  // Generate PDF invoice
  const generateInvoice = () => {
    if (!selectedCustomerId) {
      toast.error("Please select a customer");
      return;
    }

    if (selectedItems.some(item => !item.productId)) {
      toast.error("Please select products for all items");
      return;
    }

    setIsGenerating(true);
    
    // In a real application, this would generate and download a PDF
    // For now, we'll just show a success message
    setTimeout(() => {
      toast.success("Invoice generated successfully!");
      setIsGenerating(false);
      // In a real app, you would save the invoice to the database here
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoice Generator</h1>
        <p className="text-muted-foreground">
          Create professional invoices for your customers
        </p>
      </div>
      
      <Tabs defaultValue="invoice-details">
        <TabsList>
          <TabsTrigger value="invoice-details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Invoice Details
          </TabsTrigger>
          <TabsTrigger value="template" className="flex items-center gap-2">
            <Templates className="h-4 w-4" />
            Template Selection
          </TabsTrigger>
          <TabsTrigger value="company-profile" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Company Profile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoice-details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoice-number">Invoice Number</Label>
                  <Input 
                    id="invoice-number"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="invoice-date">Invoice Date</Label>
                  <Input 
                    id="invoice-date"
                    type="date"
                    value={invoiceDate}
                    onChange={e => setInvoiceDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input 
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCustomerId && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {customers.find(c => c.id === selectedCustomerId)?.address || 'No address available'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Invoice Items</CardTitle>
              <Button variant="outline" size="sm" onClick={addItem}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Product</th>
                      <th className="text-center p-2 font-semibold">Quantity</th>
                      <th className="text-center p-2 font-semibold">Rate</th>
                      <th className="text-right p-2 font-semibold">Amount</th>
                      <th className="text-right p-2 font-semibold w-10">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          <Select
                            value={item.productId}
                            onValueChange={value => handleProductChange(index, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map(product => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                            className="text-center"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={e => handleRateChange(index, parseFloat(e.target.value) || 0)}
                            className="text-center"
                          />
                        </td>
                        <td className="p-2 text-right">
                          ₹{item.amount.toFixed(2)}
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            disabled={selectedItems.length === 1}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="text-right font-medium p-2">Total:</td>
                      <td className="text-right font-bold p-2">₹{totalAmount.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any additional notes for the customer"
                />
              </div>
              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Input
                  id="terms"
                  value={terms}
                  onChange={e => setTerms(e.target.value)}
                  placeholder="Payment terms and conditions"
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button 
                  onClick={generateInvoice} 
                  disabled={isGenerating}
                >
                  {isGenerating ? 
                    "Generating..." : 
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </>
                  }
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {INVOICE_TEMPLATES.map(template => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id ? 'ring-2 ring-primary' : 'hover:border-primary'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{template.name}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{template.description}</p>
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="bg-primary rounded-full p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 h-40 bg-muted rounded-md flex items-center justify-center">
                        <div className="text-muted-foreground text-sm">Template Preview</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company-profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" {...register("companyName")} />
                </div>
                <div>
                  <Label htmlFor="gst-number">GST Number</Label>
                  <Input id="gst-number" {...register("gstNumber")} />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-number">Contact Number</Label>
                  <Input id="contact-number" {...register("contactNumber")} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" {...register("email")} type="email" />
                </div>
              </div>
              <div>
                <Label htmlFor="bank-details">Bank Details</Label>
                <Input id="bank-details" {...register("bankDetails")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Invoice Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Default Template</h3>
                      <p className="text-sm text-muted-foreground">Last modified: {format(new Date(), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
