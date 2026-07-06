
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
    const orderId = sessionStorage.getItem('orderId') || 'N/A';
    const paymentMethod = sessionStorage.getItem('paymentMethod') || 'N/A';
    const total = sessionStorage.getItem('orderTotal') || '0';
    const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');

    useEffect(() => {
        return () => {};
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
            {/* Page header */}
            <div style={{ backgroundColor: 'var(--surface-white)', borderBottom: '1px solid var(--outline-variant)', padding: '64px 80px 48px', transition: 'background-color 0.4s ease, border-color 0.4s ease' }}
                className="px-6 md:px-[80px]">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <CheckCircle size={24} color="var(--on-surface)" strokeWidth={1.5} />
                        <p className="label-caps" style={{ color: 'var(--outline)' }}>Order Confirmed</p>
                    </div>
                    <h1 className="font-caslon" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, color: 'var(--on-surface)' }}>
                        Thank You for Your Order.
                    </h1>
                    <p style={{ color: 'var(--outline)', fontSize: '15px', marginTop: '12px' }}>
                        We've received your order and will be in touch shortly.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 80px 120px' }}
                className="px-6 md:px-[80px]">

                {/* Order number */}
                <div style={{ border: '1px solid var(--outline-variant)', padding: '32px', marginBottom: '48px', backgroundColor: 'var(--surface-white)' }}>
                    <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '8px' }}>Order Number</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 700, color: 'var(--on-surface)', letterSpacing: '0.05em' }}>
                        {orderId}
                    </p>
                </div>

                {/* Order details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '48px' }}
                    className="grid-cols-1 sm:grid-cols-2">
                    <div style={{ border: '1px solid var(--outline-variant)', padding: '24px', backgroundColor: 'var(--surface-white)' }}>
                        <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '8px' }}>Order Amount</p>
                        <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--on-surface)' }}>
                            ₹{parseFloat(total).toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div style={{ border: '1px solid var(--outline-variant)', padding: '24px', backgroundColor: 'var(--surface-white)' }}>
                        <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '8px' }}>Payment Method</p>
                        <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--on-surface)' }}>{paymentMethod}</p>
                    </div>
                    <div style={{ border: '1px solid var(--outline-variant)', padding: '24px', gridColumn: '1 / -1', backgroundColor: 'var(--surface-white)' }}>
                        <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '12px' }}>Delivery Address</p>
                        <p style={{ fontSize: '15px', color: 'var(--on-surface)', fontWeight: 500 }}>{customerInfo.name}</p>
                        <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '22px' }}>
                            {customerInfo.address}<br />
                            {customerInfo.city}, {customerInfo.state} — {customerInfo.pincode}<br />
                            {customerInfo.phone} · {customerInfo.email}
                        </p>
                    </div>
                </div>

                {/* What's next */}
                <div style={{ marginBottom: '48px' }}>
                    <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '24px' }}>What's Next</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {[
                            { icon: <CheckCircle size={16} strokeWidth={1.5} />, title: 'Order Confirmed', desc: "We've received your order and will process it shortly.", active: true },
                            { icon: <Package size={16} strokeWidth={1.5} />, title: 'Preparing for Dispatch', desc: 'Your order will be carefully packed and prepared.', active: false },
                            { icon: <Home size={16} strokeWidth={1.5} />, title: 'Out for Delivery', desc: 'Estimated delivery: 5–7 business days.', active: false },
                        ].map((step, idx, arr) => (
                            <div key={step.title}
                                style={{
                                    display: 'flex', gap: '20px', padding: '24px 0',
                                    borderBottom: idx < arr.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                                }}>
                                <div style={{ color: step.active ? 'var(--on-surface)' : 'var(--outline-variant)', flexShrink: 0, paddingTop: '2px' }}>
                                    {step.icon}
                                </div>
                                <div>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: step.active ? 'var(--on-surface)' : 'var(--outline)', marginBottom: '4px' }}>
                                        {step.title}
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'var(--outline)', lineHeight: '20px' }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '16px' }} className="flex-col sm:flex-row">
                    <Link
                        to="/my-orders"
                        style={{
                            flex: 1, display: 'block', border: '1px solid var(--on-surface)',
                            backgroundColor: 'var(--on-surface)', color: 'var(--surface-white)', padding: '16px',
                            textAlign: 'center', textDecoration: 'none', fontFamily: 'Inter, sans-serif',
                            fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                            transition: 'background 0.2s, color 0.2s',
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--on-surface)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'var(--on-surface)'; e.currentTarget.style.color = 'var(--surface-white)'; }}
                    >
                        View My Orders
                    </Link>
                    <Link
                        to="/"
                        style={{
                            flex: 1, display: 'block', border: '1px solid var(--outline-variant)',
                            padding: '16px', textAlign: 'center', textDecoration: 'none',
                            fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--outline)',
                            transition: 'border-color 0.2s, color 0.2s',
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--on-surface)'; e.currentTarget.style.color = 'var(--on-surface)'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--outline-variant)'; e.currentTarget.style.color = 'var(--outline)'; }}
                    >
                        Continue Shopping
                    </Link>
                </div>

                <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '13px', color: 'var(--outline)' }}>
                    Need help?{' '}
                    <a href="tel:+919876543210" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>
                        Call +91 98765 43210
                    </a>
                </p>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
