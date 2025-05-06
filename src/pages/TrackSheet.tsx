
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download, FileDown, FileText, Printer, 
  TruckIcon, UserIcon
} from "lucide-react";
import { format } from "date-fns";
import { Order, OrderItem, Vehicle, Salesman } from "@/types";
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
  const { customers, products, orders, vehicles, salesmen, uiSettings } = useData();
  const [trackDate, setTrackDate] = useState<Date>(new Date());
  const [trackItems, setTrackItems] = useState<TrackItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [groupBy, setGroupBy] = useState<"none" | "vehicle" | "salesman">("none");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedSalesman, setSelectedSalesman] = useState<string | null>(null);
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

    // Filter items based on vehicle or salesman if selected
    let filteredItems = order.items;
    if (groupBy === "vehicle" && selectedVehicle) {
      if (order.vehicleId !== selectedVehicle) {
        setTrackItems([]);
        return;
      }
    }
    
    if (groupBy === "salesman" && selectedSalesman) {
      if (order.salesmanId !== selectedSalesman) {
        setTrackItems([]);
        return;
      }
    }

    // Group items by customer
    const customerItems: Record<string, OrderItem[]> = {};
    filteredItems.forEach((item) => {
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
    
    // Create a gradient background for the title area (lighter version for PDF)
    doc.setFillColor(16, 185, 129); // Teal color
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    // Add a logo or business name with styling
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("Milk Delivery App", doc.internal.pageSize.width / 2, 15, { align: 'center' });
    
    // Add vehicle or salesman info if applicable
    if (groupBy === "vehicle" && selectedVehicle) {
      const vehicle = vehicles.find(v => v.id === selectedVehicle);
      if (vehicle) {
        doc.setFontSize(12);
        doc.text(`Vehicle: ${vehicle.name} (${vehicle.regNumber})`, doc.internal.pageSize.width - 15, 30, { align: 'right' });
      }
    } else if (groupBy === "salesman" && selectedSalesman) {
      const salesman = salesmen.find(s => s.id === selectedSalesman);
      if (salesman) {
        doc.setFontSize(12);
        doc.text(`Salesman: ${salesman.name}`, doc.internal.pageSize.width - 15, 30, { align: 'right' });
      }
    }
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
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
    
    // Generate the PDF table with styling that matches the UI
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 163, 74], textColor: [255, 255, 255] },
      footStyles: { fillColor: [240, 253, 244], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [243, 244, 246] },
      theme: 'grid'
    });
    
    // Add footer with date and page numbers
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on: ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
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

  const getBgColorClass = () => {
    return uiSettings.theme === "dark" 
      ? "bg-gradient-to-br from-teal-900/90 to-teal-800/90 text-white" 
      : "bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-900";
  };

  const getHeaderBgClass = () => {
    return uiSettings.theme === "dark"
      ? "bg-teal-800/50"
      : "bg-teal-600/30";
  };

  const getTableBodyBgClass = () => {
    return uiSettings.theme === "dark"
      ? "bg-teal-900/30"
      : "bg-teal-50/80"; 
  };

  const getFooterRowClass = () => {
    return uiSettings.theme === "dark"
      ? "bg-teal-800/50 border-none"
      : "bg-teal-600/20 border-none";
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
          <Button variant="outline" onClick={exportToPDF} className="bg-teal-700 text-white hover:bg-teal-800 hover:text-white border-none">
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={printTrackSheet}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card className={`print:shadow-none print:border-none ${getBgColorClass()} border-0 shadow-lg rounded-xl`}>
        <CardHeader className="print:py-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="print:text-xl text-inherit">
                Delivery Track Sheet - {format(trackDate, "dd MMMM yyyy")}
              </CardTitle>
              <CardDescription className="print:hidden text-inherit/80">
                Daily milk delivery track sheet for delivery personnel
              </CardDescription>
            </div>
            <div className="print:hidden flex items-center space-x-4">
              <DatePicker date={trackDate} setDate={setTrackDate} />
              
              <Select value={groupBy} onValueChange={(v: "none" | "vehicle" | "salesman") => setGroupBy(v)}>
                <SelectTrigger className="w-[180px] bg-white/10 text-inherit border-0">
                  <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No grouping</SelectItem>
                  <SelectItem value="vehicle">By Vehicle</SelectItem>
                  <SelectItem value="salesman">By Salesman</SelectItem>
                </SelectContent>
              </Select>
              
              {groupBy === "vehicle" && (
                <Select 
                  value={selectedVehicle || ""} 
                  onValueChange={setSelectedVehicle}
                  disabled={vehicles.length === 0}
                >
                  <SelectTrigger className="w-[180px] bg-white/10 text-inherit border-0">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {groupBy === "salesman" && (
                <Select 
                  value={selectedSalesman || ""} 
                  onValueChange={setSelectedSalesman}
                  disabled={salesmen.length === 0}
                >
                  <SelectTrigger className="w-[180px] bg-white/10 text-inherit border-0">
                    <SelectValue placeholder="Select salesman" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesmen.map(salesman => (
                      <SelectItem key={salesman.id} value={salesman.id}>
                        {salesman.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          {/* Vehicle or Salesman info for print view */}
          {groupBy === "vehicle" && selectedVehicle && (
            <div className="hidden print:block mt-2">
              <p className="text-sm">
                <TruckIcon className="inline-block mr-1 h-4 w-4" />
                {vehicles.find(v => v.id === selectedVehicle)?.name} ({vehicles.find(v => v.id === selectedVehicle)?.regNumber})
              </p>
            </div>  
          )}
          
          {groupBy === "salesman" && selectedSalesman && (
            <div className="hidden print:block mt-2">
              <p className="text-sm">
                <UserIcon className="inline-block mr-1 h-4 w-4" />
                {salesmen.find(s => s.id === selectedSalesman)?.name}
              </p>
            </div>  
          )}
        </CardHeader>
        <CardContent>
          {!selectedOrder ? (
            <div className="text-center py-10 print:hidden">
              <p className="text-inherit/80 mb-4">
                No order data available for the selected date
              </p>
              <Button onClick={() => window.location.href = "/order-entry"} className="bg-teal-600 hover:bg-teal-700 text-white border-none">
                Create Order for This Date
              </Button>
            </div>
          ) : trackItems.length === 0 && (groupBy !== "none") ? (
            <div className="text-center py-10 print:hidden">
              <p className="text-inherit/80 mb-4">
                No items found for the selected {groupBy === "vehicle" ? "vehicle" : "salesman"}
              </p>
              <Button onClick={() => {
                setGroupBy("none");
                setSelectedVehicle(null);
                setSelectedSalesman(null);
              }} className="bg-teal-600 hover:bg-teal-700 text-white border-none">
                Show All Items
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg" ref={tableRef}>
              <Table>
                <TableHeader className={getHeaderBgClass()}>
                  <TableRow>
                    <TableHead className="w-[200px] text-inherit font-bold">Customer</TableHead>
                    {products.map((product) => (
                      <TableHead
                        key={product.id}
                        className="text-center whitespace-nowrap text-inherit font-semibold"
                      >
                        {product.name}
                      </TableHead>
                    ))}
                    <TableHead className="text-center text-inherit font-bold">Total Qty</TableHead>
                    <TableHead className="text-center print:hidden text-inherit font-bold">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className={getTableBodyBgClass()}>
                  {trackItems.map((item) => (
                    <TableRow key={item.customerId} className="border-t border-teal-700/20 hover:bg-teal-700/10">
                      <TableCell className="font-medium text-inherit">
                        {item.customerName}
                      </TableCell>
                      {products.map((product) => (
                        <TableCell key={product.id} className="text-center text-inherit/80">
                          {item.products[product.id] || "-"}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-semibold text-inherit">
                        {item.totalQuantity}
                      </TableCell>
                      <TableCell className="text-center font-semibold print:hidden text-inherit/80">
                        ₹{item.totalAmount}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className={getFooterRowClass()}>
                    <TableCell className="font-bold text-inherit">TOTAL</TableCell>
                    {products.map((product) => {
                      const total = trackItems.reduce(
                        (sum, item) => sum + (item.products[product.id] || 0),
                        0
                      );
                      return (
                        <TableCell
                          key={product.id}
                          className="text-center font-semibold text-inherit"
                        >
                          {total || "-"}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-bold text-inherit">
                      {trackItems.reduce(
                        (sum, item) => sum + item.totalQuantity,
                        0
                      )}
                    </TableCell>
                    <TableCell className="text-center font-bold print:hidden text-inherit">
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
        <Card className="bg-gradient-to-r from-teal-900/80 to-teal-800/80 text-white border-0 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-teal-100">
              <li>Select a date to view the track sheet for that day.</li>
              <li>Group by vehicle or salesman to filter the track sheet.</li>
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
