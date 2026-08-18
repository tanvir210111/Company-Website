import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Search, ShieldCheck, Printer, CheckCircle2, QrCode, Sparkles, Building2, User, Calendar, BookOpen, Download } from 'lucide-react';

export default function CertVerificationPage({ onNavigate }) {
  const [certId, setCertId] = useState('MS-2026-101');
  const [verifiedResult, setVerifiedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const mockDatabase = {
    'MS-2026-101': {
      studentName: 'Mohammad Tanvir Hasan',
      courseName: 'Full Stack Web Development',
      batchNo: 'MS-WEB-Batch-688',
      issueDate: 'July 15, 2026',
      grade: 'A+ (Outstanding)',
      certId: 'MS-2026-101',
      duration: '64 Hours (4 Months)',
      verificationCode: 'MS-HASH-9812409128',
      directorSign: 'Engr. Tanvir Hossain Khan',
      status: 'VERIFIED OFFICIAL GRADUATE'
    },
    'MS-2026-102': {
      studentName: 'Tanzin Anik Kabir',
      courseName: 'WordPress Theme Development',
      batchNo: 'MS-WP-Batch-412',
      issueDate: 'August 02, 2026',
      grade: 'A+ (Outstanding)',
      certId: 'MS-2026-102',
      duration: '48 Hours (2.5 Months)',
      verificationCode: 'MS-HASH-7712398471',
      directorSign: 'Engr. Tanvir Hossain Khan',
      status: 'VERIFIED OFFICIAL GRADUATE'
    }
  };

  useEffect(() => {
    handleVerify('MS-2026-101');
  }, []);

  const handleVerify = (idToSearch = certId) => {
    const cleanId = idToSearch.trim().toUpperCase();
    if (mockDatabase[cleanId]) {
      setVerifiedResult(mockDatabase[cleanId]);
      setErrorMsg('');
    } else {
      setVerifiedResult(null);
      setErrorMsg(`No official certificate found matching ID "${cleanId}". Please check the ID code.`);
    }
  };

  // Instant Direct PDF Download of ONLY the Certificate Box (No outer BG, No browser header text)
  const handleDownloadPDF = async () => {
    const element = document.querySelector('.printable-certificate');
    if (!element) return;

    setIsGenerating(true);

    try {
      if (!window.html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.body.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      const opt = {
        margin: 0,
        filename: `Media_Scope_IT_Certificate_${verifiedResult.certId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#0F172A',
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };

      await window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF Generation Fallback:', err);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ background: '#070A12', color: 'white', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb - Hidden in Print */}
        <button 
          onClick={() => onNavigate('home')} 
          className="btn-outline no-print" 
          style={{ marginBottom: '24px', fontSize: '0.88rem' }}
        >
          <ArrowLeft size={16} /> Back to Homepage
        </button>

        {/* Page Banner Header - Hidden in Print */}
        <div className="no-print" style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          padding: '40px 30px',
          borderRadius: '20px',
          border: '1px solid var(--border-light)',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(0, 180, 216, 0.15)',
            border: '2px solid #00B4D8',
            color: '#00B4D8',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 14px auto',
            boxShadow: '0 0 25px rgba(0, 180, 216, 0.35)'
          }}>
            <Award size={30} />
          </div>

          <div style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
            Official Academic Certificate Portal
          </div>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
            Verify Student Credentials & Transcripts
          </h1>
          
          <p style={{ color: '#94A3B8', fontSize: '0.98rem', maxWidth: '700px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            Enter a student's official certificate registration code below to verify their academic transcript, course completion, and digital badge online.
          </p>

          {/* Search Box */}
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              className="form-input" 
              style={{ fontSize: '1.05rem', padding: '12px 18px', textTransform: 'uppercase', letterSpacing: '1px', background: '#070A12', flex: '1 1 200px' }}
              placeholder="e.g. MS-2026-101"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
            />
            <button 
              onClick={() => handleVerify(certId)} 
              className="btn-primary" 
              style={{ padding: '12px 24px', fontSize: '0.95rem', whiteSpace: 'nowrap', flex: '1 1 140px', justifyContent: 'center' }}
            >
              <Search size={18} /> Verify Credentials
            </button>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '14px' }}>
            Sample IDs to verify: {' '}
            <button onClick={() => { setCertId('MS-2026-101'); handleVerify('MS-2026-101'); }} style={{ background: 'none', border: 'none', color: '#00B4D8', cursor: 'pointer', textDecoration: 'underline' }}>MS-2026-101</button>
            {' • '}
            <button onClick={() => { setCertId('MS-2026-102'); handleVerify('MS-2026-102'); }} style={{ background: 'none', border: 'none', color: '#00B4D8', cursor: 'pointer', textDecoration: 'underline' }}>MS-2026-102</button>
          </div>
        </div>

        {/* ERROR NOTICE */}
        {errorMsg && (
          <div className="no-print" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', padding: '18px', borderRadius: '14px', textAlign: 'center', marginBottom: '32px', fontSize: '0.95rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* OFFICIAL DIGITAL CERTIFICATE SHOWCASE CONTAINER */}
        {verifiedResult && (
          <div className="cert-scroll-wrapper">
            <div className="printable-certificate-outer" style={{ marginBottom: '50px', minWidth: '700px' }}>
              <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 800, fontSize: '1.1rem' }}>
                  <CheckCircle2 size={22} /> Official Verified Certificate & Transcript
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={handleDownloadPDF} 
                    className="btn-primary" 
                    disabled={isGenerating}
                    style={{ fontSize: '0.88rem', padding: '10px 18px', gap: '8px' }}
                  >
                    <Download size={16} /> {isGenerating ? 'Generating PDF...' : 'Download PDF Certificate'}
                  </button>

                  <button onClick={handlePrint} className="btn-secondary" style={{ fontSize: '0.88rem', padding: '10px 18px', gap: '8px' }}>
                    <Printer size={16} /> Print Preview
                  </button>
                </div>
              </div>

              {/* PRESTIGIOUS LUXURY CERTIFICATE CANVAS FRAME - ONLY THIS BOX IS DOWNLOADED / PRINTED */}
              <div className="printable-certificate" style={{
                background: '#0F172A',
                borderRadius: '20px',
                border: '10px double #00B4D8',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 180, 216, 0.25)',
                padding: '36px 32px',
                position: 'relative',
                overflow: 'hidden'
              }}>
              {/* Translucent Background Watermark Logo */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.04,
                pointerEvents: 'none',
                width: '380px'
              }}>
                <img src="/logo.jpeg" alt="Watermark" style={{ width: '100%', borderRadius: '50%' }} />
              </div>

              {/* Inner Gold Border & Corner Ornaments */}
              <div className="cert-inner-border" style={{
                border: '2px solid #FFB703',
                borderRadius: '12px',
                padding: '24px 28px',
                textAlign: 'center',
                position: 'relative'
              }}>
                {/* Four Gold Corner Ornaments */}
                <div style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '1.2rem', color: '#FFB703' }}>❖</div>
                <div style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '1.2rem', color: '#FFB703' }}>❖</div>
                <div style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '1.2rem', color: '#FFB703' }}>❖</div>
                <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '1.2rem', color: '#FFB703' }}>❖</div>

                {/* Top Header: Logo, Institute Title & Govt Reg Badge */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                  <img src="/logo.jpeg" alt="Media Scope IT Logo" style={{ height: '48px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 180, 216, 0.3)' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '1px' }}>MEDIA SCOPE IT LTD</div>
                    <div style={{ fontSize: '0.75rem', color: '#00B4D8', fontWeight: 700, letterSpacing: '2px' }}>IT & SOFTWARE INSTITUTE • DHAKA, BANGLADESH</div>
                  </div>
                </div>

                <div style={{ color: '#FFB703', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: '8px' }}>
                  Govt. Registered Training Center (RJSC Reg: C-166968/2020)
                </div>

                {/* Main Certificate Title */}
                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'Georgia, serif', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  Certificate of Completion
                </h2>

                <p style={{ color: '#94A3B8', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '6px' }}>
                  This is to officially certify that
                </p>

                {/* Student Name */}
                <div className="cert-student-name" style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#00B4D8',
                  marginBottom: '10px',
                  borderBottom: '2px solid #00B4D8',
                  display: 'inline-block',
                  paddingBottom: '4px',
                  paddingLeft: '28px',
                  paddingRight: '28px',
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  {verifiedResult.studentName}
                </div>

                <p style={{ color: '#E2E8F0', fontSize: '0.94rem', maxWidth: '720px', margin: '0 auto 16px auto', lineHeight: 1.6 }}>
                  has successfully completed the comprehensive professional training course in{' '}
                  <strong style={{ color: '#FFFFFF', textDecoration: 'underline', textDecorationColor: '#00B4D8' }}>{verifiedResult.courseName}</strong> ({verifiedResult.duration}) with a grade of{' '}
                  <strong style={{ color: '#FF6B00' }}>{verifiedResult.grade}</strong> and has satisfied all practical real-world lab requirements.
                </p>

                {/* Verification Metadata Box + QR Code Badge */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center', background: 'rgba(7, 10, 18, 0.85)', padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '18px', textAlign: 'left' }} className="cert-badge-box">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>Certificate ID:</span> <br />
                      <strong style={{ color: '#00B4D8', fontSize: '0.9rem' }}>{verifiedResult.certId}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>Batch Number:</span> <br />
                      <strong style={{ color: '#FFFFFF' }}>{verifiedResult.batchNo}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>Issue Date:</span> <br />
                      <strong style={{ color: '#FFFFFF' }}>{verifiedResult.issueDate}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>Verification Code:</span> <br />
                      <strong style={{ color: '#FFB703', fontSize: '0.72rem' }}>{verifiedResult.verificationCode}</strong>
                    </div>
                  </div>

                  {/* QR Code Verification Box */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0F172A', padding: '6px 10px', borderRadius: '8px', border: '1px solid #00B4D8' }}>
                    <QrCode size={32} color="#00B4D8" />
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', lineHeight: 1.2 }}>
                      <strong style={{ color: '#FFFFFF', display: 'block' }}>Scan to Verify</strong>
                      mediascopeit.com
                    </div>
                  </div>
                </div>

                {/* Signatures & Official Metallic Gold Verified Emblem */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                  {/* Managing Director Signature */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#00B4D8', fontSize: '1.05rem', fontWeight: 700, marginBottom: '2px' }}>
                      Engr. Tanvir Hossain Khan
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', borderTop: '1px dashed #94A3B8', paddingTop: '3px' }}>
                      Managing Director, Media Scope IT Ltd
                    </div>
                  </div>

                  {/* Metallic 3D Gold Verified Emblem Badge */}
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFE259 0%, #FFA751 100%)',
                    color: '#070A12',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'center',
                    fontWeight: 900,
                    fontSize: '0.6rem',
                    textAlign: 'center',
                    boxShadow: '0 0 20px rgba(255, 183, 3, 0.5), 0 4px 10px rgba(0, 0, 0, 0.4)',
                    border: '3px solid #FFFFFF',
                    position: 'relative'
                  }}>
                    <ShieldCheck size={22} color="#070A12" />
                    <span style={{ fontSize: '0.58rem', letterSpacing: '0.5px' }}>VERIFIED</span>
                    <span style={{ fontSize: '0.52rem', fontWeight: 800 }}>ACADEMIC</span>
                  </div>

                  {/* Controller of Examinations Signature */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#10B981', fontSize: '1.05rem', fontWeight: 700, marginBottom: '2px' }}>
                      Academic Board Director
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', borderTop: '1px dashed #94A3B8', paddingTop: '3px' }}>
                      Controller of Examinations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
