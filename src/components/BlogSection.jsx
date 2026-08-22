import React, { useState, useEffect } from 'react';
import { BLOGS } from '../data/blogsData';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

export default function BlogSection() {
  const [blogsList, setBlogsList] = useState(BLOGS);
  const [activeBlog, setActiveBlog] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicBlogs = async () => {
      try {
        const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const res = await fetch(`${backendUrl}/api/public/blog`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setBlogsList(data.posts);
        }
      } catch (err) {
        console.log('Using static blogs fallback:', err);
      }
    };

    fetchPublicBlogs();
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="blogs" className="section" style={{ background: '#070A12' }}>
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag">Latest Insights & Tech News</div>
          <h2 className="section-title">Media Scope IT Tech Blog</h2>
          <p className="section-desc">
            Dive into the newest IT career trends, Python roadmaps, digital marketing guides, and tech news written by our software engineers.
          </p>
        </div>

        <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '28px' }}>
          {blogsList.map(blog => (
            <div key={blog.id} style={{
              background: '#0F172A',
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              height: '100%'
            }} className="course-card">
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Blog Image with Accent Border & Bottom Gradient Transparent Mask */}
                <div style={{
                  position: 'relative',
                  height: '190px',
                  overflow: 'hidden',
                  borderBottom: '2px solid var(--accent-cyan)'
                }}>
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                    }} 
                  />
                </div>
                
                <div style={{ padding: '24px 24px 16px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    background: 'rgba(0, 180, 216, 0.15)',
                    color: '#00B4D8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    alignSelf: 'flex-start',
                    marginBottom: '12px',
                    border: '1px solid var(--accent-cyan)'
                  }}>
                    {blog.category}
                  </span>

                  <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '10px', lineHeight: 1.4 }}>
                    {blog.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px', flex: 1, minHeight: '54px' }}>
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer - Date on Left & Read Article Pinned to Extreme Full Right Edge */}
              <div style={{
                padding: '16px 24px 20px 24px',
                borderTop: '1px solid var(--border-light)',
                marginTop: 'auto',
                width: '100%',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94A3B8' }}>
                  <Calendar size={14} color="#00B4D8" /> {blog.date}
                </div>

                <button 
                  onClick={() => setActiveBlog(blog)} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FF6B00',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justify: 'flex-end',
                    gap: '6px',
                    cursor: 'pointer',
                    padding: '0',
                    margin: '0',
                    marginLeft: 'auto',
                    textAlign: 'right'
                  }}
                  className="read-article-btn"
                >
                  Read Article <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Article Reader Modal */}
      {activeBlog && (
        <div className="modal-overlay" onClick={() => setActiveBlog(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <button className="modal-close" onClick={() => setActiveBlog(null)}>✕</button>
            
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--accent-cyan)', marginBottom: '20px' }}>
              <img 
                src={activeBlog.image} 
                alt={activeBlog.title} 
                style={{
                  width: '100%',
                  height: '260px',
                  objectFit: 'cover',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                }} 
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '12px' }}>
              <span><User size={14} style={{ display: 'inline', marginRight: '4px' }} /> {activeBlog.author}</span>
              <span><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> {activeBlog.date}</span>
            </div>

            <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.3 }}>
              {activeBlog.title}
            </h2>

            <div style={{
              fontSize: '0.95rem',
              color: '#E2E8F0',
              lineHeight: 1.7,
              whiteSpace: 'pre-line',
              background: '#0B1120',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-light)'
            }}>
              {activeBlog.content}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
