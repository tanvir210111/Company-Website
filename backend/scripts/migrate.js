const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function runMigrations() {
  console.log('====================================================');
  console.log('MEDIA SCOPE IT LTD — DATABASE MIGRATION SYSTEM');
  console.log('====================================================\n');

  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Create schema_migrations tracking table if missing
    console.log('1. Verifying schema_migrations tracking table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`schema_migrations\` (
        \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        \`version\` VARCHAR(50) NOT NULL UNIQUE,
        \`name\` VARCHAR(255) NOT NULL,
        \`applied_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Tracking table schema_migrations verified.');

    // 2. Fetch list of already applied migrations
    const [appliedRows] = await connection.query('SELECT version FROM schema_migrations');
    const appliedVersions = new Set(appliedRows.map(r => r.version));

    // 3. Read migration files from backend/migrations directory
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.match(/^\d{3}_.*\.sql$/))
      .sort();

    console.log(`\n2. Scanning migration directory (${files.length} migration files found)...`);

    let pendingCount = 0;
    for (const file of files) {
      const version = file.split('_')[0];

      if (appliedVersions.has(version)) {
        console.log(`   [SKIP] ${file} (already applied)`);
        continue;
      }

      pendingCount++;
      console.log(`\n====================================================`);
      console.log(`APPLYING MIGRATION ${version}: ${file}`);
      console.log(`====================================================`);

      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf8');

      // Execute migration DDL statements
      try {
        await connection.query(sqlContent);
        
        // Record migration as applied
        await connection.query(
          'INSERT INTO schema_migrations (version, name) VALUES (?, ?)',
          [version, file]
        );
        console.log(`   ✓ Successfully applied migration ${file}`);
      } catch (migErr) {
        console.error(`\n❌ ERROR executing migration ${file}:`, migErr.message);
        console.error('Migration halted to preserve database integrity.');
        process.exit(1);
      }
    }

    console.log('\n====================================================');
    if (pendingCount === 0) {
      console.log('Database schema is 100% up to date. No pending migrations.');
    } else {
      console.log(`Successfully applied ${pendingCount} pending database migration(s)!`);
    }
    console.log('====================================================');

  } catch (err) {
    console.error('Fatal Database Migration Error:', err.message);
    process.exit(1);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

// Standalone CLI execution support
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
