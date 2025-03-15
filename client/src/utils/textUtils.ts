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
 * Calculates the estimated reading time for a given text
 * @param text The text to calculate reading time for
 * @param wordsPerMinute The average reading speed in words per minute (default: 200)
 * @returns A formatted string representing the reading time
 */
export const calculateReadingTime = (text: string, wordsPerMinute = 200): string => {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  if (minutes < 1) {
    return 'Less than a minute';
  } else if (minutes === 1) {
    return '1 minute';
  } else {
    return `${minutes} minutes`;
  }
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
 * Formats a date into a human-readable string
 * @param date The date to format
 * @returns A formatted date string
 */
export const formatDate = (date: Date): string => {
  // Check if the date is today
  const today = new Date();
  const isToday = date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();
  
  // Check if the date is yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.getDate() === yesterday.getDate() &&
                      date.getMonth() === yesterday.getMonth() &&
                      date.getFullYear() === yesterday.getFullYear();
  
  if (isToday) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (isYesterday) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    // Format as Month Day, Year
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
 * Calculates the readability score of a text using the Flesch-Kincaid formula
 * @param text The text to analyze
 * @returns An object containing the readability score and grade level
 */
export const calculateReadability = (text: string): { score: number; level: string } => {
  // Count sentences, words, and syllables
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const words = text.split(/\s+/).filter(Boolean).length;
  
  // Simple syllable counting (not perfect but a reasonable approximation)
  const syllables = countSyllables(text);
  
  if (words === 0 || sentences === 0) {
    return { score: 0, level: 'N/A' };
  }
  
  // Flesch-Kincaid Reading Ease formula
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  
  // Determine reading level based on score
  let level = '';
  if (score >= 90) level = 'Very Easy';
  else if (score >= 80) level = 'Easy';
  else if (score >= 70) level = 'Fairly Easy';
  else if (score >= 60) level = 'Standard';
  else if (score >= 50) level = 'Fairly Difficult';
  else if (score >= 30) level = 'Difficult';
  else level = 'Very Difficult';
  
  return { 
    score: Math.round(score * 10) / 10, // Round to 1 decimal place
    level 
  };
};

/**
 * Counts the approximate number of syllables in a text
 * @param text The text to count syllables in
 * @returns The estimated number of syllables
 */
const countSyllables = (text: string): number => {
  // Convert to lowercase and remove non-alphabetic characters
  const cleanText = text.toLowerCase().replace(/[^a-z]/g, ' ');
  const words = cleanText.split(/\s+/).filter(Boolean);
  
  let syllableCount = 0;
  
  for (const word of words) {
    // Count vowel groups as syllables
    let count = word.match(/[aeiouy]{1,2}/g)?.length || 0;
    
    // Adjust for common patterns
    if (word.length > 3 && word.endsWith('e')) {
      count -= 1; // Silent e at the end
    }
    
    if (word.endsWith('le') && word.length > 2 && !['a', 'e', 'i', 'o', 'u', 'y'].includes(word[word.length - 3])) {
      count += 1; // Words ending in -le preceded by a consonant
    }
    
    // Ensure at least one syllable per word
    syllableCount += Math.max(1, count);
  }
  
  return syllableCount;
};
