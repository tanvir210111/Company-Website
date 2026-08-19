import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Search, Filter, RefreshCw, Edit, Trash2, Eye, EyeOff,
  CheckCircle2, AlertCircle, ExternalLink, User, Calendar
} from 'lucide-react';
import PageEditorModal from './PageEditorModal';

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  const fetchPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const res = await fetch(`${backendUrl}/api/admin/pages?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setPages(data.pages || []);
      } else {
        setError(data.message || 'Failed to retrieve custom pages.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPages();
  };

  // Toggle Status Handler
  const handleToggleStatus = async (page) => {
    const newStatus = page.is_active ? 0 : 1;
    const actionName = newStatus === 1 ? 'publish' : 'unpublish';

    if (!window.confirm(`Are you sure you want to ${actionName} page "${page.title}"?`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/pages/${page.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || `Page successfully ${newStatus === 1 ? 'published' : 'unpublished'}.`);
        setTimeout(() => setActionSuccess(null), 4000);
        fetchPages();
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch (err) {
      alert('Network error updating status.');
    }
  };

  // Delete Handler
  const handleDelete = async (page) => {
    if (!window.confirm(`Are you sure you want to delete custom page "${page.title}"?`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/pages/${page.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Page deleted successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchPages();
      } else {
        alert(data.message || 'Deletion failed.');
      }
    } catch (err) {
      alert('Network error deleting page.');
    }
  };

  const handleOpenNew = () => {
    setSelectedPage(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (page) => {
    setSelectedPage(page);
    setEditorOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TITLE & ADD BUTTON */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            WordPress-Like Pages CMS
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Create and publish dynamic custom landing pages, policy documents, and company content without editing source code.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.88rem'
          }}
        >
          <Plus size={16} /> Add New Page
        </button>
      </div>

      {/* SUCCESS NOTIFICATION */}
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
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search by page title or slug..."
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
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
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
            <option value="published">Published Only</option>
            <option value="draft">Draft Only</option>
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

      {/* PAGES TABLE */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px auto', color: '#00B4D8' }} />
            <p>Loading custom pages...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : pages.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            <FileText size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No pages found matching search filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px' }}>ID</th>
                  <th style={{ padding: '12px' }}>Page Title & Slug</th>
                  <th style={{ padding: '12px' }}>Author</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p, idx) => (
                  <tr key={p.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#00B4D8' }}>#{p.id}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{p.title}</div>
                      <div style={{ fontSize: '0.74rem', color: '#00B4D8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>/{p.slug}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#94A3B8' }}>{p.author || 'Media Scope IT Admin'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: p.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: p.is_active ? '#10B981' : '#F59E0B'
                      }}>
                        {p.is_active ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleStatus(p)}
                          title={p.is_active ? "Unpublish Page" : "Publish Page"}
                          style={{ background: 'transparent', border: 'none', color: p.is_active ? '#EF4444' : '#10B981', cursor: 'pointer', padding: '4px' }}
                        >
                          {p.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Edit Page"
                          style={{ background: 'transparent', border: 'none', color: '#F59E0B', cursor: 'pointer', padding: '4px' }}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(p)}
                          title="Delete Custom Page"
                          style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* WORDPRESS PAGE EDITOR MODAL */}
      <PageEditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        initialPage={selectedPage}
        onSaveSuccess={(msg) => {
          setActionSuccess(msg);
          setTimeout(() => setActionSuccess(null), 4000);
          fetchPages();
        }}
      />

    </div>
  );
}
