
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { PaymentMethod } from '../types';
import { databaseService } from '../services/databaseService';
import { CreditCard, Smartphone, Wallet, Banknote, Check, Loader2 } from 'lucide-react';

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

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [upiId, setUpiId] = useState('');
    const [processing, setProcessing] = useState(false);

    const total = sessionStorage.getItem('orderTotal') || '0';
    const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');

    const paymentMethods = [
        { type: PaymentMethod.UPI, icon: Smartphone, title: 'UPI', description: 'Google Pay, PhonePe, Paytm' },
        { type: PaymentMethod.CARD, icon: CreditCard, title: 'Card', description: 'Credit or Debit Card' },
        { type: PaymentMethod.WALLET, icon: Wallet, title: 'Wallet', description: 'Paytm, PhonePe, Amazon Pay' },
        { type: PaymentMethod.COD, icon: Banknote, title: 'Cash on Delivery', description: 'Pay when you receive' },
    ];

    const handlePayment = async () => {
        if (!selectedMethod) return;
        if (selectedMethod === PaymentMethod.UPI && !upiId) {
            alert('Please enter your UPI ID');
            return;
        }
        setProcessing(true);
        try {
            const orderId = 'NM' + Date.now();
            const orderData = {
                orderId, userId: user?.id, items: cart, customerInfo,
                paymentMethod: selectedMethod,
                subtotal: parseFloat(total), tax: 0, total: parseFloat(total),
                status: 'Pending', createdAt: new Date(),
            };
            await databaseService.createOrder(orderData);
            sessionStorage.setItem('orderId', orderId);
            sessionStorage.setItem('paymentMethod', selectedMethod);
            clearCart();
            navigate('/order-confirmation');
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('Failed to process order. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const generateUPIQR = () => {
        const upiString = `upi://pay?pa=noorimarbels@paytm&pn=Noori%20Marbles&am=${total}&cu=INR`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiString)}`;
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
            {/* Page header */}
            <div style={{ backgroundColor: 'var(--surface-white)', borderBottom: '1px solid var(--outline-variant)', padding: '36px 80px 28px', transition: 'background-color 0.4s ease, border-color 0.4s ease' }}
                className="px-6 md:px-[80px]">
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 className="font-caslon" style={{ fontSize: '32px', fontWeight: 400, color: 'var(--on-surface)', margin: 0 }}>
                        Payment
                    </h1>
                    <p className="label-caps" style={{ color: 'var(--outline)', margin: 0 }}>Step 3 of 3</p>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 80px 80px' }}
                className="px-6 md:px-[80px]">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '64px', alignItems: 'start' }}
                    className="grid-cols-1 lg:grid-cols-[1fr_340px]">

                    {/* Payment Methods */}
                    <div>
                        <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>Select Method</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                            {paymentMethods.map(method => {
                                const isSelected = selectedMethod === method.type;
                                return (
                                    <button
                                        key={method.type}
                                        onClick={() => setSelectedMethod(method.type)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            padding: '16px 20px',
                                            border: `1px solid ${isSelected ? 'var(--on-surface)' : 'var(--outline-variant)'}`,
                                            backgroundColor: isSelected ? 'var(--on-surface)' : 'var(--surface-white)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            width: '100%',
                                            transition: 'border-color 0.2s, background 0.2s',
                                        }}
                                    >
                                        <method.icon
                                            size={20}
                                            strokeWidth={1.5}
                                            color={isSelected ? 'var(--surface-white)' : 'var(--outline)'}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <p style={{
                                                fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600,
                                                color: isSelected ? 'var(--surface-white)' : 'var(--on-surface)', marginBottom: '2px',
                                            }}>
                                                {method.title}
                                            </p>
                                            <p style={{ fontSize: '12px', color: isSelected ? 'var(--outline-variant)' : 'var(--outline)' }}>
                                                {method.description}
                                            </p>
                                        </div>
                                        {isSelected && <Check size={16} color="var(--surface-white)" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* UPI Form */}
                        {selectedMethod === PaymentMethod.UPI && (
                            <div style={{ border: '1px solid var(--outline-variant)', padding: '24px', marginBottom: '28px', backgroundColor: 'var(--surface-white)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', alignItems: 'center' }}
                                    className="grid-cols-1 sm:grid-cols-[1fr_auto]">
                                    <div>
                                        <label style={labelStyle}>UPI ID</label>
                                        <input
                                            type="text"
                                            placeholder="yourname@paytm"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            style={inputStyle}
                                            onFocus={e => (e.target.style.borderBottomColor = 'var(--on-surface)')}
                                            onBlur={e => (e.target.style.borderBottomColor = 'var(--outline-variant)')}
                                        />
                                        <p style={{ fontSize: '12px', color: 'var(--outline)', marginTop: '8px' }}>
                                            Enter your registered UPI ID to receive a payment request on your app.
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'center', borderLeft: '1px solid var(--outline-variant)', paddingLeft: '32px' }}
                                        className="border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 pl-0 sm:pl-8">
                                        <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '12px' }}>
                                            Or scan to pay
                                        </p>
                                        <img src={generateUPIQR()} alt="UPI QR Code" style={{ display: 'block', margin: '0 auto', width: '130px', height: '130px' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Card Form */}
                        {selectedMethod === PaymentMethod.CARD && (
                            <div style={{ border: '1px solid var(--outline-variant)', padding: '24px', marginBottom: '28px', backgroundColor: 'var(--surface-white)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <label style={labelStyle}>Card Number</label>
                                    <input type="text" placeholder="1234 5678 9012 3456"
                                        style={inputStyle} maxLength={19}
                                        onFocus={e => (e.target.style.borderBottomColor = 'var(--on-surface)')}
                                        onBlur={e => (e.target.style.borderBottomColor = 'var(--outline-variant)')}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div>
                                        <label style={labelStyle}>Expiry Date</label>
                                        <input type="text" placeholder="MM/YY"
                                            style={inputStyle} maxLength={5}
                                            onFocus={e => (e.target.style.borderBottomColor = 'var(--on-surface)')}
                                            onBlur={e => (e.target.style.borderBottomColor = 'var(--outline-variant)')}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>CVV</label>
                                        <input type="text" placeholder="123"
                                            style={inputStyle} maxLength={3}
                                            onFocus={e => (e.target.style.borderBottomColor = 'var(--on-surface)')}
                                            onBlur={e => (e.target.style.borderBottomColor = 'var(--outline-variant)')}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Wallet Options */}
                        {selectedMethod === PaymentMethod.WALLET && (
                            <div style={{ border: '1px solid var(--outline-variant)', padding: '24px', marginBottom: '28px', backgroundColor: 'var(--surface-white)' }}>
                                <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>Select Wallet</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {['Paytm', 'PhonePe', 'Amazon Pay'].map(wallet => (
                                        <button key={wallet} style={{
                                            flex: 1, padding: '14px 8px', border: '1px solid var(--outline-variant)',
                                            background: 'var(--surface)', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                            fontSize: '13px', fontWeight: 600, color: 'var(--on-surface)',
                                            transition: 'border-color 0.2s, background 0.2s',
                                        }}
                                            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--on-surface)'; e.currentTarget.style.background = 'var(--surface-white)'; }}
                                            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--outline-variant)'; e.currentTarget.style.background = 'var(--surface)'; }}
                                        >{wallet}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* COD Info */}
                        {selectedMethod === PaymentMethod.COD && (
                            <div style={{ border: '1px solid var(--outline-variant)', padding: '20px 24px', marginBottom: '28px', backgroundColor: 'var(--surface-white)' }}>
                                <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '22px', margin: 0 }}>
                                    <strong>Cash on Delivery</strong> — Pay in cash when the product is delivered to your doorstep.
                                </p>
                            </div>
                        )}

                        {/* Pay button */}
                        <button
                            onClick={handlePayment}
                            disabled={processing || !selectedMethod}
                            style={{
                                width: '100%',
                                backgroundColor: !selectedMethod || processing ? 'var(--outline-variant)' : 'var(--on-surface)',
                                color: !selectedMethod || processing ? 'var(--outline)' : 'var(--surface-white)',
                                border: '1px solid var(--on-surface)',
                                padding: '16px',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '11px',
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                cursor: !selectedMethod || processing ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'background 0.25s, color 0.25s',
                            }}
                                onMouseOver={e => {
                                    if (selectedMethod && !processing) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--on-surface)';
                                    }
                                }}
                                onMouseOut={e => {
                                    if (selectedMethod && !processing) {
                                        e.currentTarget.style.background = 'var(--on-surface)';
                                        e.currentTarget.style.color = 'var(--surface-white)';
                                    }
                                }}
                        >
                            {processing
                                ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
                                : `Pay ₹${parseFloat(total).toLocaleString('en-IN')}`
                            }
                        </button>
                    </div>

                    {/* Summary */}
                    <div style={{ position: 'sticky', top: '96px', border: '1px solid var(--outline-variant)', padding: '28px', backgroundColor: 'var(--surface-white)' }}>
                        <h2 className="font-caslon" style={{ fontSize: '22px', fontWeight: 400, color: 'var(--on-surface)', margin: '0 0 20px 0' }}>
                            Summary
                        </h2>
                        <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '16px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                <span className="label-caps" style={{ color: 'var(--outline)', alignSelf: 'center' }}>Amount Due</span>
                                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--on-surface)' }}>
                                    ₹{parseFloat(total).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '16px' }}>
                            <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '12px' }}>Delivering to</p>
                            <p style={{ fontSize: '14px', color: 'var(--on-surface)', fontWeight: 500, marginBottom: '4px' }}>
                                {customerInfo.name}
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', lineHeight: '22px', margin: 0 }}>
                                {customerInfo.address}<br />
                                {customerInfo.city}, {customerInfo.state} — {customerInfo.pincode}<br />
                                {customerInfo.phone}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
