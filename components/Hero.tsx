
import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>
      {/* Full-bleed background image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2400"
          alt="Premium marble interior"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Subtle dark overlay — left-heavy to frame text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(100deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.35) 55%, rgba(10,10,10,0.08) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 80px 80px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
        className="px-6 md:px-[80px]"
      >
        {/* Eyebrow */}
        <p
          className="label-caps animate-fade-up"
          style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}
        >
          Bareilly's Premier Interior Studio
        </p>

        {/* Headline */}
        <h1
          className="font-caslon animate-fade-up-delay-1"
          style={{
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            maxWidth: '720px',
            marginBottom: '40px',
          }}
        >
          Stone, Craft &amp;<br />Architectural Precision.
        </h1>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-2" style={{ marginBottom: '80px' }}>
          <Link
            to="/products"
            style={{
              display: 'inline-block',
              backgroundColor: '#ffffff',
              color: '#1a1c1c',
              padding: '16px 40px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background 0.25s, color 0.25s',
              border: '1px solid #ffffff',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#1a1c1c';
            }}
          >
            Explore Collection
          </Link>
          <Link
            to="/contact"
            style={{
              display: 'inline-block',
              backgroundColor: 'transparent',
              color: '#ffffff',
              padding: '16px 40px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.5)',
              transition: 'border-color 0.25s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#ffffff'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
          >
            Book Consultation
          </Link>
        </div>

        {/* Stats strip */}
        <div
          className="animate-fade-up-delay-3 hidden md:flex items-center gap-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '32px' }}
        >
          {[
            { value: '5000+', label: 'Designs Available' },
            { value: '15+', label: 'Premium Brands' },
            { value: '25 Yrs', label: 'Of Excellence' },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div style={{ paddingRight: '48px' }}>
                <p
                  className="font-caslon"
                  style={{ fontSize: '28px', color: '#ffffff', lineHeight: 1, marginBottom: '4px', fontWeight: 400 }}
                >
                  {stat.value}
                </p>
                <p className="label-caps" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {stat.label}
                </p>
              </div>
              {i < 2 && (
                <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255,255,255,0.2)', marginRight: '48px' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
