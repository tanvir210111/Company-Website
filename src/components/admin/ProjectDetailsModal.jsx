import React from 'react';
import {
  Building2, User, DollarSign, Calendar, FileText, CheckCircle2, ShieldCheck, CreditCard
} from 'lucide-react';

export default function ProjectDetailsModal({ isOpen, onClose, project, payments = [] }) {
  if (!isOpen || !project) return null;

  const contractAmt = parseFloat(project.contract_amount) || 0;
  const paidAmt = parseFloat(project.paid_amount) || 0;
  const dueAmt = Math.max(0, contractAmt - paidAmt);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(0, 180, 216, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00B4D8' }}>
            <Building2 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {project.project_title}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
              Project Code: <span style={{ color: '#00B4D8', fontWeight: 700 }}>#{project.project_code}</span> • Category: {project.service_category}
            </div>
          </div>
        </div>

        {/* FINANCIAL SUMMARY HIGHLIGHT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '12px', background: '#070A12', padding: '16px', borderRadius: '10px', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>CONTRACT AMOUNT</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
              ৳{contractAmt.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>PAID AMOUNT</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
              ৳{paidAmt.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>REMAINING DUE</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: dueAmt > 0 ? '#EF4444' : '#10B981', marginTop: '4px' }}>
              ৳{dueAmt.toLocaleString()}
            </div>
          </div>
        </div>

        {/* CLIENT INFORMATION */}
        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={16} color="#00B4D8" /> Corporate Client Information
          </h4>
          <div style={{ background: '#070A12', padding: '14px', borderRadius: '8px', fontSize: '0.84rem', color: '#CBD5E1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '10px' }}>
            <div><strong>Client Name:</strong> {project.client_name || 'N/A'}</div>
            <div><strong>Company:</strong> {project.company_name || 'Individual Client'}</div>
            <div><strong>Email:</strong> {project.client_email || 'N/A'}</div>
            <div><strong>Phone:</strong> {project.client_phone || 'N/A'}</div>
          </div>
        </div>

        {/* PROJECT TIMELINE */}
        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} color="#00B4D8" /> Project Timeline & Status
          </h4>
          <div style={{ background: '#070A12', padding: '14px', borderRadius: '8px', fontSize: '0.84rem', color: '#CBD5E1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '10px' }}>
            <div><strong>Start Date:</strong> {project.start_date || 'N/A'}</div>
            <div><strong>Estimated Delivery:</strong> {project.estimated_delivery_date || 'N/A'}</div>
            <div><strong>Current Status:</strong> <span style={{ textTransform: 'uppercase', color: '#00B4D8', fontWeight: 700 }}>{project.status?.replace('_', ' ')}</span></div>
          </div>
        </div>

        {/* LINKED PAYMENTS HISTORY */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CreditCard size={16} color="#00B4D8" /> Linked Payment Transactions ({payments.length})
          </h4>
          {payments.length === 0 ? (
            <div style={{ padding: '14px', background: '#070A12', borderRadius: '8px', color: '#64748B', fontSize: '0.82rem' }}>
              No payments recorded for this software project yet.
            </div>
          ) : (
            <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', minWidth: '450px' }}>
                <thead>
                  <tr style={{ background: '#070A12', color: '#64748B' }}>
                    <th style={{ padding: '8px' }}>Transaction ID</th>
                    <th style={{ padding: '8px' }}>Amount</th>
                    <th style={{ padding: '8px' }}>Gateway</th>
                    <th style={{ padding: '8px' }}>Status</th>
                    <th style={{ padding: '8px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '8px', color: '#00B4D8', fontWeight: 700 }}>{p.order_id}</td>
                      <td style={{ padding: '8px', color: '#10B981', fontWeight: 700 }}>৳{p.amount}</td>
                      <td style={{ padding: '8px', textTransform: 'uppercase' }}>{p.payment_gateway?.replace('_', ' ')}</td>
                      <td style={{ padding: '8px' }}><span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', fontWeight: 700 }}>{p.status}</span></td>
                      <td style={{ padding: '8px', color: '#64748B' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
