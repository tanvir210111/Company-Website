import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Plus, Search, Filter, RefreshCw, Edit, Trash2, Eye, EyeOff,
  CheckCircle2, AlertCircle, Star, BookOpen, Clock, Tag
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

const CATEGORY_OPTIONS = ['Graphics & Design', 'Web & Software', 'Programming', 'Digital Marketing', 'Others'];

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Web & Software');
  const [hours, setHours] = useState('64 Hours');
  const [duration, setDuration] = useState('3 Months');
  const [regularFee, setRegularFee] = useState('25000');
  const [discountFee, setDiscountFee] = useState('18000');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [curriculumText, setCurriculumText] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      let queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (categoryFilter !== 'all') queryParams.append('category', categoryFilter);

      const res = await adminFetch(`/api/admin/courses?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
      } else {
        setError(data.message || 'Failed to retrieve courses list.');
      }
    } catch (err) {
      setError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  // Toggle Published / Unpublished Status
  const handleToggleStatus = async (crs) => {
    const newStatus = crs.is_active ? 0 : 1;
    const actionName = newStatus === 1 ? 'publish' : 'unpublish';

    if (!window.confirm(`Are you sure you want to ${actionName} course "${crs.title}"?`)) {
      return;
    }

    try {
      const res = await adminFetch(`/api/admin/courses/${crs.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || `Course successfully ${newStatus === 1 ? 'published' : 'unpublished'}.`);
        setTimeout(() => setActionSuccess(null), 4000);
        fetchCourses();
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch (err) {
      alert('Network error updating status.');
    }
  };

  // Delete / Soft Deactivate Handler
  const handleDelete = async (crs) => {
    if (!window.confirm(`Are you sure you want to remove course "${crs.title}"?`)) {
      return;
    }

    try {
      const res = await adminFetch(`/api/admin/courses/${crs.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Course record updated.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchCourses();
      } else {
        alert(data.message || 'Deletion failed.');
      }
    } catch (err) {
      alert('Network error removing course.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setCategory('Web & Software');
    setHours('64 Hours');
    setDuration('3 Months');
    setRegularFee('25000');
    setDiscountFee('18000');
    setShortDesc('');
    setFullDesc('');
    setImageUrl('');
    setCurriculumText('');
    setIsPopular(false);
    setDisplayOrder((courses.length + 1).toString());
    setIsActive(true);
    setFormError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const handleOpenEdit = (crs) => {
    setSelectedCourse(crs);
    setTitle(crs.title);
    setSlug(crs.slug);
    setCategory(crs.category || 'Web & Software');
    setHours(crs.hours || '64 Hours');
    setDuration(crs.duration || '3 Months');
    setRegularFee(crs.regular_fee ? crs.regular_fee.toString() : '25000');
    setDiscountFee(crs.discount_fee ? crs.discount_fee.toString() : '18000');
    setShortDesc(crs.short_desc || crs.shortDesc || '');
    setFullDesc(crs.full_description || crs.short_desc || '');
    setImageUrl(crs.thumbnail_url || crs.image || '');
    setCurriculumText(Array.isArray(crs.curriculum) ? crs.curriculum.join('\n') : '');
    setIsPopular(!!crs.is_popular || !!crs.popular);
    setDisplayOrder((crs.display_order || 1).toString());
    setIsActive(!!crs.is_active);
    setFormError('');
    setEditModalOpen(true);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title || !regularFee || !shortDesc) {
      setFormError('Title, regular fee, and short description are required.');
      return;
    }

    setSubmitting(true);
    try {
      const curriculumList = curriculumText.split('\n').map(c => c.trim()).filter(Boolean);

      const res = await adminFetch('/api/admin/courses', {
        method: 'POST',
        body: JSON.stringify({
          title,
          slug,
          category,
          hours,
          duration,
          regular_fee: parseFloat(regularFee),
          discount_fee: parseFloat(discountFee || regularFee),
          short_desc: shortDesc,
          full_description: fullDesc,
          curriculum: curriculumList,
          thumbnail_url: imageUrl,
          is_popular: isPopular ? 1 : 0,
          display_order: parseInt(displayOrder || '0', 10),
          is_active: isActive ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setAddModalOpen(false);
        setActionSuccess(data.message || 'New course created successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchCourses();
      } else {
        setFormError(data.message || 'Failed to create course.');
      }
    } catch (err) {
      setFormError('Server error creating course.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title || !regularFee || !shortDesc) {
      setFormError('Title, regular fee, and short description are required.');
      return;
    }

    setSubmitting(true);
    try {
      const curriculumList = curriculumText.split('\n').map(c => c.trim()).filter(Boolean);

      const res = await adminFetch(`/api/admin/courses/${selectedCourse.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          slug,
          category,
          hours,
          duration,
          regular_fee: parseFloat(regularFee),
          discount_fee: parseFloat(discountFee || regularFee),
          short_desc: shortDesc,
          full_description: fullDesc,
          curriculum: curriculumList,
          thumbnail_url: imageUrl,
          is_popular: isPopular ? 1 : 0,
          display_order: parseInt(displayOrder || '0', 10),
          is_active: isActive ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditModalOpen(false);
        setActionSuccess(data.message || 'Course updated successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchCourses();
      } else {
        setFormError(data.message || 'Failed to update course.');
      }
    } catch (err) {
      setFormError('Server error updating course.');
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
            Course Catalog CMS
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Manage IT training courses, fees, curriculum outlines, and publication status.
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
          <Plus size={16} /> Add New Course
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
              placeholder="Search by course title, category, or slug..."
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
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
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
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

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

      {/* COURSES TABLE */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px auto', color: '#00B4D8' }} />
            <p>Loading course catalog...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            <GraduationCap size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No courses found matching current search filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px' }}>Order</th>
                  <th style={{ padding: '12px' }}>Course Title</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Fee (Discount / Reg)</th>
                  <th style={{ padding: '12px' }}>Duration</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, idx) => (
                  <tr key={c.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#00B4D8' }}>#{c.display_order || idx + 1}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {c.thumbnail_url || c.image ? (
                          <img
                            src={c.thumbnail_url || c.image}
                            alt={c.title}
                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#070A12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00B4D8' }}>
                            <GraduationCap size={20} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {c.title}
                            {(c.is_popular || c.popular) ? (
                              <span style={{ background: 'rgba(255, 183, 3, 0.2)', color: '#FFB703', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <Star size={10} fill="#FFB703" /> POPULAR
                              </span>
                            ) : null}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748B' }}>/{c.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#94A3B8' }}>{c.category || 'Web & Software'}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 800, color: '#10B981' }}>{c.discountFee || `TK ${parseInt(c.discount_fee || 0).toLocaleString()}`}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', textDecoration: 'line-through' }}>{c.fee || `TK ${parseInt(c.regular_fee || 0).toLocaleString()}`}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#CBD5E1', fontSize: '0.8rem' }}>
                      {c.duration || '3 Months'} ({c.hours || '64 Hours'})
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: c.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: c.is_active ? '#10B981' : '#EF4444'
                      }}>
                        {c.is_active ? 'PUBLISHED' : 'UNPUBLISHED'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleStatus(c)}
                          title={c.is_active ? "Unpublish Course" : "Publish Course"}
                          style={{ background: 'transparent', border: 'none', color: c.is_active ? '#EF4444' : '#10B981', cursor: 'pointer', padding: '4px' }}
                        >
                          {c.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(c)}
                          title="Edit Course"
                          style={{ background: 'transparent', border: 'none', color: '#F59E0B', cursor: 'pointer', padding: '4px' }}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(c)}
                          title="Delete / Deactivate Course"
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

      {/* ADD COURSE MODAL */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setAddModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Create New IT Training Course
            </h3>

            <form onSubmit={handleCreateCourse}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Course Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Flutter Mobile App Development"
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
                    placeholder="flutter-app-development"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Months/Weeks)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="3 Months"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Hours</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="64 Hours"
                    value={hours}
                    onChange={e => setHours(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Regular Fee (TK) *</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    placeholder="25000"
                    value={regularFee}
                    onChange={e => setRegularFee(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Offer / Discount Fee (TK) *</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    placeholder="18000"
                    value={discountFee}
                    onChange={e => setDiscountFee(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Cover Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Summary Description *</label>
                <textarea
                  rows={2}
                  required
                  className="form-input"
                  placeholder="Short description for course card..."
                  value={shortDesc}
                  onChange={e => setShortDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Curriculum Modules (One module per line)</label>
                <textarea
                  rows={4}
                  className="form-input"
                  placeholder="Module 1: Dart Programming Basics&#10;Module 2: Flutter UI Widgets&#10;Module 3: REST API Integration"
                  value={curriculumText}
                  onChange={e => setCurriculumText(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'center' }}>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                  <input
                    type="checkbox"
                    id="isPopularCheck"
                    checked={isPopular}
                    onChange={e => setIsPopular(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isPopularCheck" style={{ color: '#FFB703', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    Mark as Popular Course
                  </label>
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
                {submitting ? 'Creating Course...' : 'Create Course'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COURSE MODAL */}
      {editModalOpen && selectedCourse && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setEditModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Edit Course: {selectedCourse.title}
            </h3>

            <form onSubmit={handleUpdateCourse}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Course Title *</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hours</label>
                  <input
                    type="text"
                    className="form-input"
                    value={hours}
                    onChange={e => setHours(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Regular Fee (TK) *</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={regularFee}
                    onChange={e => setRegularFee(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount Fee (TK) *</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={discountFee}
                    onChange={e => setDiscountFee(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Cover Image URL</label>
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
                <label className="form-label">Curriculum Modules (One per line)</label>
                <textarea
                  rows={4}
                  className="form-input"
                  value={curriculumText}
                  onChange={e => setCurriculumText(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'center' }}>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                  <input
                    type="checkbox"
                    id="isPopularCheckEdit"
                    checked={isPopular}
                    onChange={e => setIsPopular(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isPopularCheckEdit" style={{ color: '#FFB703', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    Mark as Popular Course
                  </label>
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
                {submitting ? 'Saving Changes...' : 'Update Course'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
