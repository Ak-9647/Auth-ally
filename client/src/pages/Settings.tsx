import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Theme Settings */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Theme</span>
                <select 
                  className="ml-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  defaultValue="system"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </label>
            </div>
            
            <div>
              <label className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Font Size</span>
                <select 
                  className="ml-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  defaultValue="medium"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        
        {/* Editor Settings */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Editor</h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                  defaultChecked
                />
                <span className="text-gray-700 dark:text-gray-300">Auto-save (every 5 seconds)</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                  defaultChecked
                />
                <span className="text-gray-700 dark:text-gray-300">Show word count</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                  defaultChecked
                />
                <span className="text-gray-700 dark:text-gray-300">Enable keyboard shortcuts</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* AI Settings */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">AI Assistance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">AI Suggestion Style</span>
                <select 
                  className="ml-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  defaultValue="balanced"
                >
                  <option value="creative">Creative</option>
                  <option value="balanced">Balanced</option>
                  <option value="precise">Precise</option>
                </select>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                  defaultChecked
                />
                <span className="text-gray-700 dark:text-gray-300">Enable real-time grammar checking</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                  defaultChecked
                />
                <span className="text-gray-700 dark:text-gray-300">Show AI writing suggestions</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Privacy Settings */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                  defaultChecked
                />
                <span className="text-gray-700 dark:text-gray-300">Store documents locally</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                  defaultChecked
                />
                <span className="text-gray-700 dark:text-gray-300">Allow anonymous usage statistics</span>
              </label>
            </div>
            
            <div className="pt-4">
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Clear All Local Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
