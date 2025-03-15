import React, { useState } from 'react';
import { Document } from '../../context/EditorContext';

interface ExportComponentProps {
  document: Document;
}

const ExportComponent: React.FC<ExportComponentProps> = ({ document }) => {
  const [format, setFormat] = useState<'pdf' | 'epub'>('pdf');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleExport = async () => {
    if (!document || !document.content) {
      setError('No content to export');
      return;
    }
    
    setError(null);
    setIsExporting(true);
    
    try {
      if (format === 'pdf') {
        await exportToPdf(document);
      } else if (format === 'epub') {
        await exportToEpub(document);
      }
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export document. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportToPdf = async (doc: Document) => {
    // In a real implementation, this would use jsPDF to generate a PDF
    // For now, we'll simulate the export process
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a blob that would represent the PDF
    const blob = new Blob([doc.content], { type: 'application/pdf' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title || 'document'}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  const exportToEpub = async (doc: Document) => {
    // In a real implementation, this would use a library to generate an ePub
    // For now, we'll simulate the export process
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a blob that would represent the ePub
    const blob = new Blob([doc.content], { type: 'application/epub+zip' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title || 'document'}.epub`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Export Document</h3>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md mb-3">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Export Format
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as 'pdf' | 'epub')}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="pdf">PDF Document</option>
          <option value="epub">ePub eBook</option>
        </select>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {format === 'pdf' 
            ? 'Export as a PDF document suitable for printing or sharing.' 
            : 'Export as an ePub file compatible with most e-readers.'}
        </p>
      </div>
      
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isExporting ? `Exporting as ${format.toUpperCase()}...` : `Export as ${format.toUpperCase()}`}
      </button>
    </div>
  );
};

export default ExportComponent;
