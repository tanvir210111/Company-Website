import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import CoursesSection from './components/CoursesSection';
import ServicesSection from './components/ServicesSection';
import CertVerifier from './components/CertVerifier';
import TestimonialsSection from './components/TestimonialsSection';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdmissionModal from './components/AdmissionModal';
import QuoteModal from './components/QuoteModal';
import AuthModal from './components/AuthModal';
import FloatingWidget from './components/FloatingWidget';

// About Sub-Pages
import AboutUsPage from './pages/AboutUsPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import MdMessagePage from './pages/MdMessagePage';
import TeamPage from './pages/TeamPage';
import OurClientsPage from './pages/OurClientsPage';
import TanvirProfilePage from './pages/TanvirProfilePage';
import NibirProfilePage from './pages/NibirProfilePage';
import NaimProfilePage from './pages/NaimProfilePage';
import JidanProfilePage from './pages/JidanProfilePage';
import HridoyProfilePage from './pages/HridoyProfilePage';

// Course Pages
import CoursesPage from './pages/CoursesPage';
import WebDevCoursesPage from './pages/WebDevCoursesPage';
import GraphicsCoursesPage from './pages/GraphicsCoursesPage';
import DigitalMarketingCoursesPage from './pages/DigitalMarketingCoursesPage';
import SoftwareDevCoursesPage from './pages/SoftwareDevCoursesPage';
import ProgrammingCoursesPage from './pages/ProgrammingCoursesPage';
import OthersCoursesPage from './pages/OthersCoursesPage';

// Service Pages
import ServicesPage from './pages/ServicesPage';
import WebServicesPage from './pages/WebServicesPage';
import DigitalMarketingServicesPage from './pages/DigitalMarketingServicesPage';
import SoftwareServicesPage from './pages/SoftwareServicesPage';
import OtherServicesPage from './pages/OtherServicesPage';

// Certificate Verification Dedicated Page
import CertVerificationPage from './pages/CertVerificationPage';

// SSLCommerz Payment Result Pages
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailPage from './pages/PaymentFailPage';
import PaymentCancelPage from './pages/PaymentCancelPage';

// SSLCommerz Compliance Pages
import TermsConditionsPage from './pages/TermsConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import DeliveryPolicyPage from './pages/DeliveryPolicyPage';

// Public Page Components
import FAQSection from './components/FAQSection';

import DynamicPage from './pages/DynamicPage';

