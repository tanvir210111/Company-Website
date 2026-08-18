import React from 'react';
import { Phone, Mail, MapPin, Award, ShieldCheck } from 'lucide-react';

export default function Footer({ onScrollToCert }) {
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
            <strong>TIN:</strong> 125190932932 | <strong>BIN:</strong> 003975158-0208
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Popular Courses</h3>
          <ul className="footer-links" style={{ fontSize: '0.88rem' }}>
            <li><a href="#courses">Professional Graphics Design</a></li>
            <li><a href="#courses">Full Stack Web Development</a></li>
            <li><a href="#courses">Digital Marketing & SEO</a></li>
            <li><a href="#courses">Python & Django Programming</a></li>
            <li><a href="#courses">C & C++ Programming</a></li>
            <li><a href="#courses">WordPress Theme Development</a></li>
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
              <Phone size={14} color="#FF6B00" /> +88 01714-691963
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={14} color="#FF6B00" /> +88 01922-170672
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} color="#00B4D8" /> info@mediascopeit.com
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={14} color="#FFB703" /> Dhanmondi, Dhaka, BD
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

      <div className="footer-bottom">
        © 2026 Media Scope IT Ltd. All Rights Reserved. | Developed by{' '}
        <a 
          href="/senior-software-developer-tanvir-hossain-khan" 
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, '', '/senior-software-developer-tanvir-hossain-khan');
            window.dispatchEvent(new Event('popstate'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{ color: '#00B4D8', fontWeight: 600, textDecoration: 'underline' }}
        >
          Tanvir Hossain Khan
        </a>
      </div>
    </footer>
  );
}
