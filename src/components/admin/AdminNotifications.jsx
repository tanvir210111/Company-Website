import React, { useState, useEffect } from 'react';
import {
  Bell, Plus, Search, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight, Send, Users, User
} from 'lucide-react';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Dispatch Notification Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [recipientType, setRecipientType] = useState('specific'); // 'specific', 'all_students', 'all_clients'
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notifType, setNotifType] = useState('system');
  const [submittingNotif, setSubmittingNotif] = useState(false);

  const fetchUsers = async () => {
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/users?limit=100`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setUserOptions((data.users || []).filter(u => u.is_active));
      }
    } catch (err) {
      console.log('Error fetching users:', err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 10);
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());

      const res = await fetch(`${backendUrl}/api/admin/notifications?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to retrieve notifications log.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNotifications();
  };

  const handleDispatchNotification = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSubmittingNotif(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recipient_type: recipientType,
          user_id: recipientType === 'specific' ? selectedUserId : null,
          title: title.trim(),
          message: message.trim(),
          type: notifType
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Notification dispatched successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        setCreateModalOpen(false);
        setTitle('');
        setMessage('');
        setSelectedUserId('');
        fetchNotifications();
      } else {
        alert(data.message || 'Failed to dispatch notification.');
      }
    } catch (err) {
      alert('Error sending notification.');
    } finally {
      setSubmittingNotif(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TITLE & HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell color="#00B4D8" size={28} /> User Notifications Management
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Broadcast real-time in-app alerts and notifications to individual students, corporate clients, or bulk audiences.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}
        >
          <Plus size={16} /> Dispatch Notification
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {actionSuccess && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10B981',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} /> {actionSuccess}
        </div>
      )}

      {/* SEARCH */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search notification title, message, recipient name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#070A12',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#00B4D8',
              color: '#070A12',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="table-responsive-wrapper" style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
            <p>Loading Notifications Log...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
            <Bell size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No notifications log records found.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem', minWidth: '650px' }}>
            <thead>
              <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 16px' }}>Recipient</th>
                <th style={{ padding: '14px 16px' }}>Notification Title</th>
                <th style={{ padding: '14px 16px' }}>Message Preview</th>
                <th style={{ padding: '14px 16px' }}>Category</th>
                <th style={{ padding: '14px 16px' }}>Sent Date</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '14px 16px', color: '#CBD5E1', fontWeight: 600 }}>
                    <div>{n.user_name || `User #${n.user_id}`}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{n.user_email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 700 }}>
                    {n.title}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#94A3B8', maxWidth: '300px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                      {n.message}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      background: 'rgba(0, 180, 216, 0.15)',
                      color: '#00B4D8',
                      border: '1px solid var(--border-light)'
                    }}>
                      {n.type || 'system'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.78rem' }}>
                    {new Date(n.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PAGINATION CONTROLS */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '1px solid var(--border-light)', background: '#070A12' }}>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total notifications)
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{
                  background: '#0F172A',
                  color: page <= 1 ? '#64748B' : '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontWeight: 700,
                  cursor: page <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                style={{
                  background: '#0F172A',
                  color: page >= pagination.totalPages ? '#64748B' : '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontWeight: 700,
                  cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DISPATCH NOTIFICATION MODAL */}
      {createModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <button className="modal-close" onClick={() => setCreateModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell color="#00B4D8" size={22} /> Dispatch User Notification
            </h3>

            <form onSubmit={handleDispatchNotification}>
              <div className="form-group">
                <label className="form-label">Target Audience *</label>
                <select
                  className="form-input"
                  value={recipientType}
                  onChange={e => setRecipientType(e.target.value)}
                >
                  <option value="specific">Individual Specific User</option>
                  <option value="all_students">ALL Active Students (Bulk Notification)</option>
                  <option value="all_clients">ALL Active Corporate Clients (Bulk Notification)</option>
                </select>
              </div>

              {recipientType === 'specific' && (
                <div className="form-group">
                  <label className="form-label">Select User Account *</label>
                  <select
                    required
                    className="form-input"
                    value={selectedUserId}
                    onChange={e => setSelectedUserId(e.target.value)}
                  >
                    <option value="">-- Choose Target Account --</option>
                    {userOptions.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.full_name} ({u.role.toUpperCase()}) — {u.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Notification Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Course Enrollment Confirmed / Project Payment Verified"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category / Type</label>
                <select
                  className="form-input"
                  value={notifType}
                  onChange={e => setNotifType(e.target.value)}
                >
                  <option value="system">System Notice</option>
                  <option value="enrollment">Enrollment Notice</option>
                  <option value="payment">Payment Notice</option>
                  <option value="certificate">Certificate Notice</option>
                  <option value="project">Project Notice</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notification Message *</label>
                <textarea
                  required
                  rows={4}
                  className="form-input"
                  placeholder="Enter clear, concise notification text..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={submittingNotif || (recipientType === 'specific' && !selectedUserId)}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontWeight: 800, fontSize: '0.95rem', marginTop: '8px' }}
              >
                {submittingNotif ? 'Dispatching Notification...' : 'Dispatch Notification'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
