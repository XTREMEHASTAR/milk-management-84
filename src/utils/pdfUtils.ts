
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { UISettings } from "@/types";

interface PdfTableColumn {
  header: string;
  dataKey: string;
}

interface PdfExportOptions {
  title: string;
  subtitle?: string;
  dateInfo?: string;
  additionalInfo?: { label: string; value: string }[];
  filename: string;
  landscape?: boolean;
  theme?: UISettings["theme"];
  fontSizeAdjustment?: number; 
  columnWidths?: string[];
  cellPadding?: number; // Option to control cell padding
  lineHeight?: number;  // Option to control line height
  showTitle?: boolean;  // Option to hide title section
  compactLayout?: boolean; // Option for more compact track sheet layout
}

export const exportToPdf = (
  columns: string[],
  data: any[][],
  options: PdfExportOptions
) => {
  // Create PDF with orientation
  const doc = new jsPDF({
    orientation: options.landscape ? 'landscape' : 'portrait',
    unit: 'mm',
  });
  
  // Calculate available width for proper scaling
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margins = options.compactLayout ? 10 : 20; // Smaller margins for compact layout
  const availableWidth = pageWidth - (margins * 2);
  
  // Set default font size with adjustment
  const baseFontSize = options.compactLayout ? 8 : 10;
  const fontSize = baseFontSize + (options.fontSizeAdjustment || 0);
  doc.setFontSize(fontSize);
  
  let yPosition = 20;
  
  // Only add title/header if showTitle is not false
  if (options.showTitle !== false) {
    // Create header with gradient background
    doc.setFillColor(16, 185, 129); // Teal color
    doc.rect(0, 0, pageWidth, 20, 'F');
    
    // Add title with styling
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(options.title, pageWidth / 2, 10, { align: 'center' });
    
    // Add subtitle
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(options.subtitle || "", 14, 30);
    
    yPosition = 40;
    
    // Add date if provided
    if (options.dateInfo) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(options.dateInfo, 14, yPosition);
      yPosition += 8;
    }
    
    // Add additional info if provided
    if (options.additionalInfo) {
      options.additionalInfo.forEach(info => {
        doc.text(`${info.label}: ${info.value}`, pageWidth - 20, yPosition - 8, { align: 'right' });
      });
    }
  }
  
  // Calculate column widths - either use provided widths or calculate automatically
  let colWidths = [];
  if (options.columnWidths && options.columnWidths.length === columns.length) {
    // Convert string percentages to actual widths
    colWidths = options.columnWidths.map(width => {
      if (typeof width === 'string' && width.endsWith('%')) {
        const percentage = parseFloat(width) / 100;
        return availableWidth * percentage;
      }
      return undefined; // Auto-size
    });
  }
  
  // Default cell padding - more compact for track sheet
  const cellPadding = options.compactLayout ? 2 : (options.cellPadding || 4);
  const lineHeightValue = options.compactLayout ? 1.1 : (options.lineHeight || 1.3);
  
  // Generate the PDF table with improved styling for track sheet layout
  autoTable(doc, {
    head: [columns],
    body: data,
    startY: options.showTitle !== false ? yPosition : 10,
    styles: { 
      fontSize: fontSize,
      cellPadding: cellPadding,
      lineColor: [80, 80, 80],
      lineWidth: 0.1, // Thinner lines for track sheet look
      overflow: 'linebreak',
      halign: options.compactLayout ? 'center' : 'center',
      valign: 'middle',
      minCellHeight: options.compactLayout ? 8 : 12,
    },
    headStyles: { 
      fillColor: options.theme === "dark" ? [22, 78, 99] : [240, 240, 240], // Light gray header for track sheet look
      textColor: options.theme === "dark" ? [255, 255, 255] : [0, 0, 0],  // Black text for track sheet
      fontStyle: 'bold',
      minCellHeight: options.compactLayout ? 10 : 14,
      cellPadding: cellPadding,
      halign: 'center',
    },
    alternateRowStyles: { 
      fillColor: options.theme === "dark" ? [40, 54, 60] : [255, 255, 255]  // White background for track sheet
    },
    footStyles: { 
      fillColor: options.theme === "dark" ? [16, 65, 82] : [240, 240, 240],
      fontStyle: 'bold',
      cellPadding: cellPadding,
    },
    theme: 'grid', // Use grid theme for track sheet look
    columnStyles: colWidths.length > 0 ? colWidths.reduce((acc, width, index) => {
      if (width !== undefined) {
        acc[index] = { cellWidth: width };
      }
      return acc;
    }, {}) : {},
    margin: { top: options.compactLayout ? 5 : 10, right: margins, bottom: options.compactLayout ? 5 : 15, left: margins },
    tableWidth: 'auto',
    willDrawCell: (data) => {
      // Apply custom line height by adjusting cell height
      if (lineHeightValue > 1) {
        const textHeight = data.cell.height;
        const newHeight = textHeight * lineHeightValue;
        data.cell.height = newHeight;
      }
    }
  });
  
  // Add footer with date and page numbers (only for non-compact layouts)
  if (!options.compactLayout) {
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on: ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
  }
  
  // Save the PDF
  doc.save(options.filename);
  return true;
};

