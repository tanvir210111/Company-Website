import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, AlertTriangle, Search, ShieldCheck, ArrowLeft, Building2 } from 'lucide-react';

export default function PublicCertificateVerification() {
  const [certNumber, setCertNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Extract certificate number from URL path: /certificate/:certificateNumber
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const certFromUrl = pathParts[pathParts.length - 1];
    if (certFromUrl && certFromUrl !== 'certificate') {
      setCertNumber(certFromUrl);
      verifyCertificate(certFromUrl);
    }
  }, []);

  const verifyCertificate = async (numToVerify) => {
    const queryNum = numToVerify || certNumber;
    if (!queryNum.trim()) return;

    setLoading(true);
    setVerificationResult(null);
    setCertificateData(null);
    setErrorMsg('');

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/public/certificates/${encodeURIComponent(queryNum.trim())}`);
      const data = await res.json();

      if (data.success) {
        setVerificationResult(data.verificationResult);
        setCertificateData(data.certificate);
      } else {
        setVerificationResult('not_found');
        setErrorMsg(data.message || 'No certificate found matching the provided number.');
      }
    } catch (err) {
      setVerificationResult('error');
      setErrorMsg('Network error connecting to verification server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    verifyCertificate();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070A12',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* PUBLIC HEADER */}
      <header style={{
        padding: '20px 30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: '#0B1120',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between'
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#FFFFFF' }}>
          <Building2 color="#00B4D8" size={26} />
          <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Media Scope IT <span style={{ color: '#00B4D8' }}>Ltd</span>
          </span>
        </a>

        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94A3B8', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Website
        </a>
      </header>

      {/* VERIFICATION CONTAINER */}
      <main style={{ flex: 1, padding: '60px 20px', maxWidth: '780px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(0, 180, 216, 0.15)',
            border: '2px solid #00B4D8',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={36} color="#00B4D8" />
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Official Certificate Verification
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto' }}>
            Verify the authenticity of course completion certificates issued by Media Scope IT Ltd.
          </p>
        </div>

        {/* SEARCH FORM */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: '#64748B' }} />
            <input
              type="text"
              required
              placeholder="Enter Certificate Number (e.g. MSIT-CERT-2026-00101)..."
              value={certNumber}
              onChange={e => setCertNumber(e.target.value)}
              style={{
                width: '100%',
                background: '#0B1120',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '12px 16px 12px 46px',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              background: '#00B4D8',
              color: '#070A12',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        {/* VERIFICATION RESULTS CARD */}
        {verificationResult && (
          <div style={{
            background: '#0B1120',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: '30px',
            textAlign: 'center'
          }}>
            
            {verificationResult === 'valid' && certificateData && (
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  marginBottom: '24px'
                }}>
                  <CheckCircle2 size={20} /> ✓ Certificate Verified
                </div>

                <div style={{ background: '#070A12', padding: '20px', borderRadius: '12px', textAlign: 'left', fontSize: '0.9rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px', color: '#CBD5E1' }}>
                  <div><strong>Certificate Number:</strong> <span style={{ color: '#00B4D8', fontWeight: 800 }}>{certificateData.certificate_number}</span></div>
                  <div><strong>Issue Date:</strong> {new Date(certificateData.issue_date).toLocaleDateString()}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Student Name:</strong> <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{certificateData.student_name}</span></div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Course Program:</strong> <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{certificateData.course_title}</span></div>
                  <div><strong>Issuing Authority:</strong> Media Scope IT Ltd</div>
                  <div><strong>Verification Status:</strong> <span style={{ color: '#10B981', fontWeight: 800 }}>AUTHENTIC & VALID</span></div>
                </div>
              </div>
            )}

            {verificationResult === 'revoked' && certificateData && (
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#EF4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  marginBottom: '20px'
                }}>
                  <AlertTriangle size={20} /> ⚠ Certificate Revoked
                </div>

                <p style={{ color: '#EF4444', fontSize: '0.9rem' }}>
                  This certificate (#{certificateData.certificate_number}) was officially issued to {certificateData.student_name} but has been REVOKED by Media Scope IT Ltd.
                </p>
              </div>
            )}

            {verificationResult === 'not_found' && (
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#F59E0B',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  marginBottom: '16px'
                }}>
                  <AlertTriangle size={20} /> Certificate Not Found
                </div>

                <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                  {errorMsg || 'No record matches the provided certificate number. Please check for typos and try again.'}
                </p>
              </div>
            )}

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', color: '#64748B', fontSize: '0.8rem' }}>
        © 2026 Media Scope IT Ltd (RJSC Reg: C-166968/2020). All Rights Reserved.
      </footer>

    </div>
  );
}
