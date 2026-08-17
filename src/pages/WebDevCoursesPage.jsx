import React, { useState } from 'react';
import { COURSES } from '../data/coursesData';
import { ArrowLeft, Clock, Calendar, Star, Users, CheckCircle, GraduationCap, Globe, ArrowRight, ShieldCheck } from 'lucide-react';

export default function WebDevCoursesPage({ onNavigate, onOpenAdmission }) {
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  const webCourses = COURSES.filter(c => c.category === "Web & Software" || c.title.toLowerCase().includes('web') || c.title.toLowerCase().includes('react'));

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
          <div style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={18} color="#00B4D8" /> Department of Web Engineering
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.15 }}>
            Website Design & Development Courses
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '850px', lineHeight: 1.6 }}>
            Master HTML5, CSS3, JavaScript, ReactJS, Node.js, PHP Laravel, and WordPress theme development. Learn to build modern, responsive, high-performance web applications.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid" style={{ marginBottom: '60px' }}>
          {webCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-img-box">
                <img src={course.image} alt={course.title} className="course-img" />
                <span className="course-badge">{course.category}</span>
                {course.popular && <span className="course-pop-badge">Popular</span>}
              </div>

              <div className="course-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#FFB703', fontWeight: 700 }}>
                    <Star size={14} fill="#FFB703" /> {course.rating} (140+ Reviews)
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

        {/* Detailed Department Features */}
        <div style={{ background: '#0F172A', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '24px', textAlign: 'center' }}>
            Why Choose Web Development at Media Scope IT Ltd?
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#070A12', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <CheckCircle size={24} color="#00B4D8" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>GitHub Project Commits</h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Every student builds 4+ live websites and pushes code to GitHub.</p>
            </div>

            <div style={{ background: '#070A12', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <CheckCircle size={24} color="#FF6B00" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Modern Tech Stack</h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>HTML5, CSS3, TailwindCSS, ReactJS, Node.js, and MySQL/MongoDB.</p>
            </div>

            <div style={{ background: '#070A12', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <CheckCircle size={24} color="#10B981" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Freelancing Guidance</h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Dedicated Upwork & Fiverr gig optimization sessions for Web Dev.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '50px 30px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>Start Your Web Developer Journey Today</h3>
          <p style={{ color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>Enroll in our Web Engineering diploma or short course.</p>
          <button onClick={() => onOpenAdmission()} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <GraduationCap size={20} /> Enroll in Web Development Batch
          </button>
        </div>
      </div>

      {/* Syllabus Modal */}
      {activeCourseModal && (
        <div className="modal-overlay" onClick={() => setActiveCourseModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveCourseModal(null)}>✕</button>
            <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '10px' }}>{activeCourseModal.title}</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '20px' }}>{activeCourseModal.shortDesc}</p>
            <div style={{ background: '#0B1120', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
              <h4 style={{ color: '#00B4D8', marginBottom: '10px' }}>Curriculum Modules:</h4>
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
