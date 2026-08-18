import React, { useState } from 'react';
import { ArrowLeft, Award, Briefcase, GraduationCap, Mail, Phone, MapPin, CheckCircle2, ShieldCheck, Sparkles, Send, Code, Terminal, Server, Star, Globe, Clock, UserCheck } from 'lucide-react';

export default function TanvirProfilePage({ onNavigate, onOpenAdmission, onOpenQuote }) {
  const [sessionForm, setSessionForm] = useState({
    name: '',
    phone: '',
    email: '',
    topic: 'Career & Software Mentorship',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSessionForm({ name: '', phone: '', email: '', topic: 'Career & Software Mentorship', message: '' });
    }, 5000);
  };

  return (
    <div style={{ background: '#070A12', color: 'white', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onNavigate('team')} 
            className="btn-outline" 
            style={{ fontSize: '0.88rem' }}
          >
            <ArrowLeft size={16} /> Back to Team
          </button>
          <button 
            onClick={() => onNavigate('home')} 
            className="btn-outline" 
            style={{ fontSize: '0.88rem' }}
          >
            Homepage
          </button>
        </div>

        {/* HERO PROFILE HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          padding: '40px',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}>
            {/* Image Box with Fading Mask Border */}
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div style={{
                width: '260px',
                height: '280px',
                margin: '0 auto',
                borderRadius: '20px',
                padding: '3px',
                background: 'linear-gradient(135deg, #00B4D8, #FF6B00)',
                boxShadow: '0 12px 36px rgba(0, 180, 216, 0.35)'
              }}>
                <img 
                  src="/Team/Tanvir Hossain Khan.jpg" 
                  alt="Engr. Tanvir Hossain Khan" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '17px'
                  }} 
                />
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 180, 216, 0.15)',
                border: '1px solid #00B4D8',
                color: '#00B4D8',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginTop: '16px'
              }}>
                <ShieldCheck size={16} /> Verified Senior Software Developer
              </div>
            </div>

            {/* Profile Content */}
            <div>
              <div style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#FF6B00" /> Full-Stack Engineering & Mentorship
              </div>

              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.15 }}>
                Engr. Tanvir Hossain Khan
              </h1>

              <div style={{ fontSize: '1.15rem', color: '#00B4D8', fontWeight: 700, marginBottom: '16px' }}>
                Senior Software Developer — Media Scope IT Ltd
              </div>

              <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.65, marginBottom: '24px' }}>
                3+ years of hands-on experience in full-stack web application development, scalable microservices, database architecture, and software engineering mentorship in Bangladesh.
              </p>

              {/* Quick Info Badges */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
                <span style={{ background: '#0B1120', border: '1px solid var(--border-light)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={14} color="#FFB703" /> 3+ Years Tech Experience
                </span>
                <span style={{ background: '#0B1120', border: '1px solid var(--border-light)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={14} color="#00B4D8" /> Full-Stack Developer
                </span>
                <span style={{ background: '#0B1120', border: '1px solid var(--border-light)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={14} color="#FF6B00" /> Web & Mobile Apps
                </span>
              </div>

              {/* Social & Contact Actions */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a 
                  href="https://www.linkedin.com/in/tanvir-khan-90122a30b" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  <Globe size={16} /> Official LinkedIn Profile
                </a>
                <button 
                  onClick={() => onOpenQuote()} 
                  className="btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  <Briefcase size={16} /> Request Consultation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* GRID SECTION: Details & Mentorship Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          
          {/* LEFT COL: Detailed Professional Background */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Bio Card */}
            <div style={{ background: '#0F172A', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} color="#00B4D8" /> Professional Overview
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '14px' }}>
                Engr. Tanvir Hossain Khan is a Senior Software Developer at <strong>Media Scope IT Ltd</strong>. With 3+ years of dedicated industry experience, he specializes in building modern web applications, scalable APIs, and robust software solutions.
              </p>
              <p style={{ color: '#94A3B8', fontSize: '0.96rem', lineHeight: 1.7 }}>
                He works actively on full-stack web and mobile systems, database optimization, and conducting 1-on-1 code reviews and career mentorship sessions for students at Dhanmondi campus.
              </p>
            </div>

            {/* Core Competencies & Skills */}
            <div style={{ background: '#0F172A', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={20} color="#FF6B00" /> Core Competencies & Expertise
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {[
                  "Enterprise Software Architecture",
                  "Full Stack System Design",
                  "IT Governance & Compliance",
                  "ReactJS & Node.js Microservices",
                  "Python & Django Backends",
                  "Database Engineering & SQL",
                  "Cloud Infrastructure & DevOps",
                  "Academic Curriculum Design",
                  "Corporate Strategic Leadership",
                  "1-on-1 Student Career Coaching"
                ].map((skill, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(0, 180, 216, 0.12)',
                    border: '1px solid rgba(0, 180, 216, 0.3)',
                    color: '#FFFFFF',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <CheckCircle2 size={14} color="#00B4D8" /> {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Office Contact Details */}
            <div style={{ background: '#0F172A', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} color="#FFB703" /> Direct Office Credentials
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#CBD5E1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={16} color="#00B4D8" />
                  <span>Hotline: <strong>+88 01714-691963</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} color="#00B4D8" />
                  <span>Email: <strong>info@mediascopeit.com</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} color="#00B4D8" />
                  <span>Location: House-32, Road-02, Dhanmondi, Dhaka-1205, Bangladesh.</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COL: 1-on-1 Consultation & Mentorship Request Form */}
          <div>
            <div style={{
              background: '#0F172A',
              padding: '32px',
              borderRadius: '20px',
              border: '2px solid #00B4D8',
              boxShadow: '0 12px 30px rgba(0, 180, 216, 0.2)',
              position: 'sticky',
              top: '100px'
            }}>
              <div style={{ color: '#00B4D8', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                Direct Executive Access
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '12px' }}>
                Book 1-on-1 Mentorship Session
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Request a personal consultation session directly with Engr. Tanvir Hossain Khan for IT career planning, software architecture guidance, or corporate project partnership.
              </p>

              {submitted ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', padding: '20px', borderRadius: '14px', textAlign: 'center' }}>
                  <CheckCircle2 size={40} style={{ margin: '0 auto 10px auto' }} />
                  <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '6px' }}>Session Request Received!</h4>
                  <p style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>Thank you. Our Dhanmondi office will contact you on <strong>{sessionForm.phone || 'your phone number'}</strong> to confirm your schedule.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="Enter your full name"
                      value={sessionForm.name}
                      onChange={e => setSessionForm({ ...sessionForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-input" 
                      placeholder="017XXXXXXXX"
                      value={sessionForm.phone}
                      onChange={e => setSessionForm({ ...sessionForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      className="form-input" 
                      placeholder="name@example.com"
                      value={sessionForm.email}
                      onChange={e => setSessionForm({ ...sessionForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Consultation Subject *</label>
                    <select 
                      className="form-select"
                      value={sessionForm.topic}
                      onChange={e => setSessionForm({ ...sessionForm, topic: e.target.value })}
                    >
                      <option value="Career & Software Mentorship">IT Training & Career Guidance</option>
                      <option value="Enterprise Software Quote">Enterprise Software Development Quote</option>
                      <option value="Code Architecture Advice">Software Code & Architecture Advice</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brief Note / Question</label>
                    <textarea 
                      className="form-textarea"
                      rows="3"
                      placeholder="Write your topic or questions here..."
                      value={sessionForm.message}
                      onChange={e => setSessionForm({ ...sessionForm, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    <Send size={16} /> Submit Mentorship Request
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
