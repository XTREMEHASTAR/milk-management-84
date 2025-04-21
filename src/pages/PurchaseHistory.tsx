
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Plus, FileDown, Trash2, Search, Calendar, Edit } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { StockEntry, StockEntryItem } from "@/types";

export default function PurchaseHistory() {
  const { stockEntries, suppliers, products, addStockEntry } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  
  // New entry form state
  const [entryDate, setEntryDate] = useState<Date>(new Date());
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [entryItems, setEntryItems] = useState<{ productId: string; quantity: string; rate: string }[]>([
    { productId: "", quantity: "", rate: "" }
  ]);

  const filteredEntries = stockEntries.filter(entry => {
    // Apply text search
    const supplier = suppliers.find(s => s.id === entry.supplierId);
    const matchesText = !searchQuery || 
      (supplier && supplier.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.invoiceNumber && entry.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesText) return false;
    
    // Apply date filters
    const entryDateObj = new Date(entry.date);
    
    if (startDate && entryDateObj < startDate) return false;
    if (endDate) {
      const endDateCopy = new Date(endDate);
      endDateCopy.setHours(23, 59, 59, 999); // Set to end of day
      if (entryDateObj > endDateCopy) return false;
    }
    
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const exportToCSV = () => {
    let csvContent = "Date,Supplier,Invoice,Products,Quantity,Rate,Amount,Total\n";
    
    filteredEntries.forEach(entry => {
      const supplier = suppliers.find(s => s.id === entry.supplierId);
      let isFirstRow = true;
      
      entry.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const amount = item.quantity * item.rate;
        
        csvContent += isFirstRow
          ? `"${entry.date}","${supplier?.name || "Unknown"}","${entry.invoiceNumber || ""}","${product?.name || "Unknown"}","${item.quantity}","${item.rate}","${amount}","${entry.totalAmount}"\n`
          : `,,,"${product?.name || "Unknown"}","${item.quantity}","${item.rate}","${amount}",\n`;
        
        isFirstRow = false;
      });
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `purchase-history-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.click();
  };

  const handleAddItem = () => {
    setEntryItems([...entryItems, { productId: "", quantity: "", rate: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (entryItems.length === 1) return;
    const newItems = [...entryItems];
    newItems.splice(index, 1);
    setEntryItems(newItems);
  };

  const handleItemChange = (index: number, field: "productId" | "quantity" | "rate", value: string) => {
    const newItems = [...entryItems];
    newItems[index][field] = value;
    setEntryItems(newItems);
  };

  const calculateTotalAmount = () => {
    return entryItems.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      return total + (quantity * rate);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSupplierId) {
      toast.error("Please select a supplier");
      return;
    }
    
    const validItems = entryItems.filter(item => 
      item.productId && 
      !isNaN(parseFloat(item.quantity)) && 
      parseFloat(item.quantity) > 0 &&
      !isNaN(parseFloat(item.rate)) && 
      parseFloat(item.rate) > 0
    );
    
    if (validItems.length === 0) {
      toast.error("Please add at least one valid product item");
      return;
    }
    
    const stockEntryItems: StockEntryItem[] = validItems.map(item => ({
      productId: item.productId,
      quantity: parseFloat(item.quantity),
      rate: parseFloat(item.rate)
    }));
    
    const totalAmount = stockEntryItems.reduce(
      (sum, item) => sum + (item.quantity * item.rate), 
      0
    );
    
    const newEntry: Omit<StockEntry, "id"> = {
      date: format(entryDate, "yyyy-MM-dd"),
      supplierId: selectedSupplierId,
      items: stockEntryItems,
      totalAmount,
      invoiceNumber: invoiceNumber || undefined
    };
    
    addStockEntry(newEntry);
    toast.success("Purchase recorded successfully");
    
    // Reset form
    setIsAddingEntry(false);
    setEntryDate(new Date());
    setSelectedSupplierId("");
    setInvoiceNumber("");
    setEntryItems([{ productId: "", quantity: "", rate: "" }]);
  };

  return (
    <div className="space-y-6 bg-[#181A20] min-h-screen px-4 py-6 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Purchase History</h1>
          <p className="text-gray-400">Track and manage supplier purchase records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV} className="bg-[#1cd7b6] hover:bg-[#19c0a3] text-white border-0">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
            <DialogTrigger asChild>
              <Button className="bg-[#1cd7b6] hover:bg-[#19c0a3] text-white">
                <Plus className="mr-2 h-4 w-4" />
                Record Purchase
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#23252b] text-white border-0 max-w-3xl">
              <DialogHeader>
                <DialogTitle>Record New Purchase</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Enter purchase details from supplier invoice
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-white">Purchase Date</Label>
                      <div className="mt-1">
                        <DatePicker date={entryDate} setDate={setEntryDate} className="w-full" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="supplier" className="text-white">Supplier</Label>
                      <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                        <SelectTrigger id="supplier" className="mt-1 bg-[#181A20] border-[#34343A] text-white w-full">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#23252b] text-white border-[#34343A]">
                          {suppliers.map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="invoice" className="text-white">Invoice Number (Optional)</Label>
                      <Input
                        id="invoice"
                        className="mt-1 bg-[#181A20] border-[#34343A] text-white"
                        value={invoiceNumber}
                        onChange={e => setInvoiceNumber(e.target.value)}
                        placeholder="e.g., INV-12345"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-white">Purchase Items</Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddItem}
                        size="sm"
                        className="bg-[#1cd7b6] hover:bg-[#19c0a3] text-white border-0"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Item
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {entryItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-[#181A20] rounded-lg">
                          <div className="flex-1">
                            <Select value={item.productId} onValueChange={value => handleItemChange(index, "productId", value)}>
                              <SelectTrigger className="bg-[#181A20] border-[#34343A] text-white">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#23252b] text-white border-[#34343A]">
                                {products.map(product => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name} (₹{product.price}/{product.unit})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="w-24">
                            <Input
                              className="bg-[#181A20] border-[#34343A] text-white"
                              value={item.quantity}
                              onChange={e => handleItemChange(index, "quantity", e.target.value)}
                              placeholder="Qty"
                              type="number"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          
                          <div className="w-28">
                            <Input
                              className="bg-[#181A20] border-[#34343A] text-white"
                              value={item.rate}
                              onChange={e => handleItemChange(index, "rate", e.target.value)}
                              placeholder="Rate (₹)"
                              type="number"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          
                          <div className="w-28 text-right px-2">
                            ₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)}
                          </div>
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                            disabled={entryItems.length === 1}
                            className="text-gray-400 hover:text-white hover:bg-[#34343A]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end mt-4 text-xl font-bold text-[#1cd7b6]">
                      Total: ₹{calculateTotalAmount().toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingEntry(false)}
                    className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#1cd7b6] hover:bg-[#19c0a3] text-white"
                  >
                    Save Purchase
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card className="bg-[#23252b] border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-white">Purchase Records</CardTitle>
              <CardDescription className="text-gray-400">
                View all purchase records and transactions
              </CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by supplier or invoice..."
                  className="pl-8 bg-[#181A20] border-[#34343A] text-white"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <div>
                  <DatePicker 
                    date={startDate} 
                    setDate={setStartDate} 
                    placeholder="Start date"
                    className="bg-[#181A20] border-[#34343A] text-white" 
                  />
                </div>
                
                <div>
                  <DatePicker 
                    date={endDate} 
                    setDate={setEndDate} 
                    placeholder="End date"
                    className="bg-[#181A20] border-[#34343A] text-white" 
                  />
                </div>
                
                {(searchQuery || startDate || endDate) && (
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="text-gray-400 hover:text-white hover:bg-[#34343A]"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-white mb-1">No purchase records found</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery || startDate || endDate
                  ? "Try changing your search filters"
                  : "Start by recording your first purchase"}
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#1cd7b6] hover:bg-[#19c0a3] text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Record First Purchase
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {/* Same dialog content as above */}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#1A1F2C]">
                  <TableRow className="border-b border-[#34343A]">
                    <TableHead className="text-white w-[100px]">Date</TableHead>
                    <TableHead className="text-white">Supplier</TableHead>
                    <TableHead className="text-white">Invoice #</TableHead>
                    <TableHead className="text-white">Products</TableHead>
                    <TableHead className="text-white text-right">Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map(entry => {
                    const supplier = suppliers.find(s => s.id === entry.supplierId);
                    const totalProducts = entry.items.length;
                    const productNames = entry.items.map(item => {
                      const product = products.find(p => p.id === item.productId);
                      return product ? product.name : "Unknown Product";
                    });
                    
                    return (
                      <TableRow key={entry.id} className="border-b border-[#34343A] hover:bg-[#34343A]/50">
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-[#1cd7b6]" />
                            {entry.date}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {supplier?.name || "Unknown Supplier"}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {entry.invoiceNumber || "-"}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <span className="inline-flex items-center">
                            <span className="text-[#1cd7b6] font-medium mr-1">{totalProducts}</span> 
                            {totalProducts > 1 ? "items" : "item"}
                          </span>
                          <div className="text-xs text-gray-400 mt-1">
                            {productNames.slice(0, 2).join(", ")}
                            {totalProducts > 2 && `... +${totalProducts - 2} more`}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[#1cd7b6]">
                          ₹{entry.totalAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-[#1A1F2C] to-[#23252b] border-0 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Total Purchases</p>
                <h3 className="text-3xl font-bold text-white">
                  ₹{stockEntries.reduce((sum, entry) => sum + entry.totalAmount, 0).toFixed(2)}
                </h3>
              </div>
              <div className="p-3 bg-[#1cd7b6]/10 rounded-full">
                <ShoppingBag className="h-6 w-6 text-[#1cd7b6]" />
              </div>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              {stockEntries.length} transactions recorded
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-[#1A1F2C] to-[#23252b] border-0 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">This Month</p>
                <h3 className="text-3xl font-bold text-white">
                  ₹{stockEntries
                    .filter(entry => {
                      const entryDate = new Date(entry.date);
                      const now = new Date();
                      return entryDate.getMonth() === now.getMonth() && 
                             entryDate.getFullYear() === now.getFullYear();
                    })
                    .reduce((sum, entry) => sum + entry.totalAmount, 0)
                    .toFixed(2)}
                </h3>
              </div>
              <div className="p-3 bg-[#1cd7b6]/10 rounded-full">
                <Calendar className="h-6 w-6 text-[#1cd7b6]" />
              </div>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              {stockEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                const now = new Date();
                return entryDate.getMonth() === now.getMonth() && 
                       entryDate.getFullYear() === now.getFullYear();
              }).length} transactions this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-[#1A1F2C] to-[#23252b] border-0 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Top Supplier</p>
                <h3 className="text-xl font-bold text-white">
                  {(() => {
                    const supplierTotals: Record<string, number> = {};
                    stockEntries.forEach(entry => {
                      if (!supplierTotals[entry.supplierId]) {
                        supplierTotals[entry.supplierId] = 0;
                      }
                      supplierTotals[entry.supplierId] += entry.totalAmount;
                    });
                    
                    const topSupplierId = Object.entries(supplierTotals)
                      .sort((a, b) => b[1] - a[1])[0]?.[0];
                    
                    return suppliers.find(s => s.id === topSupplierId)?.name || "None";
                  })()}
                </h3>
              </div>
              <div className="p-3 bg-[#1cd7b6]/10 rounded-full">
                <ShoppingBag className="h-6 w-6 text-[#1cd7b6]" />
              </div>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              Based on purchase value
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-[#1A1F2C] to-[#23252b] border-0 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Top Product</p>
                <h3 className="text-xl font-bold text-white">
                  {(() => {
                    const productQuantities: Record<string, number> = {};
                    stockEntries.forEach(entry => {
                      entry.items.forEach(item => {
                        if (!productQuantities[item.productId]) {
                          productQuantities[item.productId] = 0;
                        }
                        productQuantities[item.productId] += item.quantity;
                      });
                    });
                    
                    const topProductId = Object.entries(productQuantities)
                      .sort((a, b) => b[1] - a[1])[0]?.[0];
                    
                    return products.find(p => p.id === topProductId)?.name || "None";
                  })()}
                </h3>
              </div>
              <div className="p-3 bg-[#1cd7b6]/10 rounded-full">
                <Package className="h-6 w-6 text-[#1cd7b6]" />
              </div>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              Based on purchase quantity
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
