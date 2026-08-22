import React, { useState, useEffect } from 'react';
import {
  FolderGit2, Clock, CheckCircle2, RefreshCw, AlertCircle, Calendar, ExternalLink
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function StudentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/student/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      } else {
        setError(data.message || 'Failed to load projects.');
      }
    } catch (err) {
      setError('Could not connect to project repository.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Practical Projects & Assignments...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderGit2 size={24} color="#F59E0B" /> My Course Projects & Assignments
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Practical projects, code submissions, live testing, and capstone evaluations.
          </p>
        </div>

        <button
          onClick={fetchProjects}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '48px 20px',
          textAlign: 'center',
          color: '#64748B'
        }}>
          <FolderGit2 size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
          <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>No Assigned Practical Projects</h3>
          <p style={{ fontSize: '0.88rem' }}>Course capstone projects and assignments will be assigned by your instructor during mid-term classes.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
          {projects.map(prj => (
            <div
              key={prj.id}
              style={{
                background: '#0B1120',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#F59E0B', fontWeight: 700, background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                    {prj.service_category || 'Academic Project'}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: prj.status === 'delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: prj.status === 'delivered' ? '#10B981' : '#F59E0B',
                    border: `1px solid ${prj.status === 'delivered' ? '#10B981' : '#F59E0B'}`
                  }}>
                    {prj.status?.toUpperCase() || 'IN PROGRESS'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                  {prj.project_title}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  Project Code: #{prj.project_code || prj.id}
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Calendar size={13} />
                <span>Deadline: {prj.estimated_delivery_date ? new Date(prj.estimated_delivery_date).toLocaleDateString() : 'Flexible'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
