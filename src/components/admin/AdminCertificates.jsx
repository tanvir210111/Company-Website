import React, { useState, useEffect } from 'react';
import {
  Award, Plus, Search, Filter, RefreshCw, Eye, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react';
import CertificateDetailsModal from './CertificateDetailsModal';

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [courseOptions, setCourseOptions] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Issue Modal
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [enrollmentsList, setEnrollmentsList] = useState([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState('');
  const [submittingIssue, setSubmittingIssue] = useState(false);

  // Details Modal
  const [selectedCert, setSelectedCert] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchCoursesAndEnrollments = async () => {
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const [crsRes, enrRes] = await Promise.all([
        fetch(`${backendUrl}/api/admin/enrollment-options/courses`, { credentials: 'include' }),
        fetch(`${backendUrl}/api/admin/enrollments?limit=100`, { credentials: 'include' })
      ]);
      const crsData = await crsRes.json();
      const enrData = await enrRes.json();
      if (crsData.success) setCourseOptions(crsData.courses || []);
      if (enrData.success) setEnrollmentsList(enrData.enrollments || []);
    } catch (err) {
      console.log('Error fetching options:', err);
    }
  };

  const fetchCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 10);
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (courseFilter !== 'all') queryParams.append('course_id', courseFilter);

      const res = await fetch(`${backendUrl}/api/admin/certificates?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setCertificates(data.certificates || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to retrieve certificates.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndEnrollments();
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [page, statusFilter, courseFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCertificates();
  };

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    if (!selectedEnrollmentId) return;

    setSubmittingIssue(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enrollment_id: selectedEnrollmentId })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Certificate issued successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        setIssueModalOpen(false);
        setSelectedEnrollmentId('');
        fetchCertificates();
      } else {
        alert(data.message || 'Failed to issue certificate.');
      }
    } catch (err) {
      alert('Error issuing certificate.');
    } finally {
      setSubmittingIssue(false);
    }
  };

  const handleRevokeToggle = async (item) => {
    const newStatus = item.status === 'active' ? 'revoked' : 'active';
    const confirmMessage = item.status === 'active'
      ? `Revoke certificate #${item.certificate_number} for ${item.student_name}? Public verification will flag it as REVOKED.`
      : `Reactivate certificate #${item.certificate_number}?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/certificates/${item.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || `Certificate status updated to ${newStatus}.`);
        setTimeout(() => setActionSuccess(null), 4000);
        fetchCertificates();
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch (err) {
      alert('Network error updating certificate status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TITLE & HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award color="#00B4D8" size={28} /> Student Course Certificates
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Issue, verify, print, and manage official course completion certificates for Media Scope IT Ltd students.
          </p>
        </div>

        <button
          onClick={() => setIssueModalOpen(true)}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}
        >
          <Plus size={16} /> Issue New Certificate
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
              placeholder="Search certificate no, student name, email..."
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
            <option value="all">All Statuses</option>
            <option value="active">Active (Valid)</option>
            <option value="revoked">Revoked</option>
          </select>

          <select
            value={courseFilter}
            onChange={e => { setCourseFilter(e.target.value); setPage(1); }}
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
            <option value="all">All Courses</option>
            {courseOptions.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
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
            <p>Loading Certificates...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : certificates.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
            <Award size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No certificate records found.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem', minWidth: '650px' }}>
            <thead>
              <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 16px' }}>Certificate No</th>
                <th style={{ padding: '14px 16px' }}>Student</th>
                <th style={{ padding: '14px 16px' }}>Course Title</th>
                <th style={{ padding: '14px 16px' }}>Issue Date</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '14px 16px', color: '#00B4D8', fontWeight: 800 }}>
                    {c.certificate_number}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 700 }}>
                    <div>{c.student_name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 400 }}>{c.student_email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#CBD5E1', maxWidth: '240px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.course_title}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.78rem' }}>
                    {new Date(c.issue_date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      background: c.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: c.status === 'active' ? '#10B981' : '#EF4444',
                      border: '1px solid var(--border-light)'
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => { setSelectedCert(c); setDetailsModalOpen(true); }}
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
                        <Eye size={14} /> View / Print
                      </button>

                      <a
                        href={`/certificate/${c.certificate_number}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: '#0F172A',
                          color: '#94A3B8',
                          border: '1px solid var(--border-light)',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Verify Public Route"
                      >
                        <ExternalLink size={14} /> Verify
                      </a>

                      <button
                        onClick={() => handleRevokeToggle(c)}
                        style={{
                          background: 'transparent',
                          color: c.status === 'active' ? '#EF4444' : '#10B981',
                          border: `1px solid ${c.status === 'active' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {c.status === 'active' ? 'Revoke' : 'Reactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PAGINATION CONTROLS */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '1px solid var(--border-light)', background: '#070A12' }}>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total certificates)
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

      {/* ISSUE CERTIFICATE MODAL */}
      {issueModalOpen && (
        <div className="modal-overlay" onClick={() => setIssueModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <button className="modal-close" onClick={() => setIssueModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award color="#00B4D8" size={22} /> Issue Student Course Certificate
            </h3>

            <form onSubmit={handleIssueCertificate}>
              <div className="form-group">
                <label className="form-label">Eligible Student Enrollment *</label>
                <select
                  required
                  className="form-input"
                  value={selectedEnrollmentId}
                  onChange={e => setSelectedEnrollmentId(e.target.value)}
                >
                  <option value="">-- Select Student Enrollment --</option>
                  {enrollmentsList.map(e => (
                    <option key={e.id} value={e.id}>
                      #{e.enrollment_no} — {e.student_name} ({e.course_title})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submittingIssue || !selectedEnrollmentId}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontWeight: 800, fontSize: '0.95rem', marginTop: '12px' }}
              >
                {submittingIssue ? 'Generating Certificate...' : 'Generate Official Certificate'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS & PRINT MODAL */}
      <CertificateDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        certificate={selectedCert}
      />

    </div>
  );
}
