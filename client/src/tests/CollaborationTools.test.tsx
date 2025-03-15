import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CollaborationTools from '../components/collaboration/CollaborationTools';

describe('CollaborationTools', () => {
  // Mock document object
  const mockDocument = {
    id: 'test-doc-1',
    title: 'Test Document',
    content: 'This is test content for the document.',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Mock clipboard API
  const originalClipboard = { ...global.navigator.clipboard };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock clipboard writeText
    global.navigator.clipboard = {
      writeText: jest.fn().mockImplementation(() => Promise.resolve())
    };
    
    // Mock setTimeout
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    global.navigator.clipboard = originalClipboard;
    jest.useRealTimers();
  });
  
  test('renders collaboration tools component', () => {
    render(<CollaborationTools document={mockDocument} />);
    
    // Check if title is rendered
    const title = screen.getByText('Collaboration Tools');
    expect(title).toBeInTheDocument();
    
    // Check if invite section is rendered
    const inviteSection = screen.getByText('Invite Collaborators');
    expect(inviteSection).toBeInTheDocument();
    
    // Check if email input is rendered
    const emailInput = screen.getByPlaceholderText('Enter email address');
    expect(emailInput).toBeInTheDocument();
    
    // Check if invite button is rendered
    const inviteButton = screen.getByText('Invite');
    expect(inviteButton).toBeInTheDocument();
  });
  
  test('shows error when adding invalid email', () => {
    render(<CollaborationTools document={mockDocument} />);
    
    // Enter invalid email
    const emailInput = screen.getByPlaceholderText('Enter email address');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Click invite button
    const inviteButton = screen.getByText('Invite');
    fireEvent.click(inviteButton);
    
    // Check if error message is displayed
    const errorMessage = screen.getByText('Please enter a valid email address');
    expect(errorMessage).toBeInTheDocument();
  });
  
  test('adds collaborator when valid email is entered', () => {
    render(<CollaborationTools document={mockDocument} />);
    
    // Enter valid email
    const emailInput = screen.getByPlaceholderText('Enter email address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Click invite button
    const inviteButton = screen.getByText('Invite');
    fireEvent.click(inviteButton);
    
    // Check if success message is displayed
    const successMessage = screen.getByText('Invitation sent to test@example.com');
    expect(successMessage).toBeInTheDocument();
    
    // Check if collaborator is added to the list
    const collaboratorEmail = screen.getByText('test@example.com');
    expect(collaboratorEmail).toBeInTheDocument();
    
    // Check if remove button is rendered
    const removeButton = screen.getByText('Remove');
    expect(removeButton).toBeInTheDocument();
  });
  
  test('removes collaborator when remove button is clicked', () => {
    render(<CollaborationTools document={mockDocument} />);
    
    // Add a collaborator
    const emailInput = screen.getByPlaceholderText('Enter email address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const inviteButton = screen.getByText('Invite');
    fireEvent.click(inviteButton);
    
    // Click remove button
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    
    // Check if collaborator was removed
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });
  
  test('generates share link when button is clicked', () => {
    render(<CollaborationTools document={mockDocument} />);
    
    // Click generate link button
    const generateButton = screen.getByText('Generate Link');
    fireEvent.click(generateButton);
    
    // Check if link input is displayed
    const linkInput = screen.getByRole('textbox', { name: '' });
    expect(linkInput).toBeInTheDocument();
    expect(linkInput.value).toContain('https://author-ally.com/shared/test-doc-1/');
    
    // Check if copy button is rendered
    const copyButton = screen.getByText('Copy');
    expect(copyButton).toBeInTheDocument();
  });
  
  test('copies link to clipboard when copy button is clicked', () => {
    render(<CollaborationTools document={mockDocument} />);
    
    // Generate a link
    const generateButton = screen.getByText('Generate Link');
    fireEvent.click(generateButton);
    
    // Click copy button
    const copyButton = screen.getByText('Copy');
    fireEvent.click(copyButton);
    
    // Check if clipboard.writeText was called
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    
    // Check if success message is displayed
    const successMessage = screen.getByText('Link copied to clipboard');
    expect(successMessage).toBeInTheDocument();
  });
});
