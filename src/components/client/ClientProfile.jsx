import React, { useState, useEffect } from 'react';
import {
  Building2, Mail, Phone, MapPin, Globe, FileText, Key, Save, CheckCircle2, AlertCircle, RefreshCw, Briefcase, User
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function ClientProfile({ currentUser, onUpdateCurrentUser }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'password'
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Edit form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [tradeLicenseNo, setTradeLicenseNo] = useState('');
  const [tinNo, setTinNo] = useState('');
  const [binNo, setBinNo] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/client/profile');
      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {}
      if (res.ok && data && data.success && data.profile) {
        setProfile(data.profile);
        setFullName(data.profile.full_name || '');
        setPhone(data.profile.phone || '');
        setCompanyName(data.profile.company_name || '');
        setDesignation(data.profile.designation || '');
        setTradeLicenseNo(data.profile.trade_license_no || '');
        setTinNo(data.profile.tin_no || '');
        setBinNo(data.profile.bin_no || '');
        setOfficeAddress(data.profile.office_address || '');
        setWebsiteUrl(data.profile.website_url || '');
      } else {
        setError((data && data.message) || 'Failed to load client profile.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await adminFetch('/api/client/profile', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: fullName,
          phone,
          company_name: companyName,
          designation,
          trade_license_no: tradeLicenseNo,
          tin_no: tinNo,
          bin_no: binNo,
          office_address: officeAddress,
          website_url: websiteUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Company profile updated successfully!');
        if (onUpdateCurrentUser) {
          onUpdateCurrentUser({
            ...currentUser,
            name: fullName,
            phone: phone,
            companyName: companyName
          });
        }
        fetchProfile();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Network error saving profile changes.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setSuccessMsg(null);

    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await adminFetch('/api/client/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Account password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setPasswordError(data.message || 'Failed to change password.');
      }
    } catch (err) {
      setPasswordError('Network error changing password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#FF6B00' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Enterprise Profile...</p>
      </div>
    );
  }

  const p = profile || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* HEADER WITH LOGO */}
      <div style={{
        background: '#0B1120',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #FF6B00 0%, #EA580C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(255, 107, 0, 0.3)'
          }}>
            {(p.company_name || p.full_name || 'C')[0].toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                {p.company_name || 'Corporate Client'}
              </h1>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#FF6B00',
                background: 'rgba(255, 107, 0, 0.15)',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 107, 0, 0.3)'
              }}>
                Client #{p.id || 'CLT'}
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span><User size={13} style={{ display: 'inline', marginRight: '4px' }} />{p.full_name} ({p.designation || 'Representative'})</span>
              <span><Mail size={13} style={{ display: 'inline', marginRight: '4px' }} />{p.email}</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'overview' ? '#FF6B00' : 'transparent',
              color: activeTab === 'overview' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'edit' ? '#FF6B00' : 'transparent',
              color: activeTab === 'edit' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'password' ? '#FF6B00' : 'transparent',
              color: activeTab === 'password' ? '#FFFFFF' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Change Password
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '18px' }}>
            Corporate Entity & Contact Details
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Company Name</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.company_name || 'N/A'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Authorized Representative</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.full_name || 'N/A'} ({p.designation || 'Executive'})</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Corporate Email</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.email || 'N/A'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Direct Phone</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.phone || 'N/A'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Trade License No</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.trade_license_no || 'Not provided'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>TIN / Tax ID</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.tin_no || 'Not provided'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Company Website</div>
              <div style={{ fontSize: '0.92rem', color: '#00B4D8', fontWeight: 700, marginTop: '2px' }}>{p.website_url || 'Not provided'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Head Office Address</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.office_address || 'Not provided'}</div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE TAB */}
      {activeTab === 'edit' && (
        <form onSubmit={handleProfileSubmit} style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '18px' }}>
            Update Company & Representative Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Company / Organization Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Representative Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Designation / Title</label>
              <input
                type="text"
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                placeholder="e.g. Managing Director / CTO"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Contact Phone *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Trade License No</label>
              <input
                type="text"
                value={tradeLicenseNo}
                onChange={e => setTradeLicenseNo(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>TIN No</label>
              <input
                type="text"
                value={tinNo}
                onChange={e => setTinNo(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Company Website</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Office Address</label>
              <textarea
                rows={2}
                value={officeAddress}
                onChange={e => setOfficeAddress(e.target.value)}
                placeholder="Office suite, building, street, city"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem', resize: 'vertical' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#FF6B00',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: savingProfile ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Save size={16} />
            <span>{savingProfile ? 'Saving...' : 'Save Company Profile'}</span>
          </button>
        </form>
      )}

      {/* CHANGE PASSWORD TAB */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px',
          maxWidth: '480px'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="#FF6B00" /> Update Password
          </h2>

          {passwordError && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.82rem', marginBottom: '16px' }}>
              {passwordError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Current Password *</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>New Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#FF6B00',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: savingPassword ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Key size={15} />
            <span>{savingPassword ? 'Changing Password...' : 'Change Password'}</span>
          </button>
        </form>
      )}

    </div>
  );
}
