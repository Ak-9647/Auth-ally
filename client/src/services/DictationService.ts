// Define SpeechRecognition types
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
}

// Dictation service for speech-to-text functionality
class DictationService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    // Check if the browser supports the Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionConstructor() as SpeechRecognition;
      this.configureRecognition();
    }
  }

  private configureRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      if (this.onResultCallback) {
        this.onResultCallback(transcript);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (this.onErrorCallback) {
        this.onErrorCallback(`Speech recognition error: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        // Restart if we're still supposed to be listening
        this.recognition?.start();
      }
    };
  }

  // Start dictation
  public start(onResult: (text: string) => void, onError: (error: string) => void): boolean {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser');
      return false;
    }

    if (this.isListening) {
      return true;
    }

    try {
      this.onResultCallback = onResult;
      this.onErrorCallback = onError;
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      onError(`Failed to start speech recognition: ${error}`);
      return false;
    }
  }

  // Stop dictation
  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Change language
  public setLanguage(languageCode: string): void {
    if (this.recognition) {
      this.recognition.lang = languageCode;
    }
  }

  // Check if dictation is supported
  public isSupported(): boolean {
    return this.recognition !== null;
  }

  // Check if dictation is currently active
  public isActive(): boolean {
    return this.isListening;
  }
}

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default new DictationService(); 