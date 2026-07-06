import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const FloatingCTA: React.FC = () => {
  const phoneNumber = '918193830391';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hello Noori Marbles, I would like to enquire about your products and showroom.')}`;
  const callUrl = `tel:+${phoneNumber}`;

  return (
    <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 90 }}>
      {/* Desktop / Laptop View — WhatsApp CTA (Hidden on mobile/tablet, shown on md and larger) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
        style={{
          width: '56px',
          height: '56px',
          backgroundColor: '#25D366',
          color: '#ffffff',
          borderRadius: '50%',
          textDecoration: 'none',
          boxShadow: '0 10px 25px -5px rgba(37, 211, 102, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
        }}
        aria-label="WhatsApp Us"
      >
        <MessageCircle size={26} style={{ fill: 'currentColor' }} />
      </a>

      {/* Mobile View — Call CTA (Shown on mobile/tablet, hidden on md and larger) */}
      <a
        href={callUrl}
        className="flex md:hidden items-center justify-center shadow-2xl transition-all duration-300 active:scale-90"
        style={{
          width: '56px',
          height: '56px',
          backgroundColor: 'var(--on-surface)',
          color: 'var(--surface-white)',
          borderRadius: '50%',
          textDecoration: 'none',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        aria-label="Call Showroom"
      >
        <Phone size={24} />
      </a>

    </div>
  );
};

export default FloatingCTA;
