import React, { useEffect, useState } from 'react';
import { XCircle, RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function PaymentFailPage({ onNavigate, onOpenAdmission }) {
  const [tranId, setTranId] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('tran_id');
    setTranId(id || '');
  }, []);

  return (
    <div style={{ background: '#050811', minHeight: '85vh', color: '#FFFFFF', padding: '60px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '550px', width: '100%', background: '#0B1120', borderRadius: '24px', border: '1px solid #EF4444', padding: '40px 30px', boxShadow: '0 20px 40px rgba(239, 68, 68, 0.15)', textAlign: 'center' }}>
        
        <div style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '50%', border: '2px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#EF4444' }}>
          <XCircle size={48} />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', color: '#EF4444', fontWeight: 700, marginBottom: '12px' }}>
          <AlertTriangle size={14} /> Transaction Unsuccessful
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          Payment Failed
        </h1>
        
        <p style={{ color: '#94A3B8', fontSize: '0.96rem', marginBottom: '24px' }}>
          Your payment could not be processed by SSLCommerz or was declined by the bank. No charges were made.
        </p>

        {tranId && (
          <div style={{ background: '#0F172A', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '14px', marginBottom: '24px', fontSize: '0.88rem', color: '#CBD5E1' }}>
            Reference Transaction ID: <strong style={{ color: '#FF6B00', fontFamily: 'monospace' }}>{tranId}</strong>
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
