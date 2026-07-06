
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const CartPage: React.FC = () => {
    const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const { user } = useAuth();

    const subtotal = getCartTotal();
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    if (cart.length === 0) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.4s ease' }}>
                <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                    <ShoppingBag size={48} strokeWidth={1} color="var(--outline-variant)" style={{ margin: '0 auto 32px' }} />
                    <h1 className="font-caslon" style={{ fontSize: '40px', fontWeight: 400, color: 'var(--on-surface)', marginBottom: '16px' }}>
                        Your Cart is Empty
                    </h1>
                    <p style={{ color: 'var(--outline)', fontSize: '15px', marginBottom: '40px' }}>
                        You haven't added any items yet.
                    </p>
                    <Link
                        to="/products"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'var(--on-surface)',
                            color: 'var(--surface-white)',
                            padding: '14px 40px',
                            textDecoration: 'none',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            border: '1px solid var(--on-surface)',
                            transition: 'background 0.2s, color 0.2s',
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--on-surface)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = 'var(--on-surface)';
                            e.currentTarget.style.color = 'var(--surface-white)';
                        }}
                    >
                        Browse Collection <ArrowRight size={13} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
            {/* Page Header */}
            <div
                style={{ backgroundColor: 'var(--surface-white)', borderBottom: '1px solid var(--outline-variant)', padding: '64px 80px 48px', transition: 'background-color 0.4s ease, border-color 0.4s ease' }}
                className="px-6 md:px-[80px]"
            >
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>Review</p>
                    <h1 className="font-caslon" style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 400, color: 'var(--on-surface)' }}>
                        Shopping Cart
                    </h1>
                </div>
            </div>

            <div
                style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 80px 120px' }}
                className="px-6 md:px-[80px]"
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '80px', alignItems: 'start' }}
                    className="grid-cols-1 lg:grid-cols-[1fr_360px]"
                >
                    {/* Cart Items */}
                    <div>
                        {cart.map((item, idx) => (
                            <div
                                key={item.product.id}
                                style={{
                                    display: 'flex',
                                    gap: '24px',
                                    padding: '32px 0',
                                    borderBottom: '1px solid var(--outline-variant)',
                                }}
                            >
                                <Link to={`/product/${item.product.id}`} style={{ flexShrink: 0 }}>
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        style={{ width: '100px', height: '120px', objectFit: 'cover', display: 'block' }}
                                    />
                                </Link>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <div>
                                            <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '6px' }}>{item.product.category}</p>
                                            <Link
                                                to={`/product/${item.product.id}`}
                                                style={{ textDecoration: 'none', color: 'var(--on-surface)', fontSize: '16px', fontWeight: 400, fontFamily: 'Inter, sans-serif' }}
                                            >
                                                {item.product.name}
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: 'var(--outline-variant)', padding: '4px', transition: 'color 0.2s',
                                            }}
                                            onMouseOver={e => (e.currentTarget.style.color = 'var(--error)')}
                                            onMouseOut={e => (e.currentTarget.style.color = 'var(--outline-variant)')}
                                        >
                                            <Trash2 size={16} strokeWidth={1.5} />
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
                                        {/* Qty control */}
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--outline-variant)' }}>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                style={{
                                                    width: '40px', height: '40px', background: 'none', border: 'none',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'var(--on-surface)', transition: 'background 0.2s',
                                                }}
                                                onMouseOver={e => (e.currentTarget.style.background = 'var(--outline-variant)')}
                                                onMouseOut={e => (e.currentTarget.style.background = 'none')}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span style={{
                                                width: '40px', textAlign: 'center', fontSize: '14px', fontWeight: 600,
                                                color: 'var(--on-surface)', borderLeft: '1px solid var(--outline-variant)', borderRight: '1px solid var(--outline-variant)',
                                                lineHeight: '40px',
                                            }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                style={{
                                                    width: '40px', height: '40px', background: 'none', border: 'none',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'var(--on-surface)', transition: 'background 0.2s',
                                                }}
                                                onMouseOver={e => (e.currentTarget.style.background = 'var(--outline-variant)')}
                                                onMouseOut={e => (e.currentTarget.style.background = 'none')}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--on-surface)' }}>
                                                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                            <p className="label-caps" style={{ color: 'var(--outline)', marginTop: '4px' }}>
                                                ₹{item.product.price.toLocaleString('en-IN')} each
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div style={{ position: 'sticky', top: '100px', border: '1px solid var(--outline-variant)', padding: '40px', backgroundColor: 'var(--surface-white)' }}>
                        <h2 className="font-caslon" style={{ fontSize: '24px', fontWeight: 400, color: 'var(--on-surface)', marginBottom: '32px' }}>
                            Order Summary
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {[
                                { label: 'Subtotal', value: `₹${subtotal.toLocaleString('en-IN')}` },
                                { label: 'GST (18%)', value: `₹${Math.round(tax).toLocaleString('en-IN')}` },
                            ].map((row, idx) => (
                                <div
                                    key={row.label}
                                    style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        padding: '14px 0',
                                        borderBottom: '1px solid var(--outline-variant)',
                                    }}
                                >
                                    <span className="label-caps" style={{ color: 'var(--outline)', alignSelf: 'center' }}>{row.label}</span>
                                    <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--on-surface)' }}>{row.value}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0' }}>
                                <span className="label-caps" style={{ color: 'var(--on-surface)', alignSelf: 'center' }}>Total</span>
                                <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--on-surface)' }}>
                                    ₹{Math.round(total).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        <Link
                            to={user ? "/checkout" : "/signup"}
                            style={{
                                display: 'block',
                                backgroundColor: 'var(--on-surface)',
                                color: 'var(--surface-white)',
                                padding: '16px',
                                textAlign: 'center',
                                textDecoration: 'none',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '11px',
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                border: '1px solid var(--on-surface)',
                                marginBottom: '12px',
                                transition: 'background 0.2s, color 0.2s',
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--on-surface)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = 'var(--on-surface)';
                                e.currentTarget.style.color = 'var(--surface-white)';
                            }}
                        >
                            Proceed to Checkout
                        </Link>
                        <Link
                            to="/products"
                            style={{
                                display: 'block',
                                border: '1px solid var(--outline-variant)',
                                padding: '16px',
                                textAlign: 'center',
                                textDecoration: 'none',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '11px',
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: 'var(--outline)',
                                transition: 'border-color 0.2s, color 0.2s',
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.borderColor = 'var(--on-surface)';
                                e.currentTarget.style.color = 'var(--on-surface)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.borderColor = 'var(--outline-variant)';
                                e.currentTarget.style.color = 'var(--outline)';
                            }}
                        >
                            Continue Shopping
                        </Link>

                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--outline-variant)' }}>
                            {['Secure checkout', 'Free shipping on orders above ₹50,000', 'Easy returns within 7 days'].map(item => (
                                <p key={item} className="label-caps" style={{ color: 'var(--outline)', marginBottom: '8px' }}>
                                    — {item}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
