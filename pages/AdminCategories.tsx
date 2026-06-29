import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { Layout, Plus, Trash2, ArrowLeft, Save, Globe, Image as ImageIcon, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Category } from '../types';

const AdminCategories: React.FC = () => {
    const { categories, addCategory, deleteCategory, loading } = useProducts();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        description: ''
    });
    const [saving, setSaving] = useState(false);

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const newCategory: Category = {
                id: slug,
                name: formData.name,
                slug: slug,
                image: formData.image,
                description: formData.description
            };
            await addCategory(newCategory);
            setIsAdding(false);
            setFormData({ name: '', image: '', description: '' });
        } catch (error) {
            alert('Failed to add category');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <Link to="/admin" className="text-amber-600 font-bold flex items-center gap-2 mb-4 hover:gap-3 transition-all">
                            <ArrowLeft size={20} /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Manage Categories</h1>
                        <p className="text-slate-500">Create and organize your product collections</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-amber-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 hover:shadow-xl hover:-translate-y-1"
                    >
                        <Plus size={24} /> Create New Category
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                            <div className="relative h-48 bg-slate-200">
                                {category.image ? (
                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Layout size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
                                            deleteCategory(category.id);
                                        }
                                    }}
                                    className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg translate-y-2 group-hover:translate-y-0"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-widest mb-3">
                                    <Globe size={14} /> slug: {category.slug}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{category.name}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                                    {category.description || 'No description provided for this category.'}
                                </p>
                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400 text-xs font-medium">
                                    <span>Added on {new Date().toLocaleDateString()}</span>
                                    <div className="flex items-center gap-1">
                                        <Layout size={14} /> View Details
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Modal */}
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                        <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 md:p-10 text-white shrink-0 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-xl">
                                        <Plus size={24} />
                                    </div>
                                    <button onClick={() => setIsAdding(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold relative z-10">New Collection</h2>
                                <p className="text-amber-100 mt-1 md:mt-2 text-sm md:text-base relative z-10">Define a new product category for your catalog</p>
                            </div>

                            <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
                                <form onSubmit={handleSubmit}>
                                <div className="space-y-8">
                                    {/* Name */}
                                    <div className="group">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-amber-500 transition-colors">Category Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-amber-500 transition-colors">
                                                <Layout size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Modern Hardware"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-slate-700 font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Image URL */}
                                    <div className="group">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-amber-500 transition-colors">Cover Image URL</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-amber-500 transition-colors">
                                                <ImageIcon size={20} />
                                            </div>
                                            <input
                                                type="url"
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                placeholder="https://images.unsplash.com/..."
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-slate-700 font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="group">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-amber-500 transition-colors">Description</label>
                                        <div className="relative">
                                            <div className="absolute top-4 left-4 pointer-events-none text-slate-300 group-focus-within:text-amber-500 transition-colors">
                                                <FileText size={20} />
                                            </div>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={4}
                                                placeholder="Write a brief description of what this category includes..."
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-slate-700 font-medium resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-12">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-2 px-12 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {saving ? 'Creating...' : <><Save size={20} /> Create Category</>}
                                    </button>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const X: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default AdminCategories;
