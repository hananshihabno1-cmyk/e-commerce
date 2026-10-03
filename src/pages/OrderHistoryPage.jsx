import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, ArrowRight } from 'lucide-react';
import { mockOrders, getStatusColor, getStatusLabel } from '../data/orders';
import { formatPrice } from '../data/products';
import ProductImage from '../components/ui/ProductImage';
import Button from '../components/ui/Button';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  // In a real app, this would filter for the current user's orders
  const orders = mockOrders;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container-main">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-brand-red">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/account" className="hover:text-brand-red">Account</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900 font-medium">Orders</span>
        </div>

        <h1 className="text-3xl font-bold text-brand-black mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-brand-black mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start exploring our products!</p>
            <Link to="/">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                onClick={() => navigate(`/order-tracking/${order.id}`)}
                className="bg-white rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-gray-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-brand-black">{order.id}</span>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="font-bold text-brand-black text-lg">{formatPrice(order.total)}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                          <ProductImage product={item.product} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-sm font-medium text-brand-black line-clamp-1 w-32">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center text-sm font-medium text-gray-500">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-brand-red font-medium text-sm">
                    View Details <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
