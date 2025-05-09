
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { useInvoice } from '@/contexts/InvoiceContext';
import InvoiceTemplateSelector from '@/components/invoices/InvoiceTemplateSelector';
import { PlusCircle, Save, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function InvoiceCreate() {
  const { toast } = useToast();
  const { customers, products } = useData();
  const { addInvoice, selectedTemplateId } = useInvoice();
  
  const [customerId, setCustomerId] = useState("none");
  const [items, setItems] = useState([
    { productId: "none", quantity: 1, rate: 0, amount: 0 }
  ]);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState("details");

  const handleAddItem = () => {
    setItems([...items, { productId: "none", quantity: 1, rate: 0, amount: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Update rate and amount when product changes
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].rate = product.price;
        newItems[index].amount = product.price * newItems[index].quantity;
      }
    }
    
    // Update amount when quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].rate * newItems[index].quantity;
    }
    
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const handleCreateInvoice = () => {
    if (customerId === "none") {
      toast({
        title: "Error",
        description: "Please select a customer",
        variant: "destructive",
      });
      return;
    }

    if (items.some(item => item.productId === "none")) {
      toast({
        title: "Error",
        description: "Please select products for all items",
        variant: "destructive",
      });
      return;
    }

    const customer = customers.find(c => c.id === customerId);
    
    if (!customer) {
      toast({
        title: "Error",
        description: "Selected customer not found",
        variant: "destructive",
      });
      return;
    }

    const invoice = {
      id: invoiceNumber,
      orderId: `ORD-${Date.now()}`,
      customerName: customer.name,
      date: invoiceDate,
      amount: calculateTotal(),
      status: "Pending",
      items: items.map(item => ({
        customerId: customerId,
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    addInvoice(invoice);
    toast({
      title: "Success",
      description: `Invoice ${invoiceNumber} created successfully`,
    });

    // Reset form
    setCustomerId("none");
    setItems([{ productId: "none", quantity: 1, rate: 0, amount: 0 }]);
    setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Invoice Details</TabsTrigger>
          <TabsTrigger value="template">Select Template</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
              <CardDescription>Enter the basic invoice information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-number">Invoice Number</Label>
                  <Input 
                    id="invoice-number" 
                    value={invoiceNumber} 
                    onChange={(e) => setInvoiceNumber(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-date">Invoice Date</Label>
                  <Input 
                    id="invoice-date" 
                    type="date" 
                    value={invoiceDate} 
                    onChange={(e) => setInvoiceDate(e.target.value)} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select 
                    value={customerId} 
                    onValueChange={(value) => setCustomerId(value)}
                  >
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select a customer</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Items</CardTitle>
                <Button variant="outline" size="sm" onClick={handleAddItem}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-4">
                    <Label htmlFor={`product-${index}`}>Product</Label>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => handleItemChange(index, 'productId', value)}
                    >
                      <SelectTrigger id={`product-${index}`}>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select a product</SelectItem>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`rate-${index}`}>Rate</Label>
                    <Input
                      id={`rate-${index}`}
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                      readOnly={item.productId !== "none"}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`amount-${index}`}>Amount</Label>
                    <Input
                      id={`amount-${index}`}
                      type="number"
                      value={item.amount}
                      readOnly
                    />
                  </div>
                  <div className="col-span-2 flex items-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-500"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-end text-lg font-medium">
                  <span className="mr-8">Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleCreateInvoice}>
              <Save className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="template" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Template</CardTitle>
              <CardDescription>Choose a template for your invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceTemplateSelector />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
