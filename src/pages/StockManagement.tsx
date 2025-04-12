
import React, { useState, useEffect } from "react";
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
import { Product, StockRecord, StockEntry, Supplier } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

export default function StockManagement() {
  const { products, suppliers, stockRecords, stockEntries, addStockRecord, addStockEntry, updateProductMinStock } = useData();
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  // Stock entry dialog state
  const [stockEntryDialogOpen, setStockEntryDialogOpen] = useState(false);
  const [newStockEntry, setNewStockEntry] = useState<{
    date: string;
    supplierId: string;
    items: {productId: string; quantity: number; rate: number}[];
  }>({
    date: format(new Date(), "yyyy-MM-dd"),
    supplierId: "",
    items: []
  });
  
  // Daily stock record dialog state
  const [stockRecordDialogOpen, setStockRecordDialogOpen] = useState(false);
  const [newStockRecord, setNewStockRecord] = useState<Omit<StockRecord, "id" | "closingStock">>({
    date: format(new Date(), "yyyy-MM-dd"),
    productId: "",
    openingStock: 0,
    received: 0,
    dispatched: 0,
    minStockLevel: 0
  });
  
  // Filters
  const [productFilter, setProductFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState({
    from: format(new Date(new Date().setDate(new Date().getDate() - 7)), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd")
  });
  
  // Min stock settings dialog
  const [minStockDialogOpen, setMinStockDialogOpen] = useState(false);
  const [minStockProduct, setMinStockProduct] = useState<{id: string, level: number}>({id: "", level: 0});

  // Add a product to stock entry
  const addProductToEntry = () => {
    setNewStockEntry(prev => ({
      ...prev,
      items: [...prev.items, {productId: "", quantity: 0, rate: 0}]
    }));
  };
  
  // Remove a product from stock entry
  const removeProductFromEntry = (index: number) => {
    setNewStockEntry(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };
  
  // Update a stock entry item
  const updateStockEntryItem = (index: number, field: keyof StockEntryItem, value: string | number) => {
    setNewStockEntry(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };
  
  // Calculate total for stock entry
  const calculateStockEntryTotal = () => {
    return newStockEntry.items.reduce((total, item) => {
      return total + (item.quantity * item.rate);
    }, 0);
  };
  
  // Submit new stock entry
  const handleNewStockEntry = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStockEntry.supplierId || newStockEntry.items.length === 0) {
      toast.error("Please select a supplier and add at least one product");
      return;
    }
    
    // Check if all items have valid data
    const validItems = newStockEntry.items.every(item => 
      item.productId && item.quantity > 0 && item.rate > 0
    );
    
    if (!validItems) {
      toast.error("Please ensure all products have valid quantity and rate");
      return;
    }
    
    // Add stock entry
    addStockEntry({
      ...newStockEntry,
      id: `se${Date.now()}`,
      totalAmount: calculateStockEntryTotal()
    });
    
    // Reset form
    setNewStockEntry({
      date: format(new Date(), "yyyy-MM-dd"),
      supplierId: "",
      items: []
    });
    
    setStockEntryDialogOpen(false);
    toast.success("Stock entry recorded successfully");
  };
  
  // Submit new stock record
  const handleNewStockRecord = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStockRecord.productId) {
      toast.error("Please select a product");
      return;
    }
    
    // Calculate closing stock
    const closingStock = newStockRecord.openingStock + newStockRecord.received - newStockRecord.dispatched;
    
    // Add stock record
    addStockRecord({
      ...newStockRecord,
      closingStock
    });
    
    // Reset form
    setNewStockRecord({
      date: format(new Date(), "yyyy-MM-dd"),
      productId: "",
      openingStock: 0,
      received: 0,
      dispatched: 0,
      minStockLevel: 0
    });
    
    setStockRecordDialogOpen(false);
    toast.success("Stock record added successfully");
  };
  
  // Save minimum stock level
  const saveMinStockLevel = () => {
    if (!minStockProduct.id || minStockProduct.level < 0) {
      toast.error("Please select a product and enter a valid minimum stock level");
      return;
    }
    
    updateProductMinStock(minStockProduct.id, minStockProduct.level);
    setMinStockDialogOpen(false);
    toast.success("Minimum stock level updated");
  };
  
  // Helper to get product by ID
  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };
  
  // Helper to get supplier by ID
  const getSupplierById = (id: string) => {
    return suppliers.find(s => s.id === id);
  };
  
  // Filter stock records
  const filteredStockRecords = stockRecords.filter(record => {
    const matchesProduct = !productFilter || record.productId === productFilter;
    const recordDate = new Date(record.date);
    const fromDate = new Date(dateRangeFilter.from);
    const toDate = new Date(dateRangeFilter.to);
    
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);
    
    const matchesDateRange = recordDate >= fromDate && recordDate <= toDate;
    
    return matchesProduct && matchesDateRange;
  });
  
  // Get stock records for a specific date
  const getStockRecordsForDate = (date: string) => {
    return stockRecords.filter(record => record.date === date);
  };
  
  // Check if a product is below minimum stock level
  const isProductBelowMinStock = (productId: string) => {
    const latestRecord = [...stockRecords]
      .filter(record => record.productId === productId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (!latestRecord || latestRecord.minStockLevel === undefined) return false;
    
    return latestRecord.closingStock < latestRecord.minStockLevel;
  };
  
  // Get latest closing stock for a product
  const getLatestClosingStock = (productId: string) => {
    const latestRecord = [...stockRecords]
      .filter(record => record.productId === productId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    return latestRecord ? latestRecord.closingStock : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <p className="text-gray-500">Monitor and manage your product inventory</p>
      </div>

      <div className="flex justify-end space-x-4">
        <Dialog open={stockEntryDialogOpen} onOpenChange={setStockEntryDialogOpen}>
          <DialogTrigger asChild>
            <Button>Record Stock Receipt</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Record Stock Receipt</DialogTitle>
              <DialogDescription>
                Enter the details of stock received from supplier
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewStockEntry}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entry-date">Date</Label>
                    <Input
                      id="entry-date"
                      type="date"
                      value={newStockEntry.date}
                      onChange={(e) => setNewStockEntry({...newStockEntry, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="entry-supplier">Supplier</Label>
                    <Select 
                      value={newStockEntry.supplierId} 
                      onValueChange={(value) => setNewStockEntry({...newStockEntry, supplierId: value})}
                    >
                      <SelectTrigger id="entry-supplier">
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
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Products</h3>
                    <Button type="button" size="sm" onClick={addProductToEntry}>
                      Add Product
                    </Button>
                  </div>
                  
                  {newStockEntry.items.length === 0 ? (
                    <div className="text-center py-4 border border-dashed rounded-md">
                      No products added. Click "Add Product" to begin.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {newStockEntry.items.map((item, index) => (
                        <div key={index} className="flex items-end gap-3 bg-gray-50 p-2 rounded-md">
                          <div className="flex-1">
                            <Label>Product</Label>
                            <Select 
                              value={item.productId} 
                              onValueChange={(value) => updateStockEntryItem(index, "productId", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map(product => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="w-24">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.quantity || ""}
                              onChange={(e) => updateStockEntryItem(index, "quantity", parseFloat(e.target.value))}
                            />
                          </div>
                          <div className="w-24">
                            <Label>Rate</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate || ""}
                              onChange={(e) => updateStockEntryItem(index, "rate", parseFloat(e.target.value))}
                            />
                          </div>
                          <div className="w-24">
                            <Label>Total</Label>
                            <div className="h-10 flex items-center px-3 bg-gray-100 rounded-md">
                              ₹{(item.quantity * item.rate).toFixed(2)}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mb-1"
                            onClick={() => removeProductFromEntry(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      
                      <div className="flex justify-end pt-2">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Total Amount</div>
                          <div className="text-lg font-bold">₹{calculateStockEntryTotal().toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Entry</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={stockRecordDialogOpen} onOpenChange={setStockRecordDialogOpen}>
          <DialogTrigger asChild>
            <Button>Record Daily Stock</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Daily Stock</DialogTitle>
              <DialogDescription>
                Enter the stock details for a product
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewStockRecord}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="record-date" className="col-span-1">Date</Label>
                  <Input
                    id="record-date"
                    type="date"
                    value={newStockRecord.date}
                    onChange={(e) => setNewStockRecord({...newStockRecord, date: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="record-product" className="col-span-1">Product</Label>
                  <Select 
                    value={newStockRecord.productId} 
                    onValueChange={(value) => setNewStockRecord({...newStockRecord, productId: value})}
                  >
                    <SelectTrigger id="record-product" className="col-span-3">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="opening-stock" className="col-span-1">Opening</Label>
                  <Input
                    id="opening-stock"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newStockRecord.openingStock || ""}
                    onChange={(e) => setNewStockRecord({...newStockRecord, openingStock: parseFloat(e.target.value)})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="received-stock" className="col-span-1">Received</Label>
                  <Input
                    id="received-stock"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newStockRecord.received || ""}
                    onChange={(e) => setNewStockRecord({...newStockRecord, received: parseFloat(e.target.value)})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dispatched-stock" className="col-span-1">Dispatched</Label>
                  <Input
                    id="dispatched-stock"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newStockRecord.dispatched || ""}
                    onChange={(e) => setNewStockRecord({...newStockRecord, dispatched: parseFloat(e.target.value)})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="min-stock" className="col-span-1">Min Level</Label>
                  <Input
                    id="min-stock"
                    type="number"
                    min="0"
                    step="1"
                    value={newStockRecord.minStockLevel || ""}
                    onChange={(e) => setNewStockRecord({...newStockRecord, minStockLevel: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="col-span-1">Closing</Label>
                  <div className="col-span-3 h-10 px-3 flex items-center bg-gray-100 rounded-md">
                    {(newStockRecord.openingStock + newStockRecord.received - newStockRecord.dispatched).toFixed(2)}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Record</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={minStockDialogOpen} onOpenChange={setMinStockDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Set Min Stock Levels</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Minimum Stock Level</DialogTitle>
              <DialogDescription>
                Set the minimum stock level for alerts
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="min-stock-product" className="col-span-1">Product</Label>
                <Select 
                  value={minStockProduct.id} 
                  onValueChange={(value) => setMinStockProduct({...minStockProduct, id: value})}
                >
                  <SelectTrigger id="min-stock-product" className="col-span-3">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="min-stock-level" className="col-span-1">Min Level</Label>
                <Input
                  id="min-stock-level"
                  type="number"
                  min="0"
                  step="1"
                  value={minStockProduct.level || ""}
                  onChange={(e) => setMinStockProduct({...minStockProduct, level: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={saveMinStockLevel}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily Stock</TabsTrigger>
          <TabsTrigger value="products">Product Stock</TabsTrigger>
          <TabsTrigger value="history">Stock History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="mt-4">
          <div className="mb-4">
            <Label htmlFor="date-select">Select Date</Label>
            <div className="flex gap-2">
              <Input
                id="date-select"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Opening</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Dispatched</TableHead>
                  <TableHead>Closing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getStockRecordsForDate(selectedDate).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No stock records for this date.
                    </TableCell>
                  </TableRow>
                ) : (
                  getStockRecordsForDate(selectedDate).map(record => {
                    const product = getProductById(record.productId);
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{product?.name || "Unknown"}</TableCell>
                        <TableCell>{record.openingStock.toFixed(2)}</TableCell>
                        <TableCell>{record.received.toFixed(2)}</TableCell>
                        <TableCell>{record.dispatched.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {record.closingStock.toFixed(2)}
                            {record.minStockLevel !== undefined && record.closingStock < record.minStockLevel && (
                              <Badge variant="destructive" className="ml-2 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Low
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="mt-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => {
                  const currentStock = getLatestClosingStock(product.id);
                  const isBelowMin = isProductBelowMinStock(product.id);
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{currentStock.toFixed(2)}</TableCell>
                      <TableCell>{product.minStockLevel || "—"}</TableCell>
                      <TableCell>
                        {isBelowMin ? (
                          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                            <AlertCircle className="h-3 w-3" />
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="w-fit">In Stock</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-64">
              <Label htmlFor="product-filter">Filter by Product</Label>
              <Select 
                value={productFilter} 
                onValueChange={setProductFilter}
              >
                <SelectTrigger id="product-filter">
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Products</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-48">
              <Label htmlFor="from-date">From Date</Label>
              <Input
                id="from-date"
                type="date"
                value={dateRangeFilter.from}
                onChange={(e) => setDateRangeFilter({...dateRangeFilter, from: e.target.value})}
              />
            </div>
            
            <div className="w-48">
              <Label htmlFor="to-date">To Date</Label>
              <Input
                id="to-date"
                type="date"
                value={dateRangeFilter.to}
                onChange={(e) => setDateRangeFilter({...dateRangeFilter, to: e.target.value})}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Opening</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Dispatched</TableHead>
                  <TableHead>Closing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStockRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No stock records found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStockRecords.map(record => {
                    const product = getProductById(record.productId);
                    return (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell className="font-medium">{product?.name || "Unknown"}</TableCell>
                        <TableCell>{record.openingStock.toFixed(2)}</TableCell>
                        <TableCell>{record.received.toFixed(2)}</TableCell>
                        <TableCell>{record.dispatched.toFixed(2)}</TableCell>
                        <TableCell>{record.closingStock.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
