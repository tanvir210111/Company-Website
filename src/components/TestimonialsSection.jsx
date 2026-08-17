import React from 'react';
import { TESTIMONIALS, CLIENT_LOGOS } from '../data/testimonialsData';
import { Star, ShieldCheck, CheckCircle2, Quote, Sparkles } from 'lucide-react';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="section" style={{ background: '#070A12' }}>
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#FF6B00" /> Success Stories & Student Career Growth
          </div>
          <h2 className="section-title">Our Graduate Reviews & Alumni Success</h2>
          <p className="section-desc">
            Over 4,000+ students have built high-paying IT software careers and freelancing portfolios through Media Scope IT Ltd.
          </p>
        </div>

        {/* ELEGANT 100% EQUAL HEIGHT STUDENT REVIEWS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {TESTIMONIALS.map(item => (
            <div 
              key={item.id} 
              style={{
                background: 'linear-gradient(145deg, #0F172A 0%, #161F33 100%)',
                borderRadius: '22px',
                padding: '28px 24px 22px 24px',
                border: '1px solid var(--border-light)',
                borderTop: `3px solid ${item.accentColor}`,
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
              className="course-card"
            >
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Top Bar: Star Rating & Quote Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(255, 183, 3, 0.12)',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 183, 3, 0.3)'
                  }}>
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#FFB703" color="#FFB703" />
                    ))}
                    <span style={{ fontSize: '0.78rem', color: '#FFB703', fontWeight: 800, marginLeft: '4px' }}>5.0</span>
                  </div>

                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: `${item.accentColor}18`,
                    border: `1px solid ${item.accentColor}`,
                    color: item.accentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    <Quote size={18} />
                  </div>
                </div>

                {/* Achievement Badge */}
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(7, 10, 18, 0.8)',
                  color: item.accentColor,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  border: `1px solid ${item.accentColor}50`,
                  marginBottom: '14px',
                  alignSelf: 'flex-start'
                }}>
                  {item.achievement}
                </div>

                {/* Student Quote - Fixed minHeight so all quotes take identical vertical space */}
                <p style={{ 
                  fontStyle: 'italic', 
                  fontSize: '0.9rem', 
                  color: '#E2E8F0', 
                  lineHeight: 1.65, 
                  marginBottom: '20px', 
                  minHeight: '84px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  "{item.quote}"
                </p>
              </div>

              {/* Student Profile Footer - Fixed height & single-line truncation for perfect horizontal alignment */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-light)',
                marginTop: 'auto',
                height: '68px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '48px',
                  height: '48px',
                  flexShrink: 0
                }}>
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: `2px solid ${item.accentColor}`,
                      boxShadow: `0 0 12px ${item.accentColor}40`
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    background: '#10B981',
                    color: '#070A12',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    border: '2px solid #0F172A'
                  }}>
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                </div>

                <div style={{ overflow: 'hidden', width: '100%' }}>
                  <div style={{ 
                    fontWeight: 800, 
                    fontSize: '0.94rem', 
                    color: '#FFFFFF', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {item.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.78rem', 
                    color: item.accentColor, 
                    fontWeight: 700, 
                    marginTop: '2px', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {item.course}
                  </div>
                  <div style={{ 
                    fontSize: '0.74rem', 
                    color: '#94A3B8', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {item.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Valued Corporate Clients Photo Showcase Grid */}
        <div style={{
          background: 'linear-gradient(180deg, #0B1120 0%, #0F172A 100%)',
          border: '1px solid var(--border-light)',
          borderRadius: '24px',
          padding: '44px 32px',
          color: 'white'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'inline-block', marginBottom: '6px' }}>
              Enterprise & Institutional Trust
            </span>
            <h3 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF' }}>
              Valued Corporate & Institutional Clients
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.96rem', maxWidth: '700px', margin: '6px auto 0 auto' }}>
              We engineer custom enterprise software solutions and deliver corporate training for leading government and private institutions.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {CLIENT_LOGOS.map((client, idx) => (
              <div 
                key={idx} 
                style={{
                  background: '#0F172A',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
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
                    height: '150px',
                    width: '100%',
                    overflow: 'hidden',
                    borderBottom: `2px solid ${client.color}`
                  }}>
                    <img 
                      src={client.image} 
                      alt={client.name} 
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
                      top: '12px',
                      left: '12px',
                      background: 'rgba(7, 10, 18, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${client.color}`,
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '12px'
                    }}>
                      {client.logoBadge}
                    </div>
                  </div>

                  <div style={{ padding: '20px 22px 14px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: client.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      {client.category}
                    </span>

                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3 }}>
                      {client.name}
                    </h4>
                  </div>
                </div>

                <div style={{ padding: '12px 22px 18px 22px', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
                    <CheckCircle2 size={14} /> Official Tech Partner
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
