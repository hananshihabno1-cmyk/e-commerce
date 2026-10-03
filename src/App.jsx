import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AccountPage from './pages/AccountPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <WishlistProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/orders" element={<OrderHistoryPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </WishlistProvider>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
