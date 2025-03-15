import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditorComponent from '../components/editor/EditorComponent';
import { EditorProvider } from '../context/EditorContext';

// Mock the EditorContext
jest.mock('../context/EditorContext', () => ({
  useEditor: () => ({
    getDocument: jest.fn(() => null),
    createDocument: jest.fn(() => ({
      id: 'test-doc-1',
      title: 'Test Document',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    })),
    saveDocument: jest.fn(),
    currentDocument: {
      id: 'test-doc-1',
      title: 'Test Document',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    setCurrentDocument: jest.fn()
  }),
  EditorProvider: ({ children }) => <div>{children}</div>
}));

describe('EditorComponent', () => {
  test('renders editor component', () => {
    render(<EditorComponent />);
    
    // Check if title input is rendered
    const titleInput = screen.getByPlaceholderText('Untitled Document');
    expect(titleInput).toBeInTheDocument();
    
    // Check if editor textarea is rendered
    const editorTextarea = screen.getByPlaceholderText("Start writing your masterpiece...");
    expect(editorTextarea).toBeInTheDocument();
    
    // Check if save button is rendered
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();
  });
  
  test('updates content when typing', () => {
    render(<EditorComponent />);
    
    const editorTextarea = screen.getByPlaceholderText("Start writing your masterpiece...");
    
    // Simulate typing in the editor
    fireEvent.change(editorTextarea, { target: { value: 'Hello, world!' } });
    
    // Check if the content was updated
    expect(editorTextarea.value).toBe('Hello, world!');
  });
  
  test('updates title when typing', () => {
    render(<EditorComponent />);
    
    const titleInput = screen.getByPlaceholderText('Untitled Document');
    
    // Simulate typing in the title input
    fireEvent.change(titleInput, { target: { value: 'My Great Novel' } });
    
    // Check if the title was updated
    expect(titleInput.value).toBe('My Great Novel');
  });
  
  test('shows word and character count', () => {
    render(<EditorComponent />);
    
    const editorTextarea = screen.getByPlaceholderText("Start writing your masterpiece...");
    
    // Simulate typing in the editor
    fireEvent.change(editorTextarea, { target: { value: 'Hello, world!' } });
    
    // Check if word and character count is displayed
    const statsText = screen.getByText('2 words | 13 characters');
    expect(statsText).toBeInTheDocument();
  });
});
