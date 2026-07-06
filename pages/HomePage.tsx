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
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', transition: 'background-color 0.4s ease' }}>
            <main>
                <Hero />
                <CategoriesGrid />

                {/* Product Catalog Section */}
                {products.length > 0 && (
                    <section
                        id="products"
                        style={{ backgroundColor: 'var(--surface)', padding: '120px 80px', transition: 'background-color 0.4s ease' }}
                        className="px-6 md:px-[80px]"
                    >
                        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                            {/* Section header */}
                            <div style={{ marginBottom: '64px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
                                <div>
                                    <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>
                                        Product Catalog
                                    </p>
                                    <h2
                                        className="font-caslon"
                                        style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 400, color: 'var(--on-surface)', lineHeight: 1.2 }}
                                    >
                                        Curated Premium Selection.
                                    </h2>
                                </div>
                            </div>

                            {Object.entries(
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
                            ))}
                        </div>
                    </section>
                )}

                <AboutSection />
                <ContactSection />
            </main>
        </div>
    );
};

export default HomePage;
