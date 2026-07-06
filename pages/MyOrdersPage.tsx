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
            <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '32px', height: '32px', border: '1px solid #1a1c1c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                    <Package size={48} strokeWidth={1} color="#c4c7c7" style={{ margin: '0 auto 32px' }} />
                    <h2 className="font-caslon" style={{ fontSize: '40px', fontWeight: 400, color: '#1a1c1c', marginBottom: '16px' }}>
                        No Orders Yet
                    </h2>
                    <p style={{ color: '#747878', fontSize: '15px', marginBottom: '40px' }}>
                        You haven't placed any orders with us yet.
                    </p>
                    <Link
                        to="/products"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#1a1c1c',
                            color: '#ffffff',
                            padding: '14px 40px',
                            textDecoration: 'none',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            border: '1px solid #1a1c1c',
                            transition: 'background 0.2s, color 0.2s',
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a1c1c'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#1a1c1c'; e.currentTarget.style.color = '#ffffff'; }}
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', paddingTop: '64px' }}>
            {/* Page header */}
            <div
                style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e2e2', padding: '64px 80px 48px' }}
                className="px-6 md:px-[80px]"
            >
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <p className="label-caps" style={{ color: '#747878', marginBottom: '16px' }}>Account</p>
                    <h1 className="font-caslon" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, color: '#1a1c1c' }}>
                        My Orders
                    </h1>
                </div>
            </div>

            <div
                style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 80px 120px' }}
                className="px-6 md:px-[80px]"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {orders.map((order, idx) => (
                        <div
                            key={order.id}
                            style={{
                                borderBottom: '1px solid #e2e2e2',
                                padding: '48px 0',
                            }}
                        >
                            {/* Order header */}
                            <div
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e2e2e2' }}
                                className="grid-cols-2 md:grid-cols-4"
                            >
                                <div>
                                    <p className="label-caps" style={{ color: '#747878', marginBottom: '8px' }}>Order ID</p>
                                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1a1c1c', letterSpacing: '0.05em' }}>
                                        {order.order_id}
                                    </p>
                                </div>
                                <div>
                                    <p className="label-caps" style={{ color: '#747878', marginBottom: '8px' }}>Date</p>
                                    <p style={{ fontSize: '14px', color: '#1a1c1c' }}>
                                        {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="label-caps" style={{ color: '#747878', marginBottom: '8px' }}>Total</p>
                                    <p style={{ fontSize: '16px', fontWeight: 600, color: '#1a1c1c' }}>
                                        ₹{parseFloat(order.total).toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div>
                                    <p className="label-caps" style={{ color: '#747878', marginBottom: '8px' }}>Status</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {order.status === 'Pending'
                                            ? <Clock size={13} color="#747878" />
                                            : <CheckCircle size={13} color="#1a1c1c" />
                                        }
                                        <span
                                            className="label-caps"
                                            style={{ color: order.status === 'Pending' ? '#747878' : '#1a1c1c' }}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                {order.items.map((item: any, i: number) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '20px',
                                            padding: '16px 0',
                                            borderBottom: i < order.items.length - 1 ? '1px solid #f3f3f3' : 'none',
                                        }}
                                    >
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            style={{ width: '64px', height: '64px', objectFit: 'cover', display: 'block', flexShrink: 0 }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1c1c', marginBottom: '4px' }}>
                                                {item.product.name}
                                            </p>
                                            <p className="label-caps" style={{ color: '#747878' }}>
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1c1c' }}>
                                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                        </p>
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
