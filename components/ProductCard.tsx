
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart, isInCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <Link
            to={`/product/${product.id}`}
            style={{ textDecoration: 'none', display: 'block' }}
            className="group"
        >
            {/* Image area */}
            <div
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'var(--outline-variant)',
                    paddingBottom: '125%', // portrait aspect ratio
                }}
            >
                <img
                    src={product.image}
                    alt={product.name}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                    className="group-hover:scale-[1.04]"
                />

                {/* Out of stock label */}
                {!product.inStock && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            backgroundColor: 'var(--surface-white)',
                            color: 'var(--on-surface)',
                            padding: '4px 10px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '10px',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Out of Stock
                    </div>
                )}

                {/* Hover overlay with add-to-cart */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0)',
                        transition: 'background-color 0.3s',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '20px',
                    }}
                    className="group-hover:bg-black/30"
                >
                    <button
                        onClick={handleAddToCart}
                        style={{
                            width: '100%',
                            backgroundColor: 'var(--surface-white)',
                            color: 'var(--on-surface)',
                            border: 'none',
                            padding: '12px 16px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '10px',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            opacity: 0,
                            transform: 'translateY(8px)',
                            transition: 'opacity 0.3s, transform 0.3s, background 0.2s, color 0.2s',
                        }}
                        className="group-hover:opacity-100 group-hover:translate-y-0"
                        onMouseOver={e => {
                            e.currentTarget.style.background = 'var(--on-surface)';
                            e.currentTarget.style.color = 'var(--surface-white)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = 'var(--surface-white)';
                            e.currentTarget.style.color = 'var(--on-surface)';
                        }}
                    >
                        <ShoppingCart size={13} strokeWidth={1.5} />
                        {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Caption */}
            <div style={{ padding: '16px 0 0 0' }}>
                <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '6px' }}>
                    {product.category}
                </p>
                <p
                    style={{
                        color: 'var(--on-surface)',
                        fontSize: '15px',
                        fontWeight: 400,
                        lineHeight: '22px',
                        marginBottom: '6px',
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    {product.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--on-surface)', fontSize: '14px', fontWeight: 600 }}>
                        ₹{product.price.toLocaleString('en-IN')}
                        {product.unit && (
                            <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--outline)' }}> / {product.unit}</span>
                        )}
                    </span>
                    {product.originalPrice && (
                        <span style={{ fontSize: '12px', color: 'var(--outline)', textDecoration: 'line-through' }}>
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
