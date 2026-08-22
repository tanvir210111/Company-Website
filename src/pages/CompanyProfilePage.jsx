import React, { useState } from 'react';
import { ShieldCheck, Award, Building, Target, CheckCircle2, ArrowLeft, GraduationCap, MapPin, Phone, Mail, Clock, Server, Monitor, Cpu, History, Check, Send, Sparkles, BookOpen, Users, Star } from 'lucide-react';

export default function CompanyProfilePage({ onNavigate, onOpenAdmission }) {
  const [visitFormData, setVisitFormData] = useState({ name: '', phone: '', preferredDate: '', courseInterest: 'Web Development' });
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  const handleVisitSubmit = (e) => {
    e.preventDefault();
    setVisitSubmitted(true);
    setTimeout(() => setVisitSubmitted(false), 5000);
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
            <Sparkles size={16} color="#00B4D8" /> Official Corporate Profile & Accreditations
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.2 }}>
            Media Scope IT Ltd — Company Profile & Credentials
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.08rem', maxWidth: '850px', lineHeight: 1.65 }}>
            Established in 2011, Media Scope IT Ltd (RJSC Reg: C-166968/2020) is a top-rated IT training course institute and custom enterprise software development firm based in Uttara, Dhaka, Bangladesh.
          </p>

          {/* Quick Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FF6B00' }}>2011</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Year Established</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00B4D8' }}>4,000+</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Skilled Graduates</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFB703' }}>500+</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Enterprise Clients</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981' }}>700+</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Successful Batches</div>
            </div>
          </div>
        </div>

        {/* Corporate History & Extended Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '40px', marginBottom: '60px', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>12+ Years Legacy</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', color: '#FFFFFF', marginTop: '6px' }}>
              Building IT Excellence & Future Tech Leaders in Bangladesh
            </h2>
            <p style={{ color: '#CBD5E1', lineHeight: 1.8, marginBottom: '16px', fontSize: '0.98rem' }}>
              Media Scope IT Ltd was incorporated with the primary mission of elevating technical literacy and providing market-ready software solutions in Bangladesh. Our institute offers specialized, practical training across Web Development, Graphic Design, Mobile App Development, Digital Marketing, and Computer Programming.
            </p>
            <p style={{ color: '#CBD5E1', lineHeight: 1.8, marginBottom: '24px', fontSize: '0.98rem' }}>
              Simultaneously, our enterprise software engineering division designs and deploys custom CRM, Payroll, POS, ERP, and diagnostic management applications for leading private corporations, retail chains, healthcare providers, and government institutions.
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 600 }}>
                <Check size={18} color="#10B981" /> 100% Hands-on Project Labs
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 600 }}>
                <Check size={18} color="#10B981" /> Lifetime Student Support
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#10B981', fontWeight: 600 }}>
                <Check size={18} color="#10B981" /> ISO Standard Lab Infrastructure
              </div>
            </div>
          </div>

          {/* Legal Registrations & Accreditation Card */}
          <div style={{
            background: '#0F172A',
            borderRadius: '20px',
            padding: '36px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '1.35rem', color: '#00B4D8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <ShieldCheck size={26} /> Government Registrations & Credentials
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.92rem' }}>
              <div style={{ background: '#070A12', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>RJSC Registration (Ministry of Commerce)</div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.98rem' }}>C-166968/2020 (Incorporated under Companies Act 1994)</strong>
              </div>

              <div style={{ background: '#070A12', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>City Corporation Trade License</div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.98rem' }}>TRAD/DSCC/048330/2020 (Dhaka South City Corporation)</strong>
              </div>

              <div style={{ background: '#070A12', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>Tax Identification Number (TIN)</div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.98rem' }}>125190932932</strong>
              </div>

              <div style={{ background: '#070A12', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>Business Identification Number (BIN / VAT)</div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.98rem' }}>003975158-0208</strong>
              </div>
            </div>
          </div>
        </div>

        {/* NEW FEATURE 1: Student Placement Statistics & Hiring Partners */}
        <div style={{ background: '#0F172A', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Career Outcomes</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>Student Placement Record & Hiring Network</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.96rem', maxWidth: '650px', margin: '8px auto 0 auto' }}>
              88% of our career-track graduates secure jobs or remote freelancing orders within 90 days of program completion.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: '#070A12', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>88%</div>
              <div style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 600 }}>90-Day Placement Rate</div>
            </div>
            <div style={{ background: '#070A12', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00B4D8' }}>$450+</div>
              <div style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 600 }}>Avg Freelancer Monthly Earning</div>
            </div>
            <div style={{ background: '#070A12', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFB703' }}>150+</div>
              <div style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 600 }}>Partner Hiring Companies</div>
            </div>
            <div style={{ background: '#070A12', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FF6B00' }}>1,200+</div>
              <div style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 600 }}>Upwork & Fiverr Level 2 Badges</div>
            </div>
          </div>

          {/* Hiring Partners Badge List */}
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
            <div style={{ fontSize: '0.88rem', color: '#94A3B8', fontWeight: 600, marginBottom: '14px' }}>
              Where Our Graduates Work:
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {["Brain Station 23", "Kaz Software", "Tigersheet", "Pathao BD", "Chaldal", "BDJobs Tech", "Genex Infosys", "Selise Digital"].map((company, idx) => (
                <span key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#E2E8F0',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid var(--border-light)'
                }}>
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Milestone Timeline Section */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Roadmap & Journey</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>Media Scope IT Growth Milestones</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '24px' }}>
            <div style={{ background: '#0F172A', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', borderTop: '4px solid #FF6B00' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FF6B00', marginBottom: '6px' }}>2011 - 2014</div>
              <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '8px' }}>Inception & Early Labs</h4>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>Started offering foundational C Programming, Graphic Design, and Web Design courses in Dhanmondi, Dhaka.</p>
            </div>

            <div style={{ background: '#0F172A', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', borderTop: '4px solid #00B4D8' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00B4D8', marginBottom: '6px' }}>2015 - 2019</div>
              <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '8px' }}>Software Engineering Division</h4>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>Launched commercial software division building CRM, POS, and Payroll solutions for Bangladeshi enterprise clients.</p>
            </div>

            <div style={{ background: '#0F172A', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', borderTop: '4px solid #FFB703' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFB703', marginBottom: '6px' }}>2020 - 2023</div>
              <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '8px' }}>RJSC Incorporation & Government Projects</h4>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>Incorporated under RJSC Bangladesh. Partnered with ICT Division & Bangladesh Air Force for specialized training.</p>
            </div>

            <div style={{ background: '#0F172A', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', borderTop: '4px solid #10B981' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginBottom: '6px' }}>2024 - Present</div>
              <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '8px' }}>AI, Cloud & Advanced Tech Division</h4>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>Expanded curriculum to Python AI/ML, Full Stack ReactJS, Flutter Apps, and enterprise Cloud Software architecture.</p>
            </div>
          </div>
        </div>

        {/* Infrastructure & Lab Facilities */}
        <div style={{ background: '#0B1120', padding: '36px 20px', borderRadius: '24px', border: '1px solid var(--border-light)', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '24px', textAlign: 'center' }}>
            State-of-the-Art Dhanmondi Campus Infrastructure
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '24px' }}>
            <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <Server size={28} color="#00B4D8" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>Gigabit Fiber Internet</h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>High-speed redundant dual fiber lines ensuring zero lag during live web servers and Zoom sessions.</p>
            </div>

            <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <Monitor size={28} color="#FF6B00" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>Dual-Monitor Workstations</h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Equipped with Intel Core i7 processors, SSD storage, and dual monitors for seamless coding & graphic design.</p>
            </div>

            <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <Cpu size={28} color="#FFB703" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>Full AC Classrooms</h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Comfortable, climate-controlled environments with multimedia HD projectors and digital smart boards.</p>
            </div>

            <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <Clock size={28} color="#10B981" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>24/7 Student Practice Lab</h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Open practice hours for enrolled students to practice outside regular class schedules under TA supervision.</p>
            </div>
          </div>
        </div>

        {/* NEW FEATURE 2: Interactive Campus Visit Booking Form */}
        <div style={{ background: '#0F172A', padding: '36px 20px', borderRadius: '24px', border: '1px solid var(--border-light)', marginBottom: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Schedule a Visit</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px', marginBottom: '16px' }}>
                Visit Our Uttara Campus & Talk to Advisors
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>
                We invite prospective students and parents to tour our computer labs, sit in a free trial class, and consult with our academic advisors.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#CBD5E1' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={18} color="#FF6B00" style={{ flexShrink: 0, marginTop: '3px' }} /> Address: House-05, Flat B-3, Road-03, Sector-15F, Uttara, Dhaka
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={18} color="#00B4D8" /> Hours: Sat–Thu (10am–8pm), Fri (3pm–8pm)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={18} color="#FFB703" /> Hotline: +88 01325-165451
                </div>
              </div>
            </div>

            <div style={{ background: '#070A12', padding: '30px', borderRadius: '18px', border: '1px solid var(--border-light)' }}>
              {visitSubmitted ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#10B981' }}>
                  <CheckCircle2 size={40} style={{ margin: '0 auto 10px auto' }} />
                  <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '6px' }}>Campus Tour Scheduled!</h4>
                  <p style={{ fontSize: '0.88rem', color: '#94A3B8' }}>Our coordinator will call {visitFormData.phone} to confirm your appointment.</p>
                </div>
              ) : (
                <form onSubmit={handleVisitSubmit}>
                  <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '16px' }}>Book Free Campus Tour</h3>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="Your name"
                      value={visitFormData.name}
                      onChange={e => setVisitFormData({ ...visitFormData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-input" 
                      placeholder="017XXXXXXXX"
                      value={visitFormData.phone}
                      onChange={e => setVisitFormData({ ...visitFormData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Date *</label>
                    <input 
                      type="date" 
                      required 
                      className="form-input"
                      value={visitFormData.preferredDate}
                      onChange={e => setVisitFormData({ ...visitFormData, preferredDate: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Send size={16} /> Confirm Tour Booking
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '50px 30px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>Transform Your Tech Skill Set With Us</h3>
          <p style={{ color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>Join over 4,000+ graduates who transformed their careers with Media Scope IT Ltd.</p>
          <button onClick={() => onOpenAdmission()} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <GraduationCap size={20} /> Enroll in Next Training Batch
          </button>
        </div>
      </div>
    </div>
  );
}