// Generate a data URL from the PDF for preview
export const generatePdfPreview = (
  columns: string[],
  data: any[][],
  options: PdfExportOptions
): string => {
  // Create PDF with orientation
  const doc = new jsPDF({
    orientation: options.landscape ? 'landscape' : 'portrait',
    unit: 'mm',
  });
  
  // Calculate available width for proper scaling
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margins = options.compactLayout ? 10 : 20; // Smaller margins for track sheet
  const availableWidth = pageWidth - (margins * 2);
  
  // Set default font size with adjustment
  const baseFontSize = options.compactLayout ? 8 : 10;
  const fontSize = baseFontSize + (options.fontSizeAdjustment || 0);
  doc.setFontSize(fontSize);
  
  let yPosition = 20;
  
  // Only add title section if showTitle is not false
  if (options.showTitle !== false) {
    // Create header with gradient background
    doc.setFillColor(16, 185, 129); // Teal color
    doc.rect(0, 0, pageWidth, 20, 'F');
    
    // Add title with styling
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(options.title, pageWidth / 2, 10, { align: 'center' });
    
    // Add subtitle
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(options.subtitle || "", 14, 30);
    
    yPosition = 40;
    
    // Add date if provided
    if (options.dateInfo) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(options.dateInfo, 14, yPosition);
      yPosition += 8;
    }
    
    // Add additional info if provided
    if (options.additionalInfo) {
      options.additionalInfo.forEach(info => {
        doc.text(`${info.label}: ${info.value}`, pageWidth - 20, yPosition - 8, { align: 'right' });
      });
    }
  }
  
  // Calculate column widths - either use provided widths or calculate automatically
  let colWidths = [];
  if (options.columnWidths && options.columnWidths.length === columns.length) {
    // Convert string percentages to actual widths
    colWidths = options.columnWidths.map(width => {
      if (typeof width === 'string' && width.endsWith('%')) {
        const percentage = parseFloat(width) / 100;
        return availableWidth * percentage;
      }
      return undefined; // Auto-size
    });
  }
  
  // Default cell padding - more compact for track sheet
  const cellPadding = options.compactLayout ? 2 : (options.cellPadding || 4);
  const lineHeightValue = options.compactLayout ? 1.1 : (options.lineHeight || 1.3);
  
  // Generate the PDF table with improved styling for track sheet
  autoTable(doc, {
    head: [columns],
    body: data,
    startY: options.showTitle !== false ? yPosition : 10,
    styles: { 
      fontSize: fontSize,
      cellPadding: cellPadding,
      lineColor: [80, 80, 80],
      lineWidth: 0.1, // Thinner lines for track sheet look
      overflow: 'linebreak',
      halign: options.compactLayout ? 'center' : 'center',
      valign: 'middle',
      minCellHeight: options.compactLayout ? 8 : 12,
    },
    headStyles: { 
      fillColor: options.theme === "dark" ? [22, 78, 99] : [240, 240, 240], // Light gray header for track sheet
      textColor: options.theme === "dark" ? [255, 255, 255] : [0, 0, 0],  // Black text for track sheet
      fontStyle: 'bold',
      minCellHeight: options.compactLayout ? 10 : 14,
      cellPadding: cellPadding,
      halign: 'center',
    },
    alternateRowStyles: { 
      fillColor: options.theme === "dark" ? [40, 54, 60] : [255, 255, 255] // White background for track sheet
    },
    footStyles: { 
      fillColor: options.theme === "dark" ? [16, 65, 82] : [240, 240, 240],
      fontStyle: 'bold',
      cellPadding: cellPadding,
    },
    theme: 'grid', // Use grid theme for track sheet look
    columnStyles: colWidths.length > 0 ? colWidths.reduce((acc, width, index) => {
      if (width !== undefined) {
        acc[index] = { cellWidth: width };
      }
      return acc;
    }, {}) : {},
    margin: { top: options.compactLayout ? 5 : 10, right: margins, bottom: options.compactLayout ? 5 : 15, left: margins },
    tableWidth: 'auto',
    willDrawCell: (data) => {
      // Apply custom line height by adjusting cell height
      if (lineHeightValue > 1) {
        const textHeight = data.cell.height;
        const newHeight = textHeight * lineHeightValue;
        data.cell.height = newHeight;
      }
    }
  });
  
  // Add footer with date and page numbers (only for non-compact layouts)
  if (!options.compactLayout) {
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on: ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
  }
  
  // Return as data URL
  return doc.output('datauristring');
};

