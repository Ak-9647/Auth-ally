import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { debounce } from '../../utils/textUtils';

interface EditorComponentProps {
  documentId?: string;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ documentId }) => {
  const { 
    getDocument, 
    createDocument, 
    saveDocument, 
    currentDocument, 
    setCurrentDocument 
  } = useEditor();
  
  const [title, setTitle] = useState<string>('Untitled Document');
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // Initialize document
  useEffect(() => {
    if (documentId && documentId !== 'new') {
      const doc = getDocument(documentId);
      if (doc) {
        setCurrentDocument(doc);
        setTitle(doc.title);
        setContent(doc.content);
        setLastSaved(doc.updatedAt);
      } else {
        // Document not found, create a new one
        const newDoc = createDocument();
        setTitle(newDoc.title);
      }
    } else {
      // Create a new document
      const newDoc = createDocument();
      setTitle(newDoc.title);
    }
  }, [documentId, getDocument, createDocument, setCurrentDocument]);
  
  // Update word and character count
  useEffect(() => {
    if (content) {
      setWordCount(content.split(/\s+/).filter(Boolean).length);
      setCharCount(content.length);
    } else {
      setWordCount(0);
      setCharCount(0);
    }
  }, [content]);
  
  // Auto-save functionality
  const saveContentDebounced = useRef(
    debounce(() => {
      if (currentDocument) {
        saveContent();
      }
    }, 5000)
  ).current;
  
  useEffect(() => {
    if (content && currentDocument) {
      saveContentDebounced();
    }
    
    return () => {
      // Save on unmount
      if (content && currentDocument) {
        saveContent();
      }
    };
  }, [content, currentDocument]);
  
  const saveContent = () => {
    if (!currentDocument) return;
    
    setIsSaving(true);
    
    const updatedDocument = {
      ...currentDocument,
      title,
      content,
      updatedAt: new Date()
    };
    
    saveDocument(updatedDocument);
    setLastSaved(new Date());
    setIsSaving(false);
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleManualSave = () => {
    saveContent();
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div>
            <input 
              type="text" 
              value={title}
              onChange={handleTitleChange}
              onBlur={saveContent}
              placeholder="Untitled Document" 
              className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 w-full"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isSaving ? (
                <span>Saving...</span>
              ) : lastSaved ? (
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              ) : (
                <span>Not saved yet</span>
              )}
            </div>
            <button 
              onClick={handleManualSave}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Editor Area */}
      <main className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl bg-white dark:bg-gray-800 min-h-full p-8 rounded-lg shadow">
          <textarea
            ref={editorRef}
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your masterpiece..."
            className="w-full h-full min-h-[500px] bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
          />
        </div>
      </main>
      
      {/* Editor Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {wordCount} words | {charCount} characters
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
              AI Assist
            </button>
            <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
              Dictate
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EditorComponent;
