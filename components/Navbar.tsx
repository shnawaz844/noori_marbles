
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, X, Sun, Moon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CartDrawer from './CartDrawer';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { getCartCount } = useCart();
  const { isAuthenticated, logout, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const cartCount = getCartCount();

  const isHomePage = location.pathname === '/';

  // Track scroll to trigger solid navbar
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // On hero: transparent with white text. On scroll or non-home: solid with dark text.
  const transparent = isHomePage && !isScrolled;

  const navBg = transparent
    ? 'transparent'
    : theme === 'dark' ? 'rgba(20,20,20,0.96)' : 'rgba(255,255,255,0.96)';

  const navBorder = transparent
    ? 'rgba(255,255,255,0.12)'
    : 'var(--outline-variant)';

  const textColor = transparent ? '#ffffff' : 'var(--on-surface)';
  const mutedColor = transparent ? 'rgba(255,255,255,0.55)' : 'var(--outline)';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Fixed Navbar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: navBg,
          borderBottom: `1px solid ${navBorder}`,
          backdropFilter: transparent ? 'none' : 'blur(12px)',
          WebkitBackdropFilter: transparent ? 'none' : 'blur(12px)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          transition: 'background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          className="px-6 md:px-[80px]"
        >
          {/* Brand */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span
              className="font-caslon"
              style={{
                fontSize: '20px',
                color: textColor,
                letterSpacing: '-0.01em',
                fontWeight: 400,
                transition: 'color 0.4s ease',
              }}
            >
              Noori Marbles
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive(link.href) ? textColor : mutedColor,
                  borderBottom: isActive(link.href) ? `1px solid ${textColor}` : '1px solid transparent',
                  paddingBottom: '2px',
                  transition: 'color 0.3s ease, border-color 0.3s ease',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.color = textColor;
                  e.currentTarget.style.borderBottomColor = textColor;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.color = isActive(link.href) ? textColor : mutedColor;
                  e.currentTarget.style.borderBottomColor = isActive(link.href) ? textColor : 'transparent';
                }}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && role !== 'admin' && (
              <Link
                to="/my-orders"
                className="label-caps"
                style={{
                  textDecoration: 'none',
                  color: isActive('/my-orders') ? textColor : mutedColor,
                  borderBottom: isActive('/my-orders') ? `1px solid ${textColor}` : '1px solid transparent',
                  paddingBottom: '2px',
                  transition: 'color 0.3s ease',
                }}
                onMouseOver={e => { e.currentTarget.style.color = textColor; }}
                onMouseOut={e => { e.currentTarget.style.color = isActive('/my-orders') ? textColor : mutedColor; }}
              >
                My Orders
              </Link>
            )}
            {role === 'admin' && (
              <Link to="/admin" className="label-caps"
                style={{ textDecoration: 'none', color: mutedColor, transition: 'color 0.3s' }}
                onMouseOver={e => { e.currentTarget.style.color = textColor; }}
                onMouseOut={e => { e.currentTarget.style.color = mutedColor; }}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleTheme}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: textColor, padding: '4px', display: 'flex', alignItems: 'center',
                transition: 'color 0.4s ease',
              }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
            </button>

            {role === 'admin' && <NotificationBell transparent={transparent} textColor={textColor} />}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                position: 'relative', display: 'flex', alignItems: 'center',
                color: textColor, padding: '4px',
                transition: 'color 0.4s ease',
              }}
              aria-label="Open cart"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute', top: '-4px', right: '-6px',
                    width: '16px', height: '16px',
                    backgroundColor: textColor,
                    color: (transparent || theme === 'dark') ? '#1a1c1c' : '#ffffff',
                    fontSize: '9px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'background 0.4s ease, color 0.4s ease',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <button
                onClick={() => logout()}
                style={{
                  background: 'none',
                  border: `1px solid ${transparent ? 'rgba(255,255,255,0.4)' : 'var(--on-surface)'}`,
                  cursor: 'pointer',
                  padding: '8px 20px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: textColor,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = textColor;
                  e.currentTarget.style.color = (transparent || theme === 'dark') ? '#000000' : '#ffffff';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = textColor;
                }}
              >
                <LogOut size={12} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                style={{
                  border: `1px solid ${transparent ? 'rgba(255,255,255,0.4)' : 'var(--on-surface)'}`,
                  padding: '8px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: textColor, textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = textColor;
                  e.currentTarget.style.color = (transparent || theme === 'dark') ? '#000000' : '#ffffff';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = textColor;
                }}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile: Cart + Menu */}
          <div className="md:hidden flex items-center gap-5">
            <button
              onClick={toggleTheme}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: textColor, display: 'flex',
                transition: 'color 0.4s ease',
              }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
            </button>
            {role === 'admin' && <NotificationBell transparent={transparent} textColor={textColor} />}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                position: 'relative', color: textColor, display: 'flex',
                transition: 'color 0.4s ease',
              }}
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-6px',
                  width: '15px', height: '15px',
                  backgroundColor: textColor,
                  color: (transparent || theme === 'dark') ? '#1a1c1c' : '#ffffff',
                  fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.4s, color 0.4s',
                }}>
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: textColor,
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'color 0.4s ease',
              }}
            >
              {isOpen ? <><X size={14} /> Close</> : 'Menu'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — always solid */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px', left: 0, right: 0,
            backgroundColor: 'var(--surface-white)',
            borderBottom: '1px solid var(--outline-variant)',
            zIndex: 49,
            padding: '32px 24px 40px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              ...navLinks,
              ...(isAuthenticated && role !== 'admin' ? [{ name: 'My Orders', href: '/my-orders' }] : []),
              ...(role === 'admin' ? [{ name: 'Admin Dashboard', href: '/admin' }] : []),
            ].map((link, idx, arr) => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--on-surface)',
                  padding: '18px 0',
                  borderBottom: idx < arr.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                  display: 'block',
                }}
              >
                {link.name}
              </Link>
            ))}
            <div style={{ marginTop: '24px' }}>
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  style={{
                    width: '100%', border: '1px solid var(--on-surface)', background: 'none',
                    padding: '14px 0', fontFamily: 'Inter, sans-serif',
                    fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'var(--on-surface)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  <LogOut size={12} /> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  style={{
                    display: 'block', width: '100%',
                    border: '1px solid var(--on-surface)', backgroundColor: 'var(--on-surface)',
                    color: 'var(--surface-white)', padding: '14px 0', textAlign: 'center',
                    fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
                  }}
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
