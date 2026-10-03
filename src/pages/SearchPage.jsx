import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Heart, ChevronDown } from 'lucide-react';
import { searchProducts, sortProducts, getPopularProducts } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import PriceDisplay from '../components/ui/PriceDisplay';
import ProductImage from '../components/ui/ProductImage';
import SearchBar from '../components/ui/SearchBar';

const ProductCard = ({ product }) => {
  const { toggleItem, isInWishlist } = useWishlist();
  
  return (
    <Link to={`/product/${product.id}`} className="group block h-full flex flex-col">
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gray-100">
        <ProductImage product={product} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        
        {product.tags?.includes('new') && <Badge variant="new" className="absolute top-2 left-2">NEW</Badge>}
        {product.discount > 0 && <Badge variant="sale" className="absolute top-2 left-2">{product.discount}% OFF</Badge>}
        
        <button 
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation();
            toggleItem(product); 
          }} 
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 hover:bg-white border border-gray-200 transition-colors"
        >
          <Heart size={18} className={isInWishlist(product.id) ? "fill-brand-red text-brand-red" : "text-gray-600"} />
        </button>
      </div>
      <h3 className="font-medium text-sm md:text-base text-brand-black line-clamp-2 mb-1 flex-grow">{product.name}</h3>
      <div className="mt-auto">
        <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
        <div className="mt-1">
          <Rating value={product.rating} count={product.reviewCount} size="sm" />
        </div>
      </div>
    </Link>
  );
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [sortOption, setSortOption] = useState('popular');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(query);
  }, [query]);

  const sortedResults = useMemo(() => {
    return sortProducts(searchResults, sortOption);
  }, [searchResults, sortOption]);

  const popularProducts = useMemo(() => getPopularProducts().slice(0, 8), []);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-black py-8 md:py-12">
        <div className="container-main text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Search DENIO SPORTS</h1>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="container-main py-8 md:py-12">
        {query ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-medium">
                Search results for <span className="font-bold">"{query}"</span>
                <span className="text-gray-500 text-sm ml-2">({sortedResults.length} found)</span>
              </h2>
              
              {sortedResults.length > 0 && (
                <div className="relative w-full sm:w-auto">
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 rounded-md text-sm font-medium focus:outline-none focus:border-brand-black"
                  >
                    <option value="popular">Relevance</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              )}
            </div>

            {sortedResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {sortedResults.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-brand-black">No results found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  We couldn't find anything matching "{query}". Try checking your spelling or using more general terms.
                </p>
                
                <div className="mt-12 text-left">
                  <h4 className="text-lg font-bold mb-4 border-b pb-2">Popular right now</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {popularProducts.slice(0, 4).map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="pt-4">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Trending Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {popularProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
