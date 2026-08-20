import React, { useState, useEffect } from 'react';
import {
  FolderGit2, Clock, CheckCircle2, RefreshCw, AlertCircle, PlusCircle, Calendar, DollarSign, ChevronRight, Eye, X
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function ClientProjects({ onSelectSubPage }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Details Modal
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/client/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      } else {
        setError(data.message || 'Failed to load software projects.');
      }
    } catch (err) {
      setError('Could not connect to project records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openProjectDetails = async (prj) => {
    setSelectedProject(prj);
    setLoadingDetails(true);
    try {
      const res = await adminFetch(`/api/client/projects/${prj.id}`);
      const data = await res.json();
      if (data.success) {
        setProjectDetails(data);
      }
    } catch (err) {
      console.log('Error loading project details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#FF6B00' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Enterprise Software Projects...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderGit2 size={24} color="#FF6B00" /> Commercial Software Projects
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Active development deliverables, QA testing milestones, delivery timelines, and payment progress.
          </p>
        </div>

        <button
          onClick={() => onSelectSubPage('new-project')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: '#FF6B00',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <PlusCircle size={15} /> Request New Project
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
          <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>No Active Projects</h3>
          <p style={{ fontSize: '0.88rem', marginBottom: '16px' }}>You do not have any software development projects currently registered.</p>
          <button
            onClick={() => onSelectSubPage('new-project')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#FF6B00',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Submit Project Quotation
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {projects.map(prj => (
            <div
              key={prj.id}
              style={{
                background: '#0B1120',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#FF6B00', fontWeight: 700, background: 'rgba(255, 107, 0, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                    {prj.service_category || 'Enterprise Software'}
                  </span>
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

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                  {prj.project_title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '14px' }}>
                  Code: <strong>#{prj.project_code || prj.id}</strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '12px' }}>
                  <div>Contract: <strong style={{ color: '#FFFFFF' }}>৳{parseFloat(prj.contract_amount || 0).toLocaleString()}</strong></div>
                  <div>Paid: <strong style={{ color: '#10B981' }}>৳{parseFloat(prj.paid_amount || 0).toLocaleString()}</strong></div>
                  <div>Due: <strong style={{ color: parseFloat(prj.due_amount) > 0 ? '#EF4444' : '#10B981' }}>৳{parseFloat(prj.due_amount || 0).toLocaleString()}</strong></div>
                  <div>Delivery: <strong style={{ color: '#00B4D8' }}>{prj.estimated_delivery_date ? new Date(prj.estimated_delivery_date).toLocaleDateString() : 'TBA'}</strong></div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  Installments: {prj.paid_installments_count || 0} Paid
                </span>
                <button
                  onClick={() => openProjectDetails(prj)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255, 107, 0, 0.12)',
                    border: '1px solid rgba(255, 107, 0, 0.3)',
                    color: '#FF6B00',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye size={13} /> View Timeline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#0B1120',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                {selectedProject.project_title}
              </h2>
              <button
                onClick={() => setSelectedProject(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', fontSize: '0.84rem' }}>
              <div>Category: <strong style={{ color: '#FFFFFF' }}>{selectedProject.service_category}</strong></div>
              <div>Status: <strong style={{ color: '#FF6B00' }}>{selectedProject.status}</strong></div>
              <div>Contract Amount: <strong style={{ color: '#FFFFFF' }}>৳{parseFloat(selectedProject.contract_amount || 0).toLocaleString()}</strong></div>
              <div>Due Balance: <strong style={{ color: parseFloat(selectedProject.due_amount) > 0 ? '#EF4444' : '#10B981' }}>৳{parseFloat(selectedProject.due_amount || 0).toLocaleString()}</strong></div>
            </div>

            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Status History & Engineering Milestones
            </h3>

            {loadingDetails ? (
              <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Loading milestone updates...</p>
            ) : projectDetails?.history && projectDetails.history.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {projectDetails.history.map(h => (
                  <div key={h.id} style={{ padding: '10px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: '#FF6B00' }}>{h.status}</div>
                    <div style={{ color: '#94A3B8' }}>{h.remarks}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>{new Date(h.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748B', fontSize: '0.85rem' }}>No status milestone logs recorded yet.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
