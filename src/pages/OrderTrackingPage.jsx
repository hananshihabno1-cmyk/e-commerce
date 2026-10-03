import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById, getStatusColor, getStatusLabel } from '../data/orders';
import { formatPrice } from '../data/products';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import ProductImage from '../components/ui/ProductImage';
import { Package, Truck, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  
  // Try to find the order, or create a mock one if not found
  const [order, setOrder] = useState(() => {
    const existing = getOrderById(orderId);
    if (existing) return existing;
    
    // Mock order for demo purposes if accessed directly
    return {
      id: orderId,
      date: new Date().toISOString(),
      status: 'processing',
      total: 2499,
      paymentMethod: 'UPI',
      items: [
        { id: '1', product: { name: 'Pro Tennis Racket', price: 2499, image: 'https://images.unsplash.com/photo-1617083934555-56d44efcb4c4?auto=format&fit=crop&q=80' }, quantity: 1, size: 'Standard' }
      ],
      address: {
        name: 'Demo User',
        line1: '123 Sports Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    };
  });

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelled, setIsCancelled] = useState(order.status === 'cancelled');

  const steps = [
    { id: 'pending', label: 'Order Placed', desc: 'We have received your order' },
    { id: 'processing', label: 'Confirmed', desc: 'Order has been confirmed' },
    { id: 'packed', label: 'Packed', desc: 'Item is packed and ready for dispatch' },
    { id: 'shipped', label: 'Shipped', desc: 'Handed over to courier partner' },
    { id: 'out-for-delivery', label: 'Out for Delivery', desc: 'Courier is out to deliver your package' },
    { id: 'delivered', label: 'Delivered', desc: 'Package has been delivered' }
  ];

  const getStepIndex = (status) => {
    if (status === 'cancelled') return -1;
    const idx = steps.findIndex(s => s.id === status);
    return idx >= 0 ? idx : 1; // default to confirmed
  };

  const currentStepIndex = getStepIndex(isCancelled ? 'cancelled' : order.status);
  const canCancel = !isCancelled && currentStepIndex < 3; // Before shipped

  const handleCancelOrder = () => {
    setIsCancelled(true);
    setIsCancelModalOpen(false);
    setOrder(prev => ({ ...prev, status: 'cancelled' }));
  };

  const estDate = new Date(order.date);
  estDate.setDate(estDate.getDate() + 5);

  return (
    <div className="container-main py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-black">Track Order</h1>
        <p className="text-sm text-gray-500 mt-1">Order ID: DS-{order.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Delivery Status</h2>
              <Badge variant={isCancelled ? 'out-of-stock' : 'sale'}>
                {isCancelled ? 'Cancelled' : getStatusLabel(order.status)}
              </Badge>
            </div>

            {isCancelled ? (
              <div className="bg-red-50 p-6 rounded-lg text-center">
                <AlertCircle size={40} className="mx-auto text-brand-red mb-3" />
                <h3 className="text-lg font-bold text-brand-red mb-1">Order Cancelled</h3>
                <p className="text-sm text-red-800">Your order has been cancelled successfully.</p>
                <div className="mt-4 pt-4 border-t border-red-200 text-sm font-medium text-red-900">
                  Refund of {formatPrice(order.total)} will be processed in 5-7 business days.
                </div>
              </div>
            ) : (
              <div className="relative pl-4 md:pl-0">
                <div className="space-y-8 md:space-y-0 md:flex md:justify-between relative">
                  {/* Progress Line (Desktop) */}
                  <div className="hidden md:block absolute top-4 left-0 w-full h-1 bg-gray-200 -z-10">
                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }} />
                  </div>

                  {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <div key={step.id} className="relative flex md:flex-col items-start md:items-center">
                        {/* Progress Line (Mobile) */}
                        {index < steps.length - 1 && (
                          <div className={`md:hidden absolute top-8 left-4 w-0.5 h-full -ml-px ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                        
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'} ${isCurrent ? 'ring-4 ring-green-100 shadow-lg' : ''}`}>
                          {isCompleted ? <CheckCircle size={16} /> : <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        
                        <div className="ml-4 md:ml-0 md:mt-3 md:text-center">
                          <h4 className={`text-sm font-bold ${isCompleted ? 'text-brand-black' : 'text-gray-400'}`}>{step.label}</h4>
                          <p className="text-xs text-gray-500 mt-1 md:hidden lg:block max-w-[120px]">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-lg mb-4">Items in this order</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
                  <div className="w-20 h-20 bg-gray-50 rounded flex-shrink-0 overflow-hidden">
                    {item.product.image ? (
                       <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                       <ProductImage product={item.product} size="sm" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-medium text-brand-black">{item.product.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                    <p className="font-bold text-sm mt-1">{formatPrice(item.product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-md mb-4 flex items-center"><MapPin size={18} className="mr-2 text-gray-400" /> Delivery Address</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-brand-black">{order.address.name}</p>
              <p>{order.address.line1}</p>
              <p>{order.address.city}, {order.address.state}</p>
              <p>{order.address.pincode}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-md mb-4 flex items-center"><Package size={18} className="mr-2 text-gray-400" /> Order Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Order Date</span><span className="font-medium">{new Date(order.date).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-medium">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Amount</span><span className="font-bold text-brand-black">{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {canCancel && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-md mb-2">Need Help?</h3>
              <p className="text-xs text-gray-500 mb-4">You can cancel your order before it ships.</p>
              <Button variant="danger" fullWidth onClick={() => setIsCancelModalOpen(true)}>Cancel Order</Button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} title="Cancel Order" size="sm">
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">Please select a reason for cancellation:</p>
          <div className="space-y-3 mb-6">
            {['Found a better price elsewhere', 'Changed my mind', 'Ordered by mistake', 'Delivery takes too long', 'Other'].map(reason => (
              <label key={reason} className="flex items-center text-sm cursor-pointer">
                <input type="radio" name="cancelReason" value={reason} checked={cancelReason === reason} onChange={(e) => setCancelReason(e.target.value)} className="mr-3 text-brand-red focus:ring-brand-red" />
                {reason}
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsCancelModalOpen(false)}>Back</Button>
            <Button variant="danger" className="flex-1" disabled={!cancelReason} onClick={handleCancelOrder}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
