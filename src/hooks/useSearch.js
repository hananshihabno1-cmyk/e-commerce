import { useState, useMemo, useCallback } from 'react';
import { searchProducts } from '../data/products';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return searchProducts(query);
  }, [query]);

  const suggestions = useMemo(() => {
    if (query.trim().length < 1) return [];
    const q = query.toLowerCase().trim();
    const allTerms = [
      'Football', 'Cricket', 'Badminton', 'Tennis',
      'Jerseys', 'Sports Bag', 'Shin Guards', 'Training',
      'Boots', 'Racket', 'Shuttlecock', 'Bat', 'Gloves',
      'Trophy', 'Medal', 'Shorts', 'T-Shirt', 'Track Pants',
      'Water Bottle', 'Goalkeeper', 'Socks', 'Helmet',
    ];
    return allTerms.filter((t) => t.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setIsOpen(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    suggestions,
    isOpen,
    setIsOpen,
    clearSearch,
    resultCount: results.length,
  };
}
