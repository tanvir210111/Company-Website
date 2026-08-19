const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function runDatabaseInitialization() {
  console.log('====================================================');
  console.log('MEDIA SCOPE IT LTD — DATABASE INITIALIZATION SCRIPT');
  console.log('====================================================\n');

  try {
    const schemaPath = path.join(__dirname, '../migrations/schema.sql');
    const seedPath = path.join(__dirname, '../migrations/seed.sql');

    console.log('1. Reading database schema file (schema.sql)...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('2. Reading database seed file (seed.sql)...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    const connection = await pool.getConnection();

    try {
      console.log('3. Executing schema DDL queries (21 tables)...');
      await connection.query(schemaSql);
      console.log('   ✓ All 21 tables created successfully.');

      console.log('4. Executing verified seed data queries...');
      await connection.query(seedSql);
      console.log('   ✓ Seed data inserted successfully.');

      console.log('\n====================================================');
      console.log('SUCCESS: Database initialization completed cleanly!');
      console.log('====================================================');
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('\nERROR during database initialization:', error.message);
  } finally {
    await pool.end();
  }
}

// Allow standalone execution
if (require.main === module) {
  runDatabaseInitialization();
}

module.exports = runDatabaseInitialization;
