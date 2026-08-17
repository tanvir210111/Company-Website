import React, { useState } from 'react';
import { Phone, Mail, Award, BookOpen, ChevronDown, Menu, X, Briefcase, GraduationCap, Globe, Palette, Megaphone, Code2, Terminal, Laptop, Monitor, Server, Settings, User, LogOut, LogIn } from 'lucide-react';

export default function Header({ onOpenAdmission, onOpenQuote, onScrollToCert, onNavigate, currentUser, onOpenAuth, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleNavClick = (pageId, sectionHash = null) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(pageId);
    }
    if (sectionHash) {
      setTimeout(() => {
        const el = document.getElementById(sectionHash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="header-wrapper">
      {/* Top Contact Bar */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-contact">
            <a href="tel:+8801714691963" className="top-contact-item">
              <Phone size={14} /> +88 01714-691963 (Admission Hotline)
            </a>
            <a href="mailto:info@mediascopeit.com" className="top-contact-item">
              <Mail size={14} /> info@mediascopeit.com
            </a>
          </div>
          <div className="top-actions">
            <button onClick={onScrollToCert} className="cert-verify-btn">
              <Award size={14} /> Verify Certificate
            </button>
            
            {/* Dual Role Student vs Client Profile Button in Header */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: currentUser.role === 'client' ? '#FF6B00' : '#00B4D8', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  background: currentUser.role === 'client' ? 'rgba(255, 107, 0, 0.15)' : 'rgba(0, 180, 216, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  border: currentUser.role === 'client' ? '1px solid #FF6B00' : '1px solid #00B4D8'
                }}>
                  {currentUser.role === 'client' ? <Briefcase size={13} /> : <GraduationCap size={13} />}
                  {currentUser.role === 'client' ? `Client: ${currentUser.name}` : `Student: ${currentUser.name}`}
                </span>
                <button 
                  onClick={onLogout}
                  style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  <LogOut size={12} /> Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                style={{ background: 'rgba(0, 180, 216, 0.15)', border: '1px solid #00B4D8', color: '#00B4D8', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <LogIn size={13} /> Student / Client Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <div className="main-header">
        <div className="header-container">
          <button 
            onClick={() => handleNavClick('home')} 
            className="logo-box" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <img 
              src="/logo.jpeg" 
              alt="Media Scope IT Logo" 
              style={{ height: '46px', objectFit: 'contain', borderRadius: '4px' }} 
            />
            <div className="logo-text">
              <h1>MEDIA SCOPE IT LTD</h1>
              <span>IT & SOFTWARE INSTITUTE</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <ul className="nav-links">
            <li className="nav-item">
              <button 
                onClick={() => handleNavClick('home')} 
                className="nav-link active" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Home
              </button>
            </li>
            
            {/* About Us Main Link & Dropdown Menu */}
            <li 
              className="nav-item has-simple-dropdown"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => handleNavClick('about-us')} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                About Us <ChevronDown size={14} />
              </button>
              {activeDropdown === 'about' && (
                <div className="dropdown-menu dropdown-simple">
                  <button 
                    onClick={() => handleNavClick('company-profile')} 
                    className="dropdown-item" 
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Company Profile
                  </button>

                  <button 
                    onClick={() => handleNavClick('md-message')} 
                    className="dropdown-item" 
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Message From MD
                  </button>

                  <button 
                    onClick={() => handleNavClick('team')} 
                    className="dropdown-item" 
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Team
                  </button>

                  <button 
                    onClick={() => handleNavClick('our-clients')} 
                    className="dropdown-item" 
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Our Clients
                  </button>
                </div>
              )}
            </li>

            {/* Training Courses Main Link & Mega Dropdown */}
            <li 
              className="nav-item"
              onMouseEnter={() => setActiveDropdown('courses')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => handleNavClick('courses')} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Training Courses <ChevronDown size={14} />
              </button>
              {activeDropdown === 'courses' && (
                <div className="mega-menu">
                  <div className="mega-grid mega-grid-6">
                    {/* Col 1 */}
                    <div className="mega-col">
                      <h4 className="mega-title" onClick={() => handleNavClick('web-courses')} style={{ cursor: 'pointer' }}>
                        <Globe size={15} color="#FF6B00" /> Website Design & Development
                      </h4>
                      <button onClick={() => handleNavClick('web-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Web Design</button>
                      <button onClick={() => handleNavClick('web-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Web Development</button>
                      <button onClick={() => handleNavClick('web-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Full Stack Web Development</button>
                      <button onClick={() => handleNavClick('web-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>WordPress Web Design & Development</button>
                      <button onClick={() => handleNavClick('web-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>E-Commerce Web Design & Development</button>
                      <button onClick={() => handleNavClick('web-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Front-End Development with ReactJS</button>
                      <button onClick={() => handleNavClick('web-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>WordPress Theme Development</button>
                    </div>

                    {/* Col 2 */}
                    <div className="mega-col">
                      <h4 className="mega-title" onClick={() => handleNavClick('graphics-courses')} style={{ cursor: 'pointer' }}>
                        <Palette size={15} color="#FF6B00" /> Graphics
                      </h4>
                      <button onClick={() => handleNavClick('graphics-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Graphics Design Training</button>
                      <button onClick={() => handleNavClick('graphics-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>UX & UI Design Training</button>
                      <button onClick={() => handleNavClick('graphics-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>AutoCAD 2D 3D Training</button>
                      <button onClick={() => handleNavClick('graphics-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>AutoCAD 2D 3D & 3D Studio Max</button>
                      <button onClick={() => handleNavClick('graphics-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Interior & Exterior Design</button>
                      <button onClick={() => handleNavClick('graphics-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Video Editing Training</button>
                    </div>

                    {/* Col 3 */}
                    <div className="mega-col">
                      <h4 className="mega-title" onClick={() => handleNavClick('marketing-courses')} style={{ cursor: 'pointer' }}>
                        <Megaphone size={15} color="#FF6B00" /> Digital Marketing
                      </h4>
                      <button onClick={() => handleNavClick('marketing-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Digital Marketing Trainings</button>
                      <button onClick={() => handleNavClick('marketing-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Advanced SEO</button>
                      <button onClick={() => handleNavClick('marketing-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Content Writing</button>
                    </div>

                    {/* Col 4 */}
                    <div className="mega-col">
                      <h4 className="mega-title" onClick={() => handleNavClick('software-courses')} style={{ cursor: 'pointer' }}>
                        <Code2 size={15} color="#FF6B00" /> Software Development
                      </h4>
                      <button onClick={() => handleNavClick('software-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Laravel Course</button>
                      <button onClick={() => handleNavClick('software-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>ASP.NET Core Course</button>
                      <button onClick={() => handleNavClick('software-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>IOS & Android Mobile App Development</button>
                    </div>

                    {/* Col 5 */}
                    <div className="mega-col">
                      <h4 className="mega-title" onClick={() => handleNavClick('programming-courses')} style={{ cursor: 'pointer' }}>
                        <Terminal size={15} color="#FF6B00" /> Programming Language
                      </h4>
                      <button onClick={() => handleNavClick('programming-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>C Programming Training</button>
                      <button onClick={() => handleNavClick('programming-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Object-Oriented Programming</button>
                      <button onClick={() => handleNavClick('programming-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Java Programming Training</button>
                      <button onClick={() => handleNavClick('programming-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Python Programming Training</button>
                      <button onClick={() => handleNavClick('programming-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Programming Language With C, C++, Java</button>
                    </div>

                    {/* Col 6 */}
                    <div className="mega-col">
                      <h4 className="mega-title" onClick={() => handleNavClick('others-courses')} style={{ cursor: 'pointer' }}>
                        <Laptop size={15} color="#FF6B00" /> Others
                      </h4>
                      <button onClick={() => handleNavClick('others-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Freelancing & Outsourcing</button>
                      <button onClick={() => handleNavClick('others-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Microsoft Office Management</button>
                      <button onClick={() => handleNavClick('others-courses')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Advanced Microsoft Excel</button>
                    </div>
                  </div>
                </div>
              )}
            </li>

            {/* Services Main Link & Mega Dropdown */}
            <li 
              className="nav-item"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => handleNavClick('services')} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Services <ChevronDown size={14} />
              </button>
              {activeDropdown === 'services' && (
                <div className="mega-menu">
                  <div className="mega-grid mega-grid-4">
                    {/* Col 1 */}
                    <div className="mega-col">
                      <h4 className="mega-title" onClick={() => handleNavClick('web-services')} style={{ cursor: 'pointer' }}>
                        <Monitor size={15} color="#00B4D8" /> Website Design
                      </h4>
                      <button onClick={() => handleNavClick('web-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Static Website Design</button>
                      <button onClick={() => handleNavClick('web-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>eCommerce Website Development</button>
                      <button onClick={() => handleNavClick('web-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Website Maintenance</button>
                      <button onClick={() => handleNavClick('web-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Website Development</button>
                      <button onClick={() => handleNavClick('web-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>WordPress Website Development</button>
                      <button onClick={() => handleNavClick('web-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Resort Website Design And Development</button>
                      <button onClick={() => handleNavClick('web-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Dynamic Website Development</button>
                    </div>

                    {/* Col 2 */}
                    <div className="mega-col">
                      <h4 className="mega-title" onClick={() => handleNavClick('marketing-services')} style={{ cursor: 'pointer' }}>
                        <Megaphone size={15} color="#00B4D8" /> Digital Marketing Services
                      </h4>
                      <button onClick={() => handleNavClick('marketing-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Digital Marketing</button>
                      <button onClick={() => handleNavClick('marketing-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>SEO Services</button>
                      <button onClick={() => handleNavClick('marketing-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Social Media Marketing</button>
                      <button onClick={() => handleNavClick('marketing-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Facebook Boosting Service</button>
                    </div>

                    {/* Col 3 */}
                    <div className="mega-col">
                      <h4 className="mega-title" onClick={() => handleNavClick('software-services')} style={{ cursor: 'pointer' }}>
                        <Server size={15} color="#00B4D8" /> Software Development Services
                      </h4>
                      <button onClick={() => handleNavClick('software-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>HR Management</button>
                      <button onClick={() => handleNavClick('software-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>CRM Software</button>
                      <button onClick={() => handleNavClick('software-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Payroll Management</button>
                      <button onClick={() => handleNavClick('software-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Account Management</button>
                      <button onClick={() => handleNavClick('software-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Diagnostic Center Management</button>
                      <button onClick={() => handleNavClick('software-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>School Management</button>
                      <button onClick={() => handleNavClick('software-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Inventory Management</button>
                      <button onClick={() => handleNavClick('software-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>POS for Super Shop</button>
                    </div>

                    {/* Col 4 */}
                    <div className="mega-col">
                      <h4 className="mega-title" onClick={() => handleNavClick('other-services')} style={{ cursor: 'pointer' }}>
                        <Settings size={15} color="#00B4D8" /> Others
                      </h4>
                      <button onClick={() => handleNavClick('other-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>IT Consulting Service</button>
                      <button onClick={() => handleNavClick('other-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Mobile Apps Development</button>
                      <button onClick={() => handleNavClick('other-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Architectural Design</button>
                      <button onClick={() => handleNavClick('other-services')} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Graphic Design</button>
                    </div>
                  </div>
                </div>
              )}
            </li>

            <li className="nav-item">
              <button 
                onClick={() => handleNavClick('home', 'blogs')} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Blog
              </button>
            </li>
            
            <li className="nav-item">
              <button 
                onClick={() => handleNavClick('home', 'contact')} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Contact Us
              </button>
            </li>
          </ul>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => onOpenQuote()} className="btn-secondary" style={{ display: 'none', md: 'inline-flex' }}>
              <Briefcase size={16} /> Get Quote
            </button>
            <button onClick={() => onOpenAdmission()} className="btn-primary">
              <GraduationCap size={18} /> Online Admission
            </button>

            {/* Mobile Toggle Button */}
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '110px',
          left: 0,
          right: 0,
          bottom: 0,
          background: '#0F172A',
          color: 'white',
          zIndex: 999,
          padding: '24px',
          overflowY: 'auto'
        }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <li><button onClick={() => handleNavClick('home')} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Home</button></li>
            <li><button onClick={() => handleNavClick('about-us')} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>About Us Hub</button></li>
            <li><button onClick={() => handleNavClick('courses')} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Training Courses Hub</button></li>
            <li><button onClick={() => handleNavClick('services')} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Services Hub</button></li>
            <li><button onClick={() => handleNavClick('web-services')} style={{ fontSize: '1rem', fontWeight: 600, color: '#94A3B8', paddingLeft: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>— Web Design & Dev Services</button></li>
            <li><button onClick={() => handleNavClick('marketing-services')} style={{ fontSize: '1rem', fontWeight: 600, color: '#94A3B8', paddingLeft: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>— Digital Marketing Services</button></li>
            <li><button onClick={() => handleNavClick('software-services')} style={{ fontSize: '1rem', fontWeight: 600, color: '#94A3B8', paddingLeft: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>— Enterprise Software Systems</button></li>
            <li><button onClick={() => handleNavClick('other-services')} style={{ fontSize: '1rem', fontWeight: 600, color: '#94A3B8', paddingLeft: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>— IT Consulting Services</button></li>
            <li><button onClick={() => handleNavClick('home', 'blogs')} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Blog</button></li>
            <li><button onClick={() => handleNavClick('home', 'contact')} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Contact Us</button></li>
            <li style={{ paddingTop: '20px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => { setMobileMenuOpen(false); onOpenAdmission(); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <GraduationCap size={18} /> Online Admission
              </button>
              <button onClick={() => { setMobileMenuOpen(false); onOpenQuote(); }} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                <Briefcase size={16} /> Request Quotation
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
