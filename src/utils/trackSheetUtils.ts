
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

export interface TrackSheetRow {
  name: string;
  quantities: Record<string, number | string>;
  total: number;
  amount: number;
}

// Create an empty track sheet template with sample customers
export const createEmptyTrackSheetRows = (
  productNames: string[]
): TrackSheetRow[] => {
  const sampleCustomers = [
    'Customer 1',
    'Customer 2',
    'Customer 3',
    'Customer 4',
    'Customer 5',
  ];

  return sampleCustomers.map(name => {
    const quantities: Record<string, number | string> = {};
    let total = 0;
    let amount = 0;

    productNames.forEach(product => {
      quantities[product] = '';
    });

    return {
      name,
      quantities,
      total,
      amount
    };
  });
};

// Create a track sheet template with random data
export const createTrackSheetTemplate = (
  productNames: string[],
  date: Date,
  routeName: string
): TrackSheetRow[] => {
  const sampleCustomers = [
    'Delhi Dairy',
    'Golden Milk Supply',
    'Sunrise Foods',
    'Sweet Treats Bakery',
    'Mountain View Cafe',
    'Green Valley Store',
    'Fresh Basket Market',
    'Family Restaurant',
    'City Hospital Canteen',
    'Sunlight Hotel'
  ];

  return sampleCustomers.map(name => {
    const quantities: Record<string, number | string> = {};
    let total = 0;
    
    productNames.forEach(product => {
      // Generate random quantity between 0 and 10, with some empty values
      const quantity = Math.random() > 0.2 ? Math.floor(Math.random() * 10) : 0;
      quantities[product] = quantity;
      total += quantity;
    });
    
    // Generate a random amount
    const amount = total * (Math.floor(Math.random() * 30) + 40);

    return {
      name,
      quantities,
      total,
      amount
    };
  });
};

// Generate PDF for track sheet
export const generateTrackSheetPdf = (
  title: string,
  date: Date,
  rows: TrackSheetRow[],
  productNames: string[],
  additionalInfo?: Array<{label: string; value: string}>
) => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Add title and date
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  doc.setFontSize(10);
  doc.text(`Date: ${format(date, 'dd/MM/yyyy')}`, 14, 22);
  
  // Add additional info if provided
  if (additionalInfo && additionalInfo.length > 0) {
    let yPos = 27;
    additionalInfo.forEach(info => {
      doc.text(`${info.label}: ${info.value}`, 14, yPos);
      yPos += 5;
    });
  }

  // Prepare table data
  const tableColumn = ['Customer'];
  productNames.forEach(product => {
    tableColumn.push(product);
  });
  tableColumn.push('Total', 'Amount');
  
  const tableRows = rows.map(row => {
    const rowData = [row.name];
    
    productNames.forEach(product => {
      rowData.push(row.quantities[product]?.toString() || '-');
    });
    
    rowData.push(row.total.toString());
    rowData.push(`₹${row.amount}`);
    
    return rowData;
  });
  
  // Add totals row
  const totals = ['TOTAL'];
  
  productNames.forEach(product => {
    const total = rows.reduce(
      (sum, row) => {
        const qty = row.quantities[product];
        return sum + (typeof qty === 'number' ? qty : 0);
      },
      0
    );
    totals.push(total.toString());
  });
  
  const grandTotalQty = rows.reduce((sum, row) => sum + row.total, 0);
  const grandTotalAmount = rows.reduce((sum, row) => sum + row.amount, 0);
  
  totals.push(grandTotalQty.toString());
  totals.push(`₹${grandTotalAmount}`);
  
  tableRows.push(totals);

  // Create table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: additionalInfo && additionalInfo.length > 0 ? 35 : 27,
    theme: 'grid',
    styles: {
      fontSize: 9
    },
    headStyles: {
      fillColor: [75, 75, 75]
    },
    footStyles: {
      fillColor: [200, 200, 200]
    }
  });

  // Save the PDF
  return doc.save(`track-sheet-${format(date, 'yyyy-MM-dd')}.pdf`);
};
