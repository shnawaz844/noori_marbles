import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 0',
  border: 'none',
  borderBottom: '1px solid var(--outline-variant)',
  background: 'transparent',
  fontSize: '15px',
  color: 'var(--on-surface)',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter, sans-serif',
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: 'var(--outline)',
  marginBottom: '8px',
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        if (profile?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--surface)',
        display: 'flex',
        paddingTop: '64px',
        transition: 'background-color 0.4s ease',
      }}
    >
      {/* Left — visual panel */}
      <div
        className="hidden lg:block lg:h-screen"
        style={{
          width: '50%',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1655582484145-99ff2bdbcf19?auto=format&fit=crop&q=60&w=1200"
          alt="Premium marble interior"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,10,10,0.3)' }} />
        <div style={{ position: 'absolute', bottom: '60px', left: '60px' }}>
          <p className="font-caslon" style={{ fontSize: '32px', color: '#ffffff', lineHeight: 1.2 }}>
            Crafting Spaces<br />of Distinction.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 80px',
        }}
        className="px-6 md:px-[80px]"
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>
            Account Access
          </p>
          <h1
            className="font-caslon"
            style={{ fontSize: '40px', fontWeight: 400, color: 'var(--on-surface)', marginBottom: '48px' }}
          >
            Welcome Back.
          </h1>

          {error && (
            <div
              style={{
                backgroundColor: '#ffdad6',
                border: '1px solid #ba1a1a',
                color: '#93000a',
                padding: '12px 16px',
                fontSize: '13px',
                marginBottom: '32px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => (e.target.style.borderBottomColor = 'var(--on-surface)')}
                onBlur={e => (e.target.style.borderBottomColor = 'var(--outline-variant)')}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                <a href="#" className="label-caps" style={{ color: 'var(--outline)', textDecoration: 'underline', fontSize: '10px' }}>
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => (e.target.style.borderBottomColor = 'var(--on-surface)')}
                onBlur={e => (e.target.style.borderBottomColor = 'var(--outline-variant)')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? 'var(--outline-variant)' : 'var(--on-surface)',
                color: loading ? 'var(--outline)' : 'var(--surface-white)',
                border: '1px solid var(--on-surface)',
                padding: '16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.25s, color 0.25s',
              }}
              onMouseOver={e => {
                if (!loading) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--on-surface)';
                }
              }}
              onMouseOut={e => {
                if (!loading) {
                  e.currentTarget.style.background = 'var(--on-surface)';
                  e.currentTarget.style.color = 'var(--surface-white)';
                }
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={14} /></>}
            </button>
          </form>

          <p style={{ marginTop: '32px', fontSize: '13px', color: 'var(--outline)', fontFamily: 'Inter, sans-serif' }}>
            No account yet?{' '}
            <Link
              to="/signup"
              style={{ color: 'var(--on-surface)', textDecoration: 'underline', fontWeight: 600 }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
