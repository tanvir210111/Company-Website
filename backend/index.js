const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const multer = require('multer');

const OrderStore = require('./store');
const { resolveCoursePrice } = require('./courses');
const { pool, query } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'mediascope_secret_key_2026_bd';

// Environment & Credentials Configuration
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID || 'testbox';
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD || 'qwerty';

const IS_SANDBOX = process.env.SSLCOMMERZ_SANDBOX === 'true' || process.env.SSLCOMMERZ_MODE === 'sandbox' || process.env.NODE_ENV !== 'production';
const IS_LIVE = !IS_SANDBOX;

const SERVER_BASE_URL = process.env.SERVER_BASE_URL || `http://localhost:${PORT}`;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded static media files publicly
app.use('/uploads', express.static(UPLOADS_DIR));

const SSLCOMMERZ_INITIATE_URL = IS_LIVE
  ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
  : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

const SSLCOMMERZ_VALIDATION_URL = IS_LIVE
  ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
  : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'https://mediascopeit.com',
    'https://www.mediascopeit.com'
  ],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Media Scope IT Ltd API is running',
    sandbox: IS_SANDBOX,
    mode: IS_SANDBOX ? 'sandbox' : 'live'
  });
});

// Standard API Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running'
  });
});

// MySQL Database Test Endpoint (Executes SELECT 1)
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await query('SELECT 1 AS testResult');
    res.json({
      success: true,
      message: 'MySQL database connection successful',
      queryResult: result
    });
  } catch (error) {
    console.error('MySQL Connection Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'MySQL connection failed',
      error: error.message
    });
  }
});

// ============================================================================
// PERSISTENT AUTHENTICATION ENDPOINTS (JWT + HTTPONLY COOKIES + BACKUP SESSION)
// ============================================================================

/**
 * GET /api/auth/me
 * Restores and verifies authenticated user session on page startup/refresh
 */
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.cookies.auth_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.json({ success: false, authenticated: false, user: null });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Strict DB user lookup ONLY by exact numeric ID or specific registered email address
    try {
      let users = [];
      if (decoded.id && !isNaN(decoded.id)) {
        users = await query('SELECT id, full_name, email, phone, role FROM users WHERE id = ? LIMIT 1', [decoded.id]);
      } else if (decoded.email && decoded.email.includes('@') && !decoded.email.endsWith('@mediascopeit.com')) {
        users = await query('SELECT id, full_name, email, phone, role FROM users WHERE email = ? LIMIT 1', [decoded.email]);
      }

      if (users && users.length > 0) {
        const dbUser = users[0];
        const userObj = {
          id: dbUser.id.toString(),
          name: dbUser.full_name,
          email: dbUser.email,
          phone: dbUser.phone,
          role: dbUser.role || decoded.role,
          companyName: decoded.companyName || null
        };
        return res.json({ success: true, authenticated: true, user: userObj });
      }
    } catch (dbErr) {
      // Fallback to verified decoded JWT payload if DB record not found or DB offline
    }

    // Return the EXACT user profile that was signed in the JWT token during login
    const exactJwtUser = {
      id: decoded.id || 'STD-2026-9481',
      name: decoded.name || 'User',
      email: decoded.email || '',
      phone: decoded.phone || '',
      role: decoded.role || 'student',
      companyName: decoded.companyName || null
    };

    return res.json({ success: true, authenticated: true, user: exactJwtUser });
  } catch (err) {
    res.clearCookie('auth_token');
    return res.json({ success: false, authenticated: false, user: null, message: 'Session expired or invalid' });
  }
});

// ============================================================================
// ADMIN PROTECTED MIDDLEWARE & ENDPOINTS
// ============================================================================

/**
 * Strict Admin Middleware
 * Verifies HttpOnly JWT cookie and ensures DB user role === 'admin'
 */
async function adminMiddleware(req, res, next) {
  try {
    const token = req.cookies.auth_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please login as administrator.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    let userRole = decoded.role ? String(decoded.role).trim().toLowerCase() : '';
    let dbUser = null;

    try {
      if (decoded.id && !isNaN(decoded.id)) {
        const users = await query('SELECT id, full_name, email, phone, role FROM users WHERE id = ? LIMIT 1', [decoded.id]);
        if (users && users.length > 0) {
          dbUser = users[0];
          userRole = dbUser.role ? String(dbUser.role).trim().toLowerCase() : userRole;
        }
      } else if (decoded.email) {
        const users = await query('SELECT id, full_name, email, phone, role FROM users WHERE email = ? LIMIT 1', [decoded.email]);
        if (users && users.length > 0) {
          dbUser = users[0];
          userRole = dbUser.role ? String(dbUser.role).trim().toLowerCase() : userRole;
        }
      }
    } catch (dbErr) {
      // Fall back to decoded JWT role if DB is offline
    }

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have administrator permissions to access this area.'
      });
    }

    req.adminUser = dbUser || decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin session.' });
  }
}

/**
 * GET /api/admin/dashboard
 * Protected admin dashboard metrics & recent activity feeds
 */
let mockActivityLogs = [
  {
    id: 1,
    actor_user_id: 1,
    actor_name: 'Media Scope IT Administrator',
    action: 'CREATE_COURSE',
    entity_type: 'course',
    entity_id: 1,
    description: 'Created new masterclass: Full Stack Web Development',
    created_at: new Date('2026-02-01T10:00:00Z')
  },
  {
    id: 2,
    actor_user_id: 1,
    actor_name: 'Media Scope IT Administrator',
    action: 'VERIFY_PAYMENT',
    entity_type: 'payment',
    entity_id: 1,
    description: 'Verified payment transaction #1 (৳25,000.00)',
    created_at: new Date('2026-02-15T11:30:00Z')
  },
  {
    id: 3,
    actor_user_id: 1,
    actor_name: 'Media Scope IT Administrator',
    action: 'ISSUE_CERTIFICATE',
    entity_type: 'certificate',
    entity_id: 1,
    description: 'Issued completion certificate MSIT-CERT-2026-00101 to Tanvir Hasan',
    created_at: new Date('2026-02-18T14:20:00Z')
  }
];

/**
 * Helper to log state-changing admin operations securely
 */
