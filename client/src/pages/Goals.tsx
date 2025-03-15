import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import GoalSetting from '../components/goals/GoalSetting';
import WritingInsights from '../components/analytics/WritingInsights';

const Goals: React.FC = () => {
  const { isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState<'goals' | 'analytics'>('goals');
  
  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Sign in to access writing goals</h2>
          <p className="text-gray-600 dark:text-gray-400">Please sign in to manage your writing goals and view your analytics.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Goals & Analytics</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
              activeTab === 'goals'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Goals
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
      
      {activeTab === 'goals' ? (
        <GoalSetting />
      ) : (
        <WritingInsights />
      )}
    </div>
  );
};

export default Goals; 