import React, { useState, useEffect } from 'react';
import { COURSES, COURSE_CATEGORIES } from '../data/coursesData';
import { Clock, Calendar, Star, Users, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

export default function CoursesSection({ onOpenAdmission, searchQuery }) {
  const [coursesList, setCoursesList] = useState(COURSES);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicCourses = async () => {
      try {
        const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const res = await fetch(`${backendUrl}/api/public/courses`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          setCoursesList(data.courses);
        }
      } catch (err) {
        console.log('Using static courses fallback:', err);
      }
    };

    fetchPublicCourses();
    return () => { isMounted = false; };
  }, []);

  const filteredCourses = coursesList.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      (course.title && course.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
      ((course.short_desc || course.shortDesc) && (course.short_desc || course.shortDesc).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.category && course.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="courses" className="section" style={{ background: '#090D16' }}>
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag">Empower Your Career</div>
          <h2 className="section-title">Industry Standard IT Training Courses</h2>
          <p className="section-desc">
            Choose the professional training that fits your career goals, schedule, and learning preferences with expert instructors.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="course-tabs">
          {COURSE_CATEGORIES.map(category => (
            <button
              key={category}
              className={`tab-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-img-box">
                  <img src={course.image} alt={course.title} className="course-img" />
                  <span className="course-badge">{course.category}</span>
                  {course.popular && <span className="course-pop-badge">Popular</span>}
                </div>

                <div className="course-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#FFB703', fontWeight: 700 }}>
                      <Star size={14} fill="#FFB703" /> {course.rating} (120+ Reviews)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {course.studentsCount}
                    </div>
                  </div>

                  <h3 className="course-title">{course.title}</h3>
                  
                  <div className="course-meta">
                    <div className="course-meta-item">
                      <Clock size={14} /> {course.hours} ({course.duration})
                    </div>
                    <div className="course-meta-item">
                      <Calendar size={14} /> Batch: {course.nextBatch}
                    </div>
                  </div>

                  <p className="course-desc">{course.shortDesc}</p>

                  <div className="course-footer">
                    <div className="course-price">
                      <span className="price-actual">{course.discountFee}</span>
                      <span className="price-old">{course.fee}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => setActiveCourseModal(course)} 
                        className="btn-outline" 
                        style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                      >
                        Details
                      </button>
                      <button 
                        onClick={() => onOpenAdmission(course)} 
                        className="btn-primary" 
                        style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlignment: 'center', padding: '40px', background: '#0F172A', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'white' }}>
              <h3>No courses found matching "{searchQuery}"</h3>
              <p style={{ color: '#94A3B8', marginTop: '8px' }}>Try searching for Graphics, Web Development, C Programming or Digital Marketing.</p>
            </div>
          )}
        </div>
      </div>

      {/* Course Detail Modal */}
      {activeCourseModal && (
        <div className="modal-overlay" onClick={() => setActiveCourseModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveCourseModal(null)}>✕</button>
            
            <div className="course-badge" style={{ position: 'static', display: 'inline-block', marginBottom: '12px' }}>
              {activeCourseModal.category}
            </div>

            <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '10px' }}>{activeCourseModal.title}</h2>
            
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '20px' }}>{activeCourseModal.shortDesc}</p>

            <div style={{ background: '#0B1120', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
              <h4 style={{ color: '#00B4D8', marginBottom: '10px' }}>Course Syllabus & Modules:</h4>
              <ul style={{ listStyle: 'none' }}>
                {activeCourseModal.curriculum.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '0.88rem', color: '#E2E8F0', display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <CheckCircle size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Special Course Fee</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00B4D8' }}>{activeCourseModal.discountFee}</div>
              </div>

              <button 
                onClick={() => {
                  const course = activeCourseModal;
                  setActiveCourseModal(null);
                  onOpenAdmission(course);
                }} 
                className="btn-primary"
              >
                Enroll Now <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