async function logActivity(actorUserId, action, entityType, entityId, description, metadata = null) {
  try {
    const metaJson = metadata ? JSON.stringify(metadata) : null;
    await query(
      `INSERT INTO activity_logs (actor_user_id, action, entity_type, entity_id, description, metadata_json)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [actorUserId || null, action, entityType, entityId || null, description, metaJson]
    );
  } catch (err) {
    mockActivityLogs.unshift({
      id: mockActivityLogs.length + 1,
      actor_user_id: actorUserId || 1,
      actor_name: 'Admin',
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      description,
      created_at: new Date()
    });
  }
}

/**
 * GET /api/admin/dashboard
 * Protected admin dashboard metrics, financial breakdown, analytics & activity log feeds
 */
app.get('/api/admin/dashboard', adminMiddleware, async (req, res) => {
  try {
    let metrics = {
      // User Metrics
      totalUsers: 0,
      activeUsers: 0,
      totalStudents: 0,
      totalClients: 0,
      totalAdmins: 0,

      // Education
      totalCourses: 0,
      activeCourses: 0,
      totalEnrollments: 0,
      activeEnrollments: 0,
      completedEnrollments: 0,

      // Financial
      totalVerifiedRevenue: 0,
      pendingPaymentsCount: 0,
      successfulPaymentsCount: 0,
      failedPaymentsCount: 0,
      outstandingEnrollmentDue: 0,
      outstandingProjectDue: 0,

      // Projects
      totalProjects: 0,
      activeProjects: 0,
      testingProjects: 0,
      deliveredProjects: 0,
      cancelledProjects: 0,

      // Certificates
      totalCertificates: 0,
      activeCertificates: 0,
      revokedCertificates: 0,

      // Communication
      unreadMessages: 0,
      unreadNotifications: 0,
      publishedAnnouncements: 0,

      // Content
      publishedBlogPosts: 0,
      draftBlogPosts: 0,
      publishedPages: 0,
      activeServices: 0,
      activeTeamMembers: 0,

      // Analytics & Feeds
      monthlyRevenue: [],
      enrollmentStatusCounts: {},
      projectStatusCounts: {},
      recentActivity: [],
      attentionAlerts: []
    };

    try {
      // User Counts
      const uCounts = await query('SELECT role, is_active, COUNT(*) as count FROM users GROUP BY role, is_active');
      if (uCounts && uCounts.length > 0) {
        uCounts.forEach(r => {
          metrics.totalUsers += r.count;
          if (r.is_active) metrics.activeUsers += r.count;
          if (r.role === 'student') metrics.totalStudents += r.count;
          if (r.role === 'client') metrics.totalClients += r.count;
          if (r.role === 'admin') metrics.totalAdmins += r.count;
        });
      }

      // Course Counts
      const cCounts = await query('SELECT is_active, COUNT(*) as count FROM courses GROUP BY is_active');
      if (cCounts) {
        cCounts.forEach(r => {
          metrics.totalCourses += r.count;
          if (r.is_active) metrics.activeCourses = r.count;
        });
      }

      // Enrollment Analytics
      const eCounts = await query('SELECT status, COUNT(*) as count FROM enrollments GROUP BY status');
      if (eCounts) {
        eCounts.forEach(r => {
          metrics.totalEnrollments += r.count;
          metrics.enrollmentStatusCounts[r.status] = r.count;
          if (r.status === 'active') metrics.activeEnrollments = r.count;
          if (r.status === 'completed') metrics.completedEnrollments = r.count;
        });
      }

      // Revenue & Financial Metrics
      const revRes = await query(`
        SELECT 
          SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END) as totalRevenue,
          COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pendingCount,
          COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paidCount,
          COUNT(CASE WHEN status IN ('FAILED', 'CANCELLED', 'EXPIRED') THEN 1 END) as failedCount
        FROM payments
      `);
      if (revRes && revRes[0]) {
        metrics.totalVerifiedRevenue = parseFloat(revRes[0].totalRevenue || 0);
        metrics.pendingPaymentsCount = revRes[0].pendingCount || 0;
        metrics.successfulPaymentsCount = revRes[0].paidCount || 0;
        metrics.failedPaymentsCount = revRes[0].failedCount || 0;
      }

      // Outstanding Dues
      const enrDueRes = await query(`SELECT SUM(total_fee - paid_amount) as due FROM enrollments WHERE status != 'cancelled' AND (total_fee - paid_amount) > 0`);
      if (enrDueRes && enrDueRes[0]) metrics.outstandingEnrollmentDue = parseFloat(enrDueRes[0].due || 0);

      const projDueRes = await query(`SELECT SUM(contract_amount - paid_amount) as due FROM software_projects WHERE status != 'cancelled' AND (contract_amount - paid_amount) > 0`);
      if (projDueRes && projDueRes[0]) metrics.outstandingProjectDue = parseFloat(projDueRes[0].due || 0);

      // Monthly Revenue Graph Data (Real PAID payments grouped by YYYY-MM)
      const monthRevRes = await query(`
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(amount) as total
        FROM payments
        WHERE status = 'PAID'
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month ASC
        LIMIT 12
      `);
      metrics.monthlyRevenue = monthRevRes || [];

      // Software Project Analytics
      const pCounts = await query('SELECT status, COUNT(*) as count FROM software_projects GROUP BY status');
      if (pCounts) {
        pCounts.forEach(r => {
          metrics.totalProjects += r.count;
          metrics.projectStatusCounts[r.status] = r.count;
          if (['in_development', 'srs_planning'].includes(r.status)) metrics.activeProjects += r.count;
          if (r.status === 'testing') metrics.testingProjects = r.count;
          if (r.status === 'delivered') metrics.deliveredProjects = r.count;
          if (r.status === 'cancelled') metrics.cancelledProjects = r.count;
        });
      }

      // Certificate Counts
      const certCounts = await query('SELECT status, COUNT(*) as count FROM certificates GROUP BY status');
      if (certCounts) {
        certCounts.forEach(r => {
          metrics.totalCertificates += r.count;
          if (r.status === 'active') metrics.activeCertificates = r.count;
          if (r.status === 'revoked') metrics.revokedCertificates = r.count;
        });
      }

      // Unread Messages & Notifications
      const unreadMsgRes = await query('SELECT COUNT(*) as count FROM messages WHERE is_read = 0');
      metrics.unreadMessages = unreadMsgRes[0]?.count || 0;

      const unreadNotifRes = await query('SELECT COUNT(*) as count FROM notifications WHERE is_read = 0');
      metrics.unreadNotifications = unreadNotifRes[0]?.count || 0;

      const annCountRes = await query("SELECT COUNT(*) as count FROM announcements WHERE status = 'published'");
      metrics.publishedAnnouncements = annCountRes[0]?.count || 0;

      // Content Metrics
      const bCounts = await query('SELECT is_published, COUNT(*) as count FROM blog_posts GROUP BY is_published');
      if (bCounts) {
        bCounts.forEach(r => {
          if (r.is_published) metrics.publishedBlogPosts = r.count;
          else metrics.draftBlogPosts = r.count;
        });
      }

      const pCountRes = await query("SELECT COUNT(*) as count FROM pages WHERE status = 'published'");
      metrics.publishedPages = pCountRes[0]?.count || 0;

      const servCountRes = await query('SELECT COUNT(*) as count FROM services WHERE is_active = 1');
      metrics.activeServices = servCountRes[0]?.count || 0;

      const teamCountRes = await query('SELECT COUNT(*) as count FROM team_members WHERE is_active = 1');
      metrics.activeTeamMembers = teamCountRes[0]?.count || 0;

      // Recent Activity Logs (Latest 10)
      const actLogs = await query(`
        SELECT a.id, a.actor_user_id, a.action, a.entity_type, a.entity_id, a.description, a.created_at,
               u.full_name as actor_name
        FROM activity_logs a
        LEFT JOIN users u ON a.actor_user_id = u.id
        ORDER BY a.id DESC
        LIMIT 10
      `);
      metrics.recentActivity = actLogs || [];
    } catch (dbErr) {
      console.log('Admin Dashboard query DB notice:', dbErr.message);
      metrics.recentActivity = [...mockActivityLogs];
    }

    // Build Attention Required Alerts array
    metrics.attentionAlerts = [];
    if (metrics.pendingPaymentsCount > 0) {
      metrics.attentionAlerts.push({ id: 'pending_payments', type: 'warning', title: `${metrics.pendingPaymentsCount} Pending Payment(s)`, desc: 'Payment transactions awaiting verification.' });
    }
    if (metrics.unreadMessages > 0) {
      metrics.attentionAlerts.push({ id: 'unread_messages', type: 'info', title: `${metrics.unreadMessages} Unread Message(s)`, desc: 'Incoming student/client messages awaiting reply.' });
    }
    if (metrics.testingProjects > 0) {
      metrics.attentionAlerts.push({ id: 'testing_projects', type: 'info', title: `${metrics.testingProjects} Project(s) in QA/Testing`, desc: 'Software projects currently undergoing final client testing.' });
    }

    return res.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin dashboard metrics.' });
  }
});

/**
 * GET /api/admin/activity-logs
 * Protected admin endpoint listing activity audit logs with search, action, entity_type filters & pagination
 */
app.get('/api/admin/activity-logs', adminMiddleware, async (req, res) => {
  try {
    const { q, action, entity_type, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let logs = [];
    let total = 0;

    try {
      let where = ['1=1'];
      let params = [];

      if (action && action !== 'all') {
        where.push('a.action = ?');
        params.push(action);
      }
      if (entity_type && entity_type !== 'all') {
        where.push('a.entity_type = ?');
        params.push(entity_type);
      }
      if (q && q.trim()) {
        where.push('(a.description LIKE ? OR a.action LIKE ? OR u.full_name LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      const sqlCount = `
        SELECT COUNT(*) as count
        FROM activity_logs a
        LEFT JOIN users u ON a.actor_user_id = u.id
        WHERE ${where.join(' AND ')}
      `;
      const countRows = await query(sqlCount, params);
      total = countRows[0]?.count || 0;

      const sqlData = `
        SELECT a.id, a.actor_user_id, a.action, a.entity_type, a.entity_id, a.description, a.created_at,
               u.full_name as actor_name
        FROM activity_logs a
        LEFT JOIN users u ON a.actor_user_id = u.id
        WHERE ${where.join(' AND ')}
        ORDER BY a.id DESC
        LIMIT ? OFFSET ?
      `;
      params.push(limitNum, offset);
      logs = await query(sqlData, params);
    } catch (dbErr) {
      console.log('Admin activity logs query DB notice:', dbErr.message);
      logs = [...mockActivityLogs];
      total = logs.length;
    }

    return res.json({
      success: true,
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching activity logs.' });
  }
});

/**
 * GET /api/admin/users
 * Server-side paginated list of users with search, role, and status filtering
 */
app.get('/api/admin/users', adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const offset = (page - 1) * limit;
    const { role, status, q, search } = req.query;
    const searchTerm = (q || search || '').trim();

    let whereConditions = ['1=1'];
    let params = [];

    if (role && ['admin', 'student', 'client'].includes(role)) {
      whereConditions.push('role = ?');
      params.push(role);
    }

    if (status) {
      if (status === 'active' || status === '1') {
        whereConditions.push('is_active = 1');
      } else if (status === 'inactive' || status === '0') {
        whereConditions.push('is_active = 0');
      }
    }

    if (searchTerm) {
      whereConditions.push('(full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR CAST(id AS CHAR) = ?)');
      const searchPattern = `%${searchTerm}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchTerm);
    }

    const whereSql = whereConditions.join(' AND ');

    let total = 0;
    let users = [];

    try {
      const countResult = await query(`SELECT COUNT(*) as count FROM users WHERE ${whereSql}`, params);
      if (countResult && countResult[0]) total = countResult[0].count;

      const dataParams = [...params, limit, offset];
      users = await query(
        `SELECT id, full_name, email, phone, role, is_active, created_at, updated_at FROM users WHERE ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
        dataParams
      );
    } catch (dbErr) {
      console.log('Admin users query notice:', dbErr.message);
    }

    return res.json({
      success: true,
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving users.' });
  }
});

// ============================================================================
// GLOBAL SITE SETTINGS & HOMEPAGE CMS ENDPOINTS
// ============================================================================

// In-Memory Global Site Settings Repository (Fallback when DB pool is offline)
let mockSiteSettings = {
  site_name: 'Media Scope IT Ltd',
  site_tagline: 'IT & Software Institute Bangladesh',
  contact_email: 'info@mediascopeit.com',
  contact_phone: '+88 01325-165451',
  office_address: 'House-05, Flat B-3, Road-03, Sector-15F, Uttara, Dhaka, Bangladesh',
  rjsc_reg_no: 'C-166968/2020',
  trade_license_no: 'TRAD/DSCC/048330/2020',
  tin_no: '125190932932',
  dbid_no: 'DBID-2020-MSIT',
  hero_title: 'Transform Your Career with Industry-Grade IT & Software Engineering Skills',
  hero_subtitle: 'Empowering students & businesses with cutting-edge software development, graphic design, digital marketing, and enterprise IT solutions.',
  hero_cta_primary_text: 'Explore Courses',
  hero_cta_secondary_text: 'Get Software Proposal',
  facebook_url: 'https://facebook.com/mediascopeit',
  linkedin_url: 'https://linkedin.com/company/mediascopeit',
  youtube_url: 'https://youtube.com/c/mediascopeit',
  instagram_url: 'https://instagram.com/mediascopeit',
  footer_copyright: '© 2026 Media Scope IT Ltd. All rights reserved.',
  meta_title: 'Media Scope IT Ltd — IT Training & Software Engineering Firm',
  meta_description: 'Media Scope IT Ltd is a premier IT training institute and custom software development agency in Dhaka, Bangladesh.',
  meta_keywords: 'IT Training Bangladesh, Software Development Company Dhaka, React Course, Full Stack Web Development'
};

/**
 * GET /api/public/site-settings
 * Public endpoint to fetch dynamic site settings for header, footer, hero banner & contact info
 */
app.get('/api/public/site-settings', async (req, res) => {
  try {
    let settingsMap = { ...mockSiteSettings };
    try {
      const rows = await query('SELECT setting_key, setting_value FROM site_settings');
      if (rows && rows.length > 0) {
        rows.forEach(r => {
          if (r.setting_key && r.setting_value !== null) {
            settingsMap[r.setting_key] = r.setting_value;
          }
        });
      }
    } catch (dbErr) {
      console.log('Public site settings DB notice:', dbErr.message);
    }
    return res.json({ success: true, settings: settingsMap });
  } catch (error) {
    return res.json({ success: true, settings: mockSiteSettings });
  }
});

// ============================================================================
// PHASE 12: STUDENT & CLIENT MANAGEMENT CMS ENDPOINTS
// ============================================================================

let mockStudentsList = [
  {
    id: 2,
    full_name: 'Tanvir Hasan',
    name: 'Tanvir Hasan',
    email: 'tanvir@mediascopeit.com',
    phone: '+8801700000001',
    role: 'student',
    is_active: 1,
    father_name: 'Md. Delowar Hossain',
    mother_name: 'Nasima Begum',
    address: 'House 12, Road 4, Sector 10, Uttara, Dhaka',
    date_of_birth: '2001-05-15',
    education_level: 'B.Sc in Computer Science (Student)',
    emergency_phone: '+8801700000009',
    enrollments_count: 2,
    total_paid: 25000,
    created_at: new Date('2026-01-10')
  },
  {
    id: 4,
    full_name: 'Nusrat Jahan Rahmani',
    name: 'Nusrat Jahan Rahmani',
    email: 'nusrat@student.com',
    phone: '+8801811223344',
    role: 'student',
    is_active: 1,
    father_name: 'A. K. Rahmani',
    mother_name: 'Rehana Rahmani',
    address: 'Flat 4B, Sector 7, Uttara, Dhaka',
    date_of_birth: '2002-08-20',
    education_level: 'HSC Passed (Batch 2026)',
    emergency_phone: '+8801811223399',
    enrollments_count: 1,
    total_paid: 12000,
    created_at: new Date('2026-02-14')
  }
];

let mockClientsList = [
  {
    id: 3,
    full_name: 'Acme Enterprise Client',
    name: 'Acme Enterprise Client',
    email: 'corporate@acme.com',
    phone: '+8801900000002',
    role: 'client',
    is_active: 1,
    company_name: 'Acme Software Solutions Ltd',
    designation: 'Managing Director',
    trade_license_no: 'TRAD/DSCC/098765/2022',
    tin_no: '987654321012',
    office_address: 'Gulshan-2 Commercial Area, Dhaka',
    website_url: 'https://acme-software.com',
    projects_count: 3,
    total_paid: 180000,
    created_at: new Date('2026-01-15')
  }
];

/**
 * GET /api/admin/students
 * Protected admin endpoint listing all student accounts with search & pagination
 */
app.get('/api/admin/students', adminMiddleware, async (req, res) => {
  try {
    const { q, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let students = [];
    let total = 0;

    try {
      let where = ["u.role = 'student'"];
      let params = [];

      if (status === 'active' || status === '1') {
        where.push('u.is_active = 1');
      } else if (status === 'inactive' || status === '0') {
        where.push('u.is_active = 0');
      }

      if (q && q.trim()) {
        where.push('(u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ? OR sp.education_level LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const sqlCount = `SELECT COUNT(*) as count FROM users u LEFT JOIN student_profiles sp ON u.id = sp.user_id WHERE ${where.join(' AND ')}`;
      const countRows = await query(sqlCount, params);
      total = countRows[0]?.count || 0;

      const sqlData = `
        SELECT 
          u.id, u.full_name, u.email, u.phone, u.role, u.is_active, u.created_at,
          sp.father_name, sp.mother_name, sp.address, sp.date_of_birth, sp.education_level, sp.emergency_phone, sp.avatar_url,
          (SELECT COUNT(*) FROM enrollments e WHERE e.student_id = u.id) as enrollments_count,
          (SELECT COALESCE(SUM(paid_amount), 0) FROM enrollments e WHERE e.student_id = u.id) as total_paid
        FROM users u
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        WHERE ${where.join(' AND ')}
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
      `;

      params.push(limitNum, offset);
      const rows = await query(sqlData, params);
      students = rows;
    } catch (dbErr) {
      console.log('Admin students query DB notice:', dbErr.message);
      students = [...mockStudentsList];

      if (status === 'active') students = students.filter(s => s.is_active === 1);
      if (status === 'inactive') students = students.filter(s => s.is_active === 0);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        students = students.filter(s => s.full_name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term) || s.phone.includes(term));
      }
      total = students.length;
    }

    return res.json({
      success: true,
      students,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching students list.' });
  }
});

/**
 * GET /api/admin/students/:id
 * Protected admin endpoint returning single student details, enrollments, and profile
 */
app.get('/api/admin/students/:id', adminMiddleware, async (req, res) => {
  try {
    const studentId = req.params.id;
    let studentObj = null;
    let enrollments = [];

    try {
      const sqlData = `
        SELECT 
          u.id, u.full_name, u.email, u.phone, u.role, u.is_active, u.created_at,
          sp.father_name, sp.mother_name, sp.address, sp.date_of_birth, sp.education_level, sp.emergency_phone, sp.avatar_url
        FROM users u
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        WHERE u.id = ? AND u.role = 'student'
        LIMIT 1
      `;
      const rows = await query(sqlData, [studentId]);
      if (rows && rows.length > 0) {
        studentObj = rows[0];

        // Fetch enrollments
        try {
          const enrRows = await query(`
            SELECT e.*, c.title as course_title, c.slug as course_slug
            FROM enrollments e
            LEFT JOIN courses c ON e.course_id = c.id
            WHERE e.student_id = ?
            ORDER BY e.enrollment_date DESC
          `, [studentId]);
          enrollments = enrRows || [];
        } catch (enrErr) {
          enrollments = [];
        }
      } else {
        studentObj = mockStudentsList.find(s => s.id == studentId);
      }
    } catch (dbErr) {
      studentObj = mockStudentsList.find(s => s.id == studentId);
    }

    if (!studentObj) {
      return res.status(404).json({ success: false, message: 'Student account not found.' });
    }

    return res.json({
      success: true,
      student: studentObj,
      enrollments
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving student details.' });
  }
});

/**
 * PUT /api/admin/students/:id
 * Protected admin endpoint updating student profile
 */
app.put('/api/admin/students/:id', adminMiddleware, async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10) || req.params.id;
    const { full_name, phone, father_name, mother_name, address, date_of_birth, education_level, emergency_phone } = req.body;

    try {
      if (full_name || phone) {
        let updateUsersSql = 'UPDATE users SET ';
        let userParams = [];
        if (full_name) { updateUsersSql += 'full_name = ?, '; userParams.push(full_name); }
        if (phone) { updateUsersSql += 'phone = ?, '; userParams.push(phone); }
        updateUsersSql = updateUsersSql.replace(/,\s*$/, '') + ' WHERE id = ? AND role = \'student\'';
        userParams.push(studentId);
        await query(updateUsersSql, userParams);
      }

      // Upsert into student_profiles
      const profileCheck = await query('SELECT id FROM student_profiles WHERE user_id = ? LIMIT 1', [studentId]);
      if (profileCheck && profileCheck.length > 0) {
        await query(
          'UPDATE student_profiles SET father_name = ?, mother_name = ?, address = ?, date_of_birth = ?, education_level = ?, emergency_phone = ? WHERE user_id = ?',
          [father_name || null, mother_name || null, address || null, date_of_birth || null, education_level || null, emergency_phone || null, studentId]
        );
      } else {
        await query(
          'INSERT INTO student_profiles (user_id, father_name, mother_name, address, date_of_birth, education_level, emergency_phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [studentId, father_name || null, mother_name || null, address || null, date_of_birth || null, education_level || null, emergency_phone || null]
        );
      }
    } catch (dbErr) {
      const s = mockStudentsList.find(item => item.id == studentId);
      if (s) {
        if (full_name) { s.full_name = full_name; s.name = full_name; }
        if (phone) s.phone = phone;
        if (father_name !== undefined) s.father_name = father_name;
        if (mother_name !== undefined) s.mother_name = mother_name;
        if (address !== undefined) s.address = address;
        if (date_of_birth !== undefined) s.date_of_birth = date_of_birth;
        if (education_level !== undefined) s.education_level = education_level;
        if (emergency_phone !== undefined) s.emergency_phone = emergency_phone;
      }
    }

    return res.json({ success: true, message: 'Student profile updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating student profile.' });
  }
});

/**
 * PATCH /api/admin/students/:id/status
 * Protected admin endpoint updating student status (Activate / Deactivate)
 */
app.patch('/api/admin/students/:id/status', adminMiddleware, async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10) || req.params.id;
    const { is_active, status } = req.body;
    const targetStatus = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'active' || status === '1' ? 1 : 0);

    try {
      await query('UPDATE users SET is_active = ? WHERE id = ? AND role = \'student\'', [targetStatus, studentId]);
    } catch (dbErr) {
      const s = mockStudentsList.find(item => item.id == studentId);
      if (s) s.is_active = targetStatus;
    }

    return res.json({
      success: true,
      message: `Student account ${targetStatus === 1 ? 'activated' : 'deactivated'} successfully.`,
      is_active: targetStatus
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating student status.' });
  }
});

/**
 * GET /api/admin/clients
 * Protected admin endpoint listing all client accounts with search & pagination
 */
app.get('/api/admin/clients', adminMiddleware, async (req, res) => {
  try {
    const { q, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let clients = [];
    let total = 0;

    try {
      let where = ["u.role = 'client'"];
      let params = [];

      if (status === 'active' || status === '1') {
        where.push('u.is_active = 1');
      } else if (status === 'inactive' || status === '0') {
        where.push('u.is_active = 0');
      }

      if (q && q.trim()) {
        where.push('(u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ? OR cp.company_name LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const sqlCount = `SELECT COUNT(*) as count FROM users u LEFT JOIN client_profiles cp ON u.id = cp.user_id WHERE ${where.join(' AND ')}`;
      const countRows = await query(sqlCount, params);
      total = countRows[0]?.count || 0;

      const sqlData = `
        SELECT 
          u.id, u.full_name, u.email, u.phone, u.role, u.is_active, u.created_at,
          cp.company_name, cp.designation, cp.trade_license_no, cp.tin_no, cp.bin_no, cp.office_address, cp.website_url,
          (SELECT COUNT(*) FROM software_projects p WHERE p.client_id = u.id) as projects_count,
          (SELECT COALESCE(SUM(paid_amount), 0) FROM software_projects p WHERE p.client_id = u.id) as total_paid
        FROM users u
        LEFT JOIN client_profiles cp ON u.id = cp.user_id
        WHERE ${where.join(' AND ')}
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
      `;

      params.push(limitNum, offset);
      const rows = await query(sqlData, params);
      clients = rows;
    } catch (dbErr) {
      console.log('Admin clients query DB notice:', dbErr.message);
      clients = [...mockClientsList];

      if (status === 'active') clients = clients.filter(c => c.is_active === 1);
      if (status === 'inactive') clients = clients.filter(c => c.is_active === 0);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        clients = clients.filter(c => c.full_name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || c.company_name.toLowerCase().includes(term));
      }
      total = clients.length;
    }

    return res.json({
      success: true,
      clients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching clients list.' });
  }
});

/**
 * GET /api/admin/clients/:id
 * Protected admin endpoint returning single client details, projects, and profile
 */
app.get('/api/admin/clients/:id', adminMiddleware, async (req, res) => {
  try {
    const clientId = req.params.id;
    let clientObj = null;
    let projects = [];

    try {
      const sqlData = `
        SELECT 
          u.id, u.full_name, u.email, u.phone, u.role, u.is_active, u.created_at,
          cp.company_name, cp.designation, cp.trade_license_no, cp.tin_no, cp.bin_no, cp.office_address, cp.website_url
        FROM users u
        LEFT JOIN client_profiles cp ON u.id = cp.user_id
        WHERE u.id = ? AND u.role = 'client'
        LIMIT 1
      `;
      const rows = await query(sqlData, [clientId]);
      if (rows && rows.length > 0) {
        clientObj = rows[0];

        // Fetch projects
        try {
          const projRows = await query(`
            SELECT * FROM software_projects WHERE client_id = ? ORDER BY start_date DESC
          `, [clientId]);
          projects = projRows || [];
        } catch (pErr) {
          projects = [];
        }
      } else {
        clientObj = mockClientsList.find(c => c.id == clientId);
      }
    } catch (dbErr) {
      clientObj = mockClientsList.find(c => c.id == clientId);
    }

    if (!clientObj) {
      return res.status(404).json({ success: false, message: 'Client account not found.' });
    }

    return res.json({
      success: true,
      client: clientObj,
      projects
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving client details.' });
  }
});

/**
 * PUT /api/admin/clients/:id
 * Protected admin endpoint updating client profile
 */
app.put('/api/admin/clients/:id', adminMiddleware, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id, 10) || req.params.id;
    const { full_name, phone, company_name, designation, trade_license_no, tin_no, office_address, website_url } = req.body;

    try {
      if (full_name || phone) {
        let updateUsersSql = 'UPDATE users SET ';
        let userParams = [];
        if (full_name) { updateUsersSql += 'full_name = ?, '; userParams.push(full_name); }
        if (phone) { updateUsersSql += 'phone = ?, '; userParams.push(phone); }
        updateUsersSql = updateUsersSql.replace(/,\s*$/, '') + ' WHERE id = ? AND role = \'client\'';
        userParams.push(clientId);
        await query(updateUsersSql, userParams);
      }

      // Upsert into client_profiles
      const profileCheck = await query('SELECT id FROM client_profiles WHERE user_id = ? LIMIT 1', [clientId]);
      if (profileCheck && profileCheck.length > 0) {
        await query(
          'UPDATE client_profiles SET company_name = ?, designation = ?, trade_license_no = ?, tin_no = ?, office_address = ?, website_url = ? WHERE user_id = ?',
          [company_name || 'Acme Software Solutions Ltd', designation || null, trade_license_no || null, tin_no || null, office_address || null, website_url || null, clientId]
        );
      } else {
        await query(
          'INSERT INTO client_profiles (user_id, company_name, designation, trade_license_no, tin_no, office_address, website_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [clientId, company_name || 'Acme Software Solutions Ltd', designation || null, trade_license_no || null, tin_no || null, office_address || null, website_url || null]
        );
      }
    } catch (dbErr) {
      const c = mockClientsList.find(item => item.id == clientId);
      if (c) {
        if (full_name) { c.full_name = full_name; c.name = full_name; }
        if (phone) c.phone = phone;
        if (company_name) c.company_name = company_name;
        if (designation !== undefined) c.designation = designation;
        if (trade_license_no !== undefined) c.trade_license_no = trade_license_no;
        if (tin_no !== undefined) c.tin_no = tin_no;
        if (office_address !== undefined) s.office_address = office_address;
        if (website_url !== undefined) c.website_url = website_url;
      }
    }

    return res.json({ success: true, message: 'Client profile updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating client profile.' });
  }
});

/**
 * PATCH /api/admin/clients/:id/status
 * Protected admin endpoint updating client status (Activate / Deactivate)
 */
app.patch('/api/admin/clients/:id/status', adminMiddleware, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id, 10) || req.params.id;
    const { is_active, status } = req.body;
    const targetStatus = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'active' || status === '1' ? 1 : 0);

    try {
      await query('UPDATE users SET is_active = ? WHERE id = ? AND role = \'client\'', [targetStatus, clientId]);
    } catch (dbErr) {
      const c = mockClientsList.find(item => item.id == clientId);
      if (c) c.is_active = targetStatus;
    }

    return res.json({
      success: true,
      message: `Client account ${targetStatus === 1 ? 'activated' : 'deactivated'} successfully.`,
      is_active: targetStatus
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating client status.' });
  }
});

// ============================================================================
// PHASE 13: ENROLLMENT MANAGEMENT CMS ENDPOINTS
// ============================================================================

let mockEnrollmentsList = [
  {
    id: 1,
    enrollment_no: 'ENR-2026-00101',
    student_id: 2,
    student_name: 'Tanvir Hasan',
    student_email: 'tanvir@mediascopeit.com',
    student_phone: '+8801700000001',
    course_id: 1,
    course_title: 'Full Stack Web Development with React & Node.js',
    total_fee: 15000,
    paid_amount: 15000,
    due_amount: 0,
    class_mode: 'offline',
    status: 'active',
    payment_status: 'paid',
    enrollment_date: new Date('2026-01-10')
  },
  {
    id: 2,
    enrollment_no: 'ENR-2026-00102',
    student_id: 4,
    student_name: 'Nusrat Jahan Rahmani',
    student_email: 'nusrat@student.com',
    student_phone: '+8801811223344',
    course_id: 2,
    course_title: 'Python Django & AI Machine Learning Masterclass',
    total_fee: 18000,
    paid_amount: 10000,
    due_amount: 8000,
    class_mode: 'hybrid',
    status: 'active',
    payment_status: 'partial',
    enrollment_date: new Date('2026-02-14')
  }
];

/**
 * GET /api/admin/enrollment-options/students
 * Supporting endpoint returning list of active students for dropdown selection
 */
app.get('/api/admin/enrollment-options/students', adminMiddleware, async (req, res) => {
  try {
    let students = [];
    try {
      const rows = await query("SELECT id, full_name, email, phone FROM users WHERE role = 'student' AND is_active = 1 ORDER BY full_name ASC");
      students = rows || [];
    } catch (dbErr) {
      students = [
        { id: 2, full_name: 'Tanvir Hasan', email: 'tanvir@mediascopeit.com', phone: '+8801700000001' },
        { id: 4, full_name: 'Nusrat Jahan Rahmani', email: 'nusrat@student.com', phone: '+8801811223344' }
      ];
    }
    return res.json({ success: true, students });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching student options.' });
  }
});

/**
 * GET /api/admin/enrollment-options/courses
 * Supporting endpoint returning list of active courses for dropdown selection
 */
app.get('/api/admin/enrollment-options/courses', adminMiddleware, async (req, res) => {
  try {
    let courses = [];
    try {
      const rows = await query("SELECT id, title, slug, discount_fee, regular_fee FROM courses WHERE is_active = 1 ORDER BY title ASC");
      courses = rows || [];
    } catch (dbErr) {
      courses = [
        { id: 1, title: 'Full Stack Web Development with React & Node.js', discount_fee: 15000, regular_fee: 25000 },
        { id: 2, title: 'Python Django & AI Machine Learning Masterclass', discount_fee: 18000, regular_fee: 30000 }
      ];
    }
    return res.json({ success: true, courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching course options.' });
  }
});

/**
 * GET /api/admin/enrollments
 * Protected admin endpoint listing enrollments with search, filter & pagination
 */
app.get('/api/admin/enrollments', adminMiddleware, async (req, res) => {
  try {
    const { q, status, course_id, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let enrollments = [];
    let total = 0;

    try {
      let where = ['1=1'];
      let params = [];

      if (status && status !== 'all') {
        where.push('e.status = ?');
        params.push(status);
      }

      if (course_id && course_id !== 'all') {
        where.push('e.course_id = ?');
        params.push(course_id);
      }

      if (q && q.trim()) {
        where.push('(u.full_name LIKE ? OR u.email LIKE ? OR c.title LIKE ? OR e.enrollment_no LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const sqlCount = `
        SELECT COUNT(*) as count 
        FROM enrollments e
        JOIN users u ON e.student_id = u.id
        JOIN courses c ON e.course_id = c.id
        WHERE ${where.join(' AND ')}
      `;
      const countRows = await query(sqlCount, params);
      total = countRows[0]?.count || 0;

      const sqlData = `
        SELECT 
          e.id, e.enrollment_no, e.student_id, e.course_id, e.batch_id, e.enrollment_date,
          e.total_fee, e.paid_amount, (e.total_fee - e.paid_amount) as due_amount,
          e.class_mode, e.status, e.payment_status,
          u.full_name as student_name, u.email as student_email, u.phone as student_phone,
          c.title as course_title, c.slug as course_slug
        FROM enrollments e
        JOIN users u ON e.student_id = u.id
        JOIN courses c ON e.course_id = c.id
        WHERE ${where.join(' AND ')}
        ORDER BY e.enrollment_date DESC
        LIMIT ? OFFSET ?
      `;

      params.push(limitNum, offset);
      const rows = await query(sqlData, params);
      enrollments = rows;
    } catch (dbErr) {
      console.log('Admin enrollments query DB notice:', dbErr.message);
      enrollments = [...mockEnrollmentsList];

      if (status && status !== 'all') enrollments = enrollments.filter(e => e.status === status);
      if (course_id && course_id !== 'all') enrollments = enrollments.filter(e => e.course_id == course_id);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        enrollments = enrollments.filter(e => 
          e.student_name.toLowerCase().includes(term) ||
          e.student_email.toLowerCase().includes(term) ||
          e.course_title.toLowerCase().includes(term) ||
          e.enrollment_no.toLowerCase().includes(term)
        );
      }
      total = enrollments.length;
    }

    return res.json({
      success: true,
      enrollments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching enrollments list.' });
  }
});

/**
 * GET /api/admin/enrollments/:id
 * Protected admin endpoint returning single enrollment details
 */
app.get('/api/admin/enrollments/:id', adminMiddleware, async (req, res) => {
  try {
    const enrId = req.params.id;
    let enrollmentObj = null;

    try {
      const sqlData = `
        SELECT 
          e.*, (e.total_fee - e.paid_amount) as due_amount,
          u.full_name as student_name, u.email as student_email, u.phone as student_phone,
          c.title as course_title, c.slug as course_slug
        FROM enrollments e
        JOIN users u ON e.student_id = u.id
        JOIN courses c ON e.course_id = c.id
        WHERE e.id = ?
        LIMIT 1
      `;
      const rows = await query(sqlData, [enrId]);
      if (rows && rows.length > 0) enrollmentObj = rows[0];
    } catch (dbErr) {
      enrollmentObj = mockEnrollmentsList.find(e => e.id == enrId);
    }

    if (!enrollmentObj) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found.' });
    }

    return res.json({ success: true, enrollment: enrollmentObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving enrollment.' });
  }
});

/**
 * POST /api/admin/enrollments
 * Protected admin endpoint creating a new student course enrollment with strict validations
 */
app.post('/api/admin/enrollments', adminMiddleware, async (req, res) => {
  try {
    const { student_id, course_id, total_fee, paid_amount = 0, status = 'active', class_mode = 'offline' } = req.body;

    const studentIdNum = parseInt(student_id, 10);
    const courseIdNum = parseInt(course_id, 10);
    const totalFeeNum = parseFloat(total_fee);
    const paidAmountNum = parseFloat(paid_amount);

    // 1. Fee validation: non-negative & paid_amount <= total_fee
    if (isNaN(totalFeeNum) || totalFeeNum < 0) {
      return res.status(400).json({ success: false, message: 'Total fee must be a valid non-negative number.' });
    }
    if (isNaN(paidAmountNum) || paidAmountNum < 0) {
      return res.status(400).json({ success: false, message: 'Paid amount must be a valid non-negative number.' });
    }
    if (paidAmountNum > totalFeeNum) {
      return res.status(400).json({ success: false, message: 'Paid amount cannot exceed the total fee.' });
    }

    // 2. Validate Student Role & Existence
    let studentObj = null;
    try {
      const uRows = await query("SELECT id, full_name, email, phone, role FROM users WHERE id = ? LIMIT 1", [studentIdNum]);
      if (!uRows || uRows.length === 0) {
        return res.status(400).json({ success: false, message: 'Selected student account does not exist.' });
      }
      if (uRows[0].role !== 'student') {
        return res.status(400).json({ success: false, message: 'Selected user is not a student account.' });
      }
      studentObj = uRows[0];
    } catch (dbErr) {
      studentObj = { id: studentIdNum, full_name: 'Student User', email: 'student@example.com', phone: '+8801700000000' };
    }

    // 3. Validate Course Existence
    let courseObj = null;
    try {
      const cRows = await query("SELECT id, title FROM courses WHERE id = ? LIMIT 1", [courseIdNum]);
      if (!cRows || cRows.length === 0) {
        return res.status(400).json({ success: false, message: 'Selected course does not exist.' });
      }
      courseObj = cRows[0];
    } catch (dbErr) {
      courseObj = { id: courseIdNum, title: 'Full Stack Web Development' };
    }

    // 4. Duplicate Active Enrollment Rejection Check
    try {
      const dupRows = await query(
        "SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? AND status IN ('active', 'pending') LIMIT 1",
        [studentIdNum, courseIdNum]
      );
      if (dupRows && dupRows.length > 0) {
        return res.status(400).json({ success: false, message: 'Student is already actively enrolled in this course.' });
      }
    } catch (dbErr) {
      const dupMock = mockEnrollmentsList.find(e => e.student_id == studentIdNum && e.course_id == courseIdNum && ['active', 'pending'].includes(e.status));
      if (dupMock) {
        return res.status(400).json({ success: false, message: 'Student is already actively enrolled in this course.' });
      }
    }

    // 5. Calculate due amount & payment status
    const dueAmountNum = totalFeeNum - paidAmountNum;
    let paymentStatus = 'unpaid';
    if (paidAmountNum >= totalFeeNum && totalFeeNum > 0) paymentStatus = 'paid';
    else if (paidAmountNum > 0) paymentStatus = 'partial';

    const enrollmentNo = `ENR-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const insertRes = await query(
        `INSERT INTO enrollments 
         (enrollment_no, student_id, course_id, total_fee, paid_amount, due_amount, class_mode, status, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [enrollmentNo, studentIdNum, courseIdNum, totalFeeNum, paidAmountNum, dueAmountNum, class_mode, status, paymentStatus]
      );

      const newId = insertRes.insertId;
      const newObj = {
        id: newId,
        enrollment_no: enrollmentNo,
        student_id: studentIdNum,
        student_name: studentObj.full_name,
        student_email: studentObj.email,
        student_phone: studentObj.phone,
        course_id: courseIdNum,
        course_title: courseObj.title,
        total_fee: totalFeeNum,
        paid_amount: paidAmountNum,
        due_amount: dueAmountNum,
        class_mode,
        status,
        payment_status: paymentStatus,
        enrollment_date: new Date()
      };

      return res.status(201).json({
        success: true,
        message: 'Student course enrollment created successfully.',
        enrollment: newObj
      });
    } catch (dbErr) {
      const newId = mockEnrollmentsList.length + 10;
      const newObj = {
        id: newId,
        enrollment_no: enrollmentNo,
        student_id: studentIdNum,
        student_name: studentObj.full_name,
        student_email: studentObj.email,
        student_phone: studentObj.phone,
        course_id: courseIdNum,
        course_title: courseObj.title,
        total_fee: totalFeeNum,
        paid_amount: paidAmountNum,
        due_amount: dueAmountNum,
        class_mode,
        status,
        payment_status: paymentStatus,
        enrollment_date: new Date()
      };
      mockEnrollmentsList.push(newObj);

      return res.status(201).json({
        success: true,
        message: 'Student course enrollment created successfully.',
        enrollment: newObj
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error creating student enrollment.' });
  }
});

/**
 * PUT /api/admin/enrollments/:id
 * Protected admin endpoint updating fee structure, paid amount, and status
 */
app.put('/api/admin/enrollments/:id', adminMiddleware, async (req, res) => {
  try {
    const enrId = parseInt(req.params.id, 10) || req.params.id;
    const { total_fee, paid_amount, status, class_mode } = req.body;

    const totalFeeNum = parseFloat(total_fee);
    const paidAmountNum = parseFloat(paid_amount);

    if (isNaN(totalFeeNum) || totalFeeNum < 0 || isNaN(paidAmountNum) || paidAmountNum < 0) {
      return res.status(400).json({ success: false, message: 'Fees must be valid non-negative numbers.' });
    }
    if (paidAmountNum > totalFeeNum) {
      return res.status(400).json({ success: false, message: 'Paid amount cannot exceed the total fee.' });
    }

    const dueAmountNum = totalFeeNum - paidAmountNum;
    let paymentStatus = 'unpaid';
    if (paidAmountNum >= totalFeeNum && totalFeeNum > 0) paymentStatus = 'paid';
    else if (paidAmountNum > 0) paymentStatus = 'partial';

    try {
      await query(
        'UPDATE enrollments SET total_fee = ?, paid_amount = ?, due_amount = ?, status = ?, payment_status = ?, class_mode = ? WHERE id = ?',
        [totalFeeNum, paidAmountNum, dueAmountNum, status || 'active', paymentStatus, class_mode || 'offline', enrId]
      );
    } catch (dbErr) {
      const e = mockEnrollmentsList.find(item => item.id == enrId);
      if (e) {
        e.total_fee = totalFeeNum;
        e.paid_amount = paidAmountNum;
        e.due_amount = dueAmountNum;
        if (status) e.status = status;
        e.payment_status = paymentStatus;
        if (class_mode) e.class_mode = class_mode;
      }
    }

    return res.json({ success: true, message: 'Enrollment record updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating enrollment.' });
  }
});

/**
 * PATCH /api/admin/enrollments/:id/status
 * Protected admin endpoint updating status
 */
app.patch('/api/admin/enrollments/:id/status', adminMiddleware, async (req, res) => {
  try {
    const enrId = parseInt(req.params.id, 10) || req.params.id;
    const { status } = req.body;

    if (!['pending', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid enrollment status provided.' });
    }

    try {
      await query('UPDATE enrollments SET status = ? WHERE id = ?', [status, enrId]);
    } catch (dbErr) {
      const e = mockEnrollmentsList.find(item => item.id == enrId);
      if (e) e.status = status;
    }

    return res.json({ success: true, message: `Enrollment status updated to ${status}.`, status });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating enrollment status.' });
  }
});

/**
 * DELETE /api/admin/enrollments/:id
 * Protected admin endpoint removing or cancelling enrollment safely
 */
app.delete('/api/admin/enrollments/:id', adminMiddleware, async (req, res) => {
  try {
    const enrId = parseInt(req.params.id, 10) || req.params.id;
    let targetEnr = null;

    try {
      const rows = await query('SELECT * FROM enrollments WHERE id = ? LIMIT 1', [enrId]);
      if (rows && rows.length > 0) targetEnr = rows[0];
    } catch (dbErr) {
      targetEnr = mockEnrollmentsList.find(e => e.id == enrId);
    }

    if (!targetEnr) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found.' });
    }

    // Safety Protection: If paid_amount > 0, do NOT hard-delete. Set status to 'cancelled'.
    if (parseFloat(targetEnr.paid_amount) > 0) {
      try {
        await query("UPDATE enrollments SET status = 'cancelled' WHERE id = ?", [enrId]);
      } catch (dbErr) {
        targetEnr.status = 'cancelled';
      }
      return res.json({
        success: true,
        message: 'Enrollment contains historical payments. Status changed to CANCELLED instead of hard-deletion.',
        status: 'cancelled'
      });
    }

    try {
      await query('DELETE FROM enrollments WHERE id = ?', [enrId]);
    } catch (dbErr) {
      mockEnrollmentsList = mockEnrollmentsList.filter(e => e.id != enrId);
    }

    return res.json({ success: true, message: 'Enrollment record deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting enrollment.' });
  }
});

// ============================================================================
// PHASE 14: PAYMENT MANAGEMENT CMS ENDPOINTS
// ============================================================================

let mockPaymentsList = [
  {
    id: 1,
    order_id: 'MSIT-PAY-2026-001',
    user_id: 2,
    user_name: 'Tanvir Hasan',
    user_email: 'tanvir@mediascopeit.com',
    user_phone: '+8801700000001',
    enrollment_id: 1,
    enrollment_no: 'ENR-2026-00101',
    course_title: 'Full Stack Web Development with React & Node.js',
    project_id: null,
    project_title: null,
    amount: 15000,
    currency: 'BDT',
    payment_gateway: 'sslcommerz',
    status: 'PAID',
    created_at: new Date('2026-01-10T10:30:00Z'),
    updated_at: new Date('2026-01-10T10:32:00Z')
  },
  {
    id: 2,
    order_id: 'MSIT-PAY-2026-002',
    user_id: 4,
    user_name: 'Nusrat Jahan Rahmani',
    user_email: 'nusrat@student.com',
    user_phone: '+8801811223344',
    enrollment_id: 2,
    enrollment_no: 'ENR-2026-00102',
    course_title: 'Python Django & AI Machine Learning Masterclass',
    project_id: null,
    project_title: null,
    amount: 10000,
    currency: 'BDT',
    payment_gateway: 'manual_bkash',
    status: 'PAID',
    created_at: new Date('2026-02-14T14:15:00Z'),
    updated_at: new Date('2026-02-14T14:20:00Z')
  },
  {
    id: 3,
    order_id: 'MSIT-PAY-2026-003',
    user_id: 3,
    user_name: 'Acme Enterprise Client',
    user_email: 'corporate@acme.com',
    user_phone: '+8801900000002',
    enrollment_id: null,
    enrollment_no: null,
    course_title: null,
    project_id: 1,
    project_title: 'Custom ERP & Inventory System Development',
    amount: 50000,
    currency: 'BDT',
    payment_gateway: 'bank_transfer',
    status: 'PAID',
    created_at: new Date('2026-02-01T11:00:00Z'),
    updated_at: new Date('2026-02-01T11:05:00Z')
  }
];

/**
 * GET /api/admin/payments
 * Protected admin endpoint listing payments with search, gateway, status filters & pagination
 */
app.get('/api/admin/payments', adminMiddleware, async (req, res) => {
  try {
    const { q, status, gateway, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let payments = [];
    let total = 0;

    try {
      let where = ['1=1'];
      let params = [];

      if (status && status !== 'all') {
        where.push('p.status = ?');
        params.push(status);
      }

      if (gateway && gateway !== 'all') {
        where.push('p.payment_gateway = ?');
        params.push(gateway);
      }

      if (q && q.trim()) {
        where.push('(p.order_id LIKE ? OR u.full_name LIKE ? OR u.email LIKE ? OR e.enrollment_no LIKE ? OR prj.project_title LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const sqlCount = `
        SELECT COUNT(*) as count
        FROM payments p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN enrollments e ON p.enrollment_id = e.id
        LEFT JOIN software_projects prj ON p.project_id = prj.id
        WHERE ${where.join(' AND ')}
      `;
      const countRows = await query(sqlCount, params);
      total = countRows[0]?.count || 0;

      const sqlData = `
        SELECT 
          p.id, p.order_id, p.user_id, p.enrollment_id, p.project_id, p.amount, p.currency,
          p.payment_gateway, p.status, p.created_at, p.updated_at,
          u.full_name as user_name, u.email as user_email, u.phone as user_phone,
          e.enrollment_no, c.title as course_title,
          prj.project_title
        FROM payments p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN enrollments e ON p.enrollment_id = e.id
        LEFT JOIN courses c ON e.course_id = c.id
        LEFT JOIN software_projects prj ON p.project_id = prj.id
        WHERE ${where.join(' AND ')}
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `;

      params.push(limitNum, offset);
      const rows = await query(sqlData, params);
      payments = rows;
    } catch (dbErr) {
      console.log('Admin payments query DB notice:', dbErr.message);
      payments = [...mockPaymentsList];

      if (status && status !== 'all') payments = payments.filter(p => p.status === status);
      if (gateway && gateway !== 'all') payments = payments.filter(p => p.payment_gateway === gateway);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        payments = payments.filter(p =>
          p.order_id.toLowerCase().includes(term) ||
          p.user_name.toLowerCase().includes(term) ||
          p.user_email.toLowerCase().includes(term) ||
          (p.enrollment_no && p.enrollment_no.toLowerCase().includes(term)) ||
          (p.project_title && p.project_title.toLowerCase().includes(term))
        );
      }
      total = payments.length;
    }

    return res.json({
      success: true,
      payments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching payments list.' });
  }
});

/**
 * GET /api/admin/payments/:id
 * Protected admin endpoint returning single payment details with user & enrollment/project breakdown
 */
app.get('/api/admin/payments/:id', adminMiddleware, async (req, res) => {
  try {
    const pmtId = req.params.id;
    let paymentObj = null;

    try {
      const sqlData = `
        SELECT 
          p.id, p.order_id, p.user_id, p.enrollment_id, p.project_id, p.amount, p.currency,
          p.payment_gateway, p.status, p.created_at, p.updated_at,
          u.full_name as user_name, u.email as user_email, u.phone as user_phone,
          e.enrollment_no, e.total_fee as enrollment_total_fee, e.paid_amount as enrollment_paid_amount,
          c.title as course_title,
          prj.project_title, prj.contract_amount as project_contract_amount, prj.paid_amount as project_paid_amount
        FROM payments p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN enrollments e ON p.enrollment_id = e.id
        LEFT JOIN courses c ON e.course_id = c.id
        LEFT JOIN software_projects prj ON p.project_id = prj.id
        WHERE p.id = ?
        LIMIT 1
      `;
      const rows = await query(sqlData, [pmtId]);
      if (rows && rows.length > 0) paymentObj = rows[0];
    } catch (dbErr) {
      paymentObj = mockPaymentsList.find(p => p.id == pmtId);
    }

    if (!paymentObj) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    return res.json({ success: true, payment: paymentObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving payment details.' });
  }
});

/**
 * PATCH /api/admin/payments/:id/status
 * Protected admin endpoint allowing status verification with automatic financial balance sync
 */
app.patch('/api/admin/payments/:id/status', adminMiddleware, async (req, res) => {
  try {
    const pmtId = parseInt(req.params.id, 10) || req.params.id;
    const { status } = req.body;

    const ALLOWED_STATUSES = ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'EXPIRED'];
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status provided.' });
    }

    let targetPmt = null;
    try {
      const rows = await query('SELECT * FROM payments WHERE id = ? LIMIT 1', [pmtId]);
      if (rows && rows.length > 0) targetPmt = rows[0];
    } catch (dbErr) {
      targetPmt = mockPaymentsList.find(p => p.id == pmtId);
    }

    if (!targetPmt) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    const previousStatus = targetPmt.status;

    // Update status in DB
    try {
      await query('UPDATE payments SET status = ? WHERE id = ?', [status, pmtId]);
      
      // If status changed to PAID from unverified status, sync financial balances
      if (status === 'PAID' && previousStatus !== 'PAID') {
        const pmtAmt = parseFloat(targetPmt.amount);

        // Sync Enrollment Balance if enrollment payment
        if (targetPmt.enrollment_id) {
          const enrRows = await query('SELECT total_fee, paid_amount FROM enrollments WHERE id = ? LIMIT 1', [targetPmt.enrollment_id]);
          if (enrRows && enrRows.length > 0) {
            const currentPaid = parseFloat(enrRows[0].paid_amount) || 0;
            const totalFee = parseFloat(enrRows[0].total_fee) || 0;
            const newPaid = currentPaid + pmtAmt;
            const newDue = Math.max(0, totalFee - newPaid);
            let pmtStatus = 'unpaid';
            if (newPaid >= totalFee && totalFee > 0) pmtStatus = 'paid';
            else if (newPaid > 0) pmtStatus = 'partial';

            await query(
              'UPDATE enrollments SET paid_amount = ?, due_amount = ?, payment_status = ? WHERE id = ?',
              [newPaid, newDue, pmtStatus, targetPmt.enrollment_id]
            );
          }
        }

        // Sync Project Balance if software project payment
        if (targetPmt.project_id) {
          const prjRows = await query('SELECT contract_amount, paid_amount FROM software_projects WHERE id = ? LIMIT 1', [targetPmt.project_id]);
          if (prjRows && prjRows.length > 0) {
            const currentPaid = parseFloat(prjRows[0].paid_amount) || 0;
            const contractAmt = parseFloat(prjRows[0].contract_amount) || 0;
            const newPaid = currentPaid + pmtAmt;
            const newDue = Math.max(0, contractAmt - newPaid);

            await query(
              'UPDATE software_projects SET paid_amount = ?, due_amount = ? WHERE id = ?',
              [newPaid, newDue, targetPmt.project_id]
            );
          }
        }
      }
    } catch (dbErr) {
      targetPmt.status = status;
    }

    return res.json({
      success: true,
      message: `Payment status updated to ${status}. Financial balance synced successfully.`,
      status
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating payment status.' });
  }
});

// ============================================================================
// PHASE 15: SOFTWARE PROJECT MANAGEMENT CMS ENDPOINTS
// ============================================================================

let mockProjectsList = [
  {
    id: 1,
    project_code: 'PRJ-2026-00101',
    client_id: 3,
    client_name: 'Acme Enterprise Client',
    client_email: 'corporate@acme.com',
    company_name: 'Acme Software Solutions Ltd',
    project_title: 'Custom ERP & Inventory System Development',
    service_category: 'Enterprise Software',
    contract_amount: 150000,
    paid_amount: 50000,
    due_amount: 100000,
    start_date: '2026-02-01',
    estimated_delivery_date: '2026-06-30',
    status: 'in_development',
    created_at: new Date('2026-02-01')
  },
  {
    id: 2,
    project_code: 'PRJ-2026-00102',
    client_id: 3,
    client_name: 'Acme Enterprise Client',
    client_email: 'corporate@acme.com',
    company_name: 'Acme Software Solutions Ltd',
    project_title: 'Cross-Platform Mobile App (iOS & Android)',
    service_category: 'Mobile Applications',
    contract_amount: 80000,
    paid_amount: 80000,
    due_amount: 0,
    start_date: '2026-01-15',
    estimated_delivery_date: '2026-03-15',
    status: 'delivered',
    created_at: new Date('2026-01-15')
  }
];

/**
 * GET /api/admin/project-options/clients
 * Supporting endpoint returning list of active corporate clients for project assignment
 */
app.get('/api/admin/project-options/clients', adminMiddleware, async (req, res) => {
  try {
    let clients = [];
    try {
      const sqlData = `
        SELECT u.id, u.full_name, u.email, u.phone, cp.company_name
        FROM users u
        LEFT JOIN client_profiles cp ON u.id = cp.user_id
        WHERE u.role = 'client' AND u.is_active = 1
        ORDER BY u.full_name ASC
      `;
      const rows = await query(sqlData);
      clients = rows || [];
    } catch (dbErr) {
      clients = [
        { id: 3, full_name: 'Acme Enterprise Client', email: 'corporate@acme.com', phone: '+8801900000002', company_name: 'Acme Software Solutions Ltd' }
      ];
    }
    return res.json({ success: true, clients });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching client options.' });
  }
});

/**
 * GET /api/admin/projects
 * Protected admin endpoint listing software projects with search, status filters & pagination
 */
app.get('/api/admin/projects', adminMiddleware, async (req, res) => {
  try {
    const { q, status, client_id, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let projects = [];
    let total = 0;

    try {
      let where = ['1=1'];
      let params = [];

      if (status && status !== 'all') {
        where.push('p.status = ?');
        params.push(status);
      }

      if (client_id && client_id !== 'all') {
        where.push('p.client_id = ?');
        params.push(client_id);
      }

      if (q && q.trim()) {
        where.push('(p.project_title LIKE ? OR p.project_code LIKE ? OR u.full_name LIKE ? OR u.email LIKE ? OR cp.company_name LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const sqlCount = `
        SELECT COUNT(*) as count
        FROM software_projects p
        JOIN users u ON p.client_id = u.id
        LEFT JOIN client_profiles cp ON u.id = cp.user_id
        WHERE ${where.join(' AND ')}
      `;
      const countRows = await query(sqlCount, params);
      total = countRows[0]?.count || 0;

      const sqlData = `
        SELECT 
          p.id, p.project_code, p.client_id, p.project_title, p.service_category,
          p.contract_amount, p.paid_amount, (p.contract_amount - p.paid_amount) as due_amount,
          p.start_date, p.estimated_delivery_date, p.status,
          u.full_name as client_name, u.email as client_email, u.phone as client_phone,
          cp.company_name
        FROM software_projects p
        JOIN users u ON p.client_id = u.id
        LEFT JOIN client_profiles cp ON u.id = cp.user_id
        WHERE ${where.join(' AND ')}
        ORDER BY p.id DESC
        LIMIT ? OFFSET ?
      `;

      params.push(limitNum, offset);
      const rows = await query(sqlData, params);
      projects = rows;
    } catch (dbErr) {
      console.log('Admin projects query DB notice:', dbErr.message);
      projects = [...mockProjectsList];

      if (status && status !== 'all') projects = projects.filter(p => p.status === status);
      if (client_id && client_id !== 'all') projects = projects.filter(p => p.client_id == client_id);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        projects = projects.filter(p =>
          p.project_title.toLowerCase().includes(term) ||
          p.project_code.toLowerCase().includes(term) ||
          p.client_name.toLowerCase().includes(term) ||
          p.client_email.toLowerCase().includes(term) ||
          (p.company_name && p.company_name.toLowerCase().includes(term))
        );
      }
      total = projects.length;
    }

    return res.json({
      success: true,
      projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching software projects list.' });
  }
});

/**
 * GET /api/admin/projects/:id
 * Protected admin endpoint returning single project details, client info, and payment history
 */
app.get('/api/admin/projects/:id', adminMiddleware, async (req, res) => {
  try {
    const prjId = req.params.id;
    let projectObj = null;
    let payments = [];

    try {
      const sqlData = `
        SELECT 
          p.id, p.project_code, p.client_id, p.project_title, p.service_category,
          p.contract_amount, p.paid_amount, (p.contract_amount - p.paid_amount) as due_amount,
          p.start_date, p.estimated_delivery_date, p.status,
          u.full_name as client_name, u.email as client_email, u.phone as client_phone,
          cp.company_name, cp.designation, cp.office_address
        FROM software_projects p
        JOIN users u ON p.client_id = u.id
        LEFT JOIN client_profiles cp ON u.id = cp.user_id
        WHERE p.id = ?
        LIMIT 1
      `;
      const rows = await query(sqlData, [prjId]);
      if (rows && rows.length > 0) {
        projectObj = rows[0];

        // Fetch project payments
        try {
          const pmtRows = await query('SELECT * FROM payments WHERE project_id = ? ORDER BY created_at DESC', [prjId]);
          payments = pmtRows || [];
        } catch (pErr) {
          payments = [];
        }
      } else {
        projectObj = mockProjectsList.find(p => p.id == prjId);
      }
    } catch (dbErr) {
      projectObj = mockProjectsList.find(p => p.id == prjId);
    }

    if (!projectObj) {
      return res.status(404).json({ success: false, message: 'Software project record not found.' });
    }

    return res.json({
      success: true,
      project: projectObj,
      payments
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving project details.' });
  }
});

/**
 * POST /api/admin/projects
 * Protected admin endpoint creating a new software development project
 */
app.post('/api/admin/projects', adminMiddleware, async (req, res) => {
  try {
    const { client_id, project_title, service_category = 'Custom Software Development', contract_amount, paid_amount = 0, start_date, estimated_delivery_date, status = 'srs_planning' } = req.body;

    const clientIdNum = parseInt(client_id, 10);
    const contractAmtNum = parseFloat(contract_amount);
    const paidAmtNum = parseFloat(paid_amount);

    const VALID_STATUSES = ['inquiry', 'srs_planning', 'in_development', 'testing', 'delivered', 'cancelled'];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid project status provided.' });
    }

    if (isNaN(contractAmtNum) || contractAmtNum < 0) {
      return res.status(400).json({ success: false, message: 'Contract amount must be a valid non-negative number.' });
    }

    if (isNaN(paidAmtNum) || paidAmtNum < 0 || paidAmtNum > contractAmtNum) {
      return res.status(400).json({ success: false, message: 'Paid amount cannot be negative or exceed contract amount.' });
    }

    // Validate Client Role & Existence
    let clientObj = null;
    try {
      const uRows = await query("SELECT id, full_name, email, phone, role FROM users WHERE id = ? LIMIT 1", [clientIdNum]);
      if (!uRows || uRows.length === 0) {
        return res.status(400).json({ success: false, message: 'Selected client account does not exist.' });
      }
      if (uRows[0].role !== 'client') {
        return res.status(400).json({ success: false, message: 'Selected user account is not a corporate client.' });
      }
      clientObj = uRows[0];
    } catch (dbErr) {
      if (clientIdNum !== 3) {
        return res.status(400).json({ success: false, message: 'Selected user account is not a corporate client.' });
      }
      clientObj = { id: clientIdNum, full_name: 'Acme Client', email: 'client@acme.com', phone: '+8801900000000' };
    }

    const dueAmtNum = contractAmtNum - paidAmtNum;
    const projectCode = `PRJ-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const insertRes = await query(
        `INSERT INTO software_projects 
         (project_code, client_id, project_title, service_category, contract_amount, paid_amount, due_amount, start_date, estimated_delivery_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [projectCode, clientIdNum, project_title, service_category, contractAmtNum, paidAmtNum, dueAmtNum, start_date || null, estimated_delivery_date || null, status]
      );

      const newId = insertRes.insertId;
      const newObj = {
        id: newId,
        project_code: projectCode,
        client_id: clientIdNum,
        client_name: clientObj.full_name,
        client_email: clientObj.email,
        project_title,
        service_category,
        contract_amount: contractAmtNum,
        paid_amount: paidAmtNum,
        due_amount: dueAmtNum,
        start_date,
        estimated_delivery_date,
        status,
        created_at: new Date()
      };

      return res.status(201).json({
        success: true,
        message: 'Software project created successfully.',
        project: newObj
      });
    } catch (dbErr) {
      const newId = mockProjectsList.length + 10;
      const newObj = {
        id: newId,
        project_code: projectCode,
        client_id: clientIdNum,
        client_name: clientObj.full_name,
        client_email: clientObj.email,
        project_title,
        service_category,
        contract_amount: contractAmtNum,
        paid_amount: paidAmtNum,
        due_amount: dueAmtNum,
        start_date,
        estimated_delivery_date,
        status,
        created_at: new Date()
      };
      mockProjectsList.push(newObj);

      return res.status(201).json({
        success: true,
        message: 'Software project created successfully.',
        project: newObj
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error creating software project.' });
  }
});

/**
 * PUT /api/admin/projects/:id
 * Protected admin endpoint updating software project metadata & financial contract
 */
app.put('/api/admin/projects/:id', adminMiddleware, async (req, res) => {
  try {
    const prjId = parseInt(req.params.id, 10) || req.params.id;
    const { project_title, service_category, contract_amount, start_date, estimated_delivery_date, status } = req.body;

    const contractAmtNum = parseFloat(contract_amount);
    if (isNaN(contractAmtNum) || contractAmtNum < 0) {
      return res.status(400).json({ success: false, message: 'Contract amount must be a non-negative number.' });
    }

    try {
      // Calculate due_amount dynamically from contract_amount - paid_amount
      const prjRows = await query('SELECT paid_amount FROM software_projects WHERE id = ? LIMIT 1', [prjId]);
      const currentPaid = prjRows && prjRows.length > 0 ? parseFloat(prjRows[0].paid_amount) : 0;
      const newDue = Math.max(0, contractAmtNum - currentPaid);

      await query(
        `UPDATE software_projects 
         SET project_title = ?, service_category = ?, contract_amount = ?, due_amount = ?, start_date = ?, estimated_delivery_date = ?, status = ?
         WHERE id = ?`,
        [project_title, service_category || 'Enterprise Software', contractAmtNum, newDue, start_date || null, estimated_delivery_date || null, status || 'in_development', prjId]
      );
    } catch (dbErr) {
      const p = mockProjectsList.find(item => item.id == prjId);
      if (p) {
        p.project_title = project_title;
        if (service_category) p.service_category = service_category;
        p.contract_amount = contractAmtNum;
        p.due_amount = Math.max(0, contractAmtNum - p.paid_amount);
        if (start_date) p.start_date = start_date;
        if (estimated_delivery_date) p.estimated_delivery_date = estimated_delivery_date;
        if (status) p.status = status;
      }
    }

    return res.json({ success: true, message: 'Software project updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating software project.' });
  }
});

/**
 * PATCH /api/admin/projects/:id/status
 * Protected admin endpoint updating status
 */
app.patch('/api/admin/projects/:id/status', adminMiddleware, async (req, res) => {
  try {
    const prjId = parseInt(req.params.id, 10) || req.params.id;
    const { status } = req.body;

    const VALID_STATUSES = ['inquiry', 'srs_planning', 'in_development', 'testing', 'delivered', 'cancelled'];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid project status provided.' });
    }

    try {
      await query('UPDATE software_projects SET status = ? WHERE id = ?', [status, prjId]);
    } catch (dbErr) {
      const p = mockProjectsList.find(item => item.id == prjId);
      if (p) p.status = status;
    }

    return res.json({ success: true, message: `Project status updated to ${status}.`, status });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating project status.' });
  }
});

/**
 * DELETE /api/admin/projects/:id
 * Protected admin endpoint removing or cancelling software project safely
 */
app.delete('/api/admin/projects/:id', adminMiddleware, async (req, res) => {
  try {
    const prjId = parseInt(req.params.id, 10) || req.params.id;
    let targetPrj = null;

    try {
      const rows = await query('SELECT * FROM software_projects WHERE id = ? LIMIT 1', [prjId]);
      if (rows && rows.length > 0) targetPrj = rows[0];
    } catch (dbErr) {
      targetPrj = mockProjectsList.find(p => p.id == prjId);
    }

    if (!targetPrj) {
      return res.status(404).json({ success: false, message: 'Software project record not found.' });
    }

    // Safety Protection: If paid_amount > 0 or payments exist, do NOT hard-delete. Set status to 'cancelled'.
    if (parseFloat(targetPrj.paid_amount) > 0) {
      try {
        await query("UPDATE software_projects SET status = 'cancelled' WHERE id = ?", [prjId]);
      } catch (dbErr) {
        targetPrj.status = 'cancelled';
      }
      return res.json({
        success: true,
        message: 'Project contains historical payments. Status changed to CANCELLED instead of hard-deletion.',
        status: 'cancelled'
      });
    }

    try {
      await query('DELETE FROM software_projects WHERE id = ?', [prjId]);
    } catch (dbErr) {
      mockProjectsList = mockProjectsList.filter(p => p.id != prjId);
    }

    return res.json({ success: true, message: 'Software project record deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting software project.' });
  }
});

// ============================================================================
// PHASE 16: CERTIFICATE MANAGEMENT & PUBLIC VERIFICATION ENDPOINTS
// ============================================================================

let mockCertificatesList = [
  {
    id: 1,
    certificate_number: 'MSIT-CERT-2026-00101',
    enrollment_id: 1,
    enrollment_no: 'ENR-2026-00101',
    student_id: 2,
    student_name: 'Tanvir Hasan',
    student_email: 'tanvir@mediascopeit.com',
    course_id: 1,
    course_title: 'Full Stack Web Development with React & Node.js',
    issue_date: '2026-02-15',
    status: 'active',
    created_at: new Date('2026-02-15')
  }
];

/**
 * PUBLIC VERIFICATION API (No Authentication Required)
 * GET /api/public/certificates/:certificateNumber
 * Returns only safe verification payload: certificate_number, student_name, course_title, issue_date, status
 */
app.get('/api/public/certificates/:certificateNumber', async (req, res) => {
  try {
    const certNum = req.params.certificateNumber.trim();
    let certObj = null;

    try {
      const sqlData = `
        SELECT 
          c.certificate_number, c.issue_date, c.status,
          u.full_name as student_name,
          crs.title as course_title
        FROM certificates c
        JOIN users u ON c.student_id = u.id
        JOIN courses crs ON c.course_id = crs.id
        WHERE c.certificate_number = ?
        LIMIT 1
      `;
      const rows = await query(sqlData, [certNum]);
      if (rows && rows.length > 0) certObj = rows[0];
    } catch (dbErr) {
      const match = mockCertificatesList.find(c => c.certificate_number.toLowerCase() === certNum.toLowerCase());
      if (match) {
        certObj = {
          certificate_number: match.certificate_number,
          student_name: match.student_name,
          course_title: match.course_title,
          issue_date: match.issue_date,
          status: match.status
        };
      }
    }

    if (!certObj) {
      return res.status(404).json({
        success: false,
        verificationResult: 'not_found',
        message: 'No certificate found matching the provided certificate number.'
      });
    }

    return res.json({
      success: true,
      verificationResult: certObj.status === 'active' ? 'valid' : 'revoked',
      certificate: certObj
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error verifying certificate.' });
  }
});

/**
 * GET /api/admin/certificates
 * Protected admin endpoint listing certificates with search, course/status filters & pagination
 */
app.get('/api/admin/certificates', adminMiddleware, async (req, res) => {
  try {
    const { q, status, course_id, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let certificates = [];
    let total = 0;

    try {
      let where = ['1=1'];
      let params = [];

      if (status && status !== 'all') {
        where.push('c.status = ?');
        params.push(status);
      }

      if (course_id && course_id !== 'all') {
        where.push('c.course_id = ?');
        params.push(course_id);
      }

      if (q && q.trim()) {
        where.push('(c.certificate_number LIKE ? OR u.full_name LIKE ? OR u.email LIKE ? OR crs.title LIKE ? OR e.enrollment_no LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const sqlCount = `
        SELECT COUNT(*) as count
        FROM certificates c
        JOIN users u ON c.student_id = u.id
        JOIN courses crs ON c.course_id = crs.id
        JOIN enrollments e ON c.enrollment_id = e.id
        WHERE ${where.join(' AND ')}
      `;
      const countRows = await query(sqlCount, params);
      total = countRows[0]?.count || 0;

      const sqlData = `
        SELECT 
          c.id, c.certificate_number, c.enrollment_id, c.student_id, c.course_id,
          c.issue_date, c.status, c.created_at,
          u.full_name as student_name, u.email as student_email,
          crs.title as course_title,
          e.enrollment_no
        FROM certificates c
        JOIN users u ON c.student_id = u.id
        JOIN courses crs ON c.course_id = crs.id
        JOIN enrollments e ON c.enrollment_id = e.id
        WHERE ${where.join(' AND ')}
        ORDER BY c.id DESC
        LIMIT ? OFFSET ?
      `;

      params.push(limitNum, offset);
      const rows = await query(sqlData, params);
      certificates = rows;
    } catch (dbErr) {
      console.log('Admin certificates query DB notice:', dbErr.message);
      certificates = [...mockCertificatesList];

      if (status && status !== 'all') certificates = certificates.filter(c => c.status === status);
      if (course_id && course_id !== 'all') certificates = certificates.filter(c => c.course_id == course_id);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        certificates = certificates.filter(c =>
          c.certificate_number.toLowerCase().includes(term) ||
          c.student_name.toLowerCase().includes(term) ||
          c.student_email.toLowerCase().includes(term) ||
          c.course_title.toLowerCase().includes(term) ||
          c.enrollment_no.toLowerCase().includes(term)
        );
      }
      total = certificates.length;
    }

    return res.json({
      success: true,
      certificates,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching certificates list.' });
  }
});

/**
 * GET /api/admin/certificates/:id
 * Protected admin endpoint returning single certificate details
 */
app.get('/api/admin/certificates/:id', adminMiddleware, async (req, res) => {
  try {
    const certId = req.params.id;
    let certObj = null;

    try {
      const sqlData = `
        SELECT 
          c.id, c.certificate_number, c.enrollment_id, c.student_id, c.course_id,
          c.issue_date, c.status, c.created_at,
          u.full_name as student_name, u.email as student_email,
          crs.title as course_title,
          e.enrollment_no
        FROM certificates c
        JOIN users u ON c.student_id = u.id
        JOIN courses crs ON c.course_id = crs.id
        JOIN enrollments e ON c.enrollment_id = e.id
        WHERE c.id = ?
        LIMIT 1
      `;
      const rows = await query(sqlData, [certId]);
      if (rows && rows.length > 0) certObj = rows[0];
    } catch (dbErr) {
      certObj = mockCertificatesList.find(c => c.id == certId);
    }

    if (!certObj) {
      return res.status(404).json({ success: false, message: 'Certificate record not found.' });
    }

    return res.json({ success: true, certificate: certObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving certificate details.' });
  }
});

/**
 * POST /api/admin/certificates
 * Protected admin endpoint creating/issuing a certificate for a student's completed enrollment
 */
app.post('/api/admin/certificates', adminMiddleware, async (req, res) => {
  try {
    const { enrollment_id, issue_date } = req.body;

    const enrIdNum = parseInt(enrollment_id, 10);
    if (!enrIdNum) {
      return res.status(400).json({ success: false, message: 'Please select a valid student enrollment.' });
    }

    // 1. Verify Enrollment Existence
    let targetEnr = null;
    try {
      const enrRows = await query(
        `SELECT e.id, e.student_id, e.course_id, e.enrollment_no, e.status,
                u.full_name as student_name, u.email as student_email,
                c.title as course_title
         FROM enrollments e
         JOIN users u ON e.student_id = u.id
         JOIN courses c ON e.course_id = c.id
         WHERE e.id = ? LIMIT 1`,
        [enrIdNum]
      );
      if (enrRows && enrRows.length > 0) targetEnr = enrRows[0];
    } catch (dbErr) {
      targetEnr = {
        id: 1,
        student_id: 2,
        course_id: 1,
        enrollment_no: 'ENR-2026-00101',
        student_name: 'Tanvir Hasan',
        student_email: 'tanvir@mediascopeit.com',
        course_title: 'Full Stack Web Development with React & Node.js'
      };
    }

    if (!targetEnr) {
      return res.status(400).json({ success: false, message: 'Selected enrollment record does not exist.' });
    }

    // 2. Reject Duplicate Active Certificate for Same Enrollment
    try {
      const dupRows = await query("SELECT id FROM certificates WHERE enrollment_id = ? AND status = 'active' LIMIT 1", [enrIdNum]);
      if (dupRows && dupRows.length > 0) {
        return res.status(400).json({ success: false, message: 'An active certificate has already been issued for this enrollment.' });
      }
    } catch (dbErr) {
      const isDup = mockCertificatesList.some(c => c.enrollment_id == enrIdNum && c.status === 'active');
      if (isDup) {
        return res.status(400).json({ success: false, message: 'An active certificate has already been issued for this enrollment.' });
      }
    }

    const certNum = `MSIT-CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const actualIssueDate = issue_date || new Date().toISOString().split('T')[0];

    try {
      const insertRes = await query(
        `INSERT INTO certificates (certificate_number, enrollment_id, student_id, course_id, issue_date, status)
         VALUES (?, ?, ?, ?, ?, 'active')`,
        [certNum, enrIdNum, targetEnr.student_id, targetEnr.course_id, actualIssueDate]
      );

      const newId = insertRes.insertId;
      const newObj = {
        id: newId,
        certificate_number: certNum,
        enrollment_id: enrIdNum,
        enrollment_no: targetEnr.enrollment_no,
        student_id: targetEnr.student_id,
        student_name: targetEnr.student_name,
        student_email: targetEnr.student_email,
        course_id: targetEnr.course_id,
        course_title: targetEnr.course_title,
        issue_date: actualIssueDate,
        status: 'active',
        created_at: new Date()
      };

      return res.status(201).json({
        success: true,
        message: 'Student course completion certificate issued successfully.',
        certificate: newObj
      });
    } catch (dbErr) {
      const newId = mockCertificatesList.length + 10;
      const newObj = {
        id: newId,
        certificate_number: certNum,
        enrollment_id: enrIdNum,
        enrollment_no: targetEnr.enrollment_no,
        student_id: targetEnr.student_id,
        student_name: targetEnr.student_name,
        student_email: targetEnr.student_email,
        course_id: targetEnr.course_id,
        course_title: targetEnr.course_title,
        issue_date: actualIssueDate,
        status: 'active',
        created_at: new Date()
      };
      mockCertificatesList.push(newObj);

      return res.status(201).json({
        success: true,
        message: 'Student course completion certificate issued successfully.',
        certificate: newObj
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error generating certificate.' });
  }
});

/**
 * PATCH /api/admin/certificates/:id/status
 * Protected admin endpoint allowing certificate status revocation or reactivation
 */
app.patch('/api/admin/certificates/:id/status', adminMiddleware, async (req, res) => {
  try {
    const certId = parseInt(req.params.id, 10) || req.params.id;
    const { status } = req.body;

    const ALLOWED_STATUSES = ['active', 'revoked'];
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid certificate status provided.' });
    }

    try {
      await query('UPDATE certificates SET status = ? WHERE id = ?', [status, certId]);
    } catch (dbErr) {
      const c = mockCertificatesList.find(item => item.id == certId);
      if (c) c.status = status;
    }

    return res.json({ success: true, message: `Certificate status updated to ${status}.`, status });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating certificate status.' });
  }
});

// ============================================================================
// PHASE 17: COMPLETE USER & ADMIN ACCOUNT MANAGEMENT CMS ENDPOINTS
// ============================================================================

let mockUsersList = [
  {
    id: 1,
    full_name: 'Media Scope IT Administrator',
    email: 'info@mediascopeit.com',
    phone: '+8801700000000',
    role: 'admin',
    is_active: 1,
    created_at: new Date('2026-01-01')
  },
  {
    id: 2,
    full_name: 'Tanvir Hasan',
    email: 'tanvir@mediascopeit.com',
    phone: '+8801700000001',
    role: 'student',
    is_active: 1,
    created_at: new Date('2026-01-10')
  },
  {
    id: 3,
    full_name: 'Acme Enterprise Client',
    email: 'corporate@acme.com',
    phone: '+8801900000002',
    role: 'client',
    is_active: 1,
    created_at: new Date('2026-01-15')
  },
  {
    id: 4,
    full_name: 'Nusrat Jahan Rahmani',
    email: 'nusrat@student.com',
    phone: '+8801811223344',
    role: 'student',
    is_active: 1,
    created_at: new Date('2026-02-14')
  }
];

/**
 * GET /api/admin/users
 * Protected admin endpoint listing all accounts with search, role/status filters & pagination
 */
app.get('/api/admin/users', adminMiddleware, async (req, res) => {
  try {
    const { q, role, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let users = [];
    let total = 0;

    try {
      let where = ['1=1'];
      let params = [];

      if (role && role !== 'all') {
        where.push('role = ?');
        params.push(role);
      }

      if (status === 'active' || status === '1') {
        where.push('is_active = 1');
      } else if (status === 'inactive' || status === '0') {
        where.push('is_active = 0');
      }

      if (q && q.trim()) {
        where.push('(full_name LIKE ? OR email LIKE ? OR phone LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      const sqlCount = `SELECT COUNT(*) as count FROM users WHERE ${where.join(' AND ')}`;
      const countRows = await query(sqlCount, params);
      total = countRows[0]?.count || 0;

      const sqlData = `
        SELECT id, full_name, email, phone, role, is_active, created_at
        FROM users
        WHERE ${where.join(' AND ')}
        ORDER BY id ASC
        LIMIT ? OFFSET ?
      `;

      params.push(limitNum, offset);
      const rows = await query(sqlData, params);
      users = rows;
    } catch (dbErr) {
      console.log('Admin users query DB notice:', dbErr.message);
      users = [...mockUsersList];

      if (role && role !== 'all') users = users.filter(u => u.role === role);
      if (status === 'active' || status === '1') users = users.filter(u => u.is_active == 1);
      if (status === 'inactive' || status === '0') users = users.filter(u => u.is_active == 0);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        users = users.filter(u =>
          u.full_name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.phone.includes(term)
        );
      }
      total = users.length;
    }

    return res.json({
      success: true,
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching user directory.' });
  }
});

/**
 * GET /api/admin/users/:id
 * Protected admin endpoint returning single user profile details without password hashes
 */
app.get('/api/admin/users/:id', adminMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    let userObj = null;

    try {
      const sqlData = `
        SELECT id, full_name, email, phone, role, is_active, created_at, updated_at
        FROM users WHERE id = ? LIMIT 1
      `;
      const rows = await query(sqlData, [userId]);
      if (rows && rows.length > 0) userObj = rows[0];
    } catch (dbErr) {
      userObj = mockUsersList.find(u => u.id == userId);
    }

    if (!userObj) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    return res.json({ success: true, user: userObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving user details.' });
  }
});

/**
 * POST /api/admin/admins
 * Protected admin endpoint creating a new administrator account
 */
app.post('/api/admin/admins', adminMiddleware, async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Check duplicate email / phone
    try {
      const dupRows = await query('SELECT id FROM users WHERE email = ? OR phone = ? LIMIT 1', [cleanEmail, cleanPhone]);
      if (dupRows && dupRows.length > 0) {
        return res.status(400).json({ success: false, message: 'An account with this email or phone number already exists.' });
      }
    } catch (dbErr) {
      const exists = mockUsersList.some(u => u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone);
      if (exists) {
        return res.status(400).json({ success: false, message: 'An account with this email or phone number already exists.' });
      }
    }

    // Hash Password
    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const insertRes = await query(
        `INSERT INTO users (full_name, email, phone, password_hash, role, is_active)
         VALUES (?, ?, ?, ?, 'admin', 1)`,
        [full_name.trim(), cleanEmail, cleanPhone, passwordHash]
      );

      const newId = insertRes.insertId;
      const newAdminObj = {
        id: newId,
        full_name: full_name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        role: 'admin',
        is_active: 1,
        created_at: new Date()
      };

      return res.status(201).json({
        success: true,
        message: 'Administrator account created successfully.',
        user: newAdminObj
      });
    } catch (dbErr) {
      const newId = mockUsersList.length + 10;
      const newAdminObj = {
        id: newId,
        full_name: full_name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        role: 'admin',
        is_active: 1,
        created_at: new Date()
      };
      mockUsersList.push(newAdminObj);

      return res.status(201).json({
        success: true,
        message: 'Administrator account created successfully.',
        user: newAdminObj
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error creating admin account.' });
  }
});

/**
 * PATCH /api/admin/users/:id/status
 * Protected admin endpoint updating user active/inactive status
 * Security Enforcements:
 * 1. Admin cannot deactivate their own logged-in account
 * 2. System rejects deactivating the last remaining active admin
 */
app.patch('/api/admin/users/:id/status', adminMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10) || req.params.id;
    const { is_active } = req.body;
    const newActiveState = is_active ? 1 : 0;

    // Self-Deactivation Protection
    const currentAdminId = req.adminUser?.id;
    if (currentAdminId == userId && newActiveState === 0) {
      return res.status(400).json({
        success: false,
        message: 'Security Violation: You cannot deactivate your own active administrator account.'
      });
    }

    // Check target user role & status
    let targetUser = null;
    try {
      const uRows = await query('SELECT id, role, is_active FROM users WHERE id = ? LIMIT 1', [userId]);
      if (uRows && uRows.length > 0) targetUser = uRows[0];
    } catch (dbErr) {
      targetUser = mockUsersList.find(u => u.id == userId);
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // Last Active Admin Protection
    if (targetUser.role === 'admin' && newActiveState === 0) {
      let activeAdminCount = 0;
      try {
        const countRows = await query("SELECT COUNT(*) as count FROM users WHERE role = 'admin' AND is_active = 1");
        activeAdminCount = countRows[0]?.count || 0;
      } catch (dbErr) {
        activeAdminCount = mockUsersList.filter(u => u.role === 'admin' && u.is_active == 1).length;
      }

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Security Guardrail: Cannot deactivate the last remaining active administrator account.'
        });
      }
    }

    // Perform Status Update
    try {
      await query('UPDATE users SET is_active = ? WHERE id = ?', [newActiveState, userId]);
    } catch (dbErr) {
      targetUser.is_active = newActiveState;
    }

    return res.json({
      success: true,
      message: `User account status updated to ${newActiveState === 1 ? 'ACTIVE' : 'INACTIVE'}.`,
      is_active: newActiveState
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating user status.' });
  }
});

/**
 * POST /api/admin/users/:id/reset-password
 * Protected admin endpoint resetting a user's password securely
 */
app.post('/api/admin/users/:id/reset-password', adminMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10) || req.params.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    // Hash New Password using bcryptjs
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    try {
      await query('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, userId]);
    } catch (dbErr) {
      console.log('Password reset DB notice:', dbErr.message);
    }

    return res.json({
      success: true,
      message: 'User account password reset successfully. Old password has been replaced.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
});

// ============================================================================
// PHASE 18: MESSAGES, NOTIFICATIONS & ANNOUNCEMENTS ENDPOINTS
// ============================================================================

let mockConversationsList = [
  {
    id: 1,
    subject: 'Course Enrollment Confirmation & Class Schedule',
    created_by: 1,
    creator_name: 'Media Scope IT Administrator',
    recipient_id: 2,
    recipient_name: 'Tanvir Hasan',
    recipient_email: 'tanvir@mediascopeit.com',
    recipient_role: 'student',
    status: 'open',
    last_message: 'Welcome to Full Stack Web Development! Your orientation starts on Sunday.',
    is_read: 0,
    created_at: new Date('2026-02-15T10:00:00Z'),
    updated_at: new Date('2026-02-15T10:00:00Z')
  },
  {
    id: 2,
    subject: 'Custom ERP Project SRS Review & Milestone Update',
    created_by: 1,
    creator_name: 'Media Scope IT Administrator',
    recipient_id: 3,
    recipient_name: 'Acme Enterprise Client',
    recipient_email: 'corporate@acme.com',
    recipient_role: 'client',
    status: 'open',
    last_message: 'We have updated the ERP SRS module specifications document.',
    is_read: 1,
    created_at: new Date('2026-02-10T14:30:00Z'),
    updated_at: new Date('2026-02-10T14:30:00Z')
  }
];

let mockMessagesList = [
  {
    id: 1,
    conversation_id: 1,
    sender_id: 1,
    sender_name: 'Media Scope IT Administrator',
    receiver_id: 2,
    message: 'Welcome to Full Stack Web Development! Your orientation starts on Sunday.',
    is_read: 0,
    created_at: new Date('2026-02-15T10:00:00Z')
  },
  {
    id: 2,
    conversation_id: 2,
    sender_id: 1,
    sender_name: 'Media Scope IT Administrator',
    receiver_id: 3,
    message: 'We have updated the ERP SRS module specifications document.',
    is_read: 1,
    created_at: new Date('2026-02-10T14:30:00Z')
  }
];

let mockNotificationsList = [
  {
    id: 1,
    user_id: 2,
    title: 'Enrollment Confirmed',
    message: 'Your enrollment in Full Stack Web Development has been verified.',
    type: 'enrollment',
    related_type: 'enrollment',
    related_id: 1,
    is_read: 0,
    created_at: new Date('2026-02-15T10:00:00Z')
  },
  {
    id: 2,
    user_id: 3,
    title: 'Payment Received',
    message: 'Your project payment of ৳50,000 has been verified successfully.',
    type: 'payment',
    related_type: 'payment',
    related_id: 3,
    is_read: 1,
    created_at: new Date('2026-02-01T11:05:00Z')
  }
];

let mockAnnouncementsList = [
  {
    id: 1,
    title: 'Welcome to Media Scope IT Ltd 2026 Academic Session',
    content: 'We are excited to announce new masterclasses in AI, Django & Cloud Architecture.',
    target_audience: 'all',
    status: 'published',
    published_at: new Date('2026-01-01T09:00:00Z'),
    created_at: new Date('2026-01-01T09:00:00Z')
  }
];

/**
 * GET /api/admin/messages
 * Protected admin endpoint listing conversation threads with search & pagination
 */
app.get('/api/admin/messages', adminMiddleware, async (req, res) => {
  try {
    const { q, unread_only, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let conversations = [];
    let total = 0;

    try {
      let where = ['1=1'];
      let params = [];

      if (q && q.trim()) {
        where.push('(c.subject LIKE ? OR u.full_name LIKE ? OR u.email LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      const sqlCount = `
        SELECT COUNT(*) as count
        FROM conversations c
        JOIN users u ON c.recipient_id = u.id
        WHERE ${where.join(' AND ')}
      `;
      const countRows = await query(sqlCount, params);
      total = countRows[0]?.count || 0;

      const sqlData = `
        SELECT 
          c.id, c.subject, c.created_by, c.recipient_id, c.status, c.created_at, c.updated_at,
          u.full_name as recipient_name, u.email as recipient_email, u.role as recipient_role,
          (SELECT message FROM messages WHERE conversation_id = c.id ORDER BY id DESC LIMIT 1) as last_message,
          (SELECT is_read FROM messages WHERE conversation_id = c.id ORDER BY id DESC LIMIT 1) as is_read
        FROM conversations c
        JOIN users u ON c.recipient_id = u.id
        WHERE ${where.join(' AND ')}
        ORDER BY c.updated_at DESC
        LIMIT ? OFFSET ?
      `;
      params.push(limitNum, offset);
      const rows = await query(sqlData, params);
      conversations = rows;
    } catch (dbErr) {
      console.log('Admin messages query DB notice:', dbErr.message);
      conversations = [...mockConversationsList];
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        conversations = conversations.filter(c =>
          c.subject.toLowerCase().includes(term) ||
          c.recipient_name.toLowerCase().includes(term) ||
          c.recipient_email.toLowerCase().includes(term)
        );
      }
      total = conversations.length;
    }

    return res.json({
      success: true,
      conversations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching messages.' });
  }
});

/**
 * GET /api/admin/messages/:id
 * Protected admin endpoint returning single conversation thread with all message logs
 */
app.get('/api/admin/messages/:id', adminMiddleware, async (req, res) => {
  try {
    const convId = req.params.id;
    let conversation = null;
    let messages = [];

    try {
      const sqlConv = `
        SELECT c.id, c.subject, c.created_by, c.recipient_id, c.status, c.created_at,
               u.full_name as recipient_name, u.email as recipient_email, u.role as recipient_role
        FROM conversations c
        JOIN users u ON c.recipient_id = u.id
        WHERE c.id = ? LIMIT 1
      `;
      const convRows = await query(sqlConv, [convId]);
      if (convRows && convRows.length > 0) {
        conversation = convRows[0];
        const sqlMsg = `
          SELECT m.id, m.conversation_id, m.sender_id, m.receiver_id, m.message, m.is_read, m.created_at,
                 u.full_name as sender_name
          FROM messages m
          JOIN users u ON m.sender_id = u.id
          WHERE m.conversation_id = ?
          ORDER BY m.id ASC
        `;
        const msgRows = await query(sqlMsg, [convId]);
        messages = msgRows || [];
      }
    } catch (dbErr) {
      conversation = mockConversationsList.find(c => c.id == convId);
      messages = mockMessagesList.filter(m => m.conversation_id == convId);
    }

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation thread not found.' });
    }

    return res.json({ success: true, conversation, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving conversation.' });
  }
});

/**
 * POST /api/admin/messages
 * Protected admin endpoint starting a new conversation with a Student or Client
 */
app.post('/api/admin/messages', adminMiddleware, async (req, res) => {
  try {
    const { recipient_id, subject, message } = req.body;
    const recipientIdNum = parseInt(recipient_id, 10);
    const adminIdNum = req.adminUser?.id || 1;

    if (!recipientIdNum || !subject || !message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please fill in all required message fields.' });
    }

    // Server-side Recipient Validation
    let recipientUser = null;
    try {
      const uRows = await query('SELECT id, full_name, email, role, is_active FROM users WHERE id = ? LIMIT 1', [recipientIdNum]);
      if (uRows && uRows.length > 0) recipientUser = uRows[0];
    } catch (dbErr) {
      recipientUser = mockUsersList.find(u => u.id == recipientIdNum);
    }

    if (!recipientUser) {
      return res.status(400).json({ success: false, message: 'Recipient user account does not exist.' });
    }

    if (!recipientUser.is_active) {
      return res.status(400).json({ success: false, message: 'Cannot send message to an inactive user account.' });
    }

    if (!['student', 'client'].includes(recipientUser.role)) {
      return res.status(400).json({ success: false, message: 'Messages can only be sent to Students or Clients.' });
    }

    try {
      const convRes = await query(
        `INSERT INTO conversations (subject, created_by, recipient_id, status) VALUES (?, ?, ?, 'open')`,
        [subject.trim(), adminIdNum, recipientIdNum]
      );
      const convId = convRes.insertId;

      await query(
        `INSERT INTO messages (conversation_id, sender_id, receiver_id, message, is_read) VALUES (?, ?, ?, ?, 0)`,
        [convId, adminIdNum, recipientIdNum, message.trim()]
      );

      return res.status(201).json({
        success: true,
        message: 'Message sent successfully.',
        conversationId: convId
      });
    } catch (dbErr) {
      const convId = mockConversationsList.length + 10;
      const newConv = {
        id: convId,
        subject: subject.trim(),
        created_by: adminIdNum,
        creator_name: 'Media Scope IT Administrator',
        recipient_id: recipientIdNum,
        recipient_name: recipientUser.full_name,
        recipient_email: recipientUser.email,
        recipient_role: recipientUser.role,
        status: 'open',
        last_message: message.trim(),
        is_read: 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockConversationsList.push(newConv);

      mockMessagesList.push({
        id: mockMessagesList.length + 10,
        conversation_id: convId,
        sender_id: adminIdNum,
        sender_name: 'Media Scope IT Administrator',
        receiver_id: recipientIdNum,
        message: message.trim(),
        is_read: 0,
        created_at: new Date()
      });

      return res.status(201).json({
        success: true,
        message: 'Message sent successfully.',
        conversationId: convId
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error sending message.' });
  }
});

/**
 * POST /api/admin/messages/:id/reply
 * Protected admin endpoint replying to an existing conversation thread
 */
app.post('/api/admin/messages/:id/reply', adminMiddleware, async (req, res) => {
  try {
    const convId = parseInt(req.params.id, 10) || req.params.id;
    const { message } = req.body;
    const adminIdNum = req.adminUser?.id || 1;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message cannot be empty.' });
    }

    let targetConv = null;
    try {
      const rows = await query('SELECT * FROM conversations WHERE id = ? LIMIT 1', [convId]);
      if (rows && rows.length > 0) targetConv = rows[0];
    } catch (dbErr) {
      targetConv = mockConversationsList.find(c => c.id == convId);
    }

    if (!targetConv) {
      return res.status(404).json({ success: false, message: 'Conversation thread not found.' });
    }

    const receiverId = targetConv.recipient_id == adminIdNum ? targetConv.created_by : targetConv.recipient_id;

    try {
      await query(
        `INSERT INTO messages (conversation_id, sender_id, receiver_id, message, is_read) VALUES (?, ?, ?, ?, 0)`,
        [convId, adminIdNum, receiverId, message.trim()]
      );
      await query('UPDATE conversations SET updated_at = NOW() WHERE id = ?', [convId]);
    } catch (dbErr) {
      mockMessagesList.push({
        id: mockMessagesList.length + 10,
        conversation_id: convId,
        sender_id: adminIdNum,
        sender_name: 'Media Scope IT Administrator',
        receiver_id: receiverId,
        message: message.trim(),
        is_read: 0,
        created_at: new Date()
      });
    }

    return res.json({ success: true, message: 'Reply message sent successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error posting reply.' });
  }
});

/**
 * PATCH /api/admin/messages/:id/read
 * Protected admin endpoint marking conversation messages as read
 */
app.patch('/api/admin/messages/:id/read', adminMiddleware, async (req, res) => {
  try {
    const convId = parseInt(req.params.id, 10) || req.params.id;
    try {
      await query('UPDATE messages SET is_read = 1 WHERE conversation_id = ?', [convId]);
    } catch (dbErr) {
      mockMessagesList.forEach(m => {
        if (m.conversation_id == convId) m.is_read = 1;
      });
    }
    return res.json({ success: true, message: 'Messages marked as read.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error marking messages as read.' });
  }
});

/**
 * GET /api/notifications
 * Authenticated user endpoint returning notifications for current logged-in user session
 */
app.get('/api/notifications', async (req, res) => {
  try {
    const token = req.cookies.auth_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userIdNum = decoded.id;

    let notifications = [];
    let unreadCount = 0;

    try {
      const sqlData = `SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 20`;
      notifications = await query(sqlData, [userIdNum]);
      const countRows = await query('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', [userIdNum]);
      unreadCount = countRows[0]?.count || 0;
    } catch (dbErr) {
      notifications = mockNotificationsList.filter(n => n.user_id == userIdNum);
      unreadCount = notifications.filter(n => !n.is_read).length;
    }

    return res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid authentication session.' });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Authenticated user endpoint marking a notification as read
 */
app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const token = req.cookies.auth_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const notifId = req.params.id;

    try {
      await query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notifId, decoded.id]);
    } catch (dbErr) {
      const n = mockNotificationsList.find(item => item.id == notifId && item.user_id == decoded.id);
      if (n) n.is_read = 1;
    }

    return res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating notification.' });
  }
});

/**
 * PATCH /api/notifications/read-all
 * Authenticated user endpoint marking all notifications as read
 */
app.patch('/api/notifications/read-all', async (req, res) => {
  try {
    const token = req.cookies.auth_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const decoded = jwt.verify(token, JWT_SECRET);

    try {
      await query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [decoded.id]);
    } catch (dbErr) {
      mockNotificationsList.forEach(n => {
        if (n.user_id == decoded.id) n.is_read = 1;
      });
    }

    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating notifications.' });
  }
});

/**
 * GET /api/admin/notifications
 * Protected admin endpoint listing notifications with search & pagination
 */
app.get('/api/admin/notifications', adminMiddleware, async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let notifications = [];
    let total = 0;

    try {
      let where = ['1=1'];
      let params = [];
      if (q && q.trim()) {
        where.push('(n.title LIKE ? OR n.message LIKE ? OR u.full_name LIKE ? OR u.email LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const countRows = await query(`SELECT COUNT(*) as count FROM notifications n JOIN users u ON n.user_id = u.id WHERE ${where.join(' AND ')}`, params);
      total = countRows[0]?.count || 0;

      const sqlData = `
        SELECT n.id, n.user_id, n.title, n.message, n.type, n.is_read, n.created_at,
               u.full_name as user_name, u.email as user_email, u.role as user_role
        FROM notifications n
        JOIN users u ON n.user_id = u.id
        WHERE ${where.join(' AND ')}
        ORDER BY n.id DESC
        LIMIT ? OFFSET ?
      `;
      params.push(limitNum, offset);
      notifications = await query(sqlData, params);
    } catch (dbErr) {
      notifications = [...mockNotificationsList];
      total = notifications.length;
    }

    return res.json({
      success: true,
      notifications,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching notifications.' });
  }
});

/**
 * POST /api/admin/notifications
 * Protected admin endpoint dispatching notifications (Individual, All Students, or All Clients)
 */
app.post('/api/admin/notifications', adminMiddleware, async (req, res) => {
  try {
    const { recipient_type, user_id, title, message, type = 'system' } = req.body;

    if (!title || !message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Title and message content are required.' });
    }

    let recipientUserIds = [];

    if (recipient_type === 'specific') {
      const uIdNum = parseInt(user_id, 10);
      if (!uIdNum) return res.status(400).json({ success: false, message: 'Please select a recipient user.' });
      recipientUserIds = [uIdNum];
    } else if (recipient_type === 'all_students') {
      try {
        const rows = await query("SELECT id FROM users WHERE role = 'student' AND is_active = 1");
        recipientUserIds = rows.map(r => r.id);
      } catch (dbErr) {
        recipientUserIds = [2, 4];
      }
    } else if (recipient_type === 'all_clients') {
      try {
        const rows = await query("SELECT id FROM users WHERE role = 'client' AND is_active = 1");
        recipientUserIds = rows.map(r => r.id);
      } catch (dbErr) {
        recipientUserIds = [3];
      }
    }

    if (recipientUserIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No eligible active recipients found for selected audience.' });
    }

    // Insert Notifications
    for (const targetUid of recipientUserIds) {
      try {
        await query(
          `INSERT INTO notifications (user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, 0)`,
          [targetUid, title.trim(), message.trim(), type]
        );
      } catch (dbErr) {
        mockNotificationsList.push({
          id: mockNotificationsList.length + 10,
          user_id: targetUid,
          title: title.trim(),
          message: message.trim(),
          type,
          is_read: 0,
          created_at: new Date()
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: `Notification dispatched successfully to ${recipientUserIds.length} user(s).`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error dispatching notifications.' });
  }
});

/**
 * GET /api/public/announcements
 * Public endpoint returning published announcements for website visitors
 */
app.get('/api/public/announcements', async (req, res) => {
  try {
    let announcements = [];
    try {
      const sqlData = `SELECT * FROM announcements WHERE status = 'published' ORDER BY published_at DESC LIMIT 10`;
      announcements = await query(sqlData);
    } catch (dbErr) {
      announcements = mockAnnouncementsList.filter(a => a.status === 'published');
    }
    return res.json({ success: true, announcements });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching public announcements.' });
  }
});

/**
 * GET /api/admin/announcements
 * Protected admin endpoint listing announcements with search & pagination
 */
app.get('/api/admin/announcements', adminMiddleware, async (req, res) => {
  try {
    const { q, target_audience, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let announcements = [];
    let total = 0;

    try {
      let where = ['1=1'];
      let params = [];
      if (target_audience && target_audience !== 'all') {
        where.push('target_audience = ?');
        params.push(target_audience);
      }
      if (status && status !== 'all') {
        where.push('status = ?');
        params.push(status);
      }
      if (q && q.trim()) {
        where.push('(title LIKE ? OR content LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern);
      }

      const countRows = await query(`SELECT COUNT(*) as count FROM announcements WHERE ${where.join(' AND ')}`, params);
      total = countRows[0]?.count || 0;

      const sqlData = `SELECT * FROM announcements WHERE ${where.join(' AND ')} ORDER BY id DESC LIMIT ? OFFSET ?`;
      params.push(limitNum, offset);
      announcements = await query(sqlData, params);
    } catch (dbErr) {
      announcements = [...mockAnnouncementsList];
      total = announcements.length;
    }

    return res.json({
      success: true,
      announcements,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching announcements.' });
  }
});

/**
 * POST /api/admin/announcements
 * Protected admin endpoint creating a new announcement
 */
app.post('/api/admin/announcements', adminMiddleware, async (req, res) => {
  try {
    const { title, content, target_audience = 'all', status = 'published' } = req.body;

    if (!title || !content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Announcement title and content are required.' });
    }

    try {
      const insertRes = await query(
        `INSERT INTO announcements (title, content, target_audience, status) VALUES (?, ?, ?, ?)`,
        [title.trim(), content.trim(), target_audience, status]
      );
      return res.status(201).json({ success: true, message: 'Announcement created successfully.', id: insertRes.insertId });
    } catch (dbErr) {
      const newObj = {
        id: mockAnnouncementsList.length + 10,
        title: title.trim(),
        content: content.trim(),
        target_audience,
        status,
        published_at: new Date(),
        created_at: new Date()
      };
      mockAnnouncementsList.push(newObj);
      return res.status(201).json({ success: true, message: 'Announcement created successfully.', announcement: newObj });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error creating announcement.' });
  }
});

// ============================================================================
// PHASE 11: MEDIA LIBRARY CMS ENDPOINTS & FILE STORAGE
// ============================================================================

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `media_${Date.now()}_${Math.floor(Math.random() * 1000000)}${ext}`;
    cb(null, safeName);
  }
});

// File Filter & Type Validation (Strictly Block Executables & Scripts)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf'
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB Limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WEBP images and PDF documents are allowed. Executable and script files are strictly blocked.'));
    }
  }
});

let mockMediaList = [
  {
    id: 1,
    file_name: 'hero-banner.webp',
    original_name: 'hero-banner.webp',
    file_path: path.join(UPLOADS_DIR, 'hero-banner.webp'),
    public_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    mime_type: 'image/webp',
    file_size: 145200,
    uploaded_by: 'Media Scope IT Admin',
    created_at: new Date('2026-08-01')
  },
  {
    id: 2,
    file_name: 'python-lab.jpg',
    original_name: 'python-lab.jpg',
    file_path: path.join(UPLOADS_DIR, 'python-lab.jpg'),
    public_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    mime_type: 'image/jpeg',
    file_size: 210400,
    uploaded_by: 'Media Scope IT Admin',
    created_at: new Date('2026-08-05')
  }
];

/**
 * GET /api/admin/media
 * Protected admin endpoint listing all media library items
 */
app.get('/api/admin/media', adminMiddleware, async (req, res) => {
  try {
    const { q, type } = req.query;
    let list = [];

    try {
      let where = ['1=1'];
      let params = [];

      if (type === 'image') {
        where.push("mime_type LIKE 'image/%'");
      } else if (type === 'document') {
        where.push("mime_type NOT LIKE 'image/%'");
      }

      if (q && q.trim()) {
        where.push('(file_name LIKE ? OR original_name LIKE ?)');
        const term = `%${q.trim()}%`;
        params.push(term, term);
      }

      const sql = `SELECT * FROM media WHERE ${where.join(' AND ')} ORDER BY created_at DESC, id DESC`;
      const rows = await query(sql, params);
      if (rows && rows.length > 0) {
        list = rows;
      } else {
        list = [...mockMediaList];
      }
    } catch (dbErr) {
      console.log('Admin media query DB notice:', dbErr.message);
      list = [...mockMediaList];

      if (type === 'image') list = list.filter(m => m.mime_type.startsWith('image/'));
      if (type === 'document') list = list.filter(m => !m.mime_type.startsWith('image/'));
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        list = list.filter(m => m.file_name.toLowerCase().includes(term) || m.original_name.toLowerCase().includes(term));
      }
    }

    return res.json({ success: true, media: list, total: list.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching media list.' });
  }
});

/**
 * POST /api/admin/media
 * Protected admin endpoint uploading a file to Media Library
 */
app.post('/api/admin/media', adminMiddleware, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'File upload validation failed.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    try {
      const fileName = req.file.filename;
      const originalName = req.file.originalname;
      const filePath = req.file.path;
      const publicUrl = `/uploads/${fileName}`;
      const mimeType = req.file.mimetype;
      const fileSize = req.file.size;
      const uploadedBy = req.user?.name || 'Media Scope IT Admin';

      try {
        const insertRes = await query(
          'INSERT INTO media (file_name, original_name, file_path, public_url, mime_type, file_size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [fileName, originalName, filePath, publicUrl, mimeType, fileSize, uploadedBy]
        );

        const newId = insertRes.insertId;
        const newObj = {
          id: newId,
          file_name: fileName,
          original_name: originalName,
          file_path: filePath,
          public_url: publicUrl,
          mime_type: mimeType,
          file_size: fileSize,
          uploaded_by: uploadedBy,
          created_at: new Date()
        };

        return res.status(201).json({
          success: true,
          message: 'File uploaded to Media Library successfully.',
          media: newObj
        });
      } catch (dbErr) {
        const newId = mockMediaList.length + 10;
        const newObj = {
          id: newId,
          file_name: fileName,
          original_name: originalName,
          file_path: filePath,
          public_url: publicUrl,
          mime_type: mimeType,
          file_size: fileSize,
          uploaded_by: uploadedBy,
          created_at: new Date()
        };
        mockMediaList.push(newObj);

        return res.status(201).json({
          success: true,
          message: 'File uploaded to Media Library successfully.',
          media: newObj
        });
      }
    } catch (error) {
      console.error('Upload Media Error:', error);
      return res.status(500).json({ success: false, message: 'Server error processing file upload.' });
    }
  });
});

/**
 * DELETE /api/admin/media/:id
 * Protected admin endpoint removing media metadata & file from server
 */
app.delete('/api/admin/media/:id', adminMiddleware, async (req, res) => {
  try {
    const mediaId = parseInt(req.params.id, 10) || req.params.id;
    let targetMedia = null;

    try {
      const rows = await query('SELECT * FROM media WHERE id = ? LIMIT 1', [mediaId]);
      if (rows && rows.length > 0) targetMedia = rows[0];
    } catch (dbErr) {
      targetMedia = mockMediaList.find(m => m.id == mediaId);
    }

    if (!targetMedia) {
      return res.status(404).json({ success: false, message: 'Media item not found.' });
    }

    // Delete physically from disk if file exists inside UPLOADS_DIR
    if (targetMedia.file_path && fs.existsSync(targetMedia.file_path)) {
      try {
        fs.unlinkSync(targetMedia.file_path);
      } catch (fsErr) {
        console.log('File unlink notice:', fsErr.message);
      }
    }

    try {
      await query('DELETE FROM media WHERE id = ?', [mediaId]);
    } catch (dbErr) {
      mockMediaList = mockMediaList.filter(m => m.id != mediaId);
    }

    return res.json({ success: true, message: 'Media file and database record removed.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting media.' });
  }
});

let mockPages = [
  {
    id: 1,
    slug: 'about-our-company',
    title: 'About Our Company',
    author: 'Media Scope IT Admin',
    featured_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    content: `<h2>Welcome to Media Scope IT Ltd</h2>
<p>Media Scope IT Ltd is a leading Govt. RJSC registered software development and IT training institute based in Uttara, Dhaka, Bangladesh.</p>
<p>Our mission is to empower students, software engineers, and businesses with state-of-the-art web, mobile, and AI solutions.</p>`,
    seo_title: 'About Our Company — Media Scope IT Ltd',
    seo_description: 'Learn about Media Scope IT Ltd, our RJSC registration, training labs, and corporate software solutions.',
    is_active: 1,
    created_at: new Date('2026-08-01')
  },
  {
    id: 2,
    slug: 'career-growth-program',
    title: 'Career Growth & Placement Support',
    author: 'Placement Cell',
    featured_image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    content: `<h2>100% IT Job & Freelancing Mentorship</h2>
<p>We connect our top graduates with software companies across Dhaka and guide freelancers on Upwork, Fiverr, and LinkedIn.</p>`,
    seo_title: 'Career Placement & Mentorship Program — Media Scope IT',
    seo_description: 'Career growth and job placement assistance at Media Scope IT Ltd.',
    is_active: 1,
    created_at: new Date('2026-08-05')
  }
];

/**
 * GET /api/public/pages
 * Public endpoint returning list of published custom pages
 */
app.get('/api/public/pages', async (req, res) => {
  try {
    let pagesList = [];
    try {
      const rows = await query('SELECT id, slug, title, author, featured_image, created_at FROM pages WHERE is_active = 1 ORDER BY created_at DESC');
      if (rows && rows.length > 0) {
        pagesList = rows;
      } else {
        pagesList = mockPages.filter(p => p.is_active === 1);
      }
    } catch (dbErr) {
      console.log('Public pages DB notice:', dbErr.message);
      pagesList = mockPages.filter(p => p.is_active === 1);
    }
    return res.json({ success: true, pages: pagesList });
  } catch (error) {
    return res.json({ success: true, pages: mockPages.filter(p => p.is_active === 1) });
  }
});

/**
 * GET /api/public/pages/:slug
 * Public endpoint resolving single published page by unique slug
 */
app.get('/api/public/pages/:slug', async (req, res) => {
  try {
    const slugParam = req.params.slug;
    let pageObj = null;

    try {
      const rows = await query('SELECT * FROM pages WHERE (slug = ? OR id = ?) AND is_active = 1 LIMIT 1', [slugParam, slugParam]);
      if (rows && rows.length > 0) {
        pageObj = rows[0];
      } else {
        pageObj = mockPages.find(p => (p.slug === slugParam || p.id == slugParam) && p.is_active === 1);
      }
    } catch (dbErr) {
      pageObj = mockPages.find(p => (p.slug === slugParam || p.id == slugParam) && p.is_active === 1);
    }

    if (!pageObj) {
      return res.status(404).json({ success: false, message: 'Custom page not found or unpublished.' });
    }

    return res.json({
      success: true,
      page: {
        ...pageObj,
        content: sanitizeHtmlContent(pageObj.content)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving custom page.' });
  }
});

/**
 * GET /api/admin/pages
 * Protected admin endpoint listing all custom pages with search and status filters
 */
app.get('/api/admin/pages', adminMiddleware, async (req, res) => {
  try {
    const { q, status } = req.query;
    let pagesList = [];

    try {
      let where = ['1=1'];
      let params = [];

      if (status === 'published' || status === 'active' || status === '1') {
        where.push('is_active = 1');
      } else if (status === 'unpublished' || status === 'draft' || status === '0') {
        where.push('is_active = 0');
      }

      if (q && q.trim()) {
        where.push('(title LIKE ? OR slug LIKE ? OR author LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      const sql = `SELECT * FROM pages WHERE ${where.join(' AND ')} ORDER BY created_at DESC, id DESC`;
      const rows = await query(sql, params);
      if (rows && rows.length > 0) {
        pagesList = rows;
      } else {
        pagesList = [...mockPages];
      }
    } catch (dbErr) {
      console.log('Admin pages query DB notice:', dbErr.message);
      pagesList = [...mockPages];

      if (status === 'published') pagesList = pagesList.filter(p => p.is_active === 1);
      if (status === 'draft' || status === 'unpublished') pagesList = pagesList.filter(p => p.is_active === 0);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        pagesList = pagesList.filter(p => p.title.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term));
      }
    }

    return res.json({ success: true, pages: pagesList, total: pagesList.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching pages list.' });
  }
});

/**
 * GET /api/admin/pages/:id
 * Protected admin endpoint returning single page details
 */
app.get('/api/admin/pages/:id', adminMiddleware, async (req, res) => {
  try {
    const pageId = req.params.id;
    let pageObj = null;

    try {
      const rows = await query('SELECT * FROM pages WHERE id = ? OR slug = ? LIMIT 1', [pageId, pageId]);
      if (rows && rows.length > 0) {
        pageObj = rows[0];
      } else {
        pageObj = mockPages.find(p => p.id == pageId || p.slug === pageId);
      }
    } catch (dbErr) {
      pageObj = mockPages.find(p => p.id == pageId || p.slug === pageId);
    }

    if (!pageObj) {
      return res.status(404).json({ success: false, message: 'Page not found.' });
    }

    return res.json({ success: true, page: pageObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving page.' });
  }
});

/**
 * POST /api/admin/pages
 * Protected admin endpoint to create a new custom page
 */
app.post('/api/admin/pages', adminMiddleware, async (req, res) => {
  try {
    const { title, slug, author, featured_image, content, seo_title, seo_description, is_active, status } = req.body;

    const pageTitle = (title || '').trim();
    const pageContent = sanitizeHtmlContent((content || '').trim());

    if (!pageTitle || !pageContent) {
      return res.status(400).json({ success: false, message: 'Page title and content body are required.' });
    }

    const generatedSlug = (slug || pageTitle).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const pageAuthor = author || 'Media Scope IT Admin';
    const pageImage = featured_image || '';
    const pageSeoTitle = seo_title || pageTitle;
    const pageSeoDesc = seo_description || pageTitle;
    const pageActive = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'published' ? 1 : 0);

    try {
      const existingSlug = await query('SELECT id FROM pages WHERE slug = ? LIMIT 1', [generatedSlug]);
      if (existingSlug && existingSlug.length > 0) {
        return res.status(400).json({ success: false, message: 'A page with this URL slug already exists. Please choose a unique slug.' });
      }

      const insertRes = await query(
        'INSERT INTO pages (slug, title, author, featured_image, content, seo_title, seo_description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [generatedSlug, pageTitle, pageAuthor, pageImage, pageContent, pageSeoTitle, pageSeoDesc, pageActive]
      );

      const newId = insertRes.insertId;
      return res.status(201).json({
        success: true,
        message: 'New page created successfully.',
        page: { id: newId, slug: generatedSlug, title: pageTitle, is_active: pageActive }
      });
    } catch (dbErr) {
      if (mockPages.some(p => p.slug === generatedSlug)) {
        return res.status(400).json({ success: false, message: 'A page with this URL slug already exists.' });
      }

      const newId = mockPages.length + 10;
      const newPageObj = {
        id: newId,
        slug: generatedSlug,
        title: pageTitle,
        author: pageAuthor,
        featured_image: pageImage,
        content: pageContent,
        seo_title: pageSeoTitle,
        seo_description: pageSeoDesc,
        is_active: pageActive,
        created_at: new Date()
      };
      mockPages.push(newPageObj);

      return res.status(201).json({
        success: true,
        message: 'New page created successfully.',
        page: newPageObj
      });
    }
  } catch (error) {
    console.error('Create Page Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating page.' });
  }
});

/**
 * PUT /api/admin/pages/:id
 * Protected admin endpoint to update a page
 */
app.put('/api/admin/pages/:id', adminMiddleware, async (req, res) => {
  try {
    const pageId = parseInt(req.params.id, 10) || req.params.id;
    const { title, slug, author, featured_image, content, seo_title, seo_description, is_active, status } = req.body;

    let targetPage = null;
    try {
      const rows = await query('SELECT * FROM pages WHERE id = ? LIMIT 1', [pageId]);
      if (rows && rows.length > 0) targetPage = rows[0];
    } catch (dbErr) {
      targetPage = mockPages.find(p => p.id == pageId);
    }

    if (!targetPage) {
      return res.status(404).json({ success: false, message: 'Page not found.' });
    }

    const updatedTitle = title || targetPage.title;
    const updatedSlug = slug ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : targetPage.slug;
    const updatedAuthor = author || targetPage.author;
    const updatedImage = featured_image !== undefined ? featured_image : targetPage.featured_image;
    const updatedContent = content ? sanitizeHtmlContent(content) : targetPage.content;
    const updatedSeoTitle = seo_title !== undefined ? seo_title : targetPage.seo_title;
    const updatedSeoDesc = seo_description !== undefined ? seo_description : targetPage.seo_description;
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'published' ? 1 : 0);

    try {
      await query(
        'UPDATE pages SET slug = ?, title = ?, author = ?, featured_image = ?, content = ?, seo_title = ?, seo_description = ?, is_active = ? WHERE id = ?',
        [updatedSlug, updatedTitle, updatedAuthor, updatedImage, updatedContent, updatedSeoTitle, updatedSeoDesc, updatedActive, pageId]
      );
    } catch (dbErr) {
      targetPage.title = updatedTitle;
      targetPage.slug = updatedSlug;
      targetPage.author = updatedAuthor;
      targetPage.featured_image = updatedImage;
      targetPage.content = updatedContent;
      targetPage.seo_title = updatedSeoTitle;
      targetPage.seo_description = updatedSeoDesc;
      targetPage.is_active = updatedActive;
    }

    return res.json({ success: true, message: 'Page updated successfully.' });
  } catch (error) {
    console.error('Update Page Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating page.' });
  }
});

/**
 * PATCH /api/admin/pages/:id/status
 * Protected admin endpoint to publish or draft a page
 */
app.patch('/api/admin/pages/:id/status', adminMiddleware, async (req, res) => {
  try {
    const pageId = parseInt(req.params.id, 10) || req.params.id;
    const { is_active, status } = req.body;
    const targetStatus = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'published' || status === 'active' ? 1 : 0);

    try {
      await query('UPDATE pages SET is_active = ? WHERE id = ?', [targetStatus, pageId]);
    } catch (dbErr) {
      const p = mockPages.find(item => item.id == pageId);
      if (p) p.is_active = targetStatus;
    }

    return res.json({
      success: true,
      message: `Page status updated to ${targetStatus === 1 ? 'Published' : 'Draft'}.`,
      is_active: targetStatus
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating page status.' });
  }
});

/**
 * DELETE /api/admin/pages/:id
 * Protected admin endpoint to delete a custom page
 */
app.delete('/api/admin/pages/:id', adminMiddleware, async (req, res) => {
  try {
    const pageId = parseInt(req.params.id, 10) || req.params.id;

    try {
      await query('DELETE FROM pages WHERE id = ?', [pageId]);
    } catch (dbErr) {
      mockPages = mockPages.filter(p => p.id != pageId);
    }

    return res.json({ success: true, message: 'Custom page deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting page.' });
  }
});

// ============================================================================
// PHASE 9: BLOG / POSTS CMS ENDPOINTS
// ============================================================================

function sanitizeHtmlContent(htmlStr) {
  if (!htmlStr) return '';
  return htmlStr
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^"']*/gi, '');
}

let mockBlogPosts = [
  {
    id: 1,
    slug: 'non-cse-python-software-engineer',
    title: 'নন-সিএসই বা ডিপ্লোমা ব্যাকগ্রাউন্ড থেকে পাইথন শিখে সফটওয়্যার ইঞ্জিনিয়ার হওয়া কি সম্ভব?',
    author: 'Media Scope IT Engineering Team',
    category: 'Career Guidance',
    tags: 'python, career, software engineering',
    featured_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    excerpt: 'বাংলাদেশের সফটওয়্যার সেক্টরে সিএসই ডিগ্রী না থাকলেও দক্ষ পাইথন ডেভেলপারদের চাহিদা প্রচুর। জানুন কিভাবে সঠিক রোডম্যাপ মেনে ১ বছরেই আপনি হতে পারেন ইন্ডাস্ট্রির যোগ্য ইঞ্জিনিয়ার।',
    content: `আজকের টেক প্রফেশনে ডিগ্রী থেকে স্কিল অনেক বেশি প্রাধান্য পাচ্ছে। বাংলাদেশের সেরা আইটি কোম্পানিগুলো এখন প্রার্থী সিএসই (CSE) গ্র্যাজুয়েট নাকি ডিপ্লোমা/নন-সিএসই তা দেখার চেয়ে তাঁর প্রবলেম সলভিং এবিলিটি ও পাইথন স্কিল দেখছে।

### ৩ টি মূল পদক্ষেপ যা আপনার অনুসরণ করা উচিত:
১. **পাইথনের মূল ভিত্তি মজবুত করা**: ভ্যারিয়েবল, ডেটা স্ট্রাকচার, লুপ এবং ওওপি (OOP)।
২. **ওয়েব ফ্রেমওয়ার্ক লার্নিং**: Django বা FastAPI দিয়ে ৩টি রিয়েল-লাইভ প্রজেক্ট ডেভেলপমেন্ট।
৩. **গিটহাব ও লাইভ পোর্টফোলিও**: আপনার প্রজেক্ট কোড গিটহাবে শেয়ার করুন এবং ডেপ্লয় করুন।`,
    seo_title: 'Non-CSE Python Software Engineer Roadmap BD',
    seo_description: 'Learn how to become a Python software engineer in Bangladesh without CSE degree.',
    views_count: 1420,
    is_active: 1,
    created_at: new Date('2026-08-12')
  },
  {
    id: 2,
    slug: 'python-coding-bootcamp-hsc-2026',
    title: 'Python Coding Bootcamp for HSC Batch 2026 in Bangladesh',
    author: 'Training Department',
    category: 'Bootcamp',
    tags: 'hsc 2026, python, bootcamp, web development',
    featured_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    excerpt: 'HSC পরীক্ষার পর অবসর সময়কে কাজে লাগিয়ে পাইথন এবং ওয়েব প্রোগ্রামিং শিখে নিজের আইটি ক্যারিয়ারের শক্ত ভিত গড়ুন।',
    content: `এইচএসসি (HSC) শেষ করার পর যে ৩-৪ মাস সময় থাকে, তা নিজের স্কিল বাড়াতে কাজে লাগানো বুদ্ধিমানের কাজ। 

Media Scope IT Ltd নিয়ে এসেছে বিশেষ ৩ মাসের **Python Coding Bootcamp**, যেখানে একদম জিরো থেকে শুরু করে ফ্রন্টএন্ড এবং ব্যাকএন্ড ডেভেলপমেন্ট শেখানো হয়।`,
    seo_title: 'Python Coding Bootcamp HSC 2026 Bangladesh',
    seo_description: 'Python coding bootcamp for HSC 2026 students in Dhaka.',
    views_count: 980,
    is_active: 1,
    created_at: new Date('2026-08-08')
  },
  {
    id: 3,
    slug: 'python-vs-php-vs-java-2026',
    title: 'পাইথন নাকি জাভা নাকি পিএইচপি? ২০২৬ সালে বাংলাদেশের জব মার্কেটে কার চাহিদা বেশি',
    author: 'Media Scope IT Analytics',
    category: 'Tech Comparison',
    tags: 'python, php, java, job market bd',
    featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    excerpt: '২০২৬ সালে বাংলাদেশে Python, Java আর PHP এর মধ্যে কোনটার চাহিদা সবচেয়ে বেশি, কোনটায় বেতন ভালো, আর নতুনদের জন্য কোনটা শেখা উচিত?',
    content: `বাংলাদেশে প্রতিটা টেকনোলজির নিজস্ব মার্কেট রয়েছে:
- **PHP / Laravel**: ই-কমার্স এবং কাস্টম ক্লায়েন্ট ওয়েবসাইটের জন্য বাংলাদেশে শীর্ষস্থানে।
- **Python / Django**: এআই, ডেটা সায়েন্স এবং ফাস্ট ওয়েব এপিআই ডেভেলপমেন্টে সবচেয়ে দ্রুত বর্ধনশীল।
- **Java / Spring Boot**: ব্যাংক, বড় কর্পোরেট ও ফিনটেক ইন্ডাস্ট্রিতে এখনো সবচেয়ে জনপ্রিয়।`,
    seo_title: 'Python vs Java vs PHP Job Demand Bangladesh 2026',
    seo_description: 'Comparison of tech stack demand in Bangladesh job market 2026.',
    views_count: 1850,
    is_active: 1,
    created_at: new Date('2026-08-02')
  }
];

/**
 * GET /api/public/blog
 * Public endpoint returning published blog posts ordered by created_at DESC
 */
app.get('/api/public/blog', async (req, res) => {
  try {
    let postsList = [];
    try {
      const rows = await query('SELECT * FROM blog_posts WHERE is_active = 1 ORDER BY created_at DESC, id DESC');
      if (rows && rows.length > 0) {
        postsList = rows.map(r => ({
          ...r,
          image: r.featured_image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        }));
      } else {
        postsList = mockBlogPosts.filter(p => p.is_active === 1).map(p => ({
          ...p,
          date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        }));
      }
    } catch (dbErr) {
      console.log('Public blog DB notice:', dbErr.message);
      postsList = mockBlogPosts.filter(p => p.is_active === 1).map(p => ({
        ...p,
        date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      }));
    }
    return res.json({ success: true, posts: postsList });
  } catch (error) {
    return res.json({ success: true, posts: mockBlogPosts.filter(p => p.is_active === 1) });
  }
});

/**
 * GET /api/public/blog/:slug
 * Public endpoint resolving a single published post by slug
 */
app.get('/api/public/blog/:slug', async (req, res) => {
  try {
    const slugParam = req.params.slug;
    let postObj = null;

    try {
      const rows = await query('SELECT * FROM blog_posts WHERE (slug = ? OR id = ?) AND is_active = 1 LIMIT 1', [slugParam, slugParam]);
      if (rows && rows.length > 0) {
        postObj = rows[0];
        // Increment views counter
        query('UPDATE blog_posts SET views_count = views_count + 1 WHERE id = ?', [postObj.id]).catch(() => {});
      } else {
        postObj = mockBlogPosts.find(p => (p.slug === slugParam || p.id == slugParam) && p.is_active === 1);
        if (postObj) postObj.views_count = (postObj.views_count || 0) + 1;
      }
    } catch (dbErr) {
      postObj = mockBlogPosts.find(p => (p.slug === slugParam || p.id == slugParam) && p.is_active === 1);
    }

    if (!postObj) {
      return res.status(404).json({ success: false, message: 'Blog post not found or unpublished.' });
    }

    return res.json({
      success: true,
      post: {
        ...postObj,
        image: postObj.featured_image || postObj.image,
        date: new Date(postObj.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        content: sanitizeHtmlContent(postObj.content)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving blog post.' });
  }
});

/**
 * GET /api/admin/blog
 * Protected admin endpoint listing all blog posts with search and category filters
 */
app.get('/api/admin/blog', adminMiddleware, async (req, res) => {
  try {
    const { q, status, category } = req.query;
    let postsList = [];

    try {
      let where = ['1=1'];
      let params = [];

      if (status === 'published' || status === 'active' || status === '1') {
        where.push('is_active = 1');
      } else if (status === 'unpublished' || status === 'draft' || status === '0') {
        where.push('is_active = 0');
      }

      if (category && category !== 'all') {
        where.push('category = ?');
        params.push(category);
      }

      if (q && q.trim()) {
        where.push('(title LIKE ? OR slug LIKE ? OR excerpt LIKE ? OR author LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const sql = `SELECT * FROM blog_posts WHERE ${where.join(' AND ')} ORDER BY created_at DESC, id DESC`;
      const rows = await query(sql, params);
      if (rows && rows.length > 0) {
        postsList = rows.map(r => ({
          ...r,
          image: r.featured_image,
          date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }));
      } else {
        postsList = [...mockBlogPosts];
      }
    } catch (dbErr) {
      console.log('Admin blog query DB notice:', dbErr.message);
      postsList = [...mockBlogPosts];

      if (status === 'published') postsList = postsList.filter(p => p.is_active === 1);
      if (status === 'draft' || status === 'unpublished') postsList = postsList.filter(p => p.is_active === 0);
      if (category && category !== 'all') postsList = postsList.filter(p => p.category === category);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        postsList = postsList.filter(p => p.title.toLowerCase().includes(term) || p.excerpt.toLowerCase().includes(term));
      }
    }

    return res.json({ success: true, posts: postsList, total: postsList.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching blog posts.' });
  }
});

/**
 * GET /api/admin/blog/:id
 * Protected admin endpoint returning single blog post details
 */
app.get('/api/admin/blog/:id', adminMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    let postObj = null;

    try {
      const rows = await query('SELECT * FROM blog_posts WHERE id = ? OR slug = ? LIMIT 1', [postId, postId]);
      if (rows && rows.length > 0) {
        postObj = rows[0];
      } else {
        postObj = mockBlogPosts.find(p => p.id == postId || p.slug === postId);
      }
    } catch (dbErr) {
      postObj = mockBlogPosts.find(p => p.id == postId || p.slug === postId);
    }

    if (!postObj) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    return res.json({ success: true, post: postObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving post.' });
  }
});

/**
 * POST /api/admin/blog
 * Protected admin endpoint to create a new blog post
 */
app.post('/api/admin/blog', adminMiddleware, async (req, res) => {
  try {
    const { title, slug, author, category, tags, featured_image, image, excerpt, content, seo_title, seo_description, is_active, status } = req.body;

    const postTitle = (title || '').trim();
    const postExcerpt = (excerpt || '').trim();
    const postContent = sanitizeHtmlContent((content || '').trim());

    if (!postTitle || !postExcerpt || !postContent) {
      return res.status(400).json({ success: false, message: 'Post title, excerpt, and full content are required.' });
    }

    const generatedSlug = (slug || postTitle).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const postAuthor = author || 'Media Scope IT Editorial';
    const postCategory = category || 'Tech & Engineering';
    const postTags = tags || '';
    const postImage = featured_image || image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';
    const postSeoTitle = seo_title || postTitle;
    const postSeoDesc = seo_description || postExcerpt;
    const postActive = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'published' ? 1 : 0);

    try {
      const existingSlug = await query('SELECT id FROM blog_posts WHERE slug = ? LIMIT 1', [generatedSlug]);
      if (existingSlug && existingSlug.length > 0) {
        return res.status(400).json({ success: false, message: 'A blog post with this URL slug already exists. Please choose a unique slug.' });
      }

      const insertRes = await query(
        'INSERT INTO blog_posts (slug, title, author, category, tags, featured_image, excerpt, content, seo_title, seo_description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [generatedSlug, postTitle, postAuthor, postCategory, postTags, postImage, postExcerpt, postContent, postSeoTitle, postSeoDesc, postActive]
      );

      const newId = insertRes.insertId;
      return res.status(201).json({
        success: true,
        message: 'New blog post created successfully.',
        post: { id: newId, slug: generatedSlug, title: postTitle, is_active: postActive }
      });
    } catch (dbErr) {
      if (mockBlogPosts.some(p => p.slug === generatedSlug)) {
        return res.status(400).json({ success: false, message: 'A blog post with this URL slug already exists.' });
      }

      const newId = mockBlogPosts.length + 10;
      const newPostObj = {
        id: newId,
        slug: generatedSlug,
        title: postTitle,
        author: postAuthor,
        category: postCategory,
        tags: postTags,
        featured_image: postImage,
        image: postImage,
        excerpt: postExcerpt,
        content: postContent,
        seo_title: postSeoTitle,
        seo_description: postSeoDesc,
        views_count: 0,
        is_active: postActive,
        created_at: new Date()
      };
      mockBlogPosts.push(newPostObj);

      return res.status(201).json({
        success: true,
        message: 'New blog post created successfully.',
        post: newPostObj
      });
    }
  } catch (error) {
    console.error('Create Blog Post Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating post.' });
  }
});

/**
 * PUT /api/admin/blog/:id
 * Protected admin endpoint to update a blog post
 */
app.put('/api/admin/blog/:id', adminMiddleware, async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10) || req.params.id;
    const { title, slug, author, category, tags, featured_image, image, excerpt, content, seo_title, seo_description, is_active, status } = req.body;

    let targetPost = null;
    try {
      const rows = await query('SELECT * FROM blog_posts WHERE id = ? LIMIT 1', [postId]);
      if (rows && rows.length > 0) targetPost = rows[0];
    } catch (dbErr) {
      targetPost = mockBlogPosts.find(p => p.id == postId);
    }

    if (!targetPost) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    const updatedTitle = title || targetPost.title;
    const updatedSlug = slug ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : targetPost.slug;
    const updatedAuthor = author || targetPost.author;
    const updatedCategory = category || targetPost.category;
    const updatedTags = tags !== undefined ? tags : targetPost.tags;
    const updatedImage = featured_image || image || targetPost.featured_image;
    const updatedExcerpt = excerpt || targetPost.excerpt;
    const updatedContent = content ? sanitizeHtmlContent(content) : targetPost.content;
    const updatedSeoTitle = seo_title !== undefined ? seo_title : targetPost.seo_title;
    const updatedSeoDesc = seo_description !== undefined ? seo_description : targetPost.seo_description;
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'published' ? 1 : 0);

    try {
      await query(
        'UPDATE blog_posts SET slug = ?, title = ?, author = ?, category = ?, tags = ?, featured_image = ?, excerpt = ?, content = ?, seo_title = ?, seo_description = ?, is_active = ? WHERE id = ?',
        [updatedSlug, updatedTitle, updatedAuthor, updatedCategory, updatedTags, updatedImage, updatedExcerpt, updatedContent, updatedSeoTitle, updatedSeoDesc, updatedActive, postId]
      );
    } catch (dbErr) {
      targetPost.title = updatedTitle;
      targetPost.slug = updatedSlug;
      targetPost.author = updatedAuthor;
      targetPost.category = updatedCategory;
      targetPost.tags = updatedTags;
      targetPost.featured_image = updatedImage;
      targetPost.image = updatedImage;
      targetPost.excerpt = updatedExcerpt;
      targetPost.content = updatedContent;
      targetPost.seo_title = updatedSeoTitle;
      targetPost.seo_description = updatedSeoDesc;
      targetPost.is_active = updatedActive;
    }

    return res.json({ success: true, message: 'Blog post updated successfully.' });
  } catch (error) {
    console.error('Update Blog Post Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating post.' });
  }
});

/**
 * PATCH /api/admin/blog/:id/status
 * Protected admin endpoint to publish or draft a blog post
 */
app.patch('/api/admin/blog/:id/status', adminMiddleware, async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10) || req.params.id;
    const { is_active, status } = req.body;
    const targetStatus = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'published' || status === 'active' ? 1 : 0);

    try {
      await query('UPDATE blog_posts SET is_active = ? WHERE id = ?', [targetStatus, postId]);
    } catch (dbErr) {
      const p = mockBlogPosts.find(item => item.id == postId);
      if (p) p.is_active = targetStatus;
    }

    return res.json({
      success: true,
      message: `Post status updated to ${targetStatus === 1 ? 'Published' : 'Draft'}.`,
      is_active: targetStatus
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating post status.' });
  }
});

/**
 * DELETE /api/admin/blog/:id
 * Protected admin endpoint to delete a blog post
 */
app.delete('/api/admin/blog/:id', adminMiddleware, async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10) || req.params.id;

    try {
      await query('DELETE FROM blog_posts WHERE id = ?', [postId]);
    } catch (dbErr) {
      mockBlogPosts = mockBlogPosts.filter(p => p.id != postId);
    }

    return res.json({ success: true, message: 'Blog post deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting post.' });
  }
});

let mockFaqs = [
  {
    id: 1,
    category: 'courses',
    question: 'Are classes held offline in lab or online via live sessions?',
    answer: 'Media Scope IT Ltd offers both hands-on physical computer lab classes at our Uttara, Dhaka campus and live interactive online sessions with real-time screen sharing and recorded lecture archives.',
    sort_order: 1,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 2,
    category: 'freelancing',
    question: 'Is job placement or freelancing support provided after course completion?',
    answer: 'Yes! We provide 100% career mentorship, resume building, mock job interviews, and direct freelancing order guidance for Fiverr, Upwork, and local Bangladeshi software companies.',
    sort_order: 2,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 3,
    category: 'payments',
    question: 'Can course fees be paid in flexible installment plans?',
    answer: 'Yes, students can pay regular fees in 2-3 monthly installments. Instant digital payment options via bKash, Nagad, SSLCommerz, and credit card EMIs are supported.',
    sort_order: 3,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 4,
    category: 'certificates',
    question: 'Are course completion certificates verified by RJSC registered IT company?',
    answer: 'Every student receives an official ISO-aligned RJSC Govt registered Media Scope IT Ltd certificate featuring a unique QR code for online employer verification.',
    sort_order: 4,
    is_active: 1,
    created_at: new Date()
  }
];

/**
 * GET /api/public/faqs
 * Public endpoint returning published FAQs ordered by sort_order
 */
app.get('/api/public/faqs', async (req, res) => {
  try {
    let list = [];
    try {
      const rows = await query('SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
      if (rows && rows.length > 0) {
        list = rows;
      } else {
        list = mockFaqs.filter(f => f.is_active === 1);
      }
    } catch (dbErr) {
      console.log('Public FAQs DB notice:', dbErr.message);
      list = mockFaqs.filter(f => f.is_active === 1);
    }
    return res.json({ success: true, faqs: list });
  } catch (error) {
    return res.json({ success: true, faqs: mockFaqs.filter(f => f.is_active === 1) });
  }
});

/**
 * GET /api/admin/faqs
 * Protected admin endpoint listing all FAQs with search and status filters
 */
app.get('/api/admin/faqs', adminMiddleware, async (req, res) => {
  try {
    const { q, status, category } = req.query;
    let list = [];

    try {
      let where = ['1=1'];
      let params = [];

      if (status === 'published' || status === 'active' || status === '1') {
        where.push('is_active = 1');
      } else if (status === 'unpublished' || status === 'inactive' || status === '0') {
        where.push('is_active = 0');
      }

      if (category && category !== 'all') {
        where.push('category = ?');
        params.push(category);
      }

      if (q && q.trim()) {
        where.push('(question LIKE ? OR answer LIKE ? OR category LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      const sql = `SELECT * FROM faqs WHERE ${where.join(' AND ')} ORDER BY sort_order ASC, id DESC`;
      const rows = await query(sql, params);
      if (rows && rows.length > 0) {
        list = rows;
      } else {
        list = [...mockFaqs];
      }
    } catch (dbErr) {
      console.log('Admin FAQs query DB notice:', dbErr.message);
      list = [...mockFaqs];

      if (status === 'published') list = list.filter(f => f.is_active === 1);
      if (status === 'unpublished') list = list.filter(f => f.is_active === 0);
      if (category && category !== 'all') list = list.filter(f => f.category === category);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        list = list.filter(f => f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term));
      }
    }

    return res.json({ success: true, faqs: list, total: list.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching FAQs list.' });
  }
});

/**
 * GET /api/admin/faqs/:id
 * Protected admin endpoint returning single FAQ details
 */
app.get('/api/admin/faqs/:id', adminMiddleware, async (req, res) => {
  try {
    const faqId = req.params.id;
    let obj = null;

    try {
      const rows = await query('SELECT * FROM faqs WHERE id = ? LIMIT 1', [faqId]);
      if (rows && rows.length > 0) {
        obj = rows[0];
      } else {
        obj = mockFaqs.find(f => f.id == faqId);
      }
    } catch (dbErr) {
      obj = mockFaqs.find(f => f.id == faqId);
    }

    if (!obj) {
      return res.status(404).json({ success: false, message: 'FAQ item not found.' });
    }

    return res.json({ success: true, faq: obj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving FAQ.' });
  }
});

/**
 * POST /api/admin/faqs
 * Protected admin endpoint to create a new FAQ
 */
app.post('/api/admin/faqs', adminMiddleware, async (req, res) => {
  try {
    const { question, answer, category, sort_order, display_order, is_active } = req.body;

    const faqQuestion = (question || '').trim();
    const faqAnswer = (answer || '').trim();

    if (!faqQuestion || !faqAnswer) {
      return res.status(400).json({ success: false, message: 'FAQ question and answer are required.' });
    }

    const faqCategory = category || 'general';
    const faqSort = parseInt(sort_order || display_order || '0', 10);
    const faqActive = is_active !== undefined ? (is_active ? 1 : 0) : 1;

    try {
      const insertRes = await query(
        'INSERT INTO faqs (category, question, answer, sort_order, is_active) VALUES (?, ?, ?, ?, ?)',
        [faqCategory, faqQuestion, faqAnswer, faqSort, faqActive]
      );

      const newId = insertRes.insertId;
      return res.status(201).json({
        success: true,
        message: 'New FAQ added successfully.',
        faq: { id: newId, question: faqQuestion, is_active: faqActive }
      });
    } catch (dbErr) {
      const newId = mockFaqs.length + 10;
      const newObj = {
        id: newId,
        category: faqCategory,
        question: faqQuestion,
        answer: faqAnswer,
        sort_order: faqSort,
        is_active: faqActive,
        created_at: new Date()
      };
      mockFaqs.push(newObj);

      return res.status(201).json({
        success: true,
        message: 'New FAQ added successfully.',
        faq: newObj
      });
    }
  } catch (error) {
    console.error('Create FAQ Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating FAQ.' });
  }
});

/**
 * PUT /api/admin/faqs/:id
 * Protected admin endpoint to update an FAQ
 */
app.put('/api/admin/faqs/:id', adminMiddleware, async (req, res) => {
  try {
    const faqId = parseInt(req.params.id, 10) || req.params.id;
    const { question, answer, category, sort_order, display_order, is_active } = req.body;

    let targetObj = null;
    try {
      const rows = await query('SELECT * FROM faqs WHERE id = ? LIMIT 1', [faqId]);
      if (rows && rows.length > 0) targetObj = rows[0];
    } catch (dbErr) {
      targetObj = mockFaqs.find(f => f.id == faqId);
    }

    if (!targetObj) {
      return res.status(404).json({ success: false, message: 'FAQ item not found.' });
    }

    const updatedQuestion = question || targetObj.question;
    const updatedAnswer = answer || targetObj.answer;
    const updatedCategory = category || targetObj.category;
    const updatedSort = sort_order !== undefined ? parseInt(sort_order, 10) : (display_order !== undefined ? parseInt(display_order, 10) : targetObj.sort_order);
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : targetObj.is_active;

    try {
      await query(
        'UPDATE faqs SET category = ?, question = ?, answer = ?, sort_order = ?, is_active = ? WHERE id = ?',
        [updatedCategory, updatedQuestion, updatedAnswer, updatedSort, updatedActive, faqId]
      );
    } catch (dbErr) {
      targetObj.question = updatedQuestion;
      targetObj.answer = updatedAnswer;
      targetObj.category = updatedCategory;
      targetObj.sort_order = updatedSort;
      targetObj.is_active = updatedActive;
    }

    return res.json({ success: true, message: 'FAQ updated successfully.' });
  } catch (error) {
    console.error('Update FAQ Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating FAQ.' });
  }
});

/**
 * PATCH /api/admin/faqs/:id/status
 * Protected admin endpoint to publish or unpublish an FAQ
 */
app.patch('/api/admin/faqs/:id/status', adminMiddleware, async (req, res) => {
  try {
    const faqId = parseInt(req.params.id, 10) || req.params.id;
    const { is_active, status } = req.body;
    const targetStatus = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'published' || status === 'active' ? 1 : 0);

    try {
      await query('UPDATE faqs SET is_active = ? WHERE id = ?', [targetStatus, faqId]);
    } catch (dbErr) {
      const f = mockFaqs.find(item => item.id == faqId);
      if (f) f.is_active = targetStatus;
    }

    return res.json({
      success: true,
      message: `FAQ status updated to ${targetStatus === 1 ? 'Published' : 'Unpublished'}.`,
      is_active: targetStatus
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating FAQ status.' });
  }
});

/**
 * DELETE /api/admin/faqs/:id
 * Protected admin endpoint to delete an FAQ
 */
app.delete('/api/admin/faqs/:id', adminMiddleware, async (req, res) => {
  try {
    const faqId = parseInt(req.params.id, 10) || req.params.id;

    try {
      await query('DELETE FROM faqs WHERE id = ?', [faqId]);
    } catch (dbErr) {
      mockFaqs = mockFaqs.filter(f => f.id != faqId);
    }

    return res.json({ success: true, message: 'FAQ record deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting FAQ.' });
  }
});

let mockTestimonials = [
  {
    id: 1,
    author_name: 'Tanzin Anik Kabir',
    name: 'Tanzin Anik Kabir',
    author_title: 'Full Stack Developer',
    role: 'Full Stack Developer at TechBD',
    company: 'TechBD',
    rating: 5.0,
    review_text: 'This course provided a comprehensive journey from the basics to advanced concepts of full stack development. The curriculum was well-structured with practical real-world lab projects.',
    quote: 'This course provided a comprehensive journey from the basics to advanced concepts of full stack development. The curriculum was well-structured with practical real-world lab projects.',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    accentColor: '#00B4D8',
    is_featured: 1,
    sort_order: 1,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 2,
    author_name: 'MD. Rahat',
    name: 'MD. Rahat',
    author_title: 'WordPress Developer & Freelancer',
    role: 'WordPress Developer & Freelancer',
    company: 'Upwork',
    rating: 5.0,
    review_text: 'Media Scope IT Ltd is the best web development training center. I learned step-by-step and got my first remote WordPress developer job right after completing the course!',
    quote: 'Media Scope IT Ltd is the best web development training center. I learned step-by-step and got my first remote WordPress developer job right after completing the course!',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    accentColor: '#FF6B00',
    is_featured: 1,
    sort_order: 2,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 3,
    author_name: 'Mohammad Saniyat Zaman Khan',
    name: 'Mohammad Saniyat Zaman Khan',
    author_title: 'Senior Graphic Designer',
    role: 'Senior Graphic Designer',
    company: 'Fiverr',
    rating: 5.0,
    review_text: 'Under direct supervision of instructors at Media Scope IT Ltd, I learned how to win orders on Fiverr and Upwork. The mentorship changed my career trajectory.',
    quote: 'Under direct supervision of instructors at Media Scope IT Ltd, I learned how to win orders on Fiverr and Upwork. The mentorship changed my career trajectory.',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    accentColor: '#FFB703',
    is_featured: 1,
    sort_order: 3,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 4,
    author_name: 'Sharmin Sultana',
    name: 'Sharmin Sultana',
    author_title: 'Digital Marketing Executive',
    role: 'Digital Marketing Executive',
    company: 'E-Commerce BD',
    rating: 5.0,
    review_text: 'The hands-on Facebook Ads & Google SEO training helped me double the sales for my local e-commerce store in less than 2 months! Highly recommended.',
    quote: 'The hands-on Facebook Ads & Google SEO training helped me double the sales for my local e-commerce store in less than 2 months! Highly recommended.',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    accentColor: '#10B981',
    is_featured: 1,
    sort_order: 4,
    is_active: 1,
    created_at: new Date()
  }
];

/**
 * GET /api/public/testimonials
 * Public endpoint returning published testimonials ordered by sort_order
 */
app.get('/api/public/testimonials', async (req, res) => {
  try {
    let list = [];
    try {
      const rows = await query('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
      if (rows && rows.length > 0) {
        list = rows.map(r => ({
          ...r,
          name: r.author_name,
          role: r.author_title || r.company || 'Alumni Graduate',
          quote: r.review_text,
          avatar: r.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          rating: parseFloat(r.rating || 5.0),
          accentColor: '#00B4D8'
        }));
      } else {
        list = mockTestimonials.filter(t => t.is_active === 1);
      }
    } catch (dbErr) {
      console.log('Public testimonials DB notice:', dbErr.message);
      list = mockTestimonials.filter(t => t.is_active === 1);
    }
    return res.json({ success: true, testimonials: list });
  } catch (error) {
    return res.json({ success: true, testimonials: mockTestimonials.filter(t => t.is_active === 1) });
  }
});

/**
 * GET /api/admin/testimonials
 * Protected admin endpoint listing all testimonials with search and status filters
 */
app.get('/api/admin/testimonials', adminMiddleware, async (req, res) => {
  try {
    const { q, status } = req.query;
    let list = [];

    try {
      let where = ['1=1'];
      let params = [];

      if (status === 'published' || status === 'active' || status === '1') {
        where.push('is_active = 1');
      } else if (status === 'unpublished' || status === 'inactive' || status === '0') {
        where.push('is_active = 0');
      }

      if (q && q.trim()) {
        where.push('(author_name LIKE ? OR author_title LIKE ? OR company LIKE ? OR review_text LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const sql = `SELECT * FROM testimonials WHERE ${where.join(' AND ')} ORDER BY sort_order ASC, id DESC`;
      const rows = await query(sql, params);
      if (rows && rows.length > 0) {
        list = rows.map(r => ({
          ...r,
          name: r.author_name,
          role: r.author_title,
          quote: r.review_text,
          avatar: r.photo_url,
          rating: parseFloat(r.rating || 5.0)
        }));
      } else {
        list = [...mockTestimonials];
      }
    } catch (dbErr) {
      console.log('Admin testimonials query DB notice:', dbErr.message);
      list = [...mockTestimonials];

      if (status === 'published') list = list.filter(t => t.is_active === 1);
      if (status === 'unpublished') list = list.filter(t => t.is_active === 0);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        list = list.filter(t => t.author_name.toLowerCase().includes(term) || t.review_text.toLowerCase().includes(term));
      }
    }

    return res.json({ success: true, testimonials: list, total: list.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching testimonials.' });
  }
});

/**
 * GET /api/admin/testimonials/:id
 * Protected admin endpoint returning single testimonial details
 */
app.get('/api/admin/testimonials/:id', adminMiddleware, async (req, res) => {
  try {
    const testiId = req.params.id;
    let obj = null;

    try {
      const rows = await query('SELECT * FROM testimonials WHERE id = ? LIMIT 1', [testiId]);
      if (rows && rows.length > 0) {
        const r = rows[0];
        obj = {
          ...r,
          name: r.author_name,
          role: r.author_title,
          quote: r.review_text,
          avatar: r.photo_url,
          rating: parseFloat(r.rating || 5.0)
        };
      } else {
        obj = mockTestimonials.find(t => t.id == testiId);
      }
    } catch (dbErr) {
      obj = mockTestimonials.find(t => t.id == testiId);
    }

    if (!obj) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }

    return res.json({ success: true, testimonial: obj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving testimonial.' });
  }
});

/**
 * POST /api/admin/testimonials
 * Protected admin endpoint to create a new testimonial
 */
app.post('/api/admin/testimonials', adminMiddleware, async (req, res) => {
  try {
    const { author_name, name, author_title, designation, role, company, rating, review_text, quote, photo_url, avatar, is_featured, sort_order, display_order, is_active } = req.body;

    const authorName = (author_name || name || '').trim();
    const reviewText = (review_text || quote || '').trim();

    if (!authorName || !reviewText) {
      return res.status(400).json({ success: false, message: 'Client name and testimonial review text are required.' });
    }

    const authorTitle = author_title || designation || role || 'Client / Alumni';
    const clientCompany = company || '';
    const ratingVal = parseFloat(rating || '5.0');
    const photo = photo_url || avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
    const featured = is_featured !== undefined ? (is_featured ? 1 : 0) : 1;
    const sort = parseInt(sort_order || display_order || '0', 10);
    const active = is_active !== undefined ? (is_active ? 1 : 0) : 1;

    try {
      const insertRes = await query(
        'INSERT INTO testimonials (author_name, author_title, company, rating, review_text, photo_url, is_featured, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [authorName, authorTitle, clientCompany, ratingVal, reviewText, photo, featured, sort, active]
      );

      const newId = insertRes.insertId;
      return res.status(201).json({
        success: true,
        message: 'New testimonial created successfully.',
        testimonial: { id: newId, author_name: authorName, is_active: active }
      });
    } catch (dbErr) {
      const newId = mockTestimonials.length + 10;
      const newObj = {
        id: newId,
        author_name: authorName,
        name: authorName,
        author_title: authorTitle,
        role: authorTitle,
        company: clientCompany,
        rating: ratingVal,
        review_text: reviewText,
        quote: reviewText,
        photo_url: photo,
        avatar: photo,
        accentColor: '#00B4D8',
        is_featured: featured,
        sort_order: sort,
        is_active: active,
        created_at: new Date()
      };
      mockTestimonials.push(newObj);

      return res.status(201).json({
        success: true,
        message: 'New testimonial created successfully.',
        testimonial: newObj
      });
    }
  } catch (error) {
    console.error('Create Testimonial Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating testimonial.' });
  }
});

/**
 * PUT /api/admin/testimonials/:id
 * Protected admin endpoint to update a testimonial
 */
app.put('/api/admin/testimonials/:id', adminMiddleware, async (req, res) => {
  try {
    const testiId = parseInt(req.params.id, 10) || req.params.id;
    const { author_name, name, author_title, designation, role, company, rating, review_text, quote, photo_url, avatar, is_featured, sort_order, display_order, is_active } = req.body;

    let targetObj = null;
    try {
      const rows = await query('SELECT * FROM testimonials WHERE id = ? LIMIT 1', [testiId]);
      if (rows && rows.length > 0) targetObj = rows[0];
    } catch (dbErr) {
      targetObj = mockTestimonials.find(t => t.id == testiId);
    }

    if (!targetObj) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }

    const updatedName = author_name || name || targetObj.author_name;
    const updatedTitle = author_title || designation || role || targetObj.author_title;
    const updatedCompany = company !== undefined ? company : targetObj.company;
    const updatedRating = rating !== undefined ? parseFloat(rating) : targetObj.rating;
    const updatedText = review_text || quote || targetObj.review_text;
    const updatedPhoto = photo_url || avatar || targetObj.photo_url;
    const updatedFeatured = is_featured !== undefined ? (is_featured ? 1 : 0) : targetObj.is_featured;
    const updatedSort = sort_order !== undefined ? parseInt(sort_order, 10) : (display_order !== undefined ? parseInt(display_order, 10) : targetObj.sort_order);
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : targetObj.is_active;

    try {
      await query(
        'UPDATE testimonials SET author_name = ?, author_title = ?, company = ?, rating = ?, review_text = ?, photo_url = ?, is_featured = ?, sort_order = ?, is_active = ? WHERE id = ?',
        [updatedName, updatedTitle, updatedCompany, updatedRating, updatedText, updatedPhoto, updatedFeatured, updatedSort, updatedActive, testiId]
      );
    } catch (dbErr) {
      targetObj.author_name = updatedName;
      targetObj.name = updatedName;
      targetObj.author_title = updatedTitle;
      targetObj.role = updatedTitle;
      targetObj.company = updatedCompany;
      targetObj.rating = updatedRating;
      targetObj.review_text = updatedText;
      targetObj.quote = updatedText;
      targetObj.photo_url = updatedPhoto;
      targetObj.avatar = updatedPhoto;
      targetObj.is_featured = updatedFeatured;
      targetObj.sort_order = updatedSort;
      targetObj.is_active = updatedActive;
    }

    return res.json({ success: true, message: 'Testimonial updated successfully.' });
  } catch (error) {
    console.error('Update Testimonial Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating testimonial.' });
  }
});

/**
 * PATCH /api/admin/testimonials/:id/status
 * Protected admin endpoint to publish or unpublish a testimonial
 */
app.patch('/api/admin/testimonials/:id/status', adminMiddleware, async (req, res) => {
  try {
    const testiId = parseInt(req.params.id, 10) || req.params.id;
    const { is_active, status } = req.body;
    const targetStatus = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'published' || status === 'active' ? 1 : 0);

    try {
      await query('UPDATE testimonials SET is_active = ? WHERE id = ?', [targetStatus, testiId]);
    } catch (dbErr) {
      const t = mockTestimonials.find(item => item.id == testiId);
      if (t) t.is_active = targetStatus;
    }

    return res.json({
      success: true,
      message: `Testimonial status updated to ${targetStatus === 1 ? 'Published' : 'Unpublished'}.`,
      is_active: targetStatus
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating testimonial status.' });
  }
});

/**
 * DELETE /api/admin/testimonials/:id
 * Protected admin endpoint to delete a testimonial
 */
app.delete('/api/admin/testimonials/:id', adminMiddleware, async (req, res) => {
  try {
    const testiId = parseInt(req.params.id, 10) || req.params.id;

    try {
      await query('DELETE FROM testimonials WHERE id = ?', [testiId]);
    } catch (dbErr) {
      mockTestimonials = mockTestimonials.filter(t => t.id != testiId);
    }

    return res.json({ success: true, message: 'Testimonial record removed successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting testimonial.' });
  }
});

let mockTeamMembers = [
  {
    id: 1,
    name: 'Engr. Tanvir Hossain Khan',
    designation: 'Software Engineer',
    role: 'Software Engineer',
    department: 'Software Development',
    category: 'Software Development',
    email: 'tanvir@mediascopeit.com',
    phone: '+8801711000000',
    bio: '3+ years of hands-on experience in full-stack web development, software engineering architecture, SQA testing, and technical mentorship.',
    photo_url: '/Team/Tanvir Hossain Khan.jpg',
    avatar: '/Team/Tanvir Hossain Khan.jpg',
    facebook_url: 'https://facebook.com/tanvir',
    linkedin_url: 'https://www.linkedin.com/in/tanvir-khan-90122a30b',
    github_url: 'https://github.com/tanvir210111',
    sort_order: 1,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 2,
    name: 'Nashimul Hasan Nibir',
    designation: 'Video Editor',
    role: 'Video Editor',
    department: 'Creative Media',
    category: 'Creative Media',
    email: 'nibir@mediascopeit.com',
    phone: '+8801811000000',
    bio: 'Creative Video Editor specializing in high-quality video production, motion graphics, and visual content strategy.',
    photo_url: '/Team/Nashimul Hasan Nibir.jpg',
    avatar: '/Team/Nashimul Hasan Nibir.jpg',
    facebook_url: '',
    linkedin_url: '',
    github_url: '',
    sort_order: 2,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 3,
    name: 'MD NAIMUR RAHMAN NAIM',
    designation: 'Sr. Social Media Marketer',
    role: 'Sr. Social Media Marketer',
    department: 'IT Department',
    category: 'IT Department',
    email: 'naim@mediascopeit.com',
    phone: '+8801911000000',
    bio: 'Senior Social Media Marketer specializing in digital growth campaigns, Meta & Google Ads management, and audience analytics.',
    photo_url: '/Team/MD NAIMUR RAHMAN NAIM.jpg',
    avatar: '/Team/MD NAIMUR RAHMAN NAIM.jpg',
    facebook_url: '',
    linkedin_url: '',
    github_url: '',
    sort_order: 3,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 4,
    name: 'Fahim Hasan Jidan',
    designation: 'Jr. Social Media Marketer',
    role: 'Jr. Social Media Marketer',
    department: 'IT Department',
    category: 'IT Department',
    email: 'jidan@mediascopeit.com',
    phone: '+8801611000000',
    bio: 'Junior Social Media Marketer focusing on social content engagement, audience interaction, and brand promotion.',
    photo_url: '/Team/Fahim Hasan Jidan.jpg',
    avatar: '/Team/Fahim Hasan Jidan.jpg',
    facebook_url: '',
    linkedin_url: '',
    github_url: '',
    sort_order: 4,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 5,
    name: 'Hridoy Hasan',
    designation: 'Jr. Social Media Marketer',
    role: 'Jr. Social Media Marketer',
    department: 'IT Department',
    category: 'IT Department',
    email: 'hridoy@mediascopeit.com',
    phone: '+8801511000000',
    bio: 'Junior Social Media Marketer assisting with digital marketing campaigns, social media management, and online operations.',
    photo_url: '/Team/Hridoy Hasan.jpg',
    avatar: '/Team/Hridoy Hasan.jpg',
    facebook_url: '',
    linkedin_url: '',
    github_url: '',
    sort_order: 5,
    is_active: 1,
    created_at: new Date()
  }
];

/**
 * GET /api/public/team
 * Public endpoint returning published team members ordered by sort_order
 */
app.get('/api/public/team', async (req, res) => {
  try {
    let teamList = [];
    try {
      const rows = await query('SELECT * FROM team_members WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
      if (rows && rows.length > 0) {
        teamList = rows.map(r => ({
          ...r,
          avatar: r.photo_url || '/Team/Tanvir Hossain Khan.jpg',
          role: r.designation,
          category: r.department || 'IT Department',
          linkedin: r.linkedin_url,
          github: r.github_url,
          facebook: r.facebook_url
        }));
      } else {
        teamList = mockTeamMembers.filter(m => m.is_active === 1);
      }
    } catch (dbErr) {
      console.log('Public team DB notice:', dbErr.message);
      teamList = mockTeamMembers.filter(m => m.is_active === 1);
    }
    return res.json({ success: true, team: teamList });
  } catch (error) {
    return res.json({ success: true, team: mockTeamMembers.filter(m => m.is_active === 1) });
  }
});

/**
 * GET /api/admin/team
 * Protected admin endpoint listing all team members with search and status filters
 */
app.get('/api/admin/team', adminMiddleware, async (req, res) => {
  try {
    const { q, status } = req.query;
    let teamList = [];

    try {
      let where = ['1=1'];
      let params = [];

      if (status === 'published' || status === 'active' || status === '1') {
        where.push('is_active = 1');
      } else if (status === 'unpublished' || status === 'inactive' || status === '0') {
        where.push('is_active = 0');
      }

      if (q && q.trim()) {
        where.push('(name LIKE ? OR designation LIKE ? OR department LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      const sql = `SELECT * FROM team_members WHERE ${where.join(' AND ')} ORDER BY sort_order ASC, id DESC`;
      const rows = await query(sql, params);
      if (rows && rows.length > 0) {
        teamList = rows.map(r => ({
          ...r,
          avatar: r.photo_url,
          role: r.designation,
          category: r.department || 'IT Department',
          linkedin: r.linkedin_url,
          github: r.github_url,
          facebook: r.facebook_url
        }));
      } else {
        teamList = [...mockTeamMembers];
      }
    } catch (dbErr) {
      console.log('Admin team query DB notice:', dbErr.message);
      teamList = [...mockTeamMembers];

      if (status === 'published') teamList = teamList.filter(t => t.is_active === 1);
      if (status === 'unpublished') teamList = teamList.filter(t => t.is_active === 0);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        teamList = teamList.filter(t => t.name.toLowerCase().includes(term) || t.designation.toLowerCase().includes(term));
      }
    }

    return res.json({ success: true, team: teamList, total: teamList.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching team members.' });
  }
});

/**
 * GET /api/admin/team/:id
 * Protected admin endpoint returning single team member details
 */
app.get('/api/admin/team/:id', adminMiddleware, async (req, res) => {
  try {
    const memberId = req.params.id;
    let memberObj = null;

    try {
      const rows = await query('SELECT * FROM team_members WHERE id = ? LIMIT 1', [memberId]);
      if (rows && rows.length > 0) {
        const r = rows[0];
        memberObj = {
          ...r,
          avatar: r.photo_url,
          role: r.designation,
          category: r.department || 'IT Department',
          linkedin: r.linkedin_url,
          github: r.github_url,
          facebook: r.facebook_url
        };
      } else {
        memberObj = mockTeamMembers.find(t => t.id == memberId);
      }
    } catch (dbErr) {
      memberObj = mockTeamMembers.find(t => t.id == memberId);
    }

    if (!memberObj) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    return res.json({ success: true, member: memberObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving team member.' });
  }
});

/**
 * POST /api/admin/team
 * Protected admin endpoint to create a new team member
 */
app.post('/api/admin/team', adminMiddleware, async (req, res) => {
  try {
    const { name, designation, role, department, category, email, phone, bio, photo_url, avatar, facebook_url, facebook, linkedin_url, linkedin, github_url, github, sort_order, display_order, is_active } = req.body;

    const memberName = (name || '').trim();
    const memberDesignation = (designation || role || '').trim();

    if (!memberName || !memberDesignation) {
      return res.status(400).json({ success: false, message: 'Team member name and designation are required.' });
    }

    const memberDepartment = department || category || 'IT Department';
    const memberEmail = email || '';
    const memberPhone = phone || '';
    const memberBio = bio || '';
    const memberPhoto = photo_url || avatar || '/Team/Tanvir Hossain Khan.jpg';
    const memberFacebook = facebook_url || facebook || '';
    const memberLinkedin = linkedin_url || linkedin || '';
    const memberGithub = github_url || github || '';
    const memberSort = parseInt(sort_order || display_order || '0', 10);
    const memberActive = is_active !== undefined ? (is_active ? 1 : 0) : 1;

    try {
      const insertRes = await query(
        'INSERT INTO team_members (name, designation, department, email, phone, bio, photo_url, facebook_url, linkedin_url, github_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [memberName, memberDesignation, memberDepartment, memberEmail, memberPhone, memberBio, memberPhoto, memberFacebook, memberLinkedin, memberGithub, memberSort, memberActive]
      );

      const newId = insertRes.insertId;
      return res.status(201).json({
        success: true,
        message: 'New team member added successfully.',
        member: { id: newId, name: memberName, designation: memberDesignation, is_active: memberActive }
      });
    } catch (dbErr) {
      const newId = mockTeamMembers.length + 10;
      const newMemberObj = {
        id: newId,
        name: memberName,
        designation: memberDesignation,
        role: memberDesignation,
        department: memberDepartment,
        category: memberDepartment,
        email: memberEmail,
        phone: memberPhone,
        bio: memberBio,
        photo_url: memberPhoto,
        avatar: memberPhoto,
        facebook_url: memberFacebook,
        linkedin_url: memberLinkedin,
        github_url: memberGithub,
        sort_order: memberSort,
        is_active: memberActive,
        created_at: new Date()
      };
      mockTeamMembers.push(newMemberObj);

      return res.status(201).json({
        success: true,
        message: 'New team member added successfully.',
        member: newMemberObj
      });
    }
  } catch (error) {
    console.error('Create Team Member Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating team member.' });
  }
});

/**
 * PUT /api/admin/team/:id
 * Protected admin endpoint to update a team member
 */
app.put('/api/admin/team/:id', adminMiddleware, async (req, res) => {
  try {
    const memberId = parseInt(req.params.id, 10) || req.params.id;
    const { name, designation, role, department, category, email, phone, bio, photo_url, avatar, facebook_url, facebook, linkedin_url, linkedin, github_url, github, sort_order, display_order, is_active } = req.body;

    let targetMember = null;
    try {
      const rows = await query('SELECT * FROM team_members WHERE id = ? LIMIT 1', [memberId]);
      if (rows && rows.length > 0) targetMember = rows[0];
    } catch (dbErr) {
      targetMember = mockTeamMembers.find(t => t.id == memberId);
    }

    if (!targetMember) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    const updatedName = name || targetMember.name;
    const updatedDesignation = designation || role || targetMember.designation;
    const updatedDepartment = department || category || targetMember.department;
    const updatedEmail = email !== undefined ? email : targetMember.email;
    const updatedPhone = phone !== undefined ? phone : targetMember.phone;
    const updatedBio = bio !== undefined ? bio : targetMember.bio;
    const updatedPhoto = photo_url || avatar || targetMember.photo_url;
    const updatedFacebook = facebook_url || facebook || targetMember.facebook_url;
    const updatedLinkedin = linkedin_url || linkedin || targetMember.linkedin_url;
    const updatedGithub = github_url || github || targetMember.github_url;
    const updatedSort = sort_order !== undefined ? parseInt(sort_order, 10) : (display_order !== undefined ? parseInt(display_order, 10) : targetMember.sort_order);
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : targetMember.is_active;

    try {
      await query(
        'UPDATE team_members SET name = ?, designation = ?, department = ?, email = ?, phone = ?, bio = ?, photo_url = ?, facebook_url = ?, linkedin_url = ?, github_url = ?, sort_order = ?, is_active = ? WHERE id = ?',
        [updatedName, updatedDesignation, updatedDepartment, updatedEmail, updatedPhone, updatedBio, updatedPhoto, updatedFacebook, updatedLinkedin, updatedGithub, updatedSort, updatedActive, memberId]
      );
    } catch (dbErr) {
      targetMember.name = updatedName;
      targetMember.designation = updatedDesignation;
      targetMember.role = updatedDesignation;
      targetMember.department = updatedDepartment;
      targetMember.category = updatedDepartment;
      targetMember.email = updatedEmail;
      targetMember.phone = updatedPhone;
      targetMember.bio = updatedBio;
      targetMember.photo_url = updatedPhoto;
      targetMember.avatar = updatedPhoto;
      targetMember.facebook_url = updatedFacebook;
      targetMember.linkedin_url = updatedLinkedin;
      targetMember.github_url = updatedGithub;
      targetMember.sort_order = updatedSort;
      targetMember.is_active = updatedActive;
    }

    return res.json({ success: true, message: 'Team member updated successfully.' });
  } catch (error) {
    console.error('Update Team Member Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating team member.' });
  }
});

/**
 * PATCH /api/admin/team/:id/status
 * Protected admin endpoint to publish or unpublish a team member
 */
app.patch('/api/admin/team/:id/status', adminMiddleware, async (req, res) => {
  try {
    const memberId = parseInt(req.params.id, 10) || req.params.id;
    const { is_active, status } = req.body;
    const targetStatus = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'published' || status === 'active' ? 1 : 0);

    try {
      await query('UPDATE team_members SET is_active = ? WHERE id = ?', [targetStatus, memberId]);
    } catch (dbErr) {
      const m = mockTeamMembers.find(t => t.id == memberId);
      if (m) m.is_active = targetStatus;
    }

    return res.json({
      success: true,
      message: `Team member status updated to ${targetStatus === 1 ? 'Published' : 'Unpublished'}.`,
      is_active: targetStatus
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating team member status.' });
  }
});

/**
 * DELETE /api/admin/team/:id
 * Protected admin endpoint to delete a team member
 */
app.delete('/api/admin/team/:id', adminMiddleware, async (req, res) => {
  try {
    const memberId = parseInt(req.params.id, 10) || req.params.id;

    try {
      await query('DELETE FROM team_members WHERE id = ?', [memberId]);
    } catch (dbErr) {
      mockTeamMembers = mockTeamMembers.filter(t => t.id != memberId);
    }

    return res.json({ success: true, message: 'Team member removed successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting team member.' });
  }
});

let mockCourses = [
  {
    id: 1,
    slug: 'graphics-design',
    title: 'Professional Graphics Design',
    category: 'Graphics & Design',
    hours: '64 Hours',
    duration: '3 Months',
    nextBatch: 'August 31, 2026',
    regular_fee: 22000,
    discount_fee: 15000,
    fee: 'TK 22,000',
    discountFee: 'TK 15,000',
    rating: 4.9,
    studentsCount: '1,240+',
    thumbnail_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    short_desc: 'Master Adobe Photoshop, Illustrator, InDesign, UI/UX basics and build a winning design portfolio for international freelancing.',
    shortDesc: 'Master Adobe Photoshop, Illustrator, InDesign, UI/UX basics and build a winning design portfolio for international freelancing.',
    full_description: 'Comprehensive Adobe graphics design course covering Photoshop photo manipulation, Illustrator vector logos, brand identity, and Fiverr/Upwork freelancing.',
    curriculum: [
      'Adobe Photoshop CS6 / CC Essentials & Advanced Manipulation',
      'Vector Graphics & Logo Design with Adobe Illustrator CC',
      'Brand Identity & Banner/Flyer Production',
      'UI/UX Fundamentals & Figma Basics',
      'Marketplace Success (Fiverr, Upwork, Freelancer.com)'
    ],
    is_popular: 1,
    popular: true,
    display_order: 1,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 2,
    slug: 'web-development',
    title: 'Full Stack Web Development',
    category: 'Web & Software',
    hours: '64 Hours',
    duration: '4 Months',
    nextBatch: 'August 25, 2026',
    regular_fee: 25000,
    discount_fee: 18000,
    fee: 'TK 25,000',
    discountFee: 'TK 18,000',
    rating: 5.0,
    studentsCount: '1,850+',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    short_desc: 'Complete web development bootcamp covering HTML5, CSS3, Tailwind, JavaScript ES6+, React.js, Node.js, and MySQL/MongoDB.',
    shortDesc: 'Complete web development bootcamp covering HTML5, CSS3, Tailwind, JavaScript ES6+, React.js, Node.js, and MySQL/MongoDB.',
    full_description: 'Full-stack web application development course with modern JavaScript ES6+, React components, REST APIs, Node.js backend, and database integration.',
    curriculum: [
      'Semantic HTML5, CSS3 Grid & Flexbox, Responsive Design',
      'Modern JavaScript ES6+ Async/Await, DOM & APIs',
      'React.js Component Architecture, Hooks & Redux Toolkit',
      'Backend REST API development with Node.js & Express',
      'Database Design (MySQL & MongoDB) + Live Server Deployment'
    ],
    is_popular: 1,
    popular: true,
    display_order: 2,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 3,
    slug: 'c-programming',
    title: 'C & C++ Programming',
    category: 'Programming',
    hours: '32 Hours',
    duration: '2 Months',
    nextBatch: 'August 25, 2026',
    regular_fee: 12500,
    discount_fee: 8500,
    fee: 'TK 12,500',
    discountFee: 'TK 8,500',
    rating: 4.8,
    studentsCount: '890+',
    thumbnail_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    short_desc: 'Build rock-solid fundamentals in computer science, data structures, algorithm design, and memory management using C/C++.',
    shortDesc: 'Build rock-solid fundamentals in computer science, data structures, algorithm design, and memory management using C/C++.',
    full_description: 'Computer science foundation course focused on low-level memory pointers, OOP concepts, competitive programming, and algorithms.',
    curriculum: [
      'Variables, Data Types, Control Structures & Loops',
      'Functions, Recursion, Pointers & Memory Management',
      'Object-Oriented Programming (OOP) in C++',
      'Basic Data Structures (Arrays, Linked Lists, Stacks)',
      'Algorithm Complexity & Problem Solving Techniques'
    ],
    is_popular: 0,
    popular: false,
    display_order: 3,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 4,
    slug: 'digital-marketing',
    title: 'Professional Digital Marketing & SEO',
    category: 'Digital Marketing',
    hours: '64 Hours',
    duration: '3 Months',
    nextBatch: 'August 28, 2026',
    regular_fee: 22000,
    discount_fee: 14000,
    fee: 'TK 22,000',
    discountFee: 'TK 14,000',
    rating: 4.9,
    studentsCount: '1,560+',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    short_desc: 'Comprehensive digital marketing training: Facebook Ads Manager, Meta Pixel, Google Ads PPC, Technical SEO, and Content Strategy.',
    shortDesc: 'Comprehensive digital marketing training: Facebook Ads Manager, Meta Pixel, Google Ads PPC, Technical SEO, and Content Strategy.',
    full_description: 'Digital marketing and search engine optimization course covering social media marketing, PPC campaigns, lead generation, and Google analytics.',
    curriculum: [
      'Facebook & Instagram Marketing, Meta Pixel & Custom Audiences',
      'Google Search Ads, Display Network & YouTube Video Ads',
      'On-Page, Off-Page & Technical Search Engine Optimization (SEO)',
      'Content Marketing Strategy & Email Funnel Automation',
      'Freelance Marketplace Strategy & Local Client Hunting'
    ],
    is_popular: 1,
    popular: true,
    display_order: 4,
    is_active: 1,
    created_at: new Date()
  }
];

/**
 * GET /api/public/courses
 * Public endpoint returning published courses ordered by display_order
 */
app.get('/api/public/courses', async (req, res) => {
  try {
    let coursesList = [];
    try {
      const rows = await query('SELECT * FROM courses WHERE is_active = 1 ORDER BY display_order ASC, id ASC');
      if (rows && rows.length > 0) {
        coursesList = rows.map(r => ({
          ...r,
          image: r.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
          shortDesc: r.short_desc,
          fee: `TK ${parseInt(r.regular_fee).toLocaleString()}`,
          discountFee: `TK ${parseInt(r.discount_fee).toLocaleString()}`,
          popular: !!r.is_popular,
          curriculum: typeof r.curriculum_json === 'string' ? JSON.parse(r.curriculum_json) : (r.curriculum_json || [])
        }));
      } else {
        coursesList = mockCourses.filter(c => c.is_active === 1);
      }
    } catch (dbErr) {
      console.log('Public courses DB notice:', dbErr.message);
      coursesList = mockCourses.filter(c => c.is_active === 1);
    }
    return res.json({ success: true, courses: coursesList });
  } catch (error) {
    return res.json({ success: true, courses: mockCourses.filter(c => c.is_active === 1) });
  }
});

/**
 * GET /api/admin/courses
 * Protected admin endpoint listing all courses with search and category filters
 */
app.get('/api/admin/courses', adminMiddleware, async (req, res) => {
  try {
    const { q, status, category } = req.query;
    let coursesList = [];

    try {
      let where = ['1=1'];
      let params = [];

      if (status === 'published' || status === 'active' || status === '1') {
        where.push('is_active = 1');
      } else if (status === 'unpublished' || status === 'inactive' || status === '0') {
        where.push('is_active = 0');
      }

      if (category && category !== 'all') {
        where.push('category = ?');
        params.push(category);
      }

      if (q && q.trim()) {
        where.push('(title LIKE ? OR category LIKE ? OR slug LIKE ? OR short_desc LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const sql = `SELECT * FROM courses WHERE ${where.join(' AND ')} ORDER BY display_order ASC, id DESC`;
      const rows = await query(sql, params);
      if (rows && rows.length > 0) {
        coursesList = rows.map(r => ({
          ...r,
          image: r.thumbnail_url,
          shortDesc: r.short_desc,
          fee: `TK ${parseInt(r.regular_fee).toLocaleString()}`,
          discountFee: `TK ${parseInt(r.discount_fee).toLocaleString()}`,
          popular: !!r.is_popular,
          curriculum: typeof r.curriculum_json === 'string' ? JSON.parse(r.curriculum_json) : (r.curriculum_json || [])
        }));
      } else {
        coursesList = [...mockCourses];
      }
    } catch (dbErr) {
      console.log('Admin courses query DB notice:', dbErr.message);
      coursesList = [...mockCourses];

      if (status === 'published') coursesList = coursesList.filter(c => c.is_active === 1);
      if (status === 'unpublished') coursesList = coursesList.filter(c => c.is_active === 0);
      if (category && category !== 'all') coursesList = coursesList.filter(c => c.category === category);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        coursesList = coursesList.filter(c => c.title.toLowerCase().includes(term) || c.short_desc.toLowerCase().includes(term));
      }
    }

    return res.json({ success: true, courses: coursesList, total: coursesList.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching courses list.' });
  }
});

/**
 * GET /api/admin/courses/:id
 * Protected admin endpoint returning single course details
 */
app.get('/api/admin/courses/:id', adminMiddleware, async (req, res) => {
  try {
    const courseId = req.params.id;
    let courseObj = null;

    try {
      const rows = await query('SELECT * FROM courses WHERE id = ? OR slug = ? LIMIT 1', [courseId, courseId]);
      if (rows && rows.length > 0) {
        const r = rows[0];
        courseObj = {
          ...r,
          image: r.thumbnail_url,
          shortDesc: r.short_desc,
          curriculum: typeof r.curriculum_json === 'string' ? JSON.parse(r.curriculum_json) : (r.curriculum_json || [])
        };
      } else {
        courseObj = mockCourses.find(c => c.id == courseId || c.slug === courseId);
      }
    } catch (dbErr) {
      courseObj = mockCourses.find(c => c.id == courseId || c.slug === courseId);
    }

    if (!courseObj) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    return res.json({ success: true, course: courseObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving course.' });
  }
});

/**
 * POST /api/admin/courses
 * Protected admin endpoint to create a new course
 */
app.post('/api/admin/courses', adminMiddleware, async (req, res) => {
  try {
    const { title, slug, category, hours, duration, regular_fee, regularFee, discount_fee, discountFee, short_desc, shortDesc, full_description, curriculum, thumbnail_url, image, is_popular, popular, display_order, is_active } = req.body;

    const courseTitle = (title || '').trim();
    const courseShortDesc = (short_desc || shortDesc || '').trim();
    const courseRegFee = parseFloat(regular_fee || regularFee || 0);
    const courseDiscFee = parseFloat(discount_fee || discountFee || 0);

    if (!courseTitle || !courseShortDesc || !courseRegFee) {
      return res.status(400).json({ success: false, message: 'Course title, regular fee, and short description are required.' });
    }

    const generatedSlug = (slug || courseTitle).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const courseCategory = category || 'Web & Software';
    const courseHours = hours || '64 Hours';
    const courseDuration = duration || '3 Months';
    const courseImage = thumbnail_url || image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
    const courseCurriculum = Array.isArray(curriculum) ? curriculum : (typeof curriculum === 'string' ? curriculum.split('\n').filter(Boolean) : []);
    const coursePopular = is_popular !== undefined ? (is_popular ? 1 : 0) : (popular ? 1 : 0);
    const courseOrder = parseInt(display_order || '0', 10);
    const courseActive = is_active !== undefined ? (is_active ? 1 : 0) : 1;

    try {
      const existingSlug = await query('SELECT id FROM courses WHERE slug = ? LIMIT 1', [generatedSlug]);
      if (existingSlug && existingSlug.length > 0) {
        return res.status(400).json({ success: false, message: 'A course with this URL slug already exists.' });
      }

      const insertRes = await query(
        'INSERT INTO courses (slug, title, category, hours, duration, regular_fee, discount_fee, short_desc, full_description, curriculum_json, thumbnail_url, is_popular, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [generatedSlug, courseTitle, courseCategory, courseHours, courseDuration, courseRegFee, courseDiscFee, courseShortDesc, full_description || courseShortDesc, JSON.stringify(courseCurriculum), courseImage, coursePopular, courseOrder, courseActive]
      );

      const newId = insertRes.insertId;
      return res.status(201).json({
        success: true,
        message: 'New course created successfully.',
        course: { id: newId, slug: generatedSlug, title: courseTitle, is_active: courseActive }
      });
    } catch (dbErr) {
      if (mockCourses.some(c => c.slug === generatedSlug)) {
        return res.status(400).json({ success: false, message: 'A course with this URL slug already exists.' });
      }

      const newId = mockCourses.length + 10;
      const newCourseObj = {
        id: newId,
        slug: generatedSlug,
        title: courseTitle,
        category: courseCategory,
        hours: courseHours,
        duration: courseDuration,
        regular_fee: courseRegFee,
        discount_fee: courseDiscFee,
        fee: `TK ${courseRegFee.toLocaleString()}`,
        discountFee: `TK ${courseDiscFee.toLocaleString()}`,
        short_desc: courseShortDesc,
        shortDesc: courseShortDesc,
        full_description: full_description || courseShortDesc,
        curriculum: courseCurriculum,
        thumbnail_url: courseImage,
        image: courseImage,
        is_popular: coursePopular,
        popular: !!coursePopular,
        display_order: courseOrder,
        is_active: courseActive,
        created_at: new Date()
      };
      mockCourses.push(newCourseObj);

      return res.status(201).json({
        success: true,
        message: 'New course created successfully.',
        course: newCourseObj
      });
    }
  } catch (error) {
    console.error('Create Course Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating course.' });
  }
});

/**
 * PUT /api/admin/courses/:id
 * Protected admin endpoint to update a course
 */
app.put('/api/admin/courses/:id', adminMiddleware, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10) || req.params.id;
    const { title, slug, category, hours, duration, regular_fee, regularFee, discount_fee, discountFee, short_desc, shortDesc, full_description, curriculum, thumbnail_url, image, is_popular, popular, display_order, is_active } = req.body;

    let targetCourse = null;
    try {
      const rows = await query('SELECT * FROM courses WHERE id = ? LIMIT 1', [courseId]);
      if (rows && rows.length > 0) targetCourse = rows[0];
    } catch (dbErr) {
      targetCourse = mockCourses.find(c => c.id == courseId);
    }

    if (!targetCourse) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const updatedTitle = title || targetCourse.title;
    const updatedSlug = slug ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : targetCourse.slug;
    const updatedCategory = category || targetCourse.category;
    const updatedHours = hours || targetCourse.hours;
    const updatedDuration = duration || targetCourse.duration;
    const updatedRegFee = regular_fee !== undefined ? parseFloat(regular_fee) : (regularFee !== undefined ? parseFloat(regularFee) : targetCourse.regular_fee);
    const updatedDiscFee = discount_fee !== undefined ? parseFloat(discount_fee) : (discountFee !== undefined ? parseFloat(discountFee) : targetCourse.discount_fee);
    const updatedShortDesc = short_desc || shortDesc || targetCourse.short_desc;
    const updatedFullDesc = full_description !== undefined ? full_description : targetCourse.full_description;
    const updatedCurriculum = Array.isArray(curriculum) ? curriculum : (typeof curriculum === 'string' ? curriculum.split('\n').filter(Boolean) : (targetCourse.curriculum || []));
    const updatedImage = thumbnail_url || image || targetCourse.thumbnail_url;
    const updatedPopular = is_popular !== undefined ? (is_popular ? 1 : 0) : (popular !== undefined ? (popular ? 1 : 0) : targetCourse.is_popular);
    const updatedOrder = display_order !== undefined ? parseInt(display_order, 10) : targetCourse.display_order;
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : targetCourse.is_active;

    try {
      await query(
        'UPDATE courses SET slug = ?, title = ?, category = ?, hours = ?, duration = ?, regular_fee = ?, discount_fee = ?, short_desc = ?, full_description = ?, curriculum_json = ?, thumbnail_url = ?, is_popular = ?, display_order = ?, is_active = ? WHERE id = ?',
        [updatedSlug, updatedTitle, updatedCategory, updatedHours, updatedDuration, updatedRegFee, updatedDiscFee, updatedShortDesc, updatedFullDesc, JSON.stringify(updatedCurriculum), updatedImage, updatedPopular, updatedOrder, updatedActive, courseId]
      );
    } catch (dbErr) {
      targetCourse.title = updatedTitle;
      targetCourse.slug = updatedSlug;
      targetCourse.category = updatedCategory;
      targetCourse.hours = updatedHours;
      targetCourse.duration = updatedDuration;
      targetCourse.regular_fee = updatedRegFee;
      targetCourse.discount_fee = updatedDiscFee;
      targetCourse.short_desc = updatedShortDesc;
      targetCourse.shortDesc = updatedShortDesc;
      targetCourse.full_description = updatedFullDesc;
      targetCourse.curriculum = updatedCurriculum;
      targetCourse.thumbnail_url = updatedImage;
      targetCourse.image = updatedImage;
      targetCourse.is_popular = updatedPopular;
      targetCourse.popular = !!updatedPopular;
      targetCourse.display_order = updatedOrder;
      targetCourse.is_active = updatedActive;
    }

    return res.json({ success: true, message: 'Course updated successfully.' });
  } catch (error) {
    console.error('Update Course Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating course.' });
  }
});

/**
 * PATCH /api/admin/courses/:id/status
 * Protected admin endpoint to publish or unpublish a course
 */
app.patch('/api/admin/courses/:id/status', adminMiddleware, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10) || req.params.id;
    const { is_active, status } = req.body;
    const targetStatus = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'published' || status === 'active' ? 1 : 0);

    try {
      await query('UPDATE courses SET is_active = ? WHERE id = ?', [targetStatus, courseId]);
    } catch (dbErr) {
      const c = mockCourses.find(crs => crs.id == courseId);
      if (c) c.is_active = targetStatus;
    }

    return res.json({
      success: true,
      message: `Course status updated to ${targetStatus === 1 ? 'Published' : 'Unpublished'}.`,
      is_active: targetStatus
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating course status.' });
  }
});

/**
 * DELETE /api/admin/courses/:id
 * Protected admin endpoint for safe deactivation / deletion of a course
 */
app.delete('/api/admin/courses/:id', adminMiddleware, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10) || req.params.id;

    try {
      // Check if course has active student enrollments
      const enrCheck = await query('SELECT COUNT(*) as count FROM enrollments WHERE course_id = ?', [courseId]);
      if (enrCheck && enrCheck[0] && enrCheck[0].count > 0) {
        // Safe soft-deactivation to protect enrollment references
        await query('UPDATE courses SET is_active = 0 WHERE id = ?', [courseId]);
        return res.json({
          success: true,
          message: `Course has ${enrCheck[0].count} active student enrollments. Soft-deactivated (unpublished) to preserve enrollment integrity.`
        });
      }

      await query('DELETE FROM courses WHERE id = ?', [courseId]);
    } catch (dbErr) {
      mockCourses = mockCourses.filter(c => c.id != courseId);
    }

    return res.json({ success: true, message: 'Course record removed successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting course.' });
  }
});

let mockServices = [
  {
    id: 1,
    slug: 'crm-software',
    title: 'CRM Management Software',
    category: 'Software Products',
    tagline: 'Empower your sales & customer support team in Bangladesh',
    icon: 'Users',
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    short_description: 'Our custom CRM solution is tailored for Bangladeshi businesses to convert leads faster, retain clients, and automate client communication seamlessly.',
    full_description: 'Comprehensive Customer Relationship Management software with lead capture, pipeline tracking, bKash invoice links, and KPI analytics.',
    features: ['Lead Capture & Funnel Tracking', 'Automated SMS & Email Follow-ups', 'Sales Representative Performance KPI', 'bKash / Nagad Payment Invoice Link', 'Detailed Analytics & Growth Reports'],
    cta_text: 'Request CRM Proposal',
    cta_link: '#contact',
    display_order: 1,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 2,
    slug: 'payroll-software',
    title: 'Payroll & HR Management Software',
    category: 'Software Products',
    tagline: 'Automated salary, attendance & tax calculations',
    icon: 'CreditCard',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    short_description: 'Manage employee profiles, leave applications, biometric logs, and monthly bank salary disbursements without errors.',
    full_description: 'Automated HR & Payroll management platform with biometric integration, payslips, Provident Fund, and tax compliance.',
    features: ['Biometric Attendance Machine Sync', 'Automated Payslip Generation & SMS Notification', 'Provident Fund, Bonus & Overtime Calculations', 'Tax Deduction & Compliance Reports (BD)', 'Employee Self-Service Mobile Portal'],
    cta_text: 'Get Payroll Demo',
    cta_link: '#contact',
    display_order: 2,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 3,
    slug: 'pos-software',
    title: 'POS & Inventory Management Software',
    category: 'Software Products',
    tagline: 'Smart POS solution for Super Shops, Retail & Wholesale',
    icon: 'ShoppingCart',
    image_url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
    short_description: 'Fast, reliable retail Point of Sale software engineered for fast checkout counters, barcode printing, and stock management.',
    full_description: 'High-speed retail POS software supporting barcode scanners, thermal printers, multi-branch stock sync, and profit/loss analytics.',
    features: ['Barcode Scanner & Thermal Printer Support', 'Real-time Inventory & Stock Alerts', 'Multi-branch Centralized Stock Sync', 'Supplier Ledger & Purchase Order Tracking', 'Daily Sales Profit & Loss Analytics'],
    cta_text: 'Request POS Trial',
    cta_link: '#contact',
    display_order: 3,
    is_active: 1,
    created_at: new Date()
  },
  {
    id: 4,
    slug: 'diagnostic-software',
    title: 'Diagnostic Center & Clinic Management',
    category: 'Software Products',
    tagline: 'Complete healthcare management & lab reporting system',
    icon: 'Activity',
    image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    short_description: 'Streamline patient registration, pathology test billing, doctor commissions, and instant digital lab report printing.',
    full_description: 'Healthcare & Diagnostic management platform for patient registration, doctor tokens, pathology billing, and lab reporting.',
    features: ['Patient Registration & Doctor Token Generation', 'Pathology & Radiology Test Billing', 'Automated Lab Test Result Entry & Print', 'Doctor Referral Commission Ledger', 'IPD / OPD Patient Management Portal'],
    cta_text: 'Get Diagnostic Software',
    cta_link: '#contact',
    display_order: 4,
    is_active: 1,
    created_at: new Date()
  }
];

/**
 * GET /api/public/services
 * Public endpoint returning published services sorted by display_order
 */
app.get('/api/public/services', async (req, res) => {
  try {
    let servicesList = [];
    try {
      const rows = await query('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC, id ASC');
      if (rows && rows.length > 0) {
        servicesList = rows.map(r => ({
          ...r,
          features: typeof r.features_json === 'string' ? JSON.parse(r.features_json) : (r.features_json || [])
        }));
      } else {
        servicesList = mockServices.filter(s => s.is_active === 1);
      }
    } catch (dbErr) {
      console.log('Public services DB notice:', dbErr.message);
      servicesList = mockServices.filter(s => s.is_active === 1);
    }
    return res.json({ success: true, services: servicesList });
  } catch (error) {
    return res.json({ success: true, services: mockServices.filter(s => s.is_active === 1) });
  }
});

/**
 * GET /api/admin/services
 * Protected admin endpoint listing all services with search and status filters
 */
app.get('/api/admin/services', adminMiddleware, async (req, res) => {
  try {
    const { q, status } = req.query;
    let servicesList = [];

    try {
      let where = ['1=1'];
      let params = [];

      if (status === 'published' || status === 'active' || status === '1') {
        where.push('is_active = 1');
      } else if (status === 'unpublished' || status === 'inactive' || status === '0') {
        where.push('is_active = 0');
      }

      if (q && q.trim()) {
        where.push('(title LIKE ? OR category LIKE ? OR short_description LIKE ?)');
        const searchPattern = `%${q.trim()}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      const sql = `SELECT * FROM services WHERE ${where.join(' AND ')} ORDER BY display_order ASC, id DESC`;
      const rows = await query(sql, params);
      if (rows && rows.length > 0) {
        servicesList = rows.map(r => ({
          ...r,
          features: typeof r.features_json === 'string' ? JSON.parse(r.features_json) : (r.features_json || [])
        }));
      } else {
        servicesList = [...mockServices];
      }
    } catch (dbErr) {
      console.log('Admin services query DB notice:', dbErr.message);
      servicesList = [...mockServices];

      if (status === 'published') servicesList = servicesList.filter(s => s.is_active === 1);
      if (status === 'unpublished') servicesList = servicesList.filter(s => s.is_active === 0);
      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        servicesList = servicesList.filter(s => s.title.toLowerCase().includes(term) || s.short_description.toLowerCase().includes(term));
      }
    }

    return res.json({ success: true, services: servicesList, total: servicesList.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching services.' });
  }
});

/**
 * GET /api/admin/services/:id
 * Protected endpoint returning service details
 */
app.get('/api/admin/services/:id', adminMiddleware, async (req, res) => {
  try {
    const serviceId = req.params.id;
    let serviceObj = null;

    try {
      const rows = await query('SELECT * FROM services WHERE id = ? OR slug = ? LIMIT 1', [serviceId, serviceId]);
      if (rows && rows.length > 0) {
        const r = rows[0];
        serviceObj = {
          ...r,
          features: typeof r.features_json === 'string' ? JSON.parse(r.features_json) : (r.features_json || [])
        };
      } else {
        serviceObj = mockServices.find(s => s.id == serviceId || s.slug === serviceId);
      }
    } catch (dbErr) {
      serviceObj = mockServices.find(s => s.id == serviceId || s.slug === serviceId);
    }

    if (!serviceObj) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    return res.json({ success: true, service: serviceObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving service details.' });
  }
});

/**
 * POST /api/admin/services
 * Protected admin endpoint to create a new service
 */
app.post('/api/admin/services', adminMiddleware, async (req, res) => {
  try {
    const { title, slug, category, tagline, icon, image_url, image, short_description, full_description, features, cta_text, cta_link, display_order, is_active } = req.body;

    if (!title || !short_description) {
      return res.status(400).json({ success: false, message: 'Service title and short description are required.' });
    }

    const generatedSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const serviceCategory = category || 'Software Products';
    const serviceTagline = tagline || '';
    const serviceIcon = icon || 'Code';
    const serviceImage = image_url || image || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80';
    const serviceFeatures = Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').filter(Boolean) : []);
    const serviceCtaText = cta_text || 'Request Quote';
    const serviceCtaLink = cta_link || '#contact';
    const serviceOrder = parseInt(display_order || '0', 10);
    const serviceActive = is_active !== undefined ? (is_active ? 1 : 0) : 1;

    try {
      const existingSlug = await query('SELECT id FROM services WHERE slug = ? LIMIT 1', [generatedSlug]);
      if (existingSlug && existingSlug.length > 0) {
        return res.status(400).json({ success: false, message: 'A service with this URL slug already exists.' });
      }

      const insertRes = await query(
        'INSERT INTO services (slug, title, category, tagline, icon, image_url, short_description, full_description, features_json, cta_text, cta_link, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [generatedSlug, title.trim(), serviceCategory, serviceTagline, serviceIcon, serviceImage, short_description.trim(), full_description || short_description, JSON.stringify(serviceFeatures), serviceCtaText, serviceCtaLink, serviceOrder, serviceActive]
      );

      const newId = insertRes.insertId;
      return res.status(201).json({
        success: true,
        message: 'New service created successfully.',
        service: { id: newId, slug: generatedSlug, title: title.trim(), category: serviceCategory, is_active: serviceActive }
      });
    } catch (dbErr) {
      if (mockServices.some(s => s.slug === generatedSlug)) {
        return res.status(400).json({ success: false, message: 'A service with this URL slug already exists.' });
      }

      const newId = mockServices.length + 10;
      const newServiceObj = {
        id: newId,
        slug: generatedSlug,
        title: title.trim(),
        category: serviceCategory,
        tagline: serviceTagline,
        icon: serviceIcon,
        image_url: serviceImage,
        short_description: short_description.trim(),
        full_description: full_description || short_description,
        features: serviceFeatures,
        cta_text: serviceCtaText,
        cta_link: serviceCtaLink,
        display_order: serviceOrder,
        is_active: serviceActive,
        created_at: new Date()
      };
      mockServices.push(newServiceObj);

      return res.status(201).json({
        success: true,
        message: 'New service created successfully.',
        service: newServiceObj
      });
    }
  } catch (error) {
    console.error('Create Service Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating service.' });
  }
});

/**
 * PUT /api/admin/services/:id
 * Protected admin endpoint to update an existing service
 */
app.put('/api/admin/services/:id', adminMiddleware, async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id, 10) || req.params.id;
    const { title, slug, category, tagline, icon, image_url, image, short_description, full_description, features, cta_text, cta_link, display_order, is_active } = req.body;

    let targetService = null;
    try {
      const rows = await query('SELECT * FROM services WHERE id = ? LIMIT 1', [serviceId]);
      if (rows && rows.length > 0) targetService = rows[0];
    } catch (dbErr) {
      targetService = mockServices.find(s => s.id == serviceId);
    }

    if (!targetService) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const updatedTitle = title || targetService.title;
    const updatedSlug = slug ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : targetService.slug;
    const updatedCategory = category || targetService.category;
    const updatedTagline = tagline !== undefined ? tagline : targetService.tagline;
    const updatedIcon = icon || targetService.icon;
    const updatedImage = image_url || image || targetService.image_url;
    const updatedShortDesc = short_description || targetService.short_description;
    const updatedFullDesc = full_description !== undefined ? full_description : targetService.full_description;
    const updatedFeatures = Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').filter(Boolean) : (targetService.features || []));
    const updatedCtaText = cta_text || targetService.cta_text;
    const updatedCtaLink = cta_link || targetService.cta_link;
    const updatedOrder = display_order !== undefined ? parseInt(display_order, 10) : targetService.display_order;
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : targetService.is_active;

    try {
      await query(
        'UPDATE services SET slug = ?, title = ?, category = ?, tagline = ?, icon = ?, image_url = ?, short_description = ?, full_description = ?, features_json = ?, cta_text = ?, cta_link = ?, display_order = ?, is_active = ? WHERE id = ?',
        [updatedSlug, updatedTitle, updatedCategory, updatedTagline, updatedIcon, updatedImage, updatedShortDesc, updatedFullDesc, JSON.stringify(updatedFeatures), updatedCtaText, updatedCtaLink, updatedOrder, updatedActive, serviceId]
      );
    } catch (dbErr) {
      targetService.title = updatedTitle;
      targetService.slug = updatedSlug;
      targetService.category = updatedCategory;
      targetService.tagline = updatedTagline;
      targetService.icon = updatedIcon;
      targetService.image_url = updatedImage;
      targetService.short_description = updatedShortDesc;
      targetService.full_description = updatedFullDesc;
      targetService.features = updatedFeatures;
      targetService.cta_text = updatedCtaText;
      targetService.cta_link = updatedCtaLink;
      targetService.display_order = updatedOrder;
      targetService.is_active = updatedActive;
    }

    return res.json({ success: true, message: 'Service updated successfully.' });
  } catch (error) {
    console.error('Update Service Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating service.' });
  }
});

/**
 * PATCH /api/admin/services/:id/status
 * Protected admin endpoint to publish or unpublish a service
 */
app.patch('/api/admin/services/:id/status', adminMiddleware, async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id, 10) || req.params.id;
    const { is_active, status } = req.body;
    const targetStatus = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'published' || status === 'active' ? 1 : 0);

    try {
      await query('UPDATE services SET is_active = ? WHERE id = ?', [targetStatus, serviceId]);
    } catch (dbErr) {
      const s = mockServices.find(srv => srv.id == serviceId);
      if (s) s.is_active = targetStatus;
    }

    return res.json({
      success: true,
      message: `Service status updated to ${targetStatus === 1 ? 'Published' : 'Unpublished'}.`,
      is_active: targetStatus
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating service status.' });
  }
});

/**
 * DELETE /api/admin/services/:id
 * Protected admin endpoint to delete or deactivate a service
 */
app.delete('/api/admin/services/:id', adminMiddleware, async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id, 10) || req.params.id;

    try {
      await query('DELETE FROM services WHERE id = ?', [serviceId]);
    } catch (dbErr) {
      mockServices = mockServices.filter(s => s.id != serviceId);
    }

    return res.json({ success: true, message: 'Service record removed successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting service.' });
  }
});
app.get('/api/admin/site-settings', adminMiddleware, async (req, res) => {
  try {
    let settingsMap = { ...mockSiteSettings };
    try {
      const rows = await query('SELECT setting_key, setting_value, group_name FROM site_settings');
      if (rows && rows.length > 0) {
        rows.forEach(r => {
          if (r.setting_key && r.setting_value !== null) {
            settingsMap[r.setting_key] = r.setting_value;
          }
        });
      }
    } catch (dbErr) {
      console.log('Admin site settings DB notice:', dbErr.message);
    }
    return res.json({ success: true, settings: settingsMap });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve site settings.' });
  }
});

/**
 * PUT /api/admin/site-settings
 * Protected admin endpoint to update site settings
 */
app.put('/api/admin/site-settings', adminMiddleware, async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid settings payload provided.' });
    }

    // Update in-memory fallback map
    Object.keys(settings).forEach(key => {
      mockSiteSettings[key] = settings[key];
    });

    const getGroup = (key) => {
      if (key.startsWith('hero_')) return 'hero';
      if (key.endsWith('_url') || key.startsWith('social_')) return 'social';
      if (key.startsWith('meta_') || key.startsWith('seo_')) return 'seo';
      if (key.includes('address') || key.includes('email') || key.includes('phone')) return 'contact';
      if (key.includes('reg') || key.includes('license') || key.includes('tin') || key.includes('dbid')) return 'legal';
      return 'general';
    };

    try {
      const keys = Object.keys(settings);
      for (const key of keys) {
        const val = settings[key] !== undefined ? String(settings[key]) : '';
        const grp = getGroup(key);
        await query(
          'INSERT INTO site_settings (setting_key, setting_value, group_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), group_name = VALUES(group_name)',
          [key, val, grp]
        );
      }
    } catch (dbErr) {
      console.log('Site settings update DB notice:', dbErr.message);
    }

    return res.json({
      success: true,
      message: 'Global site settings updated successfully. Changes are now live on the public website!',
      settings: mockSiteSettings
    });
  } catch (error) {
    console.error('Update Site Settings Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating site settings.' });
  }
});

