import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import AIService from '../services/AIService';
import DictationService from '../services/DictationService';
import StorageService from '../services/StorageService';

const Editor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const [content, setContent] = useState<string>('Start writing your thoughts here. When you need inspiration, click the AI Complete button to generate contextually relevant text based on what you\'ve written. You can also highlight text and use the AI rewrite feature to get alternative phrasings. Try the grammar checker to identify issues with your text - grammar issues are highlighted in red, style issues in blue, and clarity issues in green. Use the Book Outline Generator to structure your book, the Speech-to-Text feature to dictate your writing, or the Cover Generator to create a professional book cover.');
  const [title, setTitle] = useState<string>('My Document');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());
  const [isAIProcessing, setIsAIProcessing] = useState<boolean>(false);
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [dictationError, setDictationError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [readabilityScore, setReadabilityScore] = useState<string>('Difficult');
  const [showGrammarCheck, setShowGrammarCheck] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<number>(2);
  
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
  
  // Update word and character count
  useEffect(() => {
    if (content) {
      const words = content.split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      setCharCount(content.length);
      
      // Simple readability scoring
      const avgWordsPerSentence = words / (content.split(/[.!?]+/).length || 1);
      const avgCharsPerWord = content.length / (words || 1);
      
      if (avgWordsPerSentence > 20 || avgCharsPerWord > 6) {
        setReadabilityScore('Difficult');
      } else if (avgWordsPerSentence > 14 || avgCharsPerWord > 5) {
        setReadabilityScore('Moderate');
      } else {
        setReadabilityScore('Easy');
      }
    } else {
      setWordCount(0);
      setCharCount(0);
    }
  }, [content]);
  
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
  
  const toggleGrammarCheck = () => {
    setShowGrammarCheck(!showGrammarCheck);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Author-Ally</h1>
                <span className="text-gray-500 dark:text-gray-400">|</span>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-300"
                />
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Toggle light/dark mode"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                </button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : lastSaved ? (
                    <span>{lastSaved.toLocaleTimeString()}</span>
                  ) : (
                    <span>Not saved yet</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {!isSaving && <span>Not saved yet</span>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Toolbar */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button 
                onClick={toggleGrammarCheck}
                className={`px-3 py-1 rounded-md text-sm ${
                  showGrammarCheck 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Show Grammar Check
              </button>
              <div className="flex items-center space-x-1 text-yellow-500">
                <span>🚀</span>
                <span>🔍</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{onlineUsers} online</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Collaborate
              </button>
              <button className="px-3 py-1 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export
              </button>
            </div>
          </div>
          
          {/* Formatting Toolbar */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-1">
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold">B</button>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 italic">I</button>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <div className="flex-1"></div>
            <button 
              onClick={handleDictation}
              className={`px-3 py-1 rounded-md text-sm flex items-center ${
                isDictating
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              {isDictating ? 'Stop Dictation' : 'Dictate'}
            </button>
            <button className="px-3 py-1 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Book Outline Generator
            </button>
            <Link to="/tools/cover-generator" className="px-3 py-1 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Cover Generator
            </Link>
          </div>
          
          {/* Editor Area */}
          <div className="p-6">
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
              className="w-full min-h-[400px] bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-gray-800 dark:text-gray-200"
            />
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {wordCount} words | {charCount} characters
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm">
                Readability: 
                <span className={`ml-1 ${
                  readabilityScore === 'Difficult' 
                    ? 'text-red-500' 
                    : readabilityScore === 'Moderate' 
                      ? 'text-yellow-500' 
                      : 'text-green-500'
                }`}>
                  {readabilityScore}
                </span>
              </div>
              <button 
                onClick={handleAIAssist}
                disabled={isAIProcessing}
                className={`px-3 py-1 rounded-md text-sm ${
                  isAIProcessing 
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isAIProcessing ? 'Processing...' : 'AI Complete'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          <p>Your work is automatically saved every 5 seconds. Track your word count and readability score at the bottom of the editor. Try highlighting text to access AI rewriting suggestions or use the grammar checker to identify issues with your writing. You can also export your document as PDF or ePub, collaborate with others in real-time, generate book outlines, dictate your writing, and create AI-powered book covers.</p>
        </div>
        
        <div className="mt-4 flex justify-center">
          <Link 
            to="/dashboard" 
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Editor;
