import { useState, useEffect, useRef } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
import { Download, FileDown, FileText, Printer } from "lucide-react";
import { format } from "date-fns";
import { Order, OrderItem } from "@/types";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface TrackItem {
  customerId: string;
  customerName: string;
  products: {
    [productId: string]: number;
  };
  totalQuantity: number;
  totalAmount: number;
}

const TrackSheet = () => {
  const { customers, products, orders } = useData();
  const [trackDate, setTrackDate] = useState<Date>(new Date());
  const [trackItems, setTrackItems] = useState<TrackItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Find order for the selected date
  useEffect(() => {
    const dateString = format(trackDate, "yyyy-MM-dd");
    const order = orders.find((o) => o.date === dateString) || null;
    setSelectedOrder(order);

    if (order) {
      generateTrackItems(order);
    } else {
      setTrackItems([]);
    }
  }, [trackDate, orders, customers, products]);

  const generateTrackItems = (order: Order) => {
    const items: TrackItem[] = [];

    // Group items by customer
    const customerItems: Record<string, OrderItem[]> = {};
    order.items.forEach((item) => {
      if (!customerItems[item.customerId]) {
        customerItems[item.customerId] = [];
      }
      customerItems[item.customerId].push(item);
    });

    // Create track items for each customer
    Object.entries(customerItems).forEach(([customerId, orderItems]) => {
      const customer = customers.find((c) => c.id === customerId);
      if (!customer) return;

      const productQuantities: Record<string, number> = {};
      let totalQuantity = 0;
      let totalAmount = 0;

      orderItems.forEach((item) => {
        productQuantities[item.productId] = item.quantity;
        totalQuantity += item.quantity;
        
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          totalAmount += item.quantity * product.price;
        }
      });

      items.push({
        customerId,
        customerName: customer.name,
        products: productQuantities,
        totalQuantity,
        totalAmount,
      });
    });

    // Sort by customer name
    items.sort((a, b) => a.customerName.localeCompare(b.customerName));
    
    setTrackItems(items);
  };

  const exportToCSV = () => {
    if (!selectedOrder) {
      toast.error("No order data available for the selected date");
      return;
    }

    // Generate CSV content
    let csvContent = "Customer,";
    products.forEach((product) => {
      csvContent += `${product.name},`;
    });
    csvContent += "Total Quantity,Total Amount\n";

    trackItems.forEach((item) => {
      csvContent += `${item.customerName},`;
      
      products.forEach((product) => {
        csvContent += `${item.products[product.id] || "0"},`;
      });
      
      csvContent += `${item.totalQuantity},${item.totalAmount}\n`;
    });

    // Calculate totals
    csvContent += "TOTAL,";
    products.forEach((product) => {
      const total = trackItems.reduce(
        (sum, item) => sum + (item.products[product.id] || 0),
        0
      );
      csvContent += `${total},`;
    });

    const grandTotalQuantity = trackItems.reduce(
      (sum, item) => sum + item.totalQuantity,
      0
    );
    
    const grandTotalAmount = trackItems.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
    
    csvContent += `${grandTotalQuantity},${grandTotalAmount}\n`;

    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `track-sheet-${format(trackDate, "yyyy-MM-dd")}.csv`);
    link.click();
  };

  const exportToPDF = () => {
    if (!selectedOrder) {
      toast.error("No order data available for the selected date");
      return;
    }

    const doc = new jsPDF();
    
    // Add title and date
    doc.setFontSize(18);
    doc.text("Daily Delivery Track Sheet", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Date: ${format(trackDate, "dd MMMM yyyy")}`, 14, 30);
    
    // Prepare table data
    const tableColumn = ["Customer"];
    products.forEach(product => {
      tableColumn.push(product.name);
    });
    tableColumn.push("Total Qty");
    tableColumn.push("Amount (₹)");
    
    const tableRows = trackItems.map(item => {
      const row = [item.customerName];
      
      products.forEach(product => {
        row.push(item.products[product.id]?.toString() || "-");
      });
      
      row.push(item.totalQuantity.toString());
      row.push(`₹${item.totalAmount}`);
      
      return row;
    });
    
    // Add totals row
    const totalsRow = ["TOTAL"];
    
    products.forEach(product => {
      const total = trackItems.reduce(
        (sum, item) => sum + (item.products[product.id] || 0),
        0
      );
      totalsRow.push(total.toString());
    });
    
    const grandTotalQuantity = trackItems.reduce(
      (sum, item) => sum + item.totalQuantity,
      0
    );
    
    const grandTotalAmount = trackItems.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
    
    totalsRow.push(grandTotalQuantity.toString());
    totalsRow.push(`₹${grandTotalAmount}`);
    
    tableRows.push(totalsRow);
    
    // Generate the PDF table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [75, 58, 172], textColor: [255, 255, 255] },
      footStyles: { fillColor: [240, 240, 245], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 250] },
    });
    
    // Save the PDF
    doc.save(`track-sheet-${format(trackDate, "yyyy-MM-dd")}.pdf`);
    toast.success("PDF exported successfully");
  };

  const printTrackSheet = () => {
    if (!selectedOrder) {
      toast.error("No order data available for the selected date");
      return;
    }
    
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-2">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Track Sheet</h1>
          <p className="text-muted-foreground">
            View and print daily delivery track sheets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportToPDF} className="bg-purple-700 text-white hover:bg-purple-800 hover:text-white border-none">
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={printTrackSheet}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none bg-gradient-to-br from-blue-900/90 to-purple-900/90 text-white border-0 shadow-lg">
        <CardHeader className="print:py-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="print:text-xl text-white">
                Delivery Track Sheet - {format(trackDate, "dd MMMM yyyy")}
              </CardTitle>
              <CardDescription className="print:hidden text-gray-300">
                Daily milk delivery track sheet for delivery personnel
              </CardDescription>
            </div>
            <div className="print:hidden">
              <DatePicker date={trackDate} setDate={setTrackDate} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedOrder ? (
            <div className="text-center py-10 print:hidden">
              <p className="text-gray-300 mb-4">
                No order data available for the selected date
              </p>
              <Button onClick={() => window.location.href = "/order-entry"} className="bg-purple-600 hover:bg-purple-700 text-white border-none">
                Create Order for This Date
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto" ref={tableRef}>
              <Table>
                <TableHeader className="bg-purple-800/50">
                  <TableRow>
                    <TableHead className="w-[200px] text-white">Customer</TableHead>
                    {products.map((product) => (
                      <TableHead
                        key={product.id}
                        className="text-center whitespace-nowrap text-white"
                      >
                        {product.name}
                      </TableHead>
                    ))}
                    <TableHead className="text-center text-white">Total Qty</TableHead>
                    <TableHead className="text-center print:hidden text-white">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-purple-900/30">
                  {trackItems.map((item) => (
                    <TableRow key={item.customerId} className="border-t border-purple-700/50 hover:bg-purple-800/30">
                      <TableCell className="font-medium text-white">
                        {item.customerName}
                      </TableCell>
                      {products.map((product) => (
                        <TableCell key={product.id} className="text-center text-gray-300">
                          {item.products[product.id] || "-"}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-semibold text-white">
                        {item.totalQuantity}
                      </TableCell>
                      <TableCell className="text-center font-semibold print:hidden text-gray-300">
                        ₹{item.totalAmount}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-purple-800/50 border-none">
                    <TableCell className="font-bold text-white">TOTAL</TableCell>
                    {products.map((product) => {
                      const total = trackItems.reduce(
                        (sum, item) => sum + (item.products[product.id] || 0),
                        0
                      );
                      return (
                        <TableCell
                          key={product.id}
                          className="text-center font-semibold text-white"
                        >
                          {total || "-"}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-bold text-white">
                      {trackItems.reduce(
                        (sum, item) => sum + item.totalQuantity,
                        0
                      )}
                    </TableCell>
                    <TableCell className="text-center font-bold print:hidden text-white">
                      ₹
                      {trackItems.reduce(
                        (sum, item) => sum + item.totalAmount,
                        0
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="print:hidden">
        <Card className="bg-gradient-to-r from-indigo-900/80 to-blue-900/80 text-white border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Select a date to view the track sheet for that day.</li>
              <li>Use the Export button to download as CSV/PDF or the Print button to print.</li>
              <li>Track sheets show all customer orders for the selected date.</li>
              <li>If no data is available, create an order for the selected date first.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackSheet;
