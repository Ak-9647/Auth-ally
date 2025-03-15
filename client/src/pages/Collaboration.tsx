import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useDocuments, Document } from '../services/ConvexStorageService';
import { useDocumentCollaborators } from '../services/CollaborationService';
import VersionHistory from '../components/collaboration/VersionHistory';

const Collaboration: React.FC = () => {
  const { isSignedIn } = useUser();
  const documents = useDocuments() as Document[];
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  
  // Get document title
  const getDocumentTitle = (id: string) => {
    const document = documents.find(doc => doc._id.id === id);
    return document?.title || 'Untitled Document';
  };
  
  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Sign in to access collaboration</h2>
          <p className="text-gray-600 dark:text-gray-400">Please sign in to collaborate on documents with others.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Document Collaboration</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Collaborate with others on your documents, manage permissions, and view version history.
        </p>
        
        {/* Document Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select a document
          </label>
          <div className="flex space-x-4">
            <select
              value={selectedDocumentId}
              onChange={(e) => setSelectedDocumentId(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a document</option>
              {documents.map((doc) => (
                <option key={doc._id.id} value={doc._id.id}>
                  {doc.title || 'Untitled Document'}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {selectedDocumentId ? (
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {getDocumentTitle(selectedDocumentId)}
              </h2>
            </div>
            
            <VersionHistory 
              documentId={selectedDocumentId} 
              onVersionRestore={() => {
                // Document was updated, you could perform any refresh operation here if needed
                console.log('Version restored');
              }} 
            />
          </div>
        ) : (
          <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Select a document to view version history and manage collaborators.
            </p>
            {documents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-500">
                You don't have any documents yet. Create your first document to get started.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collaboration; 