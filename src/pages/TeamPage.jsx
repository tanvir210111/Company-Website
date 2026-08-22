import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Code, Palette, Megaphone, Terminal, Users, GraduationCap, Briefcase, Award, CheckCircle, Send, CheckCircle2, Calendar, Clock, Sparkles } from 'lucide-react';

const TEAM_MEMBERS_DEFAULT = [
  {
    id: 1,
    name: "Engr. Tanvir Hossain Khan",
    role: "Software Engineer",
    category: "Software Development",
    bio: "3+ years of hands-on experience in full-stack web development, software engineering architecture, SQA testing, and technical mentorship.",
    avatar: "/Team/Tanvir Hossain Khan.jpg",
    skills: ["Software Engineering", "SQA & Automation", "Full-Stack Development"],
    experience: "3+ Years Exp",
    linkedin: "https://www.linkedin.com/in/tanvir-khan-90122a30b",
    github: "https://github.com/tanvir210111"
  },
  {
    id: 2,
    name: "Nashimul Hasan Nibir",
    role: "Video Editor",
    category: "Creative Media",
    bio: "Creative Video Editor specializing in high-quality video production, motion graphics, and visual content strategy.",
    avatar: "/Team/Nashimul Hasan Nibir.jpg",
    skills: ["Video Editing", "Motion Graphics", "Content Production"],
    experience: "Senior Specialist"
  },
  {
    id: 3,
    name: "MD NAIMUR RAHMAN NAIM",
    role: "Sr. Social Media Marketer",
    category: "IT Department",
    bio: "Senior Social Media Marketer specializing in digital growth campaigns, Meta & Google Ads management, and audience analytics.",
    avatar: "/Team/MD NAIMUR RAHMAN NAIM.jpg",
    skills: ["Social Media Marketing", "Meta Ads", "Digital Campaigns"],
    experience: "Sr. Marketer"
  },
  {
    id: 4,
    name: "Fahim Hasan Jidan",
    role: "Jr. Social Media Marketer",
    category: "IT Department",
    bio: "Junior Social Media Marketer focusing on social content engagement, audience interaction, and brand promotion.",
    avatar: "/Team/Fahim Hasan Jidan.jpg",
    skills: ["Social Media Ops", "Content Engagement", "Brand Growth"],
    experience: "Jr. Marketer"
  },
  {
    id: 5,
    name: "Hridoy Hasan",
    role: "Jr. Social Media Marketer",
    category: "IT Department",
    bio: "Junior Social Media Marketer assisting with digital marketing campaigns, social media management, and online operations.",
    avatar: "/Team/Hridoy Hasan.jpg",
    skills: ["Digital Marketing", "Social Media", "Campaign Ops"],
    experience: "Jr. Marketer"
  }
];

export default function TeamPage({ onNavigate, onOpenAdmission }) {
  const [teamMembersList, setTeamMembersList] = useState(TEAM_MEMBERS_DEFAULT);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [bookingMember, setBookingMember] = useState(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookForm, setBookForm] = useState({ name: '', phone: '', topic: 'Career Guidance' });

  useEffect(() => {
    let isMounted = true;
    const fetchPublicTeam = async () => {
      try {
        const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const res = await fetch(`${backendUrl}/api/public/team`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.team) && data.team.length > 0) {
          const normalizedTeam = data.team.map(m => ({
            ...m,
            avatar: m.avatar || m.photo_url || '/Team/Tanvir Hossain Khan.jpg',
            role: m.role || m.designation || 'Team Member',
            category: m.category || m.department || 'IT Department',
            experience: m.experience || 'Senior Specialist',
            bio: m.bio || 'Media Scope IT experienced professional and mentor.',
            skills: Array.isArray(m.skills) 
              ? m.skills 
              : (m.skills ? String(m.skills).split(',').map(s => s.trim()) : [m.role || m.designation || 'IT Specialist'])
          }));
          setTeamMembersList(normalizedTeam);
        }
      } catch (err) {
        console.log('Using static team fallback:', err);
      }
    };

    fetchPublicTeam();
    return () => { isMounted = false; };
  }, []);

  const filteredMembers = selectedFilter === "All" 
    ? teamMembersList 
    : teamMembersList.filter(m => (m.category || m.department) === selectedFilter);

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
          padding: '40px 24px',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#00B4D8" /> Our Engineering Mentors & Staff
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.2 }}>
            Meet the Media Scope IT Team
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.08rem', maxWidth: '850px', lineHeight: 1.65 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '28px', marginBottom: '60px' }}>
          {filteredMembers.map(member => {
            const memberSkills = Array.isArray(member.skills) 
              ? member.skills 
              : (member.skills ? String(member.skills).split(',').map(s => s.trim()) : [member.role || member.designation || 'IT Specialist']);
            const avatarSrc = member.avatar || member.photo_url || '/Team/Tanvir Hossain Khan.jpg';
            const displayRole = member.role || member.designation || 'Team Member';
            const expBadge = member.experience || 'Senior Specialist';

            return (
              <div key={member.id} style={{
                background: '#0F172A',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Avatar Box */}
                <div style={{
                  position: 'relative',
                  height: '240px',
                  overflow: 'hidden',
                  background: '#0B1120',
                  borderBottom: '2px solid #00B4D8'
                }}>
                  <img 
                    src={avatarSrc} 
                    alt={member.name || 'Team Member'} 
                    onError={(e) => { e.currentTarget.src = '/Team/Tanvir Hossain Khan.jpg'; }}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
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
                    {expBadge}
                  </span>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
                    {member.name}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#FF6B00', fontWeight: 700, marginBottom: '12px' }}>
                    {displayRole}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '20px', flex: 1, lineHeight: 1.6 }}>
                    {member.bio || 'Media Scope IT experienced professional and mentor.'}
                  </p>

                  {/* Skill Badges */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                    {memberSkills.map((skill, idx) => (
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
                    {member.linkedin || member.linkedin_url ? (
                      <a 
                        href={member.linkedin || member.linkedin_url} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ fontSize: '0.82rem', color: '#00B4D8', fontWeight: 700, textDecoration: 'underline' }}
                      >
                        LinkedIn Profile →
                      </a>
                    ) : <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Senior Instructor</span>}

                    <button 
                      onClick={() => {
                        const slugs = {
                          1: 'senior-software-developer-tanvir-hossain-khan',
                          2: 'video-editor-nashimul-hasan-nibir',
                          3: 'sr-social-media-marketer-naimur-rahman-naim',
                          4: 'jr-social-media-marketer-fahim-hasan-jidan',
                          5: 'jr-social-media-marketer-hridoy-hasan'
                        };
                        onNavigate(slugs[member.id] || 'team');
                      }}
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.82rem', gap: '4px' }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
