// Utility functions for text manipulation and formatting

/**
 * Calculates word count from text
 * @param text The text to analyze
 * @returns Number of words
 */
export const countWords = (text: string): number => {
  if (!text || text.trim() === '') {
    return 0;
  }
  return text.trim().split(/\s+/).filter(Boolean).length;
};

/**
 * Calculates character count from text
 * @param text The text to analyze
 * @param countSpaces Whether to include spaces in the count
 * @returns Number of characters
 */
export const countCharacters = (text: string, countSpaces: boolean = true): number => {
  if (!text) {
    return 0;
  }
  return countSpaces ? text.length : text.replace(/\s/g, '').length;
};

/**
 * Calculates estimated reading time
 * @param text The text to analyze
 * @param wordsPerMinute Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export const calculateReadingTime = (text: string, wordsPerMinute: number = 200): number => {
  const words = countWords(text);
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Truncates text to a specified length with ellipsis
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  return text.substring(0, maxLength) + '...';
};

/**
 * Formats a date for display
 * @param date The date to format
 * @param format The format style ('short', 'medium', 'long')
 * @returns Formatted date string
 */
export const formatDate = (date: Date, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  if (!date) {
    return '';
  }
  
  try {
    switch (format) {
      case 'short':
        return date.toLocaleDateString();
      case 'long':
        return date.toLocaleDateString(undefined, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'medium':
      default:
        return date.toLocaleDateString(undefined, { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toString();
  }
};

/**
 * Generates a unique ID
 * @returns Unique ID string
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Debounces a function call
 * @param func The function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function call
 * @param func The function to throttle
 * @param limit Limit time in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Calculates Flesch-Kincaid readability score
 * @param text The text to analyze
 * @returns Readability score (0-100)
 */
export const calculateReadabilityScore = (text: string): number => {
  if (!text || text.trim() === '') {
    return 0;
  }
  
  // Split text into sentences and words
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = countSyllables(text);
  
  if (words.length === 0 || sentences.length === 0) {
    return 0;
  }
  
  // Calculate Flesch-Kincaid Reading Ease score
  const wordsPerSentence = words.length / sentences.length;
  const syllablesPerWord = syllables / words.length;
  
  // Flesch-Kincaid formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  const score = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
  
  // Clamp score between 0 and 100
  return Math.min(Math.max(score, 0), 100);
};

/**
 * Helper function to count syllables in text
 * @param text The text to analyze
 * @returns Estimated syllable count
 */
const countSyllables = (text: string): number => {
  if (!text) {
    return 0;
  }
  
  // This is a simplified syllable counter
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  let count = 0;
  
  for (const word of words) {
    // Count vowel groups as syllables
    const syllables = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '')
      .replace(/^y/, '')
      .match(/[aeiouy]{1,2}/g);
    
    // Add syllables found, or 1 if none found
    count += syllables ? syllables.length : 1;
  }
  
  return count;
};
