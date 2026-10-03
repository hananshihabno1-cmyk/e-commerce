import { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext();
const STORAGE_KEY = 'denio_wishlist';

function loadWishlist() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* ignore */ }
}

function wishlistReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'ADD':
      if (state.find((i) => i.productId === action.payload.id)) return state;
      newState = [...state, {
        productId: action.payload.id,
        name: action.payload.name,
        price: action.payload.price,
        originalPrice: action.payload.originalPrice,
        category: action.payload.category,
        stock: action.payload.stock,
        rating: action.payload.rating,
        brand: action.payload.brand,
      }];
      break;
    case 'REMOVE':
      newState = state.filter((i) => i.productId !== action.payload);
      break;
    case 'CLEAR':
      newState = [];
      break;
    default:
      return state;
  }
  saveWishlist(newState);
  return newState;
}

export function WishlistProvider({ children }) {
  const [items, dispatch] = useReducer(wishlistReducer, null, loadWishlist);

  const addItem = (product) => dispatch({ type: 'ADD', payload: product });
  const removeItem = (productId) => dispatch({ type: 'REMOVE', payload: productId });
  const isInWishlist = (productId) => items.some((i) => i.productId === productId);
  const toggleItem = (product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };
  const clearWishlist = () => dispatch({ type: 'CLEAR' });

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, toggleItem, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
