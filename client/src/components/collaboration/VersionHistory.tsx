import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  useDocumentVersions, 
  useDocumentCollaborators,
  useDocumentPermissions,
  DocumentVersion,
  Collaborator 
} from '../../services/CollaborationService';

interface VersionHistoryProps {
  documentId: string;
  onVersionRestore?: () => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ 
  documentId,
  onVersionRestore 
}) => {
  const { isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState<'versions' | 'collaborators'>('versions');
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newCollaboratorRole, setNewCollaboratorRole] = useState<'editor' | 'viewer'>('viewer');
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  
  // Get versions, collaborators and permissions
  const { 
    versions, 
    isLoading: versionsLoading, 
    createVersion,
    restoreVersion
  } = useDocumentVersions(documentId);
  
  const { 
    collaborators, 
    isLoading: collaboratorsLoading,
    addCollaborator,
    removeCollaborator,
    updateCollaboratorRole
  } = useDocumentCollaborators(documentId);
  
  const { canShare } = useDocumentPermissions(documentId);
  
  if (!isSignedIn) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
        <p className="text-gray-600 dark:text-gray-400">Sign in to view document history and manage collaborators.</p>
      </div>
    );
  }
  
  const handleVersionRestore = async (versionId: string) => {
    const success = await restoreVersion(versionId);
    if (success && onVersionRestore) {
      onVersionRestore();
    }
  };
  
  const handleSaveVersion = async () => {
    const description = prompt('Enter a description for this version (optional):');
    await createVersion(description || undefined);
  };
  
  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail) return;
    
    setIsAddingCollaborator(true);
    try {
      const success = await addCollaborator(newCollaboratorEmail, newCollaboratorRole);
      if (success) {
        setNewCollaboratorEmail('');
      }
    } finally {
      setIsAddingCollaborator(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'versions'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('versions')}
        >
          Version History
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'collaborators'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('collaborators')}
        >
          Collaborators
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'versions' ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Version History</h3>
              <button
                onClick={handleSaveVersion}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Current Version
              </button>
            </div>
            
            {versionsLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">Loading versions...</p>
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No version history available.</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Save a version to start tracking changes.
                </p>
              </div>
            ) : (
              <div className="overflow-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {versions.map((version) => (
                      <tr key={version.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(version.createdAt)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {version.createdBy.name}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {version.changeDescription || 'No description'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleVersionRestore(version.id)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Collaborators</h3>
              {canShare && (
                <button
                  onClick={() => setIsAddingCollaborator(!isAddingCollaborator)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isAddingCollaborator ? 'Cancel' : 'Add Collaborator'}
                </button>
              )}
            </div>
            
            {isAddingCollaborator && (
              <div className="mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded">
                <div className="flex flex-col space-y-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newCollaboratorEmail}
                    onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  <div className="flex space-x-2">
                    <select
                      value={newCollaboratorRole}
                      onChange={(e) => setNewCollaboratorRole(e.target.value as 'editor' | 'viewer')}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="viewer">Viewer (can read)</option>
                      <option value="editor">Editor (can edit)</option>
                    </select>
                    <button
                      onClick={handleAddCollaborator}
                      disabled={!newCollaboratorEmail}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {collaboratorsLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">Loading collaborators...</p>
              </div>
            ) : collaborators.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No collaborators yet.</p>
              </div>
            ) : (
              <div className="overflow-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Added
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {collaborators.map((collaborator) => (
                      <tr key={collaborator.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {collaborator.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {collaborator.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {collaborator.role === 'owner' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              Owner
                            </span>
                          ) : collaborator.role === 'editor' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              Editor
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              Viewer
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(collaborator.addedAt)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                          {collaborator.role !== 'owner' && canShare && (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => updateCollaboratorRole(
                                  collaborator.id, 
                                  collaborator.role === 'editor' ? 'viewer' : 'editor'
                                )}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                              >
                                {collaborator.role === 'editor' ? 'Make Viewer' : 'Make Editor'}
                              </button>
                              <button
                                onClick={() => removeCollaborator(collaborator.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionHistory; 