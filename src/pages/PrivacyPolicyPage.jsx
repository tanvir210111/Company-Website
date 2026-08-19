import React, { useEffect } from 'react';
import { ShieldCheck, Lock, ArrowLeft, Eye, Database, FileText } from 'lucide-react';

export default function PrivacyPolicyPage({ onNavigate }) {
  useEffect(() => {
    document.title = 'Media Scope IT Ltd | Privacy Policy';
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
            <ShieldCheck size={16} /> Data Security & Privacy Protection
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.6 }}>
            Last Updated: August 19, 2026 | Media Scope IT Ltd
          </p>
        </div>

        {/* Privacy Content Body */}
        <div style={{ background: '#0B1120', padding: '40px 30px', borderRadius: '24px', border: '1px solid var(--border-light)', lineHeight: 1.8, color: '#CBD5E1', fontSize: '0.96rem' }}>
          
          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: '12px' }}>
            Media Scope IT Ltd respects your privacy and is committed to protecting your personal data. We collect personal information when you register for a course, request a commercial software proposal, verify a certificate, or contact our support team.
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li><strong>Personal Contact Data:</strong> Student Full Name, Mobile Phone Number, Email Address, Class Mode choice.</li>
            <li><strong>Software Inquiry Data:</strong> Company/Business Name, Project Specification Details, Work Email.</li>
            <li><strong>Academic Records:</strong> Course Enrollment History, Certificate Verification IDs, Attendance logs.</li>
          </ul>

          {/* SSLCommerz Security Notice Callout Box */}
          <div style={{ background: 'rgba(0, 180, 216, 0.1)', border: '1px solid #00B4D8', padding: '24px', borderRadius: '16px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#00B4D8', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} /> SSLCommerz Payment Gateway Security Notice
            </h3>
            <p style={{ color: '#E2E8F0', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
              All online payment transactions on Media Scope IT Ltd are processed securely through <strong>SSLCommerz</strong>, the premier PCI-DSS compliant payment gateway in Bangladesh. Sensitive payment information (such as Credit/Debit card numbers, CVV codes, bank PINs, or bKash/Nagad security PINs) is transmitted directly over 256-Bit SSL Encrypted connections to SSLCommerz. <strong>Media Scope IT Ltd does NOT store, log, or collect your payment card or PIN information on our servers.</strong>
            </p>
          </div>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>2. How We Use Your Information</h2>
          <p style={{ marginBottom: '12px' }}>We use the collected information strictly for legitimate operational purposes:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li>Processing course admissions, lab seat reservations, and issuing official digital receipt slips.</li>
            <li>Sending SMS and email updates regarding class schedules, Zoom links, and exam notices.</li>
            <li>Providing technical support, certificate verification validation, and commercial project consultations.</li>
            <li>Improving website user experience and preventing fraudulent registrations.</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>3. Cookies & Website Analytics</h2>
          <p style={{ marginBottom: '24px' }}>
            Our website uses session cookies to remember user authentication state (student/client account logins) and active page preferences. Cookies help ensure seamless navigation and interactive modal operations. You may disable cookies in your browser settings, though certain website functions may be limited.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>4. Data Protection & Sharing Policy</h2>
          <p style={{ marginBottom: '24px' }}>
            We implement strict technical and organizational security measures to prevent unauthorized access, disclosure, or alteration of student data. <strong>We NEVER sell, rent, or trade student or client contact information to third-party marketing brokers.</strong> Information is shared only with authorized partners (such as payment gateways for transaction processing or SMS service providers for admission alerts).
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>5. User Rights & Data Retention</h2>
          <p style={{ marginBottom: '24px' }}>
            Students and clients have the right to request access to their stored profile details, correct inaccuracies, or request account data deletion after course completion by emailing <a href="mailto:info@mediascopeit.com" style={{ color: '#00B4D8' }}>info@mediascopeit.com</a>. Academic certificate verification records are retained indefinitely for official verification purposes.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>6. Updates to Privacy Policy</h2>
          <p style={{ marginBottom: '24px' }}>
            Media Scope IT Ltd may update this Privacy Policy periodically. Revisions will be published directly on this page with an updated revision date.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>7. Privacy Contact Information</h2>
          <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Data Privacy Office — Media Scope IT Ltd</div>
            <div>House-05, Flat B-3, Road-03, Sector-15F, Uttara, Dhaka, Bangladesh</div>
            <div>Hotline: +88 01325-165451 | Email: info@mediascopeit.com</div>
          </div>

        </div>
      </div>
    </div>
  );
}
