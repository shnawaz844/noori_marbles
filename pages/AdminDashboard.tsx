import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { ProductCategory, Product, Hotspot } from '../types';
import { CATEGORIES } from '../constants';
import { databaseService } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, Save, X, Package, Layout, Tag, Image as ImageIcon, MapPin, ShoppingBag, MessageSquare, Mail, Phone, Calendar, Lock, ShieldCheck, ArrowRight, ExternalLink, Eye, Minus, Hash } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const { products, categories, addProduct, updateProduct, deleteProduct, refreshProducts } = useProducts();
    const { isAuthenticated, logout } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'enquiries'>('products');
    const [orders, setOrders] = useState<any[]>([]);
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastClick, setLastClick] = useState<{ x: number, y: number } | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        category: '',
        price: 0,
        quantity: 0,
        description: '',
        image: '',
        inStock: true,
        hotspots: []
    });
    const [quantityLoadingId, setQuantityLoadingId] = useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [o, e] = await Promise.all([
                databaseService.getOrders(),
                databaseService.getEnquiries()
            ]);
            setOrders(o);
            setEnquiries(e);
            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setFormData(product);
        setIsAdding(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setLoading(true);
                await deleteProduct(id);
            } catch (error) {
                alert('Failed to delete product.');
            } finally {
                setLoading(true);
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await updateProduct(formData as Product);
            } else {
                await addProduct({
                    ...formData,
                    id: Math.random().toString(36).substr(2, 9),
                } as Product);
            }
            resetForm();
        } catch (error) {
            alert('Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setIsAdding(false);
        setLastClick(null);
        setFormData({
            name: '',
            category: '',
            price: 0,
            quantity: 0,
            unit: 'piece',
            description: '',
            image: '',
            inStock: true,
            hotspots: []
        });
    };

    const handleQuantityChange = async (product: Product, delta: number) => {
        const newQty = Math.max(0, (product.quantity ?? 0) + delta);
        setQuantityLoadingId(product.id);
        try {
            await databaseService.updateProductQuantity(product.id, newQty);
            await refreshProducts();
        } catch {
            alert('Failed to update quantity.');
        } finally {
            setQuantityLoadingId(null);
        }
    };

    const handleAddHotspot = () => {
        const newHotspot: Hotspot = { productId: '', x: 50, y: 50 };
        setFormData({
            ...formData,
            hotspots: [...(formData.hotspots || []), newHotspot]
        });
    };

    const handleUpdateHotspot = (index: number, field: keyof Hotspot, value: any) => {
        const updatedHotspots = [...(formData.hotspots || [])];
        updatedHotspots[index] = { ...updatedHotspots[index], [field]: value };
        setFormData({ ...formData, hotspots: updatedHotspots });
    };

    const handleRemoveHotspot = (index: number) => {
        setFormData({
            ...formData,
            hotspots: (formData.hotspots || []).filter((_, i) => i !== index)
        });
    };

    const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await databaseService.updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (e) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                        <p className="text-slate-500 text-lg">Manage your premium product catalog</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            to="/admin/enquiries"
                            className="bg-white text-slate-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all border border-slate-200"
                        >
                            <MessageSquare size={20} /> View Enquiries
                        </Link>
                        <Link
                            to="/admin/categories"
                            className="bg-white text-slate-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all border border-slate-200"
                        >
                            <Layout size={20} /> Manage Categories
                        </Link>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Plus size={20} /> Add New Product
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-12 -mt-12 group-hover:bg-amber-100 transition-colors" />
                        <div className="flex items-center gap-6 mb-6 relative z-10">
                            <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                <Package size={28} />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-slate-900">{products.length}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Stock</div>
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm font-medium relative z-10">Product Inventory</div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-colors" />
                        <div className="flex items-center gap-6 mb-6 relative z-10">
                            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                                <Layout size={28} />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-slate-900">{categories.length}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categories</div>
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm font-medium relative z-10">Active Collections</div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full -mr-12 -mt-12 group-hover:bg-rose-100 transition-colors" />
                        <div className="flex items-center gap-6 mb-6 relative z-10">
                            <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                                <Tag size={28} />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-slate-900">
                                    {products.filter(p => !p.inStock).length}
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Restock Required</div>
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm font-medium relative z-10">Out of Stock items</div>
                    </div>

                    <Link to="/admin/enquiries" className="bg-slate-900 p-8 rounded-3xl shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all group relative overflow-hidden border border-white/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/20 transition-colors" />
                        <div className="flex items-center gap-6 mb-6 relative z-10">
                            <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/40 group-hover:scale-110 transition-transform">
                                <MessageSquare size={28} />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-white">{enquiries.length}</div>
                                <div className="text-[10px] font-black text-amber-500/70 uppercase tracking-widest">New Leads</div>
                            </div>
                        </div>
                        <div className="text-slate-400 text-sm font-medium flex items-center gap-2 relative z-10">
                            View Enquiries <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-fit">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'products' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <Package size={18} /> Products
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <ShoppingBag size={18} /> Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('enquiries')}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'enquiries' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <MessageSquare size={18} /> Enquiries
                    </button>
                </div>

                {/* Main Content */}
                {activeTab === 'products' && (
                    <>
                        {!isAdding && (
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900">Product Inventory</h3>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                                <th className="px-8 py-5">Product Master</th>
                                                <th className="px-8 py-5">Collection</th>
                                                <th className="px-8 py-5 text-right">Market Price</th>
                                                <th className="px-8 py-5 text-center">Quantity</th>
                                                <th className="px-8 py-5 text-center">Status</th>
                                                <th className="px-8 py-5 text-right">Management</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredProducts.map(product => (
                                                <tr key={product.id} className="hover:bg-amber-50/30 transition-all group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-5">
                                                            <div className="relative">
                                                                <img src={product.image} className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" alt="" />
                                                                {product.hotspots && product.hotspots.length > 0 && (
                                                                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                                                                        {product.hotspots.length}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-slate-900 text-base">{product.name}</div>
                                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref ID: {product.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200/50">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right font-black text-slate-900 text-lg">
                                                        ₹{product.price.toLocaleString('en-IN')}
                                                        <span className="text-[10px] text-slate-400 ml-1 font-bold">/{product.unit || 'pc'}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleQuantityChange(product, -1)}
                                                                disabled={quantityLoadingId === product.id || (product.quantity ?? 0) <= 0}
                                                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-500 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                            >
                                                                <Minus size={12} />
                                                            </button>
                                                            <span className={`min-w-[2.5rem] text-center text-sm font-black px-2 py-1 rounded-lg ${
                                                                (product.quantity ?? 0) === 0
                                                                    ? 'bg-rose-100 text-rose-700'
                                                                    : (product.quantity ?? 0) <= 5
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : 'bg-green-100 text-green-700'
                                                            }`}>
                                                                {quantityLoadingId === product.id ? '…' : (product.quantity ?? 0)}
                                                            </span>
                                                            <button
                                                                onClick={() => handleQuantityChange(product, 1)}
                                                                disabled={quantityLoadingId === product.id}
                                                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-green-100 hover:text-green-600 text-slate-500 flex items-center justify-center transition-all disabled:opacity-40"
                                                            >
                                                                <Plus size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex justify-center">
                                                            {product.inStock ? (
                                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border border-green-200">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                                                                </span>
                                                            ) : (
                                                                <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-rose-200">
                                                                    Out of Stock
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                            <button
                                                                onClick={() => handleEdit(product)}
                                                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-500 transition-all flex items-center justify-center shadow-sm"
                                                                title="Edit Product"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all flex items-center justify-center shadow-sm"
                                                                title="Delete Product"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {isAdding && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={resetForm} />
                                <div className="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shrink-0 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -mr-24 -mt-24" />
                                        <div className="flex justify-between items-center relative z-10">
                                            <div>
                                                <h3 className="text-3xl font-serif font-bold">
                                                    {editingId ? 'Edit Product' : 'Add New Product'}
                                                </h3>
                                                <p className="text-slate-400 mt-2">Configure product details and interactive hotspots</p>
                                            </div>
                                            <button
                                                onClick={resetForm}
                                                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-y-auto p-8 custom-scrollbar bg-white">
                                        <form onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                                                <div className="space-y-8">
                                                    <div className="group">
                                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-amber-500 transition-colors">Product Identity</label>
                                                        <div className="relative">
                                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={20} />
                                                            <input
                                                                type="text"
                                                                required
                                                                placeholder="e.g. Italian Statuario Marble"
                                                                value={formData.name}
                                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all text-slate-700 font-bold"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="group">
                                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Collection</label>
                                                            <select
                                                                required
                                                                value={formData.category}
                                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-amber-500 outline-none transition-all text-slate-700 font-bold appearance-none cursor-pointer"
                                                            >
                                                                <option value="">Select Category</option>
                                                                {categories.map(cat => (
                                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="group">
                                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pricing Strategy</label>
                                                            <div className="flex gap-2">
                                                                <div className="relative flex-1">
                                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                                                    <input
                                                                        type="number"
                                                                        required
                                                                        value={formData.price}
                                                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                                        className="w-full pl-8 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-amber-500 outline-none transition-all text-slate-700 font-bold"
                                                                    />
                                                                </div>
                                                                <select
                                                                    required
                                                                    value={formData.unit || 'piece'}
                                                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                                                    className="w-24 px-3 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-amber-500 outline-none transition-all text-slate-700 font-bold text-xs"
                                                                >
                                                                    <option value="piece">Unit</option>
                                                                    <option value="sqft">Sqft</option>
                                                                    <option value="box">Box</option>
                                                                    <option value="kg">Kg</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="group">
                                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Narrative Description</label>
                                                        <textarea
                                                            required
                                                            rows={4}
                                                            placeholder="Describe the texture, finish, and ideal use cases..."
                                                            value={formData.description}
                                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-amber-500 outline-none transition-all text-slate-700 font-medium resize-none leading-relaxed"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-8">
                                                    <div className="group">
                                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Visual Asset URL</label>
                                                        <div className="relative">
                                                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={20} />
                                                            <input
                                                                type="url"
                                                                required
                                                                placeholder="Paste high-res image link"
                                                                value={formData.image}
                                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-amber-500 outline-none transition-all text-slate-700 font-medium text-sm"
                                                            />
                                                        </div>
                                                    </div>

                                                    {formData.image && (
                                                        <div className="relative group/picker rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner">
                                                            <div className="aspect-video relative cursor-crosshair"
                                                                onClick={(e) => {
                                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                                                                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                                                                    setLastClick({ x, y });
                                                                }}
                                                            >
                                                                <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                                                
                                                                {(formData.hotspots || []).map((hs, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="absolute w-5 h-5 bg-amber-500/40 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center shadow-xl"
                                                                        style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                                                                    >
                                                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                                                    </div>
                                                                ))}

                                                                {lastClick && (
                                                                    <div
                                                                        className="absolute w-10 h-10 border-2 border-white bg-amber-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-in zoom-in duration-300"
                                                                        style={{ left: `${lastClick.x}%`, top: `${lastClick.y}%` }}
                                                                    >
                                                                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                                                    </div>
                                                                )}
                                                                
                                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/picker:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-xl">
                                                                        Click to Pin Hotspot
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {lastClick && (
                                                                <div className="p-4 bg-amber-50 border-t border-amber-100 flex items-center justify-between">
                                                                    <div className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                                                                        Coordinates: <span className="bg-white px-3 py-1 rounded-lg shadow-sm ml-2 font-mono text-xs">X:{lastClick.x}% Y:{lastClick.y}%</span>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newHotspot: Hotspot = { productId: '', x: lastClick.x, y: lastClick.y };
                                                                            setFormData({ ...formData, hotspots: [...(formData.hotspots || []), newHotspot] });
                                                                            setLastClick(null);
                                                                        }}
                                                                        className="text-[10px] font-black text-white bg-slate-900 hover:bg-black px-4 py-2 rounded-xl uppercase transition-all active:scale-95 shadow-lg"
                                                                    >
                                                                        Apply Pin
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="group">
                                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Stock Quantity</label>
                                                        <div className="relative">
                                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={18} />
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                required
                                                                placeholder="0"
                                                                value={formData.quantity ?? 0}
                                                                onChange={(e) => setFormData({ ...formData, quantity: Math.max(0, Number(e.target.value)) })}
                                                                className="w-full pl-11 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all text-slate-700 font-bold"
                                                            />
                                                        </div>
                                                        {(formData.quantity ?? 0) > 0 && (formData.quantity ?? 0) <= 5 && (
                                                            <p className="text-[10px] text-amber-600 font-bold mt-2 flex items-center gap-1">
                                                                ⚠️ Low stock — admin will be notified when quantity drops to ≤5
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-slate-50 group hover:border-amber-500/20 transition-all cursor-pointer" onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}>
                                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.inStock ? 'bg-amber-500 border-amber-500' : 'border-slate-300 bg-white'}`}>
                                                            {formData.inStock && <X size={14} className="text-white rotate-45" />}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-700 text-sm">Inventory Status</div>
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Currently available in warehouse</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hotspots Section */}
                                            <div className="border-t-2 border-slate-50 pt-12 mb-12">
                                                <div className="flex justify-between items-center mb-8">
                                                    <div>
                                                        <h4 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                                                                <MapPin size={20} />
                                                            </div>
                                                            Interactive Hotspots
                                                        </h4>
                                                        <p className="text-slate-400 text-sm mt-1">Map related products to specific areas in the preview image</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddHotspot}
                                                        className="bg-white border-2 border-slate-100 px-5 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center gap-2"
                                                    >
                                                        <Plus size={16} /> New Marker
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4">
                                                    {(formData.hotspots || []).map((hotspot, index) => (
                                                        <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 bg-slate-50 p-5 rounded-2xl border-2 border-slate-50 items-center group/hs hover:border-amber-500/20 transition-all">
                                                            <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400">#{index + 1}</div>
                                                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                <select
                                                                    value={hotspot.productId}
                                                                    onChange={(e) => handleUpdateHotspot(index, 'productId', e.target.value)}
                                                                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs font-bold outline-none"
                                                                >
                                                                    <option value="">Link Product...</option>
                                                                    {products.map(p => (
                                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                                    ))}
                                                                </select>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Custom Name"
                                                                    value={hotspot.name || ''}
                                                                    onChange={(e) => handleUpdateHotspot(index, 'name', e.target.value)}
                                                                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs font-bold outline-none"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Custom Image URL"
                                                                    value={hotspot.image || ''}
                                                                    onChange={(e) => handleUpdateHotspot(index, 'image', e.target.value)}
                                                                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-xs font-bold outline-none"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-black text-slate-400 flex items-center justify-between">
                                                                        <span>X:{hotspot.x}%</span>
                                                                        <span>Y:{hotspot.y}%</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveHotspot(index)}
                                                                className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {(!formData.hotspots || formData.hotspots.length === 0) && (
                                                        <div className="text-center py-12 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                                <MapPin size={24} />
                                                            </div>
                                                            <div className="text-slate-400 text-sm font-medium italic">Click on the image preview above to add interactive pins.</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-4 pt-10 sticky bottom-0 bg-white border-t border-slate-50 -mx-8 px-8 pb-4 z-20">
                                                <button
                                                    type="button"
                                                    onClick={resetForm}
                                                    className="px-8 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
                                                >
                                                    Discard Changes
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-2xl active:scale-95"
                                                >
                                                    <Save size={18} className="text-amber-500" /> {editingId ? 'Update Master Record' : 'Publish Product'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Transactions</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Verified customer purchases</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-8 py-5">Order ID</th>
                                        <th className="px-8 py-5">Customer Profile</th>
                                        <th className="px-8 py-5 text-right">Transaction Value</th>
                                        <th className="px-8 py-5">Confirmation Date</th>
                                        <th className="px-8 py-5 text-center">Status</th>
                                        <th className="px-8 py-5 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {orders.map(order => (
                                        <tr key={order.id} className="hover:bg-amber-50/30 transition-all group">
                                            <td className="px-8 py-6">
                                                <span className="font-mono text-xs font-black text-slate-400 group-hover:text-amber-600 transition-colors">#{order.order_id.slice(0, 8).toUpperCase()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                        {(typeof order.customer_info === 'string' ? JSON.parse(order.customer_info).name : order.customer_info?.name)?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 text-sm">{typeof order.customer_info === 'string' ? JSON.parse(order.customer_info).name : order.customer_info?.name}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{typeof order.customer_info === 'string' ? JSON.parse(order.customer_info).email : order.customer_info?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right font-black text-slate-900 text-base">
                                                ₹{order.total.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-600">
                                                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    <select
                                                        value={order.status || 'Pending'}
                                                        onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm outline-none cursor-pointer appearance-none ${
                                                            order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                            'bg-amber-100 text-amber-700 border-amber-200'
                                                        }`}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Delivered">Delivered</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {orders.length === 0 && (
                                <div className="text-center py-24">
                                    <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <h3 className="font-black text-slate-900 text-lg">No Transactions Yet</h3>
                                    <p className="text-slate-400 text-sm max-w-xs mx-auto">When customers purchase your premium solutions, they will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'enquiries' && (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Lead Stream</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Direct inquiries from potential clients</p>
                            </div>
                            <Link to="/admin/enquiries" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl active:scale-95">
                                Full Inbox <ExternalLink size={14} className="text-amber-500" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                            {enquiries.slice(0, 4).map(enquiry => (
                                <div key={enquiry.id} className="bg-slate-50/50 rounded-[32px] p-8 border-2 border-slate-50 relative group hover:bg-white hover:border-amber-500/20 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all border border-slate-100 shadow-sm">
                                                {enquiry.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-lg">{enquiry.name}</h4>
                                                <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-0.5">{enquiry.category}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-slate-600 text-sm line-clamp-2 italic font-serif leading-relaxed mb-6">
                                        "{enquiry.message}"
                                    </p>

                                    <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                            <Mail size={14} className="text-amber-500" /> {enquiry.email.length > 20 ? enquiry.email.slice(0, 18) + '...' : enquiry.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                            <Phone size={14} className="text-amber-500" /> {enquiry.phone}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {enquiries.length === 0 && (
                                <div className="md:col-span-2 text-center py-20">
                                    <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare size={40} />
                                    </div>
                                    <h3 className="font-black text-slate-900 text-lg">Inbox is Quiet</h3>
                                    <p className="text-slate-400 text-sm max-w-xs mx-auto">Customer inquiries will appear here as soon as they reach out.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Order #{selectedOrder.order_id}</h3>
                                <p className="text-sm font-bold text-slate-500 mt-1">
                                    Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100 shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h4 className="font-black text-slate-900 mb-4 uppercase tracking-widest text-xs flex items-center gap-2">
                                        <MapPin size={14} className="text-amber-500" /> Customer Info
                                    </h4>
                                    {(() => {
                                        const info = typeof selectedOrder.customer_info === 'string' ? JSON.parse(selectedOrder.customer_info) : selectedOrder.customer_info;
                                        return (
                                            <div className="space-y-2 text-sm text-slate-600 font-medium">
                                                <p><span className="font-bold text-slate-900">Name:</span> {info?.name}</p>
                                                <p><span className="font-bold text-slate-900">Email:</span> {info?.email}</p>
                                                <p><span className="font-bold text-slate-900">Phone:</span> {info?.phone}</p>
                                                <p><span className="font-bold text-slate-900">Address:</span> {info?.address}, {info?.city}, {info?.state} {info?.pincode}</p>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h4 className="font-black text-slate-900 mb-4 uppercase tracking-widest text-xs flex items-center gap-2">
                                        <Package size={14} className="text-amber-500" /> Payment & Status
                                    </h4>
                                    <div className="space-y-3 text-sm text-slate-600 font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">Method:</span>
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200">
                                                {selectedOrder.payment_method}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">Current Status:</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                                selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                'bg-amber-100 text-amber-700 border-amber-200'
                                            }`}>
                                                {selectedOrder.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <h4 className="font-black text-slate-900 mb-4 uppercase tracking-widest text-xs">Order Items</h4>
                            <div className="space-y-4 mb-8">
                                {(() => {
                                    const items = typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : selectedOrder.items;
                                    return (items || []).map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-white">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-slate-900 truncate">{item.product.name}</h5>
                                                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{item.product.category}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm font-bold text-slate-600">Qty: {item.quantity}</span>
                                                    <span className="font-black text-slate-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>

                            <div className="border-t border-slate-100 pt-6 space-y-3">
                                <div className="flex justify-between text-sm font-bold text-slate-500">
                                    <span>Subtotal</span>
                                    <span>₹{Number(selectedOrder.subtotal).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-500">
                                    <span>Tax</span>
                                    <span>₹{Number(selectedOrder.tax).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-100">
                                    <span>Total</span>
                                    <span className="text-amber-500">₹{Number(selectedOrder.total).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-black transition-all shadow-xl active:scale-95"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Custom scrollbar styles
const style = document.createElement('style');
style.textContent = `
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #cbd5e1;
    }
`;
document.head.appendChild(style);

export default AdminDashboard;
