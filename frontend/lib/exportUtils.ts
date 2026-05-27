/**
 * Export utilities for generating CSV, PDF, and Excel files
 */

export interface ExportData {
  headers: string[];
  rows: (string | number | boolean | null)[][];
}

/**
 * Convert data to CSV format
 */
export function generateCSV(data: ExportData): Blob {
  const csvContent = [
    data.headers.map(h => `"${h}"`).join(','),
    ...data.rows.map(row =>
      row.map(cell => {
        if (cell === null || cell === undefined) return '';
        if (typeof cell === 'string') return `"${cell.replace(/"/g, '""')}"`;
        return cell;
      }).join(',')
    ),
  ].join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Generate Excel file using SheetJS
 */
export async function generateExcel(data: ExportData, sheetName: string = 'Report'): Promise<Blob> {
  const XLSX = await import('xlsx');
  
  const worksheet = XLSX.utils.aoa_to_sheet([
    data.headers,
    ...data.rows,
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  return new Promise((resolve) => {
    XLSX.write(workbook, { bookType: 'xlsx', type: 'blob' });
  });
}

/**
 * Convert HTML table to PDF
 */
export async function generatePDF(
  data: ExportData,
  title: string = 'Report',
): Promise<Blob> {
  const jsPDF = (await import('jspdf')).jsPDF;
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;

  // Add title
  doc.setFontSize(16);
  doc.text(title, margin, margin);

  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, margin + 8);

  // Add table
  autoTable(doc, {
    head: [data.headers],
    body: data.rows.map(row =>
      row.map(cell => {
        if (cell === null || cell === undefined) return '';
        return String(cell);
      })
    ),
    startY: margin + 15,
    margin: margin,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
  });

  return doc.output('blob');
}

/**
 * Download a blob file
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
