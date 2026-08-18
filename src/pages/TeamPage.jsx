import React, { useState } from 'react';
import { ArrowLeft, Mail, Code, Palette, Megaphone, Terminal, Users, GraduationCap, Briefcase, Award, CheckCircle, Send, CheckCircle2, Calendar, Clock, Sparkles } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Engr. Tanvir Hossain Khan",
    role: "Senior Software Developer",
    category: "Software Development",
    bio: "3+ years of hands-on experience in full-stack web development, software engineering architecture, and technical mentorship.",
    avatar: "/Team/Tanvir Hossain Khan.jpg",
    skills: ["Full-Stack Engineering", "Software Architecture", "Web Development"],
    experience: "3+ Years Exp",
    linkedin: "https://www.linkedin.com/in/tanvir-khan-90122a30b"
  },
  {
    id: 2,
    name: "Md. Rahat Chowdhury",
    role: "Head of Software Engineering & Lead Trainer",
    category: "Software Development",
    bio: "Senior Full Stack Engineer specializing in ReactJS, Node.js, Python Django, and Laravel frameworks. Mentored 1,500+ developers in BD.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    skills: ["ReactJS", "Python Django", "Laravel", "System Architecture"],
    experience: "9+ Years Exp"
  },
  {
    id: 3,
    name: "Mohammad Saniyat Zaman Khan",
    role: "Lead UI/UX & Graphics Design Instructor",
    category: "Creative Media",
    bio: "Award-winning designer with 7+ years of experience training students in Figma, Adobe Illustrator, Photoshop, AutoCAD, and UI Research.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    skills: ["Figma", "Adobe Illustrator", "Photoshop", "UI/UX Research"],
    experience: "7+ Years Exp"
  },
  {
    id: 4,
    name: "Sharmin Sultana",
    role: "Director of Digital Marketing & SEO Services",
    category: "Creative Media",
    bio: "Certified Google & Meta Ads Specialist. Has managed 200+ high-ROI growth campaigns for local and international e-commerce clients.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    skills: ["Advanced SEO", "Facebook Ads", "Google Ads", "Content Strategy"],
    experience: "8+ Years Exp"
  },
  {
    id: 5,
    name: "Tanzin Anik Kabir",
    role: "Senior Mobile & Full-Stack Developer",
    category: "Software Development",
    bio: "Mobile app engineering expert specializing in Flutter, React Native, and ASP.NET Core microservice backend architectures.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    skills: ["Flutter Apps", "ASP.NET Core", "REST APIs", "SQL Server"],
    experience: "6+ Years Exp"
  },
  {
    id: 6,
    name: "Kazi Mahmudul Hasan",
    role: "Senior Python & Data Science Instructor",
    category: "Software Development",
    bio: "Data Scientist & Python mentor. Teaches C, C++, Data Structures, Algorithms, and Machine Learning fundamentals.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    skills: ["Python ML", "C & C++", "Data Structures", "PostgreSQL"],
    experience: "6+ Years Exp"
  },
  {
    id: 7,
    name: "Farhana Akter",
    role: "Lead WordPress & E-Commerce Web Trainer",
    category: "Software Development",
    bio: "WordPress theme developer and WooCommerce specialist. Mentored 800+ freelancing students on Fiverr and Upwork.",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
    skills: ["WordPress", "WooCommerce", "Elementor Pro", "Fiverr freelancing"],
    experience: "5+ Years Exp"
  },
  {
    id: 8,
    name: "Sabrina Ahmed",
    role: "Lead UI Research & Design Specialist",
    category: "Creative Media",
    bio: "Specializes in mobile design systems, accessibility standards, interactive wireframing, and design sprint facilitation.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    skills: ["Design Systems", "Figma Components", "User Testing", "Prototypes"],
    experience: "5+ Years Exp"
  },
  {
    id: 9,
    name: "Mehedi Hasan",
    role: "Cloud DevOps & Network Lab Specialist",
    category: "IT Department",
    bio: "AWS & Docker engineer managing Media Scope IT server infrastructure and lab Linux deployment environments.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    skills: ["Docker", "Linux Admin", "AWS Cloud", "CI/CD Pipelines"],
    experience: "6+ Years Exp"
  },
  {
    id: 10,
    name: "Nusrat Jahan",
    role: "Academic Coordinator & Student Placement Lead",
    category: "IT Department",
    bio: "Coordinates Dhanmondi lab ops, batch schedules, certificate verification, and job interview placement referrals.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    skills: ["Student Counseling", "Job Placement", "Lab Operations"],
    experience: "5+ Years Exp"
  }
];

