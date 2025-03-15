import React, { useState, useEffect } from 'react';
import { useAIAssistant } from '../../context/AIAssistantContext';

interface AITextCompletionProps {
  currentText: string;
  onApplyCompletion: (completion: string) => void;
}

const AITextCompletion: React.FC<AITextCompletionProps> = ({ 
  currentText, 
  onApplyCompletion 
}) => {
  const { isGenerating, generateTextCompletion } = useAIAssistant();
  const [completion, setCompletion] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerateCompletion = async () => {
    if (!currentText.trim()) {
      setError('Please write some text before generating a completion.');
      return;
    }
    
    setError(null);
    
    try {
      const generatedText = await generateTextCompletion(currentText);
      setCompletion(generatedText);
    } catch (err) {
      setError('Failed to generate text completion. Please try again.');
      console.error('Error generating text completion:', err);
    }
  };
  
  const handleApplyCompletion = () => {
    if (completion) {
      onApplyCompletion(completion);
      setCompletion('');
    }
  };
  
  const handleRegenerate = () => {
    handleGenerateCompletion();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">AI Text Completion</h3>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md mb-3">
          {error}
        </div>
      )}
      
      <button
        onClick={handleGenerateCompletion}
        disabled={isGenerating}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed mb-4"
      >
        {isGenerating ? 'Generating...' : 'Generate Completion'}
      </button>
      
      {completion && (
        <div className="mt-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-3">
            <p className="text-gray-800 dark:text-gray-200">{completion}</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleApplyCompletion}
              className="flex-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Apply
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITextCompletion;
