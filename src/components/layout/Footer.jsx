import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-12 pb-24 lg:pb-8">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt="DENIO SPORTS" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <span className="text-lg font-extrabold">DENIO </span>
                <span className="text-lg font-extrabold text-brand-red">SPORTS</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted partner for premium sports equipment, apparel, and accessories. Play Hard. Play Better.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="mailto:support@deniosports.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={14} /> support@deniosports.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} /> +91 98765 43210
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} /> Kozhikode, Kerala, India
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link to="/account" className="text-sm text-gray-400 hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/account/orders" className="text-sm text-gray-400 hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/cart" className="text-sm text-gray-400 hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="/wishlist" className="text-sm text-gray-400 hover:text-white transition-colors">Wishlist</Link></li>
              <li><span className="text-sm text-gray-400 cursor-default">Shipping Policy</span></li>
              <li><span className="text-sm text-gray-400 cursor-default">Return Policy</span></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-400 cursor-default">About Us</span></li>
              <li><span className="text-sm text-gray-400 cursor-default">Contact</span></li>
              <li><span className="text-sm text-gray-400 cursor-default">Careers</span></li>
              <li><span className="text-sm text-gray-400 cursor-default">Terms & Conditions</span></li>
              <li><span className="text-sm text-gray-400 cursor-default">Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2026 DENIO SPORTS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">Payments accepted:</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
              <span className="bg-gray-800 px-2 py-1 rounded">UPI</span>
              <span className="bg-gray-800 px-2 py-1 rounded">VISA</span>
              <span className="bg-gray-800 px-2 py-1 rounded">MC</span>
              <span className="bg-gray-800 px-2 py-1 rounded">RuPay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
