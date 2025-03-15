import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AIService from '../services/AIService';
import DictationService from '../services/DictationService';
import StorageService from '../services/StorageService';

const Editor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('Untitled Document');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAIProcessing, setIsAIProcessing] = useState<boolean>(false);
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [dictationError, setDictationError] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tool = params.get('tool');
    
    if (tool) {
      // Handle different tools
      switch (tool) {
        case 'ai-completion':
          // Will be handled when user clicks AI Assist
          break;
        case 'rewriting':
          // Will be handled when user selects text and clicks AI Assist
          break;
        case 'grammar':
          // Will be handled when user clicks AI Assist
          break;
        case 'outline':
          // Show outline generator UI
          break;
        case 'dictation':
          // Start dictation automatically
          handleDictation();
          break;
        default:
          break;
      }
    }
  }, [location]);
  
  // Auto-save functionality
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (content && !isSaving) {
        saveContent();
      }
    }, 5000); // Save every 5 seconds
    
    return () => clearInterval(saveInterval);
  }, [content, isSaving]);
  
  // Load content on initial render
  useEffect(() => {
    if (id && id !== 'new') {
      const document = StorageService.getDocument(id);
      if (document) {
        setContent(document.content);
        setTitle(document.title);
        setLastSaved(document.updatedAt);
      }
    }
  }, [id]);
  
  const saveContent = () => {
    setIsSaving(true);
    
    try {
      const documentId = id || `doc_${Date.now()}`;
      const document = {
        id: documentId,
        title: title,
        content: content,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      StorageService.saveDocument(document);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAIAssist = async () => {
    // Get selected text or use the last paragraph
    const textarea = textareaRef.current;
    let selectedText = '';
    let cursorPosition = 0;
    
    if (textarea) {
      selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
      cursorPosition = textarea.selectionEnd;
    }
    
    // If no text is selected, use the last paragraph
    if (!selectedText) {
      const paragraphs = content.split('\n\n');
      selectedText = paragraphs[paragraphs.length - 1];
    }
    
    if (!selectedText) {
      setAIError('Please write something or select text to use AI assistance');
      return;
    }
    
    setIsAIProcessing(true);
    setAIError(null);
    
    try {
      // Complete the text
      const completedText = await AIService.completeText(selectedText);
      
      // Insert the completed text at the cursor position
      if (textarea) {
        const newContent = content.substring(0, cursorPosition) + completedText + content.substring(cursorPosition);
        setContent(newContent);
        
        // Set cursor position after the inserted text
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(cursorPosition + completedText.length, cursorPosition + completedText.length);
        }, 0);
      }
    } catch (error) {
      setAIError(`AI assistance failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsAIProcessing(false);
    }
  };
  
  const handleDictation = () => {
    if (isDictating) {
      // Stop dictation
      DictationService.stop();
      setIsDictating(false);
    } else {
      // Start dictation
      const success = DictationService.start(
        (text) => {
          // Update content with dictated text
          setContent((prevContent) => {
            const textarea = textareaRef.current;
            if (textarea) {
              const cursorPosition = textarea.selectionEnd;
              return prevContent.substring(0, cursorPosition) + text + prevContent.substring(cursorPosition);
            }
            return prevContent + text;
          });
        },
        (error) => {
          setDictationError(error);
          setIsDictating(false);
        }
      );
      
      if (success) {
        setIsDictating(true);
        setDictationError(null);
      }
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Editor Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Document" 
              className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
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
              onClick={saveContent}
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
          {aiError && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
              {aiError}
            </div>
          )}
          
          {dictationError && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
              {dictationError}
            </div>
          )}
          
          {isDictating && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Dictation active - speak clearly...
            </div>
          )}
          
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your masterpiece..."
            className="w-full h-full min-h-[500px] bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
          />
        </div>
      </main>
      
      {/* Editor Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {content ? `${content.split(/\s+/).filter(Boolean).length} words | ${content.length} characters` : '0 words | 0 characters'}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleAIAssist}
              disabled={isAIProcessing}
              className={`px-3 py-1 rounded-md ${
                isAIProcessing 
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {isAIProcessing ? 'Processing...' : 'AI Assist'}
            </button>
            <button 
              onClick={handleDictation}
              className={`px-3 py-1 rounded-md ${
                isDictating
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {isDictating ? 'Stop Dictation' : 'Dictate'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Editor;
