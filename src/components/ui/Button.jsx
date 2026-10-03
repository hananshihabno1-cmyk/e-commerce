import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-brand-red text-white hover:bg-brand-red-dark active:bg-red-900 focus:ring-brand-red/30',
  secondary: 'bg-brand-black text-white hover:bg-gray-800 active:bg-gray-900 focus:ring-gray-500/30',
  outline: 'border-2 border-gray-300 text-gray-800 hover:border-brand-red hover:text-brand-red active:bg-red-50 focus:ring-brand-red/20',
  ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300/30',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500/30',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-md',
  md: 'text-sm px-5 py-2.5 rounded-lg',
  lg: 'text-base px-6 py-3 rounded-lg',
  xl: 'text-lg px-8 py-3.5 rounded-lg',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', disabled, loading, fullWidth, children, className = '', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
});

export default Button;
