
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import ProductCarousel from '../components/ProductCarousel';
import ProductHotspots from '../components/ProductHotspots';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { addToCart, isInCart } = useCart();
    const { products, getProductById } = useProducts();

    const product = getProductById(productId || '');
    const relatedProducts = product ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) : [];

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl p-16 text-center">
                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Product Not Found</h1>
                        <Link to="/products" className="text-amber-500 font-semibold hover:text-amber-600">
                            Browse All Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-500 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Products
                </Link>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Product Image */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                        {product.hotspots && product.hotspots.length > 0 ? (
                            <ProductHotspots
                                image={product.image}
                                name={product.name}
                                hotspots={product.hotspots}
                            />
                        ) : (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-[500px] object-cover"
                            />
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="text-sm text-amber-600 font-semibold uppercase tracking-wider mb-2">
                                {product.category}
                            </div>
                            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">
                                {product.name}
                            </h1>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="bg-slate-50 rounded-xl p-6">
                            <div className="flex items-baseline gap-4 mb-2">
                                <div className="text-4xl font-bold text-slate-900">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </div>
                                {product.originalPrice && (
                                    <>
                                        <div className="text-xl text-slate-400 line-through">
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </div>
                                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                            Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                        </div>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-slate-500">Price inclusive of all taxes</p>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            {product.inStock ? (
                                <>
                                    <Check size={20} className="text-green-600" />
                                    <span className="text-green-600 font-semibold">In Stock</span>
                                </>
                            ) : (
                                <span className="text-red-600 font-semibold">Out of Stock</span>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => addToCart(product)}
                                disabled={!product.inStock}
                                className={`flex-1 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${product.inStock
                                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingCart size={20} />
                                {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t pt-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Category:</span>
                                <Link to={`/category/${encodeURIComponent(product.category)}`} className="font-semibold text-amber-600 hover:text-amber-700">
                                    {product.category}
                                </Link>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Product ID:</span>
                                <span className="font-semibold text-slate-900">{product.id}</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-amber-50 rounded-xl p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Product Highlights</h3>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li>✓ Premium quality guaranteed</li>
                                <li>✓ Expert installation support available</li>
                                <li>✓ Warranty covered</li>
                                <li>✓ Easy returns within 7 days</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <ProductCarousel
                            title="Related Products"
                            products={relatedProducts}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
