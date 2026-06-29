
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Home, Download } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
    const orderId = sessionStorage.getItem('orderId') || 'N/A';
    const paymentMethod = sessionStorage.getItem('paymentMethod') || 'N/A';
    const total = sessionStorage.getItem('orderTotal') || '0';
    const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');

    useEffect(() => {
        // Clear session storage after showing confirmation
        return () => {
            // Don't clear immediately, wait for user to navigate away
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Message */}
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>

                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-slate-600 text-lg mb-8">
                        Thank you for your order. We'll send you a confirmation email shortly.
                    </p>

                    <div className="bg-amber-50 rounded-xl p-6 inline-block">
                        <div className="text-sm text-slate-600 mb-2">Order Number</div>
                        <div className="text-3xl font-bold text-amber-600">{orderId}</div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Order Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="text-sm text-slate-500 mb-1">Order Amount</div>
                            <div className="text-2xl font-bold text-slate-900">₹{parseFloat(total).toLocaleString('en-IN')}</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 mb-1">Payment Method</div>
                            <div className="text-lg font-semibold text-slate-900">{paymentMethod}</div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="text-sm text-slate-500 mb-2">Delivery Address</div>
                            <div className="text-slate-900">
                                <p className="font-semibold">{customerInfo.name}</p>
                                <p>{customerInfo.address}</p>
                                <p>{customerInfo.city}, {customerInfo.state} - {customerInfo.pincode}</p>
                                <p>{customerInfo.phone}</p>
                                <p>{customerInfo.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">What's Next?</h2>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle size={24} className="text-white" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 mb-1">Order Confirmed</div>
                                <div className="text-sm text-slate-600">We've received your order and will process it shortly.</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <Package size={24} className="text-slate-600" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 mb-1">Preparing for Dispatch</div>
                                <div className="text-sm text-slate-600">Your order will be prepared and packed carefully.</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <Home size={24} className="text-slate-600" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 mb-1">Out for Delivery</div>
                                <div className="text-sm text-slate-600">Estimated delivery: 5-7 business days.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                        <Download size={20} />
                        Download Invoice
                    </button>
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 bg-amber-500 text-white py-4 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Contact Info */}
                <div className="mt-8 text-center text-slate-600 text-sm">
                    <p>Need help with your order?</p>
                    <p className="font-semibold text-amber-600">Call us at +91 98765 43210</p>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
