
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { Search, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0 0 12px 0',
    border: 'none',
    borderBottom: '1px solid var(--outline-variant)',
    background: 'transparent',
    fontSize: '15px',
    color: 'var(--on-surface)',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Inter, sans-serif',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--outline)',
    marginBottom: '10px',
};

const optionStyle: React.CSSProperties = {
    backgroundColor: 'var(--surface-white)',
    color: 'var(--on-surface)',
};

const ProductsPage: React.FC = () => {
    const { products, categories } = useProducts();
    const { theme } = useTheme();
    const categoryList = categories && categories.length > 0 ? categories.map(c => c.name) : CATEGORIES;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('default');

    let filteredProducts = products;

    if (selectedCategory !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    if (sortBy === 'price-low') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
            {/* Page header */}
            <div
                style={{
                    backgroundColor: 'var(--surface-white)',
                    borderBottom: '1px solid var(--outline-variant)',
                    padding: '64px 80px 48px',
                    transition: 'background-color 0.4s ease, border-color 0.4s ease',
                }}
                className="px-6 md:px-[80px]"
            >
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '16px' }}>
                        Complete Collection
                    </p>
                    <h1
                        className="font-caslon"
                        style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 400, color: 'var(--on-surface)', lineHeight: 1.1 }}
                    >
                        All Products
                    </h1>
                </div>
            </div>

            <div
                style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 80px 120px' }}
                className="px-6 md:px-[80px]"
            >
                {/* Filters */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '48px',
                        marginBottom: '64px',
                        paddingBottom: '48px',
                        borderBottom: '1px solid var(--outline-variant)',
                    }}
                    className="grid-cols-1 md:grid-cols-3"
                >
                    {/* Search */}
                    <div>
                        <label style={labelStyle}>Search</label>
                        <div style={{ position: 'relative' }}>
                            <Search
                                size={14}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--outline)',
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Search products…"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ ...inputStyle, paddingLeft: '24px' }}
                                onFocus={e => (e.target.style.borderBottomColor = 'var(--on-surface)')}
                                onBlur={e => (e.target.style.borderBottomColor = 'var(--outline-variant)')}
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label style={labelStyle}>Category</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', paddingRight: '24px', colorScheme: theme }}
                                onFocus={e => (e.target.style.borderBottomColor = 'var(--on-surface)')}
                                onBlur={e => (e.target.style.borderBottomColor = 'var(--outline-variant)')}
                            >
                                <option value="All" style={optionStyle}>All Categories</option>
                                {categoryList.map(cat => (
                                    <option key={cat} value={cat} style={optionStyle}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown
                                size={14}
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--outline)',
                                    pointerEvents: 'none',
                                }}
                            />
                        </div>
                    </div>

                    {/* Sort */}
                    <div>
                        <label style={labelStyle}>Sort By</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', paddingRight: '24px', colorScheme: theme }}
                                onFocus={e => (e.target.style.borderBottomColor = 'var(--on-surface)')}
                                onBlur={e => (e.target.style.borderBottomColor = 'var(--outline-variant)')}
                            >
                                <option value="default" style={optionStyle}>Default Sorting</option>
                                <option value="name" style={optionStyle}>Name (A–Z)</option>
                                <option value="price-low" style={optionStyle}>Price (Low to High)</option>
                                <option value="price-high" style={optionStyle}>Price (High to Low)</option>
                            </select>
                            <ChevronDown
                                size={14}
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--outline)',
                                    pointerEvents: 'none',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p className="label-caps" style={{ color: 'var(--outline)' }}>
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                    </p>
                    {(searchTerm || selectedCategory !== 'All' || sortBy !== 'default') && (
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSortBy('default'); }}
                            className="label-caps"
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--outline)', textDecoration: 'underline', transition: 'color 0.2s',
                            }}
                            onMouseOver={e => (e.currentTarget.style.color = 'var(--on-surface)')}
                            onMouseOut={e => (e.currentTarget.style.color = 'var(--outline)')}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '48px 32px' }}
                    >
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '80px 0', textAlign: 'center' }}>
                        <p className="font-caslon" style={{ fontSize: '24px', color: 'var(--on-surface)', marginBottom: '16px' }}>
                            No products found.
                        </p>
                        <p style={{ color: 'var(--outline)', fontSize: '15px' }}>
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
