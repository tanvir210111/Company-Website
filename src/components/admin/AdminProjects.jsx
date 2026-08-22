import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Search, Filter, RefreshCw, Edit, Trash2, CheckCircle2, ChevronLeft, ChevronRight, AlertCircle, Eye
} from 'lucide-react';
import ProjectEditorModal from './ProjectEditorModal';
import ProjectDetailsModal from './ProjectDetailsModal';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [clientOptions, setClientOptions] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Modals
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectPayments, setProjectPayments] = useState([]);

  const fetchClients = async () => {
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/project-options/clients`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setClientOptions(data.clients || []);
    } catch (err) {
      console.log('Error fetching clients:', err);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 10);
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (clientFilter !== 'all') queryParams.append('client_id', clientFilter);

      const res = await fetch(`${backendUrl}/api/admin/projects?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to retrieve software projects.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [page, statusFilter, clientFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const handleViewDetails = async (prj) => {
    setSelectedProject(prj);
    setDetailsModalOpen(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/projects/${prj.id}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setProjectPayments(data.payments || []);
      }
    } catch (err) {
      console.log('Error fetching project payments:', err);
    }
  };

  const handleDeleteOrCancel = async (item) => {
    const hasPaid = parseFloat(item.paid_amount) > 0;
    const confirmMessage = hasPaid
      ? `Project "${item.project_title}" has paid milestone funds (৳${item.paid_amount}). It cannot be hard-deleted to preserve accounting. Change status to CANCELLED?`
      : `Are you sure you want to delete software project "${item.project_title}"?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/projects/${item.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Software project updated.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchProjects();
      } else {
        alert(data.message || 'Action failed.');
      }
    } catch (err) {
      alert('Network error modifying software project.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TITLE & HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 color="#00B4D8" size={28} /> Commercial Software Projects
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Track client enterprise software contracts, SRS planning, milestone payments, and delivery timelines.
          </p>
        </div>

        <button
          onClick={() => { setEditingProject(null); setEditorModalOpen(true); }}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}
        >
          <Plus size={16} /> New Software Project
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {actionSuccess && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10B981',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} /> {actionSuccess}
        </div>
      )}

      {/* FILTERS & SEARCH */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search by project title, code, client name, email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#070A12',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            style={{
              background: '#070A12',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#94A3B8',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            <option value="all">All Project Statuses</option>
            <option value="srs_planning">SRS Planning</option>
            <option value="in_development">In Development</option>
            <option value="testing">QA & Testing</option>
            <option value="delivered">Delivered</option>
            <option value="inquiry">Initial Inquiry</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={clientFilter}
            onChange={e => { setClientFilter(e.target.value); setPage(1); }}
            style={{
              background: '#070A12',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#94A3B8',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none',
              maxWidth: '220px'
            }}
          >
            <option value="all">All Corporate Clients</option>
            {clientOptions.map(c => (
              <option key={c.id} value={c.id}>{c.full_name} ({c.company_name || 'Individual'})</option>
            ))}
          </select>

          <button
            type="submit"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#00B4D8',
              color: '#070A12',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="table-responsive-wrapper" style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
            <p>Loading Software Projects...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
            <Building2 size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No software project records found.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem', minWidth: '750px' }}>
            <thead>
              <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 16px' }}>Project Code</th>
                <th style={{ padding: '14px 16px' }}>Project Title</th>
                <th style={{ padding: '14px 16px' }}>Corporate Client</th>
                <th style={{ padding: '14px 16px' }}>Contract Amount</th>
                <th style={{ padding: '14px 16px' }}>Paid / Due</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => {
                const dueAmt = (parseFloat(p.contract_amount) || 0) - (parseFloat(p.paid_amount) || 0);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 16px', color: '#00B4D8', fontWeight: 800 }}>
                      {p.project_code}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 700, maxWidth: '240px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.project_title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 400 }}>{p.service_category}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#CBD5E1' }}>
                      <div>{p.client_name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#00B4D8', fontWeight: 600 }}>{p.company_name || 'Individual Client'}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 700 }}>
                      ৳{parseFloat(p.contract_amount).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: '#10B981', fontWeight: 700 }}>Paid: ৳{parseFloat(p.paid_amount).toLocaleString()}</div>
                      <div style={{ fontSize: '0.76rem', color: dueAmt > 0 ? '#EF4444' : '#64748B', fontWeight: 600 }}>
                        Due: ৳{dueAmt.toLocaleString()}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: p.status === 'delivered' ? 'rgba(16, 185, 129, 0.15)' : p.status === 'in_development' ? 'rgba(0, 180, 216, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: p.status === 'delivered' ? '#10B981' : p.status === 'in_development' ? '#00B4D8' : '#EF4444',
                        border: '1px solid var(--border-light)'
                      }}>
                        {p.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleViewDetails(p)}
                          style={{
                            background: 'rgba(0, 180, 216, 0.15)',
                            color: '#00B4D8',
                            border: '1px solid rgba(0, 180, 216, 0.3)',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={14} /> Details
                        </button>

                        <button
                          onClick={() => { setEditingProject(p); setEditorModalOpen(true); }}
                          style={{
                            background: '#0F172A',
                            color: '#00B4D8',
                            border: '1px solid var(--border-light)',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit size={14} /> Edit
                        </button>

                        <button
                          onClick={() => handleDeleteOrCancel(p)}
                          style={{
                            background: 'transparent',
                            color: '#EF4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer'
                          }}
                          title="Cancel or Delete Software Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* PAGINATION CONTROLS */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '1px solid var(--border-light)', background: '#070A12' }}>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total software projects)
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{
                  background: '#0F172A',
                  color: page <= 1 ? '#64748B' : '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontWeight: 700,
                  cursor: page <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                style={{
                  background: '#0F172A',
                  color: page >= pagination.totalPages ? '#64748B' : '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontWeight: 700,
                  cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* EDITOR MODAL */}
      <ProjectEditorModal
        isOpen={editorModalOpen}
        onClose={() => setEditorModalOpen(false)}
        initialProject={editingProject}
        onSaveSuccess={(msg) => {
          setActionSuccess(msg);
          setTimeout(() => setActionSuccess(null), 4000);
          fetchProjects();
        }}
      />

      {/* DETAILS MODAL */}
      <ProjectDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        project={selectedProject}
        payments={projectPayments}
      />

    </div>
  );
}
