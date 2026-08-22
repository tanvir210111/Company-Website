import React, { useState } from 'react';
import {
  Building2, LayoutDashboard, User, FolderGit2, PlusCircle, CreditCard,
  MessageSquare, Bell, Settings, LogOut, Menu, X, ExternalLink, ChevronRight, Briefcase
} from 'lucide-react';

export default function ClientLayout({
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
    { id: 'profile', label: 'Company Profile', icon: Building2 },
    { id: 'projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'new-project', label: 'Request New Project', icon: PlusCircle },
    { id: 'payments', label: 'Payments & Invoices', icon: CreditCard },
    { id: 'messages', label: 'Messages & Support', icon: MessageSquare },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="portal-mobile-menu-btn"
            title="Toggle Menu"
            aria-label="Toggle client navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div 
            onClick={() => onSelectSubPage('dashboard')} 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', minWidth: 0 }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF6B00 0%, #EA580C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
              flexShrink: 0
            }}>
              <Briefcase size={18} color="#FFFFFF" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="portal-header-logo-text" style={{ whiteSpace: 'nowrap' }}>MEDIA SCOPE IT</span>
                <span className="portal-header-badge" style={{ color: '#FF6B00', fontSize: '0.72rem', background: 'rgba(255, 107, 0, 0.12)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255, 107, 0, 0.3)', whiteSpace: 'nowrap' }}>CLIENT</span>
              </div>
              <div className="portal-header-subtitle" style={{ fontSize: '0.7rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                Enterprise & Commercial Software Portal
              </div>
            </div>
          </div>
        </div>

        {/* Right Header Elements */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={() => onNavigate('home')}
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
            onMouseOver={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
          >
            <ExternalLink size={14} />
            <span className="portal-header-btn-text">Public Site</span>
          </button>

          {/* Client Profile Chip */}
          <div 
            onClick={() => onSelectSubPage('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              background: 'rgba(255, 107, 0, 0.08)',
              border: '1px solid rgba(255, 107, 0, 0.25)',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#FF6B00',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.75rem',
              flexShrink: 0
            }}>
              {(currentUser?.name || 'C')[0].toUpperCase()}
            </div>
            <span className="portal-header-profile-name" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FF6B00', whiteSpace: 'nowrap', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.name || 'Corporate Client'}
            </span>
          </div>

          <button
            onClick={onLogout}
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
            onMouseOver={(e) => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'; e.currentTarget.style.color = '#EF4444'; }}
          >
            <LogOut size={14} />
            <span className="portal-header-btn-text">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN BODY: SIDEBAR + CONTENT */}
      <div className="portal-body-wrapper">
        
        {/* SIDEBAR */}
        <aside className={`portal-sidebar portal-sidebar-client ${mobileMenuOpen ? 'drawer-open' : ''}`}>
          {/* Mobile Drawer Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Client Portal
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
                    background: isActive ? 'linear-gradient(90deg, rgba(255, 107, 0, 0.18) 0%, rgba(255, 107, 0, 0.04) 100%)' : 'transparent',
                    color: isActive ? '#FF6B00' : '#94A3B8',
                    borderLeft: isActive ? '3px solid #FF6B00' : '3px solid transparent',
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
                    <Icon size={17} style={{ color: isActive ? '#FF6B00' : '#64748B' }} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} style={{ color: '#FF6B00' }} />}
                </button>
              );
            })}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '8px', fontSize: '0.72rem', color: '#64748B' }}>
            Media Scope IT Enterprise v2.0
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