export default function TeamPage({ onNavigate, onOpenAdmission }) {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [bookingMember, setBookingMember] = useState(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookForm, setBookForm] = useState({ name: '', phone: '', topic: 'Career Guidance' });

  const filteredMembers = selectedFilter === "All" 
    ? TEAM_MEMBERS 
    : TEAM_MEMBERS.filter(m => m.category === selectedFilter);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setBookingMember(null);
    }, 4000);
  };

  return (
    <div style={{ background: '#070A12', color: 'white', minHeight: '100vh', padding: '50px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => onNavigate('home')} 
          className="btn-outline" 
          style={{ marginBottom: '30px', fontSize: '0.88rem' }}
        >
          <ArrowLeft size={16} /> Back to Homepage
        </button>

        {/* Page Banner Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          padding: '50px 40px',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          marginBottom: '50px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#00B4D8" /> Our Engineering Mentors & Staff
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.15 }}>
            Meet the Media Scope IT Team
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '850px', lineHeight: 1.6 }}>
            Our passionate team of experienced software engineers, creative media mentors, and IT infrastructure specialists.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          {["All", "Software Development", "Creative Media", "IT Department"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`tab-btn ${selectedFilter === cat ? 'active' : ''}`}
              style={{ padding: '8px 20px', fontSize: '0.88rem' }}
            >
              {cat === "All" ? "All Members" : cat}
            </button>
          ))}
        </div>

        {/* Team Members Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px', marginBottom: '60px' }}>
          {filteredMembers.map(member => (
            <div key={member.id} style={{
              background: '#0F172A',
              borderRadius: '22px',
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Avatar Box with Fading Gradient Accent Border */}
              <div style={{
                position: 'relative',
                height: '240px',
                overflow: 'hidden',
                borderBottom: '2px solid #00B4D8'
              }}>
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                  }} 
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(7, 10, 18, 0.9)',
                  border: '1px solid #00B4D8',
                  color: '#00B4D8',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backdropFilter: 'blur(6px)'
                }}>
                  {member.experience}
                </span>
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
                  {member.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#FF6B00', fontWeight: 700, marginBottom: '12px' }}>
                  {member.role}
                </div>

                <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '20px', flex: 1, lineHeight: 1.6 }}>
                  {member.bio}
                </p>

                {/* Skill Badges */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                  {member.skills.map((skill, idx) => (
                    <span key={idx} style={{
                      background: 'rgba(0, 180, 216, 0.12)',
                      color: '#00B4D8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-light)'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {member.linkedin ? (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ fontSize: '0.82rem', color: '#00B4D8', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      LinkedIn Profile →
                    </a>
                  ) : <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Senior Instructor</span>}

                  {member.id === 1 ? (
                    <button 
                      onClick={() => onNavigate('senior-software-developer-tanvir-hossain-khan')}
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.82rem', gap: '4px' }}
                    >
                      View Details →
                    </button>
                  ) : (
                    <button 
                      onClick={() => setBookingMember(member)}
                      className="btn-outline"
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                    >
                      Book Mentorship
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NEW FEATURE: Mentor Booking Modal */}
        {bookingMember && (
          <div className="modal-overlay" onClick={() => setBookingMember(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
              <button className="modal-close" onClick={() => setBookingMember(null)}>✕</button>

              {bookingSubmitted ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#10B981' }}>
                  <CheckCircle2 size={44} style={{ margin: '0 auto 12px auto' }} />
                  <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '6px' }}>Mentorship Session Requested!</h3>
                  <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Our coordinator will arrange a 1-on-1 consultation session with <strong>{bookingMember.name}</strong> for you.</p>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <img src={bookingMember.avatar} alt={bookingMember.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00B4D8' }} />
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800 }}>Book 1-on-1 Session</h3>
                      <div style={{ fontSize: '0.82rem', color: '#FF6B00', fontWeight: 700 }}>{bookingMember.name} ({bookingMember.role})</div>
                    </div>
                  </div>

                  <form onSubmit={handleBookingSubmit}>
                    <div className="form-group">
                      <label className="form-label">Student Name *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        placeholder="Your full name"
                        value={bookForm.name}
                        onChange={e => setBookForm({ ...bookForm, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input 
                        type="tel" 
                        required 
                        className="form-input" 
                        placeholder="017XXXXXXXX"
                        value={bookForm.phone}
                        onChange={e => setBookForm({ ...bookForm, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Discussion Topic *</label>
                      <select 
                        className="form-select"
                        value={bookForm.topic}
                        onChange={e => setBookForm({ ...bookForm, topic: e.target.value })}
                      >
                        <option value="Course Choice Guidance">Course Choice & Career Roadmap</option>
                        <option value="Freelancing Account Audit">Fiverr/Upwork Freelancing Guidance</option>
                        <option value="Code Review">Code Review & Technical Project Guidance</option>
                      </select>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      <Send size={16} /> Request Free 1-on-1 Session
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Culture & Mentorship Guarantee Banner */}
        <div style={{ background: '#0B1120', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <Award size={36} color="#FF6B00" style={{ marginBottom: '10px' }} />
            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>
              Direct Mentorship & 1-on-1 Code Reviews
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '24px' }}>
              Unlike mass online tutorials, Media Scope IT mentors work individually with every student. Whether you encounter a bug during React deployment or need portfolio design advice, our senior engineering team is present in the lab.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '50px 30px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>Learn Directly From Senior Engineers</h3>
          <p style={{ color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>Reserve your seat in our upcoming batch at Dhanmondi campus or online.</p>
          <button onClick={() => onOpenAdmission()} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <GraduationCap size={20} /> Enroll in Training Course
          </button>
        </div>
      </div>
    </div>
  );
}
