import React, { useState, useEffect } from 'react';
import {
  Briefcase, FolderGit2, CheckCircle2, Clock, CreditCard, MessageSquare,
  PlusCircle, ArrowUpRight, RefreshCw, AlertCircle, Sparkles, ChevronRight
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function ClientDashboard({ onSelectSubPage, onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/client/dashboard');
      let json = null;
      try {
        json = await res.json();
      } catch (parseErr) {}
      if (res.ok && json && json.success) {
        setData(json);
      } else {
        setError((json && json.message) || 'Failed to load client dashboard.');
      }
    } catch (err) {
      setError('Could not connect to enterprise client portal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#FF6B00' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Enterprise Client Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '24px',
        borderRadius: '12px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#EF4444'
      }}>
        <h3 style={{ fontWeight: 700, marginBottom: '6px' }}>Dashboard Error</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '14px' }}>{error}</p>
        <button
          onClick={fetchDashboard}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            background: '#EF4444',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const s = data?.stats || {};
  const projects = data?.projects || [];
  const recentActivity = data?.recentActivity || [];
  const clientName = data?.clientName || 'Corporate Client';

  const statCards = [
    { title: 'Total Projects', value: s.totalProjects || 0, icon: FolderGit2, color: '#FF6B00', sub: `${s.activeProjects || 0} In Active Development` },
    { title: 'Delivered Solutions', value: s.completedProjects || 0, icon: CheckCircle2, color: '#10B981', sub: 'Successfully Deployed' },
    { title: 'Pending Quotes', value: s.pendingRequests || 0, icon: PlusCircle, color: '#00B4D8', sub: 'SRS & Estimation' },
    { title: 'Payment Invoices', value: s.pendingPayments || 0, icon: CreditCard, color: s.pendingPayments > 0 ? '#F59E0B' : '#10B981', sub: s.pendingPayments > 0 ? 'Pending Settlement' : 'Accounts Settled' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* WELCOME BANNER */}
      <div style={{
        padding: '24px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.12) 0%, rgba(11, 17, 32, 0.9) 100%)',
        border: '1px solid rgba(255, 107, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF6B00', background: 'rgba(255, 107, 0, 0.15)', padding: '2px 8px', borderRadius: '12px' }}>
              Enterprise Project Center
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Welcome back, {clientName}!
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '600px' }}>
            Monitor real-time development milestones, request new software solutions, and communicate directly with project engineers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onSelectSubPage('new-project')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#FF6B00',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PlusCircle size={16} />
            <span>Request New Project</span>
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              style={{
                background: '#0B1120',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8', marginBottom: '8px' }}>
                  {c.title}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1, marginBottom: '6px' }}>
                  {c.value}
                </div>
                <div style={{ fontSize: '0.74rem', color: c.color, fontWeight: 600 }}>
                  {c.sub}
                </div>
              </div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: `${c.color}15`,
                border: `1px solid ${c.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: c.color
              }}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* TWO COLUMNS: ACTIVE PROJECTS & RECENT ACTIVITY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        
        {/* PROJECTS OVERVIEW */}
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderGit2 size={18} color="#FF6B00" /> Active Software Projects
            </h2>
            <button
              onClick={() => onSelectSubPage('projects')}
              style={{ background: 'none', border: 'none', color: '#FF6B00', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {projects.length === 0 ? (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: '#64748B' }}>
              <Briefcase size={36} style={{ margin: '0 auto 10px auto', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>You have no active software projects currently running.</p>
              <button
                onClick={() => onSelectSubPage('new-project')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'rgba(255, 107, 0, 0.15)',
                  border: '1px solid #FF6B00',
                  color: '#FF6B00',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Submit Project Quotation
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.slice(0, 3).map(prj => (
                <div
                  key={prj.id}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>
                      {prj.project_title}
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: prj.status === 'delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 107, 0, 0.15)',
                      color: prj.status === 'delivered' ? '#10B981' : '#FF6B00',
                      border: `1px solid ${prj.status === 'delivered' ? '#10B981' : '#FF6B00'}`
                    }}>
                      {prj.status?.replace('_', ' ').toUpperCase() || 'PLANNING'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <span>Code: #{prj.project_code || prj.id}</span>
                    <span>Category: {prj.service_category}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Contract: ৳{parseFloat(prj.contract_amount || 0).toLocaleString()} • Due: <strong style={{ color: parseFloat(prj.due_amount) > 0 ? '#EF4444' : '#10B981' }}>৳{parseFloat(prj.due_amount || 0).toLocaleString()}</strong>
                    </span>
                    <button
                      onClick={() => onSelectSubPage('projects')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FF6B00',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Project Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK SHORTCUTS & NOTIFICATIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{
            background: '#0B1120',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#FF6B00" /> Quick Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => onSelectSubPage('new-project')}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left'
                }}
              >
                <PlusCircle size={16} color="#FF6B00" />
                <span>Request Project</span>
              </button>

              <button
                onClick={() => onSelectSubPage('payments')}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left'
                }}
              >
                <CreditCard size={16} color="#10B981" />
                <span>Invoices & Dues</span>
              </button>

              <button
                onClick={() => onSelectSubPage('messages')}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left'
                }}
              >
                <MessageSquare size={16} color="#00B4D8" />
                <span>Message PM</span>
              </button>

              <button
                onClick={() => onSelectSubPage('profile')}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left'
                }}
              >
                <Briefcase size={16} color="#8B5CF6" />
                <span>Company Info</span>
              </button>
            </div>
          </div>

          <div style={{
            background: '#0B1120',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px' }}>
              Project Milestones & Updates
            </h2>
            {recentActivity.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.85rem' }}>No recent notifications.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentActivity.map(notif => (
                  <div
                    key={notif.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '2px' }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                      {notif.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
