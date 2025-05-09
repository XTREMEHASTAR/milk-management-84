
import React, { useState } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { PlusCircle, FileDown, Search, Filter } from "lucide-react";
import { toast } from "sonner";

export default function Expenses() {
  const { expenses, addExpense, deleteExpense } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  
  // Form state for adding new expense
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "utilities",
    date: format(new Date(), "yyyy-MM-dd"),
    description: ""
  });
  
  // Handle expense form input changes
  const handleInputChange = (field, value) => {
    setNewExpense({
      ...newExpense,
      [field]: value
    });
  };
  
  // Add new expense
  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.amount) {
      toast.error("Title and amount are required");
      return;
    }
    
    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    addExpense({
      ...newExpense,
      id: `exp-${Date.now()}`,
      amount: amount,
      date: newExpense.date || format(new Date(), "yyyy-MM-dd")
    });
    
    setIsAddDialogOpen(false);
    setNewExpense({
      title: "",
      amount: "",
      category: "utilities",
      date: format(new Date(), "yyyy-MM-dd"),
      description: ""
    });
    
    toast.success("Expense added successfully");
  };
  
  // Delete expense
  const handleDeleteExpense = (id) => {
    deleteExpense(id);
    toast.success("Expense deleted successfully");
  };
  
  // Get expense categories
  const expenseCategories = [
    { id: "utilities", name: "Utilities" },
    { id: "rent", name: "Rent" },
    { id: "salaries", name: "Salaries" },
    { id: "maintenance", name: "Maintenance" },
    { id: "supplies", name: "Supplies" },
    { id: "transportation", name: "Transportation" },
    { id: "marketing", name: "Marketing" },
    { id: "other", name: "Other" }
  ];
  
  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => 
      (expense.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       expense.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterCategory === "all" || expense.category === filterCategory) &&
      (filterDate === "all" || filterDateByRange(expense.date, filterDate))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Filter expenses by date range - Fixed to properly compare dates as numbers
  function filterDateByRange(date, range) {
    const expenseDate = new Date(date);
    const today = new Date();
    
    switch (range) {
      case "today":
        return format(expenseDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
      case "thisWeek": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return expenseDate.getTime() >= startOfWeek.getTime();
      }
      case "thisMonth": {
        return expenseDate.getMonth() === today.getMonth() && 
               expenseDate.getFullYear() === today.getFullYear();
      }
      case "lastMonth": {
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        return expenseDate.getMonth() === lastMonth.getMonth() && 
               expenseDate.getFullYear() === lastMonth.getFullYear();
      }
      default:
        return true;
    }
  }
  
  // Calculate total expenses for filtered results - Fix type issues here
  const totalExpenses = filteredExpenses.reduce((sum, expense) => {
    // Ensure expense.amount is a number before adding
    const amount = typeof expense.amount === 'number' ? expense.amount : 0;
    return sum + amount;
  }, 0);
  
  // Export expenses to CSV
  const exportToCSV = () => {
    let csvContent = "Title,Category,Amount,Date,Description\n";
    
    filteredExpenses.forEach((expense) => {
      csvContent += `"${expense.title}","${expense.category}","${expense.amount}","${expense.date}","${expense.description || ''}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.click();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Track and manage your business expenses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details for your new expense.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Expense Title</Label>
                  <Input 
                    id="title" 
                    value={newExpense.title} 
                    onChange={(e) => handleInputChange("title", e.target.value)} 
                    placeholder="e.g., Electricity Bill"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={newExpense.amount} 
                      onChange={(e) => handleInputChange("amount", e.target.value)} 
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={newExpense.date} 
                      onChange={(e) => handleInputChange("date", e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newExpense.category} 
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    value={newExpense.description} 
                    onChange={(e) => handleInputChange("description", e.target.value)} 
                    placeholder="Add any additional details"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>
                  Add Expense
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Expense Tracker</CardTitle>
              <CardDescription>
                View and manage all your recorded expenses
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Category</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {expenseCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Date</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.title}</TableCell>
                      <TableCell>
                        {expenseCategories.find(c => c.id === expense.category)?.name || expense.category}
                      </TableCell>
                      <TableCell className="text-right">₹{expense.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {expense.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <span className="sr-only">Delete</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No expenses found. {searchQuery || filterCategory !== "all" || filterDate !== "all" ? 'Try adjusting your filters.' : 'Add your first expense to get started.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-end">
            <div className="bg-primary-foreground p-4 rounded-md">
              <span className="font-medium text-muted-foreground">Total:</span>
              <span className="ml-2 font-bold text-lg">₹{totalExpenses.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
