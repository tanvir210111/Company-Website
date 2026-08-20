import React from 'react';
import { ArrowLeft, ShieldAlert, Lock, Settings, Briefcase, Eye } from 'lucide-react';
import AdminServices from '../components/admin/AdminServices';
import AdminLoginPage from '../components/admin/AdminLoginPage';

export default function AdminServicesPage({ onNavigate, currentUser, authLoading, onLoginSuccess }) {
  const role = currentUser?.role ? String(currentUser.role).trim().toLowerCase() : '';
  const isAdmin = role === 'admin';

  // 1. Loading State
  if (authLoading) {
    return (
      <div style={{
        minHeight: '80vh',
        background: '#070A12',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '40px 20px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(0, 180, 216, 0.2)',
          borderTopColor: '#00B4D8',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#94A3B8', fontSize: '0.95rem', fontWeight: 600 }}>
          Verifying Administrator Privileges...
        </p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 2. Unauthenticated State -> Dedicated Admin Login
  if (!currentUser) {
    return (
      <AdminLoginPage 
        onLoginSuccess={onLoginSuccess}
        onNavigate={onNavigate}
      />
    );
  }

  // 3. Authenticated Non-Admin User (Student or Client attempting /admin-services)
  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '80vh',
        background: '#070A12',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '520px',
          width: '100%',
          background: '#0B1120',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '40px 30px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: '#F59E0B'
          }}>
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
            Access Denied: Admin Rights Required
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.6 }}>
            Logged in as <strong style={{ color: '#00B4D8' }}>{currentUser.name}</strong> ({role || 'user'}). Your current user account does not have administrator privileges.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => onNavigate('home')}
              className="btn-primary"
              style={{ padding: '10px 20px', fontWeight: 700, borderRadius: '10px' }}
            >
              Return to Homepage
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="btn-secondary"
              style={{ padding: '10px 20px', fontWeight: 700, borderRadius: '10px' }}
            >
              View Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated Admin — Render AdminServices Management Interface
  return (
    <div style={{ background: '#070A12', color: 'white', minHeight: '100vh', padding: '30px 20px 60px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Top Control Bar & Breadcrumbs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onNavigate('home')} 
              className="btn-outline" 
              style={{ fontSize: '0.84rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={14} /> Back to Homepage
            </button>
            <button 
              onClick={() => onNavigate('services')} 
              className="btn-outline" 
              style={{ fontSize: '0.84rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Eye size={14} /> View Public Services
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'rgba(255, 183, 3, 0.15)',
              border: '1px solid #FFB703',
              color: '#FFB703',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Settings size={13} /> Admin Session: {currentUser.name}
            </span>
          </div>
        </div>

        {/* Embedded Admin Services Component */}
        <AdminServices />
      </div>
    </div>
  );
}
