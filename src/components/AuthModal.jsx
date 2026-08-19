import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Phone, LogIn, UserPlus, CheckCircle2, ArrowRight, ShieldCheck, GraduationCap, Briefcase, Building } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, pendingAction, initialRole = 'student' }) {
  const [accountRole, setAccountRole] = useState(initialRole); // 'student' | 'client'
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sign Up Form State (Student / Client)
  const [signUpName, setSignUpName] = useState('');
  const [signUpCompanyName, setSignUpCompanyName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');

  useEffect(() => {
    if (pendingAction?.type === 'course') {
      setAccountRole('student');
    } else if (pendingAction?.type === 'quote') {
      setAccountRole('client');
    } else if (initialRole) {
      setAccountRole(initialRole);
    }
  }, [isOpen, pendingAction, initialRole]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter your email/phone and password.');
      return;
    }
    setLoginError('');

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          loginEmail,
          loginPassword,
          role: accountRole
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem('msit_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('msit_token', data.token);
        onLoginSuccess(data.user);
      } else {
        setLoginError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setLoginError('Unable to connect to authentication server. Please check your internet connection and try again.');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match. Please check again.');
      return;
    }
    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters long.');
      return;
    }

    setSignUpError('');

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: signUpName,
          companyName: accountRole === 'client' ? signUpCompanyName : null,
          email: signUpEmail,
          phone: signUpPhone,
          password: signUpPassword,
          role: accountRole
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem('msit_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('msit_token', data.token);
        onLoginSuccess(data.user);
      } else {
        setSignUpError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setSignUpError('Unable to connect to authentication server. Please check your internet connection and try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Header with Official Website Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: `2px solid ${accountRole === 'student' ? '#00B4D8' : '#FF6B00'}`,
            boxShadow: `0 0 20px ${accountRole === 'student' ? 'rgba(0, 180, 216, 0.35)' : 'rgba(255, 107, 0, 0.35)'}`,
            margin: '0 auto 14px auto',
            background: '#FFFFFF',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <img 
              src="/logo.jpeg" 
              alt="Media Scope IT Ltd Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} 
            />
          </div>

          <h2 style={{ fontSize: '1.55rem', color: '#FFFFFF', fontWeight: 800 }}>
            {accountRole === 'student' ? 'Student Account Access' : 'Corporate Client Access'}
          </h2>
          
          {pendingAction?.type === 'course' && (
            <p style={{ color: '#00B4D8', fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>
              🎓 Student Account required to enroll in "{pendingAction.payload?.title || 'Course'}"
            </p>
          )}

          {pendingAction?.type === 'quote' && (
            <p style={{ color: '#FF6B00', fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>
              💼 Corporate Client Account required for "{pendingAction.payload?.title || 'Service'}" Proposal
            </p>
          )}

          {!pendingAction && (
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>
              Select your account type to login or create a new profile
            </p>
          )}
        </div>

        {/* ACCOUNT ROLE SWITCHER (Student vs Client) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', background: '#070A12', padding: '4px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
          <button
            type="button"
            onClick={() => setAccountRole('student')}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: accountRole === 'student' ? 'rgba(0, 180, 216, 0.2)' : 'transparent',
              color: accountRole === 'student' ? '#00B4D8' : '#94A3B8',
              border: accountRole === 'student' ? '1px solid #00B4D8' : '1px solid transparent',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              textAlign: 'center',
              gap: '6px'
            }}
          >
            <GraduationCap size={16} /> Student Account
          </button>

          <button
            type="button"
            onClick={() => setAccountRole('client')}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: accountRole === 'client' ? 'rgba(255, 107, 0, 0.2)' : 'transparent',
              color: accountRole === 'client' ? '#FF6B00' : '#94A3B8',
              border: accountRole === 'client' ? '1px solid #FF6B00' : '1px solid transparent',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              textAlign: 'center',
              gap: '6px'
            }}
          >
            <Briefcase size={16} /> Corporate Client
          </button>
        </div>

        {/* Tabs Switcher (Login vs Sign Up) */}
        <div style={{ display: 'flex', background: '#0B1120', padding: '4px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'login' ? (accountRole === 'student' ? '#00B4D8' : '#FF6B00') : 'transparent',
              color: activeTab === 'login' ? '#070A12' : '#94A3B8',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              textAlign: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={15} /> Login
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'signup' ? (accountRole === 'student' ? '#00B4D8' : '#FF6B00') : 'transparent',
              color: activeTab === 'signup' ? '#070A12' : '#94A3B8',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              textAlign: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={15} /> Sign Up
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">{accountRole === 'student' ? 'Student Email or Mobile *' : 'Client Work Email or Mobile *'}</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder={accountRole === 'student' ? "student@gmail.com or 017XXXXXXXX" : "corporate@company.com or 017XXXXXXXX"}
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input 
                type="password" 
                required 
                className="form-input" 
                placeholder="••••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
            </div>

            {loginError && (
              <div style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '14px' }}>
                {loginError}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                textAlign: 'center',
                marginTop: '12px',
                background: accountRole === 'client' ? 'linear-gradient(135deg, #FF6B00 0%, #FF8800 100%)' : undefined 
              }}
            >
              <LogIn size={18} /> Login to {accountRole === 'student' ? 'Student' : 'Client'} Portal
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit}>
            <div className="form-group">
              <label className="form-label">{accountRole === 'student' ? 'Student Full Name *' : 'Representative Name *'}</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder={accountRole === 'student' ? "Your full name" : "Your full name"}
                value={signUpName}
                onChange={e => setSignUpName(e.target.value)}
              />
            </div>

            {accountRole === 'client' && (
              <div className="form-group">
                <label className="form-label">Company / Organization Name *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Acme Enterprise Ltd"
                  value={signUpCompanyName}
                  onChange={e => setSignUpCompanyName(e.target.value)}
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input 
                  type="tel" 
                  required 
                  className="form-input" 
                  placeholder="017XXXXXXXX"
                  value={signUpPhone}
                  onChange={e => setSignUpPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{accountRole === 'student' ? 'Email Address *' : 'Work Email *'}</label>
                <input 
                  type="email" 
                  required 
                  className="form-input" 
                  placeholder="name@gmail.com"
                  value={signUpEmail}
                  onChange={e => setSignUpEmail(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input 
                  type="password" 
                  required 
                  className="form-input" 
                  placeholder="Min 6 chars"
                  value={signUpPassword}
                  onChange={e => setSignUpPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input 
                  type="password" 
                  required 
                  className="form-input" 
                  placeholder="Repeat password"
                  value={signUpConfirmPassword}
                  onChange={e => setSignUpConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {signUpError && (
              <div style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '14px' }}>
                {signUpError}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                textAlign: 'center',
                marginTop: '12px',
                background: accountRole === 'client' ? 'linear-gradient(135deg, #FF6B00 0%, #FF8800 100%)' : undefined 
              }}
            >
              <UserPlus size={18} /> Create {accountRole === 'student' ? 'Student' : 'Corporate Client'} Account
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border-light)', fontSize: '0.78rem', color: '#64748B' }}>
          <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          Secured with SSL Encryption • Media Scope IT Enterprise Portal
        </div>
      </div>
    </div>
  );
}
