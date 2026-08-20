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
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProfile from './components/admin/AdminProfile';
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

// Student Portal Components
import StudentLayout from './components/student/StudentLayout';
import StudentDashboard from './components/student/StudentDashboard';
import StudentProfile from './components/student/StudentProfile';
import StudentCourses from './components/student/StudentCourses';
import StudentEnrollments from './components/student/StudentEnrollments';
import StudentPayments from './components/student/StudentPayments';
import StudentCertificates from './components/student/StudentCertificates';
import StudentProjects from './components/student/StudentProjects';
import StudentMessages from './components/student/StudentMessages';
import StudentNotifications from './components/student/StudentNotifications';
import StudentSettings from './components/student/StudentSettings';

// Client Portal Components
import ClientLayout from './components/client/ClientLayout';
import ClientDashboard from './components/client/ClientDashboard';
import ClientProfile from './components/client/ClientProfile';
import ClientProjects from './components/client/ClientProjects';
import ClientProjectRequest from './components/client/ClientProjectRequest';
import ClientPayments from './components/client/ClientPayments';
import ClientMessages from './components/client/ClientMessages';
import ClientNotifications from './components/client/ClientNotifications';
import ClientSettings from './components/client/ClientSettings';

import { ShieldAlert, LogIn, Lock } from 'lucide-react';
import { getBackendUrl, adminFetch } from './utils/adminApi';

