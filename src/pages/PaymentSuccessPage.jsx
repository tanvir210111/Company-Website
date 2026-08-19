import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowLeft, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export default function PaymentSuccessPage({ onNavigate }) {
  const [tranId, setTranId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Media Scope IT Ltd | Payment Status';
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('tran_id');
    setTranId(id || '');

    if (id) {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      fetch(`${backendUrl}/api/payment/status/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching payment status:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const isPaid = order && (order.status === 'PAID' || order.status === 'PROCESSING');

  return (
    <div style={{ background: '#050811', minHeight: '85vh', color: '#FFFFFF', padding: '60px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%', background: '#0B1120', borderRadius: '24px', border: isPaid ? '1px solid #10B981' : '1px solid #FFB703', padding: '40px 30px', boxShadow: isPaid ? '0 20px 40px rgba(16, 185, 129, 0.15)' : '0 20px 40px rgba(255, 183, 3, 0.15)', textAlign: 'center' }}>
        
        <div style={{ width: '80px', height: '80px', background: isPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 183, 3, 0.15)', borderRadius: '50%', border: isPaid ? '2px solid #10B981' : '2px solid #FFB703', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: isPaid ? '#10B981' : '#FFB703' }}>
          {isPaid ? <CheckCircle2 size={48} /> : <Clock size={48} />}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: isPaid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 183, 3, 0.2)', border: isPaid ? '1px solid #10B981' : '1px solid #FFB703', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', color: isPaid ? '#10B981' : '#FFB703', fontWeight: 700, marginBottom: '12px' }}>
          <ShieldCheck size={14} /> SSLCommerz Payment Status: {order ? order.status : 'VERIFYING'}
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          {isPaid ? 'Payment Successful!' : 'Payment Received — Verifying'}
        </h1>
        
        <p style={{ color: '#94A3B8', fontSize: '0.96rem', marginBottom: '28px' }}>
          {isPaid ? 'Thank you for enrolling with Media Scope IT Ltd. Your payment has been verified and your admission seat is reserved.' : 'Your payment request has been received and is being verified by the backend gateway.'}
        </p>

        {/* Digital Receipt Card */}
        <div style={{ background: '#0F172A', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '24px', textAlign: 'left', marginBottom: '28px', fontSize: '0.9rem' }}>
          {order && order.orderId && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#94A3B8' }}>Order ID:</span>
              <strong style={{ color: '#FF6B00', fontFamily: 'monospace' }}>{order.orderId}</strong>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '14px' }}>
            <span style={{ color: '#94A3B8' }}>Transaction ID (TrxID):</span>
            <strong style={{ color: '#00B4D8', fontFamily: 'monospace' }}>{tranId || 'MSIT_PAYMENT'}</strong>
          </div>

          {order && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#94A3B8' }}>Student Name:</span>
                <strong style={{ color: '#FFFFFF' }}>{order.customerName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#94A3B8' }}>Mobile Number:</span>
                <strong style={{ color: '#FFFFFF' }}>{order.customerPhone}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#94A3B8' }}>Enrolled Course:</span>
                <strong style={{ color: '#FF6B00' }}>{order.courseTitle}</strong>
              </div>

              {order.cardType && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#94A3B8' }}>Payment Channel:</span>
                  <strong style={{ color: '#10B981', textTransform: 'uppercase' }}>{order.cardType}</strong>
                </div>
              )}
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginTop: '12px' }}>
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Total Amount:</span>
            <strong style={{ color: '#10B981', fontSize: '1.2rem', fontWeight: 800 }}>
              ৳{order ? Number(order.amount).toLocaleString('en-IN') : 'Confirmed'} BDT
            </strong>
          </div>
        </div>

        <div style={{ background: 'rgba(0, 180, 216, 0.1)', border: '1px solid #00B4D8', padding: '12px 16px', borderRadius: '12px', fontSize: '0.84rem', color: '#00B4D8', marginBottom: '28px', textAlign: 'left' }}>
          ✓ An official SMS confirmation with admission details and lab schedule has been sent to your registered phone number.
        </div>

        <button 
          onClick={() => onNavigate('home')} 
          className="btn-primary" 
          style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
        >
          <ArrowLeft size={18} /> Continue to Website
        </button>
      </div>
    </div>
  );
}
