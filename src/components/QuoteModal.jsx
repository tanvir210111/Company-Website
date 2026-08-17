import React, { useState, useEffect } from 'react';
import { SERVICES } from '../data/servicesData';
import { X, CheckCircle2, Briefcase, Phone, User, Mail, Building, FileText, Send, CreditCard, RefreshCw, ArrowRight } from 'lucide-react';

export default function QuoteModal({ isOpen, onClose, selectedService, currentUser }) {
  const [service, setService] = useState(selectedService || SERVICES[0]);
  const [step, setStep] = useState(1); // 1: Requirements & Contact, 2: Payment Deposit, 3: Confirmation Slip

  const [formData, setFormData] = useState({
    clientName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    companyName: '',
    projectDetails: '',
    paymentMethod: 'bkash',
    trxId: '',
    userCaptcha: ''
  });

  const [captchaNum1, setCaptchaNum1] = useState(6);
  const [captchaNum2, setCaptchaNum2] = useState(4);
  const [captchaError, setCaptchaError] = useState('');

  useEffect(() => {
    if (selectedService) {
      setService(selectedService);
    }
  }, [selectedService]);

  useEffect(() => {
    generateCaptcha();
    setStep(1);
    setFormData({
      clientName: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      companyName: '',
      projectDetails: '',
      paymentMethod: 'bkash',
      trxId: '',
      userCaptcha: ''
    });
    setCaptchaError('');
  }, [isOpen, currentUser]);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
  };

  if (!isOpen) return null;

  const handleNextToPayment = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const sum = captchaNum1 + captchaNum2;
    if (parseInt(formData.userCaptcha) !== sum) {
      setCaptchaError('Incorrect captcha answer. Please try again.');
      generateCaptcha();
      return;
    }

    setCaptchaError('');
    setStep(3); // Confirmation Slip
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Header with Official Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '2px solid #00B4D8',
            boxShadow: '0 0 15px rgba(0, 180, 216, 0.3)',
            background: '#FFFFFF',
            padding: '3px',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <img src="/logo.jpeg" alt="Media Scope IT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} />
          </div>

          <div>
            <div style={{ color: '#00B4D8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Media Scope IT Commercial Solutions
            </div>
            <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 800 }}>
              Request Commercial Proposal & Demo
            </h2>
          </div>
        </div>

        {/* Step Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= 1 ? '#00B4D8' : 'var(--border-light)' }}></div>
          <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= 2 ? '#00B4D8' : 'var(--border-light)' }}></div>
          <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: step === 3 ? '#10B981' : 'var(--border-light)' }}></div>
        </div>

        {/* Selected Service Box */}
        <div style={{ background: '#0B1120', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-light)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Selected Service:</div>
            <div style={{ fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 800 }}>{service.title}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Starting Package:</div>
            <div style={{ fontSize: '1.2rem', color: '#00B4D8', fontWeight: 800 }}>{service.startingPrice}</div>
          </div>
        </div>

        {/* STEP 1: Client Requirements */}
        {step === 1 && (
          <form onSubmit={handleNextToPayment}>
            {currentUser && (
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10B981', color: '#10B981', padding: '8px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Contact info auto-filled from logged-in account ({currentUser.name})
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Client / Contact Name *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input"
                  placeholder="Your full name"
                  value={formData.clientName}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company / Business Name *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input"
                  placeholder="e.g. Acme Enterprise"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input 
                  type="tel" 
                  required 
                  className="form-input"
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Work Email *</label>
                <input 
                  type="email" 
                  required 
                  className="form-input"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Project Details & Requirements *</label>
              <textarea 
                rows={3} 
                required 
                className="form-textarea"
                placeholder="Describe your business software or web project requirements..."
                value={formData.projectDetails}
                onChange={e => setFormData({ ...formData, projectDetails: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Proceed to Proposal & Deposit Options <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2: Optional Deposit & Verification */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit}>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>Payment / Consultation Method:</h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'bkash' })}
                style={{
                  background: formData.paymentMethod === 'bkash' ? 'rgba(236, 18, 97, 0.2)' : '#0B1120',
                  border: formData.paymentMethod === 'bkash' ? '2px solid #EC1261' : '1px solid var(--border-light)',
                  padding: '10px',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                bKash Advance
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'nagad' })}
                style={{
                  background: formData.paymentMethod === 'nagad' ? 'rgba(247, 148, 29, 0.2)' : '#0B1120',
                  border: formData.paymentMethod === 'nagad' ? '2px solid #F7941D' : '1px solid var(--border-light)',
                  padding: '10px',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Nagad Advance
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'bank' })}
                style={{
                  background: formData.paymentMethod === 'bank' ? 'rgba(0, 180, 216, 0.2)' : '#0B1120',
                  border: formData.paymentMethod === 'bank' ? '2px solid #00B4D8' : '1px solid var(--border-light)',
                  padding: '10px',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Free Proposal Call
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Advance TrxID / Ref Code (Optional for Free Quote)</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="Optional TrxID if advance deposit paid"
                value={formData.trxId}
                onChange={e => setFormData({ ...formData, trxId: e.target.value })}
              />
            </div>

            {/* Captcha */}
            <div className="form-group" style={{ background: '#0B1120', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <label className="form-label">Security Captcha: {captchaNum1} + {captchaNum2} = ?</label>
              <input 
                type="number" 
                required 
                className="form-input" 
                placeholder="Answer"
                value={formData.userCaptcha}
                onChange={e => setFormData({ ...formData, userCaptcha: e.target.value })}
              />
              {captchaError && <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '6px' }}>{captchaError}</div>}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="button" onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                ← Back
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                Submit Official Proposal Request
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={54} color="#10B981" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '6px' }}>
              Proposal Request Received!
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginBottom: '24px' }}>
              Thank you, <strong>{formData.clientName}</strong> ({formData.companyName}). Our lead software engineer will contact you at <strong>{formData.phone}</strong> with a detailed proposal.
            </p>
            <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Close & Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
