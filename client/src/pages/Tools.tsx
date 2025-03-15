import React from 'react';
import { Link } from 'react-router-dom';

const Tools: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AI Writing Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Text Completion */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">AI Text Completion</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Generate contextually relevant continuations of your writing to overcome writer's block.
          </p>
          <Link 
            to="/editor/new?tool=ai-completion" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try It Now
          </Link>
        </div>
        
        {/* Rewriting Suggestions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Rewriting Suggestions</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Highlight text to receive alternative phrasings and improve your writing style.
          </p>
          <Link 
            to="/editor/new?tool=rewriting" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try It Now
          </Link>
        </div>
        
        {/* Grammar & Style Checking */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Grammar & Style Checking</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Real-time identification of grammar, style, and clarity issues in your writing.
          </p>
          <Link 
            to="/editor/new?tool=grammar" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try It Now
          </Link>
        </div>
        
        {/* Book Outline Generation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Book Outline Generator</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            AI-assisted creation of chapter structures based on genre and theme.
          </p>
          <Link 
            to="/editor/new?tool=outline" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Generate Outline
          </Link>
        </div>
        
        {/* Speech-to-Text Dictation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Speech-to-Text Dictation</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Convert your spoken words to text with multi-language support.
          </p>
          <Link 
            to="/editor/new?tool=dictation" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Start Dictation
          </Link>
        </div>
        
        {/* Book Cover Generation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Book Cover Generator</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create AI-generated cover designs based on your book details.
          </p>
          <Link 
            to="/tools/cover-generator" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Design Cover
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tools;
