import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Document, useDocuments } from '../../services/ConvexStorageService';

interface DocumentSearchProps {
  className?: string;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const navigate = useNavigate();
  const documents = useDocuments() as Document[];
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = documents.filter(doc => {
      const titleMatch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
      const contentMatch = doc.content.toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch || contentMatch;
    });

    setSearchResults(results.slice(0, 5)); // Limit to 5 results
  }, [searchTerm, documents]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }

      // Escape to close search
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleDocumentSelect = (docId: string) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(`/editor/${docId}`);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input 
          ref={inputRef}
          type="search" 
          className="block w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value.trim() !== '') {
              setIsOpen(true);
            }
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-xs text-gray-500 dark:text-gray-400">
          Ctrl+K
        </div>
      </div>

      {/* Search Results */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          {searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((doc) => (
                <li key={doc._id.id}>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => handleDocumentSelect(doc._id.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                        {doc.title || 'Untitled Document'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {doc.content.substring(0, 60)}...
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : searchTerm.trim() !== '' ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No documents found
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Type to search documents
            </div>
          )}
          
          {searchTerm.trim() !== '' && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <Link
                to={`/editor?search=${encodeURIComponent(searchTerm)}`}
                className="w-full flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                onClick={() => setIsOpen(false)}
              >
                Advanced Search: "{searchTerm}"
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentSearch; 