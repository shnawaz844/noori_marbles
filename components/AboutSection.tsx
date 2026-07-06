import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      style={{ backgroundColor: 'var(--surface)', padding: '160px 80px', transition: 'background-color 0.4s ease' }}
      className="px-6 md:px-[80px]"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}
          className="grid-cols-1 md:grid-cols-2">
          {/* Left — Image with stat overlay */}
          <div style={{ position: 'relative' }}>
            <div style={{ overflow: 'hidden', aspectRatio: '4/5' }}>
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1000"
                alt="Noori Marbles Showroom"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Stat box — overlaps image */}
            <div
              style={{
                position: 'absolute',
                bottom: '-24px',
                right: '-24px',
                backgroundColor: 'var(--on-surface)',
                color: 'var(--surface-white)',
                padding: '32px',
                width: '160px',
              }}
              className="hidden md:block"
            >
              <p
                className="font-caslon"
                style={{ fontSize: '40px', fontWeight: 400, lineHeight: 1, marginBottom: '8px' }}
              >
                25+
              </p>
              <p className="label-caps" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Years of Trust
              </p>
            </div>
          </div>

          {/* Right — Text */}
          <div style={{ paddingLeft: '0' }}>
            <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '24px' }}>
              Our Story
            </p>
            <h2
              className="font-caslon"
              style={{
                fontSize: 'clamp(28px, 3vw, 40px)',
                fontWeight: 400,
                lineHeight: 1.2,
                color: 'var(--on-surface)',
                marginBottom: '32px',
              }}
            >
              Bareilly's Most Trusted<br />Interior Studio.
            </h2>
            <p
              style={{
                color: 'var(--on-surface-variant)',
                fontSize: '16px',
                lineHeight: '28px',
                marginBottom: '48px',
              }}
            >
              Established with a vision to bring world-class interior solutions to Bareilly, Noori Marbles has become the city's premier destination for homeowners, architects, and designers seeking uncompromising quality.
            </p>

            {/* Pillars list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { num: '01', text: 'One-stop showroom for all construction finishes.' },
                { num: '02', text: 'Direct sourcing from leading global brands.' },
                { num: '03', text: 'Expert design consultation for every project.' },
                { num: '04', text: 'Commitment to quality and long-term durability.' },
              ].map((item, idx, arr) => (
                <div
                  key={item.num}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '24px',
                    padding: '20px 0',
                    borderBottom: idx < arr.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                  }}
                >
                  <span className="label-caps" style={{ color: 'var(--outline)', flexShrink: 0, paddingTop: '2px' }}>
                    {item.num}
                  </span>
                  <p style={{ color: 'var(--on-surface)', fontSize: '15px', lineHeight: '24px', margin: 0 }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
