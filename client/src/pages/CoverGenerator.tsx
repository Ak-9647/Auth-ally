import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BookCoverGenerator from '../components/book-cover/BookCoverGenerator';

const CoverGeneratorPage: React.FC = () => {
  const [selectedCover, setSelectedCover] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState<boolean>(false);

  const handleCoverGenerated = (imageUrl: string) => {
    setSelectedCover(imageUrl);
    setDownloadReady(true);
  };

  const handleDownload = () => {
    if (selectedCover) {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = selectedCover;
      link.download = 'book-cover.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Book Cover Generator</h1>
          <Link 
            to="/" 
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Create professional book covers for your manuscripts. Fill in the details below and our AI will generate cover options based on your specifications.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <BookCoverGenerator onCoverGenerated={handleCoverGenerated} />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Selected Cover</h3>
              
              {selectedCover ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative overflow-hidden rounded-lg shadow-xl max-w-md">
                      <img 
                        src={selectedCover} 
                        alt="Selected book cover" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleDownload}
                      className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download Cover
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">No cover selected yet</p>
                  <p className="text-sm text-center">Generate and select a cover from the options to see it here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverGeneratorPage; 