
import { useState, useEffect, useRef } from "react";
import { useData } from "@/contexts/data/DataContext";
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
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  FileDown, FileText, Printer, Maximize, 
  ZoomIn, ZoomOut, TruckIcon, UserIcon,
  Copy, Calendar, Edit, Trash2
} from "lucide-react";
import { format, addDays } from "date-fns";
import { Order, OrderItem, Vehicle, Salesman } from "@/types";
import { toast } from "sonner";
import { exportToPdf, previewDataTableAsPdf } from "@/utils/pdfUtils";
import { createEmptyTrackSheetRows, createTrackSheetTemplate, TrackSheetRow, generateTrackSheetPdf } from "@/utils/trackSheetUtils";

interface TrackItem {
  customerId: string;
  customerName: string;
  products: {
    [productId: string]: number;
  };
  totalQuantity: number;
  totalAmount: number;
}

interface SavedTrackSheet {
  id: string;
  name: string;
  date: string;
  groupBy: "none" | "vehicle" | "salesman";
  vehicleId?: string | null;
  salesmanId?: string | null;
  items: TrackItem[];
}

const TrackSheet = () => {
  const { customers, products, orders, vehicles, salesmen, uiSettings, addOrder } = useData();
  const [trackDate, setTrackDate] = useState<Date>(new Date());
  const [trackItems, setTrackItems] = useState<TrackItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [groupBy, setGroupBy] = useState<"none" | "vehicle" | "salesman">("none");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedSalesman, setSelectedSalesman] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [fontSizeAdjustment, setFontSizeAdjustment] = useState<number>(0);
  const [cellPadding, setCellPadding] = useState<number>(4);
  const [lineHeight, setLineHeight] = useState<number>(1.3);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [columnWidths, setColumnWidths] = useState<string[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);
  
  // New state variables for managing multiple track sheets
  const [savedTrackSheets, setSavedTrackSheets] = useState<SavedTrackSheet[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [trackSheetName, setTrackSheetName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("current");
  
  // Load saved track sheets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedTrackSheets");
    if (saved) {
      try {
        setSavedTrackSheets(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved track sheets:", error);
      }
    }
  }, []);
  
  // Save track sheets to localStorage when they change
  useEffect(() => {
    if (savedTrackSheets.length > 0) {
      localStorage.setItem("savedTrackSheets", JSON.stringify(savedTrackSheets));
    }
  }, [savedTrackSheets]);

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

  // Initialize column widths when products change
  useEffect(() => {
    // Default column width distribution - first column wider for customer names
    const defaultWidths = ["25%"];
    
    // Equal distribution for product columns
    if (products.length > 0) {
      const productColumnWidth = `${65 / products.length}%`;
      const productWidths = Array(products.length).fill(productColumnWidth);
      // Add widths for total columns
      setColumnWidths([...defaultWidths, ...productWidths, "5%", "5%"]);
    }
  }, [products]);

  // Update preview when relevant settings change
  useEffect(() => {
    if (selectedOrder && showPreview) {
      generatePdfPreview();
    }
  }, [fontSizeAdjustment, cellPadding, lineHeight, columnWidths, showPreview, trackItems]);

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
    if (trackItems.length === 0) {
      toast.error("No data available to export");
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

  const generatePdfPreview = () => {
    if (trackItems.length === 0) {
      toast.error("No data available for preview");
      return;
    }

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

    // Get vehicle or salesman info
    let additionalInfo: Array<{ label: string; value: string }> = [];
    if (groupBy === "vehicle" && selectedVehicle) {
      const vehicle = vehicles.find(v => v.id === selectedVehicle);
      if (vehicle) {
        additionalInfo.push({ 
          label: "Vehicle", 
          value: `${vehicle.name} (${vehicle.regNumber})` 
        });
      }
    } else if (groupBy === "salesman" && selectedSalesman) {
      const salesman = salesmen.find(s => s.id === selectedSalesman);
      if (salesman) {
        additionalInfo.push({ 
          label: "Salesman", 
          value: salesman.name 
        });
      }
    }
    
    // Generate preview with improved table formatting
    const pdfUrl = previewDataTableAsPdf(
      tableColumn,
      tableRows,
      trackSheetName || "Milk Delivery App",
      {
        landscape: true,
        dateInfo: `Date: ${format(trackDate, "dd MMMM yyyy")}`,
        additionalInfo: additionalInfo.length > 0 ? additionalInfo : undefined,
        theme: uiSettings.theme,
        fontSizeAdjustment: fontSizeAdjustment,
        columnWidths: columnWidths,
        cellPadding: cellPadding,
        lineHeight: lineHeight
      }
    );
    
    setPdfPreviewUrl(pdfUrl);
  };

  const exportToPDF = () => {
    if (trackItems.length === 0) {
      toast.error("No data available to export");
      return;
    }

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

    // Get vehicle or salesman info
    let additionalInfo: Array<{ label: string; value: string }> = [];
    if (groupBy === "vehicle" && selectedVehicle) {
      const vehicle = vehicles.find(v => v.id === selectedVehicle);
      if (vehicle) {
        additionalInfo.push({ 
          label: "Vehicle", 
          value: `${vehicle.name} (${vehicle.regNumber})` 
        });
      }
    } else if (groupBy === "salesman" && selectedSalesman) {
      const salesman = salesmen.find(s => s.id === selectedSalesman);
      if (salesman) {
        additionalInfo.push({ 
          label: "Salesman", 
          value: salesman.name 
        });
      }
    }
    
    // Export to PDF with improved table formatting
    exportToPdf(
      tableColumn,
      tableRows,
      {
        title: trackSheetName || "Milk Delivery App",
        subtitle: "Daily Delivery Track Sheet",
        dateInfo: `Date: ${format(trackDate, "dd MMMM yyyy")}`,
        additionalInfo: additionalInfo.length > 0 ? additionalInfo : undefined,
        filename: `track-sheet-${format(trackDate, "yyyy-MM-dd")}.pdf`,
        landscape: true,
        theme: uiSettings.theme,
        fontSizeAdjustment: fontSizeAdjustment,
        columnWidths: columnWidths,
        cellPadding: cellPadding,
        lineHeight: lineHeight
      }
    );
    
    toast.success("PDF exported successfully");
  };

  const printTrackSheet = () => {
    if (trackItems.length === 0) {
      toast.error("No data available to print");
      return;
    }
    
    window.print();
  };

  const handlePreview = () => {
    setShowPreview(true);
    generatePdfPreview();
  };

  // New methods for managing multiple track sheets
  const saveTrackSheet = () => {
    if (trackItems.length === 0) {
      toast.error("No data available to save");
      return;
    }

    if (!trackSheetName) {
      toast.error("Please enter a name for the track sheet");
      return;
    }

    const sheetToSave: SavedTrackSheet = {
      id: editingSheetId || `sheet-${Date.now()}`,
      name: trackSheetName,
      date: format(trackDate, "yyyy-MM-dd"),
      groupBy,
      vehicleId: selectedVehicle,
      salesmanId: selectedSalesman,
      items: [...trackItems]
    };

    if (isEditing && editingSheetId) {
      setSavedTrackSheets(prev => 
        prev.map(sheet => sheet.id === editingSheetId ? sheetToSave : sheet)
      );
      toast.success(`Track sheet "${trackSheetName}" updated successfully`);
    } else {
      setSavedTrackSheets(prev => [...prev, sheetToSave]);
      toast.success(`Track sheet "${trackSheetName}" saved successfully`);
    }

    setShowSaveDialog(false);
    setIsEditing(false);
    setEditingSheetId(null);
    setTrackSheetName("");
  };

  const loadTrackSheet = (sheet: SavedTrackSheet) => {
    setTrackDate(new Date(sheet.date));
    setGroupBy(sheet.groupBy);
    setSelectedVehicle(sheet.vehicleId);
    setSelectedSalesman(sheet.salesmanId);
    setTrackItems(sheet.items);
    setTrackSheetName(sheet.name);
    setActiveTab("current");
    toast.success(`Track sheet "${sheet.name}" loaded`);
  };

  const editTrackSheet = (sheet: SavedTrackSheet) => {
    setIsEditing(true);
    setEditingSheetId(sheet.id);
    setTrackSheetName(sheet.name);
    loadTrackSheet(sheet);
    setShowSaveDialog(true);
  };

  const deleteTrackSheet = (id: string) => {
    setSavedTrackSheets(prev => prev.filter(sheet => sheet.id !== id));
    toast.success("Track sheet deleted successfully");
  };

  const carryForwardToNextDay = () => {
    if (trackItems.length === 0) {
      toast.error("No data available to carry forward");
      return;
    }

    const nextDate = addDays(trackDate, 1);
    const nextDateString = format(nextDate, "yyyy-MM-dd");

    // Check if an order already exists for the next day
    const existingOrder = orders.find(o => o.date === nextDateString);
    if (existingOrder) {
      toast.error("An order already exists for the next day. Please edit that order instead.");
      return;
    }

    // Create new order items for the next day
    const orderItems = trackItems.flatMap(item => {
      return Object.entries(item.products).map(([productId, quantity]) => ({
        customerId: item.customerId,
        productId,
        quantity
      }));
    }).filter(item => item.quantity > 0); // Filter out zero quantities

    // Add the new order
    const newOrder = {
      date: nextDateString,
      items: orderItems,
      vehicleId: selectedVehicle || undefined,
      salesmanId: selectedSalesman || undefined
    };

    addOrder(newOrder);
    toast.success(`Order carried forward to ${format(nextDate, "dd MMM yyyy")}`);

    // Navigate to the next day
    setTrackDate(nextDate);
  };

  const startNewTrackSheet = () => {
    setTrackSheetName("");
    setIsEditing(false);
    setEditingSheetId(null);
    setShowSaveDialog(true);
  };

  const createEmptyTrackSheet = () => {
    if (products.length === 0 || customers.length === 0) {
      toast.error("You need both products and customers to create a track sheet");
      return;
    }
    
    const templateRows = createEmptyTrackSheetRows(products.map(p => p.name));
    
    // Convert template rows to TrackItems
    const items: TrackItem[] = customers.slice(0, 5).map((customer, index) => {
      const products: Record<string, number> = {};
      return {
        customerId: customer.id,
        customerName: customer.name,
        products,
        totalQuantity: 0,
        totalAmount: 0
      };
    });
    
    setTrackItems(items);
    toast.success("Created empty track sheet template");
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
            View, print and manage daily delivery track sheets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handlePreview} disabled={trackItems.length === 0}>
                <Maximize className="mr-2 h-4 w-4" />
                Preview PDF
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh]">
              <DialogHeader>
                <DialogTitle>PDF Preview</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Font size adjustment */}
                    <div className="flex items-center gap-2">
                      <span>Font Size:</span>
                      <div className="w-48">
                        <Slider
                          defaultValue={[0]}
                          min={-2}
                          max={4}
                          step={0.5}
                          value={[fontSizeAdjustment]}
                          onValueChange={(value) => setFontSizeAdjustment(value[0])}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <ZoomOut className="h-4 w-4" />
                        <span>{fontSizeAdjustment}</span>
                        <ZoomIn className="h-4 w-4" />
                      </div>
                    </div>
                    
                    {/* Cell padding adjustment */}
                    <div className="flex items-center gap-2">
                      <span>Cell Padding:</span>
                      <div className="w-36">
                        <Slider
                          defaultValue={[4]}
                          min={2}
                          max={8}
                          step={0.5}
                          value={[cellPadding]}
                          onValueChange={(value) => setCellPadding(value[0])}
                        />
                      </div>
                      <span>{cellPadding}</span>
                    </div>
                    
                    {/* Line height adjustment */}
                    <div className="flex items-center gap-2">
                      <span>Line Height:</span>
                      <div className="w-36">
                        <Slider
                          defaultValue={[1.3]}
                          min={1}
                          max={2}
                          step={0.1}
                          value={[lineHeight]}
                          onValueChange={(value) => setLineHeight(value[0])}
                        />
                      </div>
                      <span>{lineHeight.toFixed(1)}</span>
                    </div>
                  </div>
                  <Button onClick={exportToPDF} className="bg-teal-700 hover:bg-teal-800">
                    <FileText className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
                
                <div className="flex-1 overflow-auto bg-gray-100 rounded-md">
                  {pdfPreviewUrl && (
                    <iframe 
                      src={pdfPreviewUrl}
                      className="w-full h-full border-0"
                      title="PDF Preview"
                    />
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={exportToPDF} className="bg-teal-700 text-white hover:bg-teal-800 hover:text-white border-none">
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          
          <Button variant="outline" onClick={printTrackSheet}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>

          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button onClick={startNewTrackSheet}>Save Sheet</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Track Sheet" : "Save Track Sheet"}</DialogTitle>
                <DialogDescription>
                  Give your track sheet a name to save it for future reference.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={trackSheetName}
                    onChange={(e) => setTrackSheetName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Morning Route Sheet"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
                <Button onClick={saveTrackSheet} disabled={!trackSheetName}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="print:hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Track Sheet</TabsTrigger>
          <TabsTrigger value="saved">Saved Track Sheets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="mt-2">
          <Card className={`print:shadow-none print:border-none ${getBgColorClass()} border-0 shadow-lg rounded-xl`}>
            <CardHeader className="print:py-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="print:text-xl text-inherit">
                    {trackSheetName ? trackSheetName : `Delivery Track Sheet - ${format(trackDate, "dd MMMM yyyy")}`}
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
              {!selectedOrder && trackItems.length === 0 ? (
                <div className="text-center py-10 print:hidden">
                  <p className="text-inherit/80 mb-4">
                    No order data available for the selected date
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => window.location.href = "/order-entry"} className="bg-teal-600 hover:bg-teal-700 text-white border-none">
                      Create Order for This Date
                    </Button>
                    <Button variant="outline" onClick={createEmptyTrackSheet}>
                      Create Empty Sheet
                    </Button>
                  </div>
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
                <div>
                  <div className="flex justify-end mb-4 print:hidden">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={carryForwardToNextDay}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Carry Forward to Next Day
                      </Button>
                    </div>
                  </div>
                
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
                </div>
              )}
            </CardContent>
            <CardFooter className="print:hidden">
              <div className="text-sm text-teal-200">
                * Font size and table layout in the PDF can be adjusted using the Preview PDF option.
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Saved Track Sheets</CardTitle>
              <CardDescription>
                All your saved track sheets are listed here. You can load, edit or delete them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedTrackSheets.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">You don't have any saved track sheets yet.</p>
                  <Button onClick={() => setActiveTab("current")}>Create New Track Sheet</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedTrackSheets.map((sheet) => (
                    <Card key={sheet.id} className="border-teal-100 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{sheet.name}</CardTitle>
                        <CardDescription>
                          Date: {format(new Date(sheet.date), "dd MMM yyyy")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 pb-2">
                        <p className="text-sm text-muted-foreground">
                          Items: {sheet.items.length}
                        </p>
                        {sheet.groupBy !== "none" && (
                          <p className="text-sm text-muted-foreground">
                            Grouped by: {sheet.groupBy === "vehicle" ? "Vehicle" : "Salesman"}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => deleteTrackSheet(sheet.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => editTrackSheet(sheet)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="default" 
                          onClick={() => loadTrackSheet(sheet)}
                        >
                          Load
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="print:hidden">
        <Card className="bg-gradient-to-r from-teal-900/80 to-teal-800/80 text-white border-0 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Track Sheet Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-teal-100">
              <li><strong>Multiple Track Sheets</strong> - Save and manage multiple track sheets for different routes or time periods.</li>
              <li><strong>Edit & Delete</strong> - Update or remove previously saved track sheets as needed.</li>
              <li><strong>Carry Forward</strong> - Automatically create a new order for the next day based on current track sheet data.</li>
              <li><strong>Custom Grouping</strong> - Group track sheet data by vehicle or salesman for better organization.</li>
              <li><strong>PDF Customization</strong> - Adjust font size, cell padding and line height to perfect your exports.</li>
              <li><strong>Print & Export</strong> - Generate CSV, PDF or print your track sheets for physical distribution.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackSheet;
