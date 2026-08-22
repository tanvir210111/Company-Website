import React, { useState, useEffect } from 'react';
import {
  GraduationCap, BookOpen, CheckCircle2, Clock, Award, CreditCard,
  FolderGit2, MessageSquare, ArrowUpRight, RefreshCw, AlertCircle, Sparkles,
  ChevronRight, PlayCircle
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function StudentDashboard({ onSelectSubPage, onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/student/dashboard');
      let json = null;
      try {
        json = await res.json();
      } catch (parseErr) {}
      if (res.ok && json && json.success) {
        setData(json);
      } else {
        setError((json && json.message) || 'Failed to load student dashboard.');
      }
    } catch (err) {
      setError('Could not connect to student portal service.');
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
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Student Learning Dashboard...</p>
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
  const enrollments = data?.enrollments || [];
  const recentActivity = data?.recentActivity || [];
  const studentName = data?.studentName || 'Student';

  const statCards = [
    { title: 'Enrolled Courses', value: s.enrolledCourses || 0, icon: BookOpen, color: '#00B4D8', sub: `${s.activeCourses || 0} Currently Active` },
    { title: 'Completed Courses', value: s.completedCourses || 0, icon: CheckCircle2, color: '#10B981', sub: 'Graduated Programs' },
    { title: 'Earned Certificates', value: s.certificates || 0, icon: Award, color: '#8B5CF6', sub: 'Verified Credentials' },
    { title: 'Pending Dues', value: s.pendingPayments || 0, icon: CreditCard, color: s.pendingPayments > 0 ? '#F59E0B' : '#10B981', sub: s.pendingPayments > 0 ? 'Action Required' : 'All Cleared' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* WELCOME HERO BANNER */}
      <div style={{
        padding: '24px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.12) 0%, rgba(11, 17, 32, 0.9) 100%)',
        border: '1px solid rgba(0, 180, 216, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00B4D8', background: 'rgba(0, 180, 216, 0.15)', padding: '2px 8px', borderRadius: '12px' }}>
              Student Control Center
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Welcome back, {studentName}!
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '600px' }}>
            Track your course progress, attend upcoming batches, view payment receipts, and download verified certificates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onSelectSubPage('courses')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#00B4D8',
              color: '#070A12',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PlayCircle size={16} />
            <span>Continue Learning</span>
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
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
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
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
                color: c.color,
                flexShrink: 0
              }}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* TWO COLUMNS: ACTIVE LEARNING & RECENT NOTIFICATIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>
        
        {/* LEARNING PROGRESS SECTION */}
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="#00B4D8" /> My Enrolled Programs
            </h2>
            <button
              onClick={() => onSelectSubPage('courses')}
              style={{ background: 'none', border: 'none', color: '#00B4D8', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {enrollments.length === 0 ? (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: '#64748B' }}>
              <GraduationCap size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>You have not enrolled in any training courses yet.</p>
              <button
                onClick={() => onNavigate('courses')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'rgba(0, 180, 216, 0.15)',
                  border: '1px solid #00B4D8',
                  color: '#00B4D8',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Browse Career Courses
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {enrollments.slice(0, 3).map(enr => (
                <div
                  key={enr.id}
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
                      {enr.course_title}
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: enr.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: enr.status === 'active' ? '#10B981' : '#F59E0B',
                      border: `1px solid ${enr.status === 'active' ? '#10B981' : '#F59E0B'}`
                    }}>
                      {enr.status?.toUpperCase() || 'ENROLLED'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <span>Enrollment: #{enr.enrollment_no}</span>
                    {enr.batch_number && <span>Batch: {enr.batch_number}</span>}
                    {enr.class_mode && <span>Mode: {enr.class_mode}</span>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Payment: <strong style={{ color: enr.payment_status === 'paid' ? '#10B981' : '#F59E0B' }}>{enr.payment_status?.toUpperCase() || 'UNPAID'}</strong>
                    </span>
                    <button
                      onClick={() => onSelectSubPage('courses')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#00B4D8',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Class Schedule →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACTIONS & NOTIFICATIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* QUICK SHORTCUT ACTIONS */}
          <div style={{
            background: '#0B1120',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#F59E0B" /> Quick Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                <span>Make Payment</span>
              </button>

              <button
                onClick={() => onSelectSubPage('certificates')}
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
                <Award size={16} color="#8B5CF6" />
                <span>Certificates</span>
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
                <MessageSquare size={16} color="#EC4899" />
                <span>Contact Instructor</span>
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
                <AlertCircle size={16} color="#00B4D8" />
                <span>Update Profile</span>
              </button>
            </div>
          </div>

          {/* RECENT NOTIFICATIONS FEED */}
          <div style={{
            background: '#0B1120',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px' }}>
              Recent Announcements & Alerts
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
