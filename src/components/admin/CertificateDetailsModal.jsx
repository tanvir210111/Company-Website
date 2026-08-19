import React from 'react';
import {
  Award, ShieldCheck, Printer, CheckCircle2, AlertTriangle, User, BookOpen, Calendar
} from 'lucide-react';

export default function CertificateDetailsModal({ isOpen, onClose, certificate }) {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const isRevoked = certificate.status === 'revoked';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px', background: '#0B1120' }}>
        
        {/* ACTION HEADER (HIDDEN DURING PRINT) */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award color="#00B4D8" size={26} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Certificate #{certificate.certificate_number}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                Issued on {new Date(certificate.issue_date).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: '#00B4D8',
                color: '#070A12',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={16} /> Print Certificate
            </button>
            <button className="modal-close" onClick={onClose} style={{ position: 'static' }}>✕</button>
          </div>
        </div>

        {/* ELEGANT DIPLOMA CERTIFICATE PRINTABLE VIEW */}
        <div style={{
          background: 'linear-gradient(135deg, #070A12 0%, #0F172A 100%)',
          border: '3px double #00B4D8',
          borderRadius: '16px',
          padding: '40px 30px',
          textAlign: 'center',
          color: '#FFFFFF',
          position: 'relative',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          
          {/* WATERMARK BADGE */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0, 180, 216, 0.15)',
              border: '2px solid #00B4D8',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              <Award size={36} color="#00B4D8" />
            </div>
          </div>

          <h2 style={{ fontSize: '0.9rem', letterSpacing: '0.25em', color: '#00B4D8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            MEDIA SCOPE IT LTD
          </h2>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '20px' }}>
            CERTIFICATE OF COMPLETION
          </h1>

          <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '12px' }}>
            THIS CERTIFIES THAT
          </p>

          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#00B4D8', borderBottom: '2px solid rgba(0,180,216,0.3)', display: 'inline-block', paddingBottom: '6px', marginBottom: '16px' }}>
            {certificate.student_name}
          </h3>

          <p style={{ fontSize: '0.88rem', color: '#CBD5E1', maxWidth: '520px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
            has successfully completed the professional training program in <br />
            <strong style={{ color: '#FFFFFF', fontSize: '1.05rem' }}>{certificate.course_title}</strong>
          </p>

          {/* VERIFICATION BADGE */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 800,
            background: isRevoked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: isRevoked ? '#EF4444' : '#10B981',
            border: `1px solid ${isRevoked ? '#EF4444' : '#10B981'}`,
            marginBottom: '24px'
          }}>
            {isRevoked ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            {isRevoked ? 'REVOKED CERTIFICATE' : 'VERIFIED OFFICIAL CERTIFICATE'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', fontSize: '0.8rem', color: '#94A3B8' }}>
            <div style={{ textAlign: 'left' }}>
              <div><strong>Certificate No:</strong> {certificate.certificate_number}</div>
              <div><strong>Issue Date:</strong> {new Date(certificate.issue_date).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div><strong>Authorized Signature:</strong></div>
              <div style={{ fontFamily: 'cursive', color: '#00B4D8', fontSize: '1.1rem', marginTop: '4px', fontWeight: 700 }}>
                Media Scope IT Academic Board
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
