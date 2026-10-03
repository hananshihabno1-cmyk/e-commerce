import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Truck, RotateCcw, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { categories } from '../data/categories';
import { getNewArrivals, getBestSellers, getPopularProducts } from '../data/products';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import PriceDisplay from '../components/ui/PriceDisplay';
import ProductImage from '../components/ui/ProductImage';

const ProductCard = ({ product }) => {
  const { toggleItem, isInWishlist } = useWishlist();
  
  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-brand-dark">
        <ProductImage product={product} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        
        {product.tags?.includes('new') && <Badge variant="new" className="absolute top-2 left-2">NEW</Badge>}
        {product.discount > 0 && <Badge variant="sale" className="absolute top-2 left-2">{product.discount}% OFF</Badge>}
        
        <button 
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation();
            toggleItem(product); 
          }} 
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
        >
          <Heart size={18} className={isInWishlist(product.id) ? "fill-brand-red text-brand-red" : "text-white"} />
        </button>
      </div>
      <h3 className="font-medium text-sm md:text-base text-brand-black line-clamp-2 mb-1">{product.name}</h3>
      <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
      <div className="mt-1">
        <Rating value={product.rating} count={product.reviewCount} size="sm" />
      </div>
    </Link>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const popularProducts = getPopularProducts();
  const newArrivals = getNewArrivals();
  const bestSellers = getBestSellers();

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="bg-brand-black text-white py-16 md:py-24">
        <div className="container-main flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tight">
            PLAY HARD. PLAY BETTER.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
            Everything you need to play better — from the field to the court. Premium gear for serious athletes.
          </p>
          <Button 
            variant="primary" 
            size="xl" 
            onClick={() => navigate('/category/football')}
            className="group"
          >
            Shop Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* 2. Category Showcase */}
      <section className="py-12 md:py-16 container-main">
        <h2 className="text-2xl font-bold mb-8 text-brand-black">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.slug}`}
              className={`product-img-${category.slug} rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[160px] group transition-transform hover:-translate-y-1 shadow-sm hover:shadow-md`}
            >
              <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{category.icon}</span>
              <h3 className="font-bold text-white text-lg drop-shadow-md">{category.name}</h3>
              <span className="text-white/80 text-sm mt-1">{category.productCount || 0} Products</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Popular Products */}
      <section className="py-12 bg-gray-50">
        <div className="container-main">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-brand-black">Popular Products</h2>
            <Link to="/search" className="text-brand-red font-medium hover:underline text-sm md:text-base">View All</Link>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {popularProducts.map(product => (
              <div key={product.id} className="w-[200px] md:w-[240px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Promotional Banner */}
      <section className="py-12 md:py-16 container-main">
        <div className="bg-brand-black rounded-2xl p-8 md:p-12 text-center border-b-4 border-brand-red">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">FLAT 20% OFF on All Footballs</h2>
          <p className="text-gray-300 text-lg mb-8">Use code <span className="font-mono bg-white/20 px-2 py-1 rounded text-white font-bold">DENIO20</span> at checkout</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/category/football')}>
            Shop Footballs
          </Button>
        </div>
      </section>

      {/* 5. New Arrivals */}
      <section className="py-12 container-main">
        <h2 className="text-2xl font-bold mb-6 text-brand-black">New Arrivals</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Best Sellers */}
      <section className="py-12 bg-gray-50">
        <div className="container-main">
          <h2 className="text-2xl font-bold mb-6 text-brand-black">Best Sellers</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Trust Section */}
      <section className="py-12 md:py-16 border-t border-gray-100">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-brand-black">
                <Truck size={32} />
              </div>
              <h3 className="font-bold mb-2">Free Delivery</h3>
              <p className="text-gray-500 text-sm">On orders over ₹999</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-brand-black">
                <RotateCcw size={32} />
              </div>
              <h3 className="font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-500 text-sm">7-Day Returns</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-brand-black">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-bold mb-2">Genuine Products</h3>
              <p className="text-gray-500 text-sm">100% Authentic gear</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-brand-black">
                <Lock size={32} />
              </div>
              <h3 className="font-bold mb-2">Secure Payments</h3>
              <p className="text-gray-500 text-sm">SSL Encrypted checkout</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
