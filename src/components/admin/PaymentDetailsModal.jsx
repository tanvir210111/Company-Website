import React from 'react';
import {
  CreditCard, ShieldCheck, DollarSign, User, BookOpen, Building2, Calendar, FileText
} from 'lucide-react';

export default function PaymentDetailsModal({ isOpen, onClose, payment }) {
  if (!isOpen || !payment) return null;

  const isEnrollment = !!payment.enrollment_id || !!payment.enrollment_no;
  const isProject = !!payment.project_id || !!payment.project_title;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
          <CreditCard color="#00B4D8" size={24} />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Payment Transaction #{payment.order_id}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
              Created on {new Date(payment.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        {/* FINANCIAL SUMMARY HIGHLIGHT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '12px', background: '#070A12', padding: '16px', borderRadius: '10px', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>TRANSACTION AMOUNT</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
              ৳{payment.amount} {payment.currency || 'BDT'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>GATEWAY / METHOD</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#00B4D8', marginTop: '6px', textTransform: 'uppercase' }}>
              {payment.payment_gateway?.replace('_', ' ')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>VERIFICATION STATUS</div>
            <div style={{
              display: 'inline-block',
              marginTop: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              background: payment.status === 'PAID' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: payment.status === 'PAID' ? '#10B981' : '#EF4444',
              border: '1px solid var(--border-light)'
            }}>
              {payment.status}
            </div>
          </div>
        </div>

        {/* PAYER DETAILS */}
        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={16} color="#00B4D8" /> Payer Customer Information
          </h4>
          <div style={{ background: '#070A12', padding: '14px', borderRadius: '8px', fontSize: '0.84rem', color: '#CBD5E1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '10px' }}>
            <div><strong>Name:</strong> {payment.user_name || payment.contact_name || 'N/A'}</div>
            <div><strong>Email:</strong> {payment.user_email || 'N/A'}</div>
            <div><strong>Phone:</strong> {payment.user_phone || 'N/A'}</div>
            <div><strong>User ID:</strong> #{payment.user_id || 'N/A'}</div>
          </div>
        </div>

        {/* RELATED ENROLLMENT OR SOFTWARE PROJECT BREAKDOWN */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isEnrollment ? <BookOpen size={16} color="#00B4D8" /> : <Building2 size={16} color="#00B4D8" />}
            {isEnrollment ? 'Associated Student Course Enrollment' : isProject ? 'Associated Software Development Project' : 'General Transaction'}
          </h4>

          {isEnrollment ? (
            <div style={{ background: '#070A12', padding: '14px', borderRadius: '8px', fontSize: '0.84rem', color: '#CBD5E1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '10px' }}>
              <div><strong>Enrollment No:</strong> <span style={{ color: '#00B4D8', fontWeight: 700 }}>{payment.enrollment_no}</span></div>
              <div style={{ gridColumn: '1 / -1' }}><strong>Course Title:</strong> {payment.course_title || 'N/A'}</div>
            </div>
          ) : isProject ? (
            <div style={{ background: '#070A12', padding: '14px', borderRadius: '8px', fontSize: '0.84rem', color: '#CBD5E1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '10px' }}>
              <div style={{ gridColumn: '1 / -1' }}><strong>Project Title:</strong> <span style={{ color: '#00B4D8', fontWeight: 700 }}>{payment.project_title}</span></div>
            </div>
          ) : (
            <div style={{ padding: '12px', background: '#070A12', borderRadius: '8px', color: '#64748B', fontSize: '0.82rem' }}>
              Direct transaction.
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 24px', fontWeight: 700, borderRadius: '8px' }}>
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
