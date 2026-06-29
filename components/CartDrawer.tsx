
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
                    className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-2xl font-serif font-bold text-slate-900">
                            Shopping Cart
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <ShoppingBag size={64} className="text-slate-300 mb-4" />
                                <p className="text-slate-500 text-lg mb-2">Your cart is empty</p>
                                <p className="text-slate-400 text-sm">Add some products to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.product.id} className="flex gap-4 bg-slate-50 p-4 rounded-lg">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 mb-1">{item.product.name}</h3>
                                            <p className="text-sm text-slate-500 mb-2">
                                                ₹{item.product.price.toLocaleString('en-IN')}
                                                {item.product.unit && <span className="text-[10px] text-slate-400 font-normal ml-1">/ {item.product.unit}</span>}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-slate-100 rounded-l-lg transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-3 font-semibold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-slate-100 rounded-r-lg transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="text-red-500 text-xs font-semibold hover:text-red-700 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="border-t p-6 space-y-4">
                            <div className="flex justify-between text-lg">
                                <span className="font-semibold">Subtotal:</span>
                                <span className="font-bold text-xl">₹{getCartTotal().toLocaleString('en-IN')}</span>
                            </div>
                            <div className="space-y-2">
                                <Link
                                    to="/cart"
                                    onClick={onClose}
                                    className="block w-full bg-slate-900 text-white py-3 rounded-lg font-semibold text-center hover:bg-slate-800 transition-colors"
                                >
                                    View Cart
                                </Link>
                                <Link
                                    to="/checkout"
                                    onClick={onClose}
                                    className="block w-full bg-amber-500 text-white py-3 rounded-lg font-semibold text-center hover:bg-amber-600 transition-colors"
                                >
                                    Checkout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
