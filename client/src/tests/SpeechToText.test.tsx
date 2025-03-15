import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SpeechToText from '../components/speech-to-text/SpeechToText';

// Mock the Web Speech API
const mockSpeechRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  continuous: false,
  interimResults: false,
  lang: '',
  onstart: null,
  onend: null,
  onerror: null,
  onresult: null
};

// Mock the global SpeechRecognition constructor
global.SpeechRecognition = jest.fn().mockImplementation(() => mockSpeechRecognition);
global.webkitSpeechRecognition = jest.fn().mockImplementation(() => mockSpeechRecognition);

describe('SpeechToText', () => {
  const mockOnTranscriptReady = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders speech-to-text component', () => {
    render(<SpeechToText onTranscriptReady={mockOnTranscriptReady} />);
    
    // Check if start button is rendered
    const startButton = screen.getByText('Start Dictation');
    expect(startButton).toBeInTheDocument();
    
    // Check if language selector is rendered
    const languageSelector = screen.getByText('Language');
    expect(languageSelector).toBeInTheDocument();
  });
  
  test('toggles listening state when button is clicked', () => {
    render(<SpeechToText onTranscriptReady={mockOnTranscriptReady} />);
    
    // Get the start button
    const startButton = screen.getByText('Start Dictation');
    
    // Click the start button
    fireEvent.click(startButton);
    
    // Check if recognition.start was called
    expect(mockSpeechRecognition.start).toHaveBeenCalled();
    
    // Simulate recognition start
    mockSpeechRecognition.onstart();
    
    // Check if button text changed to "Stop Dictation"
    expect(screen.getByText('Stop Dictation')).toBeInTheDocument();
    
    // Click the stop button
    fireEvent.click(screen.getByText('Stop Dictation'));
    
    // Check if recognition.stop was called
    expect(mockSpeechRecognition.stop).toHaveBeenCalled();
  });
  
  test('changes language when selector is changed', () => {
    render(<SpeechToText onTranscriptReady={mockOnTranscriptReady} />);
    
    // Get the language selector
    const languageSelector = screen.getByRole('combobox');
    
    // Change the language to French
    fireEvent.change(languageSelector, { target: { value: 'fr-FR' } });
    
    // Check if the language was updated
    expect(languageSelector.value).toBe('fr-FR');
  });
  
  test('calls onTranscriptReady when insert button is clicked', async () => {
    render(<SpeechToText onTranscriptReady={mockOnTranscriptReady} />);
    
    // Simulate a recognition result
    const mockResult = {
      resultIndex: 0,
      results: [
        {
          isFinal: true,
          0: { transcript: 'Hello, world!' }
        }
      ]
    };
    
    // Start recognition
    const startButton = screen.getByText('Start Dictation');
    fireEvent.click(startButton);
    
    // Trigger the result event
    mockSpeechRecognition.onresult(mockResult);
    
    // Click the insert button
    const insertButton = screen.getByText('Insert Text');
    fireEvent.click(insertButton);
    
    // Check if onTranscriptReady was called with the transcript
    expect(mockOnTranscriptReady).toHaveBeenCalledWith('Hello, world! ');
  });
  
  test('clears transcript when clear button is clicked', async () => {
    render(<SpeechToText onTranscriptReady={mockOnTranscriptReady} />);
    
    // Simulate a recognition result
    const mockResult = {
      resultIndex: 0,
      results: [
        {
          isFinal: true,
          0: { transcript: 'Hello, world!' }
        }
      ]
    };
    
    // Start recognition
    const startButton = screen.getByText('Start Dictation');
    fireEvent.click(startButton);
    
    // Trigger the result event
    mockSpeechRecognition.onresult(mockResult);
    
    // Check if transcript is displayed
    expect(screen.getByText('Hello, world! ')).toBeInTheDocument();
    
    // Click the clear button
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    
    // Check if transcript was cleared
    expect(screen.queryByText('Hello, world! ')).not.toBeInTheDocument();
  });
});
