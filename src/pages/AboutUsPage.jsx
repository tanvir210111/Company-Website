import React, { useState } from 'react';
import { ArrowLeft, Building, Users, Award, ShieldCheck, Quote, GraduationCap, ArrowRight, Sparkles, CheckCircle2, MapPin, Phone, BookOpen, Clock, HelpCircle, ChevronDown, ChevronUp, Server, Monitor, HeartHandshake, Target, Check, Layers, Cpu } from 'lucide-react';

export default function AboutUsPage({ onNavigate, onOpenAdmission }) {
  const [openFaq, setOpenFaq] = useState(null);

  const hubFaqs = [
    {
      q: "What sets Media Scope IT Ltd apart from other IT institutes in Bangladesh?",
      a: "Media Scope IT Ltd (RJSC Reg: C-166968/2020) is unique because we operate both a premier IT training institute and an active enterprise software development firm. Our students are taught by senior practicing software engineers working on real commercial projects, ensuring 100% practical, workplace-ready skill development."
    },
    {
      q: "How can I verify a student's certificate online?",
      a: "All official certificates issued by Media Scope IT Ltd come with a unique Certificate Verification ID (e.g. MS-2026-101). Anyone can verify student credentials anytime using our online Certificate Verification portal located on the homepage."
    },
    {
      q: "Can corporate organizations request customized IT training for their staff?",
      a: "Yes! We design tailored corporate IT bootcamps for government agencies, private conglomerates, banks, and retail enterprises. Past partners include Bangladesh Air Force, ICT Division, Dhaka Stock Exchange, Walton Hi-Tech, and Popular Diagnostic Center."
    },
    {
      q: "What support is provided after completing a training course?",
      a: "We provide lifetime access to our student helpdesk, 1-on-1 mentorship for Upwork/Fiverr freelancing order hunting, mock technical interview preparation, and job placement referrals across our network of 500+ corporate partners."
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
          padding: '55px 45px',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          marginBottom: '50px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#00B4D8" /> Welcome to Media Scope IT Ltd
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '18px', lineHeight: 1.15 }}>
            About Us — Who We Are, Our Legacy & Tech Mission
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.12rem', maxWidth: '900px', lineHeight: 1.7 }}>
            Media Scope IT Ltd is Bangladesh’s leading IT training course institute and custom enterprise software development company. Based in Dhanmondi, Dhaka, we have spent over 12+ years empowering students, engineering commercial software, and building global tech careers.
          </p>

          {/* Key Metric Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '20px', marginTop: '36px', paddingTop: '28px', borderTop: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FF6B00' }}>2011</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Founded in Dhaka, BD</div>
            </div>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#00B4D8' }}>4,000+</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Graduated Students</div>
            </div>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FFB703' }}>500+</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Enterprise Software Clients</div>
            </div>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#10B981' }}>88%</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>90-Day Placement Rate</div>
            </div>
          </div>
        </div>

        {/* 4 Main Sub-Page Exploration Cards with Equal Heights & Bottom Alignment */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Explore Dedicated Pages</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>Detailed Sub-Pages & Portals</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '28px' }}>
            {/* Card 1: Company Profile */}
            <div 
              onClick={() => onNavigate('company-profile')}
              style={{
                background: '#0F172A',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '100%'
              }}
              className="course-card"
            >
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{
                  position: 'relative',
                  height: '170px',
                  width: '100%',
                  overflow: 'hidden',
                  borderBottom: '2px solid #00B4D8'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" 
                    alt="Company Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                    }} 
                  />

                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(7, 10, 18, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #00B4D8',
                    color: '#00B4D8',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    <Building size={24} />
                  </div>
                </div>

                <div style={{ padding: '24px 28px 16px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.78rem', color: '#00B4D8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Corporate Overview
                  </span>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px', marginBottom: '10px' }}>
                    Company Profile
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px', minHeight: '52px' }}>
                    Explore our 12+ years history, government RJSC & trade license accreditations, and Dhanmondi campus lab facilities.
                  </p>
                </div>
              </div>

              <div style={{ padding: '16px 28px 24px 28px', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
                <div style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Explore Profile Page <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Card 2: Message From MD */}
            <div 
              onClick={() => onNavigate('md-message')}
              style={{
                background: '#0F172A',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '100%'
              }}
              className="course-card"
            >
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{
                  position: 'relative',
                  height: '170px',
                  width: '100%',
                  overflow: 'hidden',
                  borderBottom: '2px solid #FF6B00'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80" 
                    alt="Message From MD" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                    }} 
                  />

                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(7, 10, 18, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #FF6B00',
                    color: '#FF6B00',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    <Quote size={24} />
                  </div>
                </div>

                <div style={{ padding: '24px 28px 16px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.78rem', color: '#FF6B00', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Leadership Address
                  </span>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px', marginBottom: '10px' }}>
                    Message From MD
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px', minHeight: '52px' }}>
                    Read the formal statement from Engr. Tanvir Hossain Khan on quality IT education, youth empowerment, and software excellence.
                  </p>
                </div>
              </div>

              <div style={{ padding: '16px 28px 24px 28px', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
                <div style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Read MD Address <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Card 3: Team */}
            <div 
              onClick={() => onNavigate('team')}
              style={{
                background: '#0F172A',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '100%'
              }}
              className="course-card"
            >
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{
                  position: 'relative',
                  height: '170px',
                  width: '100%',
                  overflow: 'hidden',
                  borderBottom: '2px solid #FFB703'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
                    alt="Our Team" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                    }} 
                  />

                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(7, 10, 18, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #FFB703',
                    color: '#FFB703',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    <Users size={24} />
                  </div>
                </div>

                <div style={{ padding: '24px 28px 16px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.78rem', color: '#FFB703', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Instructors & Staff
                  </span>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px', marginBottom: '10px' }}>
                    Meet Our Team
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px', minHeight: '52px' }}>
                    Meet our 10+ senior software engineers, lead UI/UX design mentors, digital marketing directors, and lab staff.
                  </p>
                </div>
              </div>

              <div style={{ padding: '16px 28px 24px 28px', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
                <div style={{ color: '#FFB703', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  View Team Members <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Card 4: Our Clients */}
            <div 
              onClick={() => onNavigate('our-clients')}
              style={{
                background: '#0F172A',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '100%'
              }}
              className="course-card"
            >
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{
                  position: 'relative',
                  height: '170px',
                  width: '100%',
                  overflow: 'hidden',
                  borderBottom: '2px solid #10B981'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80" 
                    alt="Our Clients" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                    }} 
                  />

                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(7, 10, 18, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #10B981',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    <Award size={24} />
                  </div>
                </div>

                <div style={{ padding: '24px 28px 16px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Enterprise Partners
                  </span>

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px', marginBottom: '10px' }}>
                    Our Corporate Clients
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px', minHeight: '52px' }}>
                    Explore case studies with Bangladesh Air Force, ICT Division, Dhaka Stock Exchange, Walton, and Popular Diagnostic.
                  </p>
                </div>
              </div>

              <div style={{ padding: '16px 28px 24px 28px', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
                <div style={{ color: '#10B981', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  View Clients & Portfolio <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED TEXT SECTION 1: Detailed Corporate Background & Philosophy */}
        <div style={{ background: '#0F172A', padding: '44px 36px', borderRadius: '24px', border: '1px solid var(--border-light)', marginBottom: '60px' }}>
          <div className="grid-about-container">
            <div>
              <span style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Deep Dive</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px', marginBottom: '18px' }}>
                Bridging the Gap Between University Theory & Commercial Software Engineering
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '0.98rem', lineHeight: 1.85, marginBottom: '16px' }}>
                Founded in 2011 in Dhanmondi, Dhaka, Media Scope IT Ltd was born out of a critical observation: traditional computer science degrees and short online crash courses frequently leave students unprepared for modern workplace demands. Employers require developers who can write clean git commits, build scalable APIs, handle production database migrations, and design intuitive UX interfaces.
              </p>
              <p style={{ color: '#CBD5E1', fontSize: '0.98rem', lineHeight: 1.85, marginBottom: '24px' }}>
                To solve this challenge, Media Scope IT Ltd instituted a unique dual-operating framework. We run an active commercial software engineering consultancy alongside our educational institute. Our course curricula are continuously refined based on the real software projects we engineer for our 500+ corporate clients across Bangladesh.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button onClick={() => onNavigate('company-profile')} className="btn-primary" style={{ fontSize: '0.9rem' }}>
                  Read Full Company Profile <ArrowRight size={16} />
                </button>
                <button onClick={() => onNavigate('md-message')} className="btn-secondary" style={{ fontSize: '0.9rem' }}>
                  Read MD Address
                </button>
              </div>
            </div>

            {/* Legal Badges Showcase Box */}
            <div style={{ background: '#070A12', padding: '30px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FF6B00', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={22} color="#FF6B00" /> Fully Accredited & Verified Firm
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
                Operating with 100% legal compliance under the Ministry of Commerce and Dhaka South City Corporation.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#0F172A', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <span style={{ color: '#94A3B8' }}>RJSC Registration:</span>
                  <strong style={{ color: '#00B4D8' }}>C-166968/2020</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#0F172A', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <span style={{ color: '#94A3B8' }}>Trade License:</span>
                  <strong style={{ color: '#00B4D8' }}>TRAD/DSCC/048330/2020</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#0F172A', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <span style={{ color: '#94A3B8' }}>TIN Number:</span>
                  <strong style={{ color: '#00B4D8' }}>125190932932</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#0F172A', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <span style={{ color: '#94A3B8' }}>BIN / VAT:</span>
                  <strong style={{ color: '#00B4D8' }}>003975158-0208</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '50px 30px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>Ready to Start Your Career?</h3>
          <p style={{ color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>Join over 4,000+ graduates at Media Scope IT Ltd.</p>
          <button onClick={() => onOpenAdmission()} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <GraduationCap size={20} /> Enroll in Training Course
          </button>
        </div>
      </div>
    </div>
  );
}