// Admin Panel Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminStudents from './components/admin/AdminStudents';
import AdminClients from './components/admin/AdminClients';
import AdminAdmins from './components/admin/AdminAdmins';
import AdminSiteSettings from './components/admin/AdminSiteSettings';
import AdminServices from './components/admin/AdminServices';
import AdminCourses from './components/admin/AdminCourses';
import AdminEnrollments from './components/admin/AdminEnrollments';
import AdminPayments from './components/admin/AdminPayments';
import AdminProjects from './components/admin/AdminProjects';
import AdminTeam from './components/admin/AdminTeam';
import AdminTestimonials from './components/admin/AdminTestimonials';
import AdminFAQs from './components/admin/AdminFAQs';
import AdminBlog from './components/admin/AdminBlog';
import AdminPages from './components/admin/AdminPages';
import AdminMedia from './components/admin/AdminMedia';
import AdminCertificates from './components/admin/AdminCertificates';
import AdminMessages from './components/admin/AdminMessages';
import AdminNotifications from './components/admin/AdminNotifications';
import AdminAnnouncements from './components/admin/AdminAnnouncements';
import AdminActivityLogs from './components/admin/AdminActivityLogs';
import PublicCertificateVerification from './pages/PublicCertificateVerification';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  
  // Strict Backend-Authoritative Authentication State (Default: null)
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('student');
  const [pendingAction, setPendingAction] = useState(null); // { type: 'course' | 'quote', payload: any }
  const [adminSubPage, setAdminSubPage] = useState('dashboard');

  // Modal States
  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // STARTUP AUTHENTICATION SESSION RESTORE & VERIFICATION (Strict HttpOnly Cookie Check)
  useEffect(() => {
    const verifyAuthSession = async () => {
      try {
        const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const res = await fetch(`${backendUrl}/api/auth/me`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        const data = await res.json();

        // ONLY set authenticated currentUser when the backend HttpOnly cookie is verified!
        if (data.success && data.authenticated && data.user) {
          setCurrentUser(data.user);
          localStorage.setItem('msit_user', JSON.stringify(data.user));
        } else {
          // If backend responds unauthenticated or token expired, purge local storage & remain logged out
          setCurrentUser(null);
          localStorage.removeItem('msit_user');
          localStorage.removeItem('msit_token');
        }
      } catch (err) {
        console.log('Session verification notice:', err);
        // On network error or offline state, do NOT grant authenticated access based on local storage
        setCurrentUser(null);
        localStorage.removeItem('msit_user');
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuthSession();
  }, []);

  // URL BROWSER ROUTER SYNC (100% Clean Path Routing /team, /senior-software-developer-tanvir-hossain-khan)
  useEffect(() => {
    const syncPageFromUrl = () => {
      const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
      const hash = window.location.hash.replace('#', '');
      const route = path || hash;
      const validPages = [
        'about-us', 'company-profile', 'md-message', 'team', 'our-clients', 'senior-software-developer-tanvir-hossain-khan',
        'video-editor-nashimul-hasan-nibir', 'sr-social-media-marketer-naimur-rahman-naim',
        'jr-social-media-marketer-fahim-hasan-jidan', 'jr-social-media-marketer-hridoy-hasan',
        'courses', 'web-courses', 'graphics-courses', 'marketing-courses',
        'software-courses', 'programming-courses', 'others-courses',
        'services', 'web-services', 'marketing-services', 'software-services', 'other-services',
        'cert-verification', 'payment/success', 'payment/fail', 'payment/cancel',
        'terms-and-conditions', 'privacy-policy', 'refund-policy', 'delivery-policy', 'admin'
      ];

      if (route.startsWith('admin')) {
        setCurrentPage('admin');
      } else if (validPages.includes(route)) {
        setCurrentPage(route);
      } else {
        setCurrentPage('home');
      }
    };

    syncPageFromUrl();
    window.addEventListener('popstate', syncPageFromUrl);
    return () => {
      window.removeEventListener('popstate', syncPageFromUrl);
    };
  }, []);

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    if (pageId === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `/${pageId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmission = (course = null) => {
    if (!currentUser) {
      setPendingAction({ type: 'course', payload: course });
      setAuthModalOpen(true);
      return;
    }

    setSelectedCourse(course);
    setAdmissionOpen(true);
  };

  const handleOpenQuote = (service = null) => {
    if (!currentUser) {
      setPendingAction({ type: 'quote', payload: service });
      setAuthModalOpen(true);
      return;
    }

    setSelectedService(service);
    setQuoteOpen(true);
  };

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('msit_user', JSON.stringify(userObj));
    setAuthModalOpen(false);

    if (pendingAction) {
      if (pendingAction.type === 'course') {
        setSelectedCourse(pendingAction.payload);
        setAdmissionOpen(true);
      } else if (pendingAction.type === 'quote') {
        setSelectedService(pendingAction.payload);
        setQuoteOpen(true);
      }
      setPendingAction(null);
    }
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('msit_user');
    localStorage.removeItem('msit_token');

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.log('Logout API call notice:', err);
    }
  };

  const handleScrollToCert = () => {
    handleNavigate('cert-verification');
  };

  // Render Public Certificate Verification if path is /certificate/:certificateNumber
  if (window.location.pathname.startsWith('/certificate/')) {
    return <PublicCertificateVerification />;
  }

  // Render Protected Admin Layout if current route is /admin
  if (currentPage === 'admin') {
    return (
      <>
        <AdminLayout
          currentUser={currentUser}
          authLoading={authLoading}
          onLogout={handleLogout}
          onOpenAuth={(role = 'admin') => {
            setAuthInitialRole(role);
            setAuthModalOpen(true);
          }}
          onNavigate={handleNavigate}
          activeSubPage={adminSubPage}
          onSelectSubPage={setAdminSubPage}
        >
          {adminSubPage === 'dashboard' && <AdminDashboard onSelectSubPage={setAdminSubPage} />}
          {adminSubPage === 'users' && <AdminUsers initialRoleFilter="all" />}
          {adminSubPage === 'students' && <AdminStudents />}
          {adminSubPage === 'clients' && <AdminClients />}
          {adminSubPage === 'admins' && <AdminAdmins />}
          {['settings', 'homepage', 'contact-info', 'global-settings'].includes(adminSubPage) && <AdminSiteSettings />}
          {adminSubPage === 'services' && <AdminServices />}
          {adminSubPage === 'courses' && <AdminCourses />}
          {adminSubPage === 'enrollments' && <AdminEnrollments />}
          {adminSubPage === 'certificates' && <AdminCertificates />}
          {adminSubPage === 'payments' && <AdminPayments />}
          {adminSubPage === 'projects' && <AdminProjects />}
          {adminSubPage === 'team' && <AdminTeam />}
          {adminSubPage === 'testimonials' && <AdminTestimonials />}
          {adminSubPage === 'faqs' && <AdminFAQs />}
          {adminSubPage === 'blog' && <AdminBlog />}
          {adminSubPage === 'pages' && <AdminPages />}
          {adminSubPage === 'media' && <AdminMedia />}
          {adminSubPage === 'messages' && <AdminMessages />}
          {adminSubPage === 'notifications' && <AdminNotifications />}
          {adminSubPage === 'announcements' && <AdminAnnouncements />}
          {adminSubPage === 'activity-logs' && <AdminActivityLogs />}
          {!['dashboard', 'users', 'students', 'clients', 'admins', 'settings', 'homepage', 'contact-info', 'global-settings', 'services', 'courses', 'enrollments', 'certificates', 'payments', 'projects', 'team', 'testimonials', 'faqs', 'blog', 'pages', 'media', 'messages', 'notifications', 'announcements', 'activity-logs'].includes(adminSubPage) && (
            <div style={{ padding: '30px', background: '#0B1120', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', textTransform: 'capitalize' }}>
                {adminSubPage} Module
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                Management module for <strong>{adminSubPage}</strong> is ready for configuration.
              </p>
            </div>
          )}
        </AdminLayout>

        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          pendingAction={pendingAction}
          initialRole={authInitialRole}
        />
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        onOpenAdmission={handleOpenAdmission} 
        onOpenQuote={handleOpenQuote}
        onScrollToCert={handleScrollToCert}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <>
            <Hero 
              onOpenAdmission={handleOpenAdmission}
              onOpenQuote={handleOpenQuote}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <AboutSection />

            <CoursesSection 
              onOpenAdmission={handleOpenAdmission}
              searchQuery={searchQuery}
            />

            <ServicesSection 
              onOpenQuote={handleOpenQuote}
            />

            <CertVerifier onNavigate={handleNavigate} />

            <TestimonialsSection />

            <BlogSection />

            <FAQSection />

            <ContactSection />
          </>
        )}

        {/* Certificate Verification Page */}
        {currentPage === 'cert-verification' && (
          <CertVerificationPage 
            onNavigate={handleNavigate} 
          />
        )}

        {/* About Pages */}
        {currentPage === 'about-us' && (
          <AboutUsPage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission} 
          />
        )}

        {currentPage === 'company-profile' && (
          <CompanyProfilePage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission} 
          />
        )}

        {currentPage === 'md-message' && (
          <MdMessagePage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission} 
          />
        )}

        {currentPage === 'team' && (
          <TeamPage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission} 
          />
        )}

        {currentPage === 'senior-software-developer-tanvir-hossain-khan' && (
          <TanvirProfilePage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission} 
            onOpenQuote={handleOpenQuote}
          />
        )}

        {currentPage === 'video-editor-nashimul-hasan-nibir' && (
          <NibirProfilePage 
            onNavigate={handleNavigate} 
            onOpenQuote={handleOpenQuote}
          />
        )}

        {currentPage === 'sr-social-media-marketer-naimur-rahman-naim' && (
          <NaimProfilePage 
            onNavigate={handleNavigate} 
            onOpenQuote={handleOpenQuote}
          />
        )}

        {currentPage === 'jr-social-media-marketer-fahim-hasan-jidan' && (
          <JidanProfilePage 
            onNavigate={handleNavigate} 
            onOpenQuote={handleOpenQuote}
          />
        )}

        {currentPage === 'jr-social-media-marketer-hridoy-hasan' && (
          <HridoyProfilePage 
            onNavigate={handleNavigate} 
            onOpenQuote={handleOpenQuote}
          />
        )}

        {currentPage === 'our-clients' && (
          <OurClientsPage 
            onNavigate={handleNavigate} 
            onOpenQuote={handleOpenQuote} 
          />
        )}

        {/* Course Pages */}
        {currentPage === 'courses' && (
          <CoursesPage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission}
          />
        )}

        {currentPage === 'web-courses' && (
          <WebDevCoursesPage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission}
          />
        )}

        {currentPage === 'graphics-courses' && (
          <GraphicsCoursesPage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission}
          />
        )}

        {currentPage === 'marketing-courses' && (
          <DigitalMarketingCoursesPage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission}
          />
        )}

        {currentPage === 'software-courses' && (
          <SoftwareDevCoursesPage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission}
          />
        )}

        {currentPage === 'programming-courses' && (
          <ProgrammingCoursesPage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission}
          />
        )}

        {currentPage === 'others-courses' && (
          <OthersCoursesPage 
            onNavigate={handleNavigate} 
            onOpenAdmission={handleOpenAdmission}
          />
        )}

        {/* Service Pages */}
        {currentPage === 'services' && (
          <ServicesPage 
            onNavigate={handleNavigate} 
            onOpenQuote={handleOpenQuote}
          />
        )}

        {currentPage === 'web-services' && (
          <WebServicesPage 
            onNavigate={handleNavigate} 
            onOpenQuote={handleOpenQuote}
          />
        )}

        {currentPage === 'marketing-services' && (
          <DigitalMarketingServicesPage 
            onNavigate={handleNavigate} 
            onOpenQuote={handleOpenQuote}
          />
        )}

        {currentPage === 'software-services' && (
          <SoftwareServicesPage 
            onNavigate={handleNavigate} 
            onOpenQuote={handleOpenQuote}
          />
        )}

        {currentPage === 'other-services' && (
          <OtherServicesPage 
            onNavigate={handleNavigate} 
            onOpenQuote={handleOpenQuote}
          />
        )}

        {/* SSLCommerz Payment Result Routes */}
        {currentPage === 'payment/success' && (
          <PaymentSuccessPage 
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'payment/fail' && (
          <PaymentFailPage 
            onNavigate={handleNavigate}
            onOpenAdmission={handleOpenAdmission}
          />
        )}

        {currentPage === 'payment/cancel' && (
          <PaymentCancelPage 
            onNavigate={handleNavigate}
            onOpenAdmission={handleOpenAdmission}
          />
        )}

        {/* SSLCommerz Merchant Compliance Policy Pages */}
        {currentPage === 'terms-and-conditions' && (
          <TermsConditionsPage 
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'privacy-policy' && (
          <PrivacyPolicyPage 
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'refund-policy' && (
          <RefundPolicyPage 
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'delivery-policy' && (
          <DeliveryPolicyPage 
            onNavigate={handleNavigate} 
          />
        )}

        {/* Dynamic CMS Page Fallback Route */}
        {!['home', 'cert-verification', 'about-us', 'company-profile', 'md-message', 'team', 'tanvir-hasan', 'jidan', 'hridoy', 'our-clients', 'courses', 'web-development', 'graphics-design', 'digital-marketing', 'python-django', 'programming-courses', 'others-courses', 'services', 'web-services', 'graphics-services', 'marketing-services', 'others-services', 'payment/success', 'payment/fail', 'payment/cancel', 'terms-and-conditions', 'privacy-policy', 'refund-policy', 'delivery-policy', 'admin'].includes(currentPage) && (
          <DynamicPage 
            slug={currentPage}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <Footer onScrollToCert={handleScrollToCert} onNavigate={handleNavigate} />

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        pendingAction={pendingAction}
      />

      {/* Admission & Payment Modal */}
      <AdmissionModal 
        isOpen={admissionOpen} 
        onClose={() => setAdmissionOpen(false)}
        selectedCourse={selectedCourse}
        currentUser={currentUser}
      />

      {/* Software Quote & Payment Modal */}
      <QuoteModal 
        isOpen={quoteOpen} 
        onClose={() => setQuoteOpen(false)}
        selectedService={selectedService}
        currentUser={currentUser}
      />

      <FloatingWidget />
    </div>
  );
}
