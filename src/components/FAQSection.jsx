import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MessageCircleQuestion } from 'lucide-react';

const DEFAULT_FAQS = [
  {
    id: 1,
    category: 'courses',
    question: 'Are classes held offline in lab or online via live sessions?',
    answer: 'Media Scope IT Ltd offers both hands-on physical computer lab classes at our Uttara, Dhaka campus and live interactive online sessions with real-time screen sharing and recorded lecture archives.'
  },
  {
    id: 2,
    category: 'freelancing',
    question: 'Is job placement or freelancing support provided after course completion?',
    answer: 'Yes! We provide 100% career mentorship, resume building, mock job interviews, and direct freelancing order guidance for Fiverr, Upwork, and local Bangladeshi software companies.'
  },
  {
    id: 3,
    category: 'payments',
    question: 'Can course fees be paid in flexible installment plans?',
    answer: 'Yes, students can pay regular fees in 2-3 monthly installments. Instant digital payment options via bKash, Nagad, SSLCommerz, and credit card EMIs are supported.'
  },
  {
    id: 4,
    category: 'certificates',
    question: 'Are course completion certificates verified by RJSC registered IT company?',
    answer: 'Every student receives an official ISO-aligned RJSC Govt registered Media Scope IT Ltd certificate featuring a unique QR code for online employer verification.'
  }
];

export default function FAQSection() {
  const [faqsList, setFaqsList] = useState(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicFaqs = async () => {
      try {
        const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const res = await fetch(`${backendUrl}/api/public/faqs`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.faqs) && data.faqs.length > 0) {
          setFaqsList(data.faqs);
        }
      } catch (err) {
        console.log('Using static FAQ fallback:', err);
      }
    };

    fetchPublicFaqs();
    return () => { isMounted = false; };
  }, []);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="section" style={{ background: '#090D16' }}>
      <div className="section-container" style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div className="section-header">
          <div className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#00B4D8" /> Frequently Asked Questions
          </div>
          <h2 className="section-title">Everything You Need to Know</h2>
          <p className="section-desc">
            Find quick answers to common questions regarding our IT training courses, physical lab facilities, job placement, and corporate services.
          </p>
        </div>

        {/* ELEGANT FAQ ACCORDION LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqsList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                style={{
                  background: '#0F172A',
                  borderRadius: '14px',
                  border: isOpen ? '1px solid #00B4D8' : '1px solid var(--border-light)',
                  boxShadow: isOpen ? '0 8px 24px rgba(0, 180, 216, 0.15)' : 'var(--shadow-sm)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MessageCircleQuestion size={20} color={isOpen ? '#00B4D8' : '#64748B'} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: isOpen ? '#00B4D8' : '#FFFFFF' }}>
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      color: isOpen ? '#00B4D8' : '#64748B',
                      flexShrink: 0
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 22px 20px 54px',
                    color: '#94A3B8',
                    fontSize: '0.92rem',
                    lineHeight: '1.65'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
