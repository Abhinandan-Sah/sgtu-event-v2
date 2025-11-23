// School Seeder - Seeds initial school data
import { query } from '../config/db.js';

const schools = [
  {
    school_name: 'School of Computing Sciences and Engineering',
    description: 'Computer Science, AI, Cybersecurity, Software Engineering programs. Located in Block A'
  },
  {
    school_name: 'School of Engineering',
    description: 'Mechanical, Electrical, Civil Engineering programs. Located in Block B'
  },
  {
    school_name: 'School of Management',
    description: 'Business Administration, Marketing, Finance, HR programs. Located in Block C'
  },
  {
    school_name: 'School of Applied Sciences',
    description: 'Physics, Chemistry, Mathematics, Biotechnology programs. Located in Block D'
  },
  {
    school_name: 'School of Pharmacy',
    description: 'Pharmaceutical Sciences, Pharmacology, Drug Development programs. Located in Block E'
  }
];

export async function seedSchools() {
  console.log('📚 Seeding schools...');
  
  const seededSchools = [];
  let created = 0;
  let skipped = 0;

  for (const school of schools) {
    try {
      const insertQuery = `
        INSERT INTO schools (school_name, description)
        VALUES ($1, $2)
        ON CONFLICT (school_name) DO NOTHING
        RETURNING *
      `;
      
      const result = await query(insertQuery, [
        school.school_name,
        school.description
      ]);
      
      if (result.length > 0) {
        seededSchools.push(result[0]);
        console.log(`   ✓ Created: ${school.school_name}`);
        created++;
      } else {
        skipped++;
        console.log(`   ⏭  Skipped: ${school.school_name} (already exists)`);
      }
    } catch (error) {
      console.error(`   ✗ Failed: ${school.school_name} - ${error.message}`);
    }
  }

  console.log(`   ✅ Schools: ${created} created, ${skipped} skipped\n`);
  
  // Return all schools for use by other seeders
  const allSchools = await query('SELECT * FROM schools ORDER BY school_name');
  return allSchools;
}

export default seedSchools;
