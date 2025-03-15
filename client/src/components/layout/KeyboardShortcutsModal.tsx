import React from 'react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Keyboard shortcuts list
  const shortcuts = [
    { key: 'Ctrl + /', description: 'Toggle sidebar' },
    { key: 'Ctrl + D', description: 'Toggle dark mode' },
    { key: 'Ctrl + K', description: 'Focus search' },
    { key: 'Ctrl + E', description: 'New document' },
    { key: 'Ctrl + S', description: 'Save document' },
    { key: 'Ctrl + P', description: 'Print document' },
    { key: 'Ctrl + [, Ctrl + ]', description: 'Navigate between documents' },
    { key: 'Ctrl + F', description: 'Find in document' },
    { key: 'Ctrl + H', description: 'Replace in document' },
    { key: 'Alt + ←', description: 'Go back to previous view' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 overflow-hidden transform transition-all"
          role="dialog"
          aria-modal="true"
          aria-labelledby="keyboard-shortcuts-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 
              id="keyboard-shortcuts-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Keyboard Shortcuts
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={onClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Shortcuts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcuts.map((shortcut, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                <div className="flex gap-1">
                  {shortcut.key.split(', ').map((k, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="text-gray-500 dark:text-gray-400 mx-1">or</span>}
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded">{k}</kbd>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Tip */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded">?</kbd> anytime to show this help window</p>
          </div>
          
          {/* Close Button */}
          <div className="mt-6 text-center">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
              onClick={onClose}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal; 