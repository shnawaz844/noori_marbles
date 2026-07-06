import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { ProductCategory, Product, Hotspot } from '../types';
import { CATEGORIES } from '../constants';
import { databaseService } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Edit2, Trash2, Save, X, Package, Layout, Tag, Image as ImageIcon, MapPin, ShoppingBag, MessageSquare, Mail, Phone, Minus, Hash, Eye, ExternalLink, Share2 } from 'lucide-react';

// ─── Shared admin design tokens ───────────────────────────────────────────────
const adminInput: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--outline-variant)',
    background: 'var(--surface-white)',
    fontSize: '13px',
    color: 'var(--on-surface)',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
    borderRadius: 0,
};

const adminLabel: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Inter, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--outline)',
    marginBottom: '6px',
};

const tdStyle: React.CSSProperties = {
    padding: '14px 20px',
    fontSize: '13px',
    color: 'var(--on-surface)',
    borderBottom: '1px solid var(--outline-variant)',
    fontFamily: 'Inter, sans-serif',
    verticalAlign: 'middle',
};

const thStyle: React.CSSProperties = {
    padding: '12px 20px',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--outline)',
    borderBottom: '1px solid var(--on-surface)',
    textAlign: 'left' as const,
    fontFamily: 'Inter, sans-serif',
    whiteSpace: 'nowrap' as const,
    backgroundColor: 'var(--surface)',
};

