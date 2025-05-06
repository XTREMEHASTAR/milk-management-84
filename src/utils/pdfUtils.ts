
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
  
  // Add title and date with styling
  // Create a gradient background for the title area
  doc.setFillColor(16, 185, 129); // Teal color
  doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');
  
  // Add title with styling
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(options.title, doc.internal.pageSize.width / 2, 10, { align: 'center' });
  
  // Add subtitle
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(options.subtitle || "", 14, 30);
  
  let yPosition = 40;
  
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
      doc.text(`${info.label}: ${info.value}`, doc.internal.pageSize.width - 20, yPosition - 8, { align: 'right' });
    });
  }
  
  // Generate the PDF table with styling that matches the UI
  autoTable(doc, {
    head: [columns],
    body: data,
    startY: yPosition,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { 
      fillColor: options.theme === "dark" ? [22, 78, 99] : [22, 163, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { 
      fillColor: options.theme === "dark" ? [40, 54, 60] : [243, 244, 246]
    },
    footStyles: { 
      fillColor: options.theme === "dark" ? [16, 65, 82] : [220, 252, 231],
      fontStyle: 'bold'
    },
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
  doc.save(options.filename);
  return true;
};

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
      theme: options.theme || "light"
    }
  );
};
