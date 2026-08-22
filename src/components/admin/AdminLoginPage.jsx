import React, { useState } from 'react';
import { Lock, Mail, Key, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { getBackendUrl } from '../../utils/adminApi';

export default function AdminLoginPage({ onLoginSuccess, onNavigate }) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please enter your administrator email or username and password.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          loginEmail: loginEmail.trim(),
          loginPassword,
          role: 'admin'
        })
      });

      const data = await res.json();

      if (data.success && data.user) {
        const normalizedRole = typeof data.user.role === 'string' 
          ? data.user.role.trim().toLowerCase() 
          : '';

        // Strict Backend-Authoritative Verification: Reject Student / Client accounts
        if (normalizedRole !== 'admin') {
          // Immediately purge cookie/session if a non-admin account logged in
          try {
            await fetch(`${backendUrl}/api/auth/logout`, {
              method: 'POST',
              credentials: 'include'
            });
          } catch (logoutErr) {
            console.error('Logout cleanup notice:', logoutErr);
          }

          localStorage.removeItem('msit_user');
          localStorage.removeItem('msit_token');
          setErrorMessage('Administrator access required. This account does not possess administrator privileges.');
          setLoading(false);
          return;
        }

        const normalizedUser = {
          ...data.user,
          role: 'admin'
        };

        localStorage.setItem('msit_user', JSON.stringify(normalizedUser));
        if (data.token) {
          localStorage.setItem('msit_token', data.token);
        }

        if (onLoginSuccess) {
          onLoginSuccess(normalizedUser);
        }
      } else {
        setErrorMessage(data.message || 'Invalid administrator credentials. Please check your email and password.');
      }
    } catch (err) {
      console.error('Admin Login Network Error:', err);
      setErrorMessage('Unable to connect to authentication server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWebsite = () => {
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      background: 'radial-gradient(ellipse at top, #0d1b2a 0%, #070a12 70%, #030712 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: '#FFFFFF',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#0B1120',
        borderRadius: '20px',
        border: '1px solid rgba(0, 180, 216, 0.25)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 180, 216, 0.12)',
        padding: '36px 28px',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        {/* Top Security Pill Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 180, 216, 0.12)',
            border: '1px solid rgba(0, 180, 216, 0.4)',
            color: '#00B4D8',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}>
            <ShieldCheck size={14} /> 256-BIT SSL ENCRYPTED ADMIN GATEWAY
          </div>
        </div>

        {/* Brand Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#FFFFFF',
            border: '2px solid #00B4D8',
            boxShadow: '0 0 25px rgba(0, 180, 216, 0.35)',
            margin: '0 auto 16px auto',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/logo.jpeg" 
              alt="Media Scope IT Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' }} 
            />
          </div>

          <h1 style={{
            fontSize: '1.55rem',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '4px',
            letterSpacing: '-0.02em'
          }}>
            Media Scope IT Ltd
          </h1>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#00B4D8',
            margin: '0 0 6px 0'
          }}>
            Administrator Portal
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.84rem', margin: 0 }}>
            Enter administrator credentials to manage system
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            color: '#FCA5A5',
            fontSize: '0.84rem',
            lineHeight: 1.4
          }}>
            <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dedicated Admin Login Form */}
        <form onSubmit={handleAdminLogin}>
          {/* Admin Email / Username */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#CBD5E1',
              marginBottom: '6px'
            }}>
              Admin Email / Username
            </label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={17} 
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748B'
                }} 
              />
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@mediascopeit.com"
                required
                disabled={loading}
                autoFocus
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#070A12',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '12px 14px 12px 42px',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00B4D8'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
              />
            </div>
          </div>

          {/* Admin Password */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#CBD5E1',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Key 
                size={17} 
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748B'
                }} 
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={loading}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#070A12',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '12px 42px 12px 42px',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00B4D8'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '13px 20px',
              color: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(0, 180, 216, 0.4)',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.75 : 1
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={17} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Lock size={17} />
                Login as Administrator
              </>
            )}
          </button>
        </form>

        {/* Small Security Text */}
        <div style={{
          marginTop: '22px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '0.76rem',
            color: '#94A3B8',
            fontWeight: 600,
            margin: '0 0 14px 0'
          }}>
            🔒 Authorized administrators only. All access attempts are monitored and recorded.
          </p>

          <button
            type="button"
            onClick={handleBackToWebsite}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#94A3B8',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            <ArrowLeft size={14} /> Return to Website
          </button>
        </div>
      </div>
    </div>
  );
}
