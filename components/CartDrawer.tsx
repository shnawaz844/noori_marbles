
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(26,28,28,0.4)',
                        zIndex: 60,
                        transition: 'opacity 0.3s',
                    }}
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100%',
                    width: '100%',
                    maxWidth: '420px',
                    backgroundColor: 'var(--surface-white)',
                    borderLeft: '1px solid var(--outline-variant)',
                    zIndex: 70,
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.4s ease, border-color 0.4s ease',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '24px 32px',
                        borderBottom: '1px solid var(--outline-variant)',
                    }}
                >
                    <h2
                        className="font-caslon"
                        style={{ fontSize: '22px', fontWeight: 400, color: 'var(--on-surface)' }}
                    >
                        Your Selection
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: '1px solid var(--on-surface)',
                            cursor: 'pointer',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--on-surface)',
                            transition: 'background 0.2s, color 0.2s',
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = 'var(--on-surface)';
                            e.currentTarget.style.color = 'var(--surface-white)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--on-surface)';
                        }}
                    >
                        <X size={16} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Cart Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px' }}>
                    {cart.length === 0 ? (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                gap: '16px',
                                textAlign: 'center',
                            }}
                        >
                            <ShoppingBag size={40} strokeWidth={1} color="var(--outline)" />
                            <div>
                                <p style={{ color: 'var(--on-surface)', fontSize: '16px', marginBottom: '4px' }}>
                                    Your cart is empty
                                </p>
                                <p className="label-caps" style={{ color: 'var(--outline)' }}>
                                    Add some products to get started
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {cart.map((item, idx) => (
                                <div
                                    key={item.product.id}
                                    style={{
                                        display: 'flex',
                                        gap: '16px',
                                        padding: '24px 0',
                                        borderBottom: idx < cart.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                                    }}
                                >
                                    <Link to={`/product/${item.product.id}`} onClick={onClose} style={{ flexShrink: 0 }}>
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            style={{ width: '72px', height: '88px', objectFit: 'cover', display: 'block' }}
                                        />
                                    </Link>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ color: 'var(--on-surface)', fontSize: '14px', fontWeight: 500, marginBottom: '4px', lineHeight: '20px' }}>
                                            {item.product.name}
                                        </p>
                                        <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '12px' }}>
                                            {item.product.category}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            {/* Qty control */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--outline-variant)' }}>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    style={{
                                                        width: '32px', height: '32px', background: 'none', border: 'none',
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: 'var(--on-surface)', transition: 'background 0.2s',
                                                    }}
                                                    onMouseOver={e => (e.currentTarget.style.background = 'var(--outline-variant)')}
                                                    onMouseOut={e => (e.currentTarget.style.background = 'none')}
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span style={{
                                                    width: '32px', textAlign: 'center',
                                                    fontSize: '13px', fontWeight: 600, color: 'var(--on-surface)',
                                                    borderLeft: '1px solid var(--outline-variant)', borderRight: '1px solid var(--outline-variant)',
                                                    lineHeight: '32px',
                                                }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    style={{
                                                        width: '32px', height: '32px', background: 'none', border: 'none',
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: 'var(--on-surface)', transition: 'background 0.2s',
                                                    }}
                                                    onMouseOver={e => (e.currentTarget.style.background = 'var(--outline-variant)')}
                                                    onMouseOut={e => (e.currentTarget.style.background = 'none')}
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--on-surface)' }}>
                                                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                                </p>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="label-caps"
                                                    style={{
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: 'var(--outline)', marginTop: '4px', transition: 'color 0.2s',
                                                    }}
                                                    onMouseOver={e => (e.currentTarget.style.color = 'var(--error)')}
                                                    onMouseOut={e => (e.currentTarget.style.color = 'var(--outline)')}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div
                        style={{
                            borderTop: '1px solid var(--outline-variant)',
                            padding: '24px 32px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span className="label-caps" style={{ color: 'var(--outline)', alignSelf: 'center' }}>Subtotal</span>
                            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--on-surface)' }}>
                                ₹{getCartTotal().toLocaleString('en-IN')}
                            </span>
                        </div>
                        <Link
                            to="/cart"
                            onClick={onClose}
                            style={{
                                display: 'block',
                                border: '1px solid var(--on-surface)',
                                padding: '14px',
                                textAlign: 'center',
                                textDecoration: 'none',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '11px',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: 'var(--on-surface)',
                                backgroundColor: 'transparent',
                                transition: 'background 0.2s, color 0.2s',
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.background = 'var(--outline-variant)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            View Cart
                        </Link>
                        <Link
                            to="/checkout"
                            onClick={onClose}
                            style={{
                                display: 'block',
                                border: '1px solid var(--on-surface)',
                                backgroundColor: 'var(--on-surface)',
                                padding: '14px',
                                textAlign: 'center',
                                textDecoration: 'none',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '11px',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: 'var(--surface-white)',
                                transition: 'opacity 0.2s, background 0.2s, color 0.2s',
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.opacity = '0.85';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.opacity = '1';
                            }}
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
