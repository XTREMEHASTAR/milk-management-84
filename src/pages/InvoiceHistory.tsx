
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, Eye, Search } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Invoice } from "@/types";

export default function InvoiceHistory() {
  const { orders } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [filterStatus, setFilterStatus] = useState<string>("");

  // For demonstration, let's create a sample invoice list based on orders
  // In a real app, you'd fetch this from your data context
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Convert orders to invoices for this demo
    // In a real app, you'd have actual invoice data
    if (orders && orders.length > 0) {
      const convertedInvoices = orders.map(order => ({
        id: `INV-${order.id}`,
        orderId: order.id,
        customerName: order.customerName,
        date: order.date,
        amount: order.totalAmount,
        status: Math.random() > 0.3 ? "Paid" : "Pending",
        items: order.items
      }));
      setInvoices(convertedInvoices);
      setFilteredInvoices(convertedInvoices);
    }
  }, [orders]);

  // Filter invoices based on search query, date range, and status
  useEffect(() => {
    let filtered = [...invoices];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        inv => inv.id.toLowerCase().includes(query) || 
               inv.customerName.toLowerCase().includes(query)
      );
    }

    // Filter by date range
    if (dateRange.from) {
      filtered = filtered.filter(inv => new Date(inv.date) >= dateRange.from!);
    }
    if (dateRange.to) {
      filtered = filtered.filter(inv => new Date(inv.date) <= dateRange.to!);
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter(inv => inv.status === filterStatus);
    }

    setFilteredInvoices(filtered);
  }, [searchQuery, dateRange, filterStatus, invoices]);

  const handleDownload = (invoiceId: string) => {
    // In a real app, this would generate and download the invoice PDF
    console.log(`Downloading invoice: ${invoiceId}`);
    alert(`Invoice ${invoiceId} would be downloaded in a real app.`);
  };

  const handleView = (invoiceId: string) => {
    // In a real app, this would navigate to the invoice details page
    console.log(`Viewing invoice: ${invoiceId}`);
    alert(`Viewing invoice details for ${invoiceId} would open in a real app.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoice History</h1>
        <p className="text-muted-foreground">
          View and manage all your previously generated invoices
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            startAdornment={<Search className="h-4 w-4" />}
          />
        </div>
        
        <div className="w-full md:w-1/4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Date Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={new Date()}
                selected={{
                  from: dateRange.from,
                  to: dateRange.to
                }}
                onSelect={setDateRange as any}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="w-full md:w-1/4">
          <Select onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => {
          setSearchQuery("");
          setDateRange({ from: undefined, to: undefined });
          setFilterStatus("");
        }}>
          Reset Filters
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            {filteredInvoices.length} {filteredInvoices.length === 1 ? 'invoice' : 'invoices'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2 font-semibold">Invoice #</th>
                  <th className="p-2 font-semibold">Date</th>
                  <th className="p-2 font-semibold">Customer</th>
                  <th className="p-2 font-semibold">Amount</th>
                  <th className="p-2 font-semibold">Status</th>
                  <th className="p-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="table-row">
                      <td className="p-2 table-cell">{invoice.id}</td>
                      <td className="p-2 table-cell">{format(new Date(invoice.date), "MMM dd, yyyy")}</td>
                      <td className="p-2 table-cell">{invoice.customerName}</td>
                      <td className="p-2 table-cell">₹{invoice.amount.toFixed(2)}</td>
                      <td className="p-2 table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "Paid" ? "bg-green-100 text-green-800" : 
                          invoice.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-red-100 text-red-800"
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-2 table-cell text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleView(invoice.id)}
                          className="mr-1"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownload(invoice.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted-foreground">
                      No invoices found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
