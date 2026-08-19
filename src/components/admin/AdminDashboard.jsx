import React, { useState, useEffect } from 'react';
import {
  Users, GraduationCap, Briefcase, BookOpen, FileCheck,
  FolderGit2, CreditCard, MessageSquare, ArrowUpRight, Clock, CheckCircle2,
  RefreshCw, TrendingUp, AlertTriangle, Award, Bell, Plus, History, ShieldCheck, Newspaper
} from 'lucide-react';

export default function AdminDashboard({ onSelectSubPage }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/dashboard`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await res.json();
      if (data.success) {
        setStats(data.data || data);
      } else {
        setError(data.message || 'Failed to load dashboard metrics.');
      }
    } catch (err) {
      setError('Error connecting to admin backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Real-time Control Center Metrics from MySQL Database...</p>
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
          onClick={fetchDashboardData}
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

  const s = stats || {};

  const statCards = [
    { title: 'Verified Revenue', value: `৳${(s.totalVerifiedRevenue || 0).toLocaleString()}`, icon: CreditCard, color: '#10B981', sub: 'Verified PAID Transactions' },
    { title: 'Total Accounts', value: s.totalUsers || 0, icon: Users, color: '#00B4D8', sub: `${s.totalStudents || 0} Students • ${s.totalClients || 0} Clients` },
    { title: 'Active Enrollments', value: s.activeEnrollments || s.totalEnrollments || 0, icon: GraduationCap, color: '#3B82F6', sub: `${s.completedEnrollments || 0} Completed` },
    { title: 'Active Projects', value: s.activeProjects || s.totalProjects || 0, icon: FolderGit2, color: '#F59E0B', sub: `${s.testingProjects || 0} in QA/Testing` },
    { title: 'Issued Certificates', value: s.activeCertificates || s.totalCertificates || 0, icon: Award, color: '#8B5CF6', sub: `${s.revokedCertificates || 0} Revoked` },
    { title: 'Unread Messages', value: s.unreadMessages || 0, icon: MessageSquare, color: '#EC4899', sub: `${s.unreadNotifications || 0} Unread Alerts` }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* TITLE & QUICK REFRESH */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Executive Control Center
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Real-time business performance analytics, financial metrics, and operational feeds.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#0B1120',
            border: '1px solid var(--border-light)',
            color: '#00B4D8',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={15} /> Refresh Metrics
        </button>
      </div>

      {/* ATTENTION REQUIRED ALERTS */}
      {s.attentionAlerts && s.attentionAlerts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {s.attentionAlerts.map(alert => (
            <div
              key={alert.id}
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <AlertTriangle color="#F59E0B" size={22} style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F59E0B', margin: 0 }}>{alert.title}</h4>
                <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '2px 0 0 0' }}>{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOP STAT CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              style={{
                background: '#0B1120',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8' }}>{card.title}</span>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `${card.color}15`,
                  border: `1px solid ${card.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color
                }}>
                  <Icon size={18} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600 }}>
                  {card.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK ACTIONS BAR */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px' }}>
        <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
          Management Quick Actions
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button onClick={() => onSelectSubPage && onSelectSubPage('students')} style={quickBtnStyle}>
            <Plus size={14} /> Add Student
          </button>
          <button onClick={() => onSelectSubPage && onSelectSubPage('clients')} style={quickBtnStyle}>
            <Plus size={14} /> Add Client
          </button>
          <button onClick={() => onSelectSubPage && onSelectSubPage('courses')} style={quickBtnStyle}>
            <Plus size={14} /> Add Course
          </button>
          <button onClick={() => onSelectSubPage && onSelectSubPage('enrollments')} style={quickBtnStyle}>
            <Plus size={14} /> Add Enrollment
          </button>
          <button onClick={() => onSelectSubPage && onSelectSubPage('projects')} style={quickBtnStyle}>
            <Plus size={14} /> Add Software Project
          </button>
          <button onClick={() => onSelectSubPage && onSelectSubPage('certificates')} style={quickBtnStyle}>
            <Award size={14} /> Issue Certificate
          </button>
          <button onClick={() => onSelectSubPage && onSelectSubPage('blog')} style={quickBtnStyle}>
            <Newspaper size={14} /> Create Blog Post
          </button>
          <button onClick={() => onSelectSubPage && onSelectSubPage('messages')} style={quickBtnStyle}>
            <MessageSquare size={14} /> Send Message
          </button>
        </div>
      </div>

      {/* FINANCIAL OVERVIEW & DISTRIBUTION BREAKDOWN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* FINANCIAL SUMMARY CARD */}
        <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard color="#10B981" size={20} /> Financial Summary
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div style={{ background: '#070A12', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>Total Verified Revenue</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                ৳{(s.totalVerifiedRevenue || 0).toLocaleString()}
              </div>
            </div>

            <div style={{ background: '#070A12', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>Pending Payments</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B', marginTop: '2px' }}>
                {s.pendingPaymentsCount || 0}
              </div>
            </div>

            <div style={{ background: '#070A12', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>Enrollment Due</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#EF4444', marginTop: '2px' }}>
                ৳{(s.outstandingEnrollmentDue || 0).toLocaleString()}
              </div>
            </div>

            <div style={{ background: '#070A12', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>Project Due</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#EF4444', marginTop: '2px' }}>
                ৳{(s.outstandingProjectDue || 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* MONTHLY REVENUE VISUAL BREAKDOWN */}
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '8px' }}>
            Monthly Revenue Breakdown
          </div>
          {s.monthlyRevenue && s.monthlyRevenue.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {s.monthlyRevenue.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#64748B' }}>{item.month}</span>
                  <span style={{ color: '#10B981', fontWeight: 700 }}>৳{parseFloat(item.total).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: '#64748B', padding: '12px 0' }}>
              No monthly revenue records in history yet.
            </div>
          )}
        </div>

        {/* ENROLLMENT & PROJECT STATUS BREAKDOWN */}
        <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp color="#00B4D8" size={20} /> Operational Status Breakdown
          </h3>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '8px' }}>Course Enrollment Statuses</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div style={statusBoxStyle}>
                <div style={{ color: '#10B981', fontWeight: 800, fontSize: '1.1rem' }}>{s.enrollmentStatusCounts?.active || 0}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Active</div>
              </div>
              <div style={statusBoxStyle}>
                <div style={{ color: '#3B82F6', fontWeight: 800, fontSize: '1.1rem' }}>{s.enrollmentStatusCounts?.completed || 0}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Completed</div>
              </div>
              <div style={statusBoxStyle}>
                <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: '1.1rem' }}>{s.enrollmentStatusCounts?.pending || 0}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Pending</div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '8px' }}>Software Project Statuses</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div style={statusBoxStyle}>
                <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: '1.1rem' }}>{s.projectStatusCounts?.in_development || 0}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Development</div>
              </div>
              <div style={statusBoxStyle}>
                <div style={{ color: '#3B82F6', fontWeight: 800, fontSize: '1.1rem' }}>{s.projectStatusCounts?.testing || 0}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>QA / Testing</div>
              </div>
              <div style={statusBoxStyle}>
                <div style={{ color: '#10B981', fontWeight: 800, fontSize: '1.1rem' }}>{s.projectStatusCounts?.delivered || 0}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Delivered</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY LOG FEED */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <History color="#00B4D8" size={20} /> Latest System Activity Audit Feed
          </h3>
          <button
            onClick={() => onSelectSubPage && onSelectSubPage('activity-logs')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#00B4D8',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View All Audit Logs <ArrowUpRight size={14} />
          </button>
        </div>

        {s.recentActivity && s.recentActivity.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {s.recentActivity.slice(0, 8).map(act => (
              <div
                key={act.id}
                style={{
                  background: '#070A12',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {act.description}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    By <strong style={{ color: '#CBD5E1' }}>{act.actor_name || 'Admin'}</strong> • Action: <span style={{ color: '#00B4D8' }}>{act.action}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                  {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748B', fontSize: '0.85rem' }}>
            No recent activity logs recorded yet.
          </div>
        )}
      </div>

    </div>
  );
}

const quickBtnStyle = {
  background: '#070A12',
  border: '1px solid var(--border-light)',
  color: '#FFFFFF',
  borderRadius: '8px',
  padding: '8px 14px',
  fontSize: '0.82rem',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px'
};

const statusBoxStyle = {
  background: '#070A12',
  border: '1px solid var(--border-light)',
  borderRadius: '8px',
  padding: '10px',
  textAlign: 'center'
};