// Synchronous Route Parser (Ensures initial render never flashes or defaults to home on /admin, /student, or /client)
const parseCurrentRoute = () => {
  if (typeof window === 'undefined') return { page: 'home', subPage: 'dashboard' };

  const pathname = (window.location.pathname || '').trim().toLowerCase();
  const hash = (window.location.hash || '').trim().toLowerCase();
  
  const cleanPath = pathname.split('?')[0].split('#')[0].replace(/^\/+/, '').replace(/\/+$/, '');
  const cleanHash = hash.replace(/^#\/?/, '').split('?')[0].replace(/\/+$/, '');
  const route = cleanPath || cleanHash;

  // 1. TOP PRIORITY: Explicit Admin Route Matching (/admin, /admin/services, /admin/courses, etc.)
  if (route === 'admin' || route.startsWith('admin/') || route === 'admin-services') {
    if (route === 'admin-services') {
      return { page: 'admin', subPage: 'services' };
    }
    const parts = route.split('/');
    const sub = parts[1] || 'dashboard';
    return { page: 'admin', subPage: sub };
  }

  // 2. Student Portal Route Matching (/student, /student/courses, /student/profile, etc.)
  if (route === 'student' || route.startsWith('student/')) {
    const parts = route.split('/');
    const sub = parts[1] || 'dashboard';
    return { page: 'student', subPage: sub };
  }

  // 3. Client Portal Route Matching (/client, /client/projects, /client/profile, etc.)
  if (route === 'client' || route.startsWith('client/')) {
    const parts = route.split('/');
    const sub = parts[1] || 'dashboard';
    return { page: 'client', subPage: sub };
  }

  // 4. Certificate Verification Route
  if (route.startsWith('certificate/')) {
    return { page: route, subPage: 'dashboard' };
  }

  // 5. Known Public Pages
  const validPages = [
    'about-us', 'company-profile', 'md-message', 'team', 'our-clients', 'senior-software-developer-tanvir-hossain-khan',
    'video-editor-nashimul-hasan-nibir', 'sr-social-media-marketer-naimur-rahman-naim',
    'jr-social-media-marketer-fahim-hasan-jidan', 'jr-social-media-marketer-hridoy-hasan',
    'courses', 'web-courses', 'graphics-courses', 'marketing-courses',
    'software-courses', 'programming-courses', 'others-courses',
    'services', 'web-services', 'marketing-services', 'software-services', 'other-services',
    'cert-verification', 'payment/success', 'payment/fail', 'payment/cancel',
    'terms-and-conditions', 'privacy-policy', 'refund-policy', 'delivery-policy'
  ];

  if (validPages.includes(route)) {
    return { page: route, subPage: 'dashboard' };
  }

  return { page: 'home', subPage: 'dashboard' };
};

export default function App() {
  const initialRoute = parseCurrentRoute();
  const [currentPage, setCurrentPage] = useState(initialRoute.page); 
  const [adminSubPage, setAdminSubPage] = useState(initialRoute.page === 'admin' ? initialRoute.subPage : 'dashboard');
  const [studentSubPage, setStudentSubPage] = useState(initialRoute.page === 'student' ? initialRoute.subPage : 'dashboard');
  const [clientSubPage, setClientSubPage] = useState(initialRoute.page === 'client' ? initialRoute.subPage : 'dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Strict Backend-Authoritative Authentication State (Default: null)
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('student');
  const [pendingAction, setPendingAction] = useState(null); // { type: 'course' | 'quote', payload: any }

  // Modal States
  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // STARTUP AUTHENTICATION SESSION RESTORE & VERIFICATION (Strict HttpOnly Cookie Check)
  useEffect(() => {
    const verifyAuthSession = async () => {
      try {
        const res = await adminFetch('/api/auth/me');
        const data = await res.json();

        // ONLY set authenticated currentUser when the backend HttpOnly cookie is verified!
        if (data.success && data.authenticated && data.user) {
          const normalizedUser = {
            ...data.user,
            role: typeof data.user.role === 'string' ? data.user.role.trim().toLowerCase() : data.user.role
          };
          setCurrentUser(normalizedUser);
          localStorage.setItem('msit_user', JSON.stringify(normalizedUser));
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

  // URL BROWSER ROUTER SYNC (Supports /admin, /student, /client, and public routes)
  useEffect(() => {
    const syncPageFromUrl = () => {
      const routeInfo = parseCurrentRoute();
      setCurrentPage(routeInfo.page);
      if (routeInfo.page === 'admin') setAdminSubPage(routeInfo.subPage);
      if (routeInfo.page === 'student') setStudentSubPage(routeInfo.subPage);
      if (routeInfo.page === 'client') setClientSubPage(routeInfo.subPage);

      const rawPath = (window.location.pathname || '').replace(/^\/+/, '').replace(/\/+$/, '');
      if (rawPath === 'admin-services') {
        window.history.replaceState(null, '', '/admin/services');
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

  const handleAdminSubNavigate = (subPageId) => {
    setAdminSubPage(subPageId);
    const newPath = subPageId === 'dashboard' ? '/admin' : `/admin/${subPageId}`;
    window.history.pushState(null, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStudentSubNavigate = (subPageId) => {
    setStudentSubPage(subPageId);
    const newPath = subPageId === 'dashboard' ? '/student' : `/student/${subPageId}`;
    window.history.pushState(null, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClientSubNavigate = (subPageId) => {
    setClientSubPage(subPageId);
    const newPath = subPageId === 'dashboard' ? '/client' : `/client/${subPageId}`;
    window.history.pushState(null, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmission = (course = null) => {
    if (!currentUser) {
      setPendingAction({ type: 'course', payload: course });
      setAuthInitialRole('student');
      setAuthModalOpen(true);
      return;
    }

    setSelectedCourse(course);
    setAdmissionOpen(true);
  };

  const handleOpenQuote = (service = null) => {
    if (!currentUser) {
      setPendingAction({ type: 'quote', payload: service });
      setAuthInitialRole('client');
      setAuthModalOpen(true);
      return;
    }

    setSelectedService(service);
    setQuoteOpen(true);
  };

  const handleLoginSuccess = (userObj) => {
    const normalizedUser = userObj ? {
      ...userObj,
      role: typeof userObj.role === 'string' ? userObj.role.trim().toLowerCase() : userObj.role
    } : null;

    setCurrentUser(normalizedUser);
    if (normalizedUser) {
      localStorage.setItem('msit_user', JSON.stringify(normalizedUser));
    }
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
      return;
    }

    // Role-based automatic redirect on successful login
    if (normalizedUser) {
      if (normalizedUser.role === 'admin') {
        setCurrentPage('admin');
        setAdminSubPage('dashboard');
        window.history.pushState(null, '', '/admin');
      } else if (normalizedUser.role === 'student') {
        setCurrentPage('student');
        setStudentSubPage('dashboard');
        window.history.pushState(null, '', '/student');
      } else if (normalizedUser.role === 'client') {
        setCurrentPage('client');
        setClientSubPage('dashboard');
        window.history.pushState(null, '', '/client');
      }
    }
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('msit_user');
    localStorage.removeItem('msit_token');
    setCurrentPage('home');
    window.history.pushState(null, '', '/');

    try {
      await adminFetch('/api/auth/logout', {
        method: 'POST'
      });
    } catch (err) {
      console.log('Logout API call notice:', err);
    }
  };

  const handleScrollToCert = () => {
    handleNavigate('cert-verification');
  };

  // 1. Certificate Verification Route Check
  const pathname = (typeof window !== 'undefined' ? window.location.pathname : '').trim().toLowerCase();
  const hash = (typeof window !== 'undefined' ? window.location.hash : '').trim().toLowerCase();
  const cleanWindowPath = pathname.split('?')[0].split('#')[0].replace(/^\/+/, '').replace(/\/+$/, '');
  const cleanWindowHash = hash.replace(/^#\/?/, '').split('?')[0].replace(/\/+$/, '');
  const currentPathOrHash = cleanWindowPath || cleanWindowHash;

  if (currentPathOrHash.startsWith('certificate/')) {
    return <PublicCertificateVerification />;
  }

  // 2. TOP PRIORITY: Render Protected Admin Area
  const isAdminRoute = currentPage === 'admin' || 
    currentPathOrHash === 'admin' || 
    currentPathOrHash.startsWith('admin/') || 
    currentPathOrHash === 'admin-services';

  if (isAdminRoute) {
    // 1. Session Verification Loading Spinner
    if (authLoading) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#070A12',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(0, 180, 216, 0.2)',
            borderTopColor: '#00B4D8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', fontWeight: 600 }}>
            Verifying Administrator Privileges...
          </p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    // 2. Unauthenticated Visitor -> Render Dedicated Admin Login Page Directly
    if (!currentUser) {
      return (
        <AdminLoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigate={handleNavigate}
        />
      );
    }

    // 3. Authenticated Non-Admin User (Student or Client attempting /admin) -> Render Access Denied
    const userRole = (currentUser?.role || '').toString().trim().toLowerCase();
    if (userRole !== 'admin') {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#070A12',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            color: '#F59E0B'
          }}>
            <ShieldAlert size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
            Access Denied: Administrator Access Required
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '480px', marginBottom: '24px', lineHeight: 1.6 }}>
            Logged in as <strong style={{ color: '#00B4D8' }}>{currentUser.name}</strong> ({userRole || 'user'}). Your current user account does not possess administrator privileges.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => handleNavigate(userRole === 'student' ? 'student' : (userRole === 'client' ? 'client' : 'home'))}
              className="btn-primary"
              style={{ padding: '12px 24px', fontWeight: 700, borderRadius: '10px' }}
            >
              Go to Authorized Dashboard
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Switch Account (Logout)
            </button>
          </div>
        </div>
      );
    }

    // 4. Authenticated Admin -> Render Full Admin Layout & Modules
    return (
      <AdminLayout
        currentUser={currentUser}
        authLoading={authLoading}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
        onNavigate={handleNavigate}
        activeSubPage={adminSubPage}
        onSelectSubPage={handleAdminSubNavigate}
      >
        {(adminSubPage === 'dashboard' || !adminSubPage) && <AdminDashboard onSelectSubPage={handleAdminSubNavigate} />}
        {adminSubPage === 'profile' && <AdminProfile currentUser={currentUser} onUpdateCurrentUser={handleLoginSuccess} />}
        {adminSubPage === 'services' && <AdminServices />}
        {adminSubPage === 'users' && <AdminUsers initialRoleFilter="all" />}
        {adminSubPage === 'students' && <AdminStudents />}
        {adminSubPage === 'clients' && <AdminClients />}
        {adminSubPage === 'admins' && <AdminAdmins />}
        {['settings', 'homepage', 'contact-info', 'global-settings'].includes(adminSubPage) && <AdminSiteSettings />}
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
        {!['dashboard', 'profile', 'users', 'students', 'clients', 'admins', 'settings', 'homepage', 'contact-info', 'global-settings', 'services', 'courses', 'enrollments', 'certificates', 'payments', 'projects', 'team', 'testimonials', 'faqs', 'blog', 'pages', 'media', 'messages', 'notifications', 'announcements', 'activity-logs'].includes(adminSubPage) && (
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
    );
  }

  // 3. STUDENT PORTAL ROUTE
  const isStudentRoute = currentPage === 'student' || 
    currentPathOrHash === 'student' || 
    currentPathOrHash.startsWith('student/');

  if (isStudentRoute) {
    if (authLoading) {
      return (
        <div style={{ minHeight: '100vh', background: '#070A12', color: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid rgba(0, 180, 216, 0.2)', borderTopColor: '#00B4D8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', fontWeight: 600 }}>Loading Student Portal...</p>
        </div>
      );
    }

    if (!currentUser) {
      return (
        <div style={{ minHeight: '100vh', background: '#070A12', color: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '400px', width: '100%', background: '#0B1120', padding: '32px 24px', borderRadius: '16px', border: '1px solid rgba(0, 180, 216, 0.3)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(0, 180, 216, 0.12)', border: '1px solid rgba(0, 180, 216, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#00B4D8' }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>Student Login Required</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '20px' }}>Please log in to your student account to access your courses, certificates, and academic portal.</p>
            <button
              onClick={() => {
                setAuthInitialRole('student');
                setAuthModalOpen(true);
              }}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#00B4D8', color: '#070A12', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', border: 'none', marginBottom: '10px' }}
            >
              Log In as Student
            </button>
            <button
              onClick={() => handleNavigate('home')}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'transparent', color: '#94A3B8', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              Return to Website
            </button>
          </div>
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            initialRole="student"
          />
        </div>
      );
    }

    const userRole = (currentUser?.role || '').toString().trim().toLowerCase();
    if (userRole !== 'student') {
      return (
        <div style={{ minHeight: '100vh', background: '#070A12', color: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '440px', background: '#0B1120', padding: '32px 24px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EF4444', marginBottom: '10px' }}>Access Denied</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '20px' }}>Student privileges are required to access this portal. Your active role is <strong>{userRole}</strong>.</p>
            <button onClick={() => handleNavigate(userRole === 'admin' ? 'admin' : (userRole === 'client' ? 'client' : 'home'))} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#00B4D8', color: '#070A12', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Go to Authorized Dashboard
            </button>
          </div>
        </div>
      );
    }

    return (
      <StudentLayout
        currentUser={currentUser}
        activeSubPage={studentSubPage || 'dashboard'}
        onSelectSubPage={handleStudentSubNavigate}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      >
        {(studentSubPage === 'dashboard' || !studentSubPage) && <StudentDashboard onSelectSubPage={handleStudentSubNavigate} onNavigate={handleNavigate} />}
        {studentSubPage === 'profile' && <StudentProfile currentUser={currentUser} onUpdateCurrentUser={handleLoginSuccess} />}
        {studentSubPage === 'courses' && <StudentCourses onNavigate={handleNavigate} />}
        {studentSubPage === 'enrollments' && <StudentEnrollments onNavigate={handleNavigate} onSelectSubPage={handleStudentSubNavigate} />}
        {studentSubPage === 'payments' && <StudentPayments />}
        {studentSubPage === 'certificates' && <StudentCertificates onNavigate={handleNavigate} />}
        {studentSubPage === 'projects' && <StudentProjects />}
        {studentSubPage === 'messages' && <StudentMessages />}
        {studentSubPage === 'notifications' && <StudentNotifications />}
        {studentSubPage === 'settings' && <StudentSettings currentUser={currentUser} />}
      </StudentLayout>
    );
  }

  // 4. CLIENT PORTAL ROUTE
  const isClientRoute = currentPage === 'client' || 
    currentPathOrHash === 'client' || 
    currentPathOrHash.startsWith('client/');

  if (isClientRoute) {
    if (authLoading) {
      return (
        <div style={{ minHeight: '100vh', background: '#070A12', color: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid rgba(255, 107, 0, 0.2)', borderTopColor: '#FF6B00', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', fontWeight: 600 }}>Loading Enterprise Client Portal...</p>
        </div>
      );
    }

    if (!currentUser) {
      return (
        <div style={{ minHeight: '100vh', background: '#070A12', color: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '400px', width: '100%', background: '#0B1120', padding: '32px 24px', borderRadius: '16px', border: '1px solid rgba(255, 107, 0, 0.3)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255, 107, 0, 0.12)', border: '1px solid rgba(255, 107, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#FF6B00' }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>Client Login Required</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '20px' }}>Please log in to your corporate client account to track software projects, invoices, and deliverables.</p>
            <button
              onClick={() => {
                setAuthInitialRole('client');
                setAuthModalOpen(true);
              }}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#FF6B00', color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', border: 'none', marginBottom: '10px' }}
            >
              Log In as Corporate Client
            </button>
            <button
              onClick={() => handleNavigate('home')}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'transparent', color: '#94A3B8', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              Return to Website
            </button>
          </div>
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            initialRole="client"
          />
        </div>
      );
    }

    const userRole = (currentUser?.role || '').toString().trim().toLowerCase();
    if (userRole !== 'client') {
      return (
        <div style={{ minHeight: '100vh', background: '#070A12', color: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '440px', background: '#0B1120', padding: '32px 24px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EF4444', marginBottom: '10px' }}>Access Denied</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '20px' }}>Corporate Client privileges are required to access this portal. Your active role is <strong>{userRole}</strong>.</p>
            <button onClick={() => handleNavigate(userRole === 'admin' ? 'admin' : (userRole === 'student' ? 'student' : 'home'))} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#FF6B00', color: '#FFFFFF', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Go to Authorized Dashboard
            </button>
          </div>
        </div>
      );
    }

    return (
      <ClientLayout
        currentUser={currentUser}
        activeSubPage={clientSubPage || 'dashboard'}
        onSelectSubPage={handleClientSubNavigate}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      >
        {(clientSubPage === 'dashboard' || !clientSubPage) && <ClientDashboard onSelectSubPage={handleClientSubNavigate} onNavigate={handleNavigate} />}
        {clientSubPage === 'profile' && <ClientProfile currentUser={currentUser} onUpdateCurrentUser={handleLoginSuccess} />}
        {clientSubPage === 'projects' && <ClientProjects onSelectSubPage={handleClientSubNavigate} />}
        {clientSubPage === 'new-project' && <ClientProjectRequest onSelectSubPage={handleClientSubNavigate} />}
        {clientSubPage === 'payments' && <ClientPayments />}
        {clientSubPage === 'messages' && <ClientMessages />}
        {clientSubPage === 'notifications' && <ClientNotifications />}
        {clientSubPage === 'settings' && <ClientSettings currentUser={currentUser} />}
      </ClientLayout>
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
        initialRole={authInitialRole}
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
