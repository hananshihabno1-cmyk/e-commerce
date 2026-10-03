import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingCart, Share2, ChevronRight, Star, 
  CheckCircle, Truck, Package, RotateCcw, AlertCircle, X
} from 'lucide-react';

import { 
  getProductById, getRelatedProducts, formatPrice 
} from '../data/products';
import { getReviewsForProduct, getAverageRating, getRatingDistribution } from '../data/reviews';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';

import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import PriceDisplay from '../components/ui/PriceDisplay';
import QuantitySelector from '../components/ui/QuantitySelector';
import Modal from '../components/ui/Modal';
import ProductImage from '../components/ui/ProductImage';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selections
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // Contexts
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addNotification } = useNotification();
  
  // Modals
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  
  // Reviews & Related
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Sticky Bottom Bar
  const addToCartRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = () => {
      setLoading(true);
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.sizes?.length > 0) setSelectedSize(foundProduct.sizes[0]);
        if (foundProduct.colors?.length > 0) setSelectedColor(foundProduct.colors[0]);
        setMainImageIndex(0);
        setQuantity(1);
        setActiveTab('description');
        
        setReviews(getReviewsForProduct(id));
        setRelatedProducts(getRelatedProducts(id, 8));
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (!addToCartRef.current) return;
      const rect = addToCartRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      setShowStickyBar(!isVisible && rect.top < 0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [product]);

  if (loading) {
    return <div className="container-main py-20 flex justify-center"><div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!product) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find the product you're looking for.</p>
        <Link to="/"><Button>Back to Home</Button></Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      addNotification('error', 'Please select a size');
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      addNotification('error', 'Please select a color');
      return;
    }
    
    addItem(product, selectedSize, selectedColor?.name, quantity);
    addNotification('success', 'Added to cart');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const submitReview = (e) => {
    e.preventDefault();
    const newReview = {
      id: `rev-${Date.now()}`,
      userId: 'u-current',
      userName: 'Current User',
      rating: reviewForm.rating,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      title: reviewForm.title,
      comment: reviewForm.comment,
      helpfulCount: 0
    };
    setReviews([newReview, ...reviews]);
    setIsReviewModalOpen(false);
    setReviewForm({ rating: 5, title: '', comment: '' });
    addNotification('success', 'Review submitted successfully');
  };

  const inWishlist = isInWishlist(product.id);
  const avgRating = getAverageRating(reviews);
  const ratingDist = getRatingDistribution(reviews);
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + (product.deliveryDays || 3));
  const deliveryDateStr = estimatedDelivery.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="container-main py-4">
        <div className="flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="hover:text-brand-red">Home</Link>
          <ChevronRight size={14} className="mx-2 flex-shrink-0" />
          <Link to={`/category/${product.category}`} className="hover:text-brand-red capitalize">{product.category.replace('-', ' ')}</Link>
          <ChevronRight size={14} className="mx-2 flex-shrink-0" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto scrollbar-hide">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx} 
                  onClick={() => setMainImageIndex(idx)}
                  className={`w-20 h-20 flex-shrink-0 rounded-lg cursor-pointer border-2 overflow-hidden ${mainImageIndex === idx ? 'border-brand-red' : 'border-transparent'}`}
                >
                  <ProductImage product={product} index={idx} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-1 relative bg-gray-50 rounded-xl overflow-hidden aspect-square lg:aspect-auto lg:h-[600px]">
              <ProductImage product={product} size="lg" index={mainImageIndex} className="w-full h-full object-contain mix-blend-multiply p-8" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discount > 0 && <Badge variant="discount">-{product.discount}%</Badge>}
                {product.tags?.includes('bestseller') && <Badge variant="bestseller">Best Seller</Badge>}
                {product.tags?.includes('new') && <Badge variant="new">New</Badge>}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-black mb-2">{product.name}</h1>
            
            <div 
              className="flex items-center gap-4 mb-4 cursor-pointer" 
              onClick={() => { document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' }); }}
            >
              <Rating value={avgRating} count={reviews.length} showCount />
            </div>

            <div className="mb-6">
              <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="lg" />
              <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="flex items-center gap-2 mb-6">
              {product.stock === 'in-stock' && <><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div><span className="text-sm font-medium text-green-600">In Stock</span></>}
              {product.stock === 'low-stock' && <><div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div><span className="text-sm font-medium text-orange-600">Only {product.stockCount} left in stock</span></>}
              {product.stock === 'out-of-stock' && <><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="text-sm font-medium text-red-600">Out of Stock</span></>}
            </div>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-brand-black">Size</h3>
                  <button onClick={() => setIsSizeGuideOpen(true)} className="text-sm text-brand-red font-medium underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 px-4 rounded-md border font-medium transition-colors ${selectedSize === size ? 'border-brand-red bg-brand-red text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-brand-black mb-3">Color: <span className="text-gray-600 font-normal">{selectedColor?.name}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all \${selectedColor?.name === color.name ? 'border-brand-red' : 'border-transparent'}`}
                      title={color.name}
                    >
                      <div className="w-full h-full rounded-full border border-gray-200" style={{ backgroundColor: color.hex }}></div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8 flex items-center gap-4">
              <h3 className="font-semibold text-brand-black">Quantity</h3>
              <QuantitySelector 
                value={quantity} 
                min={1} 
                max={product.stockCount || 10} 
                onChange={setQuantity} 
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8" ref={addToCartRef}>
              <Button 
                variant="primary" 
                size="lg" 
                className="flex-1"
                disabled={product.stock === 'out-of-stock'}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} className="mr-2" /> Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 border-brand-black text-brand-black hover:bg-brand-black hover:text-white"
                disabled={product.stock === 'out-of-stock'}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <div className="flex gap-2 justify-center sm:justify-start">
                <button 
                  onClick={() => { toggleItem(product); addNotification('success', inWishlist ? 'Removed from wishlist' : 'Added to wishlist'); }}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border \${inWishlist ? 'border-brand-red text-brand-red bg-red-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <Heart size={20} className={inWishlist ? 'fill-current' : ''} />
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="text-gray-500 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-brand-black">{product.freeDelivery ? 'Free Delivery' : 'Delivery: ₹49'}</p>
                  <p className="text-sm text-gray-500">Get it by {deliveryDateStr}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="text-gray-500 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-brand-black">14 Days Return Policy</p>
                  <p className="text-sm text-gray-500">Hassle-free returns and exchanges</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="text-gray-500 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-brand-black">Authentic Products</p>
                  <p className="text-sm text-gray-500">100% genuine guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Tabs */}
      <div className="container-main mt-16">
        <div className="border-b border-gray-200 flex gap-8 overflow-x-auto scrollbar-hide">
          {['description', 'highlights', 'specifications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-medium capitalize whitespace-nowrap transition-colors border-b-2 \${activeTab === tab ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-600">
              <p>{product.description}</p>
              {/* Fake extended description */}
              <p className="mt-4">Engineered for performance, this product features advanced materials and construction designed to help you excel. Whether you're training hard or competing at the highest level, you can trust in the quality and durability that DENIO SPORTS is known for.</p>
            </div>
          )}
          {activeTab === 'highlights' && (
            <ul className="space-y-2">
              {product.highlights?.map((hl, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <span>{hl}</span>
                </li>
              )) || <p className="text-gray-500">No highlights available.</p>}
            </ul>
          )}
          {activeTab === 'specifications' && (
            <div className="max-w-2xl border border-gray-200 rounded-lg overflow-hidden">
              {product.specifications && Object.entries(product.specifications).map(([key, value], i) => (
                <div key={key} className={`flex border-b border-gray-100 last:border-0 \${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="w-1/3 p-4 font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="w-2/3 p-4 text-gray-600">{value}</div>
                </div>
              ))}
              {!product.specifications && <p className="p-4 text-gray-500">No specifications available.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div id="reviews-section" className="container-main mt-16 pt-16 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-brand-black">Customer Reviews</h2>
          <Button onClick={() => setIsReviewModalOpen(true)}>Write a Review</Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Rating Summary */}
          <div className="w-full lg:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl font-bold text-brand-black">{avgRating}</div>
              <div>
                <Rating value={avgRating} size="lg" />
                <p className="text-sm text-gray-500 mt-1">Based on {reviews.length} reviews</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDist[stars] || 0;
                const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-sm">
                    <div className="w-10 text-gray-600 flex items-center">{stars} <Star size={12} className="ml-1 fill-current" /></div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-red rounded-full" style={{ width: `\${percent}%` }}></div>
                    </div>
                    <div className="w-10 text-right text-gray-500">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review List */}
          <div className="w-full lg:w-2/3 space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Rating value={review.rating} />
                      <h4 className="font-semibold text-brand-black mt-1">{review.title}</h4>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{review.comment}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-900">{review.userName}</span>
                    {review.verifiedPurchase && (
                      <span className="flex items-center text-green-600"><CheckCircle size={12} className="mr-1" /> Verified Buyer</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container-main mt-20">
          <h2 className="text-2xl font-bold text-brand-black mb-8">You Might Also Like</h2>
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {relatedProducts.map(rp => (
              <div key={rp.id} className="w-64 flex-shrink-0 group cursor-pointer" onClick={() => navigate(`/product/\${rp.id}`)}>
                <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                  <ProductImage product={rp} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="font-medium text-brand-black truncate">{rp.name}</h3>
                <PriceDisplay price={rp.price} originalPrice={rp.originalPrice} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 md:hidden flex items-center justify-between animate-slide-up">
          <div>
            <p className="text-xs text-gray-500">Total Price</p>
            <PriceDisplay price={product.price} />
          </div>
          <Button 
            disabled={product.stock === 'out-of-stock'}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      )}

      {/* Size Guide Modal */}
      <Modal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} title="Size Guide" size="md">
        <div className="p-4">
          <p className="text-gray-600 mb-4">Measurements are in inches. This is a generic guide. Fits may vary by style or personal preference.</p>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 border">Size</th>
                <th className="p-3 border">Chest</th>
                <th className="p-3 border">Waist</th>
                <th className="p-3 border">Hips</th>
              </tr>
            </thead>
            <tbody>
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz, i) => (
                <tr key={sz}>
                  <td className="p-3 border font-medium">{sz}</td>
                  <td className="p-3 border">{36 + i * 2}-{38 + i * 2}</td>
                  <td className="p-3 border">{29 + i * 2}-{31 + i * 2}</td>
                  <td className="p-3 border">{37 + i * 2}-{39 + i * 2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Write a Review">
        <form onSubmit={submitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className="text-2xl focus:outline-none"
                >
                  <Star className={star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"
              value={reviewForm.title}
              onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
              placeholder="Summary of your review"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
            <textarea 
              required
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="What did you like or dislike?"
            ></textarea>
          </div>
          <Button type="submit" fullWidth>Submit Review</Button>
        </form>
      </Modal>

    </div>
  );
};

export default ProductPage;
