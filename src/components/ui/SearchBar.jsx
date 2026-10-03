import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';

export default function SearchBar({ isMobile = false, onClose }) {
  const navigate = useNavigate();
  const { query, setQuery, suggestions, results, isOpen, setIsOpen, clearSearch } = useSearch();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isMobile && inputRef.current) inputRef.current.focus();
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  const handleSuggestionClick = (term) => {
    setQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <div ref={containerRef} className={`relative ${isMobile ? 'w-full' : 'w-full max-w-md'}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for products..."
          className="w-full pl-10 pr-10 py-2.5 bg-gray-100 border border-transparent rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {isOpen && (query.length >= 1) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden animate-slide-down">
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">Suggestions</p>
              {suggestions.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSuggestionClick(term)}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-left"
                >
                  <TrendingUp size={14} className="text-gray-400 shrink-0" />
                  {term}
                </button>
              ))}
            </div>
          )}
          {results.length > 0 && (
            <div className="border-t border-gray-100 p-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">
                Products ({results.length})
              </p>
              {results.slice(0, 4).map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    navigate(`/product/${product.id}`);
                    setIsOpen(false);
                    clearSearch();
                    if (onClose) onClose();
                  }}
                  className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-md transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-md product-img-${product.category} flex items-center justify-center`}>
                    <span className="text-white/50 text-xs font-bold">{product.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-brand-red font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </button>
              ))}
              {results.length > 4 && (
                <button
                  onClick={handleSubmit}
                  className="w-full text-center text-sm text-brand-red font-semibold py-2 hover:bg-red-50 rounded-md transition-colors"
                >
                  View all {results.length} results →
                </button>
              )}
            </div>
          )}
          {query.length >= 2 && results.length === 0 && suggestions.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">No results found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
