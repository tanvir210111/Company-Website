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
    <div style={{ minHeight: '100vh', background: '#050810', color: '#F8FAFC', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* TOP HEADER */}
      <header style={{
        height: '64px',
        background: '#0B1120',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#F8FAFC',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="md:hidden"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div 
            onClick={() => onSelectSubPage('dashboard')} 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)'
            }}>
              <GraduationCap size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                MEDIA SCOPE IT <span style={{ color: '#00B4D8', fontSize: '0.78rem', background: 'rgba(0, 180, 216, 0.12)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0, 180, 216, 0.3)' }}>STUDENT</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                Student Learning & Training Portal
              </div>
            </div>
          </div>
        </div>

        {/* Right Header Elements */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              padding: '6px 12px',
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
            <span>Public Site</span>
          </button>

          {/* Student Profile Chip */}
          <div 
            onClick={() => onSelectSubPage('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 12px',
              background: 'rgba(0, 180, 216, 0.08)',
              border: '1px solid rgba(0, 180, 216, 0.25)',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
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
              fontSize: '0.75rem'
            }}>
              {(currentUser?.name || 'S')[0].toUpperCase()}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#00B4D8' }}>
              {currentUser?.name || 'Student'}
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
              padding: '6px 12px',
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
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN BODY: SIDEBAR + CONTENT */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* SIDEBAR */}
        <aside style={{
          width: '250px',
          background: '#070A12',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 12px',
          flexShrink: 0,
          overflowY: 'auto'
        }}>
          <div style={{ padding: '0 8px 12px 8px', fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Student Navigation
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
                    textAlign: 'left'
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
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#050810' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
