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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Book Cover Generator</h1>
        <Link 
          to="/tools" 
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Back to Tools
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <BookCoverGenerator onCoverGenerated={handleCoverGenerated} />
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
            <h3 className="text-xl font-semibold mb-4">Selected Cover</h3>
            
            {selectedCover ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={selectedCover} 
                    alt="Selected book cover" 
                    className="max-w-full h-auto rounded-md shadow-lg"
                  />
                </div>
                
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Download Cover
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <p>No cover selected yet.</p>
                <p className="text-sm mt-2">Generate and select a cover from the options on the left.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverGeneratorPage; 