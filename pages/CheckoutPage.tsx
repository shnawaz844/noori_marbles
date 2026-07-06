
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CustomerInfo } from '../types';

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 0',
    border: 'none',
    borderBottom: '1px solid var(--outline-variant)',
    background: 'transparent',
    fontSize: '15px',
    color: 'var(--on-surface)',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
};

const inputErrorStyle: React.CSSProperties = {
    ...inputStyle,
    borderBottomColor: 'var(--error)',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Inter, sans-serif',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--outline)',
    marginBottom: '8px',
};

const CheckoutPage: React.FC = () => {
    const { cart, getCartTotal } = useCart();
    const navigate = useNavigate();

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
    });
    const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

    const subtotal = getCartTotal();
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const validateForm = () => {
        const newErrors: Partial<CustomerInfo> = {};
        if (!customerInfo.name.trim()) newErrors.name = 'Required';
        if (!customerInfo.email.trim()) newErrors.email = 'Required';
        else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Invalid email';
        if (!customerInfo.phone.trim()) newErrors.phone = 'Required';
        else if (!/^[0-9]{10}$/.test(customerInfo.phone)) newErrors.phone = '10 digits required';
        if (!customerInfo.address.trim()) newErrors.address = 'Required';
        if (!customerInfo.city.trim()) newErrors.city = 'Required';
        if (!customerInfo.state.trim()) newErrors.state = 'Required';
        if (!customerInfo.pincode.trim()) newErrors.pincode = 'Required';
        else if (!/^[0-9]{6}$/.test(customerInfo.pincode)) newErrors.pincode = '6 digits required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            sessionStorage.setItem('customerInfo', JSON.stringify(customerInfo));
            sessionStorage.setItem('orderTotal', total.toString());
            navigate('/payment');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof CustomerInfo]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.4s ease' }}>
                <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                    <h1 className="font-caslon" style={{ fontSize: '40px', fontWeight: 400, color: 'var(--on-surface)', marginBottom: '16px' }}>
                        Your cart is empty
                    </h1>
                    <Link to="/products" className="label-caps" style={{ color: 'var(--on-surface)', textDecoration: 'underline' }}>
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
            {/* Page header */}
            <div style={{ backgroundColor: 'var(--surface-white)', borderBottom: '1px solid var(--outline-variant)', padding: '64px 80px 48px', transition: 'background-color 0.4s ease, border-color 0.4s ease' }}
                className="px-6 md:px-[80px]">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>Step 2 of 3</p>
                    <h1 className="font-caslon" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, color: 'var(--on-surface)' }}>
                        Shipping Details
                    </h1>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 80px 120px' }}
                className="px-6 md:px-[80px]">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '80px', alignItems: 'start' }}
                    className="grid-cols-1 lg:grid-cols-[1fr_340px]">

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}
                            className="grid-cols-1 sm:grid-cols-2">
                            <div>
                                <label style={labelStyle}>Full Name *</label>
                                <input type="text" name="name" value={customerInfo.name}
                                    onChange={handleInputChange} placeholder="John Doe"
                                    style={errors.name ? inputErrorStyle : inputStyle}
                                    onFocus={e => { if (!errors.name) e.target.style.borderBottomColor = 'var(--on-surface)'; }}
                                    onBlur={e => { if (!errors.name) e.target.style.borderBottomColor = 'var(--outline-variant)'; }}
                                />
                                {errors.name && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{errors.name}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Email *</label>
                                <input type="email" name="email" value={customerInfo.email}
                                    onChange={handleInputChange} placeholder="you@example.com"
                                    style={errors.email ? inputErrorStyle : inputStyle}
                                    onFocus={e => { if (!errors.email) e.target.style.borderBottomColor = 'var(--on-surface)'; }}
                                    onBlur={e => { if (!errors.email) e.target.style.borderBottomColor = 'var(--outline-variant)'; }}
                                />
                                {errors.email && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Phone Number *</label>
                            <input type="tel" name="phone" value={customerInfo.phone}
                                onChange={handleInputChange} placeholder="9876543210" maxLength={10}
                                style={errors.phone ? inputErrorStyle : inputStyle}
                                onFocus={e => { if (!errors.phone) e.target.style.borderBottomColor = 'var(--on-surface)'; }}
                                onBlur={e => { if (!errors.phone) e.target.style.borderBottomColor = 'var(--outline-variant)'; }}
                            />
                            {errors.phone && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{errors.phone}</p>}
                        </div>

                        <div>
                            <label style={labelStyle}>Street Address *</label>
                            <input type="text" name="address" value={customerInfo.address}
                                onChange={handleInputChange} placeholder="Street address, apartment, suite…"
                                style={errors.address ? inputErrorStyle : inputStyle}
                                onFocus={e => { if (!errors.address) e.target.style.borderBottomColor = 'var(--on-surface)'; }}
                                onBlur={e => { if (!errors.address) e.target.style.borderBottomColor = 'var(--outline-variant)'; }}
                            />
                            {errors.address && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{errors.address}</p>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}
                            className="grid-cols-1 sm:grid-cols-3">
                            <div>
                                <label style={labelStyle}>City *</label>
                                <input type="text" name="city" value={customerInfo.city}
                                    onChange={handleInputChange} placeholder="Bareilly"
                                    style={errors.city ? inputErrorStyle : inputStyle}
                                    onFocus={e => { if (!errors.city) e.target.style.borderBottomColor = 'var(--on-surface)'; }}
                                    onBlur={e => { if (!errors.city) e.target.style.borderBottomColor = 'var(--outline-variant)'; }}
                                />
                                {errors.city && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{errors.city}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>State *</label>
                                <input type="text" name="state" value={customerInfo.state}
                                    onChange={handleInputChange} placeholder="Uttar Pradesh"
                                    style={errors.state ? inputErrorStyle : inputStyle}
                                    onFocus={e => { if (!errors.state) e.target.style.borderBottomColor = 'var(--on-surface)'; }}
                                    onBlur={e => { if (!errors.state) e.target.style.borderBottomColor = 'var(--outline-variant)'; }}
                                />
                                {errors.state && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{errors.state}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Pincode *</label>
                                <input type="text" name="pincode" value={customerInfo.pincode}
                                    onChange={handleInputChange} placeholder="243001" maxLength={6}
                                    style={errors.pincode ? inputErrorStyle : inputStyle}
                                    onFocus={e => { if (!errors.pincode) e.target.style.borderBottomColor = 'var(--on-surface)'; }}
                                    onBlur={e => { if (!errors.pincode) e.target.style.borderBottomColor = 'var(--outline-variant)'; }}
                                />
                                {errors.pincode && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{errors.pincode}</p>}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
                            <Link to="/cart" style={{
                                flex: 1, border: '1px solid var(--outline-variant)', padding: '16px',
                                textAlign: 'center', textDecoration: 'none', color: 'var(--outline)',
                                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                                letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'border-color 0.2s, color 0.2s',
                            }}
                                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--on-surface)'; e.currentTarget.style.color = 'var(--on-surface)'; }}
                                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--outline-variant)'; e.currentTarget.style.color = 'var(--outline)'; }}
                            >
                                Back to Cart
                            </Link>
                            <button type="submit" style={{
                                flex: 1, backgroundColor: 'var(--on-surface)', color: 'var(--surface-white)',
                                border: '1px solid var(--on-surface)', padding: '16px',
                                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                                transition: 'background 0.2s, color 0.2s',
                            }}
                                onMouseOver={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--on-surface)'; }}
                                onMouseOut={e => { e.currentTarget.style.background = 'var(--on-surface)'; e.currentTarget.style.color = 'var(--surface-white)'; }}
                            >
                                Continue to Payment
                            </button>
                        </div>
                    </form>

                    {/* Order Summary */}
                    <div style={{ position: 'sticky', top: '100px', border: '1px solid var(--outline-variant)', padding: '32px', backgroundColor: 'var(--surface-white)' }}>
                        <h2 className="font-caslon" style={{ fontSize: '22px', fontWeight: 400, color: 'var(--on-surface)', marginBottom: '24px' }}>
                            Order Summary
                        </h2>

                        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '0', maxHeight: '240px', overflowY: 'auto' }}>
                            {cart.map((item, idx) => (
                                <div key={item.product.id}
                                    style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--outline-variant)' }}>
                                    <img src={item.product.image} alt={item.product.name}
                                        style={{ width: '48px', height: '56px', objectFit: 'cover', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--on-surface)', marginBottom: '2px' }}>
                                            {item.product.name}
                                        </p>
                                        <p className="label-caps" style={{ color: 'var(--outline)' }}>Qty: {item.quantity}</p>
                                    </div>
                                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--on-surface)', flexShrink: 0 }}>
                                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {[
                                { label: 'Subtotal', value: `₹${subtotal.toLocaleString('en-IN')}` },
                                { label: 'GST (18%)', value: `₹${Math.round(tax).toLocaleString('en-IN')}` },
                            ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--outline-variant)' }}>
                                    <span className="label-caps" style={{ color: 'var(--outline)', alignSelf: 'center' }}>{row.label}</span>
                                    <span style={{ fontSize: '14px', color: 'var(--on-surface)' }}>{row.value}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}>
                                <span className="label-caps" style={{ color: 'var(--on-surface)', alignSelf: 'center' }}>Total</span>
                                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--on-surface)' }}>
                                    ₹{Math.round(total).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
