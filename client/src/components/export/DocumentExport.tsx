import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Document } from '../../services/ConvexStorageService';
import { exportDocument, ExportFormat, defaultExportOptions } from '../../services/ExportService';

interface DocumentExportProps {
  document: Document;
  onClose?: () => void;
}

const DocumentExport: React.FC<DocumentExportProps> = ({ document, onClose }) => {
  const { isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [includeTitle, setIncludeTitle] = useState(true);
  const [includeDate, setIncludeDate] = useState(true);
  const [includeAuthor, setIncludeAuthor] = useState(true);
  const [authorName, setAuthorName] = useState(
    user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''
  );
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'legal'>('a4');
  
  if (!isSignedIn) {
    return null;
  }
  
  const handleExport = async () => {
    try {
      setIsLoading(true);
      
      await exportDocument(document, exportFormat, {
        ...defaultExportOptions,
        includeTitle,
        includeDate,
        includeAuthor,
        authorName,
        pageSize
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error exporting document:', error);
      alert('Failed to export document. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Export Document</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Exporting: <span className="font-medium">{document.title || 'Untitled Document'}</span>
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          {document.content.split(/\s+/).filter(Boolean).length.toLocaleString()} words
        </p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Export Format
          </label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="pdf">PDF Document (.pdf)</option>
            <option value="docx">Microsoft Word (.docx)</option>
            <option value="txt">Plain Text (.txt)</option>
            <option value="md">Markdown (.md)</option>
            <option value="html">HTML Document (.html)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Page Size
          </label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as 'a4' | 'letter' | 'legal')}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={exportFormat === 'txt' || exportFormat === 'md'}
          >
            <option value="a4">A4 (210 × 297 mm)</option>
            <option value="letter">US Letter (8.5 × 11 in)</option>
            <option value="legal">Legal (8.5 × 14 in)</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Include in Export</p>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeTitle"
              checked={includeTitle}
              onChange={(e) => setIncludeTitle(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
            <label htmlFor="includeTitle" className="ml-2 text-gray-700 dark:text-gray-300">
              Document Title
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeAuthor"
              checked={includeAuthor}
              onChange={(e) => setIncludeAuthor(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
            <label htmlFor="includeAuthor" className="ml-2 text-gray-700 dark:text-gray-300">
              Author Name
            </label>
          </div>
          
          {includeAuthor && (
            <div className="pl-6 mt-2">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeDate"
              checked={includeDate}
              onChange={(e) => setIncludeDate(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
            <label htmlFor="includeDate" className="ml-2 text-gray-700 dark:text-gray-300">
              Date
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition duration-300"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleExport}
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300 flex items-center ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export as {exportFormat.toUpperCase()}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentExport; 