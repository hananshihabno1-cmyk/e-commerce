import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Search, Heart, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/category/football', icon: Grid3X3, label: 'Categories' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/account', icon: User, label: 'Account' },
];

export default function MobileNav() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden sticky-bottom-shadow">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors ${
                active ? 'text-brand-red' : 'text-gray-400'
              }`}
            >
              <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer for notched phones */}
      <div className="h-safe-bottom bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
    </nav>
  );
}
