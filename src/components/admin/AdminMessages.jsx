import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Plus, Search, Filter, RefreshCw, Eye, CheckCircle2, ChevronLeft, ChevronRight, Send, User
} from 'lucide-react';
import AdminConversationModal from './AdminConversationModal';

export default function AdminMessages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // New Message Modal
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [submittingNew, setSubmittingNew] = useState(false);

  // Thread Inspector Modal
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [threadModalOpen, setThreadModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/users?limit=100`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        // Only Students and Clients
        const filtered = (data.users || []).filter(u => ['student', 'client'].includes(u.role) && u.is_active);
        setUserOptions(filtered);
      }
    } catch (err) {
      console.log('Error fetching user options:', err);
    }
  };

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 10);
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());

      const res = await fetch(`${backendUrl}/api/admin/messages?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to retrieve message threads.');
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
    fetchConversations();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchConversations();
  };

  const handleCreateNewConversation = async (e) => {
    e.preventDefault();
    if (!selectedRecipientId || !subject.trim() || !initialMessage.trim()) return;

    setSubmittingNew(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recipient_id: selectedRecipientId,
          subject: subject.trim(),
          message: initialMessage.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('New message conversation started.');
        setTimeout(() => setActionSuccess(null), 4000);
        setNewModalOpen(false);
        setSelectedRecipientId('');
        setSubject('');
        setInitialMessage('');
        fetchConversations();
      } else {
        alert(data.message || 'Failed to send message.');
      }
    } catch (err) {
      alert('Error sending message.');
    } finally {
      setSubmittingNew(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TITLE & HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare color="#00B4D8" size={28} /> Internal Messages & Support Inbox
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Communicate directly with Students and Corporate Clients through official internal message threads.
          </p>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}
        >
          <Plus size={16} /> New Message Thread
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
              placeholder="Search by subject, recipient name, email..."
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
      <div className="table-responsive-wrapper" style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
            <p>Loading Messages...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
            <MessageSquare size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No message conversations found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '14px 16px' }}>Subject</th>
                  <th style={{ padding: '14px 16px' }}>Recipient</th>
                  <th style={{ padding: '14px 16px' }}>Last Message Preview</th>
                  <th style={{ padding: '14px 16px' }}>Last Updated</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 700, maxWidth: '240px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.subject}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#CBD5E1' }}>
                      <div>{c.recipient_name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#00B4D8', textTransform: 'capitalize' }}>{c.recipient_role}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94A3B8', maxWidth: '280px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                        {c.last_message || 'No messages yet.'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.78rem' }}>
                      {new Date(c.updated_at || c.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => { setSelectedConvId(c.id); setThreadModalOpen(true); }}
                        style={{
                          background: 'rgba(0, 180, 216, 0.15)',
                          color: '#00B4D8',
                          border: '1px solid rgba(0, 180, 216, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Eye size={14} /> Open Thread
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '1px solid var(--border-light)', background: '#070A12', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total conversations)
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

      {/* NEW MESSAGE MODAL */}
      {newModalOpen && (
        <div className="modal-overlay" onClick={() => setNewModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <button className="modal-close" onClick={() => setNewModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare color="#00B4D8" size={22} /> Start New Message Thread
            </h3>

            <form onSubmit={handleCreateNewConversation}>
              <div className="form-group">
                <label className="form-label">Recipient (Student or Corporate Client) *</label>
                <select
                  required
                  className="form-input"
                  value={selectedRecipientId}
                  onChange={e => setSelectedRecipientId(e.target.value)}
                >
                  <option value="">-- Select Recipient User Account --</option>
                  {userOptions.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.role.toUpperCase()}) — {u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Course Enrollment Notice / Project Delivery Update"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  className="form-input"
                  placeholder="Write your official message..."
                  value={initialMessage}
                  onChange={e => setInitialMessage(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={submittingNew || !selectedRecipientId}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontWeight: 800, fontSize: '0.95rem', marginTop: '8px' }}
              >
                {submittingNew ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* THREAD INSPECTOR MODAL */}
      <AdminConversationModal
        isOpen={threadModalOpen}
        onClose={() => setThreadModalOpen(false)}
        conversationId={selectedConvId}
        onReplySuccess={() => fetchConversations()}
      />

    </div>
  );
}
