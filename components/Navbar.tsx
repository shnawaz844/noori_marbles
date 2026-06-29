
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ShoppingCart, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartDrawer from './CartDrawer';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { getCartCount } = useCart();
  const { isAuthenticated, logout, role } = useAuth();
  const cartCount = getCartCount();
  const isHomePage = location.pathname === '/';
  const shouldShowSolid = !isHomePage || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);

    // Smooth scroll for about/contact if on home page
    if (isHomePage) {
      if (href === '/about') {
        const element = document.getElementById('about');
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          return;
        }
      }
      if (href === '/contact') {
        const element = document.getElementById('contact');
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          return;
        }
      }
    }

    if (href === location.pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${shouldShowSolid ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <Link to="/" onClick={() => handleLinkClick('/')}>
                <h1 className={`text-2xl font-serif font-bold ${shouldShowSolid ? 'text-slate-900' : 'text-white'}`}>
                  NOORI <span className="text-amber-500">MARBELS</span>
                </h1>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" onClick={() => handleLinkClick('/')} className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-amber-500 ${shouldShowSolid ? 'text-slate-700' : 'text-white'}`}>Home</Link>
              <Link to="/products" onClick={() => handleLinkClick('/products')} className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-amber-500 ${shouldShowSolid ? 'text-slate-700' : 'text-white'}`}>Products</Link>
              {isAuthenticated && role !== 'admin' && (
                <Link to="/my-orders" onClick={() => handleLinkClick('/my-orders')} className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-amber-500 ${shouldShowSolid ? 'text-slate-700' : 'text-white'}`}>My Orders</Link>
              )}
              {role === 'admin' && (
                <Link to="/admin" onClick={() => handleLinkClick('/admin')} className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-amber-500 ${shouldShowSolid ? 'text-slate-700' : 'text-white'}`}>Admin</Link>
              )}
              <Link to="/about" onClick={() => handleLinkClick('/about')} className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-amber-500 ${shouldShowSolid ? 'text-slate-700' : 'text-white'}`}>About Us</Link>
              <Link to="/contact" onClick={() => handleLinkClick('/contact')} className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-amber-500 ${shouldShowSolid ? 'text-slate-700' : 'text-white'}`}>Contact</Link>
            </div>

            <div className="hidden md:flex items-center space-x-8"> {/* This div now contains cart and call button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 ${shouldShowSolid ? 'text-slate-700 hover:text-amber-500' : 'text-white hover:text-amber-500'} transition-colors`}
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {role === 'admin' && <NotificationBell />}

              <a
                href="tel:+919876543210"
                className="bg-amber-500 text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-amber-600 transition-colors"
              >
                <Phone size={16} />
                Call Now
              </a>

              {isAuthenticated ? (
                <button
                  onClick={() => logout()}
                  className="bg-red-500/10 text-red-500 px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-amber-500/10 text-amber-500 px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-amber-500 hover:text-white transition-all border border-amber-500/20"
                >
                  Login
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative ${shouldShowSolid ? 'text-slate-900' : 'text-white'}`}
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={shouldShowSolid ? 'text-slate-900' : 'text-white'}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-xl absolute top-full left-0 w-full animate-fadeIn">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-3 py-4 text-base font-medium text-slate-700 border-b border-slate-100"
                  onClick={() => handleLinkClick(link.href)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                {isAuthenticated && role !== 'admin' && (
                  <Link
                    to="/my-orders"
                    onClick={() => handleLinkClick('/my-orders')}
                    className="block px-3 py-4 text-base font-medium text-slate-700 border-b border-slate-100"
                  >
                    My Orders
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => handleLinkClick('/admin')}
                    className="block px-3 py-4 text-base font-medium text-slate-700 border-b border-slate-100"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full bg-red-500 text-white px-5 py-3 rounded-lg text-center font-semibold flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-slate-900 text-white px-5 py-3 rounded-lg text-center font-semibold block"
                  >
                    Login / Sign up
                  </Link>
                )}
                <a
                  href="tel:+919876543210"
                  className="w-full bg-amber-500 text-white px-5 py-3 rounded-lg text-center font-semibold block"
                >
                  Contact Expert
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
