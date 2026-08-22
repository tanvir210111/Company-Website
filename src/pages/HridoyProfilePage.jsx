import React, { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, Mail, Phone, MapPin, CheckCircle2, ShieldCheck, Sparkles, Send, Megaphone, Target, Globe } from 'lucide-react';

export default function HridoyProfilePage({ onNavigate, onOpenQuote }) {
  useEffect(() => {
    document.title = "Hridoy Hasan | Jr. Social Media Marketer | Media Scope IT Ltd";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [sessionForm, setSessionForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setSessionForm({ name: '', phone: '', email: '', message: '' }); }, 5000);
  };

  const SKILLS = [
    "Digital Campaign Assistance", "Social Media Ops & Analytics", "Customer Communication",
    "Facebook & Instagram Management", "Ad Post Scheduling", "Brand Outreach"
  ];

  return (
    <div style={{ background: '#070A12', color: 'white', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('team')} className="btn-outline" style={{ fontSize: '0.88rem' }}><ArrowLeft size={16} /> Back to Team</button>
          <button onClick={() => onNavigate('home')} className="btn-outline" style={{ fontSize: '0.88rem' }}>Homepage</button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          padding: '32px 20px',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '30px', alignItems: 'center' }}>
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div style={{
                maxWidth: '260px',
                width: '100%',
                height: '280px',
                margin: '0 auto',
                borderRadius: '20px',
                padding: '3px',
                background: 'linear-gradient(135deg, #00B4D8, #FF6B00)',
                boxShadow: '0 12px 36px rgba(0, 180, 216, 0.35)'
              }}>
                <img src="/Team/Hridoy Hasan.jpg" alt="Hridoy Hasan" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '17px' }} />
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 180, 216, 0.15)', border: '1px solid #00B4D8', color: '#00B4D8', padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, marginTop: '16px' }}>
                <ShieldCheck size={16} /> Verified Jr. Social Media Marketer
              </div>
            </div>

            <div>
              <div style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#FF6B00" /> DIGITAL CAMPAIGN & SOCIAL MEDIA OPS
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.2 }}>
                Hridoy Hasan
              </h1>

              <div style={{ fontSize: '1.15rem', color: '#00B4D8', fontWeight: 700, marginBottom: '16px' }}>
                Jr. Social Media Marketer – Media Scope IT Ltd
              </div>

              <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.65, marginBottom: '24px' }}>
                Junior Social Media Marketer assisting with digital marketing campaigns, social media management, customer interaction, and online campaign operations.
              </p>

              <div className="profile-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '10px', marginTop: '8px' }}>
                <button onClick={() => onOpenQuote()} className="btn-primary profile-action-btn" style={{ padding: '10px 16px', fontSize: '0.84rem', justifyContent: 'center', textAlign: 'center' }}>
                  <Briefcase size={15} /> Request Consultation
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '30px', marginBottom: '50px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#0F172A', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Megaphone size={20} color="#00B4D8" /> Professional Overview
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.96rem', lineHeight: 1.7 }}>
                Hridoy Hasan is a Junior Social Media Marketer at <strong>Media Scope IT Ltd</strong>. He focuses on executing daily social media marketing tasks, scheduling campaign posts, and monitoring customer feedback.
              </p>
            </div>

            <div style={{ background: '#0F172A', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} color="#FF6B00" /> Key Skills
              </h3>
              <div className="profile-tech-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '10px' }}>
                {SKILLS.map((skill, idx) => (
                  <div key={idx} style={{ background: 'rgba(0, 180, 216, 0.12)', border: '1px solid rgba(0, 180, 216, 0.3)', color: '#FFFFFF', padding: '8px 12px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="#00B4D8" /> {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ background: '#0F172A', padding: '32px', borderRadius: '20px', border: '2px solid #00B4D8', boxShadow: '0 12px 30px rgba(0, 180, 216, 0.2)' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '12px' }}>Book Social Media Consultation</h3>
              {submitted ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', padding: '20px', borderRadius: '14px', textAlign: 'center' }}>
                  <CheckCircle2 size={40} style={{ margin: '0 auto 10px auto' }} />
                  <h4>Request Received!</h4>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group"><label className="form-label">Your Name *</label><input type="text" required className="form-input" value={sessionForm.name} onChange={e => setSessionForm({ ...sessionForm, name: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Phone Number *</label><input type="tel" required className="form-input" value={sessionForm.phone} onChange={e => setSessionForm({ ...sessionForm, phone: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Email *</label><input type="email" required className="form-input" value={sessionForm.email} onChange={e => setSessionForm({ ...sessionForm, email: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Brief Note</label><textarea className="form-textarea" rows="3" value={sessionForm.message} onChange={e => setSessionForm({ ...sessionForm, message: e.target.value })}></textarea></div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}><Send size={16} /> Submit Request</button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
