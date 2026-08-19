import React, { useEffect } from 'react';
import { Truck, ArrowLeft, CheckCircle2, Clock, Mail, ShieldCheck } from 'lucide-react';

export default function DeliveryPolicyPage({ onNavigate }) {
  useEffect(() => {
    document.title = 'Media Scope IT Ltd | Delivery Policy';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: '#050811', color: '#FFFFFF', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('home')} 
          className="btn-outline" 
          style={{ marginBottom: '24px', padding: '8px 16px', fontSize: '0.88rem' }}
        >
          <ArrowLeft size={16} /> Back to Website
        </button>

        {/* Page Header */}
        <div style={{ background: '#0B1120', padding: '40px 30px', borderRadius: '24px', border: '1px solid var(--border-light)', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#FF6B00', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
            <Truck size={16} /> Digital & Service Fulfillment Policy
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
            Delivery / Service Delivery Policy
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.6 }}>
            Last Updated: August 19, 2026 | Media Scope IT Ltd
          </p>
        </div>

        {/* Delivery Content Body */}
        <div style={{ background: '#0B1120', padding: '40px 30px', borderRadius: '24px', border: '1px solid var(--border-light)', lineHeight: 1.8, color: '#CBD5E1', fontSize: '0.96rem' }}>
          
          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>1. Scope of Digital Services</h2>
          <p style={{ marginBottom: '24px' }}>
            Media Scope IT Ltd specializes in IT professional training courses and custom software development services. Because our offerings are digital services and educational programs rather than physical physical merchandise, delivery is fulfilled electronically via SMS, email, online learning portals, and hands-on lab seat allocations.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>2. IT Training Enrollment Fulfillment</h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li><strong>Instant Confirmation:</strong> Upon successful payment completion via SSLCommerz or manual verification, students receive an instant registration digital receipt on screen and via SMS.</li>
            <li><strong>Batch Access Credentials:</strong> Course access details (Zoom meeting links for online live classes or lab desk seating numbers for offline Uttara campus classes) are delivered via SMS & email within <strong>24 hours</strong> of registration.</li>
            <li><strong>Learning Resources:</strong> Course materials, lecture slides, software setup guides, and project source files are provided on the first day of class via our student portal.</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>3. Commercial Software & Service Delivery</h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li><strong>Project Milestones:</strong> Enterprise software, web applications, and mobile apps are delivered in accordance with agreed milestone schedules set in the commercial contract.</li>
            <li><strong>Delivery Mechanism:</strong> Software source code, staging environment URLs, database migrations, and administrative access credentials are delivered securely to the client's designated technical lead via encrypted email / repository access.</li>
            <li><strong>Standard Turnaround:</strong> Commercial web development and software solutions typically range from <strong>2 to 6 weeks</strong> depending on project complexity.</li>
          </ul>

          {/* Delayed Delivery Contact Box */}
          <div style={{ background: 'rgba(255, 107, 0, 0.1)', border: '1px solid #FF6B00', padding: '24px', borderRadius: '16px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FF6B00', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} /> Support for Delayed Access or Credentials
            </h3>
            <p style={{ color: '#E2E8F0', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
              If you have not received your class access credentials or registration confirmation within 24 hours of payment, please contact our academic desk immediately at <strong>+88 01325-165451</strong> or email <a href="mailto:info@mediascopeit.com" style={{ color: '#FF6B00' }}>info@mediascopeit.com</a> with your Transaction ID.
            </p>
          </div>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>4. Contact Delivery Support</h2>
          <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Course Delivery & Student Desk — Media Scope IT Ltd</div>
            <div>House-05, Flat B-3, Road-03, Sector-15F, Uttara, Dhaka, Bangladesh</div>
            <div>Hotline: +88 01325-165451 | Email: info@mediascopeit.com</div>
          </div>

        </div>
      </div>
    </div>
  );
}
