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
    paymentMethod: 'bkash', // 'bkash' | 'nagad' | 'card' | 'bank'
    trxId: '',
    userCaptcha: ''
  });

  const [captchaNum1, setCaptchaNum1] = useState(5);
  const [captchaNum2, setCaptchaNum2] = useState(3);
  const [captchaError, setCaptchaError] = useState('');
  const [trxError, setTrxError] = useState('');

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
      paymentMethod: 'bkash',
      trxId: '',
      userCaptcha: ''
    });
    setCaptchaError('');
    setTrxError('');
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

  const handleFinalPaymentSubmit = (e) => {
    e.preventDefault();
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
        <div style={{ background: '#0B1120', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border-light)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Enrolling In Course:</div>
            <div style={{ fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 800 }}>{course.title}</div>
            <div style={{ fontSize: '0.8rem', color: '#FF6B00', fontWeight: 600 }}>Batch: {course.nextBatch} ({course.duration})</div>
          </div>
          <div style={{ textAlign: 'right' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
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
                bKash Pay
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
                Nagad Pay
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
                Visa / Card
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
              {formData.paymentMethod === 'bkash' && (
                <div>
                  <strong style={{ color: '#EC1261' }}>bKash Merchant Pay Instructions:</strong>
                  <ol style={{ paddingLeft: '20px', marginTop: '6px', color: '#CBD5E1', lineHeight: 1.6 }}>
                    <li>Go to your bKash App or dial *247#</li>
                    <li>Select <strong>Make Payment</strong> to Merchant Number: <strong style={{ color: '#FFFFFF' }}>01714-691963</strong></li>
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
                    <li>Select <strong>Merchant Pay</strong> to Number: <strong style={{ color: '#FFFFFF' }}>01714-691963</strong></li>
                    <li>Enter Amount: <strong style={{ color: '#00B4D8' }}>{course.discountFee}</strong></li>
                  </ol>
                </div>
              )}

              {formData.paymentMethod === 'card' && (
                <div>
                  <strong style={{ color: '#00B4D8' }}>Visa / MasterCard / AMEX Online Gateway:</strong>
                  <p style={{ color: '#CBD5E1', marginTop: '6px' }}>
                    SSLCommerz Secure 256-Bit SSL Encrypted Checkout. Supports all Bangladeshi credit and debit cards.
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

            {/* TrxID Input */}
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

            {/* Security Captcha */}
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

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="button" onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                ← Back
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                Complete Admission & Submit Payment
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
