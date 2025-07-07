
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search videos..." }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className={`relative bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl sm:rounded-2xl transition-all duration-300 ${isFocused ? 'border-red-500/50 shadow-lg shadow-red-500/20' : 'hover:border-slate-500/50'}`}>
        <div className="flex items-center">
          <div className="pl-3 sm:pl-4">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white placeholder-slate-400 px-2 sm:px-4 py-2 sm:py-3 focus:outline-none text-sm"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 sm:p-2 mr-1 sm:mr-2 hover:bg-slate-700/50 rounded-full transition-colors duration-200"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 hover:text-white" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={!query.trim()}
            className="bg-red-500 hover:bg-red-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-3 sm:px-6 py-2 sm:py-3 rounded-r-xl sm:rounded-r-2xl transition-colors duration-200 text-xs sm:text-sm font-medium"
          >
            <span className="hidden sm:inline">Search</span>
            <Search className="w-4 h-4 sm:hidden" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
