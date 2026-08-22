import React, { useState } from 'react';
import {
  Settings, Key, ShieldCheck, Bell, Lock, CheckCircle2, AlertCircle, Save
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function StudentSettings({ currentUser }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

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
        setSuccessMsg('Account password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setPasswordError(data.message || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError('Network error saving password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={24} color="#00B4D8" /> Student Account Settings
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
          Manage your account credentials, security preferences, and notification channels.
        </p>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', fontSize: '0.85rem' }}>
          <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> {successMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
        
        {/* SECURITY & PASSWORD */}
        <form onSubmit={handlePasswordSubmit} style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color="#00B4D8" /> Security & Password
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
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.86rem' }}
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
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.86rem' }}
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
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.86rem' }}
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
              fontSize: '0.86rem',
              cursor: savingPassword ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Key size={15} />
            <span>{savingPassword ? 'Updating Password...' : 'Save Password'}</span>
          </button>
        </form>

        {/* NOTIFICATION PREFERENCES */}
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="#10B981" /> Communication Preferences
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#FFFFFF' }}>Email Notifications</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Receive class schedule updates and payment confirmations via email</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#00B4D8' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#FFFFFF' }}>SMS Urgent Alerts</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Receive instant SMS alerts for class reschedules and emergency notices</div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={e => setSmsAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#00B4D8' }}
              />
            </label>
          </div>
        </div>

      </div>

    </div>
  );
}
