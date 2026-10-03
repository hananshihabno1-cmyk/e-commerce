import { Star } from 'lucide-react';

export default function Rating({ value = 0, count, size = 'md', showCount = true }) {
  const starSize = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = value >= star;
          const half = !filled && value >= star - 0.5;
          return (
            <span key={star} className="relative">
              <Star
                size={starSize}
                className="text-gray-200"
                fill="currentColor"
                strokeWidth={0}
              />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden text-amber-400"
                  style={{ width: filled ? '100%' : '50%' }}
                >
                  <Star size={starSize} fill="currentColor" strokeWidth={0} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {value > 0 && (
        <span className={`font-semibold text-gray-800 ${textSize}`}>{value}</span>
      )}
      {showCount && count != null && (
        <span className={`text-gray-400 ${textSize}`}>({count.toLocaleString('en-IN')})</span>
      )}
    </div>
  );
}
