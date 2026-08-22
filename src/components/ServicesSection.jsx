import React, { useState, useEffect } from 'react';
import { SERVICES } from '../data/servicesData';
import { Users, CreditCard, ShoppingCart, Activity, Megaphone, Search, Globe, Smartphone, CheckCircle, ArrowRight, Sparkles, Code, Shield, Laptop } from 'lucide-react';

const iconMap = {
  Users: Users,
  CreditCard: CreditCard,
  ShoppingCart: ShoppingCart,
  Activity: Activity,
  Megaphone: Megaphone,
  Search: Search,
  Globe: Globe,
  Smartphone: Smartphone,
  Code: Code,
  Shield: Shield,
  Laptop: Laptop
};

export default function ServicesSection({ onOpenQuote }) {
  const [servicesList, setServicesList] = useState(SERVICES);
  const fallbackImage = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80";

  useEffect(() => {
    let isMounted = true;
    const fetchPublicServices = async () => {
      try {
        const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const res = await fetch(`${backendUrl}/api/public/services`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.services) && data.services.length > 0) {
          setServicesList(data.services);
        }
      } catch (err) {
        console.log('Using static services fallback:', err);
      }
    };

    fetchPublicServices();
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="services" className="section" style={{ background: '#070A12' }}>
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#00B4D8" /> Enterprise Software & Digital Solutions
          </div>
          <h2 className="section-title">Custom Software Development & Corporate Services</h2>
          <p className="section-desc">
            Since 2011, Media Scope IT Ltd has engineered high-performance enterprise software, custom e-commerce stores, POS systems, and digital growth funnels for Bangladeshi enterprises.
          </p>
        </div>

        {/* ELEGANT 100% EQUAL HEIGHT SERVICES GRID WITH VERIFIED COVER PHOTOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
          {servicesList.map(service => {
            const IconComponent = iconMap[service.icon] || Globe;
            return (
              <div 
                key={service.id} 
                style={{
                  background: '#0F172A',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  transition: 'all 0.3s ease'
                }}
                className="course-card"
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Related Cover Image with Fallback Protection */}
                  <div style={{
                    position: 'relative',
                    height: '180px',
                    width: '100%',
                    overflow: 'hidden',
                    background: '#0B1120',
                    borderBottom: '2px solid #00B4D8'
                  }}>
                    <img 
                      src={service.image_url || service.image || fallbackImage} 
                      alt={service.title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }} 
                    />

                    {/* Icon Badge Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(7, 10, 18, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid #00B4D8',
                      color: '#00B4D8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}>
                      <IconComponent size={22} />
                    </div>

                    {/* Category Badge */}
                    <span style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      background: 'rgba(7, 10, 18, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#00B4D8',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '14px',
                      border: '1px solid var(--border-light)',
                      zIndex: 10
                    }}>
                      {service.category}
                    </span>
                  </div>
                  
                  <div style={{ padding: '24px 24px 16px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.35 }}>
                      {service.title}
                    </h3>
                    
                    <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '18px', minHeight: '46px' }}>
                      {service.tagline || service.short_description || service.description || ''}
                    </p>

                    {/* Feature Bullets List - MinHeight ensures identical height for all cards */}
                    <div style={{ minHeight: '130px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {(Array.isArray(service.features) ? service.features : []).map((feat, idx) => (
                        <div key={idx} style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.4 }}>
                          <CheckCircle size={15} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer - Pinned to bottom border for 100% level alignment */}
                <div style={{
                  padding: '16px 24px 22px 24px',
                  borderTop: '1px solid var(--border-light)',
                  marginTop: 'auto'
                }}>
                  <button 
                    onClick={() => onOpenQuote(service)} 
                    className="btn-outline" 
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      textAlign: 'center',
                      fontSize: '0.88rem',
                      padding: '10px 16px'
                    }}
                  >
                    Request Quote / Demo <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
