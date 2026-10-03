import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, Heart, ChevronDown } from 'lucide-react';
import { getCategoryBySlug, getAllSubcategories } from '../data/categories';
import { getProductsByCategory, filterProducts, sortProducts } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import PriceDisplay from '../components/ui/PriceDisplay';
import ProductImage from '../components/ui/ProductImage';
import Modal from '../components/ui/Modal';

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

const CategoryPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('popular');
  const [filters, setFilters] = useState({
    subcategories: [],
    minPrice: '',
    maxPrice: '',
    minRating: 0,
    inStockOnly: false,
    brands: []
  });

  useEffect(() => {
    const cat = getCategoryBySlug(slug);
    if (cat) {
      setCategory(cat);
      setProducts(getProductsByCategory(slug));
      setSubcategories(getAllSubcategories(slug));
    }
  }, [slug]);

  // Extract all unique brands from category products for the filter
  const allBrands = useMemo(() => {
    if (!products.length) return [];
    return [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products.length) return [];
    
    // Apply filters
    const filtered = filterProducts(products, filters);
    
    // Apply sort
    return sortProducts(filtered, sortOption);
  }, [products, filters, sortOption]);

  const handleSubcategoryToggle = (subSlug) => {
    setFilters(prev => ({
      ...prev,
      subcategories: prev.subcategories.includes(subSlug)
        ? prev.subcategories.filter(s => s !== subSlug)
        : [...prev.subcategories, subSlug]
    }));
  };

  const handleBrandToggle = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands?.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...(prev.brands || []), brand]
    }));
  };

  const clearFilters = () => {
    setFilters({
      subcategories: [],
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      inStockOnly: false,
      brands: []
    });
  };

  if (category === null && products.length === 0) {
    return (
      <div className="container-main py-20 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-500 mb-6">The category you are looking for does not exist.</p>
        <Link to="/">
          <Button variant="primary">Return to Home</Button>
        </Link>
      </div>
    );
  }

  if (!category) return <div className="p-8 text-center">Loading...</div>;

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-brand-red hover:underline">Clear All</button>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-medium mb-3">Availability</h4>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={filters.inStockOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
            className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
          />
          <span className="text-sm">In Stock Only</span>
        </label>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-medium mb-3">Price (₹)</h4>
        <div className="flex items-center space-x-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-brand-red"
          />
          <span className="text-gray-400">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-brand-red"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-medium mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3].map(rating => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                className="text-brand-red focus:ring-brand-red"
              />
              <div className="flex items-center">
                <Rating value={rating} size="sm" showCount={false} />
                <span className="text-sm ml-1">& Up</span>
              </div>
            </label>
          ))}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="radio" 
              name="rating"
              checked={filters.minRating === 0}
              onChange={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
              className="text-brand-red focus:ring-brand-red"
            />
            <span className="text-sm ml-1">Any Rating</span>
          </label>
        </div>
      </div>

      {/* Brands */}
      {allBrands.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Brands</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {allBrands.map(brand => (
              <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.brands?.includes(brand) || false}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Category Header */}
      <div className={`product-img-${category.slug} py-12 md:py-16`}>
        <div className="container-main">
          <div className="flex items-center space-x-4 mb-4 text-white/80 text-sm">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">{category.name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white flex items-center">
            {category.icon && <span className="mr-3">{category.icon}</span>}
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/90 mt-4 max-w-2xl text-lg">{category.description}</p>
          )}
        </div>
      </div>

      <div className="container-main py-8">
        {/* Subcategories (Chips) */}
        {subcategories.length > 0 && (
          <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide mb-6 border-b border-gray-100">
            <button
              onClick={() => setFilters(prev => ({ ...prev, subcategories: [] }))}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                filters.subcategories.length === 0 
                  ? 'bg-brand-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {subcategories.map(sub => (
              <button
                key={sub.slug}
                onClick={() => handleSubcategoryToggle(sub.slug)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  filters.subcategories.includes(sub.slug)
                    ? 'bg-brand-black text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Toolbar (Mobile Filter button, Sort) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="text-gray-600 text-sm font-medium">
            Showing {filteredAndSortedProducts.length} products
          </div>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="lg:hidden flex-1 sm:flex-none justify-center"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
            
            <div className="relative flex-1 sm:flex-none">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 rounded-md text-sm font-medium focus:outline-none focus:border-brand-black"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                <Filter size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria.</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filters" size="full" className="lg:hidden">
        <div className="p-4 pb-24">
          <FilterSidebar />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <Button variant="primary" fullWidth onClick={() => setIsFilterOpen(false)}>
            Show {filteredAndSortedProducts.length} Results
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryPage;
