
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";

export interface TrackSheetData {
  month: Date;
  productId: string;
  productName: string;
  customers: Array<{
    id: string;
    name: string;
  }>;
  orders: Array<{
    date: string;
    items: Array<{
      productId: string;
      customerId: string;
      quantity: number;
    }>;
  }>;
}

export const generateTrackSheetPDF = (data: TrackSheetData) => {
  // Create landscape PDF
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm'
  });
  
  // Get days in the selected month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(data.month),
    end: endOfMonth(data.month)
  });
  
  const title = `Track Sheet - ${format(data.month, 'MMMM yyyy')}`;
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 150, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Product: ${data.productName}`, 150, 22, { align: 'center' });
  
  const tableColumn = [
    "Customer",
    ...daysInMonth.map(day => format(day, 'd')),
    "Total"
  ];
  
  const tableRows = data.customers.map(customer => {
    const rowData = [customer.name];
    
    let customerTotal = 0;
    
    // Add data for each day
    daysInMonth.forEach(day => {
      const dayOrders = data.orders.filter(order => 
        format(new Date(order.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      
      let dayTotal = 0;
      
      dayOrders.forEach(order => {
        const item = order.items.find(item => 
          item.customerId === customer.id && item.productId === data.productId
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
      const dayOrders = data.orders.filter(order => 
        format(new Date(order.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      
      let dayTotal = 0;
      
      dayOrders.forEach(order => {
        const items = order.items.filter(item => 
          item.productId === data.productId && data.customers.some(c => c.id === item.customerId)
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
  doc.save(`Track_Sheet_${format(data.month, 'MMM_yyyy')}.pdf`);
};
