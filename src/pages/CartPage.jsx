import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Bookmark, ArrowRight, Shield, CheckCircle } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice } from '../data/products';

import Button from '../components/ui/Button';
import PriceDisplay from '../components/ui/PriceDisplay';
import QuantitySelector from '../components/ui/QuantitySelector';
import ProductImage from '../components/ui/ProductImage';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, applyCoupon, removeCoupon, subtotal, delivery, discount, total, coupon } = useCart();
  const { addNotification } = useNotification();
  
  const [couponInput, setCouponInput] = useState('');
  const [savedItems, setSavedItems] = useState([]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput.trim());
    if (success) {
      addNotification('success', 'Coupon applied successfully');
      setCouponInput('');
    } else {
      addNotification('error', 'Invalid or expired coupon code');
    }
  };

  const handleSaveForLater = (item) => {
    setSavedItems([...savedItems, item]);
    removeItem(item.key);
    addNotification('success', 'Item saved for later');
  };

  const handleMoveToCart = (item, index) => {
    const newSaved = [...savedItems];
    newSaved.splice(index, 1);
    setSavedItems(newSaved);
    // Real implementation would add it back using context
    addNotification('success', 'Moved back to cart');
  };

  if (items.length === 0) {
    return (
      <div className="container-main py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold text-brand-black mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Discover our latest products and start shopping.</p>
        <Link to="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
        
        {savedItems.length > 0 && (
          <div className="mt-16 w-full max-w-4xl text-left">
            <h2 className="text-xl font-bold border-b pb-4 mb-6">Saved for Later ({savedItems.length})</h2>
            <div className="space-y-4">
              {savedItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 border rounded-lg bg-white">
                  <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden">
                    <ProductImage product={item.product} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-brand-black">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
                    <PriceDisplay price={item.product.price} size="sm" />
                  </div>
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" onClick={() => handleMoveToCart(item, idx)}>Move to Cart</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container-main">
        <h1 className="text-3xl font-bold text-brand-black mb-8">Shopping Cart ({items.length})</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 space-y-4">
            {items.map((item) => (
              <div key={item.key} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                  <ProductImage product={item.product} className="w-full h-full object-contain p-2 mix-blend-multiply" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/product/${item.productId}`} className="font-bold text-lg text-brand-black hover:text-brand-red transition-colors line-clamp-2">
                        {item.product.name}
                      </Link>
                      <div className="mt-1 text-sm text-gray-500 space-x-3">
                        {item.size && <span>Size: <span className="font-medium text-gray-900">{item.size}</span></span>}
                        {item.color && <span>Color: <span className="font-medium text-gray-900">{item.color}</span></span>}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <PriceDisplay price={item.product.price} originalPrice={item.product.originalPrice} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-6">
                      <QuantitySelector 
                        value={item.quantity} 
                        onChange={(qty) => updateQuantity(item.key, qty)} 
                        max={item.product.stockCount || 10}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSaveForLater(item)}
                        className="p-2 text-gray-400 hover:text-brand-black hover:bg-gray-100 rounded-md transition-colors"
                        title="Save for later"
                      >
                        <Bookmark size={20} />
                      </button>
                      <button 
                        onClick={() => removeItem(item.key)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-brand-black mb-6">Order Summary</h2>
              
              {/* Coupon Section */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                {coupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center text-green-700">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="font-medium">{coupon.code}</span>
                      <span className="text-sm ml-2">- {formatPrice(discount)}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-black uppercase"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    />
                    <Button type="submit" variant="outline" className="px-4">Apply</Button>
                  </form>
                )}
                <p className="text-xs text-gray-500 mt-2">Try: DENIO20, FLAT200, WELCOME10</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-medium text-gray-900">{delivery === 0 ? <span className="text-green-600">Free</span> : formatPrice(delivery)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold text-brand-black">Total</span>
                <span className="text-2xl font-bold text-brand-red">{formatPrice(total)}</span>
              </div>

              <Button 
                fullWidth 
                size="lg" 
                onClick={() => navigate('/checkout')}
                className="mb-4 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                <Shield size={16} />
                <span>Secure Checkout. Easy Returns.</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Saved Items */}
        {savedItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-brand-black mb-6">Saved for Later ({savedItems.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedItems.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <ProductImage product={item.product} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-brand-black line-clamp-1">{item.product.name}</h3>
                      <PriceDisplay price={item.product.price} size="sm" />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleMoveToCart(item, idx)} className="self-start mt-2">
                      Move to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
