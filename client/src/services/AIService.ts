// AI service for text completion, rewriting, and other AI features
class AIService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = import.meta.env?.VITE_APP_AI_SERVICE_KEY || '';
    this.apiUrl = import.meta.env?.VITE_APP_API_URL || 'https://api.openai.com/v1';
  }

  // Text completion
  public async completeText(prompt: string): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('API key is not configured');
      }

      const response = await fetch(`${this.apiUrl}/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-instruct',
          prompt: prompt,
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to complete text');
      }

      const data = await response.json();
      return data.choices[0].text;
    } catch (error) {
      console.error('Error completing text:', error);
      throw error;
    }
  }

  // Rewrite text
  public async rewriteText(text: string, style: string = 'standard'): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('API key is not configured');
      }

      const prompt = `Rewrite the following text in a ${style} style:\n\n${text}`;

      const response = await fetch(`${this.apiUrl}/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-instruct',
          prompt: prompt,
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to rewrite text');
      }

      const data = await response.json();
      return data.choices[0].text;
    } catch (error) {
      console.error('Error rewriting text:', error);
      throw error;
    }
  }

  // Generate book outline
  public async generateOutline(title: string, genre: string, description: string): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('API key is not configured');
      }

      const prompt = `Generate a book outline for a ${genre} book titled "${title}" with the following description: ${description}. Include chapter titles and brief descriptions.`;

      const response = await fetch(`${this.apiUrl}/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-instruct',
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate outline');
      }

      const data = await response.json();
      return data.choices[0].text;
    } catch (error) {
      console.error('Error generating outline:', error);
      throw error;
    }
  }

  // Check grammar and style
  public async checkGrammar(text: string): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('API key is not configured');
      }

      const prompt = `Check the following text for grammar and style issues. Provide corrections and suggestions:\n\n${text}`;

      const response = await fetch(`${this.apiUrl}/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-instruct',
          prompt: prompt,
          max_tokens: 300,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to check grammar');
      }

      const data = await response.json();
      return data.choices[0].text;
    } catch (error) {
      console.error('Error checking grammar:', error);
      throw error;
    }
  }
}

// Add TypeScript declarations for Vite environment variables
declare global {
  interface ImportMeta {
    env?: {
      VITE_APP_API_URL?: string;
      VITE_APP_AI_SERVICE_KEY?: string;
    };
  }
}

export default new AIService(); 