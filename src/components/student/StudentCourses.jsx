import React, { useState, useEffect } from 'react';
import {
  BookOpen, Clock, Calendar, CheckCircle2, PlayCircle, RefreshCw, AlertCircle, Search, Filter, ChevronRight
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function StudentCourses({ onNavigate }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/student/courses');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
      } else {
        setError(data.message || 'Failed to load courses.');
      }
    } catch (err) {
      setError('Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = courses.filter(c => {
    const matchesStatus = statusFilter === 'all' || (c.enrollment_status || '').toLowerCase() === statusFilter;
    const matchesSearch = !searchQuery.trim() || 
      (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Your Enrolled Courses...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER & CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={24} color="#00B4D8" /> My Enrolled Courses
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Browse active curriculums, batch schedules, class timings, and upcoming lessons.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                width: '180px'
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: '#0B1120',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* COURSES LIST */}
      {filtered.length === 0 ? (
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '48px 20px',
          textAlign: 'center',
          color: '#64748B'
        }}>
          <BookOpen size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
          <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>No Courses Found</h3>
          <p style={{ fontSize: '0.88rem', marginBottom: '16px' }}>
            {searchQuery || statusFilter !== 'all' ? 'No courses match your active filter.' : 'You have not enrolled in any course yet.'}
          </p>
          <button
            onClick={() => onNavigate && onNavigate('courses')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#00B4D8',
              color: '#070A12',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Browse Available Courses
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map(c => (
            <div
              key={c.enrollment_id}
              style={{
                background: '#0B1120',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#00B4D8', fontWeight: 700, background: 'rgba(0, 180, 216, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                    {c.category || 'Professional Training'}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: c.enrollment_status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: c.enrollment_status === 'active' ? '#10B981' : '#F59E0B',
                    border: `1px solid ${c.enrollment_status === 'active' ? '#10B981' : '#F59E0B'}`
                  }}>
                    {c.enrollment_status?.toUpperCase() || 'ENROLLED'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                  {c.title}
                </h3>

                <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginBottom: '14px', lineHeight: 1.5 }}>
                  {c.short_desc || 'Comprehensive professional training curriculum curated by industry experts.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', color: '#64748B', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} color="#00B4D8" />
                    <span>{c.hours || '60 Hours'} ({c.duration || '3 Months'})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="#10B981" />
                    <span>Batch: {c.batch_number || 'Upcoming'}</span>
                  </div>
                </div>

                {c.class_days && (
                  <div style={{ fontSize: '0.76rem', color: '#94A3B8', background: 'rgba(255, 255, 255, 0.02)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    🗓 <strong>Days:</strong> {c.class_days} • <strong>Time:</strong> {c.class_time || 'TBA'}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  ID: #{c.enrollment_no}
                </span>
                <button
                  onClick={() => onNavigate && onNavigate(`courses`)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'rgba(0, 180, 216, 0.12)',
                    border: '1px solid rgba(0, 180, 216, 0.3)',
                    color: '#00B4D8',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <PlayCircle size={13} /> Curriculum Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
