import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="section" style={{ background: '#070A12' }}>
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag">Get In Touch</div>
          <h2 className="section-title">Contact Media Scope IT Ltd</h2>
          <p className="section-desc">
            Have questions about our training courses, offline lab sessions, or custom software projects? Contact our support team today.
          </p>
        </div>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>
          {/* Office Contact Info Column */}
          <div className="contact-info-card" style={{ background: '#0F172A', color: 'white', padding: '36px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Head Office Details</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(0, 180, 216, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00B4D8', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#00B4D8' }}>Office Address</div>
                  <div style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '2px' }}>
                    House-05, Flat B-3, Road-03, Sector-15F, Uttara, Dhaka, Bangladesh.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255, 107, 0, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B00', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FF6B00' }}>Hotline Numbers</div>
                  <div style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '2px' }}>
                    +88 01325-165451
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255, 183, 3, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFB703', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFB703' }}>Official Email</div>
                  <div style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '2px' }}>
                    info@mediascopeit.com
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#10B981' }}>Office Lab Hours</div>
                  <div style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '2px' }}>
                    Saturday – Thursday: 10:00 AM – 8:00 PM <br />
                    Friday: 3:00 PM – 8:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="contact-form-card" style={{ background: '#0F172A', padding: '36px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '20px' }}>Send Us a Message</h3>

            {submitted ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <CheckCircle2 size={36} style={{ margin: '0 auto 10px auto' }} />
                <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Message Sent Successfully!</h4>
                <p style={{ fontSize: '0.9rem' }}>Our representative will call you back within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="e.g. Tanvir Hasan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-input" 
                      placeholder="017XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Web Development Course Query"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea 
                    rows={4} 
                    className="form-textarea" 
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={18} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
