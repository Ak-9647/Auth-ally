# Author-Ally API Requirements

## Overview
This document outlines the API requirements for the Author-Ally application, focusing on the integration points needed for AI-powered features and other external services.

## AI Service API Requirements

### 1. Text Completion API

#### Purpose
Provide AI-generated continuations of the user's writing based on the existing content.

#### Requirements
- **Endpoint Type**: REST or WebSocket
- **Authentication**: API key or token-based
- **Request Parameters**:
  - `content`: Current text in the editor (string)
  - `genre`: Writing genre (string, optional)
  - `tone`: Desired tone of completion (string, optional)
  - `length`: Approximate length of completion in words (number, optional)
  - `temperature`: Creativity level (number, 0.0-1.0, optional)
- **Response Format**:
  ```json
  {
    "completion": "Generated text continuation...",
    "status": "success",
    "usage": {
      "promptTokens": 123,
      "completionTokens": 45,
      "totalTokens": 168
    }
  }
  ```
- **Error Handling**:
  - Rate limit exceeded
  - Authentication failure
  - Content policy violation
  - Service unavailable

#### Integration Strategy
- Implement with debouncing to prevent excessive API calls
- Cache recent completions to reduce API usage
- Implement fallback options for when the service is unavailable

---

### 2. Rewriting Suggestions API

#### Purpose
Generate alternative phrasings for selected text to improve clarity, style, or impact.

#### Requirements
- **Endpoint Type**: REST
- **Authentication**: API key or token-based
- **Request Parameters**:
  - `selectedText`: Text to be rewritten (string)
  - `context`: Surrounding text for context (string, optional)
  - `style`: Desired style (formal, casual, creative, etc.) (string, optional)
  - `purpose`: Purpose of rewrite (clarity, conciseness, engagement) (string, optional)
  - `count`: Number of alternatives to generate (number, optional)
- **Response Format**:
  ```json
  {
    "suggestions": [
      {
        "text": "First alternative phrasing...",
        "style": "formal",
        "impact": 0.85
      },
      {
        "text": "Second alternative phrasing...",
        "style": "creative",
        "impact": 0.78
      }
    ],
    "status": "success"
  }
  ```
- **Error Handling**:
  - Text too long
  - No suitable alternatives found
  - Service limitations

#### Integration Strategy
- Highlight selected text with a special marker
- Show suggestions in a floating panel
- Allow one-click replacement of original text

---

### 3. Grammar and Style Checking API

#### Purpose
Identify grammar, style, and clarity issues in the user's writing and provide suggestions for improvement.

#### Requirements
- **Endpoint Type**: REST
- **Authentication**: API key or token-based
- **Request Parameters**:
  - `content`: Text to analyze (string)
  - `language`: Content language (string, optional)
  - `checkTypes`: Array of check types (grammar, style, clarity, etc.) (array, optional)
- **Response Format**:
  ```json
  {
    "issues": [
      {
        "type": "grammar",
        "severity": "high",
        "position": {
          "start": 156,
          "end": 162
        },
        "issue": "Subject-verb agreement error",
        "original": "The cats is running",
        "suggestions": ["The cats are running"]
      },
      {
        "type": "style",
        "severity": "medium",
        "position": {
          "start": 200,
          "end": 230
        },
        "issue": "Passive voice",
        "original": "The book was written by me",
        "suggestions": ["I wrote the book"]
      }
    ],
    "summary": {
      "grammarIssues": 3,
      "styleIssues": 2,
      "clarityIssues": 1,
      "totalIssues": 6
    },
    "status": "success"
  }
  ```
- **Error Handling**:
  - Content too long
  - Unsupported language
  - Service unavailable

#### Integration Strategy
- Implement real-time checking with appropriate throttling
- Highlight issues in the editor with different colors based on type
- Show detailed explanations and suggestions on hover
- Provide batch checking for longer documents

---

### 4. Book Outline Generation API

#### Purpose
Generate structured chapter outlines based on book genre, theme, and basic description.

