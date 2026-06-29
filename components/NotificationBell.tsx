import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, ShoppingBag, MessageSquare, AlertTriangle, Trash2, CheckCheck } from 'lucide-react';
import { useNotifications, AppNotification } from '../contexts/NotificationContext';

const typeConfig = {
  low_stock: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    dot: 'bg-amber-500',
  },
  new_order: {
    icon: ShoppingBag,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    dot: 'bg-blue-500',
  },
  new_enquiry: {
    icon: MessageSquare,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    dot: 'bg-emerald-500',
  },
};

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const NotificationItem: React.FC<{ notification: AppNotification; onDismiss: (id: string) => void }> = ({
  notification,
  onDismiss,
}) => {
  const cfg = typeConfig[notification.type];
  const Icon = cfg.icon;

  return (
    <div
      className={`flex gap-3 p-4 rounded-2xl border transition-all group hover:shadow-sm ${cfg.bg} ${cfg.border} ${!notification.read ? 'ring-1 ring-inset ring-current/10' : ''}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm ${cfg.color}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-black text-slate-900 leading-tight">{notification.title}</p>
          <button
            onClick={() => onDismiss(notification.id)}
            className="text-slate-300 hover:text-slate-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
          >
            <X size={12} />
          </button>
        </div>
        <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">{notification.message}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {!notification.read && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
          <span className="text-[10px] text-slate-400 font-bold">{timeAgo(notification.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAllRead, clearNotification, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleOpen = () => {
    setIsOpen(v => {
      if (!v) markAllRead(); // mark all read when opening
      return !v;
    });
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="relative p-2 text-slate-700 hover:text-amber-500 transition-colors"
        title="Notifications"
      >
        <Bell size={22} className={isOpen ? 'text-amber-500' : ''} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 animate-bounce shadow-lg shadow-rose-500/40">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-3 w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[200] overflow-hidden"
          style={{ animation: 'slideDown 0.2s ease-out' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-amber-500" />
              <span className="font-black text-white text-sm tracking-tight">Notifications</span>
              {notifications.length > 0 && (
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/30">
                  {notifications.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllRead}
                    className="text-slate-400 hover:text-amber-400 transition-colors"
                    title="Mark all read"
                  >
                    <CheckCheck size={15} />
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                    title="Clear all"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[420px] overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                <Bell size={36} className="mb-3 opacity-40" />
                <p className="text-sm font-bold text-slate-400">No notifications yet</p>
                <p className="text-[11px] text-slate-300 mt-1">New orders, enquiries & low stock alerts will appear here.</p>
              </div>
            ) : (
              notifications.map(n => (
                <NotificationItem key={n.id} notification={n} onDismiss={clearNotification} />
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
