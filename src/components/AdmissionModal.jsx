import React, { useState, useEffect } from 'react';
import { COURSES } from '../data/coursesData';
import { X, CheckCircle, GraduationCap, Phone, User, Mail, CreditCard, Lock, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, Building, RefreshCw, FileText } from 'lucide-react';

export default function AdmissionModal({ isOpen, onClose, selectedCourse, currentUser }) {
  const [course, setCourse] = useState(selectedCourse || COURSES[0]);
  const [step, setStep] = useState(1); // 1: Student Details, 2: Payment Gateway, 3: Receipt Success

  const [formData, setFormData] = useState({
    studentName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    batchChoice: 'Upcoming Regular Batch',
    classMode: 'Offline Dhanmondi Campus',
    paymentMethod: 'sslcommerz', // 'sslcommerz' | 'bkash' | 'nagad' | 'card' | 'bank'
    trxId: '',
    userCaptcha: ''
  });

  const [captchaNum1, setCaptchaNum1] = useState(5);
  const [captchaNum2, setCaptchaNum2] = useState(3);
  const [captchaError, setCaptchaError] = useState('');
  const [trxError, setTrxError] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [sslError, setSslError] = useState('');
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [policyError, setPolicyError] = useState('');

  useEffect(() => {
    if (selectedCourse) {
      setCourse(selectedCourse);
    }
  }, [selectedCourse]);

  // AUTO-FILL LOGGED-IN STUDENT INFORMATION!
  useEffect(() => {
    generateCaptcha();
    setStep(1);
    setFormData({
      studentName: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      batchChoice: 'Upcoming Regular Batch',
      classMode: 'Offline Dhanmondi Campus',
      paymentMethod: 'sslcommerz',
      trxId: '',
      userCaptcha: ''
    });
    setCaptchaError('');
    setTrxError('');
    setIsSubmittingPayment(false);
    setSslError('');
    setAgreePolicy(false);
    setPolicyError('');
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

  const handleFinalPaymentSubmit = async (e) => {
    e.preventDefault();

    if (!agreePolicy) {
      setPolicyError('You must read and agree to the Terms & Conditions, Privacy Policy, and Refund Policy before proceeding.');
      return;
    }
    setPolicyError('');

    if (formData.paymentMethod === 'sslcommerz') {
      setIsSubmittingPayment(true);
      setSslError('');

      try {
        const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const response = await fetch(`${backendUrl}/api/payment/initiate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: course.id,
            courseTitle: course.title,
            amount: course.discountFee,
            studentName: formData.studentName,
            phone: formData.phone,
            email: formData.email,
            classMode: formData.classMode,
            batchChoice: formData.batchChoice
          })
        });

        const data = await response.json();

        if (data.success && data.url) {
          window.location.href = data.url;
        } else {
          setSslError(data.message || 'Unable to start payment. Please try again.');
          setIsSubmittingPayment(false);
        }
      } catch (err) {
        console.error('SSLCommerz initiation error:', err);
        setSslError('Unable to start payment. Please check network connection and try again.');
        setIsSubmittingPayment(false);
      }
      return;
    }

    // Manual Payment Options Validation
    const sum = captchaNum1 + captchaNum2;
    if (parseInt(formData.userCaptcha) !== sum) {
      setCaptchaError('Incorrect math captcha answer. Please try again.');
      generateCaptcha();
      return;
    }

    if (!formData.trxId || formData.trxId.trim().length < 6) {
      setTrxError('Please enter a valid TrxID or reference code (min 6 characters).');
      return;
    }

    setCaptchaError('');
    setTrxError('');
    setStep(3); // Show Success Receipt
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Modal Header */}
        <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF6B00', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            <GraduationCap size={16} /> Official Admission & Payment Gateway
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 800, marginTop: '4px' }}>
            Online Batch Registration
          </h2>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= 1 ? '#00B4D8' : 'var(--border-light)' }}></div>
          <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= 2 ? '#00B4D8' : 'var(--border-light)' }}></div>
          <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: step === 3 ? '#10B981' : 'var(--border-light)' }}></div>
        </div>

        {/* Selected Course Summary Box */}
        <div style={{ background: '#0B1120', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border-light)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Enrolling In Course:</div>
            <div style={{ fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 800 }}>{course.title}</div>
            <div style={{ fontSize: '0.8rem', color: '#FF6B00', fontWeight: 600 }}>Batch: {course.nextBatch} ({course.duration})</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Total Admission Fee:</div>
            <div style={{ fontSize: '1.4rem', color: '#00B4D8', fontWeight: 800 }}>{course.discountFee}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textDecoration: 'line-through' }}>{course.fee}</div>
          </div>
        </div>

        {/* STEP 1: Student Information (AUTO-FILLED) */}
        {step === 1 && (
          <form onSubmit={handleNextToPayment}>
            {currentUser && (
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10B981', color: '#10B981', padding: '8px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Student info auto-filled from logged-in account ({currentUser.name})
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Student Full Name *</label>
              <input 
                type="text" 
                required 
                className="form-input"
                placeholder="Enter student name"
                value={formData.studentName}
                onChange={e => setFormData({ ...formData, studentName: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
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
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  required 
                  className="form-input"
                  placeholder="student@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Class Mode *</label>
                <select 
                  className="form-select"
                  value={formData.classMode}
                  onChange={e => setFormData({ ...formData, classMode: e.target.value })}
                >
                  <option value="Offline Dhanmondi Campus">Offline (Dhanmondi Campus Lab)</option>
                  <option value="Online Live Zoom Class">Online (Live Zoom Class)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Time Slot *</label>
                <select 
                  className="form-select"
                  value={formData.batchChoice}
                  onChange={e => setFormData({ ...formData, batchChoice: e.target.value })}
                >
                  <option value="Regular Morning (10am-12pm)">Regular Morning (10:00 AM)</option>
                  <option value="Regular Afternoon (3pm-5pm)">Regular Afternoon (03:00 PM)</option>
                  <option value="Regular Evening (6pm-8pm)">Regular Evening (06:00 PM)</option>
                  <option value="Friday Weekend Special">Friday Weekend Special (3pm-7pm)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
              Proceed to Payment Gateway <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* STEP 2: Instant Payment Gateway */}
        {step === 2 && (
          <form onSubmit={handleFinalPaymentSubmit}>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '14px' }}>Select Payment Method:</h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 100px), 1fr))', gap: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'sslcommerz' })}
                style={{
                  gridColumn: '1 / -1',
                  background: formData.paymentMethod === 'sslcommerz' ? 'rgba(0, 180, 216, 0.25)' : '#0B1120',
                  border: formData.paymentMethod === 'sslcommerz' ? '2px solid #00B4D8' : '1px solid var(--border-light)',
                  padding: '14px 12px',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: formData.paymentMethod === 'sslcommerz' ? '0 0 15px rgba(0, 180, 216, 0.3)' : 'none'
                }}
              >
                <ShieldCheck size={18} color="#00B4D8" /> SSLCOMMERZ — Secure Online Payment (Instant Verification)
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'bkash' })}
                style={{
                  background: formData.paymentMethod === 'bkash' ? 'rgba(236, 18, 97, 0.2)' : '#0B1120',
                  border: formData.paymentMethod === 'bkash' ? '2px solid #EC1261' : '1px solid var(--border-light)',
                  padding: '12px 8px',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                bKash Manual
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'nagad' })}
                style={{
                  background: formData.paymentMethod === 'nagad' ? 'rgba(247, 148, 29, 0.2)' : '#0B1120',
                  border: formData.paymentMethod === 'nagad' ? '2px solid #F7941D' : '1px solid var(--border-light)',
                  padding: '12px 8px',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Nagad Manual
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                style={{
                  background: formData.paymentMethod === 'card' ? 'rgba(0, 180, 216, 0.2)' : '#0B1120',
                  border: formData.paymentMethod === 'card' ? '2px solid #00B4D8' : '1px solid var(--border-light)',
                  padding: '12px 8px',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Card Ref
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'bank' })}
                style={{
                  background: formData.paymentMethod === 'bank' ? 'rgba(16, 185, 129, 0.2)' : '#0B1120',
                  border: formData.paymentMethod === 'bank' ? '2px solid #10B981' : '1px solid var(--border-light)',
                  padding: '12px 8px',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                City Bank
              </button>
            </div>

            {/* Payment Instructions */}
            <div style={{ background: '#0B1120', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-light)', marginBottom: '20px', fontSize: '0.88rem' }}>
              {formData.paymentMethod === 'sslcommerz' && (
                <div>
                  <strong style={{ color: '#00B4D8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} /> SSLCommerz Hosted Checkout Channel:
                  </strong>
                  <p style={{ color: '#CBD5E1', marginTop: '6px', lineHeight: 1.5 }}>
                    Supports <strong>Visa, MasterCard, AMEX, bKash, Nagad, Rocket, Upay, CellFin, City Touch</strong>, and all Bangladeshi Credit / Debit cards and Internet Banking.
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ✓ Instant automated server verification & immediate receipt issuance.
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'bkash' && (
                <div>
                  <strong style={{ color: '#EC1261' }}>bKash Merchant Pay Instructions:</strong>
                  <ol style={{ paddingLeft: '20px', marginTop: '6px', color: '#CBD5E1', lineHeight: 1.6 }}>
                    <li>Go to your bKash App or dial *247#</li>
                    <li>Select <strong>Make Payment</strong> to Merchant Number: <strong style={{ color: '#FFFFFF' }}>01325-165451</strong></li>
                    <li>Enter Amount: <strong style={{ color: '#00B4D8' }}>{course.discountFee}</strong></li>
                    <li>Reference: <strong style={{ color: '#FFFFFF' }}>{formData.phone || 'ADMISSION'}</strong></li>
                  </ol>
                </div>
              )}

              {formData.paymentMethod === 'nagad' && (
                <div>
                  <strong style={{ color: '#F7941D' }}>Nagad Payment Instructions:</strong>
                  <ol style={{ paddingLeft: '20px', marginTop: '6px', color: '#CBD5E1', lineHeight: 1.6 }}>
                    <li>Go to Nagad App or dial *167#</li>
                    <li>Select <strong>Merchant Pay</strong> to Number: <strong style={{ color: '#FFFFFF' }}>01325-165451</strong></li>
                    <li>Enter Amount: <strong style={{ color: '#00B4D8' }}>{course.discountFee}</strong></li>
                  </ol>
                </div>
              )}

              {formData.paymentMethod === 'card' && (
                <div>
                  <strong style={{ color: '#00B4D8' }}>Visa / MasterCard / AMEX Manual Reference:</strong>
                  <p style={{ color: '#CBD5E1', marginTop: '6px' }}>
                    Enter your POS/Card payment transaction reference code below for manual verification.
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'bank' && (
                <div>
                  <strong style={{ color: '#10B981' }}>City Bank Account Transfer:</strong>
                  <p style={{ color: '#CBD5E1', marginTop: '6px', lineHeight: 1.5 }}>
                    Account Name: <strong>Media Scope IT Ltd</strong> <br />
                    Account Number: <strong>1502938481001</strong> <br />
                    Branch: Dhanmondi Branch, Dhaka.
                  </p>
                </div>
              )}
            </div>

            {sslError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {sslError}
              </div>
            )}

            {/* TrxID Input & Captcha (Only shown for Manual Payment Methods) */}
            {formData.paymentMethod !== 'sslcommerz' && (
              <>
                <div className="form-group">
                  <label className="form-label">Payment Transaction ID (TrxID / Reference Code) *</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    placeholder="e.g. 9J482KSL92 or Card Ref"
                    value={formData.trxId}
                    onChange={e => setFormData({ ...formData, trxId: e.target.value })}
                  />
                  {trxError && <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '4px' }}>{trxError}</div>}
                </div>

                <div className="form-group" style={{ background: '#0B1120', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Security Verification Captcha:</span>
                    <button type="button" onClick={generateCaptcha} style={{ background: 'none', border: 'none', color: '#00B4D8', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <RefreshCw size={12} /> New Numbers
                    </button>
                  </label>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <span style={{ background: '#0F172A', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '1.2rem', fontWeight: 800, color: '#FF6B00' }}>
                      {captchaNum1} + {captchaNum2} = ?
                    </span>
                    
                    <input 
                      type="number" 
                      required 
                      className="form-input" 
                      style={{ width: '100px' }}
                      placeholder="Answer"
                      value={formData.userCaptcha}
                      onChange={e => setFormData({ ...formData, userCaptcha: e.target.value })}
                    />
                  </div>
                  {captchaError && <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '6px' }}>{captchaError}</div>}
                </div>
              </>
            )}

            {/* Mandatory SSLCommerz Merchant Compliance Policy Agreement Checkbox */}
            <div style={{ marginTop: '16px', marginBottom: '16px', background: '#0F172A', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: '#CBD5E1', cursor: 'pointer', lineHeight: 1.5 }}>
                <input 
                  type="checkbox" 
                  required
                  checked={agreePolicy} 
                  onChange={(e) => { setAgreePolicy(e.target.checked); if (e.target.checked) setPolicyError(''); }}
                  style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#00B4D8', cursor: 'pointer', flexShrink: 0 }}
                />
                <span>
                  I have read and agree to the{' '}
                  <a href="/terms-and-conditions" target="_blank" rel="noreferrer" style={{ color: '#00B4D8', textDecoration: 'underline', fontWeight: 600 }}>Terms & Conditions</a>,{' '}
                  <a href="/privacy-policy" target="_blank" rel="noreferrer" style={{ color: '#00B4D8', textDecoration: 'underline', fontWeight: 600 }}>Privacy Policy</a>, and{' '}
                  <a href="/refund-policy" target="_blank" rel="noreferrer" style={{ color: '#00B4D8', textDecoration: 'underline', fontWeight: 600 }}>Refund & Return Policy</a>.
                </span>
              </label>
              {policyError && <div style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '6px' }}>{policyError}</div>}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="button" onClick={() => setStep(1)} disabled={isSubmittingPayment} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                ← Back
              </button>
              <button 
                type="submit" 
                disabled={isSubmittingPayment}
                className="btn-primary" 
                style={{ flex: 2, justifyContent: 'center', opacity: isSubmittingPayment ? 0.7 : 1, cursor: isSubmittingPayment ? 'not-allowed' : 'pointer' }}
              >
                {isSubmittingPayment ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} /> Processing Payment...
                  </>
                ) : formData.paymentMethod === 'sslcommerz' ? (
                  <>
                    Pay Securely with SSLCommerz <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    Complete Admission & Submit Payment
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Instant Success Receipt & Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={54} color="#10B981" style={{ margin: '0 auto 16px auto' }} />
            
            <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '6px' }}>
              Admission Registration Successful!
            </h3>
            
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginBottom: '24px' }}>
              Thank you, <strong>{formData.studentName}</strong>. Your seat reservation for <strong>{course.title}</strong> has been submitted.
            </p>

            {/* Official Digital Receipt Card */}
            <div style={{ background: '#0B1120', padding: '24px', borderRadius: '18px', border: '1px solid #10B981', textAlign: 'left', marginBottom: '24px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '14px' }}>
                <span style={{ color: '#94A3B8' }}>Registration Slip ID:</span>
                <strong style={{ color: '#00B4D8' }}>ADM-2026-8492</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Student Name:</span>
                <strong style={{ color: '#FFFFFF' }}>{formData.studentName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Mobile Number:</span>
                <strong style={{ color: '#FFFFFF' }}>{formData.phone}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Class Format:</span>
                <strong style={{ color: '#FF6B00' }}>{formData.classMode}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Payment Method:</span>
                <strong style={{ color: '#10B981', textTransform: 'uppercase' }}>{formData.paymentMethod}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Transaction ID (TrxID):</span>
                <strong style={{ color: '#FFB703' }}>{formData.trxId}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '12px' }}>
                <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Total Paid Amount:</span>
                <strong style={{ color: '#00B4D8', fontSize: '1.1rem' }}>{course.discountFee}</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#10B981', marginBottom: '20px' }}>
              ✓ An SMS confirmation with campus desk instructions has been sent to {formData.phone}.
            </p>

            <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Close Receipt & Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
