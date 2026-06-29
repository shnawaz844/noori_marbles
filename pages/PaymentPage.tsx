
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { PaymentMethod } from '../types';
import { databaseService } from '../services/databaseService';
import { CreditCard, Smartphone, Wallet, Banknote, Check } from 'lucide-react';

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [upiId, setUpiId] = useState('');
    const [processing, setProcessing] = useState(false);

    const total = sessionStorage.getItem('orderTotal') || '0';
    const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');

    useEffect(() => {
        // Redirect if no customer info
        if (!customerInfo.name) {
            navigate('/checkout');
        }
    }, [customerInfo, navigate]);

    const paymentMethods = [
        {
            type: PaymentMethod.UPI,
            icon: Smartphone,
            title: 'UPI',
            description: 'Pay using Google Pay, PhonePe, Paytm'
        },
        {
            type: PaymentMethod.CARD,
            icon: CreditCard,
            title: 'Card',
            description: 'Credit or Debit Card'
        },
        {
            type: PaymentMethod.WALLET,
            icon: Wallet,
            title: 'Wallet',
            description: 'Paytm, PhonePe, Amazon Pay'
        },
        {
            type: PaymentMethod.COD,
            icon: Banknote,
            title: 'Cash on Delivery',
            description: 'Pay when you receive'
        }
    ];

    const handlePayment = async () => {
        if (!selectedMethod) {
            alert('Please select a payment method');
            return;
        }

        if (selectedMethod === PaymentMethod.UPI && !upiId) {
            alert('Please enter your UPI ID');
            return;
        }

        setProcessing(true);

        try {
            const orderId = 'NM' + Date.now();
            const orderData = {
                orderId,
                userId: user?.id,
                items: cart,
                customerInfo,
                paymentMethod: selectedMethod,
                subtotal: parseFloat(total), // Simplified
                tax: 0,
                total: parseFloat(total),
                status: 'Pending',
                createdAt: new Date()
            };

            await databaseService.createOrder(orderData);
            
            sessionStorage.setItem('orderId', orderId);
            sessionStorage.setItem('paymentMethod', selectedMethod);

            clearCart();
            setProcessing(false);
            navigate('/order-confirmation');
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('Failed to process order. Please try again.');
            setProcessing(false);
        }
    };

    const generateUPIQR = () => {
        // In production, generate real QR code for UPI
        const upiString = `upi://pay?pa=noorimarbels@paytm&pn=Noori%20Marbels&am=${total}&cu=INR`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8">Payment</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Methods */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Select Payment Method</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {paymentMethods.map(method => (
                                    <button
                                        key={method.type}
                                        onClick={() => setSelectedMethod(method.type)}
                                        className={`p-6 rounded-lg border-2 text-left transition-all ${selectedMethod === method.type
                                                ? 'border-amber-500 bg-amber-50'
                                                : 'border-slate-200 hover:border-amber-300'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <method.icon size={32} className={selectedMethod === method.type ? 'text-amber-500' : 'text-slate-400'} />
                                            <div className="flex-1">
                                                <div className="font-bold text-slate-900 mb-1">{method.title}</div>
                                                <div className="text-sm text-slate-500">{method.description}</div>
                                            </div>
                                            {selectedMethod === method.type && (
                                                <Check size={24} className="text-amber-500" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* UPI Form */}
                            {selectedMethod === PaymentMethod.UPI && (
                                <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                                    <h3 className="font-bold text-slate-900">Enter UPI ID</h3>
                                    <input
                                        type="text"
                                        placeholder="yourname@paytm"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                    <div className="text-center pt-4">
                                        <p className="text-sm text-slate-600 mb-4">Or scan QR code to pay</p>
                                        <img src={generateUPIQR()} alt="UPI QR Code" className="mx-auto rounded-lg shadow-md" />
                                    </div>
                                </div>
                            )}

                            {/* Card Form */}
                            {selectedMethod === PaymentMethod.CARD && (
                                <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            maxLength={19}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                maxLength={5}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                maxLength={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Wallet Options */}
                            {selectedMethod === PaymentMethod.WALLET && (
                                <div className="bg-slate-50 rounded-lg p-6">
                                    <h3 className="font-bold text-slate-900 mb-4">Select Wallet</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['Paytm', 'PhonePe', 'Amazon Pay'].map(wallet => (
                                            <button key={wallet} className="p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-amber-500 transition-all">
                                                <div className="font-semibold text-slate-900">{wallet}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* COD Info */}
                            {selectedMethod === PaymentMethod.COD && (
                                <div className="bg-amber-50 rounded-lg p-6">
                                    <p className="text-slate-700">
                                        <strong>Cash on Delivery:</strong> Pay in cash when the product is delivered to your doorstep.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handlePayment}
                                disabled={processing || !selectedMethod}
                                className={`w-full py-4 rounded-lg font-semibold mt-6 transition-colors ${processing || !selectedMethod
                                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                        : 'bg-amber-500 text-white hover:bg-amber-600'
                                    }`}
                            >
                                {processing ? 'Processing...' : `Pay ₹${parseFloat(total).toLocaleString('en-IN')}`}
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-32">
                            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Amount to Pay</span>
                                    <span className="font-bold text-2xl text-amber-600">₹{parseFloat(total).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4 text-sm text-slate-600 space-y-2">
                                <p><strong>Delivering to:</strong></p>
                                <p>{customerInfo.name}</p>
                                <p>{customerInfo.address}</p>
                                <p>{customerInfo.city}, {customerInfo.state} - {customerInfo.pincode}</p>
                                <p>{customerInfo.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
