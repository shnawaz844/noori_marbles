import React from 'react';
import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';
import CategoriesGrid from '../components/CategoriesGrid';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import { useProducts } from '../contexts/ProductContext';

const HomePage: React.FC = () => {
    const { products } = useProducts();

    return (
        <div className="min-h-screen">
            <main>
                <Hero />
                <CategoriesGrid />

                {/* Product Showcase */}
                <section id="products" className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-12">
                            <span className="text-amber-500 font-bold uppercase tracking-widest text-sm">Product Catalog</span>
                            <h2 className="text-4xl font-serif font-bold text-slate-900 mt-2">Curated Premium Selection</h2>
                        </div>

                        {products.length > 0 ? (
                            Object.entries(
                                products.reduce((acc, product) => {
                                    if (!acc[product.category]) acc[product.category] = [];
                                    acc[product.category].push(product);
                                    return acc;
                                }, {} as Record<string, typeof products>)
                            ).map(([category, catProducts]) => (
                                <ProductCarousel
                                    key={category}
                                    title={category}
                                    products={catProducts}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                No products available in the catalog yet.
                            </div>
                        )}
                    </div>
                </section>

                <AboutSection />
                <ContactSection />
            </main>
        </div>
    );
};

export default HomePage;
