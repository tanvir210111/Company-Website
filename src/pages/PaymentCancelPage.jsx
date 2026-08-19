import React, { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function PaymentCancelPage({ onNavigate, onOpenAdmission }) {
  const [tranId, setTranId] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('tran_id');
    setTranId(id || '');
  }, []);

  return (
    <div style={{ background: '#050811', minHeight: '85vh', color: '#FFFFFF', padding: '60px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '550px', width: '100%', background: '#0B1120', borderRadius: '24px', border: '1px solid #FFB703', padding: '40px 30px', boxShadow: '0 20px 40px rgba(255, 183, 3, 0.12)', textAlign: 'center' }}>
        
        <div style={{ width: '80px', height: '80px', background: 'rgba(255, 183, 3, 0.15)', borderRadius: '50%', border: '2px solid #FFB703', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#FFB703' }}>
          <AlertCircle size={48} />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 183, 3, 0.2)', border: '1px solid #FFB703', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', color: '#FFB703', fontWeight: 700, marginBottom: '12px' }}>
          Payment Cancelled
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          Payment Cancelled
        </h1>
        
        <p style={{ color: '#94A3B8', fontSize: '0.96rem', marginBottom: '24px' }}>
          Your payment session was cancelled. You can retry payment anytime or complete your admission using other options.
        </p>

        {tranId && (
          <div style={{ background: '#0F172A', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '14px', marginBottom: '24px', fontSize: '0.88rem', color: '#CBD5E1' }}>
            Cancelled Transaction Ref: <strong style={{ color: '#FFB703', fontFamily: 'monospace' }}>{tranId}</strong>
          </div>
        )}

        <div style={{ display: 'flex', gap: '14px', marginTop: '20px' }}>
          <button 
            onClick={() => onNavigate('courses')} 
            className="btn-outline" 
            style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
          >
            <ArrowLeft size={16} /> Return to Website
          </button>
          
          <button 
            onClick={() => {
              onNavigate('home');
              if (onOpenAdmission) onOpenAdmission(null);
            }} 
            className="btn-primary" 
            style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
          >
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
