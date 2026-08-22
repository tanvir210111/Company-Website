import React, { useState } from 'react';
import {
  LayoutDashboard, Users, GraduationCap, Briefcase, BookOpen, FileCheck,
  FolderGit2, CreditCard, MessageSquare, FileText, Newspaper, UserCheck,
  Quote, HelpCircle, Image, Settings, LogOut, Menu, X, ShieldAlert,
  Search, Bell, ChevronRight, Lock, Megaphone, Award, ShieldCheck, History, Globe
} from 'lucide-react';
import AdminLoginPage from './AdminLoginPage';

export default function AdminLayout({
  currentUser,
  authLoading,
  onLogout,
  onLoginSuccess,
  onNavigate,
  activeSubPage = 'dashboard',
  onSelectSubPage,
  children
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 1. Loading State
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#070A12',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
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

  // 2. Unauthenticated State -> Render Dedicated Admin Login Page
  if (!currentUser) {
    return (
      <AdminLoginPage
        onLoginSuccess={onLoginSuccess}
        onNavigate={onNavigate}
      />
    );
  }

  // 3. Authenticated Non-Admin User (Student or Client attempting /admin)
  const userRole = currentUser?.role ? String(currentUser.role).trim().toLowerCase() : '';
  if (userRole !== 'admin') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#070A12',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          color: '#F59E0B'
        }}>
          <ShieldAlert size={36} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          Access Denied: Admin Rights Required
        </h2>
        <p style={{ color: '#94A3B8', maxWidth: '480px', marginBottom: '24px', lineHeight: 1.6 }}>
          Logged in as <strong style={{ color: '#00B4D8' }}>{currentUser.name}</strong> ({userRole || 'user'}). Your current user role does not have administrator privileges to access the backend portal.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => onNavigate('home')}
            className="btn-primary"
            style={{ padding: '12px 24px', fontWeight: 700, borderRadius: '10px' }}
          >
            Return to Homepage
          </button>
          <button
            onClick={onLogout}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Switch Account (Logout)
          </button>
        </div>
      </div>
    );
  }

  // Sidebar navigation structure
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: ShieldCheck },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'clients', label: 'Clients', icon: Briefcase },
    { id: 'admins', label: 'Admins', icon: ShieldCheck },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'enrollments', label: 'Enrollments', icon: FileCheck },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'projects', label: 'Software Projects', icon: FolderGit2 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'pages', label: 'Pages (CMS)', icon: FileText },
    { id: 'blog', label: 'Blog Posts', icon: Newspaper },
    { id: 'team', label: 'Team Members', icon: UserCheck },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'activity-logs', label: 'Activity Audit Log', icon: History },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="portal-layout-container">
      
      {/* MOBILE DRAWER BACKDROP */}
      {mobileSidebarOpen && (
        <div 
          className="portal-drawer-backdrop" 
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* TOP HEADER */}
      <header className="portal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="portal-mobile-menu-btn"
            title="Toggle Admin Menu"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo & Portal Title */}
          <div 
            onClick={() => onSelectSubPage ? onSelectSubPage('dashboard') : onNavigate('admin')} 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', minWidth: 0 }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#FFFFFF',
              padding: '2px',
              border: '1px solid #00B4D8',
              flexShrink: 0
            }}>
              <img src="/logo.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <span className="portal-header-logo-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                Media Scope IT
              </span>
              <span className="portal-header-badge" style={{ fontSize: '0.72rem', background: '#00B4D8', color: '#070A12', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', whiteSpace: 'nowrap' }}>
                ADMIN
              </span>
            </div>
          </div>
        </div>

        {/* Header Search & Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div className="portal-header-search" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search records..."
              style={{
                background: '#070A12',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '6px 12px 6px 36px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none',
                width: '180px'
              }}
            />
          </div>

          <button
            onClick={() => onNavigate('home')}
            title="Open Public Website"
            style={{
              background: 'rgba(0, 180, 216, 0.1)',
              border: '1px solid rgba(0, 180, 216, 0.3)',
              color: '#00B4D8',
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <Globe size={15} />
            <span className="portal-header-btn-text">Website</span>
          </button>

          <div 
            onClick={() => onSelectSubPage && onSelectSubPage('profile')}
            title="Open Admin Profile"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: activeSubPage === 'profile' ? 'rgba(0, 180, 216, 0.2)' : '#070A12', 
              padding: '4px 8px', 
              borderRadius: '10px', 
              border: activeSubPage === 'profile' ? '1px solid #00B4D8' : '1px solid var(--border-light)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: '0.82rem',
              flexShrink: 0
            }}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="portal-header-profile-name" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#00B4D8', fontWeight: 600 }}>
                System Admin
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Logout of Admin Panel"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <LogOut size={15} />
            <span className="portal-header-btn-text">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER (Sidebar + Content) */}
      <div className="portal-body-wrapper">
        
        {/* SIDEBAR */}
        <aside className={`portal-sidebar ${mobileSidebarOpen ? 'drawer-open' : ''}`}>
          {/* Mobile Drawer Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em' }}>
              MANAGEMENT MODULES
            </div>
            <button 
              className="portal-drawer-close-btn"
              onClick={() => setMobileSidebarOpen(false)}
              title="Close Drawer"
            >
              <X size={16} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSubPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    onSelectSubPage(item.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? 'linear-gradient(90deg, rgba(0, 180, 216, 0.18) 0%, rgba(0, 180, 216, 0.05) 100%)' : 'transparent',
                    color: isActive ? '#00B4D8' : '#94A3B8',
                    borderLeft: isActive ? '3px solid #00B4D8' : '3px solid transparent',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={17} style={{ color: isActive ? '#00B4D8' : '#64748B' }} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} style={{ color: '#00B4D8' }} />}
                </button>
              );
            })}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-light)', paddingLeft: '8px', fontSize: '0.75rem', color: '#64748B' }}>
            Media Scope IT Portal v1.0
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="portal-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
