import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AITextCompletion from '../components/ai-assistant/AITextCompletion';
import { AIAssistantProvider } from '../context/AIAssistantContext';

// Mock the AIAssistantContext
jest.mock('../context/AIAssistantContext', () => ({
  useAIAssistant: () => ({
    isGenerating: false,
    generateTextCompletion: jest.fn().mockResolvedValue('This is a generated text completion.'),
  }),
  AIAssistantProvider: ({ children }) => <div>{children}</div>
}));

describe('AITextCompletion', () => {
  const mockOnApplyCompletion = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders AI text completion component', () => {
    render(
      <AITextCompletion 
        currentText="This is some text." 
        onApplyCompletion={mockOnApplyCompletion} 
      />
    );
    
    // Check if generate button is rendered
    const generateButton = screen.getByText('Generate Completion');
    expect(generateButton).toBeInTheDocument();
  });
  
  test('shows error when generating with empty text', () => {
    render(
      <AITextCompletion 
        currentText="" 
        onApplyCompletion={mockOnApplyCompletion} 
      />
    );
    
    // Click generate button
    const generateButton = screen.getByText('Generate Completion');
    fireEvent.click(generateButton);
    
    // Check if error message is displayed
    const errorMessage = screen.getByText('Please write some text before generating a completion.');
    expect(errorMessage).toBeInTheDocument();
  });
  
  test('generates text completion when button is clicked', async () => {
    render(
      <AITextCompletion 
        currentText="This is some text." 
        onApplyCompletion={mockOnApplyCompletion} 
      />
    );
    
    // Click generate button
    const generateButton = screen.getByText('Generate Completion');
    fireEvent.click(generateButton);
    
    // Wait for completion to be generated
    await waitFor(() => {
      const completionText = screen.getByText('This is a generated text completion.');
      expect(completionText).toBeInTheDocument();
    });
    
    // Check if apply button is rendered
    const applyButton = screen.getByText('Apply');
    expect(applyButton).toBeInTheDocument();
    
    // Check if regenerate button is rendered
    const regenerateButton = screen.getByText('Regenerate');
    expect(regenerateButton).toBeInTheDocument();
  });
  
  test('calls onApplyCompletion when apply button is clicked', async () => {
    render(
      <AITextCompletion 
        currentText="This is some text." 
        onApplyCompletion={mockOnApplyCompletion} 
      />
    );
    
    // Click generate button
    const generateButton = screen.getByText('Generate Completion');
    fireEvent.click(generateButton);
    
    // Wait for completion to be generated
    await waitFor(() => {
      const completionText = screen.getByText('This is a generated text completion.');
      expect(completionText).toBeInTheDocument();
    });
    
    // Click apply button
    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);
    
    // Check if onApplyCompletion was called with the generated text
    expect(mockOnApplyCompletion).toHaveBeenCalledWith('This is a generated text completion.');
  });
});