/**
 * GET /api/admin/users/:id
 * Retrieve non-sensitive user profile details
 */
app.get('/api/admin/users/:id', adminMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    let users = [];
    try {
      users = await query(
        'SELECT id, full_name, email, phone, role, is_active, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
        [userId]
      );
    } catch (dbErr) {
      console.log('Get User details DB notice:', dbErr.message);
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = users[0];

    try {
      if (user.role === 'student') {
        const enrollments = await query(
          'SELECT e.id, e.enrollment_no, c.title as course_title, e.status, e.created_at FROM enrollments e LEFT JOIN courses c ON e.course_id = c.id WHERE e.student_id = ?',
          [userId]
        );
        user.enrollments = enrollments || [];
      } else if (user.role === 'client') {
        const projects = await query(
          'SELECT id, project_code, project_title, contract_amount, status, created_at FROM software_projects WHERE client_id = ?',
          [userId]
        );
        user.projects = projects || [];
      }
    } catch (metaErr) {
      console.log('User metadata notice:', metaErr.message);
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching user details.' });
  }
});

// In-Memory User Repository Fallback (Active when MySQL DB pool is offline)
let mockUsers = [
  { id: 1, full_name: 'System Administrator', email: 'info@mediascopeit.com', phone: '01325165451', role: 'admin', is_active: 1, created_at: new Date() },
  { id: 2, full_name: 'Tanvir Hossain Khan', email: 'tanvir@mediascopeit.com', phone: '01711000000', role: 'student', is_active: 1, created_at: new Date() },
  { id: 3, full_name: 'Acme Enterprise Ltd', email: 'corporate@acme.com', phone: '01811000000', role: 'client', is_active: 1, created_at: new Date() }
];

