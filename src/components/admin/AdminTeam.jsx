import React, { useState, useEffect } from 'react';
import {
  Users, Plus, Search, Filter, RefreshCw, Edit, Trash2, Eye, EyeOff,
  CheckCircle2, AlertCircle, Mail, Phone, Globe, Link as LinkIcon, Share2, Briefcase
} from 'lucide-react';

const DEPARTMENT_OPTIONS = ['Software Development', 'Creative Media', 'IT Department', 'Executive & Management', 'Digital Marketing', 'Others'];

export default function AdminTeam() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('Software Development');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [sortOrder, setSortOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const res = await fetch(`${backendUrl}/api/admin/team?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setTeamMembers(data.team || []);
      } else {
        setError(data.message || 'Failed to retrieve team members.');
      }
    } catch (err) {
      setError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTeamMembers();
  };

  // Toggle Status Handler
  const handleToggleStatus = async (m) => {
    const newStatus = m.is_active ? 0 : 1;
    const actionName = newStatus === 1 ? 'publish' : 'unpublish';

    if (!window.confirm(`Are you sure you want to ${actionName} team member "${m.name}"?`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/team/${m.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || `Member successfully ${newStatus === 1 ? 'published' : 'unpublished'}.`);
        setTimeout(() => setActionSuccess(null), 4000);
        fetchTeamMembers();
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch (err) {
      alert('Network error updating status.');
    }
  };

  // Delete Handler
  const handleDelete = async (m) => {
    if (!window.confirm(`Are you sure you want to remove team member "${m.name}"?`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/team/${m.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Team member record removed.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchTeamMembers();
      } else {
        alert(data.message || 'Deletion failed.');
      }
    } catch (err) {
      alert('Network error deleting team member.');
    }
  };

  const resetForm = () => {
    setName('');
    setDesignation('');
    setDepartment('Software Development');
    setEmail('');
    setPhone('');
    setBio('');
    setPhotoUrl('');
    setFacebookUrl('');
    setLinkedinUrl('');
    setGithubUrl('');
    setSortOrder((teamMembers.length + 1).toString());
    setIsActive(true);
    setFormError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setSelectedMember(m);
    setName(m.name);
    setDesignation(m.designation || m.role || '');
    setDepartment(m.department || m.category || 'Software Development');
    setEmail(m.email || '');
    setPhone(m.phone || '');
    setBio(m.bio || '');
    setPhotoUrl(m.photo_url || m.avatar || '');
    setFacebookUrl(m.facebook_url || m.facebook || '');
    setLinkedinUrl(m.linkedin_url || m.linkedin || '');
    setGithubUrl(m.github_url || m.github || '');
    setSortOrder((m.sort_order || 1).toString());
    setIsActive(!!m.is_active);
    setFormError('');
    setEditModalOpen(true);
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !designation) {
      setFormError('Member name and designation are required.');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

      const res = await fetch(`${backendUrl}/api/admin/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          designation,
          department,
          email,
          phone,
          bio,
          photo_url: photoUrl,
          facebook_url: facebookUrl,
          linkedin_url: linkedinUrl,
          github_url: githubUrl,
          sort_order: parseInt(sortOrder || '0', 10),
          is_active: isActive ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setAddModalOpen(false);
        setActionSuccess(data.message || 'New team member added successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchTeamMembers();
      } else {
        setFormError(data.message || 'Failed to add team member.');
      }
    } catch (err) {
      setFormError('Server error creating team member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !designation) {
      setFormError('Member name and designation are required.');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

      const res = await fetch(`${backendUrl}/api/admin/team/${selectedMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          designation,
          department,
          email,
          phone,
          bio,
          photo_url: photoUrl,
          facebook_url: facebookUrl,
          linkedin_url: linkedinUrl,
          github_url: githubUrl,
          sort_order: parseInt(sortOrder || '0', 10),
          is_active: isActive ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditModalOpen(false);
        setActionSuccess(data.message || 'Team member updated successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchTeamMembers();
      } else {
        setFormError(data.message || 'Failed to update team member.');
      }
    } catch (err) {
      setFormError('Server error updating team member.');
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
            Team Management CMS
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Manage public team profiles, corporate designations, social media links, and display order.
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
          <Plus size={16} /> Add Team Member
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
              placeholder="Search team member name or designation..."
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

      {/* TEAM TABLE */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px auto', color: '#00B4D8' }} />
            <p>Loading team directory...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            <Users size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No team members found matching current filter.</p>
          </div>
        ) : (
          <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px' }}>Order</th>
                  <th style={{ padding: '12px' }}>Team Member</th>
                  <th style={{ padding: '12px' }}>Designation</th>
                  <th style={{ padding: '12px' }}>Department</th>
                  <th style={{ padding: '12px' }}>Social Profiles</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((m, idx) => (
                  <tr key={m.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#00B4D8' }}>#{m.sort_order || idx + 1}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {m.photo_url || m.avatar ? (
                          <img
                            src={m.photo_url || m.avatar}
                            alt={m.name}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#070A12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00B4D8' }}>
                            <Users size={18} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{m.name}</div>
                          {m.email && <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{m.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#CBD5E1', fontWeight: 600 }}>{m.designation || m.role}</td>
                    <td style={{ padding: '12px', color: '#94A3B8' }}>{m.department || m.category || 'IT Department'}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B' }}>
                        {(m.linkedin_url || m.linkedin) && (
                          <a href={m.linkedin_url || m.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" style={{ color: '#0A66C2' }}>
                            <LinkIcon size={15} />
                          </a>
                        )}
                        {(m.github_url || m.github) && (
                          <a href={m.github_url || m.github} target="_blank" rel="noreferrer" title="GitHub" style={{ color: '#FFFFFF' }}>
                            <Globe size={15} />
                          </a>
                        )}
                        {(m.facebook_url || m.facebook) && (
                          <a href={m.facebook_url || m.facebook} target="_blank" rel="noreferrer" title="Facebook" style={{ color: '#1877F2' }}>
                            <Share2 size={15} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: m.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: m.is_active ? '#10B981' : '#EF4444'
                      }}>
                        {m.is_active ? 'PUBLISHED' : 'UNPUBLISHED'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleStatus(m)}
                          title={m.is_active ? "Unpublish Profile" : "Publish Profile"}
                          style={{ background: 'transparent', border: 'none', color: m.is_active ? '#EF4444' : '#10B981', cursor: 'pointer', padding: '4px' }}
                        >
                          {m.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(m)}
                          title="Edit Profile"
                          style={{ background: 'transparent', border: 'none', color: '#F59E0B', cursor: 'pointer', padding: '4px' }}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(m)}
                          title="Remove Profile"
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

      {/* ADD MEMBER MODAL */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setAddModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Add New Team Member
            </h3>

            <form onSubmit={handleCreateMember}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Engr. Tanvir Hossain Khan"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Software Engineer"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-input"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                  >
                    {DEPARTMENT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="member@mediascopeit.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Photo Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="/Team/Photo.jpg or https://..."
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio / Profile Summary</label>
                <textarea
                  rows={3}
                  className="form-input"
                  placeholder="3+ years of experience in software engineering..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub Profile URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
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
                {submitting ? 'Adding Member...' : 'Add Team Member'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editModalOpen && selectedMember && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setEditModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Edit Member: {selectedMember.name}
            </h3>

            <form onSubmit={handleUpdateMember}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-input"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                  >
                    {DEPARTMENT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Photo Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio / Profile Summary</label>
                <textarea
                  rows={3}
                  className="form-input"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub Profile URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
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
                {submitting ? 'Saving Changes...' : 'Update Team Member'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
