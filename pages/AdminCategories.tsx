import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { Layout, Plus, Trash2, ArrowLeft, Save, Globe, Image as ImageIcon, FileText, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Category } from '../types';

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

const AdminCategories: React.FC = () => {
    const { categories, addCategory, deleteCategory, loading } = useProducts();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: '', image: '', description: '' });
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        if (!isAuthenticated) navigate('/admin');
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            await addCategory({ id: slug, name: formData.name, slug, image: formData.image, description: formData.description } as Category);
            setIsAdding(false);
            setFormData({ name: '', image: '', description: '' });
        } catch { alert('Failed to add category'); } finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.4s ease' }}>
                <div style={{ width: '32px', height: '32px', border: '2px solid var(--on-surface)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingTop: '64px', transition: 'background-color 0.4s ease' }}>
            {/* Admin Header */}
            <div style={{ backgroundColor: '#1a1c1c', padding: '32px 64px' }} className="px-6 md:px-16">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <Link to="/admin" style={{
                            display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
                            fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s',
                        }}
                            onMouseOver={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                            onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                        >
                            <ArrowLeft size={12} /> Dashboard
                        </Link>
                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>/</span>
                        <span style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                            Categories
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 className="font-caslon" style={{ fontSize: '32px', fontWeight: 400, color: '#ffffff' }}>
                                Manage Categories
                            </h1>
                            <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
                                {categories.length} collections
                            </p>
                        </div>
                        <button onClick={() => setIsAdding(true)} style={{
                            backgroundColor: '#ffffff', color: '#1a1c1c', border: '1px solid #ffffff',
                            padding: '10px 24px', fontFamily: 'Inter', fontSize: '11px', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
                        }}
                            onMouseOver={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
                            onMouseOut={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#1a1c1c'; }}
                        >
                            <Plus size={13} /> New Category
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Grid */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 64px 120px' }} className="px-6 md:px-16">
                {categories.length === 0 ? (
                    <div style={{ border: '1px dashed var(--outline-variant)', padding: '80px', textAlign: 'center' }}>
                        <Layout size={32} style={{ margin: '0 auto 16px', color: 'var(--outline-variant)' }} />
                        <h3 className="font-caslon" style={{ fontSize: '22px', fontWeight: 400, color: 'var(--on-surface)', marginBottom: '8px' }}>
                            No Categories Yet
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--outline)' }}>Create your first product category above.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map(category => (
                            <div key={category.id} style={{ border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-white)', position: 'relative', overflow: 'hidden' }}>
                                {/* Image */}
                                <div style={{ height: '180px', backgroundColor: 'var(--outline-variant)', overflow: 'hidden', position: 'relative' }}>
                                    {category.image ? (
                                        <img src={category.image} alt={category.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                                            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                                            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                                        />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                            <Layout size={40} color="var(--outline-variant)" />
                                        </div>
                                    )}
                                    {/* Delete button on image */}
                                    <button onClick={() => {
                                        if (window.confirm(`Delete "${category.name}"? This cannot be undone.`)) deleteCategory(category.id);
                                    }} style={{
                                        position: 'absolute', top: '12px', right: '12px',
                                        width: '32px', height: '32px', backgroundColor: 'var(--surface-white)',
                                        border: '1px solid var(--outline-variant)', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--outline)', transition: 'all 0.2s', opacity: 0,
                                    }}
                                        onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)'; }}
                                        onMouseOut={e => { e.currentTarget.style.opacity = '0'; e.currentTarget.style.borderColor = 'var(--outline-variant)'; e.currentTarget.style.color = 'var(--outline)'; }}
                                        className="category-delete-btn"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>

                                {/* Info */}
                                <div style={{ padding: '20px 24px' }}>
                                    <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '6px' }}>
                                        slug: {category.slug}
                                    </p>
                                    <h3 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 700, color: 'var(--on-surface)', marginBottom: '8px' }}>
                                        {category.name}
                                    </h3>
                                    {category.description && (
                                        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--outline)', lineHeight: '20px',
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ═══ Add Category Modal ════════════════════════════════════════════════ */}
            {isAdding && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26,28,28,0.7)' }} onClick={() => setIsAdding(false)} />
                    <div style={{
                        position: 'relative', backgroundColor: 'var(--surface-white)', width: '100%', maxWidth: '520px',
                        border: '1px solid var(--outline-variant)',
                    }}>
                        {/* Modal Header */}
                        <div style={{ backgroundColor: '#1a1c1c', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p className="label-caps" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>New Collection</p>
                                <h3 className="font-caslon" style={{ fontSize: '22px', fontWeight: 400, color: '#ffffff' }}>
                                    Add Category
                                </h3>
                            </div>
                            <button onClick={() => setIsAdding(false)} style={{
                                width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.2)',
                                background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'rgba(255,255,255,0.6)',
                            }}>
                                <X size={14} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={adminLabel}>Category Name</label>
                                    <input type="text" required value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Italian Marble"
                                        style={adminInput}
                                        onFocus={e => (e.target.style.borderColor = 'var(--on-surface)')}
                                        onBlur={e => (e.target.style.borderColor = 'var(--outline-variant)')}
                                    />
                                </div>
                                <div>
                                    <label style={adminLabel}>Cover Image URL</label>
                                    <input type="url" value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://images.unsplash.com/…"
                                        style={adminInput}
                                        onFocus={e => (e.target.style.borderColor = 'var(--on-surface)')}
                                        onBlur={e => (e.target.style.borderColor = 'var(--outline-variant)')}
                                    />
                                    {formData.image && (
                                        <div style={{ marginTop: '8px', height: '100px', overflow: 'hidden', border: '1px solid var(--outline-variant)' }}>
                                            <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={adminLabel}>Description</label>
                                    <textarea value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={3} placeholder="Brief description of this category…"
                                        style={{ ...adminInput, resize: 'vertical', lineHeight: '22px' }}
                                        onFocus={e => (e.target.style.borderColor = 'var(--on-surface)')}
                                        onBlur={e => (e.target.style.borderColor = 'var(--outline-variant)')}
                                    />
                                </div>
                            </div>

                            <div style={{ padding: '20px 28px', borderTop: '1px solid var(--outline-variant)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setIsAdding(false)} style={{
                                    border: '1px solid var(--outline-variant)', background: 'none', padding: '10px 20px',
                                    fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
                                    textTransform: 'uppercase', color: 'var(--outline)', cursor: 'pointer',
                                }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} style={{
                                    backgroundColor: 'var(--on-surface)', color: 'var(--surface-white)', border: '1px solid var(--on-surface)',
                                    padding: '10px 24px', fontFamily: 'Inter', fontSize: '11px', fontWeight: 700,
                                    letterSpacing: '0.1em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer',
                                    opacity: saving ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '6px',
                                }}>
                                    <Save size={13} />
                                    {saving ? 'Creating…' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .category-card:hover .category-delete-btn { opacity: 1 !important; }
            `}</style>
        </div>
    );
};

export default AdminCategories;
