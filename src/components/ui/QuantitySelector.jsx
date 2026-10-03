import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value = 1, min = 1, max = 10, onChange, size = 'md' }) {
  const btnSize = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  const iconSize = size === 'sm' ? 14 : 16;
  const textSize = size === 'sm' ? 'text-sm w-8' : 'text-base w-10';

  return (
    <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btnSize} flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Decrease quantity"
      >
        <Minus size={iconSize} />
      </button>
      <span className={`${textSize} text-center font-semibold text-gray-900 select-none`}>
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btnSize} flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
