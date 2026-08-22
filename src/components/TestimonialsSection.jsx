import React, { useState, useEffect } from 'react';
import { TESTIMONIALS, CLIENT_LOGOS } from '../data/testimonialsData';
import { Star, ShieldCheck, CheckCircle2, Quote, Sparkles } from 'lucide-react';

export default function TestimonialsSection() {
  const [testimonialsList, setTestimonialsList] = useState(TESTIMONIALS);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicTestimonials = async () => {
      try {
        const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const res = await fetch(`${backendUrl}/api/public/testimonials`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setTestimonialsList(data.testimonials);
        }
      } catch (err) {
        console.log('Using static testimonials fallback:', err);
      }
    };

    fetchPublicTestimonials();
    return () => { isMounted = false; };
  }, []);

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))', gap: '24px', marginBottom: '60px' }}>
          {testimonialsList.map(item => {
            const accent = item.accentColor || '#00B4D8';
            return (
              <div 
                key={item.id} 
                style={{
                  background: 'linear-gradient(145deg, #0F172A 0%, #161F33 100%)',
                  borderRadius: '22px',
                  padding: '28px 24px 22px 24px',
                  border: '1px solid var(--border-light)',
                  borderTop: `3px solid ${accent}`,
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
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
                      {[...Array(Math.max(1, Math.round(item.rating || 5)))].map((_, i) => (
                        <Star key={i} size={14} fill="#FFB703" color="#FFB703" />
                      ))}
                      <span style={{ fontSize: '0.78rem', color: '#FFB703', fontWeight: 800, marginLeft: '4px' }}>
                        {(item.rating || 5.0).toFixed(1)}
                      </span>
                    </div>

                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: `${accent}18`,
                      border: `1px solid ${accent}`,
                      color: accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Quote size={18} />
                    </div>
                  </div>

                  {/* Achievement Badge (if present) */}
                  {item.achievement && (
                    <div style={{
                      display: 'inline-block',
                      background: 'rgba(7, 10, 18, 0.8)',
                      color: accent,
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      border: `1px solid ${accent}50`,
                      marginBottom: '14px',
                      alignSelf: 'flex-start'
                    }}>
                      {item.achievement}
                    </div>
                  )}

                  {/* Student Quote */}
                  <p style={{ 
                    fontStyle: 'italic', 
                    fontSize: '0.9rem', 
                    color: '#E2E8F0', 
                    lineHeight: 1.65, 
                    marginBottom: '20px', 
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    "{item.quote || item.review_text || item.message || "This course provided a comprehensive journey from the basics to advanced practical skills. The mentorship changed my career trajectory."}"
                  </p>
                </div>

                {/* Student Profile Footer */}
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
                      src={item.avatar || item.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
                      alt={item.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: `2px solid ${accent}`,
                        boxShadow: `0 0 12px ${accent}40`
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
                      justifyContent: 'center',
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
                      color: accent, 
                      fontWeight: 700, 
                      marginTop: '2px', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}>
                      {item.course || item.company || 'Alumni Graduate'}
                    </div>
                    <div style={{ 
                      fontSize: '0.74rem', 
                      color: '#94A3B8', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}>
                      {item.role || item.author_title || 'Software Professional'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Valued Corporate Clients Photo Showcase Grid */}
        <div className="corporate-clients-box" style={{
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
            <h3 className="corporate-clients-heading" style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF' }}>
              Valued Corporate & Institutional Clients
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.96rem', maxWidth: '700px', margin: '6px auto 0 auto' }}>
              We engineer custom enterprise software solutions and deliver corporate training for leading government and private institutions.
            </p>
          </div>

          <div className="corporate-clients-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
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
                  justifyContent: 'space-between',
                  height: '100%'
                }}
                className="course-card"
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{
                    position: 'relative',
                    height: '160px',
                    width: '100%',
                    overflow: 'hidden',
                    background: '#0B1120',
                    borderBottom: `2px solid ${client.color}`
                  }}>
                    <img 
                      src={client.image} 
                      alt={client.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80";
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
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
                      borderRadius: '12px',
                      zIndex: 10
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
