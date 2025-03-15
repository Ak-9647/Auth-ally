import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Document, Id, useDocument } from './ConvexStorageService';

// Types
export interface DocumentVersion {
  id: string;
  documentId: string;
  content: string;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
  };
  changeDescription?: string;
}

export interface Collaborator {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';
  addedAt: Date;
}

export interface CollaborationPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canExport: boolean;
}

// Mock collaborators data for now - would be replaced with actual API calls
export const useDocumentCollaborators = (documentId: string): { 
  collaborators: Collaborator[];
  isLoading: boolean;
  error: Error | null;
  addCollaborator: (email: string, role: 'editor' | 'viewer') => Promise<boolean>;
  removeCollaborator: (collaboratorId: string) => Promise<boolean>;
  updateCollaboratorRole: (collaboratorId: string, role: 'editor' | 'viewer') => Promise<boolean>;
} => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!documentId) {
      setCollaborators([]);
      setIsLoading(false);
      return;
    }
    
    const fetchCollaborators = async () => {
      try {
        setIsLoading(true);
        
        // Mock data - would be replaced with actual API calls
        const mockData: Collaborator[] = [
          {
            id: 'user-1',
            email: 'current-user@example.com',
            name: 'Current User',
            role: 'owner',
            addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCollaborators(mockData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch collaborators'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCollaborators();
  }, [documentId]);
  
  const addCollaborator = async (email: string, role: 'editor' | 'viewer'): Promise<boolean> => {
    try {
      // This would be an API call in a real implementation
      const newCollaborator: Collaborator = {
        id: `user-${Date.now()}`, // Generate mock ID
        email,
        name: email.split('@')[0], // Use part of email as name
        role,
        addedAt: new Date(),
      };
      
      setCollaborators(prev => [...prev, newCollaborator]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add collaborator'));
      return false;
    }
  };
  
  const removeCollaborator = async (collaboratorId: string): Promise<boolean> => {
    try {
      // This would be an API call in a real implementation
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove collaborator'));
      return false;
    }
  };
  
  const updateCollaboratorRole = async (collaboratorId: string, role: 'editor' | 'viewer'): Promise<boolean> => {
    try {
      // This would be an API call in a real implementation
      setCollaborators(prev => 
        prev.map(c => c.id === collaboratorId ? { ...c, role } : c)
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update collaborator role'));
      return false;
    }
  };
  
  return {
    collaborators,
    isLoading,
    error,
    addCollaborator,
    removeCollaborator,
    updateCollaboratorRole
  };
};

// Hook for document versions management
export const useDocumentVersions = (documentId: string): {
  versions: DocumentVersion[];
  isLoading: boolean;
  error: Error | null;
  createVersion: (changeDescription?: string) => Promise<boolean>;
  restoreVersion: (versionId: string) => Promise<boolean>;
} => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Create a fake document ID object to match ConvexStorageService expectations
  const docId: Id<"documents"> = { id: documentId, tableName: "documents" };
  const document = useDocument(docId);
  
  useEffect(() => {
    if (!documentId) {
      setVersions([]);
      setIsLoading(false);
      return;
    }
    
    const fetchVersions = async () => {
      try {
        setIsLoading(true);
        
        // Mock data - would be replaced with actual API calls
        let mockVersions: DocumentVersion[] = [];
        
        if (document) {
          // Create mock version history
          mockVersions = [
            {
              id: 'version-1',
              documentId,
              content: document.content || '',
              createdAt: new Date(),
              createdBy: {
                id: 'user-1',
                name: 'Current User',
              },
              changeDescription: 'Initial version',
            }
          ];
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setVersions(mockVersions);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch versions'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVersions();
  }, [documentId, document]);
  
  const createVersion = async (changeDescription?: string): Promise<boolean> => {
    if (!document) return false;
    
    try {
      // This would be an API call in a real implementation
      const newVersion: DocumentVersion = {
        id: `version-${Date.now()}`, // Generate mock ID
        documentId,
        content: document.content || '',
        createdAt: new Date(),
        createdBy: {
          id: 'user-1',
          name: 'Current User',
        },
        changeDescription,
      };
      
      setVersions(prev => [newVersion, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create version'));
      return false;
    }
  };
  
  const restoreVersion = async (versionId: string): Promise<boolean> => {
    try {
      // In a real implementation, this would restore the document content
      // For now, we'll just log the action
      console.log(`Restoring document ${documentId} to version ${versionId}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to restore version'));
      return false;
    }
  };
  
  return {
    versions,
    isLoading,
    error,
    createVersion,
    restoreVersion
  };
};

// Hook for permissions checking
export const useDocumentPermissions = (documentId: string): {
  canEdit: boolean;
  canShare: boolean;
  canDelete: boolean;
  isLoading: boolean;
} => {
  const [permissions, setPermissions] = useState({
    canEdit: false,
    canShare: false,
    canDelete: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!documentId) {
      setPermissions({ canEdit: false, canShare: false, canDelete: false });
      setIsLoading(false);
      return;
    }
    
    const checkPermissions = async () => {
      try {
        setIsLoading(true);
        
        // Mock permissions - all true for demo
        // In a real app, this would check user role and permissions
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setPermissions({
          canEdit: true,
          canShare: true,
          canDelete: true,
        });
      } catch (err) {
        console.error('Failed to check permissions:', err);
        // Default to no permissions on error
        setPermissions({
          canEdit: false,
          canShare: false,
          canDelete: false,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermissions();
  }, [documentId]);
  
  return {
    ...permissions,
    isLoading
  };
};

// Auto-backup hook
export const useAutoBackup = (document: Document | null, interval = 5 * 60 * 1000) => {
  const createVersion = useCreateVersion();
  
  React.useEffect(() => {
    if (!document) return;
    
    // Create an initial backup
    createVersion(document, 'Auto-backup');
    
    // Set up interval for periodic backups
    const backupInterval = setInterval(() => {
      if (document) {
        createVersion(document, 'Auto-backup');
      }
    }, interval);
    
    return () => {
      clearInterval(backupInterval);
    };
  }, [document, interval, createVersion]);
}; 