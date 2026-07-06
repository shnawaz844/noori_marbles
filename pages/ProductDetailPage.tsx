
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, ShoppingCart, Check, MessageSquare } from 'lucide-react';
import ProductCarousel from '../components/ProductCarousel';
import ProductHotspots from '../components/ProductHotspots';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { addToCart, isInCart } = useCart();
    const { products, getProductById } = useProducts();

    const product = getProductById(productId || '');
    const relatedProducts = product
        ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
        : [];

    if (!product) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 80px', textAlign: 'center' }} className="px-6 md:px-[80px]">
                    <h1 className="font-caslon" style={{ fontSize: '40px', fontWeight: 400, color: 'var(--on-surface)', marginBottom: '24px' }}>
                        Product Not Found
                    </h1>
                    <Link
                        to="/products"
                        className="label-caps"
                        style={{ color: 'var(--on-surface)', textDecoration: 'underline' }}
                    >
                        Browse All Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
            {/* Back nav */}
            <div
                style={{ backgroundColor: 'var(--surface-white)', borderBottom: '1px solid var(--outline-variant)', padding: '20px 80px', transition: 'background-color 0.4s ease, border-color 0.4s ease' }}
                className="px-6 md:px-[80px]"
            >
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <Link
                        to="/products"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            textDecoration: 'none',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--outline)',
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.color = 'var(--on-surface)')}
                        onMouseOut={e => (e.currentTarget.style.color = 'var(--outline)')}
                    >
                        <ArrowLeft size={14} strokeWidth={1.5} />
                        All Products
                    </Link>
                </div>
            </div>

            <div
                style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 80px 120px' }}
                className="px-6 md:px-[80px]"
            >
                {/* Product detail grid */}
                <div
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '120px', alignItems: 'start' }}
                    className="grid-cols-1 lg:grid-cols-2"
                >
                    {/* Image */}
                    <div style={{ overflow: 'hidden', position: 'sticky', top: '100px' }}>
                        {product.hotspots && product.hotspots.length > 0 ? (
                            <ProductHotspots
                                image={product.image}
                                name={product.name}
                                hotspots={product.hotspots}
                            />
                        ) : (
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
                            />
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>
                            <Link
                                to={`/category/${encodeURIComponent(product.category)}`}
                                style={{ color: 'var(--outline)', textDecoration: 'none' }}
                                onMouseOver={e => (e.currentTarget.style.color = 'var(--on-surface)')}
                                onMouseOut={e => (e.currentTarget.style.color = 'var(--outline)')}
                            >
                                {product.category}
                            </Link>
                        </p>
                        <h1
                            className="font-caslon"
                            style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 400, color: 'var(--on-surface)', lineHeight: 1.2, marginBottom: '24px' }}
                        >
                            {product.name}
                        </h1>
                        <p style={{ color: 'var(--on-surface-variant)', fontSize: '16px', lineHeight: '28px', marginBottom: '40px' }}>
                            {product.description}
                        </p>

                        {/* Price */}
                        <div style={{ borderTop: '1px solid var(--outline-variant)', borderBottom: '1px solid var(--outline-variant)', padding: '24px 0', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                                <span style={{ fontSize: '28px', fontWeight: 600, color: 'var(--on-surface)', fontFamily: 'Inter, sans-serif' }}>
                                    ₹{product.price.toLocaleString('en-IN')}
                                    {product.unit && (
                                        <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--outline)' }}> / {product.unit}</span>
                                    )}
                                </span>
                                {product.originalPrice && (
                                    <span style={{ fontSize: '16px', color: 'var(--outline)', textDecoration: 'line-through' }}>
                                        ₹{product.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>
                            <p className="label-caps" style={{ color: 'var(--outline)', marginTop: '8px' }}>
                                Inclusive of all taxes
                            </p>
                        </div>

                        {/* Stock */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                            {product.inStock ? (
                                <>
                                    <Check size={14} strokeWidth={2} color="var(--on-surface)" />
                                    <span className="label-caps" style={{ color: 'var(--on-surface)' }}>In Stock</span>
                                </>
                            ) : (
                                <span className="label-caps" style={{ color: 'var(--error)' }}>Out of Stock</span>
                            )}
                        </div>

                        {/* Actions: Add to Cart & WhatsApp Enquiry */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                            <button
                                onClick={() => addToCart(product)}
                                disabled={!product.inStock}
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    border: '1px solid var(--on-surface)',
                                    backgroundColor: product.inStock ? 'var(--on-surface)' : 'var(--outline-variant)',
                                    color: product.inStock ? 'var(--surface-white)' : 'var(--outline)',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    cursor: product.inStock ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'background 0.25s, color 0.25s',
                                }}
                                onMouseOver={e => {
                                    if (product.inStock) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--on-surface)';
                                    }
                                }}
                                onMouseOut={e => {
                                    if (product.inStock) {
                                        e.currentTarget.style.background = 'var(--on-surface)';
                                        e.currentTarget.style.color = 'var(--surface-white)';
                                    }
                                }}
                            >
                                <ShoppingCart size={15} strokeWidth={1.5} />
                                {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
                            </button>

                            <a
                                href={`https://wa.me/918193830391?text=${encodeURIComponent(
                                    `Hello Noori Marbles,\n\nI would like to enquire about this product:\n` +
                                    `• Product: ${product.name}\n` +
                                    `• Category: ${product.category}\n` +
                                    `• Price: ₹${product.price.toLocaleString('en-IN')}/${product.unit || 'pc'}\n\n` +
                                    `Please share more details and availability.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    border: '1px solid #25D366',
                                    backgroundColor: '#25D366',
                                    color: '#ffffff',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'background 0.25s, color 0.25s',
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#25D366';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.background = '#25D366';
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                            >
                                <MessageSquare size={15} strokeWidth={1.5} />
                                Enquire on WhatsApp
                            </a>
                        </div>

                        {/* Product highlights */}
                        <div>
                            <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>
                                Product Highlights
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                {[
                                    'Premium quality guaranteed',
                                    'Expert installation support available',
                                    'Warranty covered',
                                    'Easy returns within 7 days',
                                ].map((item, idx, arr) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '14px 0',
                                            borderBottom: idx < arr.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                                        }}
                                    >
                                        <Check size={13} strokeWidth={2} color="var(--on-surface)" />
                                        <span style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '80px' }}>
                        <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>Related</p>
                        <h2
                            className="font-caslon"
                            style={{ fontSize: '32px', fontWeight: 400, color: 'var(--on-surface)', marginBottom: '48px' }}
                        >
                            You May Also Like
                        </h2>
                        <ProductCarousel
                            title=""
                            products={relatedProducts}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
