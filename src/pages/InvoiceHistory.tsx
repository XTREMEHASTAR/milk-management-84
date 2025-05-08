
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, Eye, Trash, X, FileText } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Invoice } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import InvoiceStatusBadge from "@/components/invoices/InvoiceStatusBadge";
import InvoiceDownloadButton from "@/components/invoices/InvoiceDownloadButton";
import InvoiceTemplateSelector from "@/components/invoices/InvoiceTemplateSelector";
import { useInvoices } from "@/contexts/InvoiceContext";
import { InvoiceService } from "@/services/InvoiceService";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function InvoiceHistory() {
  const { orders, products, customers } = useData();
  const { invoices, generateInvoicePreview, deleteInvoice, selectedTemplateId, setSelectedTemplateId } = useInvoices();
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
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [customerFilter, setCustomerFilter] = useState<string>("all");

  // Filter invoices based on search query, date range, and status
  useEffect(() => {
    if (!invoices) return;
    
    setIsLoading(true);
    
    try {
      let filtered = [...invoices];
  
      // Filter by customer if selected
      if (customerFilter !== "all") {
        filtered = filtered.filter(inv => 
          inv.items.some(item => item.customerId === customerFilter)
        );
      }

      // Filter by party/group tab
      if (activeTab !== "all") {
        if (activeTab === "pending") {
          filtered = filtered.filter(inv => inv.status === "Pending" || inv.status === "Overdue");
        } else if (activeTab === "paid") {
          filtered = filtered.filter(inv => inv.status === "Paid");
        } else if (activeTab === "draft") {
          filtered = filtered.filter(inv => inv.status === "Draft");
        }
      }
  
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
  
      // Filter by status if not already filtered by tab
      if (activeTab === "all" && filterStatus !== "all") {
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
  }, [searchQuery, dateRange, filterStatus, invoices, activeTab, customerFilter]);

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

  // Get invoice counts by status for badges
  const getInvoiceCounts = () => {
    if (!invoices) return { pending: 0, paid: 0, draft: 0 };
    
    return {
      pending: invoices.filter(inv => inv.status === "Pending" || inv.status === "Overdue").length,
      paid: invoices.filter(inv => inv.status === "Paid").length,
      draft: invoices.filter(inv => inv.status === "Draft").length
    };
  };

  const counts = getInvoiceCounts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice History</h1>
          <p className="text-muted-foreground">
            View and manage all your previously generated invoices
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowTemplateDialog(true)}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Invoice Templates</span>
          </Button>
          <Button onClick={() => window.location.href = "/invoice-generator"}>
            Create New Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">
            All Invoices
            <Badge variant="secondary" className="ml-2">{invoices?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">{counts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="paid">
            Paid
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">{counts.paid}</Badge>
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts
            <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-800">{counts.draft}</Badge>
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <Input
              placeholder="Search invoices by ID, customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
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
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>
                    {filteredInvoices.length} {filteredInvoices.length === 1 ? 'invoice' : 'invoices'} found
                  </CardDescription>
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
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
        </TabsContent>

        <TabsContent value="pending" className="m-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pending Invoices</CardTitle>
              <CardDescription>
                Invoices that require payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Same table structure as above with filtered content */}
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
                      // Show filtered invoices content
                      filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-2">{invoice.id}</td>
                          <td className="p-2">{formatDate(invoice.date)}</td>
                          <td className="p-2">{invoice.customerName}</td>
                          <td className="p-2">{formatCurrency(invoice.amount)}</td>
                          <td className="p-2">
                            <InvoiceStatusBadge status={invoice.status} />
                          </td>
                          <td className="p-2 text-right">
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
                        <td colSpan={6} className="py-6 text-center text-muted-foreground">
                          No pending invoices found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid" className="m-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Paid Invoices</CardTitle>
              <CardDescription>
                Completed invoice payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Same table structure with paid invoices */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-2 font-semibold">Invoice #</th>
                      <th className="p-2 font-semibold">Date</th>
                      <th className="p-2 font-semibold">Customer</th>
                      <th className="p-2 font-semibold">Amount</th>
                      <th className="p-2 font-semibold">Payment Date</th>
                      <th className="p-2 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.length > 0 ? (
                      // Show filtered invoices content
                      filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-2">{invoice.id}</td>
                          <td className="p-2">{formatDate(invoice.date)}</td>
                          <td className="p-2">{invoice.customerName}</td>
                          <td className="p-2">{formatCurrency(invoice.amount)}</td>
                          <td className="p-2">{formatDate(invoice.paymentDate)}</td>
                          <td className="p-2 text-right">
                            <InvoiceDownloadButton 
                              invoiceId={invoice.id} 
                              variant="ghost" 
                              size="icon" 
                              className="mr-1"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleView(invoice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-muted-foreground">
                          No paid invoices found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft" className="m-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Draft Invoices</CardTitle>
              <CardDescription>
                Invoices saved as drafts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Table for draft invoices */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-2 font-semibold">Invoice #</th>
                      <th className="p-2 font-semibold">Created</th>
                      <th className="p-2 font-semibold">Customer</th>
                      <th className="p-2 font-semibold">Amount</th>
                      <th className="p-2 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.length > 0 ? (
                      // Show filtered drafts content
                      filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-2">{invoice.id}</td>
                          <td className="p-2">{formatDate(invoice.date)}</td>
                          <td className="p-2">{invoice.customerName}</td>
                          <td className="p-2">{formatCurrency(invoice.amount)}</td>
                          <td className="p-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleView(invoice)}
                              className="mr-1"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(invoice.id)}
                              className="text-red-500"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted-foreground">
                          No draft invoices found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
          
          <DialogFooter>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Close
              </Button>
              {previewInvoice && (
                <InvoiceDownloadButton invoiceId={previewInvoice.id} />
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice Templates</DialogTitle>
            <DialogDescription>
              Choose a template for your invoices
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <InvoiceTemplateSelector 
              onSelect={(templateId) => {
                setSelectedTemplateId(templateId);
                toast.success("Template updated successfully");
              }}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
