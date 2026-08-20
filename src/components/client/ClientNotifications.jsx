import React, { useState, useEffect } from 'react';
import {
  Bell, CheckCircle2, Clock, RefreshCw, AlertCircle, Check
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function ClientNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/client/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      } else {
        setError(data.message || 'Failed to load notifications.');
      }
    } catch (err) {
      setError('Could not connect to notification service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await adminFetch(`/api/client/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await adminFetch('/api/client/notifications/read-all', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {}
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#FF6B00' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Enterprise Notifications...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={24} color="#FF6B00" /> Notifications & Deliverable Alerts
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Milestone progress reports, QA deployments, payment invoices, and release notices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleMarkAllRead}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={13} /> Mark All as Read
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '48px 20px',
          textAlign: 'center',
          color: '#64748B'
        }}>
          <Bell size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
          <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>No Notifications</h3>
          <p style={{ fontSize: '0.88rem' }}>No unread deliverable notifications at this time.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map(n => (
            <div
              key={n.id}
              style={{
                background: '#0B1120',
                borderRadius: '10px',
                border: `1px solid ${n.is_read ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 107, 0, 0.3)'}`,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: n.is_read ? 'transparent' : '#FF6B00',
                  marginTop: '6px',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '6px' }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                    {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                  </div>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FF6B00',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