// ─── AdminDashboard ────────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
    const { products, categories, addProduct, updateProduct, deleteProduct, refreshProducts } = useProducts();
    const { isAuthenticated, logout } = useAuth();
    const { theme } = useTheme();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'enquiries'>('products');
    const [orders, setOrders] = useState<any[]>([]);
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastClick, setLastClick] = useState<{ x: number, y: number } | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [quantityLoadingId, setQuantityLoadingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<Product>>({
        name: '', category: '', price: 0, quantity: 0, description: '', image: '', inStock: true, hotspots: []
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [o, e] = await Promise.all([databaseService.getOrders(), databaseService.getEnquiries()]);
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

    const handleEdit = (product: Product) => { setEditingId(product.id); setFormData(product); setIsAdding(true); };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this product? This cannot be undone.')) {
            try { setLoading(true); await deleteProduct(id); } catch { alert('Failed to delete.'); } finally { setLoading(false); }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) { await updateProduct(formData as Product); }
            else { await addProduct({ ...formData, id: Math.random().toString(36).substr(2, 9) } as Product); }
            resetForm();
        } catch { alert('Failed to save product.'); } finally { setLoading(false); }
    };

    const resetForm = () => {
        setEditingId(null); setIsAdding(false); setLastClick(null);
        setFormData({ name: '', category: '', price: 0, quantity: 0, unit: 'piece', description: '', image: '', inStock: true, hotspots: [] });
    };

    const handleQuantityChange = async (product: Product, delta: number) => {
        const newQty = Math.max(0, (product.quantity ?? 0) + delta);
        setQuantityLoadingId(product.id);
        try { await databaseService.updateProductQuantity(product.id, newQty); await refreshProducts(); }
        catch { alert('Failed to update quantity.'); } finally { setQuantityLoadingId(null); }
    };

    const handleAddHotspot = () => {
        setFormData({ ...formData, hotspots: [...(formData.hotspots || []), { productId: '', x: 50, y: 50 }] });
    };

    const handleUpdateHotspot = (index: number, field: keyof Hotspot, value: any) => {
        const updated = [...(formData.hotspots || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, hotspots: updated });
    };

    const handleRemoveHotspot = (index: number) => {
        setFormData({ ...formData, hotspots: (formData.hotspots || []).filter((_, i) => i !== index) });
    };

    const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await databaseService.updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch { alert('Failed to update status'); }
    };

    const statusBadge = (status: string) => {
        const map: Record<string, React.CSSProperties> = {
            Delivered: { backgroundColor: '#f3f3f3', color: '#1a1c1c', border: '1px solid #1a1c1c' },
            Processing: { backgroundColor: '#1a1c1c', color: '#ffffff', border: '1px solid #1a1c1c' },
            Pending: { backgroundColor: '#ffffff', color: '#747878', border: '1px solid #c4c7c7' },
        };
        return {
            padding: '4px 10px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            fontFamily: 'Inter, sans-serif',
            ...(map[status] || map.Pending),
        };
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
            {/* Admin Header Banner */}
            <div style={{ backgroundColor: '#1a1c1c', borderBottom: '1px solid #2f3131', padding: '32px 64px' }} className="px-6 md:px-16">
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <p style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                            Admin
                        </p>
                        <h1 className="font-caslon" style={{ fontSize: '32px', fontWeight: 400, color: '#ffffff', lineHeight: 1.1 }}>
                            Dashboard
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Link to="/admin/enquiries" style={{
                            border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)',
                            padding: '10px 20px', textDecoration: 'none', fontFamily: 'Inter', fontSize: '11px',
                            fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                            display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
                        }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.color = '#ffffff'; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                        >
                            <MessageSquare size={13} /> Enquiries
                        </Link>
                        <Link to="/admin/categories" style={{
                            border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)',
                            padding: '10px 20px', textDecoration: 'none', fontFamily: 'Inter', fontSize: '11px',
                            fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                            display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
                        }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.color = '#ffffff'; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                        >
                            <Layout size={13} /> Categories
                        </Link>
                        <button onClick={() => setIsAdding(true)} style={{
                            backgroundColor: '#ffffff', color: '#1a1c1c', border: '1px solid #ffffff',
                            padding: '10px 24px', fontFamily: 'Inter', fontSize: '11px', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
                        }}
                            onMouseOver={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
                            onMouseOut={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#1a1c1c'; }}
                        >
                            <Plus size={13} /> Add Product
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 64px 120px' }} className="px-6 md:px-16">
                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginBottom: '48px' }} className="grid-cols-2 md:grid-cols-4">
                    {[
                        { label: 'Products', value: products.length, sub: 'Total Inventory' },
                        { label: 'Categories', value: categories.length, sub: 'Active Collections' },
                        { label: 'Out of Stock', value: products.filter(p => !p.inStock).length, sub: 'Needs Restock' },
                        { label: 'Enquiries', value: enquiries.length, sub: 'Total Leads', dark: true },
                    ].map(stat => {
                        const isCardDark = stat.dark || theme === 'dark';
                        return (
                            <div key={stat.label} style={{
                                backgroundColor: isCardDark ? (theme === 'dark' ? 'var(--surface-white)' : '#1a1c1c') : '#ffffff',
                                border: `1px solid ${isCardDark ? (theme === 'dark' ? 'var(--outline-variant)' : '#1a1c1c') : '#e2e2e2'}`,
                                padding: '28px 24px',
                                transition: 'all 0.4s ease',
                            }}>
                                <p style={{ fontFamily: 'Inter', fontSize: '36px', fontWeight: 700, color: isCardDark ? (theme === 'dark' ? 'var(--on-surface)' : '#ffffff') : '#1a1c1c', lineHeight: 1, marginBottom: '4px' }}>
                                    {stat.value}
                                </p>
                                <p style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: isCardDark ? (theme === 'dark' ? 'var(--outline)' : 'rgba(255,255,255,0.4)') : '#747878' }}>
                                    {stat.label}
                                </p>
                                <p style={{ fontFamily: 'Inter', fontSize: '11px', color: isCardDark ? (theme === 'dark' ? 'var(--outline)' : 'rgba(255,255,255,0.25)') : '#c4c7c7', marginTop: '4px' }}>
                                    {stat.sub}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Tab Bar */}
                <div style={{ display: 'flex', borderBottom: '1px solid #1a1c1c', marginBottom: '32px' }}>
                    {(['products', 'orders', 'enquiries'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            padding: '12px 24px',
                            fontFamily: 'Inter', fontSize: '11px', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            background: 'none', border: 'none', cursor: 'pointer',
                            borderBottom: activeTab === tab ? '2px solid #1a1c1c' : '2px solid transparent',
                            color: activeTab === tab ? '#1a1c1c' : '#747878',
                            marginBottom: '-1px',
                            transition: 'color 0.2s, border-color 0.2s',
                        }}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Products Tab ── */}
                {activeTab === 'products' && !isAdding && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
                            <p className="label-caps" style={{ color: 'var(--outline)' }}>{filteredProducts.length} products</p>
                            <input
                                type="text" placeholder="Search…"
                                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                style={{ ...adminInput, width: '240px', border: '1px solid var(--outline-variant)' }}
                                onFocus={e => (e.target.style.borderColor = 'var(--on-surface)')}
                                onBlur={e => (e.target.style.borderColor = 'var(--outline-variant)')}
                            />
                        </div>
                        <div style={{ border: '1px solid var(--outline-variant)', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {['Product', 'Category', 'Price', 'Quantity', 'Status', ''].map(h => (
                                            <th key={h} style={{ ...thStyle, textAlign: h === 'Price' ? 'right' : h === 'Quantity' || h === 'Status' ? 'center' : 'left' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} style={{ backgroundColor: 'var(--surface-white)', transition: 'background-color 0.15s' }}
                                            onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--outline-variant)')}
                                            onMouseOut={e => (e.currentTarget.style.backgroundColor = 'var(--surface-white)')}
                                        >
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <img src={product.image} alt="" style={{ width: '40px', height: '48px', objectFit: 'cover', flexShrink: 0 }} />
                                                    <div>
                                                        <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{product.name}</p>
                                                        <p style={{ fontSize: '10px', color: '#747878', fontFamily: 'monospace' }}>
                                                            {product.hotspots && product.hotspots.length > 0 && (
                                                                <span style={{ marginRight: '6px', color: '#1a1c1c', fontWeight: 700 }}>{product.hotspots.length} hotspots</span>
                                                            )}
                                                            {product.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#747878' }}>
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>
                                                ₹{product.price.toLocaleString('en-IN')}
                                                <span style={{ fontSize: '10px', color: '#747878', fontWeight: 400 }}>/{product.unit || 'pc'}</span>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                    <button onClick={() => handleQuantityChange(product, -1)}
                                                        disabled={quantityLoadingId === product.id || (product.quantity ?? 0) <= 0}
                                                        style={{ width: '24px', height: '24px', border: '1px solid #c4c7c7', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#747878', transition: 'all 0.15s' }}
                                                    ><Minus size={10} /></button>
                                                    <span style={{
                                                        minWidth: '32px', textAlign: 'center', fontSize: '13px', fontWeight: 600,
                                                        color: (product.quantity ?? 0) === 0 ? '#ba1a1a' : (product.quantity ?? 0) <= 5 ? '#7a5800' : '#1a6018',
                                                        padding: '2px 6px', backgroundColor: (product.quantity ?? 0) === 0 ? '#ffdad6' : (product.quantity ?? 0) <= 5 ? '#fff8e1' : '#e6f4ea',
                                                    }}>
                                                        {quantityLoadingId === product.id ? '…' : (product.quantity ?? 0)}
                                                    </span>
                                                    <button onClick={() => handleQuantityChange(product, 1)}
                                                        disabled={quantityLoadingId === product.id}
                                                        style={{ width: '24px', height: '24px', border: '1px solid #c4c7c7', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#747878', transition: 'all 0.15s' }}
                                                    ><Plus size={10} /></button>
                                                </div>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <span style={{
                                                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px',
                                                    border: product.inStock ? '1px solid #1a6018' : '1px solid #ba1a1a',
                                                    color: theme === 'dark' ? '#ffffff' : (product.inStock ? '#1a6018' : '#ba1a1a'),
                                                    backgroundColor: theme === 'dark'
                                                        ? (product.inStock ? '#1a6018' : '#ba1a1a')
                                                        : (product.inStock ? '#e6f4ea' : '#ffdad6'),
                                                }}>
                                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/product/${product.id}`;
                                                            const text = `Check out this product from Noori Marbles:\n*${product.name}* - ₹${product.price.toLocaleString('en-IN')}\n\nView details & order here:\n${url}`;
                                                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                                                        }}
                                                        title="Share to WhatsApp"
                                                        style={{ width: '32px', height: '32px', border: '1px solid #c4c7c7', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', transition: 'all 0.15s' }}
                                                        onMouseOver={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.backgroundColor = '#25D366'; e.currentTarget.style.color = '#ffffff'; }}
                                                        onMouseOut={e => { e.currentTarget.style.borderColor = '#c4c7c7'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#25D366'; }}
                                                    >
                                                        <Share2 size={13} />
                                                    </button>
                                                    <button onClick={() => handleEdit(product)} title="Edit"
                                                        style={{ width: '32px', height: '32px', border: '1px solid #c4c7c7', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#747878', transition: 'all 0.15s' }}
                                                        onMouseOver={e => { e.currentTarget.style.borderColor = '#1a1c1c'; e.currentTarget.style.color = '#1a1c1c'; }}
                                                        onMouseOut={e => { e.currentTarget.style.borderColor = '#c4c7c7'; e.currentTarget.style.color = '#747878'; }}
                                                    ><Edit2 size={13} /></button>
                                                    <button onClick={() => handleDelete(product.id)} title="Delete"
                                                        style={{ width: '32px', height: '32px', border: '1px solid #c4c7c7', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#747878', transition: 'all 0.15s' }}
                                                        onMouseOver={e => { e.currentTarget.style.borderColor = '#ba1a1a'; e.currentTarget.style.color = '#ba1a1a'; }}
                                                        onMouseOut={e => { e.currentTarget.style.borderColor = '#c4c7c7'; e.currentTarget.style.color = '#747878'; }}
                                                    ><Trash2 size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', padding: '64px', color: '#747878' }}>
                                                No products found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Orders Tab ── */}
                {activeTab === 'orders' && (
                    <div style={{ border: '1px solid #e2e2e2', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Order ID', 'Customer', 'Amount', 'Date', 'Status', ''].map(h => (
                                        <th key={h} style={{ ...thStyle }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => {
                                    const info = typeof order.customer_info === 'string' ? JSON.parse(order.customer_info) : order.customer_info;
                                    return (
                                        <tr key={order.id} style={{ backgroundColor: 'var(--surface-white)', transition: 'background-color 0.15s' }}
                                            onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--outline-variant)')}
                                            onMouseOut={e => (e.currentTarget.style.backgroundColor = 'var(--surface-white)')}
                                        >
                                            <td style={tdStyle}>
                                                <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, color: '#1a1c1c' }}>
                                                    #{order.order_id?.slice(0, 10).toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                <p style={{ fontWeight: 600, fontSize: '13px' }}>{info?.name}</p>
                                                <p style={{ fontSize: '11px', color: '#747878' }}>{info?.email}</p>
                                            </td>
                                            <td style={{ ...tdStyle, fontWeight: 700 }}>
                                                ₹{Number(order.total).toLocaleString('en-IN')}
                                            </td>
                                            <td style={{ ...tdStyle, color: '#747878' }}>
                                                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td style={tdStyle}>
                                                <select value={order.status || 'Pending'}
                                                    onChange={e => handleOrderStatusUpdate(order.id, e.target.value)}
                                                    style={{ ...statusBadge(order.status || 'Pending'), cursor: 'pointer', appearance: 'none', outline: 'none' }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            </td>
                                            <td style={tdStyle}>
                                                <button onClick={() => setSelectedOrder(order)}
                                                    style={{ width: '32px', height: '32px', border: '1px solid #c4c7c7', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#747878', transition: 'all 0.15s' }}
                                                    onMouseOver={e => { e.currentTarget.style.borderColor = '#1a1c1c'; e.currentTarget.style.color = '#1a1c1c'; }}
                                                    onMouseOut={e => { e.currentTarget.style.borderColor = '#c4c7c7'; e.currentTarget.style.color = '#747878'; }}
                                                ><Eye size={13} /></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', padding: '64px', color: '#747878' }}>
                                            No orders yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Enquiries Tab ── */}
                {activeTab === 'enquiries' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                            <Link to="/admin/enquiries" style={{
                                padding: '10px 20px', border: '1px solid #1a1c1c', backgroundColor: '#1a1c1c',
                                color: '#ffffff', textDecoration: 'none', fontFamily: 'Inter', fontSize: '11px',
                                fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                            }}>
                                Full Enquiry Inbox
                            </Link>
                        </div>
                        <div style={{ border: '1px solid #e2e2e2', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {['Name', 'Category', 'Contact', 'Message', 'Date'].map(h => (
                                            <th key={h} style={thStyle}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {enquiries.slice(0, 8).map(enq => (
                                        <tr key={enq.id} style={{ backgroundColor: 'var(--surface-white)', transition: 'background-color 0.15s' }}
                                            onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--outline-variant)')}
                                            onMouseOut={e => (e.currentTarget.style.backgroundColor = 'var(--surface-white)')}
                                        >
                                            <td style={{ ...tdStyle, fontWeight: 600 }}>{enq.name}</td>
                                            <td style={tdStyle}>
                                                <span className="label-caps" style={{ color: '#747878' }}>{enq.category}</span>
                                            </td>
                                            <td style={tdStyle}>
                                                <p style={{ fontSize: '12px' }}>{enq.email}</p>
                                                <p style={{ fontSize: '12px', color: '#747878' }}>{enq.phone}</p>
                                            </td>
                                            <td style={{ ...tdStyle, maxWidth: '240px' }}>
                                                <p style={{ fontSize: '12px', color: '#444748', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                    {enq.message || '—'}
                                                </p>
                                            </td>
                                            <td style={{ ...tdStyle, color: '#747878', fontSize: '12px', whiteSpace: 'nowrap' }}>
                                                {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                    {enquiries.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', padding: '64px', color: '#747878' }}>
                                                No enquiries yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ═══ Add/Edit Product Modal ════════════════════════════════════════════ */}
            {isAdding && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Overlay */}
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26,28,28,0.7)' }} onClick={resetForm} />

                    {/* Modal */}
                    <div style={{
                        position: 'relative', backgroundColor: 'var(--surface-white)', width: '100%', maxWidth: '1200px',
                        maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        border: '1px solid var(--outline-variant)',
                    }}>
                        {/* Modal Header */}
                        <div style={{ backgroundColor: '#1a1c1c', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                            <div>
                                <p style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                                    {editingId ? 'Edit' : 'New'} Product
                                </p>
                                <h3 className="font-caslon" style={{ fontSize: '24px', fontWeight: 400, color: '#ffffff' }}>
                                    {editingId ? 'Update Product Details' : 'Add to Catalog'}
                                </h3>
                            </div>
                            <button onClick={resetForm} style={{
                                width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.2)',
                                background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'rgba(255,255,255,0.7)', transition: 'all 0.2s',
                            }}
                                onMouseOver={e => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.color = '#ffffff'; }}
                                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Scrollable Form Body */}
                        <div style={{ overflowY: 'auto', padding: '32px', flex: 1 }}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }} className="grid-cols-1 md:grid-cols-2">
                                    {/* Left Column */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div>
                                            <label style={adminLabel}>Product Name</label>
                                            <input type="text" required placeholder="e.g. Italian Statuario Marble"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                style={adminInput}
                                                onFocus={e => (e.target.style.borderColor = 'var(--on-surface)')}
                                                onBlur={e => (e.target.style.borderColor = 'var(--outline-variant)')}
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                            <div>
                                                <label style={adminLabel}>Category</label>
                                                <select required value={formData.category}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                    style={{ ...adminInput, cursor: 'pointer', appearance: 'none' }}
                                                    onFocus={e => (e.target.style.borderColor = 'var(--on-surface)')}
                                                    onBlur={e => (e.target.style.borderColor = 'var(--outline-variant)')}
                                                >
                                                    <option value="">Select…</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={adminLabel}>Unit</label>
                                                <select required value={formData.unit || 'piece'}
                                                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                                    style={{ ...adminInput, cursor: 'pointer', appearance: 'none' }}
                                                    onFocus={e => (e.target.style.borderColor = 'var(--on-surface)')}
                                                    onBlur={e => (e.target.style.borderColor = 'var(--outline-variant)')}
                                                >
                                                    <option value="piece">piece</option>
                                                    <option value="sqft">sqft</option>
                                                    <option value="box">box</option>
                                                    <option value="kg">kg</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                            <div>
                                                <label style={adminLabel}>Price (₹)</label>
                                                <input type="number" required value={formData.price}
                                                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                                    style={adminInput}
                                                    onFocus={e => (e.target.style.borderColor = 'var(--on-surface)')}
                                                    onBlur={e => (e.target.style.borderColor = 'var(--outline-variant)')}
                                                />
                                            </div>
                                            <div>
                                                <label style={adminLabel}>Quantity</label>
                                                <input type="number" min="0" required value={formData.quantity ?? 0}
                                                    onChange={e => setFormData({ ...formData, quantity: Math.max(0, Number(e.target.value)) })}
                                                    style={adminInput}
                                                    onFocus={e => (e.target.style.borderColor = 'var(--on-surface)')}
                                                    onBlur={e => (e.target.style.borderColor = 'var(--outline-variant)')}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={adminLabel}>Description</label>
                                            <textarea required rows={4} placeholder="Describe texture, finish, use cases…"
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                style={{ ...adminInput, resize: 'vertical', lineHeight: '22px' }}
                                                onFocus={e => (e.target.style.borderColor = 'var(--on-surface)')}
                                                onBlur={e => (e.target.style.borderColor = 'var(--outline-variant)')}
                                            />
                                        </div>

                                        {/* In Stock Toggle */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: '1px solid var(--outline-variant)', cursor: 'pointer' }}
                                            onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}>
                                            <div style={{
                                                width: '16px', height: '16px', border: '1px solid var(--on-surface)', flexShrink: 0,
                                                backgroundColor: formData.inStock ? 'var(--on-surface)' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'background 0.2s',
                                            }}>
                                                {formData.inStock && <span style={{ color: 'var(--surface-white)', fontSize: '10px', lineHeight: 1 }}>✓</span>}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--on-surface)' }}>In Stock</p>
                                                <p className="label-caps" style={{ color: 'var(--outline)', marginTop: '2px' }}>Available in warehouse</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column — Image + Hotspot Picker */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div>
                                            <label style={adminLabel}>Image URL</label>
                                            <input type="url" required placeholder="Paste high-res image URL"
                                                value={formData.image}
                                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                style={adminInput}
                                                onFocus={e => (e.target.style.borderColor = 'var(--on-surface)')}
                                                onBlur={e => (e.target.style.borderColor = 'var(--outline-variant)')}
                                            />
                                        </div>

                                        {formData.image && (
                                            <div style={{ border: '1px solid var(--outline-variant)' }}>
                                                <div style={{ position: 'relative', aspectRatio: '16/9', cursor: 'crosshair', overflow: 'hidden' }}
                                                    onClick={e => {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                                                        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                                                        setLastClick({ x, y });
                                                    }}
                                                >
                                                    <img src={formData.image} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="Preview" />
                                                    {(formData.hotspots || []).map((hs, i) => (
                                                        <div key={i} style={{
                                                            position: 'absolute', width: '16px', height: '16px',
                                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                                            border: '2px solid #1a1c1c',
                                                            transform: 'translate(-50%,-50%)',
                                                            pointerEvents: 'none',
                                                            left: `${hs.x}%`, top: `${hs.y}%`,
                                                        }} />
                                                    ))}
                                                    {lastClick && (
                                                        <div style={{
                                                            position: 'absolute', width: '20px', height: '20px',
                                                            backgroundColor: 'var(--on-surface)', transform: 'translate(-50%,-50%)',
                                                            pointerEvents: 'none', left: `${lastClick.x}%`, top: `${lastClick.y}%`,
                                                        }} />
                                                    )}
                                                    <div style={{
                                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                                        backgroundColor: 'rgba(26,28,28,0.7)', padding: '6px 12px',
                                                    }}>
                                                        <p style={{ color: '#ffffff', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                                            Click to set hotspot position
                                                        </p>
                                                    </div>
                                                </div>

                                                {lastClick && (
                                                    <div style={{ padding: '12px 16px', backgroundColor: 'var(--surface)', borderTop: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span className="label-caps" style={{ color: 'var(--outline)' }}>
                                                            X: {lastClick.x}% · Y: {lastClick.y}%
                                                        </span>
                                                        <button type="button" onClick={() => {
                                                            setFormData({ ...formData, hotspots: [...(formData.hotspots || []), { productId: '', x: lastClick.x, y: lastClick.y }] });
                                                            setLastClick(null);
                                                        }} style={{
                                                            backgroundColor: 'var(--on-surface)', color: 'var(--surface-white)', border: 'none',
                                                            padding: '6px 16px', fontFamily: 'Inter', fontSize: '10px', fontWeight: 700,
                                                            letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                                                        }}>
                                                            Pin Hotspot
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Hotspots Section */}
                                        <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                <div>
                                                    <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '4px' }}>Interactive Hotspots</p>
                                                    <p style={{ fontSize: '12px', color: 'var(--outline)' }}>Map related products to areas on the image</p>
                                                </div>
                                                <button type="button" onClick={handleAddHotspot} style={{
                                                    border: '1px solid var(--outline-variant)', background: 'none', padding: '8px 16px',
                                                    fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
                                                    textTransform: 'uppercase', color: 'var(--outline)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                                    transition: 'all 0.2s',
                                                }}
                                                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--on-surface)'; e.currentTarget.style.color = 'var(--on-surface)'; }}
                                                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--outline-variant)'; e.currentTarget.style.color = 'var(--outline)'; }}
                                                >
                                                    <Plus size={12} /> Add Marker
                                                </button>
                                            </div>

                                            {(formData.hotspots || []).length === 0 ? (
                                                <div style={{ border: '1px dashed var(--outline-variant)', padding: '32px', textAlign: 'center' }}>
                                                    <MapPin size={20} color="var(--outline-variant)" style={{ margin: '0 auto 8px' }} />
                                                    <p style={{ fontSize: '13px', color: 'var(--outline)' }}>Click on the image preview above to add hotspot pins.</p>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                                                    {(formData.hotspots || []).map((hotspot, index) => (
                                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface)' }}>
                                                            <span className="label-caps" style={{ color: 'var(--outline-variant)', minWidth: '24px' }}>#{index + 1}</span>
                                                            <select value={hotspot.productId}
                                                                onChange={e => handleUpdateHotspot(index, 'productId', e.target.value)}
                                                                style={{ ...adminInput, flex: 2 }}
                                                            >
                                                                <option value="">Link product…</option>
                                                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                            </select>
                                                            <input type="text" placeholder="Label" value={hotspot.name || ''}
                                                                onChange={e => handleUpdateHotspot(index, 'name', e.target.value)}
                                                                style={{ ...adminInput, flex: 1 }} />
                                                            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--outline)', whiteSpace: 'nowrap' }}>
                                                                {hotspot.x}%, {hotspot.y}%
                                                            </span>
                                                            <button type="button" onClick={() => handleRemoveHotspot(index)} style={{
                                                                width: '28px', height: '28px', border: '1px solid var(--outline-variant)', background: 'none',
                                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                color: 'var(--outline)', flexShrink: 0, transition: 'all 0.15s',
                                                            }}
                                                                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)'; }}
                                                                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--outline-variant)'; e.currentTarget.style.color = 'var(--outline)'; }}
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Row */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--outline-variant)' }}>
                                    <button type="button" onClick={resetForm} style={{
                                        background: 'none', border: '1px solid var(--outline-variant)', padding: '12px 24px',
                                        fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
                                        textTransform: 'uppercase', color: 'var(--outline)', cursor: 'pointer', transition: 'all 0.2s',
                                    }}>
                                        Cancel
                                    </button>
                                    <button type="submit" style={{
                                        backgroundColor: 'var(--on-surface)', color: 'var(--surface-white)', border: '1px solid var(--on-surface)',
                                        padding: '12px 32px', fontFamily: 'Inter', fontSize: '11px', fontWeight: 700,
                                        letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                                    }}
                                        onMouseOver={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--on-surface)'; }}
                                        onMouseOut={e => { e.currentTarget.style.background = 'var(--on-surface)'; e.currentTarget.style.color = 'var(--surface-white)'; }}
                                    >
                                        <Save size={14} />
                                        {editingId ? 'Save Changes' : 'Publish Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ Order Detail Modal ════════════════════════════════════════════════ */}
            {selectedOrder && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26,28,28,0.7)' }} onClick={() => setSelectedOrder(null)} />
                    <div style={{
                        position: 'relative', backgroundColor: 'var(--surface-white)', width: '100%', maxWidth: '680px',
                        maxHeight: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--outline-variant)',
                    }}>
                        {/* Modal Header */}
                        <div style={{ backgroundColor: '#1a1c1c', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                            <div>
                                <p className="label-caps" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Order Details</p>
                                <h3 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                                    #{selectedOrder.order_id}
                                </h3>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} style={{
                                width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.2)',
                                background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)',
                            }}>
                                <X size={14} />
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ overflowY: 'auto', padding: '24px 28px', flex: 1 }}>
                            {/* Customer + Payment Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ border: '1px solid #e2e2e2', padding: '16px' }}>
                                    <p className="label-caps" style={{ color: '#747878', marginBottom: '12px' }}>Customer</p>
                                    {(() => {
                                        const info = typeof selectedOrder.customer_info === 'string' ? JSON.parse(selectedOrder.customer_info) : selectedOrder.customer_info;
                                        return (
                                            <div style={{ fontSize: '13px', lineHeight: '22px', color: '#444748' }}>
                                                <p style={{ fontWeight: 600, color: '#1a1c1c' }}>{info?.name}</p>
                                                <p>{info?.email}</p>
                                                <p>{info?.phone}</p>
                                                <p>{info?.address}, {info?.city}, {info?.state} {info?.pincode}</p>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div style={{ border: '1px solid #e2e2e2', padding: '16px' }}>
                                    <p className="label-caps" style={{ color: '#747878', marginBottom: '12px' }}>Payment & Status</p>
                                    <div style={{ fontSize: '13px', lineHeight: '22px', color: '#444748' }}>
                                        <p><span style={{ fontWeight: 600, color: '#1a1c1c' }}>Method:</span> {selectedOrder.payment_method}</p>
                                        <p><span style={{ fontWeight: 600, color: '#1a1c1c' }}>Status:</span> {selectedOrder.status || 'Pending'}</p>
                                        <p><span style={{ fontWeight: 600, color: '#1a1c1c' }}>Date:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <p className="label-caps" style={{ color: '#747878', marginBottom: '12px' }}>Items Ordered</p>
                            <div style={{ border: '1px solid #e2e2e2', marginBottom: '16px' }}>
                                {(() => {
                                    const items = typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : selectedOrder.items;
                                    return (items || []).map((item: any, idx: number) => (
                                        <div key={idx} style={{ display: 'flex', gap: '12px', padding: '14px', borderBottom: idx < (items?.length - 1) ? '1px solid #e2e2e2' : 'none', alignItems: 'center' }}>
                                            <img src={item.product.image} alt={item.product.name} style={{ width: '48px', height: '56px', objectFit: 'cover', flexShrink: 0 }} />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1c1c' }}>{item.product.name}</p>
                                                <p className="label-caps" style={{ color: '#747878', marginTop: '2px' }}>{item.product.category} · Qty: {item.quantity}</p>
                                            </div>
                                            <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a1c1c' }}>
                                                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    ));
                                })()}
                            </div>

                            {/* Totals */}
                            <div style={{ border: '1px solid #e2e2e2', padding: '16px' }}>
                                {[
                                    { label: 'Subtotal', value: `₹${Number(selectedOrder.subtotal).toLocaleString('en-IN')}` },
                                    { label: 'Tax', value: `₹${Number(selectedOrder.tax).toLocaleString('en-IN')}` },
                                ].map(row => (
                                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f3f3' }}>
                                        <span className="label-caps" style={{ color: '#747878' }}>{row.label}</span>
                                        <span style={{ fontSize: '13px', color: '#1a1c1c' }}>{row.value}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0' }}>
                                    <span className="label-caps" style={{ color: '#1a1c1c', alignSelf: 'center' }}>Total</span>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a1c1c' }}>₹{Number(selectedOrder.total).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '16px 28px', borderTop: '1px solid #e2e2e2', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setSelectedOrder(null)} style={{
                                backgroundColor: '#1a1c1c', color: '#ffffff', border: '1px solid #1a1c1c',
                                padding: '10px 24px', fontFamily: 'Inter', fontSize: '11px', fontWeight: 600,
                                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                            }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
