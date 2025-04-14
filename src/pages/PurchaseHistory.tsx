
import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { StockEntry, Supplier } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  CalendarIcon, 
  Download, 
  FileText, 
  PackageOpen, 
  Truck 
} from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// This component would normally fetch from a real API
// For demo purposes, we'll generate some stock entries
const demoStockEntries: StockEntry[] = [
  {
    id: "se1",
    date: "2025-04-10",
    supplierId: "s1",
    items: [
      { productId: "p1", quantity: 50, rate: 50 },
      { productId: "p2", quantity: 30, rate: 58 },
    ],
    totalAmount: 4240,
    invoiceNumber: "INV-2025-001",
  },
  {
    id: "se2",
    date: "2025-04-05",
    supplierId: "s2",
    items: [
      { productId: "p4", quantity: 40, rate: 54 },
      { productId: "p5", quantity: 25, rate: 60 },
    ],
    totalAmount: 3660,
    invoiceNumber: "INV-2025-002",
  },
  {
    id: "se3",
    date: "2025-04-01",
    supplierId: "s1",
    items: [
      { productId: "p1", quantity: 60, rate: 50 },
      { productId: "p3", quantity: 35, rate: 68 },
    ],
    totalAmount: 5380,
    invoiceNumber: "INV-2025-003",
  },
];

const PurchaseHistory = () => {
  const { suppliers, products } = useData();
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [stockEntries] = useState<StockEntry[]>(demoStockEntries);

  // Get the selected supplier
  const selectedSupplier = selectedSupplierId
    ? suppliers.find((s) => s.id === selectedSupplierId)
    : null;

  // Get stock entries for the selected supplier
  const supplierStockEntries = selectedSupplierId
    ? stockEntries
        .filter((entry) => entry.supplierId === selectedSupplierId)
        .sort((a, b) => {
          // Sort by date (most recent first)
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
    : stockEntries.sort((a, b) => {
        // Sort by date (most recent first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

  // Filter by date if date is selected
  const filteredEntries = date
    ? supplierStockEntries.filter(
        (entry) =>
          format(new Date(entry.date), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      )
    : supplierStockEntries;

  // Calculate totals
  const totalAmount = filteredEntries.reduce(
    (sum, entry) => sum + entry.totalAmount,
    0
  );

  // Helper to get product name by ID
  const getProductName = (productId: string): string => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  // Helper to get supplier name by ID
  const getSupplierName = (supplierId: string): string => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier ? supplier.name : "Unknown Supplier";
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Purchase History Report", 14, 22);
    
    // Add supplier details if selected
    doc.setFontSize(12);
    if (selectedSupplier) {
      doc.text(`Supplier: ${selectedSupplier.name}`, 14, 32);
    } else {
      doc.text("Supplier: All Suppliers", 14, 32);
    }
    
    if (date) {
      doc.text(`Date: ${format(date, "dd/MM/yyyy")}`, 14, 38);
    } else {
      doc.text(`Date: All records`, 14, 38);
    }
    
    // Add purchase table
    const tableData = filteredEntries.map((entry) => [
      format(new Date(entry.date), "dd/MM/yyyy"),
      getSupplierName(entry.supplierId),
      entry.invoiceNumber || "-",
      entry.items.length,
      `₹${entry.totalAmount.toFixed(2)}`,
    ]);
    
    // Add total row
    tableData.push([
      "",
      "",
      "",
      "Total",
      `₹${totalAmount.toFixed(2)}`,
    ]);
    
    autoTable(doc, {
      startY: 45,
      head: [["Date", "Supplier", "Invoice #", "Items", "Amount"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [75, 75, 75] },
    });
    
    // Save the PDF
    doc.save(`Purchase_History_${selectedSupplier ? selectedSupplier.name.replace(/ /g, "_") : "All"}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Purchase History
        </h1>
        <p className="text-muted-foreground">
          Track and analyze historical purchases from suppliers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Records</CardTitle>
          <CardDescription>
            View and download purchase history with detailed product information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-6">
            <div className="space-y-2">
              <label htmlFor="supplier" className="text-sm font-medium">
                Filter by Supplier
              </label>
              <Select
                value={selectedSupplierId || ""}
                onValueChange={setSelectedSupplierId}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="All suppliers" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      <div className="flex items-center">
                        <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{supplier.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 sm:col-span-2 flex items-end">
              <div className="space-x-2 flex">
                {date && (
                  <Button
                    variant="outline"
                    onClick={() => setDate(undefined)}
                    className="mt-auto"
                  >
                    Clear Date
                  </Button>
                )}
                <Button
                  onClick={generatePDF}
                  disabled={filteredEntries.length === 0}
                  className="mt-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No purchase records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredEntries.map((entry) => (
                      <React.Fragment key={entry.id}>
                        <TableRow>
                          <TableCell>
                            {format(new Date(entry.date), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                              {getSupplierName(entry.supplierId)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                              {entry.invoiceNumber || "-"}
                            </div>
                          </TableCell>
                          <TableCell>{entry.items.length}</TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{entry.totalAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={5} className="p-0">
                            <div className="p-2">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[40%]">Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Rate (₹)</TableHead>
                                    <TableHead className="text-right">
                                      Amount (₹)
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {entry.items.map((item, index) => (
                                    <TableRow key={`${entry.id}-item-${index}`}>
                                      <TableCell>
                                        <div className="flex items-center">
                                          <PackageOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                                          {getProductName(item.productId)}
                                        </div>
                                      </TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>₹{item.rate.toFixed(2)}</TableCell>
                                      <TableCell className="text-right">
                                        ₹{(item.quantity * item.rate).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow>
                                    <TableCell
                                      colSpan={3}
                                      className="text-right font-medium"
                                    >
                                      Subtotal
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                      ₹{entry.totalAmount.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-right font-medium"
                      >
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ₹{totalAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseHistory;
