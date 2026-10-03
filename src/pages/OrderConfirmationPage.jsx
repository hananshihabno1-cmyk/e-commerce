import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import Button from '../components/ui/Button';
import { CheckCircle, Package } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  
  // Create a snapshot of the cart to show before clearing
  const [orderSummary] = React.useState({
    items: [...items],
    total
  });

  useEffect(() => {
    // Clear cart on mount (only once)
    if (items.length > 0) {
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 5);

  return (
    <div className="container-main py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-2xl w-full text-center relative overflow-hidden">
        {/* Confetti effect using simple CSS/emoji */}
        <div className="absolute inset-0 pointer-events-none flex justify-around animate-fade-in opacity-50 text-2xl">
          <span className="animate-slide-down" style={{ animationDelay: '0s' }}>🎉</span>
          <span className="animate-slide-down" style={{ animationDelay: '0.2s' }}>✨</span>
          <span className="animate-slide-down" style={{ animationDelay: '0.4s' }}>🎊</span>
          <span className="animate-slide-down" style={{ animationDelay: '0.1s' }}>🌟</span>
          <span className="animate-slide-down" style={{ animationDelay: '0.3s' }}>🎉</span>
        </div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-brand-black mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-8">Thank you for your purchase. Your order ID is <span className="font-bold text-brand-black">DS-{orderId}</span></p>

          <div className="bg-gray-50 rounded-xl p-6 text-left mb-8">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Package size={20} className="mr-2 text-brand-red" />
              Order Summary
            </h3>
            
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
              {orderSummary.items.length > 0 ? (
                orderSummary.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 truncate mr-4">{item.quantity} x {item.product.name}</span>
                    <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Items have been processed.</p>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center font-bold text-lg">
              <span>Total Paid</span>
              <span>{formatPrice(orderSummary.total)}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-blue-800 text-sm font-medium">
            Expected Delivery: {estimatedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate(`/order-tracking/${orderId}`)}>Track Order</Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/')}>Continue Shopping</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
