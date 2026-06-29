
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartPage: React.FC = () => {
    const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

    const subtotal = getCartTotal();
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                        <ShoppingBag size={80} className="text-slate-300 mx-auto mb-6" />
                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Your Cart is Empty</h1>
                        <p className="text-slate-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-600 transition-colors"
                        >
                            Browse Products
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.product.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex gap-6">
                                    <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-32 h-32 object-cover rounded-lg hover:opacity-75 transition-opacity"
                                        />
                                    </Link>

                                    <div className="flex-1">
                                        <div className="flex justify-between mb-2">
                                            <div>
                                                <Link to={`/product/${item.product.id}`}>
                                                    <h3 className="font-bold text-lg text-slate-900 hover:text-amber-600 transition-colors">
                                                        {item.product.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-slate-500">{item.product.category}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-2 h-fit"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3 bg-slate-100 rounded-lg border border-slate-200">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="p-3 hover:bg-slate-200 rounded-l-lg transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="px-4 font-semibold min-w-[40px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="p-3 hover:bg-slate-200 rounded-r-lg transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-slate-900">
                                                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    ₹{item.product.price.toLocaleString('en-IN')} each
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-32">
                            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>GST (18%)</span>
                                    <span className="font-semibold">₹{tax.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between text-lg">
                                    <span className="font-bold">Total</span>
                                    <span className="font-bold text-2xl text-amber-600">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="block w-full bg-amber-500 text-white py-4 rounded-lg font-semibold text-center hover:bg-amber-600 transition-colors mb-3"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                to="/products"
                                className="block w-full bg-slate-100 text-slate-700 py-4 rounded-lg font-semibold text-center hover:bg-slate-200 transition-colors"
                            >
                                Continue Shopping
                            </Link>

                            <div className="mt-6 pt-6 border-t text-sm text-slate-500 space-y-2">
                                <p>✓ Secure checkout</p>
                                <p>✓ Free shipping on orders above ₹50,000</p>
                                <p>✓ Easy returns within 7 days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
