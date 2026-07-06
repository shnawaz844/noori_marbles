import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useProducts } from '../contexts/ProductContext';

// Category background images — editorial shots for each
const CATEGORY_IMAGES: Record<string, string> = {
  'Tiles & Marbles': 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800',
  'Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
  'Luxury Faucets & Taps': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  'Sanitary Ware': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800',
  'Laminates': 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800',
  'Ply Boards': 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&q=80&w=800',
  'Doors': 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&q=80&w=800',
  'PVC & Wall Panels': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
  'Hardware': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
};

const CategoriesGrid: React.FC = () => {
  const { categories } = useProducts();

  const displayCategories = categories && categories.length > 0
    ? categories.map(cat => ({
        id: cat.id || cat.name,
        name: cat.name,
        image: cat.image || CATEGORY_IMAGES[cat.name] || 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800',
      }))
    : CATEGORIES.map(catName => ({
        id: catName,
        name: catName,
        image: CATEGORY_IMAGES[catName] || 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800',
      }));

  return (
    <section
      id="categories"
      style={{
        backgroundColor: 'var(--surface-white)',
        padding: '120px 80px',
        transition: 'background-color 0.4s ease',
      }}
      className="px-6 md:px-[80px]"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section header — asymmetric editorial style */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '64px',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>
              Complete Solutions
            </p>
            <h2
              className="font-caslon"
              style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 400, color: 'var(--on-surface)', lineHeight: 1.2 }}
            >
              All Interior Needs,<br />One Destination.
            </h2>
          </div>
          <p
            style={{
              color: 'var(--outline)',
              fontSize: '15px',
              lineHeight: '26px',
              maxWidth: '340px',
              marginBottom: '4px',
            }}
          >
            Curated materials, fittings, and finishes to bring every architectural vision to life.
          </p>
        </div>

        {/* Category grid — mixed aspect ratios for editorial feel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '2px',
          }}
        >
          {displayCategories.map((cat) => {
            const imgSrc = cat.image;
            const category = cat.name;
            return (
              <Link
                key={cat.id}
                to={`/category/${encodeURIComponent(category)}`}
                style={{ textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden' }}
                className="group"
              >
                <div style={{ paddingBottom: '120%', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--outline-variant)' }}>
                  <img
                    src={imgSrc}
                    alt={category}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                    className="group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(10,10,10,0)',
                      transition: 'background-color 0.4s',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '24px',
                    }}
                    className="group-hover:bg-black/50"
                  >
                    <p
                      className="label-caps"
                      style={{
                        color: '#ffffff',
                        opacity: 0,
                        transform: 'translateY(8px)',
                        transition: 'opacity 0.3s, transform 0.3s',
                      }}
                      ref={el => {
                        if (el) {
                          const parent = el.closest('.group') as HTMLElement;
                          if (parent) {
                            parent.addEventListener('mouseenter', () => {
                              el.style.opacity = '1';
                              el.style.transform = 'translateY(0)';
                            });
                            parent.addEventListener('mouseleave', () => {
                              el.style.opacity = '0';
                              el.style.transform = 'translateY(8px)';
                            });
                          }
                        }
                      }}
                    >
                      {category}
                    </p>
                  </div>
                </div>
                {/* Caption below */}
                <div style={{ padding: '16px 0 0 0', backgroundColor: 'var(--surface-white)' }}>
                  <p
                    className="label-caps"
                    style={{ color: 'var(--on-surface)' }}
                  >
                    {category}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
