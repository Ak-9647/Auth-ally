import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIAssistantContextType {
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  generateTextCompletion: (prompt: string) => Promise<string>;
  generateRewriteSuggestions: (text: string) => Promise<string[]>;
  checkGrammarAndStyle: (text: string) => Promise<any[]>;
  generateBookOutline: (title: string, genre: string, description: string) => Promise<any>;
}

// This is a mock implementation that would be replaced with actual API calls
const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Mock implementation of text completion
  const generateTextCompletion = async (prompt: string): Promise<string> => {
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response based on prompt
      let completion = '';
      
      if (prompt.toLowerCase().includes('once upon a time')) {
        completion = 'in a land far away, there lived a brave knight who was known throughout the kingdom for his courage and wisdom.';
      } else if (prompt.toLowerCase().includes('the future of')) {
        completion = 'technology looks promising, with advancements in artificial intelligence and renewable energy paving the way for a more sustainable and efficient world.';
      } else {
        completion = 'continues with more relevant content based on the context. The AI assistant helps writers overcome creative blocks by suggesting natural continuations of their text.';
      }
      
      return completion;
    } catch (error) {
      console.error('Error generating text completion:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Mock implementation of rewrite suggestions
  const generateRewriteSuggestions = async (text: string): Promise<string[]> => {
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response with alternative phrasings
      return [
        text.replace(/very/g, 'extremely').replace(/good/g, 'excellent'),
        text.replace(/very/g, 'remarkably').replace(/good/g, 'outstanding'),
        text.replace(/very/g, 'incredibly').replace(/good/g, 'exceptional')
      ];
    } catch (error) {
      console.error('Error generating rewrite suggestions:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Mock implementation of grammar and style checking
  const checkGrammarAndStyle = async (text: string): Promise<any[]> => {
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response with grammar and style issues
      const issues = [];
      
      if (text.includes('their is')) {
        issues.push({
          type: 'grammar',
          position: { start: text.indexOf('their is'), end: text.indexOf('their is') + 8 },
          issue: 'Incorrect use of "their"',
          suggestion: 'there is'
        });
      }
      
      if (text.includes('very ')) {
        issues.push({
          type: 'style',
          position: { start: text.indexOf('very '), end: text.indexOf('very ') + 5 },
          issue: 'Weak modifier',
          suggestion: 'Consider a stronger adjective'
        });
      }
      
      return issues;
    } catch (error) {
      console.error('Error checking grammar and style:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Mock implementation of book outline generation
  const generateBookOutline = async (title: string, genre: string, description: string): Promise<any> => {
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response with book outline
      return {
        title,
        genre,
        structure: genre.toLowerCase().includes('fantasy') ? 'Hero\'s Journey' : 'Three-Act Structure',
        chapters: [
          {
            number: 1,
            title: 'The Beginning',
            summary: 'Introduction to the main character and their ordinary world.'
          },
          {
            number: 2,
            title: 'The Inciting Incident',
            summary: 'An event that disrupts the main character\'s ordinary world.'
          },
          {
            number: 3,
            title: 'Rising Action',
            summary: 'The main character faces initial challenges and begins their journey.'
          },
          // More chapters would be generated based on genre and description
        ]
      };
    } catch (error) {
      console.error('Error generating book outline:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <AIAssistantContext.Provider
      value={{
        isGenerating,
        setIsGenerating,
        generateTextCompletion,
        generateRewriteSuggestions,
        checkGrammarAndStyle,
        generateBookOutline
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = (): AIAssistantContextType => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
