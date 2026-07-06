import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, ShoppingBag, MessageSquare, AlertTriangle, Trash2, CheckCheck } from 'lucide-react';
import { useNotifications, AppNotification } from '../contexts/NotificationContext';

const typeConfig = {
  low_stock: {
    icon: AlertTriangle,
  },
  new_order: {
    icon: ShoppingBag,
  },
  new_enquiry: {
    icon: MessageSquare,
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
  const cfg = typeConfig[notification.type] || { icon: Bell };
  const Icon = cfg.icon;

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '16px 24px',
        borderBottom: '1px solid var(--outline-variant)',
        backgroundColor: !notification.read ? 'var(--outline-variant)' : 'var(--surface-white)',
        borderLeft: !notification.read ? '3px solid var(--on-surface)' : '3px solid transparent',
        transition: 'background-color 0.2s ease',
        position: 'relative',
      }}
      className="group"
      onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--outline-variant)')}
      onMouseOut={e => (e.currentTarget.style.backgroundColor = !notification.read ? 'var(--outline-variant)' : 'var(--surface-white)')}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '1px solid var(--outline-variant)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          backgroundColor: 'var(--surface-white)',
          color: 'var(--on-surface)',
        }}
      >
        <Icon size={16} strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--on-surface)', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            {notification.title}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--outline)',
              padding: '2px',
              transition: 'color 0.2s',
            }}
            title="Dismiss"
            onMouseOver={e => (e.currentTarget.style.color = 'var(--on-surface)')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--outline)')}
          >
            <X size={14} />
          </button>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', margin: '4px 0 0', lineHeight: '18px', fontFamily: 'Inter, sans-serif' }}>
          {notification.message}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          {!notification.read && (
            <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--on-surface)', borderRadius: '50%' }} />
          )}
          <span style={{ fontSize: '10px', color: 'var(--outline)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
            {timeAgo(notification.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

interface NotificationBellProps {
  transparent?: boolean;
  textColor?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ transparent = false, textColor = '#1a1c1c' }) => {
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
    <div className="relative" style={{ display: 'flex', alignItems: 'center' }}>
      {/* Bell Button */}
      <button
        ref={btnRef}
        onClick={handleOpen}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          position: 'relative', display: 'flex', alignItems: 'center',
          color: textColor, padding: '4px',
          transition: 'color 0.4s ease',
        }}
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell size={20} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute', top: '-4px', right: '-6px',
              minWidth: '16px', height: '16px', padding: '0 3px',
              backgroundColor: textColor,
              color: transparent ? 'var(--on-surface)' : 'var(--surface-white)',
              fontSize: '9px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.4s ease, color 0.4s ease',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          style={{
            position: 'absolute', right: 0, top: 'calc(100% + 16px)',
            width: '380px',
            backgroundColor: 'var(--surface-white)',
            border: '1px solid var(--on-surface)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            zIndex: 200,
            animation: 'fadeIn 0.2s ease-out',
          }}
          className="max-w-[90vw]"
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px', borderBottom: '1px solid var(--on-surface)',
            backgroundColor: 'var(--surface)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="font-caslon" style={{ fontSize: '20px', color: 'var(--on-surface)', fontWeight: 400 }}>
                Notifications
              </span>
              {notifications.length > 0 && (
                <span style={{
                  backgroundColor: 'var(--on-surface)', color: 'var(--surface-white)',
                  padding: '2px 8px', fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {notifications.length}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllRead}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--outline)', display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
                      textTransform: 'uppercase', fontFamily: 'Inter, sans-serif',
                      transition: 'color 0.2s',
                    }}
                    title="Mark all read"
                    onMouseOver={e => (e.currentTarget.style.color = 'var(--on-surface)')}
                    onMouseOut={e => (e.currentTarget.style.color = 'var(--outline)')}
                  >
                    <CheckCheck size={14} /> Read
                  </button>
                  <button
                    onClick={clearAll}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--outline)', display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
                      textTransform: 'uppercase', fontFamily: 'Inter, sans-serif',
                      transition: 'color 0.2s',
                    }}
                    title="Clear all"
                    onMouseOver={e => (e.currentTarget.style.color = 'var(--error)')}
                    onMouseOut={e => (e.currentTarget.style.color = 'var(--outline)')}
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div style={{ maxHeight: '420px', overflowY: 'auto' }} className="custom-scrollbar">
            {notifications.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <Bell size={28} strokeWidth={1} style={{ color: 'var(--outline)', margin: '0 auto 12px' }} />
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--on-surface)', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  No notifications yet
                </p>
                <p style={{ fontSize: '12px', color: 'var(--outline)', margin: '6px 0 0', fontFamily: 'Inter, sans-serif' }}>
                  New orders, enquiries & low stock alerts will appear here.
                </p>
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
