import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Supplier, SupplierPayment } from "@/types";
import { format } from "date-fns";

export default function SupplierPayments() {
  const { suppliers, addSupplier, supplierPayments, addSupplierPayment } = useData();
  const [activeTab, setActiveTab] = useState("suppliers");
  
  // New supplier form state
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, "id">>({
    name: "",
    phone: "",
    address: "",
    email: "",
    category: "",
    outstandingBalance: 0
  });
  
  // New payment form state
  const [newPayment, setNewPayment] = useState<Omit<SupplierPayment, "id">>({
    supplierId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    amount: 0,
    paymentMethod: "cash",
    invoiceNumber: "",
    notes: ""
  });
  
  // Filters
  const [supplierFilter, setSupplierFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  // Dialog states
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleNewSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSupplier.name || !newSupplier.phone) {
      toast.error("Supplier name and phone are required");
      return;
    }
    
    addSupplier(newSupplier);
    setNewSupplier({
      name: "",
      phone: "",
      address: "",
      email: "",
      category: "",
      outstandingBalance: 0
    });
    
    setSupplierDialogOpen(false);
    toast.success("Supplier added successfully");
  };

  const handleNewPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPayment.supplierId || newPayment.amount <= 0) {
      toast.error("Please select a supplier and enter a valid amount");
      return;
    }
    
    addSupplierPayment(newPayment);
    setNewPayment({
      supplierId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      amount: 0,
      paymentMethod: "cash",
      invoiceNumber: "",
      notes: ""
    });
    
    setPaymentDialogOpen(false);
    toast.success("Payment recorded successfully");
  };
  
  // Filter payments based on current filters
  const filteredPayments = supplierPayments.filter(payment => {
    const matchesSupplier = !supplierFilter || payment.supplierId === supplierFilter;
    const matchesDate = !dateFilter || payment.date.includes(dateFilter);
    return matchesSupplier && matchesDate;
  });
  
  // Helper to get supplier name by ID
  const getSupplierName = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    return supplier ? supplier.name : "Unknown";
  };
  
  // Calculate total payments per supplier
  const getSupplierTotalPayments = (supplierId: string) => {
    return supplierPayments
      .filter(payment => payment.supplierId === supplierId)
      .reduce((total, payment) => total + payment.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Supplier Payments</h1>
        <p className="text-gray-500">Manage suppliers and their payment records</p>
      </div>

      <div className="flex justify-end space-x-4">
        <Dialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Supplier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Enter the supplier details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewSupplier}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="col-span-1">Name</Label>
                  <Input
                    id="name"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="col-span-1">Phone</Label>
                  <Input
                    id="phone"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="col-span-1">Address</Label>
                  <Input
                    id="address"
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="col-span-1">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="col-span-1">Category</Label>
                  <Input
                    id="category"
                    value={newSupplier.category}
                    onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
                    placeholder="e.g. Amul, Gokul"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Supplier</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button>Record Payment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Supplier Payment</DialogTitle>
              <DialogDescription>
                Enter the payment details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewPayment}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="col-span-1">Supplier</Label>
                  <Select 
                    value={newPayment.supplierId} 
                    onValueChange={(value) => setNewPayment({...newPayment, supplierId: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="col-span-1">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="col-span-1">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPayment.amount || ""}
                    onChange={(e) => setNewPayment({...newPayment, amount: parseFloat(e.target.value)})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentMethod" className="col-span-1">Method</Label>
                  <Select 
                    value={newPayment.paymentMethod} 
                    onValueChange={(value: "cash" | "bank" | "upi" | "other") => 
                      setNewPayment({...newPayment, paymentMethod: value})
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="invoiceNumber" className="col-span-1">Invoice #</Label>
                  <Input
                    id="invoiceNumber"
                    value={newPayment.invoiceNumber}
                    onChange={(e) => setNewPayment({...newPayment, invoiceNumber: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="col-span-1">Notes</Label>
                  <Input
                    id="notes"
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Record Payment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="payments">Payment Records</TabsTrigger>
        </TabsList>
        
        <TabsContent value="suppliers" className="mt-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Total Payments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No suppliers found. Add your first supplier.
                    </TableCell>
                  </TableRow>
                ) : (
                  suppliers.map(supplier => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.category || "—"}</TableCell>
                      <TableCell>
                        {supplier.phone}
                        {supplier.email && <div className="text-sm text-gray-500">{supplier.email}</div>}
                      </TableCell>
                      <TableCell>
                        ₹{getSupplierTotalPayments(supplier.id).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="payments" className="mt-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-64">
              <Label htmlFor="supplier-filter">Filter by Supplier</Label>
              <Select 
                value={supplierFilter} 
                onValueChange={setSupplierFilter}
              >
                <SelectTrigger id="supplier-filter">
                  <SelectValue placeholder="All Suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-64">
              <Label htmlFor="date-filter">Filter by Date</Label>
              <Input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No payment records found. Record your first payment.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{getSupplierName(payment.supplierId)}</TableCell>
                      <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                      <TableCell>{payment.invoiceNumber || "—"}</TableCell>
                      <TableCell>{payment.notes || "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
