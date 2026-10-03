import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import SearchBar from '../ui/SearchBar';
import { categories } from '../../data/categories';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setCategoryDropdown(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, searchOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        {/* Top bar — promotional */}
        <div className="bg-brand-black text-white text-center text-xs sm:text-sm py-1.5 px-4 font-medium">
          Free delivery on orders above ₹999 · Use code <span className="text-brand-red font-bold">DENIO20</span> for 20% off
        </div>

        {/* Main header */}
        <div className="container-main">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-1.5 -ml-1.5 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link to="/" className="flex items-center gap-2 shrink-0">
                <img src="/logo.jpg" alt="DENIO SPORTS" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover" />
                <div className="hidden sm:block">
                  <span className="text-lg font-extrabold text-brand-black tracking-tight">DENIO</span>
                  <span className="text-lg font-extrabold text-brand-red tracking-tight ml-0.5">SPORTS</span>
                </div>
              </Link>
            </div>

            {/* Center: Search (desktop) */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <SearchBar />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <Search size={20} className="text-gray-700" />
              </button>

              <Link
                to="/account"
                className="hidden sm:flex p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Account"
              >
                <User size={20} className="text-gray-700" />
              </Link>

              <Link
                to="/wishlist"
                className="hidden sm:flex p-2 rounded-md hover:bg-gray-100 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={20} className="text-gray-700" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingCart size={20} className="text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Desktop category nav */}
          <nav className="hidden lg:flex items-center gap-6 h-10 border-t border-gray-100 text-sm">
            <div
              className="relative"
              onMouseEnter={() => setCategoryDropdown(true)}
              onMouseLeave={() => setCategoryDropdown(false)}
            >
              <button className="flex items-center gap-1 font-semibold text-gray-700 hover:text-brand-red transition-colors">
                All Categories <ChevronDown size={14} />
              </button>
              {categoryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-2 animate-slide-down z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-red transition-colors"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="font-medium text-gray-600 hover:text-brand-red transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
            <Link to="/category/trophies" className="font-medium text-gray-600 hover:text-brand-red transition-colors whitespace-nowrap">
              Trophies
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4 animate-fade-in lg:hidden">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setSearchOpen(false)} className="p-1">
              <X size={22} className="text-gray-700" />
            </button>
            <div className="flex-1">
              <SearchBar isMobile onClose={() => setSearchOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-down overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src="/logo.jpg" alt="DENIO SPORTS" className="h-8 w-8 rounded-full object-cover" />
                <span className="font-extrabold text-brand-black">DENIO <span className="text-brand-red">SPORTS</span></span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <nav className="py-2">
              <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-red transition-colors"
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}

              <div className="border-t border-gray-100 mt-2 pt-2">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
                <Link to="/account" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <User size={18} /> My Account
                </Link>
                <Link to="/account/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <ShoppingCart size={18} /> My Orders
                </Link>
                <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Heart size={18} /> Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="ml-auto text-xs bg-brand-red text-white px-1.5 py-0.5 rounded-full">{wishlistItems.length}</span>
                  )}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
