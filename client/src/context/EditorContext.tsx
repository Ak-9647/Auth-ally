import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EditorContextType {
  documents: Document[];
  currentDocument: Document | null;
  setCurrentDocument: (document: Document) => void;
  createDocument: (title?: string) => Document;
  saveDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  getDocument: (id: string) => Document | null;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  
  // Load documents from localStorage on initial render
  useEffect(() => {
    try {
      const savedDocuments = localStorage.getItem('author-ally-documents');
      if (savedDocuments) {
        const parsedDocuments = JSON.parse(savedDocuments);
        // Convert string dates back to Date objects
        const documentsWithDates = parsedDocuments.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt)
        }));
        setDocuments(documentsWithDates);
      }
    } catch (error) {
      console.error('Error loading documents from localStorage:', error);
    }
  }, []);
  
  // Save documents to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('author-ally-documents', JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving documents to localStorage:', error);
    }
  }, [documents]);
  
  const createDocument = (title = 'Untitled Document'): Document => {
    const newDocument: Document = {
      id: Date.now().toString(),
      title,
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setDocuments(prevDocuments => [...prevDocuments, newDocument]);
    setCurrentDocument(newDocument);
    return newDocument;
  };
  
  const saveDocument = (document: Document): void => {
    const updatedDocument = {
      ...document,
      updatedAt: new Date()
    };
    
    setDocuments(prevDocuments => 
      prevDocuments.map(doc => 
        doc.id === document.id ? updatedDocument : doc
      )
    );
    
    if (currentDocument?.id === document.id) {
      setCurrentDocument(updatedDocument);
    }
  };
  
  const deleteDocument = (id: string): void => {
    setDocuments(prevDocuments => 
      prevDocuments.filter(doc => doc.id !== id)
    );
    
    if (currentDocument?.id === id) {
      setCurrentDocument(null);
    }
  };
  
  const getDocument = (id: string): Document | null => {
    return documents.find(doc => doc.id === id) || null;
  };
  
  return (
    <EditorContext.Provider 
      value={{ 
        documents, 
        currentDocument, 
        setCurrentDocument, 
        createDocument, 
        saveDocument, 
        deleteDocument, 
        getDocument 
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
