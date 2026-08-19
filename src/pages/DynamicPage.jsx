import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

export default function DynamicPage({ slug, onNavigate }) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPageContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const res = await fetch(`${backendUrl}/api/public/pages/${slug}`);
        const data = await res.json();

        if (isMounted) {
          if (data.success && data.page) {
            setPageData(data.page);
            // Update Document SEO Title & Description if provided
            if (data.page.seo_title) document.title = data.page.seo_title;
          } else {
            setError(data.message || 'Custom page not found.');
          }
        }
      } catch (err) {
        if (isMounted) setError('Network error fetching custom page.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (slug) fetchPageContent();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
          <p>Loading custom page content...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#0F172A', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '40px', maxWidth: '500px', textAlign: 'center' }}>
          <AlertCircle size={40} color="#EF4444" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>Page Not Found (404)</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '24px' }}>
            {error || 'The page you are looking for does not exist or has been moved to draft status.'}
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontWeight: 700 }}
          >
            <ArrowLeft size={16} /> Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="section" style={{ background: '#070A12', minHeight: '80vh', padding: '60px 0' }}>
      <div className="section-container" style={{ maxWidth: '880px', margin: '0 auto' }}>
        
        {/* BACK NAVIGATION BUTTON */}
        <button
          onClick={() => onNavigate('home')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#00B4D8',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        {/* FEATURED IMAGE */}
        {pageData.featured_image && (
          <div style={{ width: '100%', height: '320px', borderRadius: '20px', overflow: 'hidden', marginBottom: '30px', border: '1px solid var(--border-light)' }}>
            <img
              src={pageData.featured_image}
              alt={pageData.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* PAGE HEADER */}
        <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            {pageData.title}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', color: '#94A3B8', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="#00B4D8" /> {pageData.author || 'Media Scope IT Admin'}
            </div>
            {pageData.created_at && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#FF6B00" />
                {new Date(pageData.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            )}
          </div>
        </div>

        {/* DYNAMIC PAGE CONTENT BODY */}
        <div
          className="dynamic-page-content"
          style={{
            color: '#CBD5E1',
            fontSize: '1rem',
            lineHeight: '1.8',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />

      </div>
    </section>
  );
}
