import React, { useState, useEffect } from 'react';
import {
  Quote, Plus, Search, Filter, RefreshCw, Edit, Trash2, Eye, EyeOff,
  CheckCircle2, AlertCircle, Star, User, Building, ThumbsUp
} from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  // Form States
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState('5.0');
  const [reviewText, setReviewText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [sortOrder, setSortOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const res = await fetch(`${backendUrl}/api/admin/testimonials?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials || []);
      } else {
        setError(data.message || 'Failed to retrieve testimonials.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTestimonials();
  };

  // Toggle Published / Unpublished Status
  const handleToggleStatus = async (item) => {
    const newStatus = item.is_active ? 0 : 1;
    const actionName = newStatus === 1 ? 'publish' : 'unpublish';

    if (!window.confirm(`Are you sure you want to ${actionName} testimonial by "${item.author_name || item.name}"?`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/testimonials/${item.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || `Testimonial successfully ${newStatus === 1 ? 'published' : 'unpublished'}.`);
        setTimeout(() => setActionSuccess(null), 4000);
        fetchTestimonials();
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch (err) {
      alert('Network error updating status.');
    }
  };

  // Delete Handler
  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete testimonial by "${item.author_name || item.name}"?`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/testimonials/${item.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Testimonial removed successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchTestimonials();
      } else {
        alert(data.message || 'Deletion failed.');
      }
    } catch (err) {
      alert('Network error removing testimonial.');
    }
  };

  const resetForm = () => {
    setAuthorName('');
    setAuthorTitle('');
    setCompany('');
    setRating('5.0');
    setReviewText('');
    setPhotoUrl('');
    setIsFeatured(true);
    setSortOrder((testimonials.length + 1).toString());
    setIsActive(true);
    setFormError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedTestimonial(item);
    setAuthorName(item.author_name || item.name || '');
    setAuthorTitle(item.author_title || item.role || '');
    setCompany(item.company || '');
    setRating(item.rating ? item.rating.toString() : '5.0');
    setReviewText(item.review_text || item.quote || '');
    setPhotoUrl(item.photo_url || item.avatar || '');
    setIsFeatured(!!item.is_featured);
    setSortOrder((item.sort_order || 1).toString());
    setIsActive(!!item.is_active);
    setFormError('');
    setEditModalOpen(true);
  };

  const handleCreateTestimonial = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!authorName || !reviewText) {
      setFormError('Client name and review quote text are required.');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

      const res = await fetch(`${backendUrl}/api/admin/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          author_name: authorName,
          author_title: authorTitle,
          company,
          rating: parseFloat(rating || '5.0'),
          review_text: reviewText,
          photo_url: photoUrl,
          is_featured: isFeatured ? 1 : 0,
          sort_order: parseInt(sortOrder || '0', 10),
          is_active: isActive ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setAddModalOpen(false);
        setActionSuccess(data.message || 'Testimonial created successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchTestimonials();
      } else {
        setFormError(data.message || 'Failed to create testimonial.');
      }
    } catch (err) {
      setFormError('Server error creating testimonial.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTestimonial = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!authorName || !reviewText) {
      setFormError('Client name and review quote text are required.');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

      const res = await fetch(`${backendUrl}/api/admin/testimonials/${selectedTestimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          author_name: authorName,
          author_title: authorTitle,
          company,
          rating: parseFloat(rating || '5.0'),
          review_text: reviewText,
          photo_url: photoUrl,
          is_featured: isFeatured ? 1 : 0,
          sort_order: parseInt(sortOrder || '0', 10),
          is_active: isActive ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditModalOpen(false);
        setActionSuccess(data.message || 'Testimonial updated successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchTestimonials();
      } else {
        setFormError(data.message || 'Failed to update testimonial.');
      }
    } catch (err) {
      setFormError('Server error updating testimonial.');
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
            Testimonials & Alumni Reviews CMS
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Manage client reviews, graduate career success quotes, star ratings, and display order.
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
          <Plus size={16} /> Add Testimonial
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
              placeholder="Search by client name, company, or quote..."
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

      {/* TESTIMONIALS TABLE */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px auto', color: '#00B4D8' }} />
            <p>Loading testimonials catalog...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            <Quote size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No testimonials found matching search filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px' }}>Order</th>
                  <th style={{ padding: '12px' }}>Client / Author</th>
                  <th style={{ padding: '12px' }}>Role & Company</th>
                  <th style={{ padding: '12px' }}>Rating</th>
                  <th style={{ padding: '12px' }}>Review Quote</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t, idx) => (
                  <tr key={t.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#00B4D8' }}>#{t.sort_order || idx + 1}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {t.photo_url || t.avatar ? (
                          <img
                            src={t.photo_url || t.avatar}
                            alt={t.author_name || t.name}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#070A12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00B4D8' }}>
                            <User size={18} />
                          </div>
                        )}
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{t.author_name || t.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#CBD5E1' }}>
                      <div>{t.author_title || t.role}</div>
                      {t.company && <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{t.company}</div>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#FFB703', fontWeight: 800 }}>
                        <Star size={14} fill="#FFB703" /> {t.rating || '5.0'}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#94A3B8', maxWidth: '280px' }}>
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontSize: '0.8rem'
                      }}>
                        "{t.review_text || t.quote}"
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: t.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: t.is_active ? '#10B981' : '#EF4444'
                      }}>
                        {t.is_active ? 'PUBLISHED' : 'UNPUBLISHED'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleStatus(t)}
                          title={t.is_active ? "Unpublish Testimonial" : "Publish Testimonial"}
                          style={{ background: 'transparent', border: 'none', color: t.is_active ? '#EF4444' : '#10B981', cursor: 'pointer', padding: '4px' }}
                        >
                          {t.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(t)}
                          title="Edit Testimonial"
                          style={{ background: 'transparent', border: 'none', color: '#F59E0B', cursor: 'pointer', padding: '4px' }}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(t)}
                          title="Delete Testimonial"
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

      {/* ADD TESTIMONIAL MODAL */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setAddModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Create Client / Student Testimonial
            </h3>

            <form onSubmit={handleCreateTestimonial}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Client / Author Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Tanzin Anik Kabir"
                    value={authorName}
                    onChange={e => setAuthorName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Designation / Role</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Full Stack Developer at TechBD"
                    value={authorTitle}
                    onChange={e => setAuthorTitle(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Company / Organization</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="TechBD / Fiverr / Upwork"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Star Rating (1.0 - 5.0) *</label>
                  <select
                    className="form-input"
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                  >
                    <option value="5.0">5.0 ⭐⭐⭐⭐⭐ (Excellent)</option>
                    <option value="4.5">4.5 ⭐⭐⭐⭐✨ (Very Good)</option>
                    <option value="4.0">4.0 ⭐⭐⭐⭐ (Good)</option>
                    <option value="3.5">3.5 ⭐⭐⭐✨ (Average)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Avatar Photo URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Testimonial Review Quote *</label>
                <textarea
                  rows={3}
                  required
                  className="form-input"
                  placeholder="Comprehensive web development training with practical lab projects..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'center' }}>
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
                {submitting ? 'Creating Testimonial...' : 'Create Testimonial'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TESTIMONIAL MODAL */}
      {editModalOpen && selectedTestimonial && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setEditModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Edit Testimonial: {selectedTestimonial.author_name || selectedTestimonial.name}
            </h3>

            <form onSubmit={handleUpdateTestimonial}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Client / Author Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={authorName}
                    onChange={e => setAuthorName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Designation / Role</label>
                  <input
                    type="text"
                    className="form-input"
                    value={authorTitle}
                    onChange={e => setAuthorTitle(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Company / Organization</label>
                  <input
                    type="text"
                    className="form-input"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Star Rating *</label>
                  <select
                    className="form-input"
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                  >
                    <option value="5.0">5.0 ⭐⭐⭐⭐⭐ (Excellent)</option>
                    <option value="4.5">4.5 ⭐⭐⭐⭐✨ (Very Good)</option>
                    <option value="4.0">4.0 ⭐⭐⭐⭐ (Good)</option>
                    <option value="3.5">3.5 ⭐⭐⭐✨ (Average)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Avatar Photo URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Testimonial Review Quote *</label>
                <textarea
                  rows={3}
                  required
                  className="form-input"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'center' }}>
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
                {submitting ? 'Saving Changes...' : 'Update Testimonial'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
