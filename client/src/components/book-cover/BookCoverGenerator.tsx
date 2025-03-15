import React, { useState } from 'react';
import CoverGeneratorService from '../../services/CoverGeneratorService';

interface BookCoverGeneratorProps {
  onCoverGenerated: (imageUrl: string) => void;
}

const BookCoverGenerator: React.FC<BookCoverGeneratorProps> = ({ onCoverGenerated }) => {
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [genre, setGenre] = useState<string>('fantasy');
  const [description, setDescription] = useState<string>('');
  const [style, setStyle] = useState<string>('modern');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedCovers, setGeneratedCovers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const generateCover = async () => {
    if (!title) {
      setError('Please enter a book title');
      return;
    }
    
    setError(null);
    setIsGenerating(true);
    
    try {
      // Use our service to generate covers
      const covers = await CoverGeneratorService.generateCover(
        title,
        author,
        genre,
        description,
        style
      );
      
      setGeneratedCovers(covers);
    } catch (err) {
      setError('Failed to generate book covers. Please try again.');
      console.error('Error generating book covers:', err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSelectCover = (imageUrl: string) => {
    onCoverGenerated(imageUrl);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Book Cover Generator</h3>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Book Title*
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            placeholder="Enter book title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Author Name
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            placeholder="Enter author name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Genre
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="fantasy">Fantasy</option>
            <option value="sci-fi">Science Fiction</option>
            <option value="mystery">Mystery/Thriller</option>
            <option value="romance">Romance</option>
            <option value="horror">Horror</option>
            <option value="non-fiction">Non-Fiction</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Brief Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            placeholder="Enter a brief description of your book"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cover Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="modern">Modern</option>
            <option value="minimalist">Minimalist</option>
            <option value="vintage">Vintage</option>
            <option value="illustrated">Illustrated</option>
            <option value="photographic">Photographic</option>
          </select>
        </div>
      </div>
      
      <button
        onClick={generateCover}
        disabled={isGenerating}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed mb-6"
      >
        {isGenerating ? 'Generating Covers...' : 'Generate Covers'}
      </button>
      
      {generatedCovers.length > 0 && (
        <div>
          <h4 className="text-lg font-medium mb-3">Generated Covers</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedCovers.map((cover, index) => (
              <div key={index} className="relative group">
                <img 
                  src={cover} 
                  alt={`Book cover option ${index + 1}`} 
                  className="w-full h-auto rounded-md shadow-sm hover:shadow-md transition-shadow"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-md">
                  <button
                    onClick={() => handleSelectCover(cover)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCoverGenerator;
