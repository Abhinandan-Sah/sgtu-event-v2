/**
 * Fix Student School Assignments
 * Updates existing students with their correct schools based on registration numbers
 */

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

const sql = neon(process.env.NEON_DATABASE_URL);

// Student registration number ranges to schools
const registrationSchoolMapping = {
  '10': 'School of Computing Sciences and Engineering', // 2024SGTU10xxx
  '20': 'School of Engineering',                        // 2024SGTU20xxx
  '30': 'School of Management',                         // 2024SGTU30xxx
  '40': 'School of Applied Sciences',                   // 2024SGTU40xxx
  '50': 'School of Pharmacy'                            // 2024SGTU50xxx
};

async function fixStudentSchools() {
  try {
    console.log('🔧 Fixing student school assignments...\n');

    // Get all schools
    const schools = await sql`SELECT id, school_name FROM schools WHERE school_name IN (
      'School of Computing Sciences and Engineering',
      'School of Engineering',
      'School of Management',
      'School of Applied Sciences',
      'School of Pharmacy'
    )`;
    
    const schoolMap = {};
    schools.forEach(school => {
      schoolMap[school.school_name] = school.id;
    });

    console.log('📚 Available schools:');
    schools.forEach(s => console.log(`   - ${s.school_name}`));
    console.log('');

    // Get all students
    const students = await sql`
      SELECT st.id, st.registration_no, st.full_name, sc.school_name as current_school
      FROM students st
      JOIN schools sc ON st.school_id = sc.id
      ORDER BY st.registration_no
    `;

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const student of students) {
      // Extract school code from registration number (e.g., '10' from '2024SGTU10001')
      const match = student.registration_no.match(/2024SGTU(\d{2})/);
      
      if (!match) {
        console.log(`   ⚠️  Invalid registration format: ${student.registration_no}`);
        errors++;
        continue;
      }

      const schoolCode = match[1];
      const correctSchoolName = registrationSchoolMapping[schoolCode];

      if (!correctSchoolName) {
        console.log(`   ⚠️  Unknown school code ${schoolCode} for ${student.registration_no}`);
        errors++;
        continue;
      }

      const correctSchoolId = schoolMap[correctSchoolName];

      if (!correctSchoolId) {
        console.log(`   ❌ School not found: ${correctSchoolName}`);
        errors++;
        continue;
      }

      // Check if update is needed
      if (student.current_school !== correctSchoolName) {
        await sql`
          UPDATE students 
          SET school_id = ${correctSchoolId}
          WHERE id = ${student.id}
        `;
        
        console.log(`   ✓ Updated: ${student.registration_no} ${student.full_name}`);
        console.log(`      ${student.current_school} → ${correctSchoolName}`);
        updated++;
      } else {
        skipped++;
      }
    }

    console.log('\n═══════════════════════════════════════════');
    console.log(`✅ Update Complete`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors: ${errors}`);
    console.log('═══════════════════════════════════════════\n');

    // Verify the changes
    console.log('🔍 Verification - Students by School:\n');
    const verification = await sql`
      SELECT 
        sc.school_name,
        COUNT(*) as student_count,
        STRING_AGG(st.registration_no, ', ' ORDER BY st.registration_no) as students
      FROM students st
      JOIN schools sc ON st.school_id = sc.id
      WHERE sc.school_name IN (
        'School of Computing Sciences and Engineering',
        'School of Engineering',
        'School of Management',
        'School of Applied Sciences',
        'School of Pharmacy'
      )
      GROUP BY sc.school_name
      ORDER BY sc.school_name
    `;

    verification.forEach(row => {
      console.log(`${row.school_name}:`);
      console.log(`   Count: ${row.student_count}`);
      console.log(`   Students: ${row.students}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixStudentSchools();
