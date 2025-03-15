import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import BookCoverGenerator from '../components/book-cover/BookCoverGenerator';
import { useCreateBookCover, useBookCovers, useDeleteBookCover } from '../services/ConvexStorageService';

const CoverGeneratorPage: React.FC = () => {
  const { isSignedIn } = useUser();
  const [selectedCover, setSelectedCover] = useState<string | null>(null);
  const [selectedCoverData, setSelectedCoverData] = useState<{
    title: string;
    author: string;
    genre: string;
    description?: string;
    style: string;
  } | null>(null);
  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  
  // Get saved covers from Convex
  const savedCovers = useBookCovers();
  const createBookCover = useCreateBookCover();
  const deleteBookCover = useDeleteBookCover();

  const handleCoverGenerated = (
    imageUrl: string, 
    coverData: {
      title: string;
      author: string;
      genre: string;
      description?: string;
      style: string;
    }
  ) => {
    setSelectedCover(imageUrl);
    setSelectedCoverData(coverData);
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
  
  const handleSaveCover = async () => {
    if (selectedCover && selectedCoverData && isSignedIn) {
      try {
        await createBookCover({
          ...selectedCoverData,
          imageUrl: selectedCover
        });
        alert('Cover saved successfully!');
      } catch (error) {
        console.error('Error saving cover:', error);
        alert('Failed to save cover. Please try again.');
      }
    }
  };
  
  const handleDeleteCover = async (id: any) => {
    if (window.confirm('Are you sure you want to delete this cover?')) {
      try {
        await deleteBookCover(id);
      } catch (error) {
        console.error('Error deleting cover:', error);
        alert('Failed to delete cover. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Book Cover Generator</h1>
          <Link 
            to="/" 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <p className="text-gray-700 mb-6">
            Create professional book covers for your manuscripts. Fill in the details below and our AI will generate cover options based on your specifications.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <BookCoverGenerator onCoverGenerated={handleCoverGenerated} />
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Selected Cover</h3>
              
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
                  
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download
                    </button>
                    
                    {isSignedIn && (
                      <button
                        onClick={handleSaveCover}
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm7-11a1 1 0 10-2 0v6a1 1 0 102 0V6z" clipRule="evenodd" />
                        </svg>
                        Save to Library
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-lg p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">No cover selected yet</p>
                  <p className="text-sm text-center">Generate and select a cover from the options to see it here</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isSignedIn && savedCovers && savedCovers.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Saved Covers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCovers.map((cover) => (
                <div key={cover._id} className="bg-gray-50 rounded-lg overflow-hidden shadow">
                  <img 
                    src={cover.imageUrl} 
                    alt={cover.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-1">{cover.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">By {cover.author}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {cover.genre}
                      </span>
                      <button 
                        onClick={() => handleDeleteCover(cover._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverGeneratorPage; 