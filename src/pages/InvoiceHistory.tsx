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
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

export default function InvoiceHistory() {
  const { orders, products } = useData();
  const { invoices, generateInvoicePreview, deleteInvoice } = useInvoices();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [companyInfo, setCompanyInfo] = useState(() => InvoiceService.getCompanyInfo());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      applyFilters();
      setIsLoading(false);
    }, 200);
  }, [invoices, searchQuery, dateRange, filterStatus]);

  const applyFilters = () => {
    let results = [...invoices];

    // Apply search query filter
    if (searchQuery) {
      results = results.filter(invoice =>
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateRange?.from && dateRange?.to) {
      results = results.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        const fromDate = dateRange.from;
        const toDate = dateRange.to;
        return invoiceDate >= fromDate && invoiceDate <= toDate;
      });
    }

    // Apply status filter
    if (filterStatus !== "all") {
      results = results.filter(invoice => invoice.status === filterStatus);
    }

    setFilteredInvoices(results);
  };

  const handleView = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
    const preview = generateInvoicePreview(
      invoice,
      companyInfo,
      products,
    );
    setPreviewUrl(preview);
    setPreviewOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    toast.success(`Invoice ${id} deleted successfully`);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Helper function to safely format date
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoice History</h1>
        <p className="text-muted-foreground">
          View and manage all your previously generated invoices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="search"
          placeholder="Search invoice..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={format(dateRange?.from as Date, 'MMM dd, yyyy') + " - " + format(dateRange?.to as Date, 'MMM dd, yyyy') || "Pick a date"}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{dateRange?.from ? format(dateRange?.from as Date, 'MMM dd, yyyy') + " - " + format(dateRange?.to as Date, 'MMM dd, yyyy') : "Pick a date"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={new Date()}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
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
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      Loading invoices...
                    </td>
                  </tr>
                ) : filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2 table-cell">{invoice.id}</td>
                      <td className="p-2 table-cell">{formatDate(invoice.date)}</td>
                      <td className="p-2 table-cell">{invoice.customerName || "-"}</td>
                      <td className="p-2 table-cell">{invoice.orderId || "-"}</td>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(invoice.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
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

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Invoice Preview</span>
              <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              This is a preview of the invoice.
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
            <InvoiceDownloadButton invoiceId={previewInvoice?.id || ""} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
