const badgeVariants = {
  sale: 'bg-brand-red text-white',
  new: 'bg-emerald-600 text-white',
  bestseller: 'bg-amber-500 text-white',
  'out-of-stock': 'bg-gray-500 text-white',
  'low-stock': 'bg-orange-500 text-white',
  featured: 'bg-brand-black text-white',
  discount: 'bg-brand-red text-white',
};

export default function Badge({ variant = 'sale', children, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide
        ${badgeVariants[variant] || badgeVariants.sale}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
