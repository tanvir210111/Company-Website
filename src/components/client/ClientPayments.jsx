import React, { useState, useEffect } from 'react';
import {
  CreditCard, CheckCircle2, Clock, XCircle, RefreshCw, AlertCircle, FileText, Download
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function ClientPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/client/payments');
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
      } else {
        setError(data.message || 'Failed to load enterprise payments.');
      }
    } catch (err) {
      setError('Could not connect to payment records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#FF6B00' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Enterprise Payment Invoices...</p>
      </div>
    );
  }

  const totalPaid = payments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={24} color="#10B981" /> Invoices & Commercial Payments
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Official transaction vouchers, milestones invoices, and digital receipts.
          </p>
        </div>

        <div style={{
          padding: '8px 16px',
          borderRadius: '8px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10B981',
          fontWeight: 700,
          fontSize: '0.86rem'
        }}>
          Total Paid: ৳{totalPaid.toLocaleString()}
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {payments.length === 0 ? (
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '48px 20px',
          textAlign: 'center',
          color: '#64748B'
        }}>
          <CreditCard size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
          <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>No Payment Records</h3>
          <p style={{ fontSize: '0.88rem' }}>No commercial software project invoices have been billed yet.</p>
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
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Invoice / Order #</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Project Reference</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Amount</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Method</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Billing Date</th>
                <th style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 16px', fontSize: '0.84rem', fontWeight: 700, color: '#FF6B00' }}>
                    #{p.order_id || p.id}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {p.project_title || (p.project_code ? `Project #${p.project_code}` : 'Custom Software Milestone')}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.88rem', fontWeight: 800, color: '#10B981' }}>
                    ৳{parseFloat(p.amount || 0).toLocaleString()} {p.currency || 'BDT'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#94A3B8', textTransform: 'capitalize' }}>
                    {p.payment_gateway || 'Corporate Bank / SSLCommerz'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#64748B' }}>
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: p.status === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : p.status === 'PENDING' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: p.status === 'PAID' ? '#10B981' : p.status === 'PENDING' ? '#F59E0B' : '#EF4444',
                      border: `1px solid ${p.status === 'PAID' ? '#10B981' : p.status === 'PENDING' ? '#F59E0B' : '#EF4444'}`
                    }}>
                      {p.status || 'PENDING'}
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
