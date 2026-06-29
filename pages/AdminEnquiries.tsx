import React, { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Phone, Calendar, ArrowLeft, MessageSquare, Trash2, Search, Filter, Clock, MapPin, ChevronRight, User, Tag, ArrowRight, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { EnquiryData } from '../types';

const AdminEnquiries: React.FC = () => {
    const [enquiries, setEnquiries] = useState<EnquiryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');
    const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryData | null>(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    const fetchEnquiries = async () => {
        setLoading(true);
        const data = await databaseService.getEnquiries();
        // data comes from Supabase, need to ensure it matches EnquiryData
        setEnquiries(data as any[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const isToday = (dateString?: string) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const filteredEnquiries = enquiries.filter(enquiry => {
        const matchesSearch = enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (activeTab === 'today') {
            return matchesSearch && isToday(enquiry.created_at);
        }
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            {/* Premium Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 transition-all duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Link to="/admin" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all">
                                    <ArrowLeft size={20} />
                                </Link>
                                <div className="h-4 w-px bg-slate-200 mx-2" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Administration</span>
                            </div>
                            <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight flex items-center gap-4">
                                Customer <span className="text-amber-500">Inbox</span>
                                <div className="bg-amber-100 text-amber-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-amber-200">
                                    {enquiries.length} leads
                                </div>
                            </h1>
                            <p className="text-slate-500 mt-2 font-medium">Manage leads and inquiries from your luxury portfolio visitors</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                            {/* Search */}
                            <div className="relative group w-full sm:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all text-slate-700 font-bold"
                                />
                            </div>

                            {/* Tabs */}
                            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                                <button
                                    onClick={() => setActiveTab('today')}
                                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'today' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Today's
                                </button>
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Archive
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-[calc(100vh-400px)] min-h-[700px]">
                    
                    {/* Master List (Left) */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5 overflow-y-auto pr-4 custom-scrollbar">
                        {filteredEnquiries.length === 0 ? (
                            <div className="bg-white rounded-[40px] p-16 text-center border-2 border-dashed border-slate-100">
                                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MessageSquare size={40} />
                                </div>
                                <h3 className="font-black text-slate-900 text-xl">Inbox is Empty</h3>
                                <p className="text-sm text-slate-400 mt-2 font-medium">No active inquiries match your current view.</p>
                            </div>
                        ) : (
                            filteredEnquiries.map((enquiry) => (
                                <button
                                    key={enquiry.id}
                                    onClick={() => setSelectedEnquiry(enquiry)}
                                    className={`text-left p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group relative overflow-hidden ${
                                        selectedEnquiry?.id === enquiry.id 
                                        ? 'bg-white border-amber-500 shadow-2xl shadow-amber-500/10 scale-[1.02] z-10' 
                                        : 'bg-white border-slate-50 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1'
                                    }`}
                                >
                                    {selectedEnquiry?.id === enquiry.id && (
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                                    )}
                                    
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-500 ${
                                            selectedEnquiry?.id === enquiry.id 
                                            ? 'bg-slate-900 text-white rotate-6' 
                                            : 'bg-slate-50 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 group-hover:-rotate-3'
                                        }`}>
                                            {enquiry.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 text-base leading-tight">{enquiry.name}</h3>
                                            <div className="flex items-center gap-2.5 mt-1.5">
                                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{enquiry.category}</span>
                                                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    {enquiry.created_at ? new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-slate-500">
                                                <Phone size={12} className="text-amber-500" />
                                                {enquiry.phone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                        selectedEnquiry?.id === enquiry.id 
                                        ? 'bg-amber-500 text-white translate-x-0' 
                                        : 'bg-slate-50 text-slate-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                                    }`}>
                                        <ChevronRight size={20} />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Detail View (Right) */}
                    <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col relative">
                        {selectedEnquiry ? (
                            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
                                {/* Detail Header */}
                                <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-amber-500 text-white rounded-3xl flex items-center justify-center text-3xl font-bold shadow-xl shadow-amber-500/20">
                                                {selectedEnquiry.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-serif font-bold text-slate-900">{selectedEnquiry.name}</h2>
                                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium bg-white px-3 py-1 rounded-full border border-slate-100">
                                                        <Mail size={14} className="text-amber-500" /> {selectedEnquiry.email}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium bg-white px-3 py-1 rounded-full border border-slate-100">
                                                        <Phone size={14} className="text-amber-500" /> {selectedEnquiry.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Received On</div>
                                            <div className="text-slate-900 font-bold flex items-center gap-2 justify-end">
                                                <Calendar size={16} className="text-amber-500" />
                                                {selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </div>
                                            <div className="text-slate-400 text-xs font-medium mt-1">
                                                at {selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Body */}
                                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                                    <div className="space-y-12">
                                        {/* Message */}
                                        <div className="relative">
                                            <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                                                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                                    <MessageSquare size={14} />
                                                </div>
                                                Client Narrative
                                            </div>
                                            <div className="bg-slate-50/50 p-10 rounded-[40px] border border-slate-100 relative overflow-hidden group hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                                                <div className="absolute -top-10 -right-10 text-slate-100 group-hover:text-amber-50/50 transition-colors duration-500">
                                                    <MessageSquare size={240} />
                                                </div>
                                                <p className="text-slate-800 text-2xl leading-relaxed italic font-serif relative z-10">
                                                    "{selectedEnquiry.message}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Category Interest */}
                                            <div className="group">
                                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                                    <Tag size={14} className="text-amber-500" /> Collection Interest
                                                </div>
                                                <div className="bg-white p-6 rounded-3xl border-2 border-slate-50 flex items-center gap-5 group-hover:border-amber-500/20 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-amber-500/5">
                                                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                                        <Layout size={28} />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 text-lg">{selectedEnquiry.category}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Service Collection</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location View */}
                                            <div className="group">
                                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                                    <MapPin size={14} className="text-amber-500" /> Sourcing Location
                                                </div>
                                                <div className="bg-white p-6 rounded-3xl border-2 border-slate-50 flex items-center justify-between group-hover:border-amber-500/20 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-amber-500/5">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                                            <MapPin size={28} />
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 text-lg">
                                                                {selectedEnquiry.location ? (selectedEnquiry.location.address || 'Location Tagged') : 'Not Provided'}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                                {selectedEnquiry.location ? `${selectedEnquiry.location.lat.toFixed(4)}, ${selectedEnquiry.location.lng.toFixed(4)}` : 'Manual Submission'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {selectedEnquiry.location && (
                                                        <a 
                                                            href={`https://www.google.com/maps?q=${selectedEnquiry.location.lat},${selectedEnquiry.location.lng}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-12 h-12 bg-slate-900 text-white rounded-xl hover:bg-black transition-all flex items-center justify-center shadow-lg active:scale-95"
                                                            title="View on Google Maps"
                                                        >
                                                            <ExternalLink size={20} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Footer / Actions */}
                                <div className="p-8 bg-white border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <a 
                                            href={`mailto:${selectedEnquiry.email}`}
                                            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                                        >
                                            <Mail size={18} className="text-amber-500" /> Initiate Response
                                        </a>
                                        <a 
                                            href={`tel:${selectedEnquiry.phone}`}
                                            className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-50 transition-all border-2 border-slate-100 active:scale-95"
                                        >
                                            <Phone size={18} className="text-amber-500" /> Direct Call
                                        </a>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (window.confirm('Archive this inquiry? This will move it to the historical records.')) {
                                                // Implement delete/archive logic
                                            }
                                        }}
                                        className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                        title="Archive Lead"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                                <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-6">
                                    <MessageSquare size={48} className="text-slate-200" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Select an Enquiry</h3>
                                <p className="max-w-xs mx-auto">Choose a customer lead from the list to view full details and contact information.</p>
                                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-amber-500 animate-pulse">
                                    <ArrowLeft size={16} /> Choose from the list
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
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
            `}</style>
        </div>
    );
};

const Layout: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
);

export default AdminEnquiries;
