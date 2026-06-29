import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { databaseService } from '../services/databaseService';
import { Package, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrdersPage: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.id) {
                const userOrders = await databaseService.getUserOrders(user.id);
                setOrders(userOrders);
            }
            setLoading(false);
        };
        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="bg-white rounded-2xl p-16 shadow-sm">
                        <Package size={64} className="mx-auto text-slate-300 mb-6" />
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">No Orders Yet</h2>
                        <p className="text-slate-500 mb-8">You haven't placed any orders with us yet.</p>
                        <Link to="/products" className="bg-amber-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-600 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8">My Orders</h1>
                
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 overflow-hidden relative">
                            <div className="flex flex-col md:flex-row justify-between mb-6 border-b border-slate-100 pb-6 gap-4">
                                <div>
                                    <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Order ID</div>
                                    <div className="font-mono text-lg font-bold text-slate-900">{order.order_id}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Date</div>
                                    <div className="text-slate-900">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Total</div>
                                    <div className="font-bold text-amber-600 text-lg">₹{parseFloat(order.total).toLocaleString('en-IN')}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Status</div>
                                    <div className="flex items-center gap-2">
                                        {order.status === 'Pending' ? <Clock size={16} className="text-amber-500" /> : <CheckCircle size={16} className="text-green-500" />}
                                        <span className={`font-semibold ${order.status === 'Pending' ? 'text-amber-600' : 'text-green-600'}`}>{order.status}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {order.items.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-900">{item.product.name}</div>
                                            <div className="text-sm text-slate-500">Qty: {item.quantity}</div>
                                        </div>
                                        <div className="font-semibold text-slate-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;