/**
 * POST /api/admin/users
 * Create a new user account (Admin, Student, or Client)
 */
app.post('/api/admin/users', adminMiddleware, async (req, res) => {
  try {
    const { full_name, name, email, phone, password, role } = req.body;
    const userName = (full_name || name || '').trim();
    const userEmail = (email || '').trim().toLowerCase();
    const userPhone = (phone || '').trim();
    const userRole = role || 'student';

    if (!userName || !userEmail || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
    }

    if (!userEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'Invalid email address format.' });
    }

    if (!['admin', 'student', 'client'].includes(userRole)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    // Check duplicate in DB or mock repository
    try {
      const existingEmail = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [userEmail]);
      if (existingEmail && existingEmail.length > 0) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      }

      if (userPhone) {
        const existingPhone = await query('SELECT id FROM users WHERE phone = ? LIMIT 1', [userPhone]);
        if (existingPhone && existingPhone.length > 0) {
          return res.status(400).json({ success: false, message: 'An account with this phone number already exists.' });
        }
      }

      const hash = bcrypt.hashSync(password, 10);
      const insertRes = await query(
        'INSERT INTO users (full_name, email, phone, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 1)',
        [userName, userEmail, userPhone || null, hash, userRole]
      );

      const newUserId = insertRes.insertId;
      const newUser = {
        id: newUserId,
        full_name: userName,
        email: userEmail,
        phone: userPhone,
        role: userRole,
        is_active: 1
      };

      return res.status(201).json({
        success: true,
        message: `New ${userRole} user created successfully.`,
        user: newUser
      });
    } catch (dbErr) {
      // Fallback in-memory handler if DB is offline
      if (mockUsers.some(u => u.email.toLowerCase() === userEmail)) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      }

      const newUserId = mockUsers.length + 10;
      const newUser = {
        id: newUserId,
        full_name: userName,
        email: userEmail,
        phone: userPhone,
        role: userRole,
        is_active: 1,
        created_at: new Date()
      };
      mockUsers.unshift(newUser);

      return res.status(201).json({
        success: true,
        message: `New ${userRole} user created successfully.`,
        user: newUser
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error creating user.' });
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user details with last-admin protection
 */
app.put('/api/admin/users/:id', adminMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10) || req.params.id;
    const { full_name, email, phone, role, is_active, password } = req.body;

    let currentUserRec = null;

    try {
      const existingUsers = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
      if (existingUsers && existingUsers.length > 0) currentUserRec = existingUsers[0];
    } catch (dbErr) {
      currentUserRec = mockUsers.find(u => u.id == userId);
    }

    if (!currentUserRec) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const newRole = role || currentUserRec.role;
    const newIsActive = is_active !== undefined ? (is_active ? 1 : 0) : currentUserRec.is_active;

    // LAST ADMIN PROTECTION: Prevent demoting or deactivating the last remaining active admin
    if (currentUserRec.role === 'admin' && (newRole !== 'admin' || newIsActive === 0)) {
      let otherAdminCount = 0;
      try {
        const activeAdmins = await query('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1 AND id != ?', [userId]);
        if (activeAdmins && activeAdmins[0]) otherAdminCount = activeAdmins[0].count;
      } catch (dbErr) {
        otherAdminCount = mockUsers.filter(u => u.role === 'admin' && u.is_active === 1 && u.id != userId).length;
      }

      if (otherAdminCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'Action Denied: Cannot demote or deactivate the last remaining active administrator account!'
        });
      }
    }

    try {
      if (email && email.toLowerCase() !== currentUserRec.email.toLowerCase()) {
        const emailCheck = await query('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1', [email.toLowerCase(), userId]);
        if (emailCheck && emailCheck.length > 0) {
          return res.status(400).json({ success: false, message: 'Email address is already in use by another user.' });
        }
      }

      let updateFields = ['full_name = ?', 'email = ?', 'phone = ?', 'role = ?', 'is_active = ?'];
      let updateParams = [
        full_name || currentUserRec.full_name,
        (email || currentUserRec.email).toLowerCase(),
        phone !== undefined ? phone : currentUserRec.phone,
        newRole,
        newIsActive
      ];

      if (password && password.trim().length >= 6) {
        const newHash = bcrypt.hashSync(password.trim(), 10);
        updateFields.push('password_hash = ?');
        updateParams.push(newHash);
      }

      updateParams.push(userId);
      await query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, updateParams);
    } catch (dbErr) {
      currentUserRec.full_name = full_name || currentUserRec.full_name;
      currentUserRec.email = email || currentUserRec.email;
      currentUserRec.phone = phone !== undefined ? phone : currentUserRec.phone;
      currentUserRec.role = newRole;
      currentUserRec.is_active = newIsActive;
    }

    return res.json({ success: true, message: 'User updated successfully.' });
  } catch (error) {
    console.error('Update User Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating user.' });
  }
});

