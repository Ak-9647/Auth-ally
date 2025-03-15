import { Document } from '../context/EditorContext';

// Storage service for document persistence
class StorageService {
  private readonly DOCUMENTS_KEY = 'author-ally-documents';
  
  // Save all documents to localStorage
  public saveDocuments(documents: Document[]): void {
    try {
      const serializedDocuments = JSON.stringify(documents);
      localStorage.setItem(this.DOCUMENTS_KEY, serializedDocuments);
    } catch (error) {
      console.error('Error saving documents to localStorage:', error);
      throw new Error('Failed to save documents');
    }
  }
  
  // Load all documents from localStorage
  public loadDocuments(): Document[] {
    try {
      const serializedDocuments = localStorage.getItem(this.DOCUMENTS_KEY);
      if (!serializedDocuments) {
        return [];
      }
      
      const parsedDocuments = JSON.parse(serializedDocuments);
      
      // Convert string dates back to Date objects
      return parsedDocuments.map((doc: any) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading documents from localStorage:', error);
      return [];
    }
  }
  
  // Save a single document to localStorage
  public saveDocument(document: Document): void {
    try {
      const documents = this.loadDocuments();
      const existingIndex = documents.findIndex(doc => doc.id === document.id);
      
      if (existingIndex >= 0) {
        documents[existingIndex] = {
          ...document,
          updatedAt: new Date()
        };
      } else {
        documents.push(document);
      }
      
      this.saveDocuments(documents);
    } catch (error) {
      console.error('Error saving document to localStorage:', error);
      throw new Error('Failed to save document');
    }
  }
  
  // Get a single document from localStorage
  public getDocument(id: string): Document | null {
    try {
      const documents = this.loadDocuments();
      return documents.find(doc => doc.id === id) || null;
    } catch (error) {
      console.error('Error getting document from localStorage:', error);
      return null;
    }
  }
  
  // Delete a document from localStorage
  public deleteDocument(id: string): void {
    try {
      const documents = this.loadDocuments();
      const filteredDocuments = documents.filter(doc => doc.id !== id);
      this.saveDocuments(filteredDocuments);
    } catch (error) {
      console.error('Error deleting document from localStorage:', error);
      throw new Error('Failed to delete document');
    }
  }
  
  // Check available storage space
  public checkStorageAvailability(): { available: boolean; remainingSpace?: number } {
    try {
      // Test if localStorage is available
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      
      // Estimate remaining space (this is an approximation)
      let remainingSpace: number | undefined;
      
      try {
        // Try to determine remaining space
        const maxSize = 5 * 1024 * 1024; // 5MB typical limit
        const testString = 'a'.repeat(1024 * 1024); // 1MB string
        let i = 0;
        
        localStorage.setItem(testKey, '');
        
        // Keep adding data until we hit an error
        while (i < 5) {
          localStorage.setItem(testKey, localStorage.getItem(testKey) + testString);
          i++;
        }
        
        // If we get here, we have at least 5MB available
        remainingSpace = maxSize;
      } catch (e) {
        // We hit the storage limit
        remainingSpace = 0;
      } finally {
        localStorage.removeItem(testKey);
      }
      
      return { available: true, remainingSpace };
    } catch (e) {
      return { available: false };
    }
  }
  
  // Clear all data from localStorage
  public clearAllData(): void {
    try {
      localStorage.removeItem(this.DOCUMENTS_KEY);
    } catch (error) {
      console.error('Error clearing data from localStorage:', error);
      throw new Error('Failed to clear data');
    }
  }
}

export default new StorageService();
