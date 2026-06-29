
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react';

const CategoryPage: React.FC = () => {
    const { products } = useProducts();
    const { categoryName } = useParams<{ categoryName: string }>();
    const decodedCategory = categoryName ? decodeURIComponent(categoryName) : '';

    const productsInCategory = products.filter(p => p.category === decodedCategory);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-500 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
                        {decodedCategory}
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Explore our premium collection of {decodedCategory.toLowerCase()} for your interior projects
                    </p>
                </div>

                {/* Products Grid */}
                {productsInCategory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productsInCategory.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-16 text-center">
                        <p className="text-slate-500 text-lg mb-4">No products available in this category yet.</p>
                        <Link to="/products" className="text-amber-500 font-semibold hover:text-amber-600">
                            Browse All Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
