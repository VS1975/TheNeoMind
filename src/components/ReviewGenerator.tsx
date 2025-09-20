import React, { useState } from 'react';

interface ReviewGeneratorProps {
  onGenerate: () => Promise<string>;
}

const ReviewGenerator: React.FC<ReviewGeneratorProps> = ({ onGenerate }) => {
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await onGenerate();
      setReview(result);
    } catch (err) {
      setError('Failed to generate review. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded transition duration-300 disabled:bg-indigo-400"
      >
        {loading ? 'Generating...' : 'Generate Weekly Review'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {review && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Your Weekly Summary:</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{review}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewGenerator;
