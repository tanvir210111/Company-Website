import React, { useState } from 'react';
import { Award, Search, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CertVerifier({ onNavigate }) {
  const [certId, setCertId] = useState('MS-2026-101');

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('cert-verification');
    }
  };

  return (
    <section id="cert-verify" className="section" style={{ background: '#0B1120', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
      <div className="section-container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(0, 180, 216, 0.15)',
            border: '2px solid var(--accent-cyan)',
            color: '#00B4D8',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 0 20px rgba(0, 180, 216, 0.3)'
          }}>
            <Award size={28} />
          </div>
          <h2 className="section-title">Verify Student Certificate Online</h2>
          <p className="section-desc">
            Enter student certificate registration code (e.g., <strong>MS-2026-101</strong>) to view official verified transcripts and credentials.
          </p>
        </div>

        <form onSubmit={handleVerifySubmit} style={{ display: 'flex', gap: '12px', background: '#0F172A', padding: '8px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <input 
            type="text" 
            className="form-input" 
            style={{ border: 'none', background: 'transparent', fontSize: '1rem' }}
            placeholder="Enter Certificate ID (e.g. MS-2026-101)"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
            <Search size={18} /> Open Verification Portal
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.82rem', color: '#64748B' }}>
          Official Certificate Verification Portal • Media Scope IT Ltd Academic Board
        </div>
      </div>
    </section>
  );
}
