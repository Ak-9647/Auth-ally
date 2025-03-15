import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExportComponent from '../components/export/ExportComponent';

describe('ExportComponent', () => {
  // Mock document object
  const mockDocument = {
    id: 'test-doc-1',
    title: 'Test Document',
    content: 'This is test content for the document.',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Mock URL.createObjectURL and document.createElement
  const mockObjectURL = 'blob:test-url';
  const mockAnchorElement = {
    href: '',
    download: '',
    click: jest.fn(),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock URL.createObjectURL
    URL.createObjectURL = jest.fn().mockReturnValue(mockObjectURL);
    URL.revokeObjectURL = jest.fn();
    
    // Mock document.createElement and appendChild
    document.createElement = jest.fn().mockReturnValue(mockAnchorElement);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    
    // Mock setTimeout
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('renders export component', () => {
    render(<ExportComponent document={mockDocument} />);
    
    // Check if title is rendered
    const title = screen.getByText('Export Document');
    expect(title).toBeInTheDocument();
    
    // Check if format selector is rendered
    const formatSelector = screen.getByText('Export Format');
    expect(formatSelector).toBeInTheDocument();
    
    // Check if export button is rendered
    const exportButton = screen.getByText('Export as PDF');
    expect(exportButton).toBeInTheDocument();
  });
  
  test('changes format when selector is changed', () => {
    render(<ExportComponent document={mockDocument} />);
    
    // Get the format selector
    const formatSelector = screen.getByRole('combobox');
    
    // Change the format to ePub
    fireEvent.change(formatSelector, { target: { value: 'epub' } });
    
    // Check if the export button text was updated
    const exportButton = screen.getByText('Export as EPUB');
    expect(exportButton).toBeInTheDocument();
  });
  
  test('shows error when exporting with empty document', () => {
    // Render with empty document
    render(<ExportComponent document={{ ...mockDocument, content: '' }} />);
    
    // Click export button
    const exportButton = screen.getByText('Export as PDF');
    fireEvent.click(exportButton);
    
    // Check if error message is displayed
    const errorMessage = screen.getByText('No content to export');
    expect(errorMessage).toBeInTheDocument();
  });
  
  test('exports PDF when button is clicked', async () => {
    render(<ExportComponent document={mockDocument} />);
    
    // Click export button
    const exportButton = screen.getByText('Export as PDF');
    fireEvent.click(exportButton);
    
    // Check if exporting state is shown
    expect(screen.getByText('Exporting as PDF...')).toBeInTheDocument();
    
    // Fast-forward timers
    jest.advanceTimersByTime(2000);
    
    // Check if URL.createObjectURL was called with a Blob
    expect(URL.createObjectURL).toHaveBeenCalled();
    
    // Check if anchor element was created and clicked
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockAnchorElement.download).toBe('Test Document.pdf');
    expect(mockAnchorElement.click).toHaveBeenCalled();
    
    // Fast-forward cleanup timeout
    jest.advanceTimersByTime(200);
    
    // Check if cleanup was performed
    expect(document.body.removeChild).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockObjectURL);
    
    // Check if component returned to initial state
    await waitFor(() => {
      expect(screen.getByText('Export as PDF')).toBeInTheDocument();
    });
  });
  
  test('exports ePub when button is clicked', async () => {
    render(<ExportComponent document={mockDocument} />);
    
    // Change format to ePub
    const formatSelector = screen.getByRole('combobox');
    fireEvent.change(formatSelector, { target: { value: 'epub' } });
    
    // Click export button
    const exportButton = screen.getByText('Export as EPUB');
    fireEvent.click(exportButton);
    
    // Check if exporting state is shown
    expect(screen.getByText('Exporting as EPUB...')).toBeInTheDocument();
    
    // Fast-forward timers
    jest.advanceTimersByTime(2500);
    
    // Check if URL.createObjectURL was called with a Blob
    expect(URL.createObjectURL).toHaveBeenCalled();
    
    // Check if anchor element was created and clicked
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockAnchorElement.download).toBe('Test Document.epub');
    expect(mockAnchorElement.click).toHaveBeenCalled();
    
    // Fast-forward cleanup timeout
    jest.advanceTimersByTime(200);
    
    // Check if cleanup was performed
    expect(document.body.removeChild).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockObjectURL);
    
    // Check if component returned to initial state
    await waitFor(() => {
      expect(screen.getByText('Export as EPUB')).toBeInTheDocument();
    });
  });
});
