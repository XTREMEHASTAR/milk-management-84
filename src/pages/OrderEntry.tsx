
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
import { Download, Plus, Save } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Order, OrderItem } from "@/types";

interface OrderGridCell {
  customerId: string;
  productId: string;
  quantity: string; // Using string for input, will convert to number when saving
}

const OrderEntry = () => {
  const { customers, products, addOrder } = useData();
  const [orderDate, setOrderDate] = useState<Date>(new Date());
  const [orderGrid, setOrderGrid] = useState<OrderGridCell[]>([]);
  const [customerTotals, setCustomerTotals] = useState<Record<string, { quantity: number, amount: number }>>({});
  const [productTotals, setProductTotals] = useState<Record<string, number>>({});
  
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
    const newProductTotals: Record<string, number> = {};
    
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
        
        // Add to product totals
        if (!newProductTotals[cell.productId]) {
          newProductTotals[cell.productId] = 0;
        }
        
        newProductTotals[cell.productId] += quantity;
      }
    });
    
    setCustomerTotals(newCustomerTotals);
    setProductTotals(newProductTotals);
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
    let csvContent = "Customer,";
    products.forEach(product => {
      csvContent += `${product.name},`;
    });
    csvContent += "Total Quantity,Total Amount\n";
    
    customers.forEach(customer => {
      csvContent += `${customer.name},`;
      
      products.forEach(product => {
        csvContent += `${getCellValue(customer.id, product.id) || "0"},`;
      });
      
      const customerTotal = customerTotals[customer.id] || { quantity: 0, amount: 0 };
      csvContent += `${customerTotal.quantity},${customerTotal.amount}\n`;
    });
    
    csvContent += "Total,";
    products.forEach(product => {
      csvContent += `${productTotals[product.id] || 0},`;
    });
    
    // Calculate grand totals
    const grandTotalQuantity = Object.values(customerTotals).reduce(
      (sum, customer) => sum + customer.quantity, 0
    );
    
    const grandTotalAmount = Object.values(customerTotals).reduce(
      (sum, customer) => sum + customer.amount, 0
    );
    
    csvContent += `${grandTotalQuantity},${grandTotalAmount}\n`;
    
    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `milk-order-${format(orderDate, "yyyy-MM-dd")}.csv`);
    link.click();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Entry</h1>
          <p className="text-muted-foreground">
            Create and manage daily milk orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={saveOrder}>
            <Save className="mr-2 h-4 w-4" />
            Save Order
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily Milk Order Entry</CardTitle>
            <DatePicker date={orderDate} setDate={setOrderDate} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {customers.length === 0 || products.length === 0 ? (
              <div className="p-4 text-center">
                <p className="mb-2">You need to add customers and products first.</p>
                <Button variant="outline" onClick={() => window.location.href = "/customers"}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customers
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="header-cell">Products / Customers</TableHead>
                    {customers.map(customer => (
                      <TableHead key={customer.id} className="header-cell text-center">
                        {customer.name}
                      </TableHead>
                    ))}
                    <TableHead className="header-cell text-center">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name} (₹{product.price}/{product.unit})
                      </TableCell>
                      {customers.map(customer => (
                        <TableCell key={customer.id} className="table-cell p-0">
                          <Input
                            className="cell-input"
                            type="text"
                            value={getCellValue(customer.id, product.id)}
                            onChange={(e) => handleCellChange(customer.id, product.id, e.target.value)}
                          />
                        </TableCell>
                      ))}
                      <TableCell className="total-cell text-center font-semibold">
                        {productTotals[product.id] || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="total-cell font-semibold">Total Quantity</TableCell>
                    {customers.map(customer => (
                      <TableCell key={customer.id} className="total-cell text-center">
                        {customerTotals[customer.id]?.quantity || 0}
                      </TableCell>
                    ))}
                    <TableCell className="total-cell text-center">
                      {Object.values(customerTotals).reduce(
                        (sum, customer) => sum + customer.quantity, 0
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="amount-cell font-semibold">Total Amount (₹)</TableCell>
                    {customers.map(customer => (
                      <TableCell key={customer.id} className="amount-cell text-center">
                        {customerTotals[customer.id]?.amount || 0}
                      </TableCell>
                    ))}
                    <TableCell className="amount-cell text-center">
                      {Object.values(customerTotals).reduce(
                        (sum, customer) => sum + customer.amount, 0
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderEntry;
