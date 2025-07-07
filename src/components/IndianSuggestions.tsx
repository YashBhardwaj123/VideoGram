
import React from 'react';
import { getIndianSuggestions } from '../services/youtubeApi';

interface IndianSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const IndianSuggestions: React.FC<IndianSuggestionsProps> = ({ onSuggestionClick }) => {
  const suggestions = getIndianSuggestions();

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Popular in India</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 text-orange-300 hover:text-orange-200 rounded-full border border-orange-500/30 hover:border-orange-400/50 transition-all duration-200 text-sm font-medium"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IndianSuggestions;
