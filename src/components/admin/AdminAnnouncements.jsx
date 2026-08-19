import React, { useState, useEffect } from 'react';
import {
  Megaphone, Plus, Search, Filter, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight, Eye
} from 'lucide-react';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Search & Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Create Announcement Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [status, setStatus] = useState('published');
  const [submittingAnn, setSubmittingAnn] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 10);
      if (audienceFilter !== 'all') queryParams.append('target_audience', audienceFilter);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());

      const res = await fetch(`${backendUrl}/api/admin/announcements?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to retrieve announcements.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [page, audienceFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAnnouncements();
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmittingAnn(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          target_audience: targetAudience,
          status
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('Platform announcement published.');
        setTimeout(() => setActionSuccess(null), 4000);
        setCreateModalOpen(false);
        setTitle('');
        setContent('');
        fetchAnnouncements();
      } else {
        alert(data.message || 'Failed to publish announcement.');
      }
    } catch (err) {
      alert('Error publishing announcement.');
    } finally {
      setSubmittingAnn(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TITLE & HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Megaphone color="#00B4D8" size={28} /> Platform Announcements
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Publish official broadcasts, general notices, or segment-specific news across the platform.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}
        >
          <Plus size={16} /> New Announcement
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

      {/* FILTERS & SEARCH */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search announcement title, content..."
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

          <select
            value={audienceFilter}
            onChange={e => { setAudienceFilter(e.target.value); setPage(1); }}
            style={{
              background: '#070A12',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#94A3B8',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            <option value="all">All Audiences</option>
            <option value="students">Students</option>
            <option value="clients">Clients</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            style={{
              background: '#070A12',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#94A3B8',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

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
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
            <p>Loading Announcements...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : announcements.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
            <Megaphone size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No announcements found matching your filters.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 16px' }}>Title</th>
                <th style={{ padding: '14px 16px' }}>Target Audience</th>
                <th style={{ padding: '14px 16px' }}>Content Preview</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Published Date</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 700, maxWidth: '240px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.title}
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
                      {a.target_audience}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#94A3B8', maxWidth: '320px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                      {a.content}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      background: a.status === 'published' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: a.status === 'published' ? '#10B981' : '#F59E0B',
                      border: '1px solid var(--border-light)'
                    }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.78rem' }}>
                    {new Date(a.published_at || a.created_at).toLocaleDateString()}
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
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total announcements)
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

      {/* CREATE ANNOUNCEMENT MODAL */}
      {createModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <button className="modal-close" onClick={() => setCreateModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Megaphone color="#00B4D8" size={22} /> Publish Platform Announcement
            </h3>

            <form onSubmit={handleCreateAnnouncement}>
              <div className="form-group">
                <label className="form-label">Announcement Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. New Academic Course Track Launching in March 2026"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Audience *</label>
                <select
                  className="form-input"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                >
                  <option value="all">Everyone (All Visitors & Users)</option>
                  <option value="students">Students Only</option>
                  <option value="clients">Corporate Clients Only</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  className="form-input"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="published">Published Immediately</option>
                  <option value="draft">Save as Draft</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Announcement Body / Content *</label>
                <textarea
                  required
                  rows={5}
                  className="form-input"
                  placeholder="Write complete announcement details..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={submittingAnn}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontWeight: 800, fontSize: '0.95rem', marginTop: '8px' }}
              >
                {submittingAnn ? 'Publishing Announcement...' : 'Publish Announcement'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
