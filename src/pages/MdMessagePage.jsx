import React, { useState } from 'react';
import { ArrowLeft, Quote, Mail, Phone, Award, GraduationCap, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, ShieldCheck, HeartHandshake, Send, Check, Sparkles, MessageSquare, Video, Code, FileText, Globe, Monitor, Shield } from 'lucide-react';

export default function MdMessagePage({ onNavigate, onOpenAdmission }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [inquiryData, setInquiryData] = useState({ name: '', phone: '', email: '', question: '' });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const faqs = [
    {
      q: "What inspired the founding of Media Scope IT Ltd?",
      a: "Having worked in technology for over 15 years, I observed a significant disconnect between traditional academic computer science theory and practical software industry expectations in Bangladesh. Media Scope IT Ltd was established to offer intensive, 100% project-driven training where students build real-world products."
    },
    {
      q: "How does Media Scope IT support students after course completion?",
      a: "Our relationship with students does not end on graduation day. We provide lifetime access to our student support portal, direct order-hunting mentorship for Upwork/Fiverr freelancers, and job interview referrals through our 500+ corporate client network."
    },
    {
      q: "What is your approach to enterprise software development?",
      a: "We follow strict Agile software engineering methodologies, ISO quality standards, and rigorous security testing. Whether it is a CRM, POS, or diagnostic center management system, we build software designed for long-term scalability and 99.9% uptime."
    }
  ];

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => setInquirySubmitted(false), 5000);
  };

  const guarantees = [
    {
      num: "01",
      title: "100% Live Interactive Mentorship",
      desc: "No pre-recorded static videos. Every session is taught live by workplace engineers with real-time Q&A and instant lab code reviews.",
      icon: Video,
      color: "#FF6B00",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
    },
    {
      num: "02",
      title: "Live Production Client Projects",
      desc: "Students work directly on production-grade client codebases to build a stand-out GitHub repository and Figma design portfolio.",
      icon: Code,
      color: "#00B4D8",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
    },
    {
      num: "03",
      title: "CV & 1-on-1 Mock Interviews",
      desc: "Senior HR experts review student resumes, optimize LinkedIn profiles, and conduct 1-on-1 mock technical interviews.",
      icon: FileText,
      color: "#FFB703",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
    },
    {
      num: "04",
      title: "Freelancing & Remote Order Hunting",
      desc: "Dedicated order-hunting mentorship for Upwork, Fiverr gigs, client bidding strategy, and Payoneer global payment setups.",
      icon: Globe,
      color: "#10B981",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
    },
    {
      num: "05",
      title: "24/7 Dhanmondi Campus Lab Access",
      desc: "Graduates enjoy open access to our Dhanmondi high-speed Core i7 computer labs anytime for ongoing freelancing or project work.",
      icon: Monitor,
      color: "#00B4D8",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
    },
    {
      num: "06",
      title: "100% Verified Digital Credentials",
      desc: "Every graduate receives an official certificate with a unique online verification ID searchable by international employers.",
      icon: Shield,
      color: "#FF6B00",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
    }
  ];

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
          <div style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#FF6B00" /> Leadership Address & Philosophy
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.15 }}>
            Message From Managing Director
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '850px', lineHeight: 1.6 }}>
            A formal statement on educational quality, technological empowerment, and building global IT engineering careers from Bangladesh.
          </p>
        </div>

        {/* Main Profile & Detailed Letter Grid */}
        <div className="grid-message-container">
          {/* MD Profile Card */}
          <div style={{
            background: '#0F172A',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid var(--border-light)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '100px'
          }}>
            <div style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 24px auto',
              border: '3px solid #00B4D8',
              boxShadow: '0 0 30px rgba(0, 180, 216, 0.35)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" 
                alt="Managing Director - Media Scope IT Ltd" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
              Engr. Tanvir Hossain Khan
            </h3>
            <div style={{ fontSize: '0.9rem', color: '#00B4D8', fontWeight: 700, marginBottom: '16px' }}>
              Managing Director & Chief Tech Strategist
            </div>

            <div style={{ fontSize: '0.85rem', color: '#94A3B8', borderTop: '1px solid var(--border-light)', paddingTop: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div><strong>Organization:</strong> Media Scope IT Ltd</div>
              <div><strong>Industry Experience:</strong> 15+ Years in Software & IT</div>
              <div><strong>Academic Background:</strong> B.Sc. in Computer Engineering</div>
              <div><strong>Corporate Advisory:</strong> 500+ Implemented Systems</div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <a 
                href="https://www.linkedin.com/in/tanvir-khan-90122a30b" 
                target="_blank" 
                rel="noreferrer"
                className="btn-outline"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>

          {/* Extended Formal Message */}
          <div style={{
            background: '#0F172A',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <Quote size={48} color="#FF6B00" style={{ marginBottom: '16px', opacity: 0.8 }} />

            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '24px', lineHeight: 1.3 }}>
              "Quality is our unyielding commitment. We cultivate technical minds, architect careers, and engineer software solutions that power businesses across Bangladesh and beyond."
            </h2>

            <div style={{ color: '#CBD5E1', fontSize: '1rem', lineHeight: 1.85, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p>
                <strong>Dear Students, Partners, and Well-wishers,</strong>
              </p>

              <p>
                Welcome to Media Scope IT Ltd. Since our inception in 2011, our founding mission has remained steadfast: to empower the talented youth and working professionals of Bangladesh with real-world, high-demand technology skills that stand out on global job platforms and freelancing marketplaces.
              </p>

              <p>
                The global digital economy is undergoing a massive transformation. Rapid advancements in Full Stack Web Development, Artificial Intelligence, Mobile Applications, UX/UI Design, and Digital Marketing mean that static textbook knowledge is no longer sufficient. Industry success requires hands-on lab practice, algorithmic problem solving, and building production-ready code.
              </p>

              <p>
                At Media Scope IT Ltd, we have structured our Dhanmondi campus and online learning portals to reflect exact workplace environments. Every single course module is taught by practicing senior software engineers and certified industry professionals.
              </p>

              <p>
                To our corporate software clients: we approach software development with the same relentless pursuit of quality. Whether crafting custom CRM systems, hospital diagnostic software, multi-branch POS setups, or digital marketing growth funnels, we design systems that deliver security, performance, and measurable ROI.
              </p>

              <p>
                I invite you to visit our campus, meet our senior instructors, and take the first step toward transforming your career or business.
              </p>

              <div style={{ fontStyle: 'italic', color: '#00B4D8', fontWeight: 700, marginTop: '10px' }}>
                Warm regards, <br />
                Engr. Tanvir Hossain Khan <br />
                Managing Director, Media Scope IT Ltd
              </div>
            </div>
          </div>
        </div>

        {/* REDESIGN WITH COVER IMAGES: MD's 6 Quality Guarantees Grid */}
        <div style={{
          background: 'linear-gradient(180deg, #0B1120 0%, #0F172A 100%)',
          padding: '50px 40px',
          borderRadius: '28px',
          border: '1px solid var(--border-light)',
          marginBottom: '60px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'inline-block', marginBottom: '8px' }}>
              Quality Assurance Pledge
            </span>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#FFFFFF' }}>
              Managing Director's 6 Quality Guarantees
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '650px', margin: '8px auto 0 auto' }}>
              Every enrolled student at Media Scope IT Ltd receives our unyielding organizational commitment to technical excellence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {guarantees.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={idx}
                  style={{
                    background: 'linear-gradient(145deg, #0F172A 0%, #161F33 100%)',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-light)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    height: '100%'
                  }}
                  className="course-card"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Related Cover Photo Header with Fading Mask */}
                    <div style={{
                      position: 'relative',
                      height: '170px',
                      width: '100%',
                      overflow: 'hidden',
                      borderBottom: `2px solid ${item.color}`
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                        }} 
                      />

                      {/* Icon Circle Overlay */}
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        background: 'rgba(7, 10, 18, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${item.color}`,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center'
                      }}>
                        <IconComp size={24} />
                      </div>

                      {/* Number Badge Overlay */}
                      <span style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        fontSize: '1rem',
                        fontWeight: 900,
                        color: item.color,
                        background: 'rgba(7, 10, 18, 0.85)',
                        backdropFilter: 'blur(8px)',
                        padding: '4px 14px',
                        borderRadius: '20px',
                        border: '1px solid var(--border-light)'
                      }}>
                        {item.num}
                      </span>
                    </div>

                    <div style={{ padding: '24px 28px 16px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px', lineHeight: 1.3 }}>
                        {item.title}
                      </h3>

                      <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.75 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '16px 28px 24px 28px', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: item.color, fontWeight: 700 }}>
                      <CheckCircle2 size={16} /> Guaranteed by MD Office
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive FAQ Section from MD's Desk */}
        <div style={{ background: '#0B1120', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <HelpCircle size={32} color="#00B4D8" style={{ marginBottom: '8px' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>Questions From MD’s Desk</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                style={{
                  background: '#0F172A',
                  borderRadius: '14px',
                  border: '1px solid var(--border-light)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '1.02rem',
                    fontWeight: 700,
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} color="#00B4D8" /> : <ChevronDown size={18} color="#94A3B8" />}
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '0 24px 20px 24px', color: '#CBD5E1', fontSize: '0.94rem', lineHeight: 1.7, borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Direct Inquiry to MD's Office Form */}
        <div style={{ background: '#0F172A', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', marginBottom: '60px' }}>
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <MessageSquare size={32} color="#FF6B00" style={{ marginBottom: '8px' }} />
              <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800 }}>Ask a Direct Question to MD's Desk</h2>
              <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>Have a question regarding corporate training partnerships or institute policy? Send a message directly.</p>
            </div>

            {inquirySubmitted ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', padding: '20px', borderRadius: '14px', textAlign: 'center' }}>
                <CheckCircle2 size={36} style={{ margin: '0 auto 10px auto' }} />
                <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '6px' }}>Inquiry Forwarded to MD Office</h4>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8' }}>Our executive secretary will get back to {inquiryData.phone} shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit}>
                <div className="grid-2col-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input"
                      placeholder="Your name"
                      value={inquiryData.name}
                      onChange={e => setInquiryData({ ...inquiryData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-input"
                      placeholder="017XXXXXXXX"
                      value={inquiryData.phone}
                      onChange={e => setInquiryData({ ...inquiryData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Question / Message *</label>
                  <textarea 
                    rows={4} 
                    required 
                    className="form-textarea"
                    placeholder="Write your inquiry for Engr. Tanvir Hossain Khan..."
                    value={inquiryData.question}
                    onChange={e => setInquiryData({ ...inquiryData, question: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={18} /> Submit Direct Inquiry
                </button>
              </form>
            )}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '50px 30px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>Book an Office Meeting With Our Management</h3>
          <p style={{ color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>Visit our Dhanmondi campus or schedule a virtual consultation with Engr. Tanvir Hossain Khan.</p>
          <button onClick={() => onOpenAdmission()} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <GraduationCap size={20} /> Schedule Campus Visit / Admission
          </button>
        </div>
      </div>
    </div>
  );
}
