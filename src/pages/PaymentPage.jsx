import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { generateOrderId } from '../data/orders';
import Button from '../components/ui/Button';
import { CreditCard, Smartphone, Building2, Shield, Loader2, AlertCircle } from 'lucide-react';

export default function PaymentPage() {
  const { total, clearCart } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  const handlePayment = (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    setPaymentFailed(false);

    setTimeout(() => {
      setIsProcessing(false);
      const isSuccess = Math.random() < 0.8;
      
      if (isSuccess) {
        const orderId = generateOrderId();
        navigate(`/order-confirmation/${orderId}`);
      } else {
        setPaymentFailed(true);
      }
    }, 2000);
  };

  if (isProcessing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center container-main">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-sm w-full">
          <Loader2 size={48} className="mx-auto text-brand-red animate-spin mb-4" />
          <h2 className="text-xl font-bold mb-2">Processing Payment...</h2>
          <p className="text-sm text-gray-500 mb-6">Please do not close this window or click back.</p>
          <div className="flex items-center justify-center text-xs text-gray-400 font-medium">
            <Shield size={14} className="mr-1" /> Secured by Razorpay
          </div>
        </div>
      </div>
    );
  }

  if (paymentFailed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center container-main">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-brand-red" />
          </div>
          <h2 className="text-xl font-bold mb-2">Payment Failed</h2>
          <p className="text-sm text-gray-600 mb-6">Your transaction could not be completed. No money was deducted.</p>
          <div className="space-y-3">
            <Button fullWidth onClick={() => setPaymentFailed(false)}>Retry Payment</Button>
            <Button fullWidth variant="outline" onClick={() => navigate('/cart')}>Back to Cart</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-12 max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-brand-dark text-white p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-300 mb-1">Amount to Pay</p>
            <h2 className="text-3xl font-bold">{formatPrice(total)}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1 flex items-center justify-end"><Shield size={12} className="mr-1" /> DEMO MODE</p>
            <p className="text-sm font-semibold">Razorpay</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Tabs Sidebar */}
          <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200">
            <button onClick={() => setActiveTab('upi')} className={`w-full flex items-center p-4 text-left text-sm font-medium transition-colors ${activeTab === 'upi' ? 'bg-white border-l-4 border-brand-red text-brand-red' : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'}`}>
              <Smartphone size={18} className="mr-3" /> UPI
            </button>
            <button onClick={() => setActiveTab('card')} className={`w-full flex items-center p-4 text-left text-sm font-medium transition-colors ${activeTab === 'card' ? 'bg-white border-l-4 border-brand-red text-brand-red' : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'}`}>
              <CreditCard size={18} className="mr-3" /> Card
            </button>
            <button onClick={() => setActiveTab('netbanking')} className={`w-full flex items-center p-4 text-left text-sm font-medium transition-colors ${activeTab === 'netbanking' ? 'bg-white border-l-4 border-brand-red text-brand-red' : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'}`}>
              <Building2 size={18} className="mr-3" /> Net Banking
            </button>
            <button onClick={() => setActiveTab('wallet')} className={`w-full flex items-center p-4 text-left text-sm font-medium transition-colors ${activeTab === 'wallet' ? 'bg-white border-l-4 border-brand-red text-brand-red' : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'}`}>
              <Smartphone size={18} className="mr-3" /> Wallet
            </button>
          </div>

          {/* Tab Content */}
          <div className="w-full md:w-2/3 p-6 md:p-8">
            {activeTab === 'upi' && (
              <form onSubmit={handlePayment}>
                <h3 className="font-bold text-lg mb-4">Pay using UPI</h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter UPI ID</label>
                  <input type="text" placeholder="username@upi" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-brand-red" />
                  <p className="text-xs text-gray-500 mt-2">A payment request will be sent to your UPI app.</p>
                </div>
                <Button type="submit" fullWidth size="lg">Verify & Pay {formatPrice(total)}</Button>
              </form>
            )}

            {activeTab === 'card' && (
              <form onSubmit={handlePayment}>
                <h3 className="font-bold text-lg mb-4">Pay using Credit/Debit Card</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <div className="relative">
                      <input type="text" placeholder="XXXX XXXX XXXX XXXX" required maxLength={19} className="w-full border border-gray-300 rounded-lg p-3 pl-10 outline-none focus:border-brand-red" />
                      <CreditCard size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" required maxLength={5} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-brand-red" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input type="password" placeholder="XXX" required maxLength={4} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-brand-red" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                    <input type="text" placeholder="John Doe" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-brand-red" />
                  </div>
                </div>
                <Button type="submit" fullWidth size="lg">Pay {formatPrice(total)}</Button>
              </form>
            )}

            {activeTab === 'netbanking' && (
              <div>
                <h3 className="font-bold text-lg mb-4">Popular Banks</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Yes Bank'].map(bank => (
                    <button key={bank} type="button" onClick={() => handlePayment()} className="border border-gray-200 rounded-lg p-3 text-sm font-medium hover:border-brand-red hover:bg-red-50/10 transition-colors text-brand-black">
                      {bank}
                    </button>
                  ))}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Banks</label>
                  <select className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-brand-red bg-white text-gray-700">
                    <option value="">Select your bank</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="bob">Bank of Baroda</option>
                    <option value="cbi">Central Bank of India</option>
                  </select>
                </div>
                <Button fullWidth size="lg" onClick={handlePayment}>Pay {formatPrice(total)}</Button>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div>
                <h3 className="font-bold text-lg mb-4">Select Wallet</h3>
                <div className="space-y-3 mb-6">
                  {['Paytm', 'PhonePe', 'Amazon Pay', 'MobiKwik'].map(wallet => (
                    <label key={wallet} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-brand-red transition-colors">
                      <input type="radio" name="wallet" className="text-brand-red focus:ring-brand-red" />
                      <span className="ml-3 font-medium text-brand-black">{wallet}</span>
                    </label>
                  ))}
                </div>
                <Button fullWidth size="lg" onClick={handlePayment}>Pay {formatPrice(total)}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
