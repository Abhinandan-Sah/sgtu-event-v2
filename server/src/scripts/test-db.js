// Test database connection to Neon
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

async function testConnection() {
  console.log('🔍 Testing Neon database connection...\n');

  if (!process.env.NEON_DATABASE_URL) {
    console.error('❌ NEON_DATABASE_URL not found in environment variables');
    console.log('Please add it to your .env file\n');
    process.exit(1);
  }

  try {
    const sql = neon(process.env.NEON_DATABASE_URL);
    
    // Test query
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    
    console.log('✅ Connection successful!\n');
    console.log('📊 Database Info:');
    console.log(`   Time: ${result[0].current_time}`);
    console.log(`   Version: ${result[0].pg_version.split(' ')[0]} ${result[0].pg_version.split(' ')[1]}\n`);
    
    // Check if tables exist
    const tables = await sql`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log(`📋 Tables in database: ${tables[0].count}`);
    
    if (tables[0].count === 0) {
      console.log('\n⚠️  No tables found. Run migration first:');
      console.log('   node src/migrations/run-migration.js\n');
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your NEON_DATABASE_URL in .env');
    console.error('2. Ensure your Neon database is active');
    console.error('3. Check your internet connection\n');
    process.exit(1);
  }
}

testConnection();
