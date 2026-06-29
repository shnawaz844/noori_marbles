import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const CategoriesGrid: React.FC = () => {
    return (
        <section id="categories" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Complete Solution for All Interior Needs</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Explore our wide range of premium materials and fittings curated to bring your architectural vision to life.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
                    {CATEGORIES.map((category) => (
                        <Link
                            key={category}
                            to={`/category/${encodeURIComponent(category)}`}
                            className="group relative h-40 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-amber-500/80 transition-colors flex flex-col items-center justify-center p-4 text-center">
                                <h4 className="text-white font-bold text-sm uppercase tracking-wider">{category}</h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesGrid;
