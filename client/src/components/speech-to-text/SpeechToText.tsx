import React, { useState, useEffect } from 'react';

interface SpeechToTextProps {
  onTranscriptReady: (transcript: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscriptReady }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  
  // Check if browser supports speech recognition
  const browserSupportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  // Reference to the speech recognition instance
  const recognitionRef = React.useRef<any>(null);
  
  // Initialize speech recognition
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
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognitionRef.current.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript + ' ';
        } else {
          interimText += transcript;
        }
      }
      
      setInterimTranscript(interimText);
      
      if (finalText) {
        setTranscript(prev => prev + finalText);
      }
    };
    
    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [browserSupportsSpeechRecognition, selectedLanguage]);
  
  // Simulate audio level visualization
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        // In a real implementation, this would use the Web Audio API to get actual audio levels
        // For now, we'll simulate it with random values when listening
        setAudioLevel(Math.random() * 100);
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);
  
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Speech recognition error:', error);
        setError('Failed to start speech recognition. Please try again.');
      }
    }
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    
    // Update recognition language
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLanguage;
      
      // Restart recognition if it was active
      if (isListening) {
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Speech recognition error:', error);
          }
        }, 200);
      }
    }
  };
  
  const handleInsertText = () => {
    if (transcript) {
      onTranscriptReady(transcript);
      setTranscript('');
      setInterimTranscript('');
    }
  };
  
  const handleClearText = () => {
    setTranscript('');
    setInterimTranscript('');
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Speech-to-Text Dictation</h3>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md mb-3">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Language
        </label>
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          disabled={isListening}
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="de-DE">German</option>
          <option value="zh-CN">Chinese (Simplified)</option>
          <option value="ja-JP">Japanese</option>
        </select>
      </div>
      
      {/* Audio Level Visualization */}
      <div className="mb-4 h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-100"
          style={{ width: `${audioLevel}%` }}
        ></div>
      </div>
      
      <div className="mb-4">
        <button
          onClick={toggleListening}
          className={`w-full px-4 py-2 rounded-md ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isListening ? 'Stop Dictation' : 'Start Dictation'}
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Transcription
        </label>
        <div className="min-h-[100px] max-h-[200px] overflow-y-auto p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
          {transcript}
          <span className="text-gray-500 dark:text-gray-400">{interimTranscript}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleInsertText}
          disabled={!transcript}
          className="flex-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          Insert Text
        </button>
        <button
          onClick={handleClearText}
          disabled={!transcript && !interimTranscript}
          className="flex-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SpeechToText;
