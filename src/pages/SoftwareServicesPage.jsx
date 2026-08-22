import React from 'react';
import { SERVICES } from '../data/servicesData';
import { ArrowLeft, Server, CheckCircle, Briefcase } from 'lucide-react';

export default function SoftwareServicesPage({ onNavigate, onOpenQuote }) {
  const swServices = SERVICES.filter(s => s.category === "Software Development" || s.title.toLowerCase().includes('pos') || s.title.toLowerCase().includes('crm') || s.title.toLowerCase().includes('payroll') || s.title.toLowerCase().includes('diagnostic') || s.title.toLowerCase().includes('hr'));

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
          <div style={{ color: '#10B981', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Server size={18} color="#10B981" /> Enterprise Software Solutions Division
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.15 }}>
            Enterprise Commercial Software Systems
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '850px', lineHeight: 1.6 }}>
            Custom multi-branch POS for super shops, hospital diagnostic center management, CRM, biometric payroll, school ERP, and inventory control applications.
          </p>
        </div>

        {/* Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px', marginBottom: '60px' }}>
          {swServices.map(service => (
            <div key={service.id} style={{
              background: '#0F172A',
              borderRadius: '22px',
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }} className="course-card">
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden', background: '#0B1120', borderBottom: '2px solid #10B981' }}>
                  <img 
                    src={service.image_url || service.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"} 
                    alt={service.title} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80";
                    }}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                  <span style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(7, 10, 18, 0.85)', backdropFilter: 'blur(8px)', color: '#10B981', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--border-light)', zIndex: 10 }}>
                    {service.category}
                  </span>
                </div>

                <div style={{ padding: '22px 22px 16px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>{service.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '18px' }}>
                    {service.description || service.tagline || service.shortDesc}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto', marginBottom: '16px' }}>
                    {service.features.map((feat, idx) => (
                      <div key={idx} style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={14} color="#10B981" /> {feat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px 22px 20px 22px', borderTop: '1px solid var(--border-light)', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Starting Package</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10B981' }}>
                    {service.startingPrice || 'Negotiable / Custom Quote'}
                  </div>
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
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>Automate Your Business Operations</h3>
          <p style={{ color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>Get a 24/7 supported custom software solution for your enterprise.</p>
          <button onClick={() => onOpenQuote()} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <Briefcase size={20} /> Request Software Quotation / Demo
          </button>
        </div>
      </div>
    </div>
  );
}
