
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
import { useInvoices } from "@/contexts/InvoiceContext";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

// Create a component to display invoice status with appropriate styling
const InvoiceStatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Paid':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case 'Pending':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case 'Overdue':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case 'Draft':
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      case 'Cancelled':
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 line-through";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

// Create a download button component for invoices
const InvoiceDownloadButton = ({ 
  invoiceId, 
  variant = "default", 
  size = "default"
}: { 
  invoiceId: string, 
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link", 
  size?: "default" | "sm" | "lg" | "icon" 
}) => {
  const { downloadInvoice } = useInvoices();
  const [loading, setLoading] = useState(false);
  
  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadInvoice(invoiceId);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleDownload} 
      disabled={loading}
    >
      {size === "icon" ? (
        <Download className="h-4 w-4" />
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download
        </>
      )}
    </Button>
  );
};

export default function InvoiceHistory() {
  const { products } = useData();
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
  const [isLoading, setIsLoading] = useState(false);

  // Filter invoices based on search query, date range, and status
  useEffect(() => {
    if (!invoices) return;
    
    setIsLoading(true);
    
    try {
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
      if (dateRange && dateRange.from) {
        filtered = filtered.filter(inv => {
          const invDate = new Date(inv.date);
          return invDate >= dateRange.from!;
        });
      }
      
      if (dateRange && dateRange.to) {
        filtered = filtered.filter(inv => {
          const invDate = new Date(inv.date);
          return invDate <= dateRange.to!;
        });
      }
  
      // Filter by status
      if (filterStatus !== "all") {
        filtered = filtered.filter(inv => inv.status === filterStatus);
      }
  
      // Sort by date, newest first
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setFilteredInvoices(filtered);
    } catch (error) {
      console.error("Error filtering invoices:", error);
      toast.error("Error filtering invoices");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, dateRange, filterStatus, invoices]);

  // Show preview of the invoice
  const handleView = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
    try {
      const previewUrl = generateInvoicePreview(invoice);
      setPreviewUrl(previewUrl);
      setPreviewOpen(true);
    } catch (error) {
      console.error("Error generating invoice preview:", error);
      toast.error("Error generating invoice preview");
    }
  };
  
  // Handle invoice deletion
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(id);
      toast.success(`Invoice ${id} deleted successfully`);
    }
  };

  // Helper function to safely format currency 
  const formatCurrency = (amount: number | undefined): string => {
    if (amount === undefined) return "₹0.00";
    return `₹${amount.toFixed(2)}`;
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

  // Safe calendar date display text
  const calendarDateRangeText = () => {
    if (!dateRange) return <span>Date Range</span>;
    
    if (dateRange.from) {
      if (dateRange.to) {
        return (
          <>
            {formatCalendarDate(dateRange.from)} - {formatCalendarDate(dateRange.to)}
          </>
        );
      }
      return formatCalendarDate(dateRange.from);
    }
    
    return <span>Date Range</span>;
  };
  
  // Helper function to safely format date from calendar component
  const formatCalendarDate = (date: Date | undefined): string => {
    if (!date) return "";
    try {
      return format(date, "LLL dd, y");
    } catch (error) {
      console.error("Error formatting calendar date:", error);
      return "";
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
                {calendarDateRangeText()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={new Date()}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
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
              {previewInvoice?.customerName || "Unknown"} • {previewInvoice && formatDate(previewInvoice.date)}
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
