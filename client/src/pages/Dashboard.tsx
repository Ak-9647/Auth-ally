import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Author-Ally Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Recent Documents Section */}
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
          <div className="space-y-4">
            {/* This will be populated with actual documents later */}
            <p className="text-gray-500 dark:text-gray-400">No recent documents found. Create a new document to get started.</p>
            
            <Link 
              to="/editor/new" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create New Document
            </Link>
          </div>
        </div>
        
        {/* Quick Tools Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Tools</h2>
          <div className="space-y-2">
            <Link 
              to="/tools" 
              className="block p-3 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              AI Writing Assistant
            </Link>
            <Link 
              to="/tools" 
              className="block p-3 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Book Cover Generator
            </Link>
            <Link 
              to="/tools" 
              className="block p-3 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Speech-to-Text Dictation
            </Link>
          </div>
        </div>
        
        {/* Writing Stats Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-4">
          <h2 className="text-xl font-semibold mb-4">Writing Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Words</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Documents</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Writing Streak</h3>
              <p className="text-2xl font-bold">0 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
