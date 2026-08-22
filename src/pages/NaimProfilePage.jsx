import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Briefcase, Mail, Phone, MapPin, CheckCircle2, ShieldCheck, Sparkles, Send, Megaphone, Target, TrendingUp, Globe } from 'lucide-react';

export default function NaimProfilePage({ onNavigate, onOpenQuote }) {
  useEffect(() => {
    document.title = "MD NAIMUR RAHMAN NAIM | Sr. Social Media Marketer | Media Scope IT Ltd";
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
    "Meta Ads & Campaign Management", "Google Ads & PPC Strategy", "Facebook & Instagram Boosting",
    "Target Audience Analytics", "Social Media ROI Optimization", "Brand Growth & Funnel Strategy",
    "Content Strategy & Copywriting", "Lead Generation Campaigns"
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
                <img src="/Team/MD NAIMUR RAHMAN NAIM.jpg" alt="MD NAIMUR RAHMAN NAIM" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '17px' }} />
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 180, 216, 0.15)', border: '1px solid #00B4D8', color: '#00B4D8', padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, marginTop: '16px' }}>
                <ShieldCheck size={16} /> Verified Sr. Social Media Marketer
              </div>
            </div>

            <div>
              <div style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#FF6B00" /> DIGITAL MARKETING & ADS STRATEGY
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.2 }}>
                MD NAIMUR RAHMAN NAIM
              </h1>

              <div style={{ fontSize: '1.15rem', color: '#00B4D8', fontWeight: 700, marginBottom: '16px' }}>
                Sr. Social Media Marketer – Media Scope IT Ltd
              </div>

              <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.65, marginBottom: '24px' }}>
                Senior Social Media Marketer specializing in digital growth campaigns, Meta & Google Ads management, content marketing, and audience conversion optimization.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
                <span style={{ background: '#0B1120', border: '1px solid var(--border-light)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Megaphone size={14} color="#FFB703" /> Social Ads Strategy
                </span>
                <span style={{ background: '#0B1120', border: '1px solid var(--border-light)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={14} color="#00B4D8" /> Brand Growth & ROI
                </span>
              </div>

              <div className="profile-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '10px', marginTop: '8px' }}>
                <button onClick={() => onOpenQuote()} className="btn-primary profile-action-btn" style={{ padding: '10px 16px', fontSize: '0.84rem', justifyContent: 'center', textAlign: 'center' }}>
                  <Briefcase size={15} /> Request Campaign Quote
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
                MD NAIMUR RAHMAN NAIM leads senior digital marketing initiatives at <strong>Media Scope IT Ltd</strong>, managing high-converting Facebook/Instagram ad campaigns, audience re-targeting, and performance analytics.
              </p>
            </div>

            <div style={{ background: '#0F172A', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} color="#FF6B00" /> Marketing Competencies
              </h3>
              <div className="profile-tech-items" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%' }}>
                {SKILLS.map((skill, idx) => (
                  <div key={idx} className="profile-tech-badge" style={{ background: 'rgba(0, 180, 216, 0.12)', border: '1px solid rgba(0, 180, 216, 0.3)', color: '#FFFFFF', padding: '6px 12px', borderRadius: '10px', fontSize: '0.84rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', boxSizing: 'border-box' }}>
                    <CheckCircle2 size={13} color="#00B4D8" /> {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ background: '#0F172A', padding: '32px', borderRadius: '20px', border: '2px solid #00B4D8', boxShadow: '0 12px 30px rgba(0, 180, 216, 0.2)' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '12px' }}>Book Ads & Campaign Consultation</h3>
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
                  <div className="form-group"><label className="form-label">Campaign Note</label><textarea className="form-textarea" rows="3" value={sessionForm.message} onChange={e => setSessionForm({ ...sessionForm, message: e.target.value })}></textarea></div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}><Send size={16} /> Submit Campaign Request</button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
