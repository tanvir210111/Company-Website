import React from 'react';
import { Phone, Mail, MapPin, Award, ShieldCheck, Lock } from 'lucide-react';

export default function Footer({ onScrollToCert, onNavigate }) {
  const handleNavClick = (pageId) => {
    if (onNavigate) {
      onNavigate(pageId);
    } else {
      window.history.pushState(null, '', `/${pageId}`);
      window.dispatchEvent(new Event('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Bio */}
        <div className="footer-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <img 
              src="/logo.jpeg" 
              alt="Media Scope IT Logo" 
              style={{ height: '46px', objectFit: 'contain', background: 'white', padding: '4px 6px', borderRadius: '4px' }} 
            />
            <div>
              <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.1 }}>MEDIA SCOPE IT LTD</h2>
              <span style={{ fontSize: '0.68rem', color: '#00B4D8', fontWeight: 600, letterSpacing: '0.5px' }}>IT & SOFTWARE INSTITUTE</span>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Media Scope IT Ltd has been a top-rated IT training course institute and enterprise software development company in Bangladesh since 2011. Quality is our best priority.
          </p>

          {/* Legal Registrations Badge */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.78rem',
            lineHeight: 1.6,
            color: '#CBD5E1'
          }}>
            <div style={{ fontWeight: 700, color: '#00B4D8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <ShieldCheck size={14} /> Official Government Registrations
            </div>
            <strong>RJSC Reg:</strong> C-166968/2020 | <strong>Trade Lic:</strong> TRAD/DSCC/048330/2020 <br />
            <strong>TIN:</strong> 125190932932 | <strong>DBID:</strong> [DBID NUMBER]
          </div>
        </div>

        {/* Legal & Compliance Links */}
        <div className="footer-col">
          <h3>Quick & Legal Links</h3>
          <ul className="footer-links" style={{ fontSize: '0.88rem' }}>
            <li>
              <a href="/about-us" onClick={(e) => { e.preventDefault(); handleNavClick('about-us'); }}>
                About Us
              </a>
            </li>
            <li>
              <a href="/terms-and-conditions" onClick={(e) => { e.preventDefault(); handleNavClick('terms-and-conditions'); }}>
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); handleNavClick('privacy-policy'); }}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/refund-policy" onClick={(e) => { e.preventDefault(); handleNavClick('refund-policy'); }}>
                Refund & Return Policy
              </a>
            </li>
            <li>
              <a href="/delivery-policy" onClick={(e) => { e.preventDefault(); handleNavClick('delivery-policy'); }}>
                Delivery / Service Policy
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('home'); setTimeout(() => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); }}>
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Enterprise Services */}
        <div className="footer-col">
          <h3>Enterprise Software</h3>
          <ul className="footer-links" style={{ fontSize: '0.88rem' }}>
            <li><a href="#services">CRM Management Software</a></li>
            <li><a href="#services">Payroll & HR Solutions</a></li>
            <li><a href="#services">POS for Super Shop & Retail</a></li>
            <li><a href="#services">Diagnostic Center Software</a></li>
            <li><a href="#services">Facebook Boosting Service</a></li>
            <li><a href="#services">SEO Optimization Services</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col">
          <h3>Contact Info</h3>
          <ul className="footer-links" style={{ fontSize: '0.88rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={14} color="#FF6B00" /> +88 01325-165451
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} color="#00B4D8" /> info@mediascopeit.com
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={14} color="#FFB703" style={{ flexShrink: 0, marginTop: '3px' }} /> House-05, Flat B-3, Road-03, Sector-15F, Uttara, Dhaka
            </li>
            <li style={{ marginTop: '14px' }}>
              <button 
                onClick={onScrollToCert} 
                className="cert-verify-btn" 
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Award size={16} /> Verify Certificate Online
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Official SSLCommerz Payment Gateway Supported Channels Banner */}
      <div style={{ padding: '20px 20px 0 20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
        <div style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Lock size={14} color="#00B4D8" /> SECURE ONLINE PAYMENT GATEWAY POWERED BY SSLCOMMERZ (256-BIT SSL ENCRYPTED)
        </div>
        
        <div style={{ background: '#0B1120', padding: '10px 18px', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px', maxWidth: '100%', boxSizing: 'border-box' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#00B4D8', letterSpacing: '0.5px' }}>SSLCOMMERZ</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', background: '#1A233A', padding: '3px 8px', borderRadius: '4px', border: '1px solid #334155' }}>VISA</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF4D4D', background: '#1A233A', padding: '3px 8px', borderRadius: '4px', border: '1px solid #334155' }}>MasterCard</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0099FF', background: '#1A233A', padding: '3px 8px', borderRadius: '4px', border: '1px solid #334155' }}>AMEX</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EC1261', background: 'rgba(236, 18, 97, 0.15)', padding: '3px 8px', borderRadius: '4px', border: '1px solid #EC1261' }}>bKash</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F7941D', background: 'rgba(247, 148, 29, 0.15)', padding: '3px 8px', borderRadius: '4px', border: '1px solid #F7941D' }}>Nagad</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A855F7', background: '#1A233A', padding: '3px 8px', borderRadius: '4px', border: '1px solid #334155' }}>Rocket</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', background: '#1A233A', padding: '3px 8px', borderRadius: '4px', border: '1px solid #334155' }}>Internet Banking</span>
        </div>
      </div>

      <div className="footer-bottom" style={{ marginTop: '20px' }}>
        © 2026 Media Scope IT Ltd. All Rights Reserved. | Developed by{' '}
        <a 
          href="/senior-software-developer-tanvir-hossain-khan" 
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('senior-software-developer-tanvir-hossain-khan');
          }}
          style={{ color: '#00B4D8', fontWeight: 600, textDecoration: 'underline' }}
        >
          Tanvir Hossain Khan
        </a>
      </div>
    </footer>
  );
}
