import React, { useState } from 'react';
import { Document } from '../../context/EditorContext';

interface CollaborationToolsProps {
  document: Document;
}

const CollaborationTools: React.FC<CollaborationToolsProps> = ({ document }) => {
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [newCollaborator, setNewCollaborator] = useState<string>('');
  const [shareLink, setShareLink] = useState<string>('');
  const [permissionLevel, setPermissionLevel] = useState<'view' | 'edit' | 'owner'>('view');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleAddCollaborator = () => {
    if (!newCollaborator || !newCollaborator.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (collaborators.includes(newCollaborator)) {
      setError('This person is already a collaborator');
      return;
    }
    
    setError(null);
    setCollaborators([...collaborators, newCollaborator]);
    setNewCollaborator('');
    setSuccess(`Invitation sent to ${newCollaborator}`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };
  
  const handleRemoveCollaborator = (email: string) => {
    setCollaborators(collaborators.filter(c => c !== email));
  };
  
  const generateShareLink = () => {
    // In a real implementation, this would generate a unique link with the server
    // For now, we'll create a mock link
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const link = `https://author-ally.com/shared/${document.id}/${uniqueId}?permission=${permissionLevel}`;
    setShareLink(link);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(
      () => {
        setSuccess('Link copied to clipboard');
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      },
      () => {
        setError('Failed to copy link');
      }
    );
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Collaboration Tools</h3>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md mb-3">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md mb-3">
          {success}
        </div>
      )}
      
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Invite Collaborators</h4>
        <div className="flex space-x-2">
          <input
            type="email"
            value={newCollaborator}
            onChange={(e) => setNewCollaborator(e.target.value)}
            placeholder="Enter email address"
            className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
          <select
            value={permissionLevel}
            onChange={(e) => setPermissionLevel(e.target.value as 'view' | 'edit' | 'owner')}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="view">Can view</option>
            <option value="edit">Can edit</option>
            <option value="owner">Owner</option>
          </select>
          <button
            onClick={handleAddCollaborator}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Invite
          </button>
        </div>
      </div>
      
      {collaborators.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Current Collaborators</h4>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {collaborators.map((email, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <span>{email}</span>
                <button
                  onClick={() => handleRemoveCollaborator(email)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Share Link</h4>
        <div className="flex space-x-2 mb-2">
          <button
            onClick={generateShareLink}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Generate Link
          </button>
        </div>
        
        {shareLink && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-gray-50"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Copy
            </button>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>Note: Collaboration features require a premium subscription in the full version.</p>
      </div>
    </div>
  );
};

export default CollaborationTools;
