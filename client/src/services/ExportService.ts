import { Document } from './ConvexStorageService';
import { jsPDF } from 'jspdf';
import FileSaver from 'file-saver';
import { marked } from 'marked';
import html2canvas from 'html2canvas';

// Available export formats
export type ExportFormat = 'pdf' | 'docx' | 'txt' | 'md' | 'html';

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'md' | 'html';
  pageSize?: 'a4' | 'letter' | 'legal';
  includeTitle?: boolean;
  includeAuthor?: boolean;
  includeDate?: boolean;
  authorName?: string;
}

// Default export options
export const defaultExportOptions: ExportOptions = {
  includeTitle: true,
  includeDate: true,
  includeAuthor: true,
  authorName: '',
  format: 'pdf',
  pageSize: 'a4'
};

/**
 * Exports a document to the specified format
 */
export const exportDocument = async (
  document: Document,
  options: ExportOptions
): Promise<boolean> => {
  try {
    const { format } = options;
    
    switch (format) {
      case 'pdf':
        return await exportToPdf(document, options);
      case 'docx':
        return await exportToDocx(document, options);
      case 'txt':
        return exportToTxt(document, options);
      case 'md':
        return exportToMarkdown(document, options);
      case 'html':
        return exportToHtml(document, options);
      default:
        console.error(`Unsupported format: ${format}`);
        return false;
    }
  } catch (error) {
    console.error('Error exporting document:', error);
    return false;
  }
};

const getFormattedHeader = (document: Document, options: ExportOptions): string => {
  const parts = [];
  
  if (options.includeTitle && document.title) {
    parts.push(`# ${document.title}`);
  }
  
  if (options.includeAuthor && options.authorName) {
    parts.push(`Author: ${options.authorName}`);
  }
  
  if (options.includeDate) {
    const date = new Date().toLocaleDateString();
    parts.push(`Date: ${date}`);
  }
  
  return parts.length > 0 ? parts.join('\n') + '\n\n' : '';
};

/**
 * Export document to PDF
 * Uses html2pdf.js library (needs to be installed)
 */
const exportToPdf = async (document: Document, options: ExportOptions): Promise<boolean> => {
  try {
    // Create a new PDF document
    const pageSize = options.pageSize || 'a4';
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pageSize,
    });
    
    // Add header if needed
    let yPosition = 10;
    
    if (options.includeTitle && document.title) {
      pdf.setFontSize(16);
      pdf.text(document.title, 10, yPosition);
      yPosition += 10;
    }
    
    if (options.includeAuthor && options.authorName) {
      pdf.setFontSize(12);
      pdf.text(`Author: ${options.authorName}`, 10, yPosition);
      yPosition += 6;
    }
    
    if (options.includeDate) {
      pdf.setFontSize(12);
      const date = new Date().toLocaleDateString();
      pdf.text(`Date: ${date}`, 10, yPosition);
      yPosition += 10;
    }
    
    // Add document content
    pdf.setFontSize(12);
    const content = document.content || '';
    
    // Split content into lines that fit the page width
    const textLines = pdf.splitTextToSize(content, 190);
    
    // Add text lines to PDF document
    let currentPage = 1;
    let maxLinesPerPage = 45; // Estimate
    
    for (let i = 0; i < textLines.length; i++) {
      if (yPosition > 280) { // Near bottom of page
        pdf.addPage();
        currentPage++;
        yPosition = 20;
      }
      
      pdf.text(textLines[i], 10, yPosition);
      yPosition += 6;
    }
    
    // Save PDF
    pdf.save(`${document.title || 'document'}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};

/**
 * Export document to DOCX
 * Uses docx library (needs to be installed)
 */
const exportToDocx = async (document: Document, options: ExportOptions): Promise<boolean> => {
  try {
    // For docx we would ideally use a proper library like docx-js
    // This is a simplified version using html conversion
    
    const header = getFormattedHeader(document, options);
    const content = document.content || '';
    const fullContent = header + content;
    
    // We'll create a preformatted HTML document and convert it
    const preHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${
      document.title || 'Document'
    }</title></head><body>`;
    const postHtml = '</body></html>';
    const html = `${preHtml}<pre>${fullContent}</pre>${postHtml}`;
    
    // Create a Blob containing the document data
    const blob = new Blob([html], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    // Save the file
    FileSaver.saveAs(blob, `${document.title || 'document'}.docx`);
    return true;
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    return false;
  }
};

/**
 * Export document to plain text
 */
const exportToTxt = (document: Document, options: ExportOptions): boolean => {
  try {
    const header = getFormattedHeader(document, options);
    const content = document.content || '';
    const fullContent = header + content;
    
    // Create a Blob containing the document data
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    
    // Save the file
    FileSaver.saveAs(blob, `${document.title || 'document'}.txt`);
    return true;
  } catch (error) {
    console.error('Error exporting to TXT:', error);
    return false;
  }
};

/**
 * Export document to Markdown
 */
const exportToMarkdown = (document: Document, options: ExportOptions): boolean => {
  try {
    const header = getFormattedHeader(document, options);
    const content = document.content || '';
    const fullContent = header + content;
    
    // Create a Blob containing the document data
    const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8' });
    
    // Save the file
    FileSaver.saveAs(blob, `${document.title || 'document'}.md`);
    return true;
  } catch (error) {
    console.error('Error exporting to Markdown:', error);
    return false;
  }
};

/**
 * Export document to HTML
 */
const exportToHtml = (document: Document, options: ExportOptions): boolean => {
  try {
    // Create HTML content with proper formatting
    const title = document.title || 'Document';
    const content = document.content || '';
    
    // Convert markdown to HTML if needed
    const htmlContent = marked(content);
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3em;
        }
        .author, .date {
            color: #6c757d;
            margin-bottom: 10px;
        }
        .content {
            margin-top: 20px;
        }
    </style>
</head>
<body>`;

    if (options.includeTitle) {
      html += `\n    <h1>${title}</h1>`;
    }
    
    if (options.includeAuthor && options.authorName) {
      html += `\n    <div class="author">Author: ${options.authorName}</div>`;
    }
    
    if (options.includeDate) {
      const date = new Date().toLocaleDateString();
      html += `\n    <div class="date">Date: ${date}</div>`;
    }
    
    html += `\n    <div class="content">${htmlContent}</div>`;
    html += `\n</body>\n</html>`;
    
    // Create a Blob containing the document data
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    
    // Save the file
    FileSaver.saveAs(blob, `${title}.html`);
    return true;
  } catch (error) {
    console.error('Error exporting to HTML:', error);
    return false;
  }
}; 