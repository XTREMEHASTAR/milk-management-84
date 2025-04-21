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
  PackagePlus
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Order, OrderItem, Customer, Product } from "@/types";

interface OrderGridCell {
  customerId: string;
  productId: string;
  quantity: string; // Using string for input, will convert to number when saving
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
    deleteProduct
  } = useData();
  
  const [orderDate, setOrderDate] = useState<Date>(new Date());
  const [orderGrid, setOrderGrid] = useState<OrderGridCell[]>([]);
  const [customerTotals, setCustomerTotals] = useState<Record<string, { quantity: number, amount: number }>>({});
  
  // Customer form state
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  
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
    
    customers.forEach(customer => {
      products.forEach(product => {
        initialGrid.push({
          customerId: customer.id,
          productId: product.id,
          quantity: ""
        });
      });
    });
    
    setOrderGrid(initialGrid);
  }, [customers, products]);
  
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
      items: orderItems
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
    customers.forEach(customer => {
      csvContent += `${customer.name},`;
    });
    csvContent += "Total Quantity,Total Amount\n";
    
    products.forEach(product => {
      csvContent += `${product.name},`;
      
      let productTotal = 0;
      customers.forEach(customer => {
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
    
    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `milk-order-${format(orderDate, "yyyy-MM-dd")}.csv`);
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
  
  return (
    <div className="space-y-6 bg-[#181A20] min-h-screen px-2 py-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1" style={{letterSpacing: '-1px'}}>Daily Milk<br/>Order Entry</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" className="bg-[#1cd7b6] text-white">Export</Button>
          <Button variant="default" className="bg-[#1cd7b6] text-white">Save Order</Button>
        </div>
      </div>

      <Card className="bg-[#181A20] rounded-2xl shadow-lg border-0 mt-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <DatePicker date={orderDate} setDate={setOrderDate} />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddingCustomer(true)} variant="secondary" className="rounded-full px-4 py-2 font-medium"><UserPlus className="mr-2" /> Add Customer</Button>
              <Button onClick={() => setIsAddingProduct(true)} variant="secondary" className="rounded-full px-4 py-2 font-medium"><PackagePlus className="mr-2" /> Add Product</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-white mb-2">Customers</h3>
              <div className="flex flex-wrap gap-2">
                {customers.map(customer => (
                  <div key={customer.id} className="flex items-center px-5 py-2 bg-white text-gray-900 rounded-2xl shadow border border-gray-200 font-semibold text-base">
                    <span>{customer.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-destructive hover:bg-red-100 rounded-full"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
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
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto bg-[#1F2227] rounded-xl shadow border-0 ring-0 px-2 py-3">
              <Table className="text-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white bg-transparent border-b-2 border-[#34343A] font-bold text-lg">Products</TableHead>
                    {customers.map(customer => (
                      <TableHead key={customer.id} className="text-white text-center bg-transparent border-b-2 border-[#34343A] font-bold text-lg">{customer.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id} className="border-b border-[#23252b]">
                      <TableCell className="font-medium bg-transparent text-white">{product.name} (₹{product.price}/{product.unit})</TableCell>
                      {customers.map(customer => (
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
                    {customers.map(customer => (
                      <TableCell key={customer.id} className="text-center bg-transparent">{customerTotals[customer.id]?.quantity || 0}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold bg-transparent">Total Amount (₹)</TableCell>
                    {customers.map(customer => (
                      <TableCell key={customer.id} className="text-center bg-transparent">{customerTotals[customer.id]?.amount || 0}</TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderEntry;
