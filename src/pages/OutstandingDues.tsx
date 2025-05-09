
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Search, Filter, PlusCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function OutstandingDues() {
  const { customers, addPayment } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterAmount, setFilterAmount] = useState("all");
  
  // Filter customers with outstanding balances and match search query
  const filteredCustomers = customers
    .filter(customer => 
      (activeTab === "all" || 
      (activeTab === "overdue" && customer.lastPaymentDate && new Date(customer.lastPaymentDate) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (activeTab === "current" && (!customer.lastPaymentDate || new Date(customer.lastPaymentDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))))
      && customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      && (filterAmount === "all" || 
          (filterAmount === "high" && customer.outstandingBalance >= 5000) || 
          (filterAmount === "medium" && customer.outstandingBalance >= 1000 && customer.outstandingBalance < 5000) ||
          (filterAmount === "low" && customer.outstandingBalance > 0 && customer.outstandingBalance < 1000))
    );
  
  // Sort filtered customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "amount":
        comparison = a.outstandingBalance - b.outstandingBalance;
        break;
      case "lastPayment":
        const dateA = a.lastPaymentDate ? new Date(a.lastPaymentDate).getTime() : 0;
        const dateB = b.lastPaymentDate ? new Date(b.lastPaymentDate).getTime() : 0;
        comparison = dateA - dateB;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });
  
  // Calculate statistics
  const totalOutstanding = customers.reduce((sum, customer) => sum + (customer.outstandingBalance || 0), 0);
  const overdueCustomers = customers.filter(customer => 
    customer.lastPaymentDate && new Date(customer.lastPaymentDate) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const totalOverdue = overdueCustomers.reduce((sum, customer) => sum + (customer.outstandingBalance || 0), 0);
  const averageOutstanding = customers.length > 0 ? totalOutstanding / customers.length : 0;
  
  // Handle sort change
  const handleSortChange = (column: string) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  // Handle payment submission
  const handlePaymentSubmit = () => {
    if (!selectedCustomerId || !paymentAmount) {
      toast.error("Customer and payment amount are required");
      return;
    }
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    
    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) {
      toast.error("Selected customer not found");
      return;
    }
    
    if (amount > customer.outstandingBalance) {
      toast.warning("Payment amount exceeds outstanding balance");
    }
    
    const payment = {
      id: `pay-${Date.now()}`,
      customerId: selectedCustomerId,
      amount: amount,
      date: format(new Date(), "yyyy-MM-dd"),
      notes: `Payment received for outstanding dues`
    };
    
    addPayment(payment);
    
    setIsPaymentDialogOpen(false);
    setSelectedCustomerId("");
    setPaymentAmount("");
    
    toast.success("Payment recorded successfully");
  };
  
  // Export to CSV
  const exportToCSV = () => {
    let csvContent = "Customer Name,Phone,Address,Outstanding Balance,Last Payment\n";
    
    sortedCustomers.forEach((customer) => {
      const lastPaymentInfo = customer.lastPaymentDate 
        ? `${customer.lastPaymentAmount} on ${customer.lastPaymentDate}` 
        : "No payments";
      
      csvContent += `"${customer.name}","${customer.phone}","${customer.address}","${customer.outstandingBalance}","${lastPaymentInfo}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `outstanding-dues-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.click();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Outstanding Dues</h1>
          <p className="text-muted-foreground">
            Track and manage customer outstanding balances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>
                  Enter the payment details to update the customer's outstanding balance.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers
                        .filter(c => c.outstandingBalance > 0)
                        .map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} (₹{customer.outstandingBalance})
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={paymentAmount} 
                    onChange={(e) => setPaymentAmount(e.target.value)} 
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePaymentSubmit}>
                  <Send className="mr-2 h-4 w-4" />
                  Record Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalOutstanding.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {customers.filter(c => c.outstandingBalance > 0).length} customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalOverdue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {overdueCustomers.length} customers with overdue balances
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{averageOutstanding.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Per customer average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.length > 0 
                ? `${(100 - (totalOutstanding / (totalOutstanding + customers.reduce((sum, c) => sum + (c.totalPaid || 0), 0)) * 100)).toFixed(1)}%` 
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">
              Payment collection rate
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle>Outstanding Balances</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8 w-full sm:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterAmount} onValueChange={setFilterAmount}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <div className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Amount</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="high">High (≥₹5000)</SelectItem>
                  <SelectItem value="medium">Medium (₹1000-₹4999)</SelectItem>
                  <SelectItem value="low">Low (<₹1000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="current">Current</TabsTrigger>
            </TabsList>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSortChange("name")}>
                      Customer Name
                      {sortBy === "name" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortChange("amount")}>
                      Outstanding Balance
                      {sortBy === "amount" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSortChange("lastPayment")}>
                      Last Payment
                      {sortBy === "lastPayment" && (
                        <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCustomers.length > 0 ? (
                    sortedCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          <div>{customer.phone}</div>
                          <div className="text-xs text-muted-foreground">{customer.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-semibold ${
                            customer.outstandingBalance >= 5000 
                              ? "text-destructive" 
                              : customer.outstandingBalance >= 1000 
                                ? "text-amber-500" 
                                : "text-green-600"
                          }`}>
                            ₹{customer.outstandingBalance.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.lastPaymentDate 
                            ? `₹${customer.lastPaymentAmount} on ${new Date(customer.lastPaymentDate).toLocaleDateString()}`
                            : "No payments"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedCustomerId(customer.id);
                              setPaymentAmount(customer.outstandingBalance.toString());
                              setIsPaymentDialogOpen(true);
                            }}
                          >
                            Record Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        {activeTab === "all"
                          ? searchQuery
                            ? "No customers match your search."
                            : "No customers with outstanding balances."
                          : activeTab === "overdue"
                            ? "No customers with overdue balances."
                            : "No customers with current outstanding balances."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
