/**
 * Fix Stall School Assignments
 * Updates existing stalls with their correct schools
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

const sql = neon(process.env.NEON_DATABASE_URL);

// Mapping of stall prefixes to schools
const stallSchoolMapping = {
  'CS': 'School of Computing Sciences and Engineering',
  'ME': 'School of Engineering',
  'EE': 'School of Engineering',
  'CE': 'School of Engineering',
  'BM': 'School of Management',
  'BT': 'School of Applied Sciences',
  'PH': 'School of Applied Sciences',
  'CH': 'School of Applied Sciences',
  'MA': 'School of Applied Sciences'
};

// Special case for BT-002 (Pharmacy)
const specialCases = {
  'BT-002': 'School of Pharmacy'
};

async function fixStallSchools() {
  try {
    console.log('🔧 Fixing stall school assignments...\n');

    // Get all schools
    const schools = await sql`SELECT id, school_name FROM schools`;
    const schoolMap = {};
    schools.forEach(school => {
      schoolMap[school.school_name] = school.id;
    });

    console.log('📚 Available schools:');
    schools.forEach(s => console.log(`   - ${s.school_name}`));
    console.log('');

    // Get all stalls
    const stalls = await sql`
      SELECT s.id, s.stall_number, s.stall_name, sc.school_name as current_school
      FROM stalls s
      JOIN schools sc ON s.school_id = sc.id
      ORDER BY s.stall_number
    `;

    let updated = 0;
    let skipped = 0;

    for (const stall of stalls) {
      // Determine correct school
      let correctSchoolName;
      
      // Check special cases first
      if (specialCases[stall.stall_number]) {
        correctSchoolName = specialCases[stall.stall_number];
      } else {
        // Get prefix (e.g., 'CS' from 'CS-001')
        const prefix = stall.stall_number.split('-')[0];
        correctSchoolName = stallSchoolMapping[prefix];
      }

      if (!correctSchoolName) {
        console.log(`   ⚠️  Unknown prefix for ${stall.stall_number}, skipping...`);
        skipped++;
        continue;
      }

      const correctSchoolId = schoolMap[correctSchoolName];

      if (!correctSchoolId) {
        console.log(`   ❌ School not found: ${correctSchoolName} for ${stall.stall_number}`);
        skipped++;
        continue;
      }

      // Check if update is needed
      if (stall.current_school !== correctSchoolName) {
        await sql`
          UPDATE stalls 
          SET school_id = ${correctSchoolId}
          WHERE id = ${stall.id}
        `;
        
        console.log(`   ✓ Updated: ${stall.stall_number} ${stall.stall_name}`);
        console.log(`      ${stall.current_school} → ${correctSchoolName}`);
        updated++;
      } else {
        skipped++;
      }
    }

    console.log('\n═══════════════════════════════════════════');
    console.log(`✅ Update Complete`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log('═══════════════════════════════════════════\n');

    // Verify the changes
    console.log('🔍 Verification - Stalls by School:\n');
    const verification = await sql`
      SELECT 
        sc.school_name,
        COUNT(*) as stall_count,
        STRING_AGG(s.stall_number, ', ' ORDER BY s.stall_number) as stalls
      FROM stalls s
      JOIN schools sc ON s.school_id = sc.id
      GROUP BY sc.school_name
      ORDER BY sc.school_name
    `;

    verification.forEach(row => {
      console.log(`${row.school_name}:`);
      console.log(`   Count: ${row.stall_count}`);
      console.log(`   Stalls: ${row.stalls}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixStallSchools();
