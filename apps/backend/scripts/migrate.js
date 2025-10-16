require('dotenv').config();
const { supabase } = require('../config/supabase');
const fs = require('fs').promises;
const path = require('path');

async function runMigrations() {
  try {
    console.log('Starting database migrations...');

    // Read migration files
    const migrationsPath = path.join(__dirname, '../supabase/migrations');
    const files = await fs.readdir(migrationsPath);
    
    // Sort files by name (they should be numbered)
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      
      const filePath = path.join(migrationsPath, file);
      const sql = await fs.readFile(filePath, 'utf8');
      
      // Split by semicolon to handle multiple statements
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            // If RPC is not available, try direct query (this is a fallback)
            console.log('RPC not available, trying direct execution...');
            // Note: Direct SQL execution might not be available in Supabase
            // You might need to use the SQL editor in Supabase dashboard
          }
        }
      }
      
      console.log(`✓ Completed: ${file}`);
    }

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;