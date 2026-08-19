import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Plus, Search, RefreshCw, Eye, Key, UserX, UserCheck, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import AdminUserProfileModal from './AdminUserProfileModal';

export default function AdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Create Admin Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createError, setCreateError] = useState('');

  // Password Reset Modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetUserId, setResetUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [submittingReset, setSubmittingReset] = useState(false);

  // Profile Modal
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 10);
      queryParams.append('role', 'admin');
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());

      const res = await fetch(`${backendUrl}/api/admin/users?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.users || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to retrieve admin directory.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAdmins();
  };

  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!fullName || !email || !phone || !password) {
      setCreateError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setCreateError('Password must be at least 6 characters long.');
      return;
    }

    setSubmittingCreate(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ full_name: fullName, email, phone, password })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Administrator account created.');
        setTimeout(() => setActionSuccess(null), 4000);
        setCreateModalOpen(false);
        setFullName('');
        setEmail('');
        setPhone('');
        setPassword('');
        fetchAdmins();
      } else {
        setCreateError(data.message || 'Failed to create admin.');
      }
    } catch (err) {
      setCreateError('Error creating administrator account.');
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleStatusToggle = async (adminObj) => {
    const newActive = adminObj.is_active ? 0 : 1;
    const confirmMessage = newActive === 1
      ? `Activate admin account for ${adminObj.full_name}?`
      : `Deactivate admin account for ${adminObj.full_name}?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/users/${adminObj.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: newActive })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Admin status updated.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchAdmins();
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch (err) {
      alert('Network error updating admin status.');
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    setSubmittingReset(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/users/${resetUserId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Password reset successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        setResetModalOpen(false);
        setNewPassword('');
      } else {
        alert(data.message || 'Password reset failed.');
      }
    } catch (err) {
      alert('Error resetting password.');
    } finally {
      setSubmittingReset(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TITLE & HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck color="#00B4D8" size={28} /> Administrator Accounts
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Manage Media Scope IT Ltd system administrators, add new admin users, and perform password resets.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}
        >
          <Plus size={16} /> New Administrator
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
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search admin name, email, phone..."
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
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
            <p>Loading Administrator Accounts...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : admins.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
            <ShieldCheck size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No administrator accounts found.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 16px' }}>ID</th>
                <th style={{ padding: '14px 16px' }}>Full Name</th>
                <th style={{ padding: '14px 16px' }}>Email & Phone</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Created Date</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '14px 16px', color: '#00B4D8', fontWeight: 800 }}>#{a.id}</td>
                  <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 700 }}>
                    {a.full_name}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#CBD5E1' }}>
                    <div>{a.email}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{a.phone}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      background: a.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: a.is_active ? '#10B981' : '#EF4444',
                      border: '1px solid var(--border-light)'
                    }}>
                      {a.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.78rem' }}>
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => { setSelectedAdmin(a); setProfileModalOpen(true); }}
                        style={{
                          background: 'rgba(0, 180, 216, 0.15)',
                          color: '#00B4D8',
                          border: '1px solid rgba(0, 180, 216, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Eye size={14} /> Profile
                      </button>

                      <button
                        onClick={() => { setResetUserId(a.id); setResetModalOpen(true); }}
                        style={{
                          background: '#0F172A',
                          color: '#F59E0B',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Reset Admin Password"
                      >
                        <Key size={14} /> Reset Pass
                      </button>

                      <button
                        onClick={() => handleStatusToggle(a)}
                        style={{
                          background: 'transparent',
                          color: a.is_active ? '#EF4444' : '#10B981',
                          border: `1px solid ${a.is_active ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                          borderRadius: '6px',
                          padding: '6px',
                          cursor: 'pointer'
                        }}
                        title={a.is_active ? 'Deactivate Admin' : 'Activate Admin'}
                      >
                        {a.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
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
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total admins)
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

      {/* CREATE ADMIN MODAL */}
      {createModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="modal-close" onClick={() => setCreateModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck color="#00B4D8" size={22} /> Create Administrator Account
            </h3>

            <form onSubmit={handleCreateAdminSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Mahfuzur Rahman"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="admin@mediascopeit.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="+8801700000000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password * (Min 6 chars)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="form-input"
                  placeholder="Enter strong password..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {createError && <div style={{ color: '#EF4444', fontSize: '0.84rem', marginBottom: '12px' }}>{createError}</div>}

              <button
                type="submit"
                disabled={submittingCreate}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontWeight: 800, fontSize: '0.95rem' }}
              >
                {submittingCreate ? 'Creating Account...' : 'Create Administrator Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN PROFILE MODAL */}
      <AdminUserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={selectedAdmin}
      />

      {/* PASSWORD RESET MODAL */}
      {resetModalOpen && (
        <div className="modal-overlay" onClick={() => setResetModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <button className="modal-close" onClick={() => setResetModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key color="#F59E0B" size={20} /> Reset Admin Password
            </h3>

            <form onSubmit={handlePasswordResetSubmit}>
              <div className="form-group">
                <label className="form-label">New Password * (Min 6 chars)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="form-input"
                  placeholder="Enter new strong password..."
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submittingReset}
                className="btn-primary"
                style={{ width: '100%', padding: '10px', fontWeight: 800, marginTop: '8px' }}
              >
                {submittingReset ? 'Resetting Password...' : 'Confirm Reset Password'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
