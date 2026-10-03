import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProductImage from '../components/ui/ProductImage';
import { Check, ChevronRight, Edit, Plus } from 'lucide-react';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { items, subtotal, delivery, discount, total } = useCart();
  const { user, addresses, addAddress } = useAuth();
  const navigate = useNavigate();

  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [selectedAddressId, setSelectedAddressId] = useState(addresses?.[0]?.id || null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false
  });

  const deliveryOptions = [
    { id: 'standard', title: 'Standard Delivery', price: total > 999 ? 0 : 49, time: '5-7 days' },
    { id: 'express', title: 'Express Delivery', price: 149, time: '2-3 days' },
    { id: 'sameday', title: 'Same Day Delivery', price: 299, time: 'By 8 PM today' }
  ];
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0].id);

  if (items.length === 0) {
    return (
      <div className="container-main py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleEditStep = (step) => setCurrentStep(step);

  const handleAddAddress = (e) => {
    e.preventDefault();
    const id = Date.now().toString();
    addAddress({ id, ...newAddress });
    setSelectedAddressId(id);
    setShowAddAddress(false);
    setNewAddress({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });
  };

  const steps = [
    { num: 1, title: 'Contact' },
    { num: 2, title: 'Address' },
    { num: 3, title: 'Delivery' },
    { num: 4, title: 'Review' }
  ];

  return (
    <div className="container-main py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-black mb-6">Checkout</h1>
        <div className="flex items-center justify-between max-w-2xl">
          {steps.map((step, index) => (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= step.num ? 'bg-brand-red text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {currentStep > step.num ? <Check size={16} /> : step.num}
                </div>
                <span className={`text-xs mt-2 ${currentStep >= step.num ? 'text-brand-black font-semibold' : 'text-gray-500'}`}>{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${currentStep > step.num ? 'bg-brand-red' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {/* Step 1: Contact */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center"><span className="w-6 h-6 rounded-full bg-brand-black text-white text-sm flex items-center justify-center mr-3">1</span> Contact</h2>
              {currentStep > 1 && (
                <button onClick={() => handleEditStep(1)} className="text-brand-red text-sm font-medium hover:underline flex items-center">
                  <Edit size={14} className="mr-1" /> Edit
                </button>
              )}
            </div>
            {currentStep === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-red focus:border-brand-red outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-red focus:border-brand-red outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-red focus:border-brand-red outline-none" />
                  </div>
                </div>
                <Button onClick={handleNextStep} className="mt-4">Continue</Button>
              </div>
            ) : (
              <div className="text-gray-600 text-sm">
                <p>{contactInfo.name}</p>
                <p>{contactInfo.email} • {contactInfo.phone}</p>
              </div>
            )}
          </div>

          {/* Step 2: Address */}
          <div className={`border border-gray-200 rounded-lg p-6 bg-white shadow-sm ${currentStep < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center"><span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center mr-3 ${currentStep >= 2 ? 'bg-brand-black text-white' : 'bg-gray-200 text-gray-500'}`}>2</span> Address</h2>
              {currentStep > 2 && (
                <button onClick={() => handleEditStep(2)} className="text-brand-red text-sm font-medium hover:underline flex items-center">
                  <Edit size={14} className="mr-1" /> Edit
                </button>
              )}
            </div>
            
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {addresses?.map(addr => (
                    <label key={addr.id} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-brand-red bg-red-50/10' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1 text-brand-red focus:ring-brand-red" />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="font-semibold text-brand-black">{addr.name}</p>
                          {addr.isDefault && <Badge variant="sale">Default</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                        <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-sm text-gray-600 mt-1">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {!showAddAddress ? (
                  <button onClick={() => setShowAddAddress(true)} className="flex items-center text-brand-red text-sm font-medium hover:underline mt-2">
                    <Plus size={16} className="mr-1" /> Add New Address
                  </button>
                ) : (
                  <form onSubmit={handleAddAddress} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                        <input required type="text" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-2 outline-none focus:border-brand-red" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                        <input required type="tel" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-2 outline-none focus:border-brand-red" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 1</label>
                      <input required type="text" value={newAddress.line1} onChange={e => setNewAddress({...newAddress, line1: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-2 outline-none focus:border-brand-red" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 2</label>
                      <input type="text" value={newAddress.line2} onChange={e => setNewAddress({...newAddress, line2: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-2 outline-none focus:border-brand-red" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                        <input required type="text" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-2 outline-none focus:border-brand-red" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                        <input required type="text" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-2 outline-none focus:border-brand-red" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
                        <input required type="text" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-2 outline-none focus:border-brand-red" />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" size="sm">Save Address</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddAddress(false)}>Cancel</Button>
                    </div>
                  </form>
                )}

                <Button onClick={handleNextStep} disabled={!selectedAddressId} className="mt-4">Continue</Button>
              </div>
            )}
            
            {currentStep > 2 && (
              <div className="text-gray-600 text-sm">
                {(() => {
                  const addr = addresses?.find(a => a.id === selectedAddressId);
                  if (!addr) return null;
                  return (
                    <>
                      <p className="font-medium text-brand-black">{addr.name}</p>
                      <p>{addr.line1}, {addr.city} - {addr.pincode}</p>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Step 3: Delivery */}
          <div className={`border border-gray-200 rounded-lg p-6 bg-white shadow-sm ${currentStep < 3 ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center"><span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center mr-3 ${currentStep >= 3 ? 'bg-brand-black text-white' : 'bg-gray-200 text-gray-500'}`}>3</span> Delivery</h2>
              {currentStep > 3 && (
                <button onClick={() => handleEditStep(3)} className="text-brand-red text-sm font-medium hover:underline flex items-center">
                  <Edit size={14} className="mr-1" /> Edit
                </button>
              )}
            </div>

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {deliveryOptions.map(opt => (
                    <div key={opt.id} onClick={() => setSelectedDelivery(opt.id)} className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedDelivery === opt.id ? 'border-brand-red bg-red-50/10' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-brand-black text-sm">{opt.title}</span>
                        {selectedDelivery === opt.id && <Check size={16} className="text-brand-red" />}
                      </div>
                      <p className="text-brand-red font-bold text-sm mb-1">{opt.price === 0 ? 'Free' : formatPrice(opt.price)}</p>
                      <p className="text-xs text-gray-500">{opt.time}</p>
                    </div>
                  ))}
                </div>
                <Button onClick={handleNextStep} className="mt-4">Continue</Button>
              </div>
            )}

            {currentStep > 3 && (
              <div className="text-gray-600 text-sm">
                {(() => {
                  const opt = deliveryOptions.find(o => o.id === selectedDelivery);
                  if (!opt) return null;
                  return <p>{opt.title} — {opt.price === 0 ? 'Free' : formatPrice(opt.price)}</p>;
                })()}
              </div>
            )}
          </div>

          {/* Step 4: Review */}
          <div className={`border border-gray-200 rounded-lg p-6 bg-white shadow-sm ${currentStep < 4 ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="text-xl font-bold flex items-center mb-4"><span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center mr-3 ${currentStep >= 4 ? 'bg-brand-black text-white' : 'bg-gray-200 text-gray-500'}`}>4</span> Review</h2>
            
            {currentStep === 4 && (
              <div>
                <div className="space-y-4 mb-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 border-b border-gray-100 pb-4">
                      <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden">
                        <ProductImage product={item.product} size="sm" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-brand-black text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm">
                  <div className="flex justify-between mb-2"><span className="text-gray-600">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between mb-2"><span className="text-gray-600">Delivery</span><span className="font-medium">{delivery === 0 ? 'Free' : formatPrice(delivery)}</span></div>
                  {discount > 0 && <div className="flex justify-between mb-2 text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                  <div className="flex justify-between mt-3 pt-3 border-t border-gray-200 font-bold text-lg"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
                
                <Button fullWidth size="lg" onClick={() => navigate('/payment')}>Place Order — {formatPrice(total)}</Button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Sidebar Summary */}
        <div className="hidden lg:block w-80">
          <div className="sticky top-24 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h3 className="font-bold text-lg mb-4 pb-4 border-b border-gray-100">Order Summary</h3>
            <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                    <ProductImage product={item.product} size="sm" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-brand-black line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} x {formatPrice(item.product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 text-sm pb-4 border-b border-gray-100">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span>{delivery === 0 ? 'Free' : formatPrice(delivery)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 text-brand-black">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