// Create a special function for track sheet exports
export const exportTrackSheet = (
  headers: string[],
  data: any[][],
  title: string,
  filename: string,
  options: {
    dateInfo?: string;
    landscape?: boolean;
    theme?: UISettings["theme"];
    columnWidths?: string[];
  } = {}
) => {
  return exportToPdf(
    headers,
    data,
    {
      title,
      filename,
      landscape: true, // Track sheets are typically landscape
      theme: options.theme || "light",
      compactLayout: true, // Use compact layout for track sheet
      showTitle: false, // Don't show title section for track sheet
      columnWidths: options.columnWidths,
      cellPadding: 2, // Very small padding for compact track sheet
      lineHeight: 1.1, // Reduced line height for track sheet
      dateInfo: options.dateInfo
    }
  );
};

// Export regular data table with default styling
export const exportDataTable = (
  headers: string[],
  data: any[][],
  title: string,
  filename: string,
  options: {
    landscape?: boolean;
    dateInfo?: string;
    additionalInfo?: { label: string; value: string }[];
    theme?: UISettings["theme"];
    fontSizeAdjustment?: number;
    columnWidths?: string[];
    cellPadding?: number;
    lineHeight?: number;
  } = {}
) => {
  return exportToPdf(
    headers,
    data,
    {
      title,
      subtitle: "Data Export",
      dateInfo: options.dateInfo || `Date: ${format(new Date(), "dd MMMM yyyy")}`,
      additionalInfo: options.additionalInfo,
      filename,
      landscape: options.landscape || false,
      theme: options.theme || "light",
      fontSizeAdjustment: options.fontSizeAdjustment || 0,
      columnWidths: options.columnWidths,
      cellPadding: options.cellPadding,
      lineHeight: options.lineHeight
    }
  );
};

// Function to preview data table as PDF
export const previewDataTableAsPdf = (
  headers: string[],
  data: any[][],
  title: string,
  options: {
    landscape?: boolean;
    dateInfo?: string;
    additionalInfo?: { label: string; value: string }[];
    theme?: UISettings["theme"];
    fontSizeAdjustment?: number;
    columnWidths?: string[];
    cellPadding?: number;
    lineHeight?: number;
  } = {}
): string => {
  return generatePdfPreview(
    headers,
    data,
    {
      title,
      subtitle: "Data Export",
      dateInfo: options.dateInfo || `Date: ${format(new Date(), "dd MMMM yyyy")}`,
      additionalInfo: options.additionalInfo,
      filename: "preview.pdf", // Not used for preview
      landscape: options.landscape || false,
      theme: options.theme || "light",
      fontSizeAdjustment: options.fontSizeAdjustment || 0,
      columnWidths: options.columnWidths,
      cellPadding: options.cellPadding,
      lineHeight: options.lineHeight
    }
  );
};
