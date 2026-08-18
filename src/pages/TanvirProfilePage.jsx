import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Briefcase, GraduationCap, Mail, Phone, MapPin, CheckCircle2, ShieldCheck, Sparkles, Send, Code, Terminal, Server, Star, Globe, Clock, UserCheck, Layers, Cpu, Database, Laptop, Lock, ExternalLink } from 'lucide-react';

export default function TanvirProfilePage({ onNavigate, onOpenAdmission, onOpenQuote }) {
  useEffect(() => {
    document.title = "Engr. Tanvir Hossain Khan | Senior Software Engineer & SQA Engineer | Media Scope IT Ltd";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [sessionForm, setSessionForm] = useState({
    name: '',
    phone: '',
    email: '',
    topic: 'Full-Stack Development & Career Guidance',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSessionForm({ name: '', phone: '', email: '', topic: 'Full-Stack Development & Career Guidance', message: '' });
    }, 5000);
  };

  const TECH_CATEGORIES = [
    {
      category: "Frontend",
      items: ["ReactJS & Vite", "JavaScript (ES6+)", "Tailwind CSS"]
    },
    {
      category: "Backend",
      items: ["Node.js & Express", "Python & Django", "PHP & Laravel"]
    },
    {
      category: "Database",
      items: ["MongoDB & PostgreSQL"]
    },
    {
      category: "Mobile",
      items: ["Flutter & React Native"]
    },
    {
      category: "API",
      items: ["REST APIs & Postman"]
    },
    {
      category: "SQA",
      items: ["Manual SQA Testing", "Selenium & Playwright", "SDLC & STLC Workflows", "Test Case & Defect Management"]
    },
    {
      category: "Security / DevOps",
      items: ["Ethical Hacking & Web Security", "Linux & GitHub CI/CD"]
    }
  ];

  const NOTABLE_PROJECTS = [
    {
      title: "Admify – AI Study Abroad Platform",
      subtitle: "AI-Based University Recommendation & Study-Abroad System",
      description: "Flagship final-year project featuring AI country/university recommendations, admission probability prediction, scholarship matching, SOP/LOR generation, and student-agent portal.",
      tags: ["AI Recommendation", "React", "Node.js", "Python", "MongoDB"]
    },
    {
      title: "Bug Tracking Management System",
      subtitle: "Full Defect Lifecycle & SQA Workflow Platform",
      description: "Enterprise bug tracking tool managing issue logging, severity prioritization, test case execution, defect lifecycle tracking, and SQA reports.",
      tags: ["SQA Testing", "Test Cases", "Postman", "Selenium"]
    },
    {
      title: "Hospital Management System",
      subtitle: "Healthcare Operations & Patient Records",
      description: "Comprehensive medical ERP system for patient registration, doctor appointments, diagnostic billing, pharmacy inventory, and healthcare operations.",
      tags: ["Full Stack", "Database", "React", "REST API"]
    },
    {
      title: "FOBS Team Subtitle Website",
      subtitle: "English → Bangla Media Translation Platform",
      description: "Custom platform for media subtitle translation, SRT synchronization, and video localization management.",
      tags: ["Subtitle Translation", "SRT", "Media Automation"]
    },
    {
      title: "Kapasia Sheba Portal",
      subtitle: "Community Service & Helpline Directory App",
      description: "Local service directory app providing instant access to blood donors, emergency services, hotline contacts, and community resources.",
      tags: ["Community App", "Web & Mobile"]
    },
    {
      title: "Social Media Metrics & Automation Tools",
      subtitle: "Bulk Video Downloader & Analytics Web App",
      description: "Custom automation utilities for social media metrics tracking, Facebook/TikTok bulk video processing, and ad campaign performance.",
      tags: ["Automation", "Web Scraping"]
    }
  ];

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
            {/* Image Box */}
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
                  loading="eager"
                  decoding="async"
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
                <ShieldCheck size={16} /> Verified Senior Software Engineer
              </div>
            </div>

            {/* Profile Content */}
            <div>
              <div style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#FF6B00" /> FULL STACK SOFTWARE ENGINEER & SQA ENGINEER
              </div>

              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.15 }}>
                Engr. Tanvir Hossain Khan
              </h1>

              <div style={{ fontSize: '1.15rem', color: '#00B4D8', fontWeight: 700, marginBottom: '16px' }}>
                Senior Software Engineer & Tech Lead – Media Scope IT Ltd
              </div>

              <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.65, marginBottom: '24px' }}>
                Full-Stack Developer and SQA Engineer with 3+ years of hands-on experience building web applications, scalable backend systems, AI platforms, and automated software quality assurance suites.
              </p>

              {/* Quick Info Badges */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
                <span style={{ background: '#0B1120', border: '1px solid var(--border-light)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={14} color="#FFB703" /> 3+ Years Experience
                </span>
                <span style={{ background: '#0B1120', border: '1px solid var(--border-light)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={14} color="#00B4D8" /> B.Sc. in CSE (DIIT)
                </span>
                <span style={{ background: '#0B1120', border: '1px solid var(--border-light)', padding: '6px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={14} color="#FF6B00" /> Full-Stack & SQA
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
                <a 
                  href="https://github.com/tanvir210111" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-outline"
                  style={{ padding: '10px 20px', fontSize: '0.88rem', background: '#0B1120', borderColor: 'var(--border-light)' }}
                >
                  <Code size={16} color="#00B4D8" /> GitHub Profile
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

        {/* MAIN DETAILS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          
          {/* LEFT COLUMN: Detailed Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Professional Overview */}
            <div style={{ background: '#0F172A', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} color="#00B4D8" /> Professional Overview
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '14px' }}>
                Engr. Tanvir Hossain Khan is a Full-Stack Software Engineer and SQA Engineer at Media Scope IT Ltd. His engineering philosophy combines end-to-end development (Idea → Prompt → Build → Test → Fix → Deploy) with rigorous SQA testing and user-centric media design.
              </p>
              <p style={{ color: '#94A3B8', fontSize: '0.96rem', lineHeight: 1.7 }}>
                Beyond software development, he conducts 1-on-1 mentorship sessions, code reviews, manual/automated testing, and assists students in real-world project deployments at Dhanmondi campus.
              </p>
            </div>

            {/* Academic Education */}
            <div style={{ background: '#0F172A', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={20} color="#FFB703" /> Academic Education
              </h3>
              <div style={{ background: '#0B1120', padding: '18px 20px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '4px' }}>
                  B.Sc. in Computer Science & Engineering (CSE)
                </div>
                <div style={{ fontSize: '0.92rem', color: '#00B4D8', fontWeight: 700, marginBottom: '6px' }}>
                  Daffodil Institute of IT (DIIT)
                </div>
                <div style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
                  Final Year / 2026 Completion · Major in Software Engineering & AI Systems
                </div>
              </div>
            </div>

            {/* Technology & SQA Stack */}
            <div style={{ background: '#0F172A', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={20} color="#FF6B00" /> Technology & SQA Stack
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {TECH_CATEGORIES.map((catGroup, idx) => (
                  <div key={idx} style={{ background: '#0B1120', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.82rem', color: '#00B4D8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
                      {catGroup.category}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {catGroup.items.map((item, i) => (
                        <div key={i} style={{
                          background: 'rgba(0, 180, 216, 0.12)',
                          border: '1px solid rgba(0, 180, 216, 0.3)',
                          color: '#FFFFFF',
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <CheckCircle2 size={13} color="#00B4D8" /> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Projects Section */}
            <div style={{ background: '#0F172A', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="#00B4D8" /> Featured Engineering & SQA Projects
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {NOTABLE_PROJECTS.map((proj, idx) => (
                  <div key={idx} style={{
                    background: '#0B1120',
                    padding: '20px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '4px' }}>
                      {proj.title}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#FF6B00', fontWeight: 700, marginBottom: '10px' }}>
                      {proj.subtitle}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '14px' }}>
                      {proj.description}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {proj.tags.map((t, i) => (
                        <span key={i} style={{ background: 'rgba(0, 180, 216, 0.15)', color: '#00B4D8', fontSize: '0.78rem', fontWeight: 600, padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(0, 180, 216, 0.3)' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Credentials & Office Address */}
            <div style={{ background: '#0F172A', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} color="#FFB703" /> Direct Credentials & Office Address
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.94rem', color: '#CBD5E1', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={16} color="#00B4D8" />
                  <span>Hotline: <strong>+88 01714-691963</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} color="#00B4D8" />
                  <span>Email: <a href="mailto:info@mediascopeit.com" style={{ color: '#00B4D8', textDecoration: 'underline' }}>info@mediascopeit.com</a></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} color="#00B4D8" />
                  <span>Location: House-32, Road-02, Dhanmondi, Dhaka-1205, Bangladesh.</span>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('cert-verification')} 
                className="cert-verify-btn"
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                <Award size={16} /> Verify Certificate Online
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: 1-on-1 Mentorship Request Form */}
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
                Direct Mentorship Access
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '12px' }}>
                Book 1-on-1 Consultation
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Schedule a direct 1-on-1 mentorship session with Engr. Tanvir Hossain Khan for software architecture, code review, SQA, testing guidance, or project consultation.
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
                      <option value="Full-Stack Development & Career Guidance">Full-Stack Development & Career Guidance</option>
                      <option value="Software Architecture">Software Architecture</option>
                      <option value="SQA & Manual Testing">SQA & Manual Testing</option>
                      <option value="Automation Testing">Automation Testing</option>
                      <option value="Final Year Project Guidance">Final Year Project Guidance</option>
                      <option value="Code Review">Code Review</option>
                      <option value="AI Project Consultation">AI Project Consultation</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brief Note / Project Overview</label>
                    <textarea 
                      className="form-textarea"
                      rows="3"
                      placeholder="Write your topic or project details here..."
                      value={sessionForm.message}
                      onChange={e => setSessionForm({ ...sessionForm, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    <Send size={16} /> Submit Consultation Request
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
