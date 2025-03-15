import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import AIService from '../services/AIService';
import DictationService from '../services/DictationService';
import { 
  useDocument, 
  useCreateDocument, 
  useUpdateDocument,
  Document
} from '../services/ConvexStorageService';

// Import Id type from ConvexStorageService instead of directly from Convex
import type { Id } from '../services/ConvexStorageService';
import { calculateReadability } from '../utils/textUtils';

const Editor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  
  // Convert string ID to Convex ID if it exists
  // This will be handled properly once Convex is fully set up
  const documentId = id && id !== 'new' ? { id, tableName: "documents" } : null;
  
  // Fetch document from Convex if ID exists
  const document = useDocument(documentId);
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  
  const [content, setContent] = useState<string>('Start writing your thoughts here. When you need inspiration, click the AI Complete button to generate contextually relevant text based on what you\'ve written.');
  const [title, setTitle] = useState<string>('My Document');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());
  const [isAIProcessing, setIsAIProcessing] = useState<boolean>(false);
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [dictationError, setDictationError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [readabilityScore, setReadabilityScore] = useState<{ score: number; level: string }>({ score: 0, level: 'N/A' });
  const [showGrammarCheck, setShowGrammarCheck] = useState<boolean>(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Load document data when it's fetched from Convex
  useEffect(() => {
    if (document) {
      setContent(document.content);
      setTitle(document.title);
      setLastSaved(new Date(document.updatedAt));
    }
  }, [document]);
  
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
      if (content && !isSaving && isSignedIn) {
        saveContent();
      }
    }, 5000); // Save every 5 seconds
    
    return () => clearInterval(saveInterval);
  }, [content, isSaving, isSignedIn]);
  
  // Update word and character count
  useEffect(() => {
    if (content) {
      const words = content.split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      setCharCount(content.length);
      
      // Calculate readability score
      const readability = calculateReadability(content);
      setReadabilityScore(readability);
    } else {
      setWordCount(0);
      setCharCount(0);
      setReadabilityScore({ score: 0, level: 'N/A' });
    }
  }, [content]);
  
  const saveContent = async () => {
    if (!isSignedIn || !user) {
      // Redirect to login if not signed in
      navigate('/');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (documentId) {
        // Update existing document
        await updateDocument(documentId, {
          title,
          content
        });
      } else {
        // Create new document
        const newDocId = await createDocument(title, content);
        // Redirect to the new document URL
        navigate(`/editor/${newDocId}`, { replace: true });
      }
      
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
  
  const toggleGrammarCheck = () => {
    setShowGrammarCheck(!showGrammarCheck);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-blue-600 hover:text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <h1 className="text-xl font-bold text-gray-900">Author Ally</h1>
                <span className="text-gray-500">|</span>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700"
                  placeholder="Document Title"
                />
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={saveContent}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <div className="text-sm text-gray-500">
                  {lastSaved && (
                    <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-2 flex flex-wrap items-center gap-2">
            <button 
              onClick={handleAIAssist}
              disabled={isAIProcessing}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                isAIProcessing 
                  ? 'bg-gray-200 text-gray-500' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              {isAIProcessing ? 'Processing...' : 'AI Complete'}
            </button>
            <button 
              onClick={handleDictation}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                isDictating 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isDictating ? 'Stop Dictation' : 'Dictate'}
            </button>
            <button 
              onClick={toggleGrammarCheck}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                showGrammarCheck 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grammar Check
            </button>
            <div className="ml-auto flex items-center space-x-4 text-sm text-gray-500">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
              <span>Readability: {readabilityScore.level} ({readabilityScore.score})</span>
            </div>
          </div>
          
          {/* Editor */}
          <div className="p-4">
            {aiError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {aiError}
              </div>
            )}
            {dictationError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {dictationError}
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[calc(100vh-300px)] p-4 border-0 focus:ring-0 focus:outline-none resize-none text-gray-800 leading-relaxed"
              placeholder="Start writing..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
