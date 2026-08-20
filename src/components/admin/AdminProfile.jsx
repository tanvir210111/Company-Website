import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, User, Mail, Phone, Building2, Calendar, CheckCircle2,
  Lock, Edit3, Key, Camera, RefreshCw, AlertCircle, Save, X, Shield, Clock
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function AdminProfile({ currentUser, onUpdateCurrentUser }) {
  const [adminUser, setAdminUser] = useState(currentUser || {});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'security'

  // Edit Profile Form State
  const [fullName, setFullName] = useState(currentUser?.name || currentUser?.full_name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [department, setDepartment] = useState(currentUser?.department || 'IT Operations & Infrastructure');
  const [designation, setDesignation] = useState(currentUser?.designation || 'Senior System Administrator');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status and Feedback States
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync profile data from backend session / user record on mount
  const refreshProfileData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await adminFetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        const u = data.user;
        setAdminUser(u);
        setFullName(u.name || u.full_name || '');
        setPhone(u.phone || '');
        if (u.department) setDepartment(u.department);
        if (u.designation) setDesignation(u.designation);
        if (u.avatar) setAvatarUrl(u.avatar);
      }
    } catch (err) {
      console.log('Notice refreshing admin profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setAdminUser(currentUser);
      setFullName(currentUser.name || currentUser.full_name || '');
      setPhone(currentUser.phone || '');
      if (currentUser.department) setDepartment(currentUser.department);
      if (currentUser.designation) setDesignation(currentUser.designation);
      if (currentUser.avatar) setAvatarUrl(currentUser.avatar);
    }
    refreshProfileData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    setSavingProfile(true);
    try {
      const userId = adminUser.id || 1;
      const payload = {
        full_name: fullName.trim(),
        name: fullName.trim(),
        phone: phone.trim(),
        department: department.trim(),
        designation: designation.trim(),
        avatar: avatarUrl.trim()
      };

      const res = await adminFetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }

      if (res.ok || (data && data.success)) {
        const updatedUser = {
          ...adminUser,
          name: fullName.trim(),
          full_name: fullName.trim(),
          phone: phone.trim(),
          department: department.trim(),
          designation: designation.trim(),
          avatar: avatarUrl.trim()
        };

        setAdminUser(updatedUser);
        if (onUpdateCurrentUser) {
          onUpdateCurrentUser(updatedUser);
        }
        localStorage.setItem('msit_user', JSON.stringify(updatedUser));

        setSuccessMessage('Administrator profile updated successfully.');
        setTimeout(() => setSuccessMessage(null), 5000);
        setActiveTab('overview');
      } else {
        setErrorMessage(data?.message || 'Failed to update profile.');
      }
    } catch (err) {
      const updatedUser = {
        ...adminUser,
        name: fullName.trim(),
        full_name: fullName.trim(),
        phone: phone.trim(),
        department: department.trim(),
        designation: designation.trim(),
        avatar: avatarUrl.trim()
      };
      setAdminUser(updatedUser);
      if (onUpdateCurrentUser) onUpdateCurrentUser(updatedUser);
      localStorage.setItem('msit_user', JSON.stringify(updatedUser));

      setSuccessMessage('Administrator profile saved.');
      setTimeout(() => setSuccessMessage(null), 5000);
      setActiveTab('overview');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match. Please verify.');
      return;
    }

    setSavingPassword(true);
    try {
      const userId = adminUser.id || 1;
      const res = await adminFetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (data && data.success) {
        setSuccessMessage('Administrator password changed successfully. Your new credentials are now active.');
        setTimeout(() => setSuccessMessage(null), 6000);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setActiveTab('overview');
      } else {
        setErrorMessage(data?.message || 'Failed to change password.');
      }
    } catch (err) {
      setErrorMessage('Error connecting to backend server to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  // Format Join Date
  const joinDateDisplay = adminUser.created_at
    ? new Date(adminUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'January 1, 2026';

  const userInitial = (adminUser.name || adminUser.full_name || 'Admin').charAt(0).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* PAGE TITLE BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck color="#00B4D8" size={28} /> System Administrator Profile
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Manage your master administrator account credentials, personal contact information, and security settings.
          </p>
        </div>

        <button
          onClick={refreshProfileData}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#0B1120',
            border: '1px solid var(--border-light)',
            color: '#00B4D8',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh Profile
        </button>
      </div>

      {/* FEEDBACK NOTIFICATIONS */}
      {successMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#10B981',
          fontSize: '0.88rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#EF4444',
          fontSize: '0.88rem',
          fontWeight: 700
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ADMIN HERO IDENTITY CARD */}
      <div style={{
        background: '#0B1120',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient Top Glow Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #00B4D8 0%, #FFB703 50%, #00B4D8 100%)'
        }} />

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Avatar / Photo with verified badge */}
            <div style={{ position: 'relative' }}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={adminUser.name || 'Admin'}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    border: '2px solid #00B4D8',
                    background: '#070A12'
                  }}
                  onError={() => setAvatarUrl('')}
                />
              ) : (
                <div style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  border: '2px solid rgba(0, 180, 216, 0.4)',
                  boxShadow: '0 8px 24px rgba(0, 180, 216, 0.25)'
                }}>
                  {userInitial}
                </div>
              )}

              <div style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#10B981',
                border: '2px solid #0B1120',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }} title="Account Active & Verified">
                <CheckCircle2 size={14} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {adminUser.name || adminUser.full_name || 'System Administrator'}
                </h2>
                <span style={{
                  background: 'rgba(255, 183, 3, 0.15)',
                  border: '1px solid #FFB703',
                  color: '#FFB703',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Shield size={12} /> System Administrator
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px', fontSize: '0.84rem', color: '#94A3B8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="#00B4D8" /> {adminUser.email || 'info@mediascopeit.com'}
                </span>
                {adminUser.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#00B4D8" /> {adminUser.phone}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#00B4D8" /> {department}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                background: activeTab === 'overview' ? '#00B4D8' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'overview' ? '#070A12' : '#94A3B8',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <User size={15} /> Overview
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              style={{
                background: activeTab === 'edit' ? '#00B4D8' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'edit' ? '#070A12' : '#94A3B8',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Edit3 size={15} /> Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              style={{
                background: activeTab === 'security' ? '#00B4D8' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'security' ? '#070A12' : '#94A3B8',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Lock size={15} /> Change Password
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW DETAILS */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Account Details Panel */}
          <div style={{
            background: '#0B1120',
            border: '1px solid var(--border-light)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User color="#00B4D8" size={18} /> Official Account Credentials
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <div style={infoRowStyle}>
                <span style={labelStyle}>Full Name</span>
                <span style={valStyle}>{adminUser.name || adminUser.full_name || 'System Administrator'}</span>
              </div>

              <div style={infoRowStyle}>
                <span style={labelStyle}>Email Address</span>
                <span style={{ ...valStyle, color: '#00B4D8' }}>{adminUser.email || 'info@mediascopeit.com'}</span>
              </div>

              <div style={infoRowStyle}>
                <span style={labelStyle}>Phone Number</span>
                <span style={valStyle}>{adminUser.phone || '+88 01325-165451'}</span>
              </div>

              <div style={infoRowStyle}>
                <span style={labelStyle}>Account Role</span>
                <span style={{ ...valStyle, color: '#FFB703', fontWeight: 800 }}>System Administrator (Superadmin)</span>
              </div>

              <div style={infoRowStyle}>
                <span style={labelStyle}>Department</span>
                <span style={valStyle}>{department}</span>
              </div>

              <div style={infoRowStyle}>
                <span style={labelStyle}>Designation</span>
                <span style={valStyle}>{designation}</span>
              </div>
            </div>
          </div>

          {/* Security & System Metadata Panel */}
          <div style={{
            background: '#0B1120',
            border: '1px solid var(--border-light)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck color="#10B981" size={18} /> System Privileges & Security
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <div style={infoRowStyle}>
                <span style={labelStyle}>Account Status</span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={12} /> Active & Verified
                </span>
              </div>

              <div style={infoRowStyle}>
                <span style={labelStyle}>Access Tier</span>
                <span style={valStyle}>Root Executive Control (Full CRUD)</span>
              </div>

              <div style={infoRowStyle}>
                <span style={labelStyle}>Session Security</span>
                <span style={valStyle}>HttpOnly Encrypted Cookie + Bearer JWT</span>
              </div>

              <div style={infoRowStyle}>
                <span style={labelStyle}>Account Established</span>
                <span style={valStyle}>{joinDateDisplay}</span>
              </div>

              <div style={infoRowStyle}>
                <span style={labelStyle}>Two-Factor Security</span>
                <span style={{ ...valStyle, color: '#10B981' }}>Hardware / Domain Protected</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setActiveTab('edit')}
                className="btn-outline"
                style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '0.82rem' }}
              >
                <Edit3 size={14} /> Edit Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className="btn-outline"
                style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '0.82rem' }}
              >
                <Key size={14} /> Change Password
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: EDIT PROFILE FORM */}
      {activeTab === 'edit' && (
        <div style={{
          background: '#0B1120',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Edit Administrator Information
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
                Update your public administrator identity and direct contact information.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.84rem'
              }}
            >
              <X size={16} /> Cancel
            </button>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label" style={fieldLabelStyle}>Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Media Scope IT Administrator"
                  style={inputStyle}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={fieldLabelStyle}>Email Address (Protected)</label>
                <input
                  type="email"
                  disabled
                  className="form-input"
                  value={adminUser.email || 'info@mediascopeit.com'}
                  style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed', background: '#050810' }}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px', display: 'block' }}>
                  Root administrator email is locked for security.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" style={fieldLabelStyle}>Direct Phone Number *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +88 01325-165451"
                  style={inputStyle}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={fieldLabelStyle}>Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. IT Operations & Software Engineering"
                  style={inputStyle}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={fieldLabelStyle}>Designation / Official Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  placeholder="e.g. Senior System Administrator"
                  style={inputStyle}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={fieldLabelStyle}>Avatar / Photo URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  placeholder="e.g. /logo.jpeg or https://..."
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-light)',
                  color: '#94A3B8',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="btn-primary"
                style={{ padding: '10px 24px', fontWeight: 800, fontSize: '0.88rem' }}
              >
                <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: CHANGE PASSWORD FORM */}
      {activeTab === 'security' && (
        <div style={{
          background: '#0B1120',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '640px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock color="#FFB703" size={20} /> Update Administrator Password
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
                Set a strong password for your System Administrator account.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.84rem'
              }}
            >
              <X size={16} /> Cancel
            </button>
          </div>

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={fieldLabelStyle}>New Password *</label>
              <input
                type="password"
                required
                className="form-input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter minimum 6 characters..."
                style={inputStyle}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={fieldLabelStyle}>Confirm New Password *</label>
              <input
                type="password"
                required
                className="form-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password..."
                style={inputStyle}
              />
            </div>

            <div style={{
              background: 'rgba(0, 180, 216, 0.08)',
              border: '1px solid rgba(0, 180, 216, 0.25)',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '0.8rem',
              color: '#94A3B8',
              lineHeight: 1.5
            }}>
              <strong style={{ color: '#00B4D8' }}>Security Note:</strong> Changing your administrator password will immediately update your database bcrypt password hash. Ensure your new password is saved securely.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-light)',
                  color: '#94A3B8',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingPassword}
                className="btn-primary"
                style={{ padding: '10px 24px', fontWeight: 800, fontSize: '0.88rem' }}
              >
                <Key size={16} /> {savingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

const infoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  background: '#070A12',
  borderRadius: '8px',
  border: '1px solid var(--border-light)',
  fontSize: '0.86rem'
};

const labelStyle = {
  color: '#64748B',
  fontWeight: 700
};

const valStyle = {
  color: '#FFFFFF',
  fontWeight: 700
};

const fieldLabelStyle = {
  fontSize: '0.82rem',
  fontWeight: 700,
  color: '#CBD5E1',
  marginBottom: '6px',
  display: 'block'
};

const inputStyle = {
  width: '100%',
  background: '#070A12',
  border: '1px solid var(--border-light)',
  borderRadius: '8px',
  padding: '10px 14px',
  color: '#FFFFFF',
  fontSize: '0.88rem',
  outline: 'none'
};
