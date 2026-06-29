
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ChatBot from './components/ChatBot';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCategories from './pages/AdminCategories';
import AdminEnquiries from './pages/AdminEnquiries';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import MyOrdersPage from './pages/MyOrdersPage';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <NotificationProvider>
        <ProductProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/product/:productId" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/my-orders" element={<MyOrdersPage />} />
                </Route>
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/enquiries" element={<AdminEnquiries />} />
                </Route>
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>

              <footer className="bg-slate-900 text-white py-12 border-t border-white/5 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-2xl font-serif font-bold mb-4">NOORI <span className="text-amber-500">MARBELS</span></h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
                    Complete Interior Solutions. High-End Tiles, Furniture, and Hardware Excellence.
                  </p>
                  <div className="flex justify-center gap-8 mb-8 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
                    <Link to="/contact" className="hover:text-amber-500 transition-colors">Visit Us</Link>
                  </div>
                  <div className="flex justify-center gap-4 mb-8">
                    {[Instagram, Facebook, Twitter].map((Icon, i) => (
                      <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-white transition-all">
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs">
                    © {new Date().getFullYear()} Noori Marbels. All rights reserved. Designed for Excellence.
                  </p>
                </div>
              </footer>

              <ChatBot />
            </div>
          </CartProvider>
        </ProductProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
