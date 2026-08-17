import React from 'react';
import { ArrowLeft, Globe, Palette, Megaphone, Code2, Terminal, Laptop, ArrowRight, Sparkles, GraduationCap, CheckCircle2, Award, Clock } from 'lucide-react';

export default function CoursesPage({ onNavigate, onOpenAdmission }) {
  const categories = [
    {
      id: 'web-courses',
      title: 'Website Design & Development',
      subtitle: '7 Specialized Courses',
      icon: Globe,
      color: '#00B4D8',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
      desc: 'Master HTML5, CSS3, JavaScript, ReactJS, Full Stack Node.js, WordPress Theme Dev, and E-Commerce platforms.',
      coursesList: ['Web Design', 'Full Stack Web Dev', 'ReactJS Front-End', 'WordPress Theme Dev', 'E-Commerce Dev']
    },
    {
      id: 'graphics-courses',
      title: 'Graphics & UI/UX Design',
      subtitle: '6 Specialized Courses',
      icon: Palette,
      color: '#FF6B00',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80',
      desc: 'Learn Figma UI/UX research, Adobe Illustrator, Photoshop, AutoCAD 2D 3D, Interior Design, and Video Editing.',
      coursesList: ['Graphics Design', 'UI/UX Design with Figma', 'AutoCAD 2D 3D', '3D Studio Max', 'Video Editing']
    },
    {
      id: 'marketing-courses',
      title: 'Digital Marketing & SEO',
      subtitle: '3 Specialized Courses',
      icon: Megaphone,
      color: '#FFB703',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      desc: 'Master Facebook Meta Ads, Google Ads PPC, Advanced SEO keyword ranking, Content Marketing, and Analytics.',
      coursesList: ['Digital Marketing Masterclass', 'Advanced SEO Services', 'Content Writing & Copywriting']
    },
    {
      id: 'software-courses',
      title: 'Software & Mobile App Development',
      subtitle: '3 Specialized Courses',
      icon: Code2,
      color: '#10B981',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80',
      desc: 'Build enterprise backend systems with Laravel, ASP.NET Core, and native Android & iOS Flutter mobile apps.',
      coursesList: ['Laravel Web Framework', 'ASP.NET Core Enterprise', 'iOS & Android App Dev (Flutter)']
    },
    {
      id: 'programming-courses',
      title: 'Programming Languages',
      subtitle: '5 Specialized Courses',
      icon: Terminal,
      color: '#00B4D8',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      desc: 'Foundational computer science logic: C Programming, C++, Object-Oriented Programming, Java, and Python AI/ML.',
      coursesList: ['C Programming', 'Object-Oriented C++', 'Java Enterprise', 'Python Programming & ML']
    },
    {
      id: 'others-courses',
      title: 'Freelancing & Professional Skills',
      subtitle: '3 Specialized Courses',
      icon: Laptop,
      color: '#FF6B00',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      desc: 'Upwork & Fiverr order-hunting masterclass, Microsoft Office Management, and Advanced Excel financial modeling.',
      coursesList: ['Freelancing & Outsourcing', 'Microsoft Office Suite', 'Advanced Excel Financial Modeling']
    }
  ];

  return (
    <div style={{ background: '#070A12', color: 'white', minHeight: '100vh', padding: '50px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => onNavigate('home')} 
          className="btn-outline" 
          style={{ marginBottom: '30px', fontSize: '0.88rem' }}
        >
          <ArrowLeft size={16} /> Back to Homepage
        </button>

        {/* Page Banner Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          padding: '55px 45px',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          marginBottom: '50px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#FF6B00" /> Training Departments & Course Portals
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '18px', lineHeight: 1.15 }}>
            Training Courses — Choose Your Career Track
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.12rem', maxWidth: '900px', lineHeight: 1.7 }}>
            Explore our 6 specialized IT training departments below. Click on any category to view its dedicated course page, full module syllabus, lab schedules, and enrollment options.
          </p>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '20px', marginTop: '36px', paddingTop: '28px', borderTop: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FF6B00' }}>20+</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Professional Courses</div>
            </div>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#00B4D8' }}>100%</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Lab Practical Project</div>
            </div>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FFB703' }}>4.9 ★</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Student Reviews</div>
            </div>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#10B981' }}>Lifetime</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Mentor Support</div>
            </div>
          </div>
        </div>

        {/* 6 Category Navigation Cards Grid with Equal Heights & Bottom Alignment */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', marginBottom: '60px' }}>
          {categories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <div 
                key={cat.id}
                onClick={() => onNavigate(cat.id)}
                style={{
                  background: '#0F172A',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  height: '100%'
                }}
                className="course-card"
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Top Related Category Image Header with Bottom Gradient Mask */}
                  <div style={{
                    position: 'relative',
                    height: '180px',
                    width: '100%',
                    overflow: 'hidden',
                    borderBottom: `2px solid ${cat.color}`
                  }}>
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
                      }} 
                    />

                    {/* Icon Badge Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(7, 10, 18, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${cat.color}`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center'
                    }}>
                      <IconComp size={24} />
                    </div>

                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(7, 10, 18, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: cat.color,
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: '1px solid var(--border-light)'
                    }}>
                      {cat.subtitle}
                    </span>
                  </div>

                  <div style={{ padding: '24px 28px 16px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
                      {cat.title}
                    </h3>

                    <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px', minHeight: '52px' }}>
                      {cat.desc}
                    </p>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto' }}>
                      {cat.coursesList.map((item, idx) => (
                        <span key={idx} style={{
                          background: '#070A12',
                          color: '#CBD5E1',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-light)'
                        }}>
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Link aligned perfectly across all cards */}
                <div style={{ padding: '16px 28px 24px 28px', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
                  <div style={{ color: cat.color, fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Open Dedicated Course Page <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '50px 30px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>Enroll in Next Training Batch Today</h3>
          <p style={{ color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>Reserve your seat at Dhanmondi campus or online live class.</p>
          <button onClick={() => onOpenAdmission()} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <GraduationCap size={20} /> Enroll in Training Course Online
          </button>
        </div>
      </div>
    </div>
  );
}
