import React, { useState, useEffect } from 'react';
import {
  Briefcase, Plus, Search, Filter, RefreshCw, Edit, Trash2, Eye, EyeOff,
  CheckCircle2, AlertCircle, ArrowUp, ArrowDown, Code, Users, CreditCard,
  ShoppingCart, Activity, Shield, Globe, Laptop
} from 'lucide-react';

const ICON_OPTIONS = ['Users', 'CreditCard', 'ShoppingCart', 'Activity', 'Code', 'Globe', 'Shield', 'Laptop'];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'published' | 'unpublished'

  // Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Software Products');
  const [tagline, setTagline] = useState('');
  const [icon, setIcon] = useState('Code');
  const [imageUrl, setImageUrl] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [ctaText, setCtaText] = useState('Request Quote');
  const [ctaLink, setCtaLink] = useState('#contact');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const res = await fetch(`${backendUrl}/api/admin/services?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      } else {
        setError(data.message || 'Failed to retrieve services.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  // Toggle Published / Unpublished Status
  const handleToggleStatus = async (srv) => {
    const newStatus = srv.is_active ? 0 : 1;
    const actionName = newStatus === 1 ? 'publish' : 'unpublish';

    if (!window.confirm(`Are you sure you want to ${actionName} service "${srv.title}"?`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/services/${srv.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || `Service successfully ${newStatus === 1 ? 'published' : 'unpublished'}.`);
        setTimeout(() => setActionSuccess(null), 4000);
        fetchServices();
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch (err) {
      alert('Network error updating status.');
    }
  };

  // Delete Handler
  const handleDelete = async (srv) => {
    if (!window.confirm(`Are you sure you want to delete service "${srv.title}"?`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/services/${srv.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Service deleted successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchServices();
      } else {
        alert(data.message || 'Deletion failed.');
      }
    } catch (err) {
      alert('Network error deleting service.');
    }
  };

  // Reset Form
  const resetForm = () => {
    setTitle('');
    setSlug('');
    setCategory('Software Products');
    setTagline('');
    setIcon('Code');
    setImageUrl('');
    setShortDesc('');
    setFullDesc('');
    setFeaturesText('');
    setCtaText('Request Quote');
    setCtaLink('#contact');
    setDisplayOrder((services.length + 1).toString());
    setIsActive(true);
    setFormError('');
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    resetForm();
    setAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (srv) => {
    setSelectedService(srv);
    setTitle(srv.title);
    setSlug(srv.slug);
    setCategory(srv.category || 'Software Products');
    setTagline(srv.tagline || '');
    setIcon(srv.icon || 'Code');
    setImageUrl(srv.image_url || srv.image || '');
    setShortDesc(srv.short_description || '');
    setFullDesc(srv.full_description || srv.short_description || '');
    setFeaturesText(Array.isArray(srv.features) ? srv.features.join('\n') : (srv.features || ''));
    setCtaText(srv.cta_text || 'Request Quote');
    setCtaLink(srv.cta_link || '#contact');
    setDisplayOrder((srv.display_order || 1).toString());
    setIsActive(!!srv.is_active);
    setFormError('');
    setEditModalOpen(true);
  };

  // Create Service Handler
  const handleCreateService = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title || !shortDesc) {
      setFormError('Title and short description are required.');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const featuresList = featuresText.split('\n').map(f => f.trim()).filter(Boolean);

      const res = await fetch(`${backendUrl}/api/admin/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          slug,
          category,
          tagline,
          icon,
          image_url: imageUrl,
          short_description: shortDesc,
          full_description: fullDesc,
          features: featuresList,
          cta_text: ctaText,
          cta_link: ctaLink,
          display_order: parseInt(displayOrder || '0', 10),
          is_active: isActive ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setAddModalOpen(false);
        setActionSuccess(data.message || 'Service created successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchServices();
      } else {
        setFormError(data.message || 'Failed to create service.');
      }
    } catch (err) {
      setFormError('Server error creating service.');
    } finally {
      setSubmitting(false);
    }
  };

  // Update Service Handler
  const handleUpdateService = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title || !shortDesc) {
      setFormError('Title and short description are required.');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const featuresList = featuresText.split('\n').map(f => f.trim()).filter(Boolean);

      const res = await fetch(`${backendUrl}/api/admin/services/${selectedService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          slug,
          category,
          tagline,
          icon,
          image_url: imageUrl,
          short_description: shortDesc,
          full_description: fullDesc,
          features: featuresList,
          cta_text: ctaText,
          cta_link: ctaLink,
          display_order: parseInt(displayOrder || '0', 10),
          is_active: isActive ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditModalOpen(false);
        setActionSuccess(data.message || 'Service updated successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchServices();
      } else {
        setFormError(data.message || 'Failed to update service.');
      }
    } catch (err) {
      setFormError('Server error updating service.');
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
            Services Management CMS
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Manage commercial software products, digital services, features, and display ordering.
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
          <Plus size={16} /> Add New Service
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
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search service title or description..."
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

      {/* SERVICES TABLE */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px auto', color: '#00B4D8' }} />
            <p>Loading services catalog...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            <Briefcase size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No services found matching current search filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px' }}>Order</th>
                  <th style={{ padding: '12px' }}>Service Name</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Icon / Preview</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s, idx) => (
                  <tr key={s.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#00B4D8' }}>#{s.display_order || idx + 1}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{s.title}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>/{s.slug}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#94A3B8' }}>{s.category || 'Software Products'}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {s.image_url || s.image ? (
                          <img
                            src={s.image_url || s.image}
                            alt={s.title}
                            style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#070A12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00B4D8' }}>
                            <Code size={18} />
                          </div>
                        )}
                        <span style={{ fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 600 }}>{s.icon || 'Code'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: s.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: s.is_active ? '#10B981' : '#EF4444'
                      }}>
                        {s.is_active ? 'PUBLISHED' : 'UNPUBLISHED'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleStatus(s)}
                          title={s.is_active ? "Unpublish Service" : "Publish Service"}
                          style={{ background: 'transparent', border: 'none', color: s.is_active ? '#EF4444' : '#10B981', cursor: 'pointer', padding: '4px' }}
                        >
                          {s.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(s)}
                          title="Edit Service"
                          style={{ background: 'transparent', border: 'none', color: '#F59E0B', cursor: 'pointer', padding: '4px' }}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(s)}
                          title="Delete Service"
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

      {/* ADD SERVICE MODAL */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setAddModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Create New Software / Service
            </h3>

            <form onSubmit={handleCreateService}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Service Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. ERP Management Software"
                    value={title}
                    onChange={e => {
                      setTitle(e.target.value);
                      if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">URL Slug</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="erp-software"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lucide Icon Name</label>
                  <select
                    className="form-input"
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                  >
                    {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tagline / Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Short catchy tagline"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  className="form-input"
                  placeholder="Brief overview shown on service card..."
                  value={shortDesc}
                  onChange={e => setShortDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Features List (One feature per line)</label>
                <textarea
                  rows={3}
                  className="form-input"
                  placeholder="Lead Capture & Funnel Tracking&#10;Automated SMS Notifications&#10;bKash Invoice Link"
                  value={featuresText}
                  onChange={e => setFeaturesText(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={displayOrder}
                    onChange={e => setDisplayOrder(e.target.value)}
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
                {submitting ? 'Creating Service...' : 'Create Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SERVICE MODAL */}
      {editModalOpen && selectedService && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setEditModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Edit Service: {selectedService.title}
            </h3>

            <form onSubmit={handleUpdateService}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Service Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">URL Slug</label>
                  <input
                    type="text"
                    className="form-input"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lucide Icon Name</label>
                  <select
                    className="form-input"
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                  >
                    {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tagline / Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  className="form-input"
                  value={shortDesc}
                  onChange={e => setShortDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Features List (One feature per line)</label>
                <textarea
                  rows={3}
                  className="form-input"
                  value={featuresText}
                  onChange={e => setFeaturesText(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={displayOrder}
                    onChange={e => setDisplayOrder(e.target.value)}
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
                {submitting ? 'Saving Changes...' : 'Update Service'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
