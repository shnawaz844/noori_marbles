import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, phone: phone } }
      });

      if (signUpError) throw signUpError;
      if (data.user) {
        // Save name and phone directly into public.profiles table
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: name,
            phone: phone,
            role: 'customer',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });

        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
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
        className="hidden lg:block"
        style={{
          width: '50%',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200"
          alt="Interior showroom"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,10,10,0.3)' }} />
        <div style={{ position: 'absolute', bottom: '60px', left: '60px' }}>
          <p className="font-caslon" style={{ fontSize: '32px', color: '#ffffff', lineHeight: 1.2 }}>
            Join Bareilly's<br />Finest Studio.
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
            New Account
          </p>
          <h1
            className="font-caslon"
            style={{ fontSize: '40px', fontWeight: 400, color: 'var(--on-surface)', marginBottom: '48px' }}
          >
            Create Account.
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

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                style={inputStyle}
                onFocus={e => (e.target.style.borderBottomColor = 'var(--on-surface)')}
                onBlur={e => (e.target.style.borderBottomColor = 'var(--outline-variant)')}
              />
            </div>

            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={inputStyle}
                onFocus={e => (e.target.style.borderBottomColor = 'var(--on-surface)')}
                onBlur={e => (e.target.style.borderBottomColor = 'var(--outline-variant)')}
              />
            </div>

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
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ArrowRight size={14} /></>}
            </button>
          </form>

          <p style={{ marginTop: '32px', fontSize: '13px', color: 'var(--outline)', fontFamily: 'Inter, sans-serif' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: 'var(--on-surface)', textDecoration: 'underline', fontWeight: 600 }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
