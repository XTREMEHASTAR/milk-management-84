
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, Eye, Trash, X } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Invoice } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import InvoiceStatusBadge from "@/components/invoices/InvoiceStatusBadge";
import InvoiceDownloadButton from "@/components/invoices/InvoiceDownloadButton";
import { useInvoices } from "@/contexts/InvoiceContext";
import { InvoiceService } from "@/services/InvoiceService";

export default function InvoiceHistory() {
  const { orders, products } = useData();
  const { invoices, generateInvoicePreview } = useInvoices();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [companyInfo, setCompanyInfo] = useState(() => InvoiceService.getCompanyInfo());

  // Filter invoices based on search query, date range, and status
  useEffect(() => {
    if (!invoices) return;
    
    let filtered = [...invoices];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        inv => inv.id.toLowerCase().includes(query) || 
               (inv.customerName && inv.customerName.toLowerCase().includes(query)) ||
               (inv.orderId && inv.orderId.toLowerCase().includes(query))
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
    if (filterStatus !== "all") {
      filtered = filtered.filter(inv => inv.status === filterStatus);
    }

    setFilteredInvoices(filtered);
  }, [searchQuery, dateRange, filterStatus, invoices]);

  // Show preview of the invoice
  const handleView = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
    const previewUrl = generateInvoicePreview(invoice);
    setPreviewUrl(previewUrl);
    setPreviewOpen(true);
  };

  // Helper function to safely format currency 
  const formatCurrency = (amount: number | undefined): string => {
    return amount !== undefined ? `₹${amount.toFixed(2)}` : "₹0.00";
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
            placeholder="Search invoices by ID, customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
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
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => {
          setSearchQuery("");
          setDateRange({ from: undefined, to: undefined });
          setFilterStatus("all");
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
                  <th className="p-2 font-semibold">Order ID</th>
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
                      <td className="p-2 table-cell">{invoice.orderId}</td>
                      <td className="p-2 table-cell">{formatCurrency(invoice.amount)}</td>
                      <td className="p-2 table-cell">
                        <InvoiceStatusBadge status={invoice.status} />
                      </td>
                      <td className="p-2 table-cell text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleView(invoice)}
                          className="mr-1"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <InvoiceDownloadButton 
                          invoiceId={invoice.id} 
                          variant="ghost" 
                          size="icon" 
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      No invoices found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Invoice Preview: {previewInvoice?.id}</span>
              <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              {previewInvoice?.customerName} • {previewInvoice && format(new Date(previewInvoice.date), "MMMM dd, yyyy")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="w-full aspect-[1/1.414] bg-white">
            {previewUrl ? (
              <iframe 
                src={previewUrl} 
                className="w-full h-full border-0" 
                title="Invoice Preview"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                Loading preview...
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            {previewInvoice && (
              <InvoiceDownloadButton invoiceId={previewInvoice.id} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
