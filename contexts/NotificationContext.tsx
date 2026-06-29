import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

export type NotificationType = 'low_stock' | 'new_order' | 'new_enquiry';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50)); // Keep max 50
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    // ─── Products: low stock alert ────────────────────────────────────────
    const productsChannel = supabase
      .channel('realtime-products')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          const product = payload.new as any;
          const qty = product.quantity ?? null;
          if (qty !== null && qty <= 5) {
            addNotification({
              type: 'low_stock',
              title: '⚠️ Low Stock Alert',
              message: `"${product.name}" has only ${qty} unit${qty === 1 ? '' : 's'} remaining.`,
            });
          }
        }
      )
      .subscribe();

    // ─── Orders: new order notification ──────────────────────────────────
    const ordersChannel = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new as any;
          const info = typeof order.customer_info === 'string'
            ? JSON.parse(order.customer_info)
            : order.customer_info;
          const customerName = info?.name || 'Unknown';
          addNotification({
            type: 'new_order',
            title: '🛒 New Order Received',
            message: `Order #${order.order_id || order.id} from ${customerName} — ₹${Number(order.total).toLocaleString('en-IN')}`,
          });
        }
      )
      .subscribe();

    // ─── Enquiries: new enquiry notification ─────────────────────────────
    const enquiriesChannel = supabase
      .channel('realtime-enquiries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'enquiries' },
        (payload) => {
          const enquiry = payload.new as any;
          addNotification({
            type: 'new_enquiry',
            title: '💬 New Enquiry',
            message: `From ${enquiry.name || 'Unknown'} — ${enquiry.category || 'General'}: "${(enquiry.message || '').slice(0, 60)}..."`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(enquiriesChannel);
    };
  }, [addNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAllRead,
      clearNotification,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