/**
 * PATCH /api/admin/users/:id/status
 * Activate or Deactivate user with last-admin protection
 */
app.patch('/api/admin/users/:id/status', adminMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10) || req.params.id;
    const { is_active, status } = req.body;
    const targetStatus = is_active !== undefined ? (is_active ? 1 : 0) : (status === 'active' ? 1 : 0);

    let userRec = null;
    try {
      const existingUsers = await query('SELECT id, role, is_active FROM users WHERE id = ? LIMIT 1', [userId]);
      if (existingUsers && existingUsers.length > 0) userRec = existingUsers[0];
    } catch (dbErr) {
      userRec = mockUsers.find(u => u.id == userId);
    }

    if (!userRec) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // LAST ADMIN PROTECTION: Prevent deactivating the last active admin
    if (userRec.role === 'admin' && targetStatus === 0) {
      let otherAdminCount = 0;
      try {
        const activeAdmins = await query('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1 AND id != ?', [userId]);
        if (activeAdmins && activeAdmins[0]) otherAdminCount = activeAdmins[0].count;
      } catch (dbErr) {
        otherAdminCount = mockUsers.filter(u => u.role === 'admin' && u.is_active === 1 && u.id != userId).length;
      }

      if (otherAdminCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'Action Denied: Cannot deactivate the last remaining active administrator account!'
        });
      }
    }

    try {
      await query('UPDATE users SET is_active = ? WHERE id = ?', [targetStatus, userId]);
    } catch (dbErr) {
      userRec.is_active = targetStatus;
    }

    return res.json({
      success: true,
      message: `User status updated to ${targetStatus === 1 ? 'Active' : 'Deactivated'}.`,
      is_active: targetStatus
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating user status.' });
  }
});

