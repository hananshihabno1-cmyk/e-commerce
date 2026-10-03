import { formatPrice } from '../../data/products';

export default function PriceDisplay({ price, originalPrice, size = 'md', className = '' }) {
  const priceSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';
  const oldSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';
  const discountSize = size === 'sm' ? 'text-xs' : 'text-sm';

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
      <span className={`font-bold text-gray-900 ${priceSize}`}>
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className={`text-gray-400 line-through ${oldSize}`}>
            {formatPrice(originalPrice)}
          </span>
          <span className={`font-semibold text-brand-red ${discountSize}`}>
            {discountPercent}% off
          </span>
        </>
      )}
    </div>
  );
}
