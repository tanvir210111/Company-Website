const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'orders.json');

// Ensure data directory and orders.json exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({}), 'utf8');
}

function readOrders() {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '{}');
  } catch (err) {
    console.error('Error reading orders file:', err);
    return {};
  }
}

function writeOrders(orders) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing orders file:', err);
  }
}

const OrderStore = {
  saveOrder(orderData) {
    const orders = readOrders();
    const tranId = orderData.transactionId;
    const existing = orders[tranId] || {};

    const orderId = orderData.orderId || existing.orderId || `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const updated = {
      orderId: orderId,
      transactionId: tranId,
      customerName: orderData.customerName || existing.customerName || 'Student',
      customerEmail: orderData.customerEmail || existing.customerEmail || 'student@mediascopeit.com',
      customerPhone: orderData.customerPhone || existing.customerPhone || '01325165451',
      courseTitle: orderData.courseTitle || existing.courseTitle || 'IT Training Course',
      amount: orderData.amount !== undefined ? orderData.amount : existing.amount,
      currency: orderData.currency || existing.currency || 'BDT',
      status: orderData.status || existing.status || 'PENDING',
      validationId: orderData.validationId || existing.validationId || null,
      bankTransactionId: orderData.bankTransactionId || existing.bankTransactionId || null,
      paymentGateway: orderData.paymentGateway || existing.paymentGateway || 'SSLCOMMERZ',
      sslcommerzStatus: orderData.sslcommerzStatus || existing.sslcommerzStatus || 'INITIATED',
      cardType: orderData.cardType || existing.cardType || null,
      createdAt: existing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders[tranId] = updated;
    writeOrders(orders);
    return updated;
  },

  getOrder(tranId) {
    const orders = readOrders();
    return orders[tranId] || null;
  },

  getOrderByValId(valId) {
    const orders = readOrders();
    return Object.values(orders).find(o => o.validationId === valId) || null;
  }
};

module.exports = OrderStore;
