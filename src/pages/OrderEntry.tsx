
import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Download, 
  Plus, 
  Save, 
  UserPlus, 
  Edit, 
  Trash2, 
  PackagePlus,
  FileSpreadsheet,
  Users,
  Truck
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order, OrderItem, Customer, Product, Vehicle, Salesman } from "@/types";

interface OrderGridCell {
  customerId: string;
  productId: string;
  quantity: string; // Using string for input, will convert to number when saving
}

type GroupBy = "none" | "vehicle" | "salesman" | "area";

interface GroupedCustomers {
  id: string;
  name: string;
  customers: Customer[];
}

const OrderEntry = () => {
  const { 
    customers, 
    products, 
    addOrder, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer,
    addProduct,
    updateProduct,
    deleteProduct,
    vehicles,
    salesmen
  } = useData();
  
  const [orderDate, setOrderDate] = useState<Date>(new Date());
  const [orderGrid, setOrderGrid] = useState<OrderGridCell[]>([]);
  const [customerTotals, setCustomerTotals] = useState<Record<string, { quantity: number, amount: number }>>({});
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [groupedCustomers, setGroupedCustomers] = useState<GroupedCustomers[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);
  
  // Customer form state
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerArea, setCustomerArea] = useState("");
  const [customerVehicleId, setCustomerVehicleId] = useState("");
  const [customerSalesmanId, setCustomerSalesmanId] = useState("");
  
  // Product form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productUnit, setProductUnit] = useState("L");
  const [productDescription, setProductDescription] = useState("");
  
  // Initialize the grid with empty cells for each customer/product combination
  useEffect(() => {
    const initialGrid: OrderGridCell[] = [];
    
    filteredCustomers.forEach(customer => {
      products.forEach(product => {
        initialGrid.push({
          customerId: customer.id,
          productId: product.id,
          quantity: ""
        });
      });
    });
    
    setOrderGrid(initialGrid);
  }, [filteredCustomers, products]);
  
  // Calculate totals when orderGrid changes
  useEffect(() => {
    const newCustomerTotals: Record<string, { quantity: number, amount: number }> = {};
    
    orderGrid.forEach(cell => {
      if (cell.quantity && !isNaN(Number(cell.quantity))) {
        const quantity = Number(cell.quantity);
        const product = products.find(p => p.id === cell.productId);
        
        // Add to customer totals
        if (!newCustomerTotals[cell.customerId]) {
          newCustomerTotals[cell.customerId] = { quantity: 0, amount: 0 };
        }
        
        newCustomerTotals[cell.customerId].quantity += quantity;
        if (product) {
          newCustomerTotals[cell.customerId].amount += quantity * product.price;
        }
      }
    });
    
    setCustomerTotals(newCustomerTotals);
  }, [orderGrid, products]);

  // Group customers when groupBy changes
  useEffect(() => {
    const groups: GroupedCustomers[] = [];
    
    if (groupBy === "none") {
      setFilteredCustomers(customers);
      return;
    }
    
    // Get unique areas, vehicles, or salesmen
    if (groupBy === "area") {
      const uniqueAreas = Array.from(new Set(customers.map(c => c.area || "Unassigned")));
      uniqueAreas.forEach(area => {
        groups.push({
          id: area,
          name: area,
          customers: customers.filter(c => (c.area || "Unassigned") === area)
        });
      });
    } else if (groupBy === "vehicle") {
      vehicles.forEach(vehicle => {
        groups.push({
          id: vehicle.id,
          name: `${vehicle.name} (${vehicle.regNumber})`,
          customers: customers.filter(c => c.vehicleId === vehicle.id)
        });
      });
      // Add unassigned customers
      groups.push({
        id: "unassigned",
        name: "Unassigned",
        customers: customers.filter(c => !c.vehicleId)
      });
    } else if (groupBy === "salesman") {
      salesmen.forEach(salesman => {
        groups.push({
          id: salesman.id,
          name: salesman.name,
          customers: customers.filter(c => c.salesmanId === salesman.id)
        });
      });
      // Add unassigned customers
      groups.push({
        id: "unassigned",
        name: "Unassigned",
        customers: customers.filter(c => !c.salesmanId)
      });
    }
    
    setGroupedCustomers(groups);
    
    // If no group is selected, select the first one
    if (!selectedGroup && groups.length > 0) {
      setSelectedGroup(groups[0].id);
      setFilteredCustomers(groups[0].customers);
    } else if (selectedGroup) {
      const selectedGroupData = groups.find(g => g.id === selectedGroup);
      if (selectedGroupData) {
        setFilteredCustomers(selectedGroupData.customers);
      } else if (groups.length > 0) {
        setSelectedGroup(groups[0].id);
        setFilteredCustomers(groups[0].customers);
      } else {
        setFilteredCustomers([]);
      }
    } else {
      setFilteredCustomers([]);
    }
  }, [groupBy, customers, vehicles, salesmen, selectedGroup]);
  
  const handleCellChange = (customerId: string, productId: string, value: string) => {
    // Only allow numbers
    if (value !== "" && !/^\d+(\.\d{0,2})?$/.test(value)) {
      return;
    }
    
    setOrderGrid(prevGrid => 
      prevGrid.map(cell => 
        cell.customerId === customerId && cell.productId === productId
          ? { ...cell, quantity: value }
          : cell
      )
    );
  };
  
  const getCellValue = (customerId: string, productId: string): string => {
    const cell = orderGrid.find(
      cell => cell.customerId === customerId && cell.productId === productId
    );
    return cell ? cell.quantity : "";
  };
  
  const saveOrder = () => {
    // Filter out empty cells
    const orderItems: OrderItem[] = orderGrid
      .filter(cell => cell.quantity && !isNaN(Number(cell.quantity)) && Number(cell.quantity) > 0)
      .map(cell => ({
        customerId: cell.customerId,
        productId: cell.productId,
        quantity: Number(cell.quantity)
      }));
    
    if (orderItems.length === 0) {
      toast.error("No order items to save");
      return;
    }
    
    const newOrder: Omit<Order, "id"> = {
      date: format(orderDate, "yyyy-MM-dd"),
      items: orderItems,
      vehicleId: groupBy === "vehicle" ? selectedGroup !== "unassigned" ? selectedGroup : undefined : undefined,
      salesmanId: groupBy === "salesman" ? selectedGroup !== "unassigned" ? selectedGroup : undefined : undefined
    };
    
    addOrder(newOrder);
    toast.success("Order saved successfully");
    
    // Clear the grid after saving
    setOrderGrid(prevGrid => 
      prevGrid.map(cell => ({ ...cell, quantity: "" }))
    );
  };
  
  const exportToCSV = () => {
    // Generate CSV content
    let csvContent = "Product,";
    filteredCustomers.forEach(customer => {
      csvContent += `${customer.name},`;
    });
    csvContent += "Total Quantity,Total Amount\n";
    
    products.forEach(product => {
      csvContent += `${product.name},`;
      
      let productTotal = 0;
      filteredCustomers.forEach(customer => {
        const cellValue = getCellValue(customer.id, product.id);
        csvContent += `${cellValue || "0"},`;
        productTotal += cellValue ? Number(cellValue) : 0;
      });
      
      csvContent += `${productTotal},\n`;
    });
    
    // Calculate grand totals
    const grandTotalQuantity = Object.values(customerTotals).reduce(
      (sum, customer) => sum + customer.quantity, 0
    );
    
    const grandTotalAmount = Object.values(customerTotals).reduce(
      (sum, customer) => sum + customer.amount, 0
    );
    
    csvContent += `Total,,${grandTotalQuantity},${grandTotalAmount}\n`;

    // Add group information
    if (groupBy !== "none" && selectedGroup) {
      const groupInfo = groupedCustomers.find(g => g.id === selectedGroup);
      if (groupInfo) {
        csvContent += `\n${groupBy === "vehicle" ? "Vehicle" : groupBy === "salesman" ? "Salesman" : "Area"}: ${groupInfo.name}\n`;
      }
    }
    
    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `milk-order-${format(orderDate, "yyyy-MM-dd")}${groupBy !== "none" ? `-${groupBy}` : ""}.csv`);
    link.click();
  };

  // Customer CRUD operations
  const handleAddCustomer = () => {
    if (!customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }

    const newCustomer = {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      address: customerAddress.trim(),
      area: customerArea.trim(),
      vehicleId: customerVehicleId || undefined,
      salesmanId: customerSalesmanId || undefined,
      outstandingBalance: 0
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, newCustomer);
      toast.success("Customer updated successfully");
    } else {
      addCustomer(newCustomer);
      toast.success("Customer added successfully");
    }

    // Reset form
    resetCustomerForm();
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone || "");
    setCustomerAddress(customer.address || "");
    setCustomerArea(customer.area || "");
    setCustomerVehicleId(customer.vehicleId || "");
    setCustomerSalesmanId(customer.salesmanId || "");
    setIsAddingCustomer(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm("Are you sure you want to delete this customer? This cannot be undone.")) {
      deleteCustomer(customerId);
      toast.success("Customer deleted successfully");
    }
  };

  const resetCustomerForm = () => {
    setIsAddingCustomer(false);
    setEditingCustomer(null);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerArea("");
    setCustomerVehicleId("");
    setCustomerSalesmanId("");
  };

  // Product CRUD operations
  const handleAddProduct = () => {
    if (!productName.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!productPrice.trim() || isNaN(Number(productPrice))) {
      toast.error("Product price must be a valid number");
      return;
    }

    const newProduct = {
      name: productName.trim(),
      price: Number(productPrice),
      description: productDescription.trim() || productCategory.trim(),
      unit: productUnit.trim() || "L",
      category: productCategory.trim() || "Other",
      sku: `${productName.trim().substring(0, 4).toUpperCase()}-${Date.now().toString().substring(9)}`
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, newProduct);
      toast.success("Product updated successfully");
    } else {
      addProduct(newProduct);
      toast.success("Product added successfully");
    }

    // Reset form
    resetProductForm();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductPrice(product.price.toString());
    setProductCategory(product.description || "");
    setProductUnit(product.unit || "L");
    setProductDescription(product.description || "");
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      deleteProduct(productId);
      toast.success("Product deleted successfully");
    }
  };

  const resetProductForm = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
    setProductName("");
    setProductPrice("");
    setProductCategory("");
    setProductUnit("L");
    setProductDescription("");
  };

  // Get all unique areas for dropdown
  const allAreas = Array.from(new Set(customers.map(c => c.area).filter(Boolean) as string[]));
  
  return (
    <div className="space-y-6 bg-[#181A20] min-h-screen px-2 py-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1" style={{letterSpacing: '-1px'}}>Daily Milk<br/>Order Entry</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportToCSV} variant="default" className="bg-[#1cd7b6] text-white">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={saveOrder} variant="default" className="bg-[#1cd7b6] text-white">
            <Save className="mr-2 h-4 w-4" />
            Save Order
          </Button>
        </div>
      </div>

      <Card className="bg-[#181A20] rounded-2xl shadow-lg border-0 mt-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              <DatePicker date={orderDate} setDate={setOrderDate} />
              <div className="flex items-center gap-2">
                <Label htmlFor="groupby" className="text-white">Group By:</Label>
                <Select
                  value={groupBy}
                  onValueChange={(value: GroupBy) => {
                    setGroupBy(value);
                    setSelectedGroup(null);
                  }}
                >
                  <SelectTrigger id="groupby" className="w-[180px] bg-[#23252b] text-white border-0">
                    <SelectValue placeholder="Select grouping" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#23252b] text-white border-[#34343A]">
                    <SelectItem value="none">No Grouping</SelectItem>
                    <SelectItem value="vehicle">By Vehicle</SelectItem>
                    <SelectItem value="salesman">By Salesman</SelectItem>
                    <SelectItem value="area">By Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {groupBy !== "none" && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="selectedGroup" className="text-white">{
                    groupBy === "vehicle" ? "Vehicle:" :
                    groupBy === "salesman" ? "Salesman:" :
                    "Area:"
                  }</Label>
                  <Select
                    value={selectedGroup || ""}
                    onValueChange={(value) => setSelectedGroup(value)}
                  >
                    <SelectTrigger id="selectedGroup" className="w-[200px] bg-[#23252b] text-white border-0">
                      <SelectValue placeholder={`Select ${groupBy}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#23252b] text-white border-[#34343A]">
                      {groupedCustomers.map(group => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.customers.length})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="rounded-full px-4 py-2 font-medium">
                    <UserPlus className="mr-2" /> Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#23252b] text-white border-0">
                  <DialogHeader>
                    <DialogTitle>{editingCustomer ? "Edit Customer" : "Add Customer"}</DialogTitle>
                    <DialogDescription>
                      {editingCustomer ? "Update customer details" : "Add a new customer to your list"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Customer Name</Label>
                      <Input
                        id="name"
                        className="bg-[#181A20] border-[#34343A] text-white"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        className="bg-[#181A20] border-[#34343A] text-white"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        className="bg-[#181A20] border-[#34343A] text-white"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="area">Area/Zone</Label>
                      <Select value={customerArea} onValueChange={setCustomerArea}>
                        <SelectTrigger id="area" className="bg-[#181A20] border-[#34343A] text-white">
                          <SelectValue placeholder="Select area or enter new" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#23252b] text-white border-[#34343A]">
                          <SelectItem value="">None</SelectItem>
                          {allAreas.map(area => (
                            <SelectItem key={area} value={area}>{area}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!allAreas.includes(customerArea) && customerArea && (
                        <p className="text-xs text-[#1cd7b6]">New area will be created</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="vehicle">Assign Vehicle</Label>
                      <Select value={customerVehicleId} onValueChange={setCustomerVehicleId}>
                        <SelectTrigger id="vehicle" className="bg-[#181A20] border-[#34343A] text-white">
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#23252b] text-white border-[#34343A]">
                          <SelectItem value="">None</SelectItem>
                          {vehicles.map(vehicle => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.name} ({vehicle.regNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="salesman">Assign Salesman</Label>
                      <Select value={customerSalesmanId} onValueChange={setCustomerSalesmanId}>
                        <SelectTrigger id="salesman" className="bg-[#181A20] border-[#34343A] text-white">
                          <SelectValue placeholder="Select salesman" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#23252b] text-white border-[#34343A]">
                          <SelectItem value="">None</SelectItem>
                          {salesmen.map(salesman => (
                            <SelectItem key={salesman.id} value={salesman.id}>
                              {salesman.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={resetCustomerForm}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCustomer} className="bg-[#1cd7b6] text-white hover:bg-[#19c0a3]">
                      {editingCustomer ? "Update Customer" : "Add Customer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="rounded-full px-4 py-2 font-medium">
                    <PackagePlus className="mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#23252b] text-white border-0">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                    <DialogDescription>
                      {editingProduct ? "Update product details" : "Add a new product to your list"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        className="bg-[#181A20] border-[#34343A] text-white"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="productPrice">Price (₹)</Label>
                      <Input
                        id="productPrice"
                        className="bg-[#181A20] border-[#34343A] text-white"
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="productCategory">Category</Label>
                        <Input
                          id="productCategory"
                          className="bg-[#181A20] border-[#34343A] text-white"
                          value={productCategory}
                          onChange={(e) => setProductCategory(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="productUnit">Unit</Label>
                        <Input
                          id="productUnit"
                          className="bg-[#181A20] border-[#34343A] text-white"
                          value={productUnit}
                          onChange={(e) => setProductUnit(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="productDescription">Description (Optional)</Label>
                      <Textarea
                        id="productDescription"
                        className="bg-[#181A20] border-[#34343A] text-white"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={resetProductForm}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddProduct} className="bg-[#1cd7b6] text-white hover:bg-[#19c0a3]">
                      {editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            {groupBy !== "none" && selectedGroup && (
              <div className="mb-6 bg-[#2a2d33] p-4 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-1">
                  {groupBy === "vehicle" ? (
                    <><Truck className="inline-block mr-2" size={20} /> Vehicle:</>
                  ) : groupBy === "salesman" ? (
                    <><Users className="inline-block mr-2" size={20} /> Salesman:</>
                  ) : (
                    <><UserPlus className="inline-block mr-2" size={20} /> Area:</>
                  )}
                  <span className="ml-2 text-[#1cd7b6]">
                    {groupedCustomers.find(g => g.id === selectedGroup)?.name}
                  </span>
                </h3>
                <p className="text-gray-400">
                  {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} in this group
                </p>
              </div>
            )}
            
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-white mb-2">Customers</h3>
              <div className="flex flex-wrap gap-2">
                {filteredCustomers.map(customer => (
                  <div key={customer.id} className="flex items-center px-5 py-2 bg-white text-gray-900 rounded-2xl shadow border border-gray-200 font-semibold text-base">
                    <span>{customer.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-destructive hover:bg-red-100 rounded-full"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                {filteredCustomers.length === 0 && (
                  <p className="text-gray-400">No customers in this group. Please select a different group or add customers to this group.</p>
                )}
              </div>
            </div>
            
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-white mb-2">Products</h3>
              <div className="flex flex-wrap gap-2">
                {products.map(product => (
                  <div key={product.id} className="flex items-center px-5 py-2 bg-white text-gray-900 rounded-2xl shadow border border-gray-200 font-semibold text-base">
                    <div>
                      {product.name}
                      <div className="text-xs text-gray-500">₹{product.price}/{product.unit}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-destructive hover:bg-red-100 rounded-full"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            {filteredCustomers.length > 0 && (
              <div className="overflow-x-auto bg-[#1F2227] rounded-xl shadow border-0 ring-0 px-2 py-3">
                <Table className="text-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white bg-transparent border-b-2 border-[#34343A] font-bold text-lg">Products</TableHead>
                      {filteredCustomers.map(customer => (
                        <TableHead key={customer.id} className="text-white text-center bg-transparent border-b-2 border-[#34343A] font-bold text-lg">{customer.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id} className="border-b border-[#23252b]">
                        <TableCell className="font-medium bg-transparent text-white">{product.name} (₹{product.price}/{product.unit})</TableCell>
                        {filteredCustomers.map(customer => (
                          <TableCell key={customer.id} className="p-0 bg-[#181A20]">
                            <Input
                              className="bg-[#23252b] text-white focus:ring-2 focus:ring-[#1cd7b6] rounded-lg px-3 py-2"
                              type="text"
                              value={getCellValue(customer.id, product.id)}
                              onChange={(e) => handleCellChange(customer.id, product.id, e.target.value)}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-semibold bg-transparent">Total Quantity</TableCell>
                      {filteredCustomers.map(customer => (
                        <TableCell key={customer.id} className="text-center bg-transparent">{customerTotals[customer.id]?.quantity || 0}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold bg-transparent">Total Amount (₹)</TableCell>
                      {filteredCustomers.map(customer => (
                        <TableCell key={customer.id} className="text-center bg-transparent">{customerTotals[customer.id]?.amount || 0}</TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderEntry;
