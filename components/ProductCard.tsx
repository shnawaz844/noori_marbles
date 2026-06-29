
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart, isInCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <Link to={`/product/${product.id}`} className="group block">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Hover Overlay with Price and Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3">
                        <button
                            onClick={handleAddToCart}
                            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-slate-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-amber-500 hover:text-white shadow-lg"
                        >
                            <ShoppingCart size={18} />
                            {isInCart(product.id) ? 'Added' : 'Add to Cart'}
                        </button>
                        <Link
                            to={`/product/${product.id}`}
                            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 bg-white text-slate-900 p-3 rounded-full hover:bg-amber-500 hover:text-white shadow-lg"
                        >
                            <Eye size={18} />
                        </Link>
                    </div>

                    {/* Stock Badge */}
                    {!product.inStock && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            Out of Stock
                        </div>
                    )}
                </div>

                <div className="p-5">
                    <div className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-2">
                        {product.category}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-slate-900">
                                ₹{product.price.toLocaleString('en-IN')}
                                {product.unit && <span className="text-sm text-slate-500 font-normal ml-1">/ {product.unit}</span>}
                            </div>
                            {product.originalPrice && (
                                <div className="text-sm text-slate-400 line-through">
                                    ₹{product.originalPrice.toLocaleString('en-IN')}
                                </div>
                            )}
                        </div>
                        {product.originalPrice && (
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
