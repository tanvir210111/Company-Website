import React, { useState } from 'react';
import {
  GraduationCap, LayoutDashboard, User, BookOpen, FileCheck, CreditCard,
  Award, FolderGit2, MessageSquare, Bell, Settings, LogOut, Menu, X,
  ExternalLink, ChevronRight, Sparkles
} from 'lucide-react';

export default function StudentLayout({
  currentUser,
  activeSubPage = 'dashboard',
  onSelectSubPage,
  onLogout,
  onNavigate,
  children
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'enrollments', label: 'My Enrollments', icon: FileCheck },
    { id: 'payments', label: 'Payments & Receipts', icon: CreditCard },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Account Settings', icon: Settings }
  ];

  return (
    <div className="portal-layout-container" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* MOBILE DRAWER BACKDROP */}
      {mobileMenuOpen && (
        <div 
          className="portal-drawer-backdrop" 
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* TOP HEADER */}
      <header className="portal-header">
        <div className="portal-header-left" style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="portal-mobile-menu-btn"
            title="Toggle Menu"
            aria-label="Toggle student navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div 
            onClick={() => onSelectSubPage('dashboard')} 
            className="portal-header-branding"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', minWidth: 0 }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)',
              flexShrink: 0
            }}>
              <GraduationCap size={20} color="#FFFFFF" />
            </div>
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <div className="portal-header-title-row" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
                <span className="portal-header-logo-text" style={{ whiteSpace: 'nowrap' }}>MEDIA SCOPE IT</span>
                <span className="portal-header-badge" style={{ color: '#00B4D8', fontSize: '0.72rem', background: 'rgba(0, 180, 216, 0.12)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0, 180, 216, 0.3)', whiteSpace: 'nowrap' }}>STUDENT</span>
              </div>
              <div className="portal-header-subtitle" style={{ fontSize: '0.7rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                Student Learning & Training Portal
              </div>
            </div>
          </div>
        </div>

        {/* Right Header Elements */}
        <div className="portal-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => onNavigate('home')}
            className="portal-header-public-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Return to Public Website"
          >
            <ExternalLink size={14} />
            <span className="portal-header-btn-text">Public Site</span>
          </button>

          {/* Student Profile Chip */}
          <div 
            onClick={() => onSelectSubPage('profile')}
            className="portal-header-profile-chip"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              background: 'rgba(0, 180, 216, 0.08)',
              border: '1px solid rgba(0, 180, 216, 0.25)',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
            title="My Profile"
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#00B4D8',
              color: '#070A12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.75rem',
              flexShrink: 0
            }}>
              {(currentUser?.name || 'S')[0].toUpperCase()}
            </div>
            <span className="portal-header-profile-name" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#00B4D8', whiteSpace: 'nowrap', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.name || 'Student'}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="portal-header-logout-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Logout"
          >
            <LogOut size={14} />
            <span className="portal-header-btn-text">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN BODY: SIDEBAR + CONTENT */}
      <div className="portal-body-wrapper">
        
        {/* SIDEBAR */}
        <aside className={`portal-sidebar portal-sidebar-student ${mobileMenuOpen ? 'drawer-open' : ''}`}>
          {/* Mobile Drawer Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Student Navigation
            </div>
            <button 
              className="portal-drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
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
                    onSelectSubPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? 'linear-gradient(90deg, rgba(0, 180, 216, 0.18) 0%, rgba(0, 180, 216, 0.04) 100%)' : 'transparent',
                    color: isActive ? '#00B4D8' : '#94A3B8',
                    borderLeft: isActive ? '3px solid #00B4D8' : '3px solid transparent',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#94A3B8';
                    }
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

          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '8px', fontSize: '0.72rem', color: '#64748B' }}>
            Media Scope IT Academy v2.0
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
