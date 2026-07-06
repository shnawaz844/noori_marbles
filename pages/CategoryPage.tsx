
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react';

const CategoryPage: React.FC = () => {
    const { products } = useProducts();
    const { categoryName } = useParams<{ categoryName: string }>();
    const decodedCategory = categoryName ? decodeURIComponent(categoryName) : '';
    const productsInCategory = products.filter(p => p.category === decodedCategory);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
            {/* Page header */}
            <div
                style={{ backgroundColor: 'var(--surface-white)', borderBottom: '1px solid var(--outline-variant)', padding: '20px 80px', transition: 'background-color 0.4s ease, border-color 0.4s ease' }}
                className="px-6 md:px-[80px]"
            >
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <Link
                        to="/products"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            textDecoration: 'none', fontFamily: 'Inter, sans-serif',
                            fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: 'var(--outline)', transition: 'color 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.color = 'var(--on-surface)')}
                        onMouseOut={e => (e.currentTarget.style.color = 'var(--outline)')}
                    >
                        <ArrowLeft size={14} strokeWidth={1.5} /> All Products
                    </Link>
                </div>
            </div>

            <div
                style={{ backgroundColor: 'var(--surface-white)', borderBottom: '1px solid var(--outline-variant)', padding: '48px 80px', transition: 'background-color 0.4s ease, border-color 0.4s ease' }}
                className="px-6 md:px-[80px]"
            >
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>
                        Category
                    </p>
                    <h1
                        className="font-caslon"
                        style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 400, color: 'var(--on-surface)', lineHeight: 1.1 }}
                    >
                        {decodedCategory}
                    </h1>
                    <p style={{ color: 'var(--outline)', fontSize: '15px', marginTop: '12px' }}>
                        {productsInCategory.length} {productsInCategory.length === 1 ? 'product' : 'products'} available
                    </p>
                </div>
            </div>

            <div
                style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 80px 120px' }}
                className="px-6 md:px-[80px]"
            >
                {productsInCategory.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '48px 32px' }}>
                        {productsInCategory.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '80px 0', textAlign: 'center' }}>
                        <p className="font-caslon" style={{ fontSize: '24px', color: 'var(--on-surface)', marginBottom: '16px' }}>
                            No products in this category yet.
                        </p>
                        <Link
                            to="/products"
                            className="label-caps"
                            style={{ color: 'var(--on-surface)', textDecoration: 'underline' }}
                        >
                            Browse All Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
