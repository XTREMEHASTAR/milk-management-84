
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Download, TrendingUp, FileCog } from "lucide-react";
import { format, subDays, subMonths, parseISO, isAfter } from "date-fns";
import { Customer, Product, Order, Payment, Expense } from "@/types";

const Reports = () => {
  const { customers, products, orders, payments, expenses } = useData();
  const [fromDate, setFromDate] = useState<Date>(subMonths(new Date(), 1));
  const [toDate, setToDate] = useState<Date>(new Date());
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");

  // Filter data based on date range
  const filteredOrders = orders.filter((order) => {
    const orderDate = parseISO(order.date);
    return isAfter(orderDate, fromDate) && !isAfter(orderDate, toDate);
  });

  const filteredPayments = payments.filter((payment) => {
    const paymentDate = parseISO(payment.date);
    return isAfter(paymentDate, fromDate) && !isAfter(paymentDate, toDate);
  });

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = parseISO(expense.date);
    return isAfter(expenseDate, fromDate) && !isAfter(expenseDate, toDate);
  });

  // Calculate summary data
  const totalSales = filteredOrders.reduce((total, order) => {
    return (
      total +
      order.items.reduce((orderTotal, item) => {
        const product = products.find((p) => p.id === item.productId);
        return orderTotal + (product ? item.quantity * product.price : 0);
      }, 0)
    );
  }, 0);

  const totalPayments = filteredPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const totalExpenses = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Calculate sales by customer
  const salesByCustomer: Record<string, number> = {};
  filteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (
        selectedProduct === "all" ||
        selectedProduct === item.productId
      ) {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          if (!salesByCustomer[item.customerId]) {
            salesByCustomer[item.customerId] = 0;
          }
          salesByCustomer[item.customerId] += item.quantity * product.price;
        }
      }
    });
  });

  // Calculate sales by product
  const salesByProduct: Record<string, number> = {};
  filteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (
        selectedCustomer === "all" ||
        selectedCustomer === item.customerId
      ) {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          if (!salesByProduct[item.productId]) {
            salesByProduct[item.productId] = 0;
          }
          salesByProduct[item.productId] += item.quantity * product.price;
        }
      }
    });
  });

  const exportCustomerSummary = () => {
    let csvContent = "Customer,Total Sales,Total Payments,Outstanding Balance\n";

    customers
      .filter(
        (customer) =>
          selectedCustomer === "all" || selectedCustomer === customer.id
      )
      .forEach((customer) => {
        const sales = salesByCustomer[customer.id] || 0;
        const payments = filteredPayments
          .filter((payment) => payment.customerId === customer.id)
          .reduce((total, payment) => total + payment.amount, 0);

        csvContent += `${customer.name},${sales},${payments},${customer.outstandingBalance}\n`;
      });

    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `customer-summary-${format(fromDate, "yyyy-MM-dd")}-to-${format(
        toDate,
        "yyyy-MM-dd"
      )}.csv`
    );
    link.click();
  };

  const exportProductSummary = () => {
    let csvContent = "Product,Price,Total Quantity,Total Sales\n";

    products
      .filter(
        (product) =>
          selectedProduct === "all" || selectedProduct === product.id
      )
      .forEach((product) => {
        const sales = salesByProduct[product.id] || 0;
        const quantity = filteredOrders
          .flatMap((order) => order.items)
          .filter(
            (item) =>
              item.productId === product.id &&
              (selectedCustomer === "all" ||
                selectedCustomer === item.customerId)
          )
          .reduce((total, item) => total + item.quantity, 0);

        csvContent += `${product.name},${product.price},${quantity},${sales}\n`;
      });

    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `product-summary-${format(fromDate, "yyyy-MM-dd")}-to-${format(
        toDate,
        "yyyy-MM-dd"
      )}.csv`
    );
    link.click();
  };

  const exportFinancialSummary = () => {
    let csvContent = "Category,Amount\n";
    csvContent += `Total Sales,${totalSales}\n`;
    csvContent += `Total Payments,${totalPayments}\n`;
    csvContent += `Total Expenses,${totalExpenses}\n`;
    csvContent += `Net Profit,${totalSales - totalExpenses}\n\n`;

    csvContent += "Expense Breakdown\n";
    csvContent += "Category,Amount\n";

    const expensesByCategory: Record<string, number> = {};
    filteredExpenses.forEach((expense) => {
      if (!expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] = 0;
      }
      expensesByCategory[expense.category] += expense.amount;
    });

    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      csvContent += `${category},${amount}\n`;
    });

    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `financial-summary-${format(fromDate, "yyyy-MM-dd")}-to-${format(
        toDate,
        "yyyy-MM-dd"
      )}.csv`
    );
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and view business reports and analytics
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>
            Customize your report by selecting date range and filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <div className="mb-1 text-sm font-medium">From Date</div>
              <DatePicker date={fromDate} setDate={setFromDate} />
            </div>
            <div>
              <div className="mb-1 text-sm font-medium">To Date</div>
              <DatePicker date={toDate} setDate={setToDate} />
            </div>
            <div>
              <div className="mb-1 text-sm font-medium">Customer</div>
              <Select
                value={selectedCustomer}
                onValueChange={setSelectedCustomer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="mb-1 text-sm font-medium">Product</div>
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              For selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payments Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPayments.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              For selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(totalSales - totalExpenses).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sales minus expenses for period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Customer Summary</CardTitle>
                <CardDescription>
                  Sales by customer for the selected period
                </CardDescription>
              </div>
              <Button variant="outline" onClick={exportCustomerSummary}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {Object.keys(salesByCustomer).length === 0 ? (
                <div className="flex justify-center items-center py-10">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No sales data available for the selected period
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left font-medium">Customer</th>
                          <th className="py-2 text-right font-medium">Sales</th>
                          <th className="py-2 text-right font-medium">Payments</th>
                          <th className="py-2 text-right font-medium">Outstanding</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(salesByCustomer)
                          .sort((a, b) => b[1] - a[1])
                          .map(([customerId, sales]) => {
                            const customer = customers.find((c) => c.id === customerId);
                            if (!customer) return null;

                            const payments = filteredPayments
                              .filter((payment) => payment.customerId === customerId)
                              .reduce((total, payment) => total + payment.amount, 0);

                            return (
                              <tr key={customerId} className="border-b">
                                <td className="py-2">{customer.name}</td>
                                <td className="py-2 text-right">₹{sales.toFixed(2)}</td>
                                <td className="py-2 text-right">₹{payments.toFixed(2)}</td>
                                <td className="py-2 text-right">₹{customer.outstandingBalance.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Product Summary</CardTitle>
                <CardDescription>
                  Sales by product for the selected period
                </CardDescription>
              </div>
              <Button variant="outline" onClick={exportProductSummary}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {Object.keys(salesByProduct).length === 0 ? (
                <div className="flex justify-center items-center py-10">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No sales data available for the selected period
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left font-medium">Product</th>
                          <th className="py-2 text-right font-medium">Price</th>
                          <th className="py-2 text-right font-medium">Quantity</th>
                          <th className="py-2 text-right font-medium">Total Sales</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(salesByProduct)
                          .sort((a, b) => b[1] - a[1])
                          .map(([productId, sales]) => {
                            const product = products.find((p) => p.id === productId);
                            if (!product) return null;

                            const quantity = filteredOrders
                              .flatMap((order) => order.items)
                              .filter(
                                (item) =>
                                  item.productId === productId &&
                                  (selectedCustomer === "all" ||
                                    selectedCustomer === item.customerId)
                              )
                              .reduce((total, item) => total + item.quantity, 0);

                            return (
                              <tr key={productId} className="border-b">
                                <td className="py-2">{product.name}</td>
                                <td className="py-2 text-right">₹{product.price}</td>
                                <td className="py-2 text-right">{quantity}</td>
                                <td className="py-2 text-right">₹{sales.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>
                  Financial overview for the selected period
                </CardDescription>
              </div>
              <Button variant="outline" onClick={exportFinancialSummary}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Income & Expense Summary</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Total Sales</td>
                            <td className="py-2 text-right">₹{totalSales.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Total Payments Received</td>
                            <td className="py-2 text-right">₹{totalPayments.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Total Expenses</td>
                            <td className="py-2 text-right">₹{totalExpenses.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Net Profit</td>
                            <td className="py-2 text-right font-bold text-green-600">
                              ₹{(totalSales - totalExpenses).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Expense Breakdown</h3>
                    {filteredExpenses.length === 0 ? (
                      <div className="flex justify-center items-center py-10">
                        <div className="text-center">
                          <FileCog className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground text-sm">
                            No expenses for this period
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="py-2 text-left font-medium">Category</th>
                              <th className="py-2 text-right font-medium">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const expensesByCategory: Record<string, number> = {};
                              filteredExpenses.forEach((expense) => {
                                if (!expensesByCategory[expense.category]) {
                                  expensesByCategory[expense.category] = 0;
                                }
                                expensesByCategory[expense.category] += expense.amount;
                              });

                              return Object.entries(expensesByCategory)
                                .sort((a, b) => b[1] - a[1])
                                .map(([category, amount]) => (
                                  <tr key={category} className="border-b">
                                    <td className="py-2">{category}</td>
                                    <td className="py-2 text-right">₹{amount.toFixed(2)}</td>
                                  </tr>
                                ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
