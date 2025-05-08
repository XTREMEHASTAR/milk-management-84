
import { exportTrackSheet } from "@/utils/pdfUtils";
import { format } from "date-fns";

export interface TrackSheetRow {
  serialNumber: string;
  name: string;
  quantities: Record<string, string | number>;
  total: number;
  amount: number;
}

export interface TrackSheet {
  id: string;
  name: string;
  date: Date;
  routeName: string;
  vehicleId?: string | null;
  salesmanId?: string | null;
  rows: TrackSheetRow[];
}

export const generateTrackSheetPdf = (
  date: Date,
  routeName: string,
  rows: TrackSheetRow[],
  columnNames: string[],
  filename: string = "track_sheet.pdf",
  options: {
    vehicleName?: string;
    salesmanName?: string;
  } = {}
) => {
  // Format the date for display
  const formattedDate = format(date, "dd/MM/yyyy");
  
  // Prepare the header row - Serial No, Name, then all product columns, Total, Amount
  const headers = ["Sr.No", "Name", ...columnNames, "Total", "Amount"];
  
  // Prepare the data rows
  const data = rows.map(row => {
    // Start with serial number and name
    const rowData = [row.serialNumber, row.name];
    
    // Add quantities for each column
    for (const col of columnNames) {
      // Convert any numeric values to strings since the exportTrackSheet function expects string values
      const value = row.quantities[col];
      rowData.push(value !== undefined && value !== "" ? String(value) : "—"); // Use em dash for empty cells
    }
    
    // Add total and amount
    rowData.push(row.total.toString());
    rowData.push(`${row.amount.toFixed(2)}`);
    
    return rowData;
  });
  
  // Calculate column widths (percentages) - these will need to be adjusted based on content
  // Serial is narrow, name is wider, product columns are equal, total and amount are medium
  const baseWidth = 100 / (headers.length); // Start with equal distribution
  
  const columnWidths = [
    "5%",                          // Serial number - narrow
    "15%",                         // Name - wider
    ...Array(columnNames.length).fill(`${baseWidth}%`), // Product columns - equal
    "8%",                          // Total - medium
    "10%"                          // Amount - medium
  ];
  
  // Prepare additional information
  const additionalInfo: { label: string; value: string }[] = [];
  
  if (options.vehicleName) {
    additionalInfo.push({ label: "Vehicle", value: options.vehicleName });
  }
  
  if (options.salesmanName) {
    additionalInfo.push({ label: "Salesman", value: options.salesmanName });
  }
  
  // Generate the PDF using the specialized track sheet function
  return exportTrackSheet(
    headers,
    data,
    `Track Sheet - ${routeName} - ${formattedDate}`,
    filename,
    {
      dateInfo: `Date: ${formattedDate}`,
      landscape: true,
      columnWidths,
      additionalInfo: additionalInfo.length > 0 ? additionalInfo : undefined
    }
  );
};

// Helper function to create empty track sheet rows
export const createEmptyTrackSheetRows = (
  count: number, 
  columnNames: string[]
): TrackSheetRow[] => {
  return Array(count).fill(0).map((_, index) => ({
    serialNumber: (index + 1).toString(),
    name: "",
    quantities: columnNames.reduce((acc, col) => ({...acc, [col]: ""}), {}),
    total: 0,
    amount: 0
  }));
};

// Helper function to create a track sheet template with example data
export const createTrackSheetTemplate = (
  columnNames: string[],
  date: Date = new Date(),
  routeName: string = "Main Route"
): TrackSheetRow[] => {
  // Create some example customers
  const exampleCustomers = [
    "Rahul Sharma",
    "Priya Patel",
    "Amit Singh",
    "Sunita Desai",
    "Vijay Kumar",
    "Neha Gupta",
    "Rajesh Verma",
    "Anita Sharma",
    "Suresh Patel",
    "Meena Singh"
  ];
  
  return exampleCustomers.map((name, index) => {
    // Generate random quantities for each product column
    const quantities: Record<string, string | number> = {};
    let total = 0;
    
    columnNames.forEach(col => {
      // 70% chance of having a quantity for this product
      if (Math.random() > 0.3) {
        const qty = Math.floor(Math.random() * 5) + 1;
        quantities[col] = qty;
        total += qty;
      } else {
        quantities[col] = "";
      }
    });
    
    // Calculate a random price per unit between 25-60
    const pricePerUnit = 25 + Math.floor(Math.random() * 35);
    const amount = total * pricePerUnit;
    
    return {
      serialNumber: (index + 1).toString(),
      name,
      quantities,
      total,
      amount
    };
  });
};

// Convert track sheet rows to order items
export const trackSheetRowsToOrderItems = (
  rows: TrackSheetRow[],
  customers: any[],
  products: any[]
) => {
  const orderItems: any[] = [];
  
  rows.forEach(row => {
    // Find or create customer
    const customer = customers.find(c => c.name === row.name);
    
    if (!customer) return; // Skip if customer not found
    
    // Add items for each product quantity
    Object.entries(row.quantities).forEach(([productName, qty]) => {
      if (!qty || qty === "") return;
      
      const product = products.find(p => p.name === productName);
      if (!product) return;
      
      orderItems.push({
        customerId: customer.id,
        productId: product.id,
        quantity: typeof qty === 'string' ? parseInt(qty) : qty,
        price: product.price || 0
      });
    });
  });
  
  return orderItems;
};

// Convert order items to track sheet rows
export const orderItemsToTrackSheetRows = (
  orderItems: any[],
  customers: any[],
  products: any[]
) => {
  // Group items by customer
  const customerItems: Record<string, any[]> = {};
  
  orderItems.forEach(item => {
    if (!customerItems[item.customerId]) {
      customerItems[item.customerId] = [];
    }
    customerItems[item.customerId].push(item);
  });
  
  // Create rows for each customer
  const rows: TrackSheetRow[] = [];
  
  Object.entries(customerItems).forEach(([customerId, items], index) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Prepare quantities
    const quantities: Record<string, number> = {};
    let total = 0;
    let amount = 0;
    
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;
      
      quantities[product.name] = item.quantity;
      total += item.quantity;
      amount += item.quantity * item.price;
    });
    
    rows.push({
      serialNumber: (index + 1).toString(),
      name: customer.name,
      quantities,
      total,
      amount
    });
  });
  
  return rows.sort((a, b) => a.name.localeCompare(b.name));
};
