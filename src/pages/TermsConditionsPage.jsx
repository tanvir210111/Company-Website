import React, { useEffect } from 'react';
import { ShieldCheck, FileText, ArrowLeft, Building2, Phone, Mail, CheckCircle2, Lock } from 'lucide-react';

export default function TermsConditionsPage({ onNavigate }) {
  useEffect(() => {
    document.title = 'Media Scope IT Ltd | Terms & Conditions';
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#00B4D8', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
            <FileText size={16} /> Official Corporate Policy
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
            Terms & Conditions
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.6 }}>
            Last Updated: August 19, 2026 | Media Scope IT Ltd (RJSC Reg: C-166968/2020 | Trade Lic: TRAD/DSCC/048330/2020)
          </p>
        </div>

        {/* Terms Content Body */}
        <div style={{ background: '#0B1120', padding: '40px 30px', borderRadius: '24px', border: '1px solid var(--border-light)', lineHeight: 1.8, color: '#CBD5E1', fontSize: '0.96rem' }}>
          
          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>1. Company Introduction</h2>
          <p style={{ marginBottom: '24px' }}>
            Welcome to Media Scope IT Ltd. By accessing our website (<a href="https://mediascopeit.com" style={{ color: '#00B4D8' }}>https://mediascopeit.com</a>), enrolling in our IT training courses, or purchasing enterprise software development services, you agree to be bound by these Terms & Conditions. Media Scope IT Ltd is a legally registered company operating under the laws of Bangladesh (RJSC Registration No: C-166968/2020, Trade License No: TRAD/DSCC/048330/2020).
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>2. Website Usage Rules</h2>
          <p style={{ marginBottom: '24px' }}>
            You agree to use our website and services only for lawful purposes. You must not attempt to disrupt website operations, upload malicious code, reverse engineer software assets, or scrape course material without explicit written authorization from Media Scope IT Ltd management.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>3. Course Enrollment & IT Training Terms</h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li>Students must provide accurate registration details (Full Name, Mobile Number, Email) during admission.</li>
            <li>Seat reservations are confirmed only upon successful payment verification.</li>
            <li>Course schedules, batch timings, and lab seat allocations are subject to academic management guidelines.</li>
            <li>Official Certificates (with verifiable QR verification code) are awarded only upon fulfilling minimum 80% class attendance and completing mandatory final projects.</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>4. Enterprise Software & Services Terms</h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li>Custom software development, web application engineering, and digital marketing services are governed by formal project specification proposals (SRS).</li>
            <li>Project milestones and deliverable timelines are specified in the official client contract.</li>
            <li>Source code intellectual property is transferred upon final payment settlement unless otherwise structured as a SaaS subscription.</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>5. Payment Terms & SSLCommerz Secure Gateway</h2>
          <p style={{ marginBottom: '24px' }}>
            All online course fees, admission payments, and service deposits are processed securely in Bangladeshi Taka (BDT). Online payments are handled through the official <strong>SSLCommerz 256-Bit SSL Encrypted Hosted Checkout Gateway</strong>, supporting Visa, MasterCard, AMEX, bKash, Nagad, Rocket, Upay, CellFin, and Internet Banking. Sensitive payment card credentials are processed directly by SSLCommerz and are never stored on Media Scope IT Ltd servers.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>6. Refund & Cancellation Reference</h2>
          <p style={{ marginBottom: '24px' }}>
            All course fee refund requests and cancellations are strictly governed by our official <a href="/refund-policy" onClick={(e) => { e.preventDefault(); onNavigate('refund-policy'); }} style={{ color: '#00B4D8', textDecoration: 'underline' }}>Refund & Return Policy</a>. Approved refunds are processed back to the original payment channel within 7 to 10 working days.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>7. Intellectual Property Rights</h2>
          <p style={{ marginBottom: '24px' }}>
            All website designs, curriculum documentation, video lectures, source code snippets, logos, and graphics are the exclusive intellectual property of Media Scope IT Ltd. Unauthorized distribution or commercial resale is strictly prohibited.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>8. Limitation of Liability</h2>
          <p style={{ marginBottom: '24px' }}>
            Media Scope IT Ltd shall not be liable for any indirect, incidental, or consequential damages resulting from third-party server downtime, user Internet connectivity interruptions, or external network failures beyond our control.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>9. Changes to Terms</h2>
          <p style={{ marginBottom: '24px' }}>
            Media Scope IT Ltd reserves the right to modify these Terms & Conditions at any time. Changes will take effect immediately upon publication on this page.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>10. Contact Information</h2>
          <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Media Scope IT Ltd</div>
            <div>House-05, Flat B-3, Road-03, Sector-15F, Uttara, Dhaka, Bangladesh</div>
            <div>Hotline: +88 01325-165451 | Email: info@mediascopeit.com</div>
            <div>RJSC Reg: C-166968/2020 | Trade License: TRAD/DSCC/048330/2020</div>
          </div>

        </div>
      </div>
    </div>
  );
}
