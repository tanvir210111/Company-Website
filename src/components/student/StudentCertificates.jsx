import React, { useState, useEffect } from 'react';
import {
  Award, CheckCircle2, RefreshCw, AlertCircle, ExternalLink, Download, ShieldCheck, Calendar
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function StudentCertificates({ onNavigate }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/student/certificates');
      const data = await res.json();
      if (data.success) {
        setCertificates(data.certificates || []);
      } else {
        setError(data.message || 'Failed to load certificates.');
      }
    } catch (err) {
      setError('Could not connect to certificate verification system.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Your Issued Certificates...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} color="#8B5CF6" /> Verified Course Certificates
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Digitally signed completion credentials with instant QR and code verification.
          </p>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('cert-verification')}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#8B5CF6',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ShieldCheck size={14} /> Public Verifier
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {certificates.length === 0 ? (
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '48px 20px',
          textAlign: 'center',
          color: '#64748B'
        }}>
          <Award size={44} style={{ margin: '0 auto 12px auto', opacity: 0.4, color: '#8B5CF6' }} />
          <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>No Certificates Issued Yet</h3>
          <p style={{ fontSize: '0.88rem', maxWidth: '480px', margin: '0 auto' }}>
            Certificates are automatically awarded upon the successful completion and project submission of your enrolled training program.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {certificates.map(crt => (
            <div
              key={crt.id}
              style={{
                background: '#0B1120',
                borderRadius: '12px',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#8B5CF6', fontWeight: 800, background: 'rgba(139, 92, 246, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    CERTIFICATE #{crt.certificate_no}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: crt.status === 'valid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: crt.status === 'valid' ? '#10B981' : '#EF4444',
                    border: `1px solid ${crt.status === 'valid' ? '#10B981' : '#EF4444'}`
                  }}>
                    {crt.status?.toUpperCase() || 'VALID'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                  {crt.course_title}
                </h3>

                <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                  <div><strong>Verification Code:</strong> <code style={{ color: '#00B4D8', fontWeight: 700 }}>{crt.verification_code}</code></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="#64748B" />
                    <span>Issue Date: {crt.issue_date ? new Date(crt.issue_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  {crt.grade_or_score && <div><strong>Grade / Score:</strong> {crt.grade_or_score}</div>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <button
                  onClick={() => onNavigate && onNavigate(`certificate/${crt.verification_code}`)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: '#8B5CF6',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <ExternalLink size={14} /> View Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
