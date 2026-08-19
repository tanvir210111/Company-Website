import React, { useEffect } from 'react';
import { RefreshCw, ArrowLeft, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function RefundPolicyPage({ onNavigate }) {
  useEffect(() => {
    document.title = 'Media Scope IT Ltd | Refund & Return Policy';
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#FFB703', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
            <RefreshCw size={16} /> Customer Protection Policy
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
            Refund & Return Policy
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.6 }}>
            Last Updated: August 19, 2026 | Media Scope IT Ltd
          </p>
        </div>

        {/* Refund Content Body */}
        <div style={{ background: '#0B1120', padding: '40px 30px', borderRadius: '24px', border: '1px solid var(--border-light)', lineHeight: 1.8, color: '#CBD5E1', fontSize: '0.96rem' }}>
          
          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>1. Overview & Refund Eligibility</h2>
          <p style={{ marginBottom: '24px' }}>
            At Media Scope IT Ltd, we strive to deliver world-class IT training courses and enterprise software solutions. If a student or client is dissatisfied or unable to attend an enrolled course, our refund policy outlines clear conditions for eligibility and timeline processing.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>2. IT Training Course Refund Conditions</h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li><strong>Full Refund (100%):</strong> Eligible if a written cancellation request is submitted at least <strong>48 hours before</strong> the official course batch start date.</li>
            <li><strong>Partial Refund (50%):</strong> Eligible if requested within the <strong>first 3 days</strong> or after attending a maximum of 1 class of the batch.</li>
            <li><strong>Non-Refundable:</strong> Fees are non-refundable after a student attends 2 or more classes, or after 7 days have passed from the batch start date.</li>
            <li><strong>Batch Transfer Option:</strong> If a student cannot attend due to personal emergencies, fees can be transferred to a future regular or weekend batch at no additional cost.</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>3. Enterprise Software & Service Refund Conditions</h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li>Custom software development advance deposits are refundable before the initial Software Requirement Specification (SRS) architecture phase begins.</li>
            <li>Once active software development or server provisioning has commenced, refunds are computed on a pro-rata basis based on unfulfilled project milestones.</li>
          </ul>

          {/* Refund Timeline Callout Box */}
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: '24px', borderRadius: '16px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#10B981', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} /> Official Refund Processing Timeline
            </h3>
            <p style={{ color: '#E2E8F0', fontSize: '0.94rem', margin: 0, lineHeight: 1.6 }}>
              Approved refunds are processed within <strong>7 to 10 working days</strong> from the date of official request approval. Refund amounts are credited back directly to the original payment channel (Bank Account, bKash, Nagad, or Credit/Debit card via SSLCommerz).
            </p>
          </div>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>4. How to Submit a Refund Request</h2>
          <p style={{ marginBottom: '12px' }}>To submit a formal refund request, please follow these steps:</p>
          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li>Send an email to <a href="mailto:info@mediascopeit.com" style={{ color: '#00B4D8' }}>info@mediascopeit.com</a> with the subject line <code>"Refund Request - [Student/Client Name]"</code>.</li>
            <li>Include your Transaction ID (TrxID), mobile phone number, enrolled course title, and reason for refund.</li>
            <li>Our accounts team will verify the payment record and respond within 24 to 48 business hours.</li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>5. Contact Support for Refunds</h2>
          <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Accounts & Refund Desk — Media Scope IT Ltd</div>
            <div>House-05, Flat B-3, Road-03, Sector-15F, Uttara, Dhaka, Bangladesh</div>
            <div>Hotline: +88 01325-165451 | Email: info@mediascopeit.com</div>
          </div>

        </div>
      </div>
    </div>
  );
}
