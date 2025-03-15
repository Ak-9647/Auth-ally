import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WritingAnalytics from '../components/analytics/WritingAnalytics';

describe('WritingAnalytics', () => {
  // Mock document object
  const mockDocument = {
    id: 'test-doc-1',
    title: 'Test Document',
    content: 'This is test content for the document. It contains multiple sentences with various words to analyze. The readability should be calculated based on this text.',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Date
    const mockDate = new Date('2025-03-14T12:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('renders writing analytics component', () => {
    render(<WritingAnalytics document={mockDocument} />);
    
    // Check if title is rendered
    const title = screen.getByText('Writing Analytics');
    expect(title).toBeInTheDocument();
    
    // Check if word count is rendered
    expect(screen.getByText('Word Count')).toBeInTheDocument();
    
    // Check if character count is rendered
    expect(screen.getByText('Character Count')).toBeInTheDocument();
    
    // Check if readability is rendered
    expect(screen.getByText('Readability')).toBeInTheDocument();
    
    // Check if reading time is rendered
    expect(screen.getByText('Reading Time')).toBeInTheDocument();
    
    // Check if reset session button is rendered
    const resetButton = screen.getByText('Reset Session');
    expect(resetButton).toBeInTheDocument();
  });
  
  test('displays correct word and character counts', () => {
    render(<WritingAnalytics document={mockDocument} />);
    
    // The mock document has 21 words and 142 characters
    expect(screen.getByText('21')).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();
  });
  
  test('displays reading time based on word count', () => {
    render(<WritingAnalytics document={mockDocument} />);
    
    // Reading time should be 1 min for 21 words (at 200 wpm)
    expect(screen.getByText('1 min')).toBeInTheDocument();
  });
  
  test('resets session when reset button is clicked', () => {
    render(<WritingAnalytics document={mockDocument} />);
    
    // Get initial session duration
    const initialDuration = screen.getByText('0 min');
    expect(initialDuration).toBeInTheDocument();
    
    // Click reset session button
    const resetButton = screen.getByText('Reset Session');
    fireEvent.click(resetButton);
    
    // Session duration should still be 0 after reset
    const newDuration = screen.getByText('0 min');
    expect(newDuration).toBeInTheDocument();
    
    // Writing pace should be reset to 0
    expect(screen.getByText('0 wpm')).toBeInTheDocument();
  });
  
  test('displays tips for improvement', () => {
    render(<WritingAnalytics document={mockDocument} />);
    
    // Check if tips section is rendered
    const tipsTitle = screen.getByText('Tips for Improvement');
    expect(tipsTitle).toBeInTheDocument();
    
    // Check if at least one tip is displayed
    const regularWritingTip = screen.getByText('Regular writing sessions improve productivity over time.');
    expect(regularWritingTip).toBeInTheDocument();
  });
});
