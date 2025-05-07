
import { useState, useMemo } from "react";
import { useData } from "@/contexts/data/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DollarSign, FileDown, Printer, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Outstanding() {
  const { customers, orders, payments } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  const outstandingData = useMemo(() => {
    return customers.map(customer => {
      // Calculate total ordered
      const customerOrders = orders.filter(order => order.customerId === customer.id);
      const totalOrdered = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      // Calculate total paid
      const customerPayments = payments.filter(payment => payment.customerId === customer.id);
      const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      // Calculate balance
      const outstandingBalance = totalOrdered - totalPaid;
      
      // Get last payment date
      let lastPaymentDate = null;
      if (customerPayments.length > 0) {
        const lastPayment = customerPayments.reduce((latest, payment) => {
          const paymentDate = new Date(payment.date);
          const latestDate = new Date(latest.date);
          return paymentDate > latestDate ? payment : latest;
        }, customerPayments[0]);
        lastPaymentDate = new Date(lastPayment.date);
      }
      
      // Get days since last payment
      let daysSincePayment = null;
      if (lastPaymentDate) {
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastPaymentDate.getTime());
        daysSincePayment = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      
      return {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        totalOrdered,
        totalPaid,
        outstandingBalance,
        lastPaymentDate,
        daysSincePayment
      };
    }).filter(customer => {
      // Filter based on search query
      if (!searchQuery) return customer.outstandingBalance > 0; // Only show customers with outstanding balance
      
      const query = searchQuery.toLowerCase();
      return (
        customer.outstandingBalance > 0 &&
        (customer.name.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.toLowerCase().includes(query)))
      );
    }).sort((a, b) => b.outstandingBalance - a.outstandingBalance); // Sort by highest outstanding balance first
  }, [customers, orders, payments, searchQuery]);
  
  const totalOutstanding = outstandingData.reduce((sum, customer) => sum + customer.outstandingBalance, 0);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleExport = () => {
    // Export logic would go here
    alert("Export functionality to be implemented");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-indigo-400">Outstanding Amounts</h1>
        <p className="text-muted-foreground">
          Track and manage customer outstanding balances
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <DollarSign className="h-5 w-5 text-purple-500" />
              Outstanding Summary
            </CardTitle>
            <CardDescription>
              Overview of all outstanding balances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-gradient-to-br from-purple-900/80 to-indigo-900/80 p-4 text-white">
                <div className="text-sm font-medium text-purple-200">Total Outstanding</div>
                <div className="mt-2 text-2xl font-bold">₹{totalOutstanding.toFixed(2)}</div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-indigo-900/80 to-blue-900/80 p-4 text-white">
                <div className="text-sm font-medium text-indigo-200">Customers with Balance</div>
                <div className="mt-2 text-2xl font-bold">{outstandingData.length}</div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-blue-900/80 to-sky-900/80 p-4 text-white">
                <div className="text-sm font-medium text-blue-200">Average Outstanding</div>
                <div className="mt-2 text-2xl font-bold">
                  ₹{outstandingData.length ? (totalOutstanding / outstandingData.length).toFixed(2) : "0.00"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-purple-400">Outstanding Balances</CardTitle>
            <CardDescription>
              Customers with pending payments
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-[200px]"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint} size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={handleExport} size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {outstandingData.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Total Ordered</TableHead>
                    <TableHead className="text-right">Total Paid</TableHead>
                    <TableHead className="text-right">Outstanding</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outstandingData.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone || "-"}</TableCell>
                      <TableCell className="text-right">₹{customer.totalOrdered.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{customer.totalPaid.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold text-purple-500">
                        ₹{customer.outstandingBalance.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {customer.lastPaymentDate 
                          ? format(customer.lastPaymentDate, "dd/MM/yyyy")
                          : "No payments"}
                      </TableCell>
                      <TableCell>
                        {customer.daysSincePayment === null ? (
                          <Badge variant="outline">New</Badge>
                        ) : customer.daysSincePayment > 30 ? (
                          <Badge variant="destructive">Overdue</Badge>
                        ) : customer.daysSincePayment > 15 ? (
                          <Badge variant="secondary">Follow up</Badge>
                        ) : (
                          <Badge variant="outline">Recent</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No outstanding balances found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
