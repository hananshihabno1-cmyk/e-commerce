import { CircleDot, Target, Wind, Circle, Shirt, Backpack, Trophy } from 'lucide-react';

const categoryConfig = {
  football:    { Icon: CircleDot, bg: 'product-img-football' },
  cricket:     { Icon: Target,    bg: 'product-img-cricket' },
  badminton:   { Icon: Wind,      bg: 'product-img-badminton' },
  tennis:      { Icon: Circle,    bg: 'product-img-tennis' },
  apparel:     { Icon: Shirt,     bg: 'product-img-apparel' },
  accessories: { Icon: Backpack,  bg: 'product-img-accessories' },
  trophies:    { Icon: Trophy,    bg: 'product-img-trophies' },
};

export default function ProductImage({ product, className = '', size = 'md', index = 0 }) {
  const config = categoryConfig[product.category] || categoryConfig.accessories;
  const { Icon, bg } = config;
  const iconSize = size === 'lg' ? 64 : size === 'md' ? 40 : 28;

  // Create slight gradient variation for gallery "angles"
  const rotations = [0, 45, 90, 135];
  const rotation = rotations[index % rotations.length];

  return (
    <div
      className={`${bg} relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(${rotation + 135}deg, var(--tw-gradient-stops))` }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative flex flex-col items-center gap-2">
        <Icon size={iconSize} className="text-white/40" strokeWidth={1.5} />
        {size !== 'sm' && (
          <span className="text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase">
            DENIO
          </span>
        )}
      </div>
    </div>
  );
}
