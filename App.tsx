
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ChatBot from './components/ChatBot';
import FloatingCTA from './components/FloatingCTA';
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
      <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
        <ProductProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--surface)', color: 'var(--on-surface)', transition: 'background-color 0.4s ease, color 0.4s ease' }}>
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

              {/* Footer — Monolithic Precision */}
              <footer style={{ borderTop: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-white)', color: 'var(--on-surface)', transition: 'background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease' }} className="mt-auto">
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 80px 48px' }}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
                    {/* Brand */}
                    <div>
                      <p className="font-caslon text-2xl mb-4" style={{ color: 'var(--on-surface)', letterSpacing: '-0.01em' }}>
                        Noori Marbles
                      </p>
                      <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '24px', maxWidth: '260px' }}>
                        Complete interior solutions. High-end tiles, furniture, and hardware excellence. Bareilly's premier showroom since 1999.
                      </p>
                    </div>

                    {/* Navigation */}
                    <div>
                      <p className="label-caps mb-6" style={{ color: 'var(--outline)' }}>Navigate</p>
                      <div className="flex flex-col gap-3">
                        {[
                          { label: 'Products', href: '/products' },
                          { label: 'About Us', href: '/about' },
                          { label: 'Contact', href: '/contact' },
                          { label: 'My Orders', href: '/my-orders' },
                        ].map(link => (
                          <Link
                            key={link.href}
                            to={link.href}
                            style={{ color: 'var(--on-surface)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseOver={e => (e.currentTarget.style.color = 'var(--outline)')}
                            onMouseOut={e => (e.currentTarget.style.color = 'var(--on-surface)')}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <p className="label-caps mb-6" style={{ color: 'var(--outline)' }}>Visit Us</p>
                      <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '24px', marginBottom: '12px' }}>
                        Near Airforce Gate<br />Bareilly, Uttar Pradesh
                      </p>
                      <a
                        href="tel:+919876543210"
                        style={{ color: 'var(--on-surface)', fontSize: '14px', textDecoration: 'none', display: 'block', marginBottom: '8px' }}
                      >
                        +91 8077 028 027
                      </a>
                      <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px' }}>Mon – Sun: 10:00 AM – 8:30 PM</p>
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div
                    style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '32px' }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <p className="label-caps" style={{ color: 'var(--outline)' }}>
                      © {new Date().getFullYear()} Noori Marbles. All rights reserved.
                    </p>
                    <div className="flex gap-3">
                      {[Instagram, Facebook, Twitter].map((Icon, i) => (
                        <a
                          key={i}
                          href="#"
                          style={{
                            width: '36px',
                            height: '36px',
                            border: '1px solid var(--on-surface)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--on-surface)',
                            transition: 'background 0.2s, color 0.2s',
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = 'var(--on-surface)';
                            e.currentTarget.style.color = 'var(--surface-white)';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--on-surface)';
                          }}
                        >
                          <Icon size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </footer>

              {/* <ChatBot /> */}
              <FloatingCTA />
            </div>
          </CartProvider>
        </ProductProvider>
        </NotificationProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