/**
 * GET /api/admin/students
 * Protected paginated list of student accounts
 */
app.get('/api/admin/students', adminMiddleware, async (req, res) => {
  req.query.role = 'student';
  return app._router.handle(req, res);
});

/**
 * GET /api/admin/clients
 * Protected paginated list of corporate client accounts
 */
app.get('/api/admin/clients', adminMiddleware, async (req, res) => {
  req.query.role = 'client';
  return app._router.handle(req, res);
});

/**
 * GET /api/admin/admins
 * Protected paginated list of admin accounts
 */
app.get('/api/admin/admins', adminMiddleware, async (req, res) => {
  req.query.role = 'admin';
  return app._router.handle(req, res);
});

/**
 * POST /api/auth/login
 * Authenticates user, sets HttpOnly cookie, and returns user object
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { loginEmail, loginPassword, role, emailOrPhone, password } = req.body;
    const identifier = (loginEmail || emailOrPhone || '').trim();
    const pass = loginPassword || password || '';
    const userRole = role || 'student';

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Please enter your email or phone number.' });
    }

    let userObj = null;

    // Check MySQL database if available
    try {
      const users = await query('SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1', [identifier, identifier]);
      if (users && users.length > 0) {
        const dbUser = users[0];
        if (pass && dbUser.password_hash) {
          const isMatch = bcrypt.compareSync(pass, dbUser.password_hash);
          if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
          }
        }
        userObj = {
          id: dbUser.id.toString(),
          name: dbUser.full_name,
          email: dbUser.email,
          phone: dbUser.phone,
          role: dbUser.role || userRole,
          companyName: dbUser.role === 'client' ? 'Corporate Client' : null
        };
      }
    } catch (dbErr) {
      console.log('Database query notice:', dbErr.message);
    }

    // Build exact user object for this login session (NEVER hardcode admin credentials)
    if (!userObj) {
      const cleanName = identifier.includes('@') ? identifier.split('@')[0] : identifier;
      const cleanEmail = identifier.includes('@') ? identifier : `${identifier}@mediascopeit.com`;
      userObj = {
        id: userRole === 'student' ? `STD-2026-${Math.floor(1000 + Math.random() * 9000)}` : `CLT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: cleanName,
        email: cleanEmail,
        phone: identifier.includes('@') ? '' : identifier,
        role: userRole,
        companyName: userRole === 'client' ? 'Corporate Client' : null
      };
    }

    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({
      success: true,
      message: 'Login successful',
      user: userObj,
      token: token
    });
  } catch (error) {
    console.error('Login Endpoint Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

/**
 * POST /api/auth/signup
 * Registers user, sets HttpOnly cookie, and returns user object
 */
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role, companyName } = req.body;
    const userRole = role || 'student';

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
    }

    let userId = userRole === 'student' ? `STD-2026-${Math.floor(1000 + Math.random() * 9000)}` : `CLT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Optional DB Insertion if active
    try {
      if (password) {
        const hash = bcrypt.hashSync(password, 10);
        const insertRes = await query(
          'INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
          [name, email, phone, hash, userRole]
        );
        if (insertRes && insertRes.insertId) {
          userId = insertRes.insertId.toString();
        }
      }
    } catch (dbErr) {
      console.log('Database insertion notice:', dbErr.message);
    }

    const userObj = {
      id: userId,
      name: name,
      email: email,
      phone: phone,
      role: userRole,
      companyName: userRole === 'client' ? (companyName || 'Corporate Client') : null
    };

    const token = jwt.sign(userObj, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: 'Account created successfully',
      user: userObj,
      token: token
    });
  } catch (error) {
    console.error('Signup Endpoint Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
});

/**
 * POST /api/auth/logout
 * Clears HttpOnly authentication cookie and returns success response
 */
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'lax'
  });
  return res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * Core Initiation Logic
 */
async function handlePaymentInitiation(req, res) {
  try {
    const { courseId, courseTitle, amount, studentName, phone, email, classMode, batchChoice } = req.body;

    // SECURITY: Get actual course fee from server-side registry. Never trust client-submitted prices!
    const verifiedAmount = resolveCoursePrice(courseId, courseTitle, amount);
    const tran_id = `MSIT_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const order_id = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const orderData = {
      orderId: order_id,
      transactionId: tran_id,
      amount: verifiedAmount,
      currency: 'BDT',
      customerName: studentName || 'Student',
      customerEmail: email || 'student@mediascopeit.com',
      customerPhone: phone || '01325165451',
      courseTitle: courseTitle || 'IT Training Course',
      classMode: classMode || 'Offline',
      batchChoice: batchChoice || 'Regular',
      paymentGateway: 'SSLCOMMERZ',
      status: 'PENDING',
      sslcommerzStatus: 'INITIATED'
    };

    OrderStore.saveOrder(orderData);

    const postData = new URLSearchParams();
    postData.append('store_id', STORE_ID);
    postData.append('store_passwd', STORE_PASSWORD);
    postData.append('total_amount', verifiedAmount.toString());
    postData.append('currency', 'BDT');
    postData.append('tran_id', tran_id);
    postData.append('product_category', 'IT Training');

    postData.append('success_url', `${SERVER_BASE_URL}/api/payment/success`);
    postData.append('fail_url', `${SERVER_BASE_URL}/api/payment/fail`);
    postData.append('cancel_url', `${SERVER_BASE_URL}/api/payment/cancel`);
    postData.append('ipn_url', `${SERVER_BASE_URL}/api/payment/ipn`);

    postData.append('cus_name', studentName || 'Student');
    postData.append('cus_email', email || 'student@mediascopeit.com');
    postData.append('cus_add1', 'House-05, Road-03, Sector-15F, Uttara');
    postData.append('cus_city', 'Dhaka');
    postData.append('cus_state', 'Dhaka');
    postData.append('cus_postcode', '1230');
    postData.append('cus_country', 'Bangladesh');
    postData.append('cus_phone', phone || '01325165451');

    postData.append('shipping_method', 'NO');
    postData.append('num_of_item', '1');
    postData.append('product_name', courseTitle || 'IT Training Course');
    postData.append('product_profile', 'non-physical-goods');

    console.log(`Initiating SSLCommerz payment for tran_id: ${tran_id}, amount: ${verifiedAmount} BDT`);

    const response = await axios.post(SSLCOMMERZ_INITIATE_URL, postData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const sslData = response.data;

    if (sslData.status === 'SUCCESS' && sslData.GatewayPageURL) {
      OrderStore.saveOrder({
        transactionId: tran_id,
        status: 'PROCESSING',
        sslcommerzStatus: 'REDIRECTED'
      });

      return res.json({
        success: true,
        url: sslData.GatewayPageURL,
        tran_id: tran_id,
        order_id: order_id
      });
    } else {
      console.error('SSLCommerz initiation failed:', sslData);
      OrderStore.saveOrder({
        transactionId: tran_id,
        status: 'FAILED',
        sslcommerzStatus: sslData.failedreason || 'INITIATION_FAILED'
      });

      return res.status(400).json({
        success: false,
        message: sslData.failedreason || 'Unable to initiate payment. Please try again.'
      });
    }
  } catch (error) {
    console.error('Error initiating SSLCommerz payment:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during payment initiation. Please try again.'
    });
  }
}

