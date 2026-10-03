import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, X, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

import Button from '../components/ui/Button';
import PriceDisplay from '../components/ui/PriceDisplay';
import ProductImage from '../components/ui/ProductImage';

const WishlistPage = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { addNotification } = useNotification();

  const handleAddToCart = (product) => {
    // Default size and color selection for simplicity in wishlist
    const size = product.sizes?.length > 0 ? product.sizes[0] : null;
    const color = product.colors?.length > 0 ? product.colors[0].name : null;
    
    addItem(product, size, color, 1);
    addNotification('success', 'Added to cart');
  };

  if (items.length === 0) {
    return (
      <div className="container-main py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Heart size={48} className="text-brand-red" />
        </div>
        <h1 className="text-3xl font-bold text-brand-black mb-4">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">Save items you love here and buy them later when you're ready.</p>
        <Link to="/">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-brand-black">My Wishlist</h1>
          <span className="bg-gray-100 text-brand-black px-3 py-1 rounded-full text-sm font-medium">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {items.map((product) => (
            <div key={product.id} className="group flex flex-col relative border border-gray-100 rounded-xl hover:shadow-md transition-shadow p-3 sm:p-4 animate-fade-in bg-white">
              <button 
                onClick={() => { removeItem(product.id); addNotification('success', 'Removed from wishlist'); }}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition-colors"
                title="Remove from wishlist"
              >
                <X size={16} />
              </button>

              <Link to={`/product/${product.id}`} className="relative aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden mb-4 block">
                <ProductImage product={product} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
              </Link>

              <div className="flex-1 flex flex-col">
                <Link to={`/product/${product.id}`} className="font-bold text-brand-black text-sm sm:text-base line-clamp-2 hover:text-brand-red mb-1">
                  {product.name}
                </Link>
                <div className="mb-3 mt-auto pt-2">
                  <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
                </div>
                
                <div className="mb-4">
                  {product.stock === 'out-of-stock' ? (
                    <span className="text-xs font-medium text-red-500">Out of Stock</span>
                  ) : (
                    <span className="text-xs font-medium text-green-600">In Stock</span>
                  )}
                </div>

                <Button 
                  variant="primary" 
                  fullWidth 
                  disabled={product.stock === 'out-of-stock'}
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} /> <span className="hidden sm:inline">Add to Cart</span><span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
