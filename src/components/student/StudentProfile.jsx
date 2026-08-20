import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, BookOpen, ShieldCheck,
  Edit, Save, Key, CheckCircle2, AlertCircle, RefreshCw, GraduationCap
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function StudentProfile({ currentUser, onUpdateCurrentUser }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'password'
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Edit Profile Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nidOrBirthCert, setNidOrBirthCert] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/student/profile');
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setFullName(data.profile.full_name || '');
        setPhone(data.profile.phone || '');
        setFatherName(data.profile.father_name || '');
        setMotherName(data.profile.mother_name || '');
        setAddress(data.profile.address || '');
        setDateOfBirth(data.profile.date_of_birth ? data.profile.date_of_birth.substring(0, 10) : '');
        setNidOrBirthCert(data.profile.nid_or_birth_cert || '');
        setEmergencyPhone(data.profile.emergency_phone || '');
        setEducationLevel(data.profile.education_level || '');
      } else {
        setError(data.message || 'Failed to load profile.');
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
      const res = await adminFetch('/api/student/profile', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: fullName,
          phone,
          father_name: fatherName,
          mother_name: motherName,
          address,
          date_of_birth: dateOfBirth,
          nid_or_birth_cert: nidOrBirthCert,
          emergency_phone: emergencyPhone,
          education_level: educationLevel
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Profile updated successfully!');
        if (onUpdateCurrentUser) {
          onUpdateCurrentUser({
            ...currentUser,
            name: fullName,
            phone: phone
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
      const res = await adminFetch('/api/student/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Password changed successfully!');
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
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Student Profile...</p>
      </div>
    );
  }

  const p = profile || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* HEADER WITH AVATAR */}
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
            background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(0, 180, 216, 0.3)'
          }}>
            {(p.full_name || currentUser?.name || 'S')[0].toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                {p.full_name || currentUser?.name}
              </h1>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#00B4D8',
                background: 'rgba(0, 180, 216, 0.15)',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 180, 216, 0.3)'
              }}>
                Student #{p.id || 'STD'}
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span><Mail size={13} style={{ display: 'inline', marginRight: '4px' }} />{p.email}</span>
              {p.phone && <span><Phone size={13} style={{ display: 'inline', marginRight: '4px' }} />{p.phone}</span>}
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
              background: activeTab === 'overview' ? '#00B4D8' : 'transparent',
              color: activeTab === 'overview' ? '#070A12' : '#94A3B8',
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
              background: activeTab === 'edit' ? '#00B4D8' : 'transparent',
              color: activeTab === 'edit' ? '#070A12' : '#94A3B8',
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
              background: activeTab === 'password' ? '#00B4D8' : 'transparent',
              color: activeTab === 'password' ? '#070A12' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Change Password
          </button>
        </div>
      </div>

      {/* FEEDBACK ALERTS */}
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
            Personal & Academic Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Full Name</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.full_name || 'N/A'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Email Address</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.email || 'N/A'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Phone Number</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.phone || 'N/A'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Education / Institution</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.education_level || 'Not provided'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Date of Birth</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString() : 'Not provided'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Emergency Contact</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.emergency_phone || 'Not provided'}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Present Address</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{p.address || 'Not provided'}</div>
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
            Update Profile Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Phone Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Father's Name</label>
              <input
                type="text"
                value={fatherName}
                onChange={e => setFatherName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Mother's Name</label>
              <input
                type="text"
                value={motherName}
                onChange={e => setMotherName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Education / College</label>
              <input
                type="text"
                value={educationLevel}
                onChange={e => setEducationLevel(e.target.value)}
                placeholder="e.g. B.Sc. in Computer Science"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Emergency Contact Phone</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>NID or Birth Certificate No</label>
              <input
                type="text"
                value={nidOrBirthCert}
                onChange={e => setNidOrBirthCert(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Present Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="House, Road, Area, City"
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
              background: '#00B4D8',
              color: '#070A12',
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
            <span>{savingProfile ? 'Saving Changes...' : 'Save Profile'}</span>
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
            <Key size={18} color="#00B4D8" /> Update Password
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
              background: '#00B4D8',
              color: '#070A12',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: savingPassword ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Key size={16} />
            <span>{savingPassword ? 'Changing Password...' : 'Change Password'}</span>
          </button>
        </form>
      )}

    </div>
  );
}
