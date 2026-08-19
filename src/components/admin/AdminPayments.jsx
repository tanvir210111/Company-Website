import React, { useState, useEffect } from 'react';
import {
  CreditCard, Search, Filter, RefreshCw, Eye, CheckCircle2, ChevronLeft, ChevronRight, AlertCircle, ShieldCheck
} from 'lucide-react';
import PaymentDetailsModal from './PaymentDetailsModal';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gatewayFilter, setGatewayFilter] = useState('all');

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 10);
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (gatewayFilter !== 'all') queryParams.append('gateway', gatewayFilter);

      const res = await fetch(`${backendUrl}/api/admin/payments?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
        if (data.pagination) setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to retrieve payment records.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, statusFilter, gatewayFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPayments();
  };

  const handleVerifyStatus = async (item) => {
    if (item.status === 'PAID') {
      alert('This transaction is already verified as PAID.');
      return;
    }

    if (!window.confirm(`Verify transaction #${item.order_id} (৳${item.amount}) as PAID? This will automatically update enrollment or project balance.`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/payments/${item.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'PAID' })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Payment verified as PAID successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchPayments();
      } else {
        alert(data.message || 'Status update failed.');
      }
    } catch (err) {
      alert('Network error updating payment status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TITLE & HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard color="#00B4D8" size={28} /> Payment & Financial Audit Directory
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Inspect SSLCommerz and manual student & client transaction logs. Historical records remain 100% immutable for accounting audit compliance.
          </p>
        </div>
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
              placeholder="Search by transaction ID, user name, email..."
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
            <option value="all">All Payment Statuses</option>
            <option value="PAID">PAID (Verified)</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="FAILED">FAILED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <select
            value={gatewayFilter}
            onChange={e => { setGatewayFilter(e.target.value); setPage(1); }}
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
            <option value="all">All Gateways</option>
            <option value="sslcommerz">SSLCommerz</option>
            <option value="manual_bkash">bKash (Manual)</option>
            <option value="manual_nagad">Nagad (Manual)</option>
            <option value="bank_transfer">Bank Transfer</option>
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
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
            <p>Loading Financial Records...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : payments.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
            <CreditCard size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No payment transaction logs found.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#070A12', color: '#64748B', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 16px' }}>Transaction ID</th>
                <th style={{ padding: '14px 16px' }}>Payer User</th>
                <th style={{ padding: '14px 16px' }}>Target Item</th>
                <th style={{ padding: '14px 16px' }}>Amount</th>
                <th style={{ padding: '14px 16px' }}>Gateway</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Date</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '14px 16px', color: '#00B4D8', fontWeight: 800 }}>
                    {p.order_id}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 700 }}>
                    <div>{p.user_name || 'Anonymous Payer'}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 400 }}>{p.user_email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#CBD5E1' }}>
                    {p.enrollment_no ? (
                      <span style={{ color: '#00B4D8' }}>Enrollment #{p.enrollment_no}</span>
                    ) : p.project_title ? (
                      <span style={{ color: '#CBD5E1' }}>Project: {p.project_title}</span>
                    ) : (
                      'Direct Payment'
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#10B981', fontWeight: 800 }}>
                    ৳{p.amount} {p.currency || 'BDT'}
                  </td>
                  <td style={{ padding: '14px 16px', textTransform: 'uppercase', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                    {p.payment_gateway?.replace('_', ' ')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      background: p.status === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : p.status === 'PENDING' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: p.status === 'PAID' ? '#10B981' : p.status === 'PENDING' ? '#F59E0B' : '#EF4444',
                      border: '1px solid var(--border-light)'
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.78rem' }}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => { setSelectedPayment(p); setDetailsModalOpen(true); }}
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

                      {p.status !== 'PAID' && (
                        <button
                          onClick={() => handleVerifyStatus(p)}
                          style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10B981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Verify Transaction & Sync Balance"
                        >
                          <ShieldCheck size={14} /> Verify
                        </button>
                      )}
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
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total payments)
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

      {/* DETAILS MODAL */}
      <PaymentDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        payment={selectedPayment}
      />

    </div>
  );
}
