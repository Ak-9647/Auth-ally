import React from 'react';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Theme Settings */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
            </div>
            
            <div className="space-y-6 pl-10">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 dark:text-gray-300 font-medium">Theme</label>
                <select 
                  className="rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2"
                  defaultValue="system"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-gray-700 dark:text-gray-300 font-medium">Font Size</label>
                <select 
                  className="rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2"
                  defaultValue="medium"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Editor Settings */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Editor</h2>
            </div>
            
            <div className="space-y-4 pl-10">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="autosave"
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mr-3"
                  defaultChecked
                />
                <label htmlFor="autosave" className="text-gray-700 dark:text-gray-300">Auto-save (every 5 seconds)</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="wordcount"
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mr-3"
                  defaultChecked
                />
                <label htmlFor="wordcount" className="text-gray-700 dark:text-gray-300">Show word count</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="shortcuts"
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mr-3"
                  defaultChecked
                />
                <label htmlFor="shortcuts" className="text-gray-700 dark:text-gray-300">Enable keyboard shortcuts</label>
              </div>
            </div>
          </div>
          
          {/* AI Settings */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Assistance</h2>
            </div>
            
            <div className="space-y-6 pl-10">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 dark:text-gray-300 font-medium">AI Suggestion Style</label>
                <select 
                  className="rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2"
                  defaultValue="balanced"
                >
                  <option value="creative">Creative</option>
                  <option value="balanced">Balanced</option>
                  <option value="precise">Precise</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="grammar"
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mr-3"
                  defaultChecked
                />
                <label htmlFor="grammar" className="text-gray-700 dark:text-gray-300">Enable real-time grammar checking</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="suggestions"
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mr-3"
                  defaultChecked
                />
                <label htmlFor="suggestions" className="text-gray-700 dark:text-gray-300">Show AI writing suggestions</label>
              </div>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy</h2>
            </div>
            
            <div className="space-y-4 pl-10">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="local"
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mr-3"
                  defaultChecked
                />
                <label htmlFor="local" className="text-gray-700 dark:text-gray-300">Store documents locally</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="stats"
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mr-3"
                  defaultChecked
                />
                <label htmlFor="stats" className="text-gray-700 dark:text-gray-300">Allow anonymous usage statistics</label>
              </div>
              
              <div className="pt-6">
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clear All Local Data
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
