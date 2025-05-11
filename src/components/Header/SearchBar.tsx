
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:text-primary transition-colors duration-200"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
        <div
          className={`absolute right-0 top-full mt-2 transition-all duration-200 overflow-hidden ${
            isExpanded ? 'opacity-100 w-64 h-12' : 'opacity-0 w-0 h-0'
          }`}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full h-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            onBlur={() => {
              if (!searchQuery) setIsExpanded(false);
            }}
            autoFocus={isExpanded}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
