import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'denio_cart';

function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { items: [], coupon: null };
  } catch {
    return { items: [], coupon: null };
  }
}

function saveCart(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

const COUPONS = {
  'DENIO20': { code: 'DENIO20', type: 'percent', value: 20, label: '20% OFF', minOrder: 500 },
  'FLAT200': { code: 'FLAT200', type: 'flat', value: 200, label: '₹200 OFF', minOrder: 1500 },
  'WELCOME10': { code: 'WELCOME10', type: 'percent', value: 10, label: '10% OFF', minOrder: 0 },
};

function cartReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size, color, quantity = 1 } = action.payload;
      const key = `${product.id}_${size || 'default'}_${color || 'default'}`;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        newState = {
          ...state,
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, 10) } : i
          ),
        };
      } else {
        newState = {
          ...state,
          items: [
            ...state.items,
            {
              key,
              productId: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              size,
              color,
              quantity,
              category: product.category,
              brand: product.brand,
              stock: product.stock,
            },
          ],
        };
      }
      break;
    }
    case 'REMOVE_ITEM':
      newState = { ...state, items: state.items.filter((i) => i.key !== action.payload) };
      break;
    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map((i) =>
          i.key === action.payload.key ? { ...i, quantity: Math.max(1, Math.min(action.payload.quantity, 10)) } : i
        ),
      };
      break;
    case 'APPLY_COUPON': {
      const coupon = COUPONS[action.payload.toUpperCase()];
      if (coupon) {
        newState = { ...state, coupon };
      } else {
        return state; // invalid coupon, no state change
      }
      break;
    }
    case 'REMOVE_COUPON':
      newState = { ...state, coupon: null };
      break;
    case 'CLEAR_CART':
      newState = { items: [], coupon: null };
      break;
    default:
      return state;
  }
  saveCart(newState);
  return newState;
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, loadCart);

  // Sync across tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY) {
        const newState = loadCart();
        dispatch({ type: 'CLEAR_CART' });
        newState.items.forEach((item) => {
          dispatch({ type: 'ADD_ITEM', payload: { product: item, size: item.size, color: item.color, quantity: item.quantity } });
        });
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const addItem = (product, size, color, quantity) =>
    dispatch({ type: 'ADD_ITEM', payload: { product, size, color, quantity } });
  const removeItem = (key) => dispatch({ type: 'REMOVE_ITEM', payload: key });
  const updateQuantity = (key, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } });
  const applyCoupon = (code) => dispatch({ type: 'APPLY_COUPON', payload: code });
  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const delivery = subtotal >= 999 ? 0 : subtotal > 0 ? 49 : 0;

  let discount = 0;
  if (state.coupon && subtotal >= state.coupon.minOrder) {
    if (state.coupon.type === 'percent') {
      discount = Math.round(subtotal * (state.coupon.value / 100));
    } else {
      discount = state.coupon.value;
    }
  }

  const total = subtotal + delivery - discount;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        coupon: state.coupon,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        subtotal,
        delivery,
        discount,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
