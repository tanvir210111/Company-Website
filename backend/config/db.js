const mysql = require('mysql2/promise');
require('dotenv').config();

// Create MySQL Connection Pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'mediascope_user',
  password: process.env.DB_PASSWORD || 'Media@@@2k26',
  database: process.env.DB_NAME || 'mediascope_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  multipleStatements: true
});

// Helper query function
async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}

module.exports = {
  pool,
  query
};
