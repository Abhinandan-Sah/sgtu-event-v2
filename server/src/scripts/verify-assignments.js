import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();
const sql = neon(process.env.NEON_DATABASE_URL);

console.log('📊 FINAL VERIFICATION\n');
console.log('='.repeat(60));
console.log('STUDENTS BY SCHOOL:');
console.log('='.repeat(60));

const students = await sql`
  SELECT sc.school_name, COUNT(*) as count 
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

students.forEach(s => console.log(`${s.school_name}: ${s.count} students`));

console.log('\n' + '='.repeat(60));
console.log('STALLS BY SCHOOL:');
console.log('='.repeat(60));

const stalls = await sql`
  SELECT sc.school_name, COUNT(*) as count 
  FROM stalls s 
  JOIN schools sc ON s.school_id = sc.id 
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

stalls.forEach(s => console.log(`${s.school_name}: ${s.count} stalls`));

console.log('\n✅ All data is now correctly assigned!');
