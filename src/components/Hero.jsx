import React from 'react';
import { ArrowRight, Search, CheckCircle2, Award, Users, Code, ShieldCheck } from 'lucide-react';
import { COMPANY_STATS } from '../data/testimonialsData';

export default function Hero({ onOpenAdmission, onOpenQuote, searchQuery, setSearchQuery }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        {/* Left Copy Column */}
        <div>
          <div className="hero-badge">
            <Award size={16} /> #1 Top Ranked IT Training Institute & Software Firm in BD
          </div>
          
          <h1 className="hero-title">
            Empower Your Career with <span>Professional IT Skills</span> & Custom Software
          </h1>

          <p className="hero-subtitle">
            Media Scope IT Ltd has been providing quality IT training, Web Development, Mobile Apps, CRM, Payroll Software, and Digital Marketing solutions since 2011.
          </p>

          {/* Quick Course Search */}
          <div className="hero-search-box" style={{
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(10px)',
            padding: '6px 6px 6px 16px',
            borderRadius: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '30px',
            maxWidth: '520px',
            width: '100%',
            boxSizing: 'border-box',
            border: '1px solid var(--accent-cyan)'
          }}>
            <Search size={20} color="#00B4D8" style={{ flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Search courses e.g. Graphics Design, Web Dev, Python..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                flex: 1,
                minWidth: 0,
                width: '100%',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
            <a href="#courses" className="btn-primary" style={{ padding: '8px 18px', borderRadius: '30px', fontSize: '0.85rem', flexShrink: 0 }}>
              Explore
            </a>
          </div>

          <div className="hero-buttons">
            <button onClick={() => onOpenAdmission()} className="btn-primary">
              Enroll in Next Batch <ArrowRight size={18} />
            </button>
            <button onClick={onOpenQuote} className="btn-secondary">
              Request Software Quote
            </button>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats">
            {COMPANY_STATS.map((stat, i) => (
              <div key={i} className="stat-box">
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual Image Card with Fading Border & Bottom Gradient Blend */}
        <div className="hero-image-card">
          <div className="fading-border-cyan" style={{ boxShadow: '0 0 30px rgba(0, 180, 216, 0.2)' }}>
            <div className="fading-img-inner">
              <img 
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80" 
                alt="Media Scope IT Training Lab" 
              />
            </div>
          </div>

          {/* Floating Card 1 */}
          <div className="floating-card floating-card-1">
            <div className="fc-icon">
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF' }}>4,000+ Students</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Job Placed & Freelancing</div>
            </div>
          </div>

          {/* Floating Card 2 */}
          <div className="floating-card floating-card-2">
            <div className="fc-icon" style={{ background: 'rgba(0, 180, 216, 0.18)', color: '#00B4D8' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF' }}>RJSC Certified Firm</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>12+ Years Quality Trust</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
