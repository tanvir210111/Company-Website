import React from 'react';
import { Target, Lightbulb, HeartHandshake, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="section" style={{ background: '#070A12' }}>
      <div className="section-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }}>
          {/* Custom thin border image box: 1px border on top/left/right, no shadow, no bottom border line */}
          <div className="about-img-border-custom">
            <div className="about-img-inner">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="Team at Media Scope IT" 
              />
            </div>
          </div>

          <div>
            <div className="section-tag">About Media Scope IT Ltd</div>
            <h2 className="section-title">Leading IT Training & Software Innovation Center Since 2011</h2>
            <p className="section-desc" style={{ marginBottom: '24px' }}>
              Media Scope IT Ltd (RJSC: C-166968/2020) is a premier IT training course institute and software development company based in Uttara, Dhaka, Bangladesh. We specialize in practical hands-on skill development, custom web/mobile software, and result-driven digital marketing.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: '#0F172A', padding: '18px', borderRadius: '14px', borderLeft: '4px solid #FF6B00', borderTop: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#FFFFFF', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Target size={18} color="#FF6B00" /> Practical Curriculum
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>100% project-based real world lab practice.</div>
              </div>

              <div style={{ background: '#0F172A', padding: '18px', borderRadius: '14px', borderLeft: '4px solid #00B4D8', borderTop: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#FFFFFF', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HeartHandshake size={18} color="#00B4D8" /> Career & Freelancing Support
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Lifetime student support & order hunting guidance.</div>
              </div>
            </div>

            {/* Quote from Managing Director */}
            <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <p style={{ fontStyle: 'italic', fontSize: '0.94rem', marginBottom: '12px', color: '#E2E8F0' }}>
                "Our mission is to provide quality learning solutions at affordable prices and empower the youth of Bangladesh to lead in the global digital economy."
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00B4D8' }}>
                — Managing Director, Media Scope IT Ltd
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
