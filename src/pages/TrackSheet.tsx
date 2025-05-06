import React, { useState, useRef } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDate } from "date-fns";
import { Download, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TrackSheet() {
  const { products, customers, orders } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [productId, setProductId] = useState("");
  const printRef = useRef(null);
  
  // Get days in the selected month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  });
  
  // Get customers who ordered the selected product
  const relevantCustomers = !productId 
    ? [] 
    : customers.filter(customer => 
        orders.some(order => 
          order.items.some(item => 
            item.customerId === customer.id && item.productId === productId
          )
        )
      );

  // Handle print functionality
  const handlePrint = useReactToPrint({
    documentTitle: `Track_Sheet_${format(selectedMonth, 'MMM_yyyy')}`,
    // Fix the contentRef property name
    contentRef: printRef,
    pageStyle: `
      @page {
        size: landscape;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `
  });
  
  // Generate PDF
  const generatePDF = () => {
    // Create landscape PDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });
    
    const title = `Track Sheet - ${format(selectedMonth, 'MMMM yyyy')}`;
    const product = products.find(p => p.id === productId);
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 150, 15, { align: 'center' });
    
    if (product) {
      doc.setFontSize(12);
      doc.text(`Product: ${product.name}`, 150, 22, { align: 'center' });
    }
    
    const tableColumn = [
      "Customer",
      ...daysInMonth.map(day => format(day, 'd')),
      "Total"
    ];
    
    const tableRows = relevantCustomers.map(customer => {
      const rowData = [customer.name];
      
      let customerTotal = 0;
      
      // Add data for each day
      daysInMonth.forEach(day => {
        const dayOrders = orders.filter(order => 
          format(new Date(order.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        );
        
        let dayTotal = 0;
        
        dayOrders.forEach(order => {
          const item = order.items.find(item => 
            item.customerId === customer.id && item.productId === productId
          );
          
          if (item) {
            dayTotal += item.quantity;
          }
        });
        
        rowData.push(dayTotal > 0 ? dayTotal.toString() : "-");
        customerTotal += dayTotal;
      });
      
      // Add customer total
      rowData.push(customerTotal.toString());
      
      return rowData;
    });
    
    // Add empty row for totals
    if (tableRows.length > 0) {
      const totalRow = ["Daily Total"];
      
      // Calculate daily totals
      daysInMonth.forEach(day => {
        const dayOrders = orders.filter(order => 
          format(new Date(order.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        );
        
        let dayTotal = 0;
        
        dayOrders.forEach(order => {
          const items = order.items.filter(item => 
            item.productId === productId && relevantCustomers.some(c => c.id === item.customerId)
          );
          
          items.forEach(item => {
            dayTotal += item.quantity;
          });
        });
        
        totalRow.push(dayTotal > 0 ? dayTotal.toString() : "-");
      });
      
      // Calculate grand total
      const grandTotal = tableRows.reduce((sum, row) => {
        return sum + parseInt(row[row.length - 1] || "0", 10);
      }, 0);
      
      totalRow.push(grandTotal.toString());
      tableRows.push(totalRow);
    }
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1 },
      headStyles: { fillColor: [75, 75, 75], textColor: 255 },
      footStyles: { fillColor: [240, 240, 240] },
    });
    
    // Save the PDF
    doc.save(`Track_Sheet_${format(selectedMonth, 'MMM_yyyy')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Track Sheet</h1>
          <p className="text-muted-foreground">
            Monitor daily quantities delivered to customers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daily Customer Quantities</CardTitle>
          <CardDescription>
            Track product quantities delivered to customers on each day of the month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <DatePicker
                date={selectedMonth}
                setDate={setSelectedMonth}
                mode="month"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Product</label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Track Sheet Table */}
          <div ref={printRef} className="overflow-x-auto border rounded-md pt-2 landscape-print">
            {productId ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-background z-20">Customer</TableHead>
                    {daysInMonth.map((day) => (
                      <TableHead key={day.toString()} className="text-center min-w-[36px]">
                        {getDate(day)}
                      </TableHead>
                    ))}
                    <TableHead className="text-center bg-muted">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relevantCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={daysInMonth.length + 2} className="text-center h-32">
                        No data available for the selected product
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {relevantCustomers.map((customer) => {
                        let customerTotal = 0;
                        
                        return (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium sticky left-0 bg-background z-10">
                              {customer.name}
                            </TableCell>
                            
                            {daysInMonth.map((day) => {
                              const dayOrders = orders.filter(
                                (order) =>
                                  format(new Date(order.date), "yyyy-MM-dd") ===
                                  format(day, "yyyy-MM-dd")
                              );
                              
                              let dayTotal = 0;
                              
                              dayOrders.forEach((order) => {
                                const item = order.items.find(
                                  (item) =>
                                    item.customerId === customer.id &&
                                    item.productId === productId
                                );
                                
                                if (item) {
                                  dayTotal += item.quantity;
                                }
                              });
                              
                              customerTotal += dayTotal;
                              
                              return (
                                <TableCell
                                  key={day.toString()}
                                  className={`text-center ${dayTotal > 0 ? "font-medium" : "text-muted-foreground"}`}
                                >
                                  {dayTotal > 0 ? dayTotal : "-"}
                                </TableCell>
                              );
                            })}
                            
                            <TableCell className="text-center font-bold bg-muted">
                              {customerTotal}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {/* Daily Totals Row */}
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold sticky left-0 bg-muted/50 z-10">
                          Daily Total
                        </TableCell>
                        
                        {daysInMonth.map((day) => {
                          const dayOrders = orders.filter(
                            (order) =>
                              format(new Date(order.date), "yyyy-MM-dd") ===
                              format(day, "yyyy-MM-dd")
                          );
                          
                          let dayTotal = 0;
                          
                          dayOrders.forEach((order) => {
                            const items = order.items.filter(
                              (item) =>
                                item.productId === productId &&
                                relevantCustomers.some((c) => c.id === item.customerId)
                            );
                            
                            items.forEach((item) => {
                              dayTotal += item.quantity;
                            });
                          });
                          
                          return (
                            <TableCell
                              key={day.toString()}
                              className="text-center font-bold"
                            >
                              {dayTotal > 0 ? dayTotal : "-"}
                            </TableCell>
                          );
                        })}
                        
                        {/* Grand Total */}
                        <TableCell className="text-center font-bold bg-primary/10">
                          {relevantCustomers.reduce((total, customer) => {
                            const customerOrders = orders.filter((order) =>
                              order.items.some(
                                (item) =>
                                  item.customerId === customer.id &&
                                  item.productId === productId
                              )
                            );
                            
                            let customerTotal = 0;
                            
                            customerOrders.forEach((order) => {
                              const items = order.items.filter(
                                (item) =>
                                  item.customerId === customer.id &&
                                  item.productId === productId
                              );
                              
                              items.forEach((item) => {
                                customerTotal += item.quantity;
                              });
                            });
                            
                            return total + customerTotal;
                          }, 0)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Please select a product to view the track sheet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <style>
        {`
          @media print {
            @page {
              size: landscape;
            }
            .landscape-print {
              width: 100%;
              overflow: visible !important;
            }
            .sticky {
              position: relative !important;
            }
          }
        `}
      </style>
    </div>
  );
}
