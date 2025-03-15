import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useWritingStats, useWritingSessions, WritingSession } from '../../services/WritingAnalyticsService';

// Helper function to format time duration
const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

// Helper function to format date
const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};

// Helper function to get time period
const getTimePeriod = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Afternoon';
  } else if (hour >= 17 && hour < 22) {
    return 'Evening';
  } else {
    return 'Night';
  }
};

const WritingInsights: React.FC = () => {
  const { isSignedIn } = useUser();
  const stats = useWritingStats();
  const sessions = useWritingSessions();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  
  if (!isSignedIn) {
    return null;
  }
  
  // Filter sessions based on selected time range
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.endTime);
    const today = new Date();
    
    if (timeRange === 'week') {
      // Get sessions from the last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return sessionDate >= oneWeekAgo;
    } else if (timeRange === 'month') {
      // Get sessions from the last 30 days
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(today.getDate() - 30);
      return sessionDate >= oneMonthAgo;
    }
    
    // All sessions
    return true;
  });
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...filteredSessions].sort((a, b) => b.endTime - a.endTime);
  
  // Get data for word count by day chart
  const wordsByDay = sortedSessions.reduce<Record<string, number>>((acc, session) => {
    const day = new Date(session.endTime).toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + session.wordsWritten;
    return acc;
  }, {});
  
  // No data available
  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Writing Analytics</h2>
        <div className="text-center py-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 mb-3">No writing data available yet.</p>
          <p className="text-gray-500 dark:text-gray-500">
            Start writing to track your progress and see insights about your writing habits.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Writing Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'week'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'month'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'all'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Time
          </button>
        </div>
      </div>
      
      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Words Written</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {filteredSessions.reduce((total, session) => total + session.wordsWritten, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Writing Time</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatDuration(filteredSessions.reduce((total, session) => total + (session.endTime - session.startTime), 0))}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sessions</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {filteredSessions.length}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Streak</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Productivity Insights</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Words per Minute</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{stats.averageWordsPerMinute}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Productive Time</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {stats.mostProductiveTimeOfDay.charAt(0).toUpperCase() + stats.mostProductiveTimeOfDay.slice(1)}
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Productive Day</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{stats.mostProductiveDay}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Longest Session</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatDuration(stats.longestSession)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Words per Day</h3>
          
          {/* Simple bar chart for words written by day */}
          <div className="h-40 flex items-end space-x-2">
            {Object.entries(wordsByDay).slice(0, 7).map(([day, words]) => {
              const maxWords = Math.max(...Object.values(wordsByDay));
              const height = maxWords > 0 ? (words / maxWords) * 100 : 0;
              
              return (
                <div key={day} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-t relative" style={{ height: `${height}%` }}>
                    {height > 30 && (
                      <span className="absolute bottom-1 left-0 right-0 text-center text-xs font-medium text-blue-800 dark:text-blue-200">
                        {words}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 w-full text-center truncate">
                    {new Date(day).toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Recent Sessions Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Recent Writing Sessions</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Words Written</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">WPM</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedSessions.slice(0, 5).map((session) => {
                const sessionDuration = session.endTime - session.startTime;
                const minutesSpent = sessionDuration / 60000;
                const wpm = minutesSpent > 0 ? Math.round(session.wordsWritten / minutesSpent) : 0;
                
                return (
                  <tr key={session.startTime} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(session.endTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {getTimePeriod(session.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDuration(sessionDuration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {session.wordsWritten.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {wpm}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WritingInsights; 