
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Define type for PDF export options
interface PdfExportOptions {
  title?: string;
  subtitle?: string;
  dateInfo?: string;
  additionalInfo?: Array<{ label: string; value: string }>;
  landscape?: boolean;
  fontSizeAdjustment?: number;
  filename?: string;
  style?: {
    primaryColor?: string;
    fontFamily?: string;
    showHeader?: boolean;
    showFooter?: boolean;
  };
  logoUrl?: string;
  columnWidths?: string[];
  cellPadding?: number;
  lineHeight?: number;
  theme?: string;
}

/**
 * Generate PDF preview as data URL
 * @param columns - Column headers
 * @param data - Table data rows
 * @param options - PDF generation options
 * @returns Data URL of generated PDF
 */
export function generatePdfPreview(
  columns: string[],
  data: any[][],
  options: PdfExportOptions = {}
): string {
  try {
    // Set defaults
    const {
      title = 'Document',
      subtitle = '',
      dateInfo = '',
      additionalInfo = [],
      landscape = false,
      fontSizeAdjustment = 0,
      filename = 'document.pdf',
      style = {
        primaryColor: '#4f46e5',
        fontFamily: 'helvetica',
        showHeader: true,
        showFooter: true
      },
      logoUrl,
      columnWidths,
      cellPadding = 3,
      lineHeight = 1.3,
      theme
    } = options;

    // Create PDF document
    const doc = new jsPDF({
      orientation: landscape ? 'landscape' : 'portrait',
      unit: 'mm'
    });

    // Customize styles based on provided options
    const primaryColor = style.primaryColor || '#4f46e5';
    const fontFamily = style.fontFamily || 'helvetica';
    const showHeader = style.showHeader !== false;
    const showFooter = style.showFooter !== false;

    // Set default font
    doc.setFont(fontFamily);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    
    let yPos = margin;

    // Add header with logo if provided
    if (showHeader) {
      if (logoUrl) {
        try {
          doc.addImage(logoUrl, 'PNG', margin, yPos, 30, 15);
          yPos += 20;
        } catch (error) {
          console.error('Error adding logo:', error);
        }
      }

      // Add title
      doc.setFontSize(16 + fontSizeAdjustment);
      doc.setTextColor(0, 0, 0);
      doc.text(title, margin, yPos);
      yPos += 8;

      // Add subtitle
      if (subtitle) {
        doc.setFontSize(12 + fontSizeAdjustment);
        doc.text(subtitle, margin, yPos);
        yPos += 6;
      }

      // Add date info
      if (dateInfo) {
        doc.setFontSize(10 + fontSizeAdjustment);
        doc.text(dateInfo, margin, yPos);
        yPos += 10;
      }

      // Add additional info
      if (additionalInfo && additionalInfo.length > 0) {
        doc.setFontSize(10 + fontSizeAdjustment);
        additionalInfo.forEach(info => {
          doc.text(`${info.label}: ${info.value}`, margin, yPos);
          yPos += 5;
        });
        yPos += 5;
      }
    }

    // Add table
    doc.setFontSize(10 + fontSizeAdjustment);
    
    // Configure column widths if provided
    let columnStyles = {};
    if (columnWidths && columnWidths.length > 0) {
      columnWidths.forEach((width, index) => {
        columnStyles[index] = { cellWidth: width };
      });
    }
    
    // @ts-ignore - jspdf-autotable types are not fully compatible
    doc.autoTable({
      head: [columns],
      body: data,
      startY: yPos,
      styles: {
        fontSize: 10 + fontSizeAdjustment,
        cellPadding: cellPadding || 3,
        lineHeight: lineHeight || 1.3
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: columnStyles,
      margin: { top: yPos, left: margin, right: margin, bottom: showFooter ? 25 : margin }
    });

    // Add footer
    if (showFooter) {
      const finalY = (doc as any).lastAutoTable.finalY || pageHeight - 20;
      
      // Check if we need a new page for footer
      if (finalY > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
      } else {
        yPos = finalY + 10;
      }

      doc.setFontSize(8 + fontSizeAdjustment);
      doc.setTextColor(128, 128, 128);
      doc.text('Thank you for your business!', margin, yPos);
      
      // Page numbers at the bottom
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 25, pageHeight - 10);
      }
    }

    // Output as data URL
    return doc.output('datauristring');
  } catch (error) {
    console.error('Error generating PDF:', error);
    return '';
  }
}

/**
 * Export data as PDF file for download
 * @param columns - Column headers  
 * @param data - Table data rows
 * @param options - PDF generation options
 */
export function exportToPdf(
  columns: string[],
  data: any[][],
  options: PdfExportOptions = {}
): void {
  try {
    const { filename = 'document.pdf' } = options;
    
    // Generate PDF as data URL
    const pdfDataUrl = generatePdfPreview(columns, data, options);
    
    if (!pdfDataUrl) {
      throw new Error("Failed to generate PDF");
    }
    
    // Create a download link
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
}

/**
 * Preview data table as PDF and return data URL
 * @param columns - Column headers
 * @param data - Table data rows
 * @param title - Document title
 * @param options - PDF generation options
 * @returns Data URL of generated PDF
 */
export function previewDataTableAsPdf(
  columns: string[],
  data: any[][],
  title: string = "Data Table",
  options: PdfExportOptions = {}
): string {
  try {
    return generatePdfPreview(columns, data, {
      title,
      subtitle: options.subtitle || "Data Preview",
      ...options
    });
  } catch (error) {
    console.error('Error previewing data table as PDF:', error);
    return '';
  }
}

/**
 * Export track sheet as PDF
 * @param headers - Table headers
 * @param rows - Table data rows
 * @param title - Document title
 * @param filename - Output filename
 * @param options - PDF export options
 */
export function exportTrackSheet(
  headers: string[],
  rows: any[][],
  title: string,
  filename: string = "track_sheet.pdf",
  options: PdfExportOptions = {}
): void {
  // Use the generic exportToPdf function with track sheet specific settings
  exportToPdf(
    headers,
    rows,
    {
      title,
      subtitle: "Track Sheet",
      filename,
      landscape: true,
      ...options
    }
  );
}