#### Requirements
- **Endpoint Type**: REST
- **Authentication**: API key or token-based
- **Request Parameters**:
  - `title`: Book title (string)
  - `genre`: Book genre (string)
  - `description`: Brief description or premise (string)
  - `targetLength`: Approximate book length (short story, novella, novel) (string, optional)
  - `structureType`: Desired structure (three-act, hero's journey, etc.) (string, optional)
- **Response Format**:
  ```json
  {
    "outline": {
      "title": "Original or suggested title",
      "genre": "Confirmed genre",
      "structure": "Three-act structure",
      "chapters": [
        {
          "number": 1,
          "title": "Chapter title suggestion",
          "summary": "Brief description of chapter content",
          "keyEvents": ["Event 1", "Event 2"],
          "characters": ["Character A", "Character B"],
          "settings": ["Setting X"]
        }
      ],
      "arcs": [
        {
          "name": "Main character arc",
          "description": "Character's journey from X to Y",
          "keyPoints": ["Point 1", "Point 2"]
        }
      ]
    },
    "status": "success"
  }
  ```
- **Error Handling**:
  - Insufficient information provided
  - Unsupported genre
  - Generation failure

#### Integration Strategy
- Implement as a dedicated tool in the editor interface
- Allow users to edit and customize the generated outline
- Provide options to export the outline as a separate document

---

### 5. Book Cover Generation API

#### Purpose
Generate AI-powered book cover designs based on title, genre, and description.

#### Requirements
- **Endpoint Type**: REST
- **Authentication**: API key or token-based
- **Request Parameters**:
  - `title`: Book title (string)
  - `author`: Author name (string)
  - `genre`: Book genre (string)
  - `description`: Brief description for imagery guidance (string)
  - `style`: Design style preference (string, optional)
  - `colorScheme`: Preferred color scheme (string, optional)
- **Response Format**:
  ```json
  {
    "covers": [
      {
        "id": "cover-123",
        "imageUrl": "https://api.example.com/covers/cover-123.jpg",
        "thumbnailUrl": "https://api.example.com/covers/cover-123-thumb.jpg",
        "style": "Minimalist",
        "dimensions": {
          "width": 1600,
          "height": 2400
        }
      }
    ],
    "status": "success"
  }
  ```
- **Error Handling**:
  - Generation failure
  - Inappropriate content detection
  - Service limitations

#### Integration Strategy
- Implement as a dedicated tool in the application
- Allow downloading in multiple resolutions
- Provide customization options for generated covers

---

### 6. Web Speech API Integration

#### Purpose
Implement speech-to-text dictation functionality using the browser's Web Speech API.

#### Requirements
- **API**: Web Speech API (browser native)
- **Features Required**:
  - `SpeechRecognition` interface
  - `SpeechGrammarList` for improved accuracy (optional)
  - Audio level data for visualization
- **Configuration Options**:
  - Language selection
  - Continuous recognition
  - Interim results for real-time feedback
- **Event Handling**:
  - `onresult`: Process recognized text
  - `onerror`: Handle recognition errors
  - `onend`: Manage recognition session ending
  - `onaudiostart`/`onaudioend`: Manage audio visualization

#### Integration Strategy
- Create a custom React hook for speech recognition
- Implement audio level visualization using canvas or SVG
- Provide clear UI indicators for recording state
- Ensure proper microphone permission handling

---

## Future API Integrations

### 1. Supabase Integration

#### Purpose
Provide cloud synchronization, user authentication, and collaboration features.

#### Requirements
- **Authentication API**:
  - User registration/login
  - Social auth providers
  - Session management
- **Database API**:
  - Document storage and retrieval
  - Version history
  - User preferences
- **Realtime API**:
  - Collaborative editing
  - Presence indicators
  - Change notifications

#### Integration Strategy
- Implement as a premium feature
- Ensure offline-first approach with synchronization
- Provide clear upgrade path from local-only to cloud storage

---

### 2. Export Service APIs

#### Purpose
Generate high-quality PDF and ePub exports from document content.

#### Requirements
- **PDF Generation**:
  - Formatting preservation
  - Custom styling options
  - Table of contents generation
- **ePub Generation**:
  - Metadata handling
  - Chapter organization
  - Cover image integration

#### Integration Strategy
- Use client-side libraries when possible (jsPDF)
- Fall back to server-side generation for complex documents
- Provide download progress indicators for large documents

---

## API Error Handling Strategy

### General Approach
1. **Graceful Degradation**: Ensure core functionality works without AI features
2. **Retry Logic**: Implement exponential backoff for transient errors
3. **Caching**: Cache successful responses to reduce API dependency
4. **User Feedback**: Provide clear error messages without technical details
5. **Fallback Content**: Use cached or simplified alternatives when services fail

### Error Categories
1. **Authentication Errors**: Prompt for re-authentication or API key update
2. **Rate Limiting**: Implement queuing and prioritization of requests
3. **Service Unavailability**: Switch to offline mode with appropriate messaging
4. **Content Policy Violations**: Provide guidance on acceptable content
5. **Timeout Errors**: Offer simplified alternatives or retry options

---

## Performance Considerations

### API Call Optimization
1. **Batching**: Combine multiple checks or requests when possible
2. **Throttling**: Limit frequency of real-time API calls
3. **Progressive Loading**: Request minimal data first, then enhance
4. **Selective Processing**: Only send relevant portions of text for analysis
5. **Background Processing**: Handle API calls in web workers when possible

### Data Transfer Efficiency
1. **Compression**: Use compression for large text transfers
2. **Incremental Updates**: Send only changed content when possible
3. **Pagination**: Split large responses into manageable chunks
4. **Selective Fields**: Request only needed data fields

---

## Security Requirements

### Data Protection
1. **Content Encryption**: Encrypt sensitive content before transmission
2. **API Key Security**: Never expose API keys in client-side code
3. **Content Filtering**: Prevent transmission of sensitive personal information

### User Privacy
1. **Minimal Data Collection**: Only send necessary data to external services
2. **Transparency**: Clearly communicate when AI services are being used
3. **Consent Management**: Allow users to opt out of AI features
4. **Data Retention**: Minimize or eliminate server-side storage of user content

---

## Implementation Priorities

### Phase 1 (MVP)
1. Web Speech API integration for dictation
2. Basic grammar checking
3. Simple text completion

### Phase 2
1. Enhanced text completion
2. Rewriting suggestions
3. Book outline generation

### Phase 3
1. Book cover generation
2. Advanced grammar and style checking
3. Supabase integration for cloud features
