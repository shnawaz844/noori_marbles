
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ paddingBottom: '64px', marginBottom: '64px', borderBottom: '1px solid var(--outline-variant)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        {title && (
          <h3
            className="font-caslon"
            style={{ fontSize: '24px', fontWeight: 400, color: 'var(--on-surface)', lineHeight: 1.2 }}
          >
            {title}
          </h3>
        )}
        <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
          <button
            onClick={() => scroll('left')}
            style={{
              width: '40px', height: '40px',
              border: '1px solid var(--on-surface)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--on-surface)',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--on-surface)'; e.currentTarget.style.color = 'var(--surface-white)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--on-surface)'; }}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => scroll('right')}
            style={{
              width: '40px', height: '40px',
              border: '1px solid var(--on-surface)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--on-surface)',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--on-surface)'; e.currentTarget.style.color = 'var(--surface-white)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--on-surface)'; }}
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Scrollable product row */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '4px',
        }}
      >
        {products.map((product) => (
          <div key={product.id} style={{ minWidth: '260px', flexShrink: 0 }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
