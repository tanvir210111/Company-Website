import React, { useState, useEffect } from 'react';
import {
  HelpCircle, Plus, Search, Filter, RefreshCw, Edit, Trash2, Eye, EyeOff,
  CheckCircle2, AlertCircle, MessageCircleQuestion, Tag
} from 'lucide-react';

const FAQ_CATEGORIES = ['courses', 'freelancing', 'payments', 'certificates', 'general'];

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  // Form States
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('general');
  const [sortOrder, setSortOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const res = await fetch(`${backendUrl}/api/admin/faqs?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setFaqs(data.faqs || []);
      } else {
        setError(data.message || 'Failed to retrieve FAQs list.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFaqs();
  };

  // Toggle Status Handler
  const handleToggleStatus = async (item) => {
    const newStatus = item.is_active ? 0 : 1;
    const actionName = newStatus === 1 ? 'publish' : 'unpublish';

    if (!window.confirm(`Are you sure you want to ${actionName} FAQ "${item.question}"?`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/faqs/${item.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || `FAQ successfully ${newStatus === 1 ? 'published' : 'unpublished'}.`);
        setTimeout(() => setActionSuccess(null), 4000);
        fetchFaqs();
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch (err) {
      alert('Network error updating status.');
    }
  };

  // Delete Handler
  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete FAQ "${item.question}"?`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/faqs/${item.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'FAQ deleted successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchFaqs();
      } else {
        alert(data.message || 'Deletion failed.');
      }
    } catch (err) {
      alert('Network error deleting FAQ.');
    }
  };

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
    setCategory('general');
    setSortOrder((faqs.length + 1).toString());
    setIsActive(true);
    setFormError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedFaq(item);
    setQuestion(item.question || '');
    setAnswer(item.answer || '');
    setCategory(item.category || 'general');
    setSortOrder((item.sort_order || 1).toString());
    setIsActive(!!item.is_active);
    setFormError('');
    setEditModalOpen(true);
  };

  const handleCreateFaq = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!question || !answer) {
      setFormError('Question and answer text are required.');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

      const res = await fetch(`${backendUrl}/api/admin/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question,
          answer,
          category,
          sort_order: parseInt(sortOrder || '0', 10),
          is_active: isActive ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setAddModalOpen(false);
        setActionSuccess(data.message || 'New FAQ created successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchFaqs();
      } else {
        setFormError(data.message || 'Failed to create FAQ.');
      }
    } catch (err) {
      setFormError('Server error creating FAQ.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateFaq = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!question || !answer) {
      setFormError('Question and answer text are required.');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

      const res = await fetch(`${backendUrl}/api/admin/faqs/${selectedFaq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question,
          answer,
          category,
          sort_order: parseInt(sortOrder || '0', 10),
          is_active: isActive ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditModalOpen(false);
        setActionSuccess(data.message || 'FAQ updated successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchFaqs();
      } else {
        setFormError(data.message || 'Failed to update FAQ.');
      }
    } catch (err) {
      setFormError('Server error updating FAQ.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TITLE & ADD BUTTON */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Frequently Asked Questions (FAQ) CMS
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Manage public FAQs, course inquiries, installment policies, and accordion ordering.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
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
          <Plus size={16} /> Add New FAQ
        </button>
      </div>

      {/* NOTIFICATION */}
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
              placeholder="Search by question or answer..."
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
            <option value="unpublished">Unpublished Only</option>
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

      {/* FAQS TABLE */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px auto', color: '#00B4D8' }} />
            <p>Loading FAQ catalog...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : faqs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            <HelpCircle size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No FAQs found matching search filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px' }}>Order</th>
                  <th style={{ padding: '12px' }}>Question</th>
                  <th style={{ padding: '12px' }}>Answer Preview</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((f, idx) => (
                  <tr key={f.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#00B4D8' }}>#{f.sort_order || idx + 1}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#FFFFFF', maxWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageCircleQuestion size={16} color="#00B4D8" style={{ flexShrink: 0 }} />
                        <span>{f.question}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#94A3B8', maxWidth: '320px' }}>
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontSize: '0.8rem'
                      }}>
                        {f.answer}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: '#070A12',
                        color: '#CBD5E1',
                        border: '1px solid var(--border-light)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        {f.category || 'general'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: f.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: f.is_active ? '#10B981' : '#EF4444'
                      }}>
                        {f.is_active ? 'PUBLISHED' : 'UNPUBLISHED'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleStatus(f)}
                          title={f.is_active ? "Unpublish FAQ" : "Publish FAQ"}
                          style={{ background: 'transparent', border: 'none', color: f.is_active ? '#EF4444' : '#10B981', cursor: 'pointer', padding: '4px' }}
                        >
                          {f.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(f)}
                          title="Edit FAQ"
                          style={{ background: 'transparent', border: 'none', color: '#F59E0B', cursor: 'pointer', padding: '4px' }}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(f)}
                          title="Delete FAQ"
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

      {/* ADD FAQ MODAL */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setAddModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Create New FAQ Item
            </h3>

            <form onSubmit={handleCreateFaq}>
              <div className="form-group">
                <label className="form-label">Question *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Are classes held offline in lab or online?"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Answer *</label>
                <textarea
                  rows={4}
                  required
                  className="form-input"
                  placeholder="Provide clear, helpful answer..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {FAQ_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Publication Status</label>
                  <select
                    className="form-input"
                    value={isActive ? '1' : '0'}
                    onChange={e => setIsActive(e.target.value === '1')}
                  >
                    <option value="1">Published (Visible on site)</option>
                    <option value="0">Unpublished (Draft mode)</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div style={{ color: '#EF4444', fontSize: '0.84rem', marginBottom: '14px' }}>
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '10px', fontWeight: 700 }}
              >
                {submitting ? 'Creating FAQ...' : 'Create FAQ'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FAQ MODAL */}
      {editModalOpen && selectedFaq && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setEditModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Edit FAQ Item
            </h3>

            <form onSubmit={handleUpdateFaq}>
              <div className="form-group">
                <label className="form-label">Question *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Answer *</label>
                <textarea
                  rows={4}
                  required
                  className="form-input"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {FAQ_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Publication Status</label>
                  <select
                    className="form-input"
                    value={isActive ? '1' : '0'}
                    onChange={e => setIsActive(e.target.value === '1')}
                  >
                    <option value="1">Published (Visible on site)</option>
                    <option value="0">Unpublished (Draft mode)</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div style={{ color: '#EF4444', fontSize: '0.84rem', marginBottom: '14px' }}>
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '10px', fontWeight: 700 }}
              >
                {submitting ? 'Saving Changes...' : 'Update FAQ'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
