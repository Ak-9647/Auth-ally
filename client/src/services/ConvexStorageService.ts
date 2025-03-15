import React from 'react';
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";

// These are placeholder types until Convex is fully set up
export type Id<T extends string> = { id: string; tableName: T };

// Placeholder for the generated API - commented out to avoid linter errors
// const api = {
//   documents: {
//     getDocuments: "documents:getDocuments",
//     getDocument: "documents:getDocument",
//     createDocument: "documents:createDocument",
//     updateDocument: "documents:updateDocument",
//     deleteDocument: "documents:deleteDocument"
//   },
//   bookCovers: {
//     getBookCovers: "bookCovers:getBookCovers",
//     createBookCover: "bookCovers:createBookCover",
//     deleteBookCover: "bookCovers:deleteBookCover"
//   }
// };

// Uncomment these once Convex is initialized
// import { api } from "../../convex/_generated/api";
// import { Id } from "../../convex/_generated/dataModel";

// Comment out this import until Convex is fully set up
// import { api } from "../../convex/_generated/api";
// import { Id } from "../../convex/_generated/dataModel";

export interface Document {
  _id: Id<"documents">;
  title: string;
  content: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface BookCover {
  _id: Id<"bookCovers">;
  title: string;
  author: string;
  genre: string;
  description?: string;
  style: string;
  imageUrl: string;
  userId: string;
  createdAt: number;
}

// Real implementation using local storage until Convex is fully set up
export const useDocuments = () => {
  const { user } = useUser();
  const [documents, setDocuments] = React.useState<Document[]>([]);
  
  React.useEffect(() => {
    if (user) {
      // Load documents from local storage
      const storedDocs = localStorage.getItem(`documents_${user.id}`);
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      }
    }
  }, [user]);
  
  return documents;
};

export const useDocument = (id: Id<"documents"> | null) => {
  const { user } = useUser();
  const [document, setDocument] = React.useState<Document | null>(null);
  
  React.useEffect(() => {
    if (user && id) {
      // Load documents from local storage
      const storedDocs = localStorage.getItem(`documents_${user.id}`);
      if (storedDocs) {
        const docs = JSON.parse(storedDocs) as Document[];
        const doc = docs.find(d => d._id.id === id.id);
        setDocument(doc || null);
      }
    }
  }, [user, id]);
  
  return document;
};

export const useCreateDocument = () => {
  const { user } = useUser();
  
  return async (title: string, content: string) => {
    if (!user) throw new Error("User not authenticated");
    
    const newId = { id: `doc_${Date.now()}`, tableName: "documents" } as Id<"documents">;
    const newDoc: Document = {
      _id: newId,
      title,
      content,
      userId: user.id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Load existing documents
    const storedDocs = localStorage.getItem(`documents_${user.id}`);
    const docs = storedDocs ? JSON.parse(storedDocs) as Document[] : [];
    
    // Add new document
    docs.push(newDoc);
    
    // Save back to local storage
    localStorage.setItem(`documents_${user.id}`, JSON.stringify(docs));
    
    return newId;
  };
};

export const useUpdateDocument = () => {
  const { user } = useUser();
  
  return async (id: Id<"documents">, updates: { title?: string; content?: string }) => {
    if (!user) throw new Error("User not authenticated");
    
    // Load existing documents
    const storedDocs = localStorage.getItem(`documents_${user.id}`);
    if (!storedDocs) return false;
    
    const docs = JSON.parse(storedDocs) as Document[];
    const docIndex = docs.findIndex(d => d._id.id === id.id);
    
    if (docIndex === -1) return false;
    
    // Update document
    docs[docIndex] = {
      ...docs[docIndex],
      ...updates,
      updatedAt: Date.now()
    };
    
    // Save back to local storage
    localStorage.setItem(`documents_${user.id}`, JSON.stringify(docs));
    
    return true;
  };
};

export const useDeleteDocument = () => {
  const { user } = useUser();
  
  return async (id: Id<"documents">) => {
    if (!user) throw new Error("User not authenticated");
    
    // Load existing documents
    const storedDocs = localStorage.getItem(`documents_${user.id}`);
    if (!storedDocs) return false;
    
    const docs = JSON.parse(storedDocs) as Document[];
    const filteredDocs = docs.filter(d => d._id.id !== id.id);
    
    // Save back to local storage
    localStorage.setItem(`documents_${user.id}`, JSON.stringify(filteredDocs));
    
    return true;
  };
};

// Similar implementations for book covers
export const useBookCovers = () => {
  const { user } = useUser();
  const [covers, setCovers] = React.useState<BookCover[]>([]);
  
  React.useEffect(() => {
    if (user) {
      // Load covers from local storage
      const storedCovers = localStorage.getItem(`bookCovers_${user.id}`);
      if (storedCovers) {
        setCovers(JSON.parse(storedCovers));
      }
    }
  }, [user]);
  
  return covers;
};

export const useCreateBookCover = () => {
  const { user } = useUser();
  
  return async (coverData: {
    title: string;
    author: string;
    genre: string;
    description?: string;
    style: string;
    imageUrl: string;
  }) => {
    if (!user) throw new Error("User not authenticated");
    
    const newId = { id: `cover_${Date.now()}`, tableName: "bookCovers" } as Id<"bookCovers">;
    const newCover: BookCover = {
      _id: newId,
      ...coverData,
      userId: user.id,
      createdAt: Date.now()
    };
    
    // Load existing covers
    const storedCovers = localStorage.getItem(`bookCovers_${user.id}`);
    const covers = storedCovers ? JSON.parse(storedCovers) as BookCover[] : [];
    
    // Add new cover
    covers.push(newCover);
    
    // Save back to local storage
    localStorage.setItem(`bookCovers_${user.id}`, JSON.stringify(covers));
    
    return newId;
  };
};

export const useDeleteBookCover = () => {
  const { user } = useUser();
  
  return async (id: Id<"bookCovers">) => {
    if (!user) throw new Error("User not authenticated");
    
    // Load existing covers
    const storedCovers = localStorage.getItem(`bookCovers_${user.id}`);
    if (!storedCovers) return false;
    
    const covers = JSON.parse(storedCovers) as BookCover[];
    const filteredCovers = covers.filter(c => c._id.id !== id.id);
    
    // Save back to local storage
    localStorage.setItem(`bookCovers_${user.id}`, JSON.stringify(filteredCovers));
    
    return true;
  };
}; 