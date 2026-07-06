import React, { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Phone, Calendar, ArrowLeft, MessageSquare, Search, MapPin, ExternalLink, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { EnquiryData } from '../types';

const tdStyle: React.CSSProperties = {
    padding: '0',
    fontFamily: 'Inter, sans-serif',
    verticalAlign: 'top',
};

const AdminEnquiries: React.FC = () => {
    const [enquiries, setEnquiries] = useState<EnquiryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'today' | 'all'>('all');
    const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryData | null>(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/admin');
    }, [isAuthenticated, navigate]);

    const fetchEnquiries = async () => {
        setLoading(true);
        const data = await databaseService.getEnquiries();
        setEnquiries(data as any[]);
        setLoading(false);
    };

    useEffect(() => { fetchEnquiries(); }, []);

    const isToday = (dateString?: string) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };

    const filteredEnquiries = enquiries.filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.category.toLowerCase().includes(searchTerm.toLowerCase());
        if (activeTab === 'today') return matchesSearch && isToday(e.created_at);
        return matchesSearch;
    });

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
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
                            Enquiries
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 className="font-caslon" style={{ fontSize: '32px', fontWeight: 400, color: '#ffffff' }}>
                                Customer Inbox
                            </h1>
                            <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
                                {enquiries.length} total leads
                            </p>
                        </div>

                        {/* Search + Tab */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input type="text" placeholder="Search…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    style={{
                                        paddingLeft: '32px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px',
                                        border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)',
                                        color: '#ffffff', fontFamily: 'Inter', fontSize: '13px', outline: 'none',
                                        width: '220px', borderRadius: 0, transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.5)')}
                                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                                />
                            </div>
                            <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.15)' }}>
                                {(['today', 'all'] as const).map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                        padding: '10px 18px',
                                        fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                                        cursor: 'pointer', border: 'none',
                                        backgroundColor: activeTab === tab ? 'var(--surface-white)' : 'transparent',
                                        color: activeTab === tab ? 'var(--on-surface)' : 'rgba(255,255,255,0.5)',
                                        transition: 'all 0.2s',
                                    }}>
                                        {tab === 'today' ? "Today" : "All"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split layout */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 64px 80px' }} className="px-6 md:px-16">
                <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '0', minHeight: '600px', border: '1px solid var(--outline-variant)', marginTop: '32px' }} className="grid-cols-1 lg:grid-cols-[340px_1fr]">

                    {/* Left: Enquiry List */}
                    <div style={{ borderRight: '1px solid var(--outline-variant)', overflowY: 'auto', maxHeight: 'calc(100vh - 260px)' }}>
                        {filteredEnquiries.length === 0 ? (
                            <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--outline)' }}>
                                <MessageSquare size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                                <p style={{ fontSize: '14px' }}>No enquiries found.</p>
                            </div>
                        ) : (
                            filteredEnquiries.map((enq) => {
                                const isSelected = selectedEnquiry?.id === enq.id;
                                return (
                                    <button key={enq.id} onClick={() => setSelectedEnquiry(enq)} style={{
                                        display: 'block', width: '100%', textAlign: 'left',
                                        padding: '20px 24px',
                                        borderBottom: '1px solid var(--outline-variant)',
                                        backgroundColor: isSelected ? 'var(--on-surface)' : 'var(--surface-white)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s',
                                    }}
                                        onMouseOver={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--outline-variant)'; }}
                                        onMouseOut={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--surface-white)'; }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <div style={{
                                                width: '36px', height: '36px', flexShrink: 0,
                                                backgroundColor: isSelected ? 'rgba(255,255,255,0.1)' : 'var(--outline-variant)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontFamily: 'Inter', fontSize: '14px', fontWeight: 700,
                                                color: isSelected ? 'var(--surface-white)' : 'var(--outline)',
                                                transition: 'all 0.15s',
                                            }}>
                                                {enq.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: isSelected ? 'var(--surface-white)' : 'var(--on-surface)', marginBottom: '3px' }}>
                                                    {enq.name}
                                                </p>
                                                <p style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isSelected ? 'rgba(255,255,255,0.5)' : 'var(--outline)', marginBottom: '4px' }}>
                                                    {enq.category}
                                                </p>
                                                <p style={{ fontFamily: 'Inter', fontSize: '11px', color: isSelected ? 'rgba(255,255,255,0.4)' : 'var(--outline-variant)' }}>
                                                    {enq.phone}
                                                </p>
                                            </div>
                                            <span style={{ fontFamily: 'Inter', fontSize: '10px', color: isSelected ? 'rgba(255,255,255,0.3)' : 'var(--outline-variant)', flexShrink: 0, marginTop: '2px' }}>
                                                {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Right: Detail View */}
                    <div style={{ backgroundColor: 'var(--surface-white)', overflowY: 'auto', maxHeight: 'calc(100vh - 260px)' }}>
                        {selectedEnquiry ? (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {/* Detail Header */}
                                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--outline-variant)', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                                        <div>
                                            <h2 className="font-caslon" style={{ fontSize: '28px', fontWeight: 400, color: 'var(--on-surface)', marginBottom: '8px' }}>
                                                {selectedEnquiry.name}
                                            </h2>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                                <span style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--outline)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <Mail size={11} /> {selectedEnquiry.email}
                                                </span>
                                                <span style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--outline)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <Phone size={11} /> {selectedEnquiry.phone}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p className="label-caps" style={{ color: 'var(--outline-variant)', marginBottom: '4px' }}>Received</p>
                                            <p style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface)' }}>
                                                {selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Body */}
                                <div style={{ padding: '32px', flex: 1 }}>
                                    {/* Category Interest */}
                                    <div style={{ marginBottom: '32px' }}>
                                        <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '12px' }}>Category Interest</p>
                                        <div style={{ border: '1px solid var(--outline-variant)', padding: '16px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                                            <Tag size={14} color="var(--outline)" />
                                            <span style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, color: 'var(--on-surface)' }}>
                                                {selectedEnquiry.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div style={{ marginBottom: '32px' }}>
                                        <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '12px' }}>Message</p>
                                        <div style={{ border: '1px solid var(--outline-variant)', padding: '24px', backgroundColor: 'var(--outline-variant)' }}>
                                            <p className="font-caslon" style={{ fontSize: '18px', lineHeight: '32px', color: 'var(--on-surface)', fontStyle: 'italic' }}>
                                                "{selectedEnquiry.message}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    {selectedEnquiry.location && (
                                        <div style={{ marginBottom: '32px' }}>
                                            <p className="label-caps" style={{ color: 'var(--outline)', marginBottom: '12px' }}>Location</p>
                                            <div style={{ border: '1px solid var(--outline-variant)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <MapPin size={14} color="var(--outline)" />
                                                    <div>
                                                        <p style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface)' }}>
                                                            {selectedEnquiry.location.address || 'Location Tagged'}
                                                        </p>
                                                        <p style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--outline)' }}>
                                                            {selectedEnquiry.location.lat.toFixed(4)}, {selectedEnquiry.location.lng.toFixed(4)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <a href={`https://www.google.com/maps?q=${selectedEnquiry.location.lat},${selectedEnquiry.location.lng}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    style={{
                                                        width: '32px', height: '32px', border: '1px solid var(--on-surface)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: 'var(--on-surface)', textDecoration: 'none', transition: 'all 0.2s',
                                                    }}
                                                    onMouseOver={e => { e.currentTarget.style.background = 'var(--on-surface)'; (e.currentTarget.children[0] as SVGElement).style.color = 'var(--surface-white)'; }}
                                                    onMouseOut={e => { e.currentTarget.style.background = 'none'; }}
                                                >
                                                    <ExternalLink size={13} />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions Footer */}
                                <div style={{ padding: '20px 32px', borderTop: '1px solid var(--outline-variant)', display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <a href={`mailto:${selectedEnquiry.email}`} style={{
                                        flex: 1, backgroundColor: 'var(--on-surface)', color: 'var(--surface-white)',
                                        border: '1px solid var(--on-surface)', padding: '12px',
                                        textAlign: 'center', textDecoration: 'none',
                                        fontFamily: 'Inter', fontSize: '11px', fontWeight: 600,
                                        letterSpacing: '0.1em', textTransform: 'uppercase',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        transition: 'all 0.2s',
                                    }}
                                        onMouseOver={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--on-surface)'; }}
                                        onMouseOut={e => { e.currentTarget.style.background = 'var(--on-surface)'; e.currentTarget.style.color = 'var(--surface-white)'; }}
                                    >
                                        <Mail size={13} /> Reply by Email
                                    </a>
                                    <a href={`tel:${selectedEnquiry.phone}`} style={{
                                        flex: 1, border: '1px solid var(--outline-variant)', color: 'var(--outline)', padding: '12px',
                                        textAlign: 'center', textDecoration: 'none',
                                        fontFamily: 'Inter', fontSize: '11px', fontWeight: 600,
                                        letterSpacing: '0.1em', textTransform: 'uppercase',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        transition: 'all 0.2s',
                                    }}
                                        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--on-surface)'; e.currentTarget.style.color = 'var(--on-surface)'; }}
                                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--outline-variant)'; e.currentTarget.style.color = 'var(--outline)'; }}
                                    >
                                        <Phone size={13} /> Call
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px', textAlign: 'center' }}>
                                <MessageSquare size={40} style={{ marginBottom: '16px', color: 'var(--outline-variant)' }} />
                                <h3 className="font-caslon" style={{ fontSize: '22px', fontWeight: 400, color: 'var(--on-surface)', marginBottom: '8px' }}>
                                    Select an Enquiry
                                </h3>
                                <p style={{ fontSize: '14px', color: 'var(--outline)', maxWidth: '240px' }}>
                                    Choose a lead from the left panel to view full details.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEnquiries;
