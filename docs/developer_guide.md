# Author-Ally Developer Documentation

## Project Overview

Author-Ally is an AI-enhanced writing editor designed to provide writers with a distraction-free environment, automatic saving, and AI-powered writing assistance. This document provides technical information for developers who want to understand, maintain, or extend the application.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI with Radix UI primitives
- **State Management**: React Context API
- **Routing**: React Router v6
- **PDF Export**: jsPDF
- **Icons**: Lucide React

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest and React Testing Library
- **Version Control**: Git

## Project Structure

```
author-ally/
├── client/                  # Frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   │   ├── analytics/   # Writing analytics components
│   │   │   ├── ai-assistant/# AI text completion components
│   │   │   ├── book-cover/  # Book cover generation components
│   │   │   ├── collaboration/# Collaboration tools components
│   │   │   ├── editor/      # Editor components
│   │   │   ├── export/      # Export functionality components
│   │   │   ├── speech-to-text/# Speech-to-text components
│   │   │   └── ui/          # Shared UI components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # Service modules
│   │   ├── tests/           # Test files
│   │   ├── utils/           # Utility functions
│   │   ├── App.routes.tsx   # Application routes
│   │   ├── App.tsx          # Main application component
│   │   └── index.tsx        # Application entry point
│   ├── package.json         # Dependencies and scripts
│   └── tailwind.config.js   # Tailwind CSS configuration
├── docs/                    # Documentation
│   ├── api_requirements.md  # API requirements
│   ├── requirements.md      # Project requirements
│   ├── technical_architecture.md # Technical architecture
│   ├── technical_challenges.md # Technical challenges
│   ├── ui_flow.md           # UI flow documentation
│   ├── user_guide.md        # User documentation
│   └── developer_guide.md   # This file
└── README.md                # Project overview
```

## Core Components

### Context Providers

#### ThemeContext

Manages the application theme (light/dark mode):

```typescript
// src/context/ThemeContext.tsx
export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementation details...
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

#### EditorContext

Manages document state and operations:

```typescript
// src/context/EditorContext.tsx
export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditorContextType {
  documents: Document[];
  currentDocument: Document | null;
  setCurrentDocument: (document: Document) => void;
  createDocument: (title?: string) => Document;
  saveDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  getDocument: (id: string) => Document | null;
}

export const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementation details...
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
```

#### AIAssistantContext

Manages AI-powered writing assistance features:

```typescript
// src/context/AIAssistantContext.tsx
export interface AIAssistantContextType {
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  generateTextCompletion: (text: string) => Promise<string>;
  generateRewriteSuggestions: (text: string) => Promise<string[]>;
  checkGrammarAndStyle: (text: string) => Promise<any[]>;
  generateBookOutline: (title: string, genre: string, description: string) => Promise<any>;
}

export const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementation details...
};

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
```

### Services

#### StorageService

Handles document persistence using localStorage:

```typescript
// src/services/StorageService.ts
class StorageService {
  private readonly DOCUMENTS_KEY = 'author-ally-documents';
  
  public saveDocuments(documents: Document[]): void {
    // Implementation details...
  }
  
  public loadDocuments(): Document[] {
    // Implementation details...
  }
  
  public saveDocument(document: Document): void {
    // Implementation details...
  }
  
  public getDocument(id: string): Document | null {
    // Implementation details...
  }
  
  public deleteDocument(id: string): void {
    // Implementation details...
  }
  
  public checkStorageAvailability(): { available: boolean; remainingSpace?: number } {
    // Implementation details...
  }
  
  public clearAllData(): void {
    // Implementation details...
  }
}

export default new StorageService();
```

### Utility Functions

#### textUtils

Provides text analysis and manipulation functions:

```typescript
// src/utils/textUtils.ts
export const countWords = (text: string): number => {
  // Implementation details...
};

export const countCharacters = (text: string, countSpaces: boolean = true): number => {
  // Implementation details...
};

export const calculateReadingTime = (text: string, wordsPerMinute: number = 200): number => {
  // Implementation details...
};

export const truncateText = (text: string, maxLength: number): string => {
  // Implementation details...
};

export const formatDate = (date: Date, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  // Implementation details...
};

export const generateId = (): string => {
  // Implementation details...
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  // Implementation details...
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  // Implementation details...
}