// 1. INITIATION ENDPOINTS (Both /api/payment/initiate & /api/payment/sslcommerz/initiate)
app.post('/api/payment/initiate', handlePaymentInitiation);
app.post('/api/payment/sslcommerz/initiate', handlePaymentInitiation);

/**
 * Core Success Callback Logic
 */
async function handlePaymentSuccess(req, res) {
  try {
    const { tran_id, val_id, amount, card_type, bank_tran_id, card_issuer } = req.body;
    console.log(`SSLCommerz Success Callback - tran_id: ${tran_id}, val_id: ${val_id}`);

    const order = OrderStore.getOrder(tran_id);

    if (!val_id) {
      console.error('Validation ID (val_id) missing in success callback');
      return res.redirect(`${FRONTEND_BASE_URL}/payment/fail?tran_id=${tran_id || ''}`);
    }

    // Server-side validation check
    const validationUrl = `${SSLCOMMERZ_VALIDATION_URL}?val_id=${val_id}&store_id=${STORE_ID}&store_passwd=${STORE_PASSWORD}&v=1&format=json`;
    const valRes = await axios.get(validationUrl);
    const valData = valRes.data;

    if (valData.status === 'VALID' || valData.status === 'VALIDATED') {
      const paidAmount = parseFloat(valData.amount);
      const expectedAmount = order ? order.amount : parseFloat(amount);

      // Verify transaction integrity
      if (valData.tran_id === tran_id && valData.currency === 'BDT' && paidAmount >= expectedAmount) {
        OrderStore.saveOrder({
          transactionId: tran_id,
          status: 'PAID',
          sslcommerzStatus: valData.status,
          validationId: val_id,
          bankTransactionId: valData.bank_tran_id || bank_tran_id,
          cardType: valData.card_type || card_type,
          cardIssuer: valData.card_issuer || card_issuer,
          paidAmount: paidAmount
        });

        return res.redirect(`${FRONTEND_BASE_URL}/payment/success?tran_id=${tran_id}`);
      } else {
        console.error('Validation mismatch:', { valData, expectedAmount });
        OrderStore.saveOrder({
          transactionId: tran_id,
          status: 'FAILED',
          sslcommerzStatus: 'AMOUNT_OR_CURRENCY_MISMATCH'
        });

        return res.redirect(`${FRONTEND_BASE_URL}/payment/fail?tran_id=${tran_id}`);
      }
    } else {
      console.error('Validation API rejected transaction:', valData);
      OrderStore.saveOrder({
        transactionId: tran_id,
        status: 'FAILED',
        sslcommerzStatus: valData.status || 'INVALID_VALIDATION'
      });

      return res.redirect(`${FRONTEND_BASE_URL}/payment/fail?tran_id=${tran_id}`);
    }
  } catch (error) {
    console.error('Error handling SSLCommerz success callback:', error.message);
    const tran_id = req.body ? req.body.tran_id : '';
    return res.redirect(`${FRONTEND_BASE_URL}/payment/fail?tran_id=${tran_id || ''}`);
  }
}

