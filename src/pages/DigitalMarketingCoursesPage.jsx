import React, { useState } from 'react';
import { COURSES } from '../data/coursesData';
import { ArrowLeft, Clock, Calendar, Star, Users, CheckCircle, GraduationCap, Megaphone, ArrowRight } from 'lucide-react';

export default function DigitalMarketingCoursesPage({ onNavigate, onOpenAdmission }) {
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  const mktCourses = COURSES.filter(c => c.category === "Digital Marketing" || c.title.toLowerCase().includes('marketing') || c.title.toLowerCase().includes('seo') || c.title.toLowerCase().includes('content'));

  return (
    <div style={{ background: '#070A12', color: 'white', minHeight: '100vh', padding: '50px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => onNavigate('courses')} className="btn-outline" style={{ marginBottom: '30px', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Courses Hub
        </button>

        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          padding: '50px 40px',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          marginBottom: '50px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ color: '#FFB703', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Megaphone size={18} color="#FFB703" /> Department of Digital Marketing & SEO
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.15 }}>
            Digital Marketing & SEO Courses
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '850px', lineHeight: 1.6 }}>
            Master Facebook Meta Ads, Google Ads PPC, Technical SEO keyword ranking, Content Strategy, Social Media Growth, and E-Commerce marketing.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid" style={{ marginBottom: '60px' }}>
          {mktCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-img-box">
                <img src={course.image} alt={course.title} className="course-img" />
                <span className="course-badge">{course.category}</span>
                {course.popular && <span className="course-pop-badge">Popular</span>}
              </div>

              <div className="course-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#FFB703', fontWeight: 700 }}>
                    <Star size={14} fill="#FFB703" /> {course.rating} (95+ Reviews)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    <Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> {course.studentsCount}
                  </div>
                </div>

                <h3 className="course-title">{course.title}</h3>
                
                <div className="course-meta">
                  <div className="course-meta-item"><Clock size={14} /> {course.hours} ({course.duration})</div>
                  <div className="course-meta-item"><Calendar size={14} /> Batch: {course.nextBatch}</div>
                </div>

                <p className="course-desc">{course.shortDesc}</p>

                <div className="course-footer">
                  <div className="course-price">
                    <span className="price-actual">{course.discountFee}</span>
                    <span className="price-old">{course.fee}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setActiveCourseModal(course)} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>Syllabus</button>
                    <button onClick={() => onOpenAdmission(course)} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>Enroll</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '50px 30px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>Drive Online Sales & Business Growth</h3>
          <p style={{ color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>Learn Facebook Ads, Google Ads & SEO from certified experts.</p>
          <button onClick={() => onOpenAdmission()} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <GraduationCap size={20} /> Enroll in Digital Marketing Batch
          </button>
        </div>
      </div>

      {activeCourseModal && (
        <div className="modal-overlay" onClick={() => setActiveCourseModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveCourseModal(null)}>✕</button>
            <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '10px' }}>{activeCourseModal.title}</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '20px' }}>{activeCourseModal.shortDesc}</p>
            <div style={{ background: '#0B1120', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
              <h4 style={{ color: '#FFB703', marginBottom: '10px' }}>Curriculum Modules:</h4>
              <ul style={{ listStyle: 'none' }}>
                {activeCourseModal.curriculum.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '0.88rem', color: '#E2E8F0', display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <CheckCircle size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => { const c = activeCourseModal; setActiveCourseModal(null); onOpenAdmission(c); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Enroll in Batch ({activeCourseModal.discountFee})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
