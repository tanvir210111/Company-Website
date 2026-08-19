const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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