export const calculateReadabilityScore = (text: string): number => {
  // Implementation details...
};
```

## Feature Implementation Details

### Auto-Save Functionality

The auto-save feature uses a debounced function to save content every 5 seconds:

```typescript
// Inside EditorComponent.tsx
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
```

### AI Text Completion

The AI text completion feature uses the AIAssistantContext to generate text:

```typescript
// Inside AITextCompletion.tsx
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
```

### Speech-to-Text Dictation

The speech-to-text feature uses the Web Speech API:

```typescript
// Inside SpeechToText.tsx
useEffect(() => {
  if (!browserSupportsSpeechRecognition) {
    setError('Your browser does not support speech recognition. Try using Chrome or Edge.');
    return;
  }
  
  // Create speech recognition instance
  const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  recognitionRef.current = new SpeechRecognition();
  
  // Configure recognition
  recognitionRef.current.continuous = true;
  recognitionRef.current.interimResults = true;
  recognitionRef.current.lang = selectedLanguage;
  
  // Set up event handlers
  recognitionRef.current.onstart = () => {
    setIsListening(true);
    setError(null);
  };
  
  // More event handlers...
}, [browserSupportsSpeechRecognition, selectedLanguage]);
```

## Testing

The application uses Jest and React Testing Library for testing:

### Unit Tests

Each component has unit tests to verify its functionality:

```typescript
// src/tests/EditorComponent.test.tsx
describe('EditorComponent', () => {
  test('renders editor component', () => {
    render(<EditorComponent />);
    
    // Check if title input is rendered
    const titleInput = screen.getByPlaceholderText('Untitled Document');
    expect(titleInput).toBeInTheDocument();
    
    // More assertions...
  });
  
  // More tests...
});
```

### Integration Tests

Integration tests verify that components work together correctly:

```typescript
// src/tests/integration.test.tsx
describe('App Integration Tests', () => {
  test('renders with all providers', () => {
    render(<App />);
    
    // Check if all providers are rendered
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('editor-provider')).toBeInTheDocument();
    expect(screen.getByTestId('ai-provider')).toBeInTheDocument();
    
    // More assertions...
  });
  
  // More tests...
});
```

### Accessibility Tests

Accessibility tests ensure the application is usable by everyone:

```typescript
// src/tests/accessibility-and-compatibility.test.tsx
describe('Accessibility Tests', () => {
  test('App should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  // More tests...
});
```

## Extending the Application

### Adding a New Feature

To add a new feature to Author-Ally:

1. **Create Component(s)**: Add new component(s) in the appropriate directory under `src/components/`
2. **Update Context**: If needed, extend or create a new context provider
3. **Add Routes**: If the feature needs its own page, add routes in `App.routes.tsx`
4. **Write Tests**: Create unit and integration tests for the new feature
5. **Update Documentation**: Update this developer guide and the user guide

### Example: Adding a New AI Feature

```typescript
// 1. Create a new component
// src/components/ai-assistant/AIStyleSuggestions.tsx
import React, { useState } from 'react';
import { useAIAssistant } from '../../context/AIAssistantContext';

interface AIStyleSuggestionsProps {
  currentText: string;
  onApplySuggestion: (suggestion: string) => void;
}

const AIStyleSuggestions: React.FC<AIStyleSuggestionsProps> = ({ 
  currentText, 
  onApplySuggestion 
}) => {
  // Implementation details...
};

export default AIStyleSuggestions;

// 2. Update AIAssistantContext
// src/context/AIAssistantContext.tsx
export interface AIAssistantContextType {
  // Existing methods...
  generateStyleSuggestions: (text: string) => Promise<string[]>; // New method
}

// 3. Add to the UI
// src/components/editor/EditorComponent.tsx
import AIStyleSuggestions from '../ai-assistant/AIStyleSuggestions';

// Add to the render method where appropriate
```

## Deployment

### Building for Production

To build the application for production:

```bash
cd client
npm run build
```

This creates a production-ready build in the `build` directory.

### Deployment Options

The application can be deployed to various platforms:

- **Static Hosting**: Deploy the build directory to services like Netlify, Vercel, or GitHub Pages
- **Server Deployment**: Serve the static files from a Node.js server
- **Container Deployment**: Package the application in a Docker container

## Performance Considerations

### Large Documents

For large documents, consider:

- Using virtualization for rendering only visible content
- Implementing pagination or chunking for document storage
- Optimizing state updates to minimize re-renders

### AI Feature Optimization

For AI features:

- Implement request throttling to prevent excessive API calls
- Add caching for common AI responses
- Show clear loading states during API calls

## Security Considerations

### Data Storage

- All document data is stored in localStorage by default
- Consider encryption for sensitive content
- Implement proper data validation before storage

### API Calls

- Implement rate limiting for AI API calls
- Validate all user input before sending to APIs
- Handle API errors gracefully

## Future Development Roadmap

### Planned Features

- **Cloud Synchronization**: Implement Supabase integration for cross-device sync
- **Collaborative Editing**: Add real-time collaboration with operational transforms
- **Mobile Application**: Develop a React Native version for mobile devices
- **Advanced AI Features**: Integrate more sophisticated AI models for specialized writing assistance

### Technical Improvements

- **State Management**: Consider migrating to Redux or Zustand for more complex state
- **Performance Optimization**: Implement code splitting and lazy loading
- **Offline Support**: Add service workers for full offline functionality
- **Accessibility Enhancements**: Improve screen reader support and keyboard navigation

## Contributing

To contribute to Author-Ally:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Submit a pull request

Please follow the existing code style and commit message conventions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
