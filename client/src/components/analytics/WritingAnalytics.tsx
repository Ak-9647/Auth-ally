import React, { useState, useEffect } from 'react';
import { Document } from '../../context/EditorContext';
import { calculateReadabilityScore, countWords, countCharacters } from '../../utils/textUtils';

interface WritingAnalyticsProps {
  document: Document;
}

const WritingAnalytics: React.FC<WritingAnalyticsProps> = ({ document }) => {
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [readabilityScore, setReadabilityScore] = useState<number>(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState<number>(0);
  const [writingPace, setWritingPace] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());
  const [sessionWordCount, setSessionWordCount] = useState<number>(0);
  
  // Calculate analytics when document changes
  useEffect(() => {
    if (document && document.content) {
      const words = countWords(document.content);
      const chars = countCharacters(document.content);
      const readability = calculateReadabilityScore(document.content);
      const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute reading speed
      
      setWordCount(words);
      setCharCount(chars);
      setReadabilityScore(readability);
      setEstimatedReadingTime(readingTime);
      
      // Update session word count
      const wordDiff = words - sessionWordCount;
      if (wordDiff > 0) {
        setSessionWordCount(words);
        
        // Calculate writing pace (words per minute)
        const sessionDuration = (new Date().getTime() - sessionStartTime.getTime()) / 60000; // in minutes
        if (sessionDuration > 0) {
          setWritingPace(Math.round(wordDiff / sessionDuration));
        }
      }
    }
  }, [document, sessionStartTime, sessionWordCount]);
  
  // Reset session stats
  const resetSession = () => {
    setSessionStartTime(new Date());
    setSessionWordCount(wordCount);
    setWritingPace(0);
  };
  
  // Get readability level description
  const getReadabilityLevel = (score: number): string => {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Writing Analytics</h3>
        <button
          onClick={resetSession}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Reset Session
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
          <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Word Count</h4>
          <p className="text-2xl font-bold">{wordCount.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
          <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Character Count</h4>
          <p className="text-2xl font-bold">{charCount.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
          <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Readability</h4>
          <p className="text-2xl font-bold">{readabilityScore.toFixed(1)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getReadabilityLevel(readabilityScore)}
          </p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
          <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reading Time</h4>
          <p className="text-2xl font-bold">{estimatedReadingTime} min</p>
        </div>
      </div>
      
      <h4 className="text-md font-medium mb-2">Current Session</h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
          <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Writing Pace</h4>
          <p className="text-2xl font-bold">{writingPace} wpm</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
          <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Session Duration</h4>
          <p className="text-2xl font-bold">
            {Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000)} min
          </p>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
        <h4 className="font-medium mb-1">Tips for Improvement</h4>
        <ul className="list-disc list-inside space-y-1">
          {readabilityScore < 60 && (
            <li>Consider simplifying your language for better readability.</li>
          )}
          {writingPace < 10 && (
            <li>Try free writing exercises to increase your writing speed.</li>
          )}
          {wordCount < 500 && (
            <li>Set a word count goal to help build your content.</li>
          )}
          <li>Regular writing sessions improve productivity over time.</li>
        </ul>
      </div>
    </div>
  );
};

export default WritingAnalytics;
