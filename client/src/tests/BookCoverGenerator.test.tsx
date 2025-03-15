import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookCoverGenerator from '../components/book-cover/BookCoverGenerator';

describe('BookCoverGenerator', () => {
  const mockOnCoverGenerated = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders book cover generator component', () => {
    render(<BookCoverGenerator onCoverGenerated={mockOnCoverGenerated} />);
    
    // Check if title input is rendered
    const titleInput = screen.getByPlaceholderText('Enter book title');
    expect(titleInput).toBeInTheDocument();
    
    // Check if author input is rendered
    const authorInput = screen.getByPlaceholderText('Enter author name');
    expect(authorInput).toBeInTheDocument();
    
    // Check if genre selector is rendered
    const genreSelector = screen.getByText('Genre');
    expect(genreSelector).toBeInTheDocument();
    
    // Check if generate button is rendered
    const generateButton = screen.getByText('Generate Covers');
    expect(generateButton).toBeInTheDocument();
  });
  
  test('shows error when generating with empty title', () => {
    render(<BookCoverGenerator onCoverGenerated={mockOnCoverGenerated} />);
    
    // Click generate button without entering a title
    const generateButton = screen.getByText('Generate Covers');
    fireEvent.click(generateButton);
    
    // Check if error message is displayed
    const errorMessage = screen.getByText('Please enter a book title');
    expect(errorMessage).toBeInTheDocument();
  });
  
  test('generates covers when button is clicked with valid title', async () => {
    render(<BookCoverGenerator onCoverGenerated={mockOnCoverGenerated} />);
    
    // Enter a title
    const titleInput = screen.getByPlaceholderText('Enter book title');
    fireEvent.change(titleInput, { target: { value: 'Test Book Title' } });
    
    // Click generate button
    const generateButton = screen.getByText('Generate Covers');
    fireEvent.click(generateButton);
    
    // Wait for loading state
    expect(screen.getByText('Generating Covers...')).toBeInTheDocument();
    
    // Wait for covers to be generated
    await waitFor(() => {
      expect(screen.getByText('Generated Covers')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check if select buttons are rendered
    const selectButtons = screen.getAllByText('Select');
    expect(selectButtons.length).toBeGreaterThan(0);
  });
  
  test('calls onCoverGenerated when a cover is selected', async () => {
    render(<BookCoverGenerator onCoverGenerated={mockOnCoverGenerated} />);
    
    // Enter a title
    const titleInput = screen.getByPlaceholderText('Enter book title');
    fireEvent.change(titleInput, { target: { value: 'Test Book Title' } });
    
    // Click generate button
    const generateButton = screen.getByText('Generate Covers');
    fireEvent.click(generateButton);
    
    // Wait for covers to be generated
    await waitFor(() => {
      expect(screen.getByText('Generated Covers')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click the first select button
    const selectButtons = screen.getAllByText('Select');
    fireEvent.click(selectButtons[0]);
    
    // Check if onCoverGenerated was called
    expect(mockOnCoverGenerated).toHaveBeenCalled();
    expect(mockOnCoverGenerated.mock.calls[0][0]).toContain('https://via.placeholder.com');
  });
});
