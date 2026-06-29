
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CustomerInfo } from '../types';

const CheckoutPage: React.FC = () => {
    const { cart, getCartTotal } = useCart();
    const navigate = useNavigate();

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

    const subtotal = getCartTotal();
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const validateForm = () => {
        const newErrors: Partial<CustomerInfo> = {};

        if (!customerInfo.name.trim()) newErrors.name = 'Name is required';
        if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Email is invalid';
        if (!customerInfo.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^[0-9]{10}$/.test(customerInfo.phone)) newErrors.phone = 'Phone must be 10 digits';
        if (!customerInfo.address.trim()) newErrors.address = 'Address is required';
        if (!customerInfo.city.trim()) newErrors.city = 'City is required';
        if (!customerInfo.state.trim()) newErrors.state = 'State is required';
        if (!customerInfo.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^[0-9]{6}$/.test(customerInfo.pincode)) newErrors.pincode = 'Pincode must be 6 digits';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            // Store customer info in sessionStorage for payment page
            sessionStorage.setItem('customerInfo', JSON.stringify(customerInfo));
            sessionStorage.setItem('orderTotal', total.toString());
            navigate('/payment');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof CustomerInfo]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Your cart is empty</h1>
                        <p className="text-slate-500 mb-8">Add some products before checking out.</p>
                        <Link to="/products" className="inline-block bg-amber-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-600 transition-colors">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl p-8 shadow-sm">
                            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Shipping Information</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={customerInfo.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                                            placeholder="John Doe"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={customerInfo.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={customerInfo.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-slate-200'}`}
                                        placeholder="9876543210"
                                        maxLength={10}
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={customerInfo.address}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-slate-200'}`}
                                        placeholder="Street address, apartment, suite, etc."
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={customerInfo.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-slate-200'}`}
                                            placeholder="Bareilly"
                                        />
                                        {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={customerInfo.state}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.state ? 'border-red-500' : 'border-slate-200'}`}
                                            placeholder="Uttar Pradesh"
                                        />
                                        {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={customerInfo.pincode}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${errors.pincode ? 'border-red-500' : 'border-slate-200'}`}
                                            placeholder="243001"
                                            maxLength={6}
                                        />
                                        {errors.pincode && <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <Link
                                        to="/cart"
                                        className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-lg font-semibold text-center hover:bg-slate-200 transition-colors"
                                    >
                                        Back to Cart
                                    </Link>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-amber-500 text-white py-4 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-32">
                            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {cart.map(item => (
                                    <div key={item.product.id} className="flex gap-3 text-sm">
                                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-900">{item.product.name}</div>
                                            <div className="text-slate-500">Qty: {item.quantity}</div>
                                        </div>
                                        <div className="font-semibold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t pt-4">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>GST (18%)</span>
                                    <span className="font-semibold">₹{tax.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl text-amber-600">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
