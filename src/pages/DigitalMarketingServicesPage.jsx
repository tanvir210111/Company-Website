import React from 'react';
import { SERVICES } from '../data/servicesData';
import { ArrowLeft, Megaphone, CheckCircle, Briefcase } from 'lucide-react';

export default function DigitalMarketingServicesPage({ onNavigate, onOpenQuote }) {
  const mktServices = SERVICES.filter(s => s.category === "Digital Marketing" || s.title.toLowerCase().includes('marketing') || s.title.toLowerCase().includes('seo') || s.title.toLowerCase().includes('facebook'));

  return (
    <div style={{ background: '#070A12', color: 'white', minHeight: '100vh', padding: '50px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => onNavigate('services')} className="btn-outline" style={{ marginBottom: '30px', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Services Hub
        </button>

        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          padding: '50px 40px',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          marginBottom: '50px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Megaphone size={18} color="#FF6B00" /> Digital Marketing & SEO Growth Division
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.15 }}>
            Digital Marketing & SEO Services
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '850px', lineHeight: 1.6 }}>
            Boost your online sales and brand presence with Meta Facebook ad campaigns, Google PPC, technical SEO keyword ranking, and social media growth funnels.
          </p>
        </div>

        {/* Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', marginBottom: '60px' }}>
          {mktServices.map(service => (
            <div key={service.id} style={{
              background: '#0F172A',
              borderRadius: '22px',
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              height: '100%'
            }} className="course-card">
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden', borderBottom: '2px solid #FF6B00' }}>
                  <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)' }} />
                  <span style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(7, 10, 18, 0.85)', backdropFilter: 'blur(8px)', color: '#FF6B00', fontSize: '0.76rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                    {service.category}
                  </span>
                </div>

                <div style={{ padding: '24px 28px 16px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>{service.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px', minHeight: '52px' }}>{service.shortDesc}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto', marginBottom: '16px' }}>
                    {service.features.map((feat, idx) => (
                      <div key={idx} style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={14} color="#10B981" /> {feat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px 28px 24px 28px', borderTop: '1px solid var(--border-light)', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Starting Package</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF6B00' }}>{service.startingPrice}</div>
                </div>
                <button onClick={() => onOpenQuote(service)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Get Proposal
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '50px 30px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>Accelerate Customer Acquisition & ROI</h3>
          <p style={{ color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>Work with certified Google & Facebook Meta growth strategists.</p>
          <button onClick={() => onOpenQuote()} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <Briefcase size={20} /> Request Marketing Plan
          </button>
        </div>
      </div>
    </div>
  );
}
