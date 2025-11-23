// Database Migration Runner for Neon PostgreSQL
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql = neon(process.env.NEON_DATABASE_URL);

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...\n');

    // Read migration file
    const migrationPath = path.join(__dirname, '001_initial_schema.sql');
    let migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('📄 Running migration: 001_initial_schema.sql');

    // Remove single-line comments
    migrationSQL = migrationSQL
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    // Split by semicolons but preserve function bodies ($$...$$)
    const statements = [];
    let current = '';
    let inDollarQuote = false;

    for (let i = 0; i < migrationSQL.length; i++) {
      const char = migrationSQL[i];
      const next = migrationSQL[i + 1];

      current += char;

      // Detect $$ boundaries
      if (char === '$' && next === '$') {
        inDollarQuote = !inDollarQuote;
        current += next;
        i++; // Skip next $
      }

      // Split on semicolon only if not inside $$
      if (char === ';' && !inDollarQuote) {
        const stmt = current.trim();
        if (stmt && stmt.length > 10) {
          statements.push(stmt);
        }
        current = '';
      }
    }

    // Add last statement if exists
    if (current.trim().length > 10) {
      statements.push(current.trim());
    }

    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    let executed = 0;
    for (const statement of statements) {
      try {
        await sql(statement);
        executed++;
        
        // Show progress
        if (statement.includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
          if (tableName) console.log(`   ✓ Created table: ${tableName}`);
        } else if (statement.includes('CREATE INDEX')) {
          const indexName = statement.match(/CREATE INDEX (\w+)/)?.[1];
          if (indexName) console.log(`   ✓ Created index: ${indexName}`);
        } else if (statement.includes('CREATE TRIGGER')) {
          const triggerName = statement.match(/CREATE TRIGGER (\w+)/)?.[1];
          if (triggerName) console.log(`   ✓ Created trigger: ${triggerName}`);
        } else if (statement.includes('CREATE OR REPLACE FUNCTION')) {
          console.log(`   ✓ Created function: update_updated_at_column()`);
        } else if (statement.includes('INSERT INTO')) {
          console.log(`   ✓ Inserted seed data`);
        }
      } catch (error) {
        console.error(`   ✗ Failed statement: ${statement.substring(0, 50)}...`);
        throw error;
      }
    }

    console.log(`\n✅ Migration completed! Executed ${executed} statements\n`);

    // Verify tables created
    console.log('🔍 Verifying tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    console.log('\n📊 Created tables:');
    tables.forEach(t => console.log(`   ✓ ${t.table_name}`));

    // Check seed data
    const schools = await sql`SELECT COUNT(*) as count FROM schools`;
    console.log(`\n✅ Seeded ${schools[0].count} schools`);

    console.log('\n🎉 Database is ready for production!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
