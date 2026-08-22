import React from 'react';
import { ArrowLeft, Monitor, Megaphone, Server, Settings, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Briefcase, GraduationCap } from 'lucide-react';

export default function ServicesPage({ onNavigate, onOpenQuote }) {
  const serviceCategories = [
    {
      id: 'web-services',
      title: 'Website Design & Development',
      subtitle: '7 Software Services',
      icon: Monitor,
      color: '#00B4D8',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      desc: 'Static & dynamic websites, custom e-commerce stores, resort portals, WordPress speed optimization, and maintenance.',
      servicesList: ['Static Web Design', 'E-Commerce Store', 'Website Maintenance', 'Resort Portals', 'Dynamic React Apps']
    },
    {
      id: 'marketing-services',
      title: 'Digital Marketing & SEO Services',
      subtitle: '4 Marketing Services',
      icon: Megaphone,
      color: '#FF6B00',
      image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=600&q=80',
      desc: 'Facebook ad boosting campaigns, Google PPC Search ads, Technical SEO keyword ranking, and social media brand management.',
      servicesList: ['Digital Marketing', 'Technical SEO', 'Social Media Management', 'Facebook Ad Boosting']
    },
    {
      id: 'software-services',
      title: 'Enterprise Software Solutions',
      subtitle: '8 Commercial Systems',
      icon: Server,
      color: '#10B981',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      desc: 'Custom HR Management, CRM, Payroll, Accounting, Hospital Diagnostic Management, School ERP, Inventory & Super Shop POS.',
      servicesList: ['Multi-Branch Super Shop POS', 'Hospital Diagnostic System', 'Custom ERP & Payroll', 'CRM Software']
    },
    {
      id: 'other-services',
      title: 'IT Consulting & Specialized Services',
      subtitle: '4 Enterprise Services',
      icon: Settings,
      color: '#FFB703',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      desc: 'Strategic IT infrastructure consulting, native iOS & Android mobile apps, architectural 2D/3D design, and graphic design.',
      servicesList: ['IT Strategy Consulting', 'Mobile App Development', 'Architectural Design', 'Branding & Graphics']
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
          padding: '40px 24px',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#00B4D8" /> Custom Software & Growth Solutions
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.2 }}>
            Our Commercial IT & Software Services Hub
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.08rem', maxWidth: '900px', lineHeight: 1.65 }}>
            Media Scope IT Ltd delivers custom software engineering, e-commerce development, digital marketing campaigns, and IT infrastructure consulting for 500+ corporate clients in Bangladesh.
          </p>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#00B4D8' }}>500+</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Deployed Systems</div>
            </div>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FF6B00' }}>99.9%</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>System Uptime SLA</div>
            </div>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#10B981' }}>24/7</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Hotline Technical Support</div>
            </div>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FFB703' }}>ISO</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Quality Standard</div>
            </div>
          </div>
        </div>

        {/* 4 Category Navigation Cards Grid with Equal Heights & Cover Photos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))', gap: '28px', marginBottom: '60px' }}>
          {serviceCategories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <div 
                key={cat.id}
                onClick={() => onNavigate(cat.id)}
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
                  justifyContent: 'space-between',
                  height: '100%'
                }}
                className="course-card"
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Top Cover Photo */}
                  <div style={{
                    position: 'relative',
                    height: '180px',
                    width: '100%',
                    overflow: 'hidden',
                    background: '#0B1120',
                    borderBottom: `2px solid ${cat.color}`
                  }}>
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80";
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
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
                      border: `1px solid ${cat.color}`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center'
                    }}>
                      <IconComp size={24} />
                    </div>

                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(7, 10, 18, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: cat.color,
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: '1px solid var(--border-light)'
                    }}>
                      {cat.subtitle}
                    </span>
                  </div>

                  <div style={{ padding: '24px 28px 16px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
                      {cat.title}
                    </h3>

                    <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px', minHeight: '52px' }}>
                      {cat.desc}
                    </p>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto' }}>
                      {cat.servicesList.map((item, idx) => (
                        <span key={idx} style={{
                          background: '#070A12',
                          color: '#CBD5E1',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-light)'
                        }}>
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px 28px 24px 28px', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
                  <div style={{ color: cat.color, fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Explore Service Department <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '50px 30px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>Request Custom Enterprise Software Proposal</h3>
          <p style={{ color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>Schedule a consultation with our software engineering leads.</p>
          <button onClick={() => onOpenQuote()} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <Briefcase size={20} /> Request Corporate Quotation / Demo
          </button>
        </div>
      </div>
    </div>
  );
}