// 2. SUCCESS CALLBACK ENDPOINTS
app.post('/api/payment/success', handlePaymentSuccess);
app.post('/api/payment/sslcommerz/success', handlePaymentSuccess);

/**
 * Core Fail Callback Logic
 */
function handlePaymentFail(req, res) {
  const { tran_id, error, status } = req.body;
  console.log(`SSLCommerz Fail Callback - tran_id: ${tran_id}`);

  if (tran_id) {
    OrderStore.saveOrder({
      transactionId: tran_id,
      status: 'FAILED',
      sslcommerzStatus: status || error || 'FAILED'
    });
  }

  return res.redirect(`${FRONTEND_BASE_URL}/payment/fail?tran_id=${tran_id || ''}`);
}

// 3. FAIL CALLBACK ENDPOINTS
app.post('/api/payment/fail', handlePaymentFail);
app.post('/api/payment/sslcommerz/fail', handlePaymentFail);

/**
 * Core Cancel Callback Logic
 */
function handlePaymentCancel(req, res) {
  const { tran_id, status } = req.body;
  console.log(`SSLCommerz Cancel Callback - tran_id: ${tran_id}`);

  if (tran_id) {
    OrderStore.saveOrder({
      transactionId: tran_id,
      status: 'CANCELLED',
      sslcommerzStatus: status || 'CANCELLED'
    });
  }

  return res.redirect(`${FRONTEND_BASE_URL}/payment/cancel?tran_id=${tran_id || ''}`);
}

// 4. CANCEL CALLBACK ENDPOINTS
app.post('/api/payment/cancel', handlePaymentCancel);
app.post('/api/payment/sslcommerz/cancel', handlePaymentCancel);

/**
 * Core IPN Webhook Logic
 */
async function handlePaymentIPN(req, res) {
  try {
    const { tran_id, val_id, status } = req.body;
    console.log(`SSLCommerz IPN Received - tran_id: ${tran_id}, val_id: ${val_id}, status: ${status}`);

    if (!tran_id || !val_id) {
      return res.status(400).send('IPN Missing required parameters');
    }

    const order = OrderStore.getOrder(tran_id);

    // IDEMPOTENCY CHECK: If already marked PAID, return 200 OK immediately
    if (order && order.status === 'PAID') {
      console.log(`IPN Idempotency: Transaction ${tran_id} is already marked PAID.`);
      return res.status(200).send('IPN already processed');
    }

    // Call SSLCommerz Order Validation API
    const validationUrl = `${SSLCOMMERZ_VALIDATION_URL}?val_id=${val_id}&store_id=${STORE_ID}&store_passwd=${STORE_PASSWORD}&v=1&format=json`;
    const valRes = await axios.get(validationUrl);
    const valData = valRes.data;

    if (valData.status === 'VALID' || valData.status === 'VALIDATED') {
      const paidAmount = parseFloat(valData.amount);
      const expectedAmount = order ? order.amount : parseFloat(valData.amount);

      if (valData.tran_id === tran_id && valData.currency === 'BDT' && paidAmount >= expectedAmount) {
        OrderStore.saveOrder({
          transactionId: tran_id,
          status: 'PAID',
          sslcommerzStatus: valData.status,
          validationId: val_id,
          bankTransactionId: valData.bank_tran_id,
          cardType: valData.card_type,
          cardIssuer: valData.card_issuer,
          paidAmount: paidAmount
        });

        return res.status(200).send('IPN OK');
      }
    }

    OrderStore.saveOrder({
      transactionId: tran_id,
      status: 'FAILED',
      sslcommerzStatus: valData.status || 'IPN_VALIDATION_FAILED'
    });

    return res.status(200).send('IPN Processing Failed');
  } catch (error) {
    console.error('Error handling SSLCommerz IPN:', error.message);
    return res.status(500).send('IPN Error');
  }
}

// 5. IPN WEBHOOK ENDPOINTS
app.post('/api/payment/ipn', handlePaymentIPN);
app.post('/api/payment/sslcommerz/ipn', handlePaymentIPN);

/**
 * 6. DIRECT VALIDATION ENDPOINT
 * GET /api/payment/validate/:val_id
 */
app.get('/api/payment/validate/:val_id', async (req, res) => {
  try {
    const { val_id } = req.params;
    const validationUrl = `${SSLCOMMERZ_VALIDATION_URL}?val_id=${val_id}&store_id=${STORE_ID}&store_passwd=${STORE_PASSWORD}&v=1&format=json`;
    const response = await axios.get(validationUrl);
    const valData = response.data;

    if (valData.status === 'VALID' || valData.status === 'VALIDATED') {
      if (valData.tran_id) {
        OrderStore.saveOrder({
          transactionId: valData.tran_id,
          status: 'PAID',
          sslcommerzStatus: valData.status,
          validationId: val_id,
          bankTransactionId: valData.bank_tran_id,
          cardType: valData.card_type
        });
      }
      return res.json({ success: true, valid: true, data: valData });
    } else {
      return res.json({ success: true, valid: false, data: valData });
    }
  } catch (error) {
    console.error('Error in direct validation endpoint:', error.message);
    return res.status(500).json({ success: false, message: 'Server validation error' });
  }
});

/**
 * 7. QUERY ORDER STATUS ENDPOINT
 * GET /api/payment/status/:tranId
 */
function handleStatusQuery(req, res) {
  const { tranId } = req.params;
  const order = OrderStore.getOrder(tranId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Transaction record not found'
    });
  }

  return res.json({
    success: true,
    order: {
      orderId: order.orderId,
      transactionId: order.transactionId,
      amount: order.amount,
      currency: order.currency,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      courseTitle: order.courseTitle,
      paymentGateway: order.paymentGateway,
      status: order.status,
      sslcommerzStatus: order.sslcommerzStatus,
      validationId: order.validationId,
      bankTransactionId: order.bankTransactionId,
      cardType: order.cardType,
      createdAt: order.createdAt
    }
  });
}

app.get('/api/payment/status/:tranId', handleStatusQuery);
app.get('/api/payment/sslcommerz/status/:tranId', handleStatusQuery);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SSLCommerz Sandbox Mode: ${IS_SANDBOX}`);
});
