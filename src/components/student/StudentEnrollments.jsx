import React, { useState, useEffect } from 'react';
import {
  FileCheck, CreditCard, Calendar, Clock, RefreshCw, AlertCircle, CheckCircle2, ChevronRight
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function StudentEnrollments({ onNavigate, onSelectSubPage }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/student/enrollments');
      const data = await res.json();
      if (data.success) {
        setEnrollments(data.enrollments || []);
      } else {
        setError(data.message || 'Failed to load enrollment records.');
      }
    } catch (err) {
      setError('Could not connect to enrollment service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Enrollment History...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileCheck size={24} color="#00B4D8" /> My Enrollment Records
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Official records of admission registrations, batch enrollments, and tuition dues.
          </p>
        </div>

        <button
          onClick={fetchEnrollments}
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

      {enrollments.length === 0 ? (
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '48px 20px',
          textAlign: 'center',
          color: '#64748B'
        }}>
          <FileCheck size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
          <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>No Enrollment Records</h3>
          <p style={{ fontSize: '0.88rem', marginBottom: '16px' }}>You have no verified course admissions on file.</p>
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
            Apply for Admission
          </button>
        </div>
      ) : (
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Enrollment #</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Course Title</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Batch</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Total Fee</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Paid</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Due</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Payment Status</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Enrollment Status</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(enr => (
                <tr key={enr.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 16px', fontSize: '0.84rem', fontWeight: 700, color: '#00B4D8' }}>
                    #{enr.enrollment_no}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {enr.course_title}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#94A3B8' }}>
                    {enr.batch_number || enr.batch_title || 'General'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.84rem', fontWeight: 600, color: '#FFFFFF' }}>
                    ৳{parseFloat(enr.total_fee || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.84rem', fontWeight: 700, color: '#10B981' }}>
                    ৳{parseFloat(enr.paid_amount || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.84rem', fontWeight: 700, color: parseFloat(enr.due_amount) > 0 ? '#EF4444' : '#64748B' }}>
                    ৳{parseFloat(enr.due_amount || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: enr.payment_status === 'paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: enr.payment_status === 'paid' ? '#10B981' : '#F59E0B',
                      border: `1px solid ${enr.payment_status === 'paid' ? '#10B981' : '#F59E0B'}`
                    }}>
                      {enr.payment_status?.toUpperCase() || 'UNPAID'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: enr.status === 'active' ? 'rgba(0, 180, 216, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                      color: enr.status === 'active' ? '#00B4D8' : '#94A3B8',
                      border: `1px solid ${enr.status === 'active' ? '#00B4D8' : '#64748B'}`
                    }}>
                      {enr.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
