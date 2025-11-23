/**
 * Student Seeder - Production-Ready with Fixed School Assignment
 * 
 * @description Seeds students with their specific schools (from Excel data)
 * @usage npm run seed
 * @category Seeder
 * @author SGTU Event Team
 * @version 3.0.0 (Excel Import Ready)
 * 
 * Features:
 * - Fixed school assignment (matches Excel data)
 * - Auto-generates JWT QR tokens during insert
 * - Production-ready token format (157 chars)
 * - Ready for Excel import pattern
 */

import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';
import QRCodeService from '../services/qrCode.js';

const students = [
  // School of Computing Sciences and Engineering (10 students)
  {
    full_name: 'Rahul Sharma',
    email: 'rahul.sharma@sgtu.ac.in',
    registration_no: '2024SGTU10001',
    phone: '9876543210',
    school_name: 'School of Computing Sciences and Engineering'
  },
  {
    full_name: 'Priya Patel',
    email: 'priya.patel@sgtu.ac.in',
    registration_no: '2024SGTU10002',
    phone: '9876543211',
    school_name: 'School of Computing Sciences and Engineering'
  },
  {
    full_name: 'Arjun Desai',
    email: 'arjun.desai@sgtu.ac.in',
    registration_no: '2024SGTU10003',
    phone: '9876543218',
    school_name: 'School of Computing Sciences and Engineering'
  },
  {
    full_name: 'Neha Agarwal',
    email: 'neha.agarwal@sgtu.ac.in',
    registration_no: '2024SGTU10004',
    phone: '9876543219',
    school_name: 'School of Computing Sciences and Engineering'
  },
  {
    full_name: 'Karan Malhotra',
    email: 'karan.malhotra@sgtu.ac.in',
    registration_no: '2024SGTU10005',
    phone: '9876543220',
    school_name: 'School of Computing Sciences and Engineering'
  },
  {
    full_name: 'Divya Nair',
    email: 'divya.nair@sgtu.ac.in',
    registration_no: '2024SGTU10006',
    phone: '9876543221',
    school_name: 'School of Computing Sciences and Engineering'
  },
  {
    full_name: 'Siddharth Joshi',
    email: 'siddharth.joshi@sgtu.ac.in',
    registration_no: '2024SGTU10007',
    phone: '9876543222',
    school_name: 'School of Computing Sciences and Engineering'
  },
  {
    full_name: 'Riya Shah',
    email: 'riya.shah@sgtu.ac.in',
    registration_no: '2024SGTU10008',
    phone: '9876543223',
    school_name: 'School of Computing Sciences and Engineering'
  },
  {
    full_name: 'Aditya Chopra',
    email: 'aditya.chopra@sgtu.ac.in',
    registration_no: '2024SGTU10009',
    phone: '9876543224',
    school_name: 'School of Computing Sciences and Engineering'
  },
  {
    full_name: 'Pooja Rao',
    email: 'pooja.rao@sgtu.ac.in',
    registration_no: '2024SGTU10010',
    phone: '9876543225',
    school_name: 'School of Computing Sciences and Engineering'
  },

  // School of Engineering (10 students)
  {
    full_name: 'Amit Kumar',
    email: 'amit.kumar@sgtu.ac.in',
    registration_no: '2024SGTU20001',
    phone: '9876543212',
    school_name: 'School of Engineering'
  },
  {
    full_name: 'Sneha Gupta',
    email: 'sneha.gupta@sgtu.ac.in',
    registration_no: '2024SGTU20002',
    phone: '9876543213',
    school_name: 'School of Engineering'
  },
  {
    full_name: 'Rajesh Yadav',
    email: 'rajesh.yadav@sgtu.ac.in',
    registration_no: '2024SGTU20003',
    phone: '9876543226',
    school_name: 'School of Engineering'
  },
  {
    full_name: 'Ananya Pillai',
    email: 'ananya.pillai@sgtu.ac.in',
    registration_no: '2024SGTU20004',
    phone: '9876543227',
    school_name: 'School of Engineering'
  },
  {
    full_name: 'Varun Kapoor',
    email: 'varun.kapoor@sgtu.ac.in',
    registration_no: '2024SGTU20005',
    phone: '9876543228',
    school_name: 'School of Engineering'
  },
  {
    full_name: 'Sakshi Reddy',
    email: 'sakshi.reddy@sgtu.ac.in',
    registration_no: '2024SGTU20006',
    phone: '9876543229',
    school_name: 'School of Engineering'
  },
  {
    full_name: 'Harsh Tiwari',
    email: 'harsh.tiwari@sgtu.ac.in',
    registration_no: '2024SGTU20007',
    phone: '9876543230',
    school_name: 'School of Engineering'
  },
  {
    full_name: 'Ishita Bhatt',
    email: 'ishita.bhatt@sgtu.ac.in',
    registration_no: '2024SGTU20008',
    phone: '9876543231',
    school_name: 'School of Engineering'
  },
  {
    full_name: 'Nikhil Pandey',
    email: 'nikhil.pandey@sgtu.ac.in',
    registration_no: '2024SGTU20009',
    phone: '9876543232',
    school_name: 'School of Engineering'
  },
  {
    full_name: 'Tanvi Mehta',
    email: 'tanvi.mehta@sgtu.ac.in',
    registration_no: '2024SGTU20010',
    phone: '9876543233',
    school_name: 'School of Engineering'
  },

  // School of Management (10 students)
  {
    full_name: 'Vikram Singh',
    email: 'vikram.singh@sgtu.ac.in',
    registration_no: '2024SGTU30001',
    phone: '9876543214',
    school_name: 'School of Management'
  },
  {
    full_name: 'Anjali Verma',
    email: 'anjali.verma@sgtu.ac.in',
    registration_no: '2024SGTU30002',
    phone: '9876543215',
    school_name: 'School of Management'
  },
  {
    full_name: 'Gaurav Saxena',
    email: 'gaurav.saxena@sgtu.ac.in',
    registration_no: '2024SGTU30003',
    phone: '9876543234',
    school_name: 'School of Management'
  },
  {
    full_name: 'Mansi Jain',
    email: 'mansi.jain@sgtu.ac.in',
    registration_no: '2024SGTU30004',
    phone: '9876543235',
    school_name: 'School of Management'
  },
  {
    full_name: 'Abhishek Dubey',
    email: 'abhishek.dubey@sgtu.ac.in',
    registration_no: '2024SGTU30005',
    phone: '9876543236',
    school_name: 'School of Management'
  },
  {
    full_name: 'Shreya Iyer',
    email: 'shreya.iyer@sgtu.ac.in',
    registration_no: '2024SGTU30006',
    phone: '9876543237',
    school_name: 'School of Management'
  },
  {
    full_name: 'Rohit Mishra',
    email: 'rohit.mishra@sgtu.ac.in',
    registration_no: '2024SGTU30007',
    phone: '9876543238',
    school_name: 'School of Management'
  },
  {
    full_name: 'Kriti Sharma',
    email: 'kriti.sharma@sgtu.ac.in',
    registration_no: '2024SGTU30008',
    phone: '9876543239',
    school_name: 'School of Management'
  },
  {
    full_name: 'Yash Bansal',
    email: 'yash.bansal@sgtu.ac.in',
    registration_no: '2024SGTU30009',
    phone: '9876543240',
    school_name: 'School of Management'
  },
  {
    full_name: 'Simran Kaur',
    email: 'simran.kaur@sgtu.ac.in',
    registration_no: '2024SGTU30010',
    phone: '9876543241',
    school_name: 'School of Management'
  },

  // School of Applied Sciences (10 students)
  {
    full_name: 'Rohan Mehta',
    email: 'rohan.mehta@sgtu.ac.in',
    registration_no: '2024SGTU40001',
    phone: '9876543216',
    school_name: 'School of Applied Sciences'
  },
  {
    full_name: 'Kavya Reddy',
    email: 'kavya.reddy@sgtu.ac.in',
    registration_no: '2024SGTU40002',
    phone: '9876543217',
    school_name: 'School of Applied Sciences'
  },
  {
    full_name: 'Akash Tripathi',
    email: 'akash.tripathi@sgtu.ac.in',
    registration_no: '2024SGTU40003',
    phone: '9876543242',
    school_name: 'School of Applied Sciences'
  },
  {
    full_name: 'Nidhi Srivastava',
    email: 'nidhi.srivastava@sgtu.ac.in',
    registration_no: '2024SGTU40004',
    phone: '9876543243',
    school_name: 'School of Applied Sciences'
  },
  {
    full_name: 'Vishal Khanna',
    email: 'vishal.khanna@sgtu.ac.in',
    registration_no: '2024SGTU40005',
    phone: '9876543244',
    school_name: 'School of Applied Sciences'
  },
  {
    full_name: 'Aditi Menon',
    email: 'aditi.menon@sgtu.ac.in',
    registration_no: '2024SGTU40006',
    phone: '9876543245',
    school_name: 'School of Applied Sciences'
  },
  {
    full_name: 'Pranav Bose',
    email: 'pranav.bose@sgtu.ac.in',
    registration_no: '2024SGTU40007',
    phone: '9876543246',
    school_name: 'School of Applied Sciences'
  },
  {
    full_name: 'Megha Chatterjee',
    email: 'megha.chatterjee@sgtu.ac.in',
    registration_no: '2024SGTU40008',
    phone: '9876543247',
    school_name: 'School of Applied Sciences'
  },
  {
    full_name: 'Kunal Das',
    email: 'kunal.das@sgtu.ac.in',
    registration_no: '2024SGTU40009',
    phone: '9876543248',
    school_name: 'School of Applied Sciences'
  },
  {
    full_name: 'Swati Ghosh',
    email: 'swati.ghosh@sgtu.ac.in',
    registration_no: '2024SGTU40010',
    phone: '9876543249',
    school_name: 'School of Applied Sciences'
  },

  // School of Pharmacy (10 students)
  {
    full_name: 'Deepak Chauhan',
    email: 'deepak.chauhan@sgtu.ac.in',
    registration_no: '2024SGTU50001',
    phone: '9876543250',
    school_name: 'School of Pharmacy'
  },
  {
    full_name: 'Ayesha Khan',
    email: 'ayesha.khan@sgtu.ac.in',
    registration_no: '2024SGTU50002',
    phone: '9876543251',
    school_name: 'School of Pharmacy'
  },
  {
    full_name: 'Rahul Bhardwaj',
    email: 'rahul.bhardwaj@sgtu.ac.in',
    registration_no: '2024SGTU50003',
    phone: '9876543252',
    school_name: 'School of Pharmacy'
  },
  {
    full_name: 'Pallavi Kulkarni',
    email: 'pallavi.kulkarni@sgtu.ac.in',
    registration_no: '2024SGTU50004',
    phone: '9876543253',
    school_name: 'School of Pharmacy'
  },
  {
    full_name: 'Sanjay Rathore',
    email: 'sanjay.rathore@sgtu.ac.in',
    registration_no: '2024SGTU50005',
    phone: '9876543254',
    school_name: 'School of Pharmacy'
  },
  {
    full_name: 'Ritika Sinha',
    email: 'ritika.sinha@sgtu.ac.in',
    registration_no: '2024SGTU50006',
    phone: '9876543255',
    school_name: 'School of Pharmacy'
  },
  {
    full_name: 'Aryan Patel',
    email: 'aryan.patel@sgtu.ac.in',
    registration_no: '2024SGTU50007',
    phone: '9876543256',
    school_name: 'School of Pharmacy'
  },
  {
    full_name: 'Nikita Rane',
    email: 'nikita.rane@sgtu.ac.in',
    registration_no: '2024SGTU50008',
    phone: '9876543257',
    school_name: 'School of Pharmacy'
  },
  {
    full_name: 'Vivek Jha',
    email: 'vivek.jha@sgtu.ac.in',
    registration_no: '2024SGTU50009',
    phone: '9876543258',
    school_name: 'School of Pharmacy'
  },
  {
    full_name: 'Sonali Deshmukh',
    email: 'sonali.deshmukh@sgtu.ac.in',
    registration_no: '2024SGTU50010',
    phone: '9876543259',
    school_name: 'School of Pharmacy'
  },

  // Test accounts
  {
    full_name: 'Test Student',
    email: 'test@sgtu.ac.in',
    registration_no: '2024SGTU99999',
    phone: '9999999999',
    school_name: 'School of Computing Sciences and Engineering'
  },
  {
    full_name: 'Demo User',
    email: 'demo@sgtu.ac.in',
    registration_no: '2024SGTU00000',
    phone: '0000000000',
    school_name: 'School of Management'
  }
];

export async function seedStudents(schools) {
  console.log('👨‍🎓 Seeding students with fixed school assignments...');
  
  if (!schools || schools.length === 0) {
    console.log('   ⏭  Skipped: No schools found\n');
    return;
  }

  // Create a map of school names to IDs for quick lookup
  const schoolMap = {};
  schools.forEach(school => {
    schoolMap[school.school_name] = school.id;
  });

  const password = 'student123';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const student of students) {
    // Get the school ID from the school name
    const school_id = schoolMap[student.school_name];
    
    if (!school_id) {
      console.error(`   ✗ Failed: ${student.full_name} - School "${student.school_name}" not found`);
      failed++;
      continue;
    }

    try {
      // Generate production-ready QR token (JWT format, 157 chars)
      const qrToken = QRCodeService.generateStudentQRToken({
        registration_no: student.registration_no
      });
      
      const insertQuery = `
        INSERT INTO students (
          registration_no, email, password_hash, full_name, 
          school_id, phone, qr_code_token
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (registration_no) DO NOTHING
        RETURNING id, email, registration_no
      `;
      
      const result = await query(insertQuery, [
        student.registration_no,
        student.email,
        hashedPassword,
        student.full_name,
        school_id,
        student.phone,
        qrToken
      ]);
      
      if (result.length > 0) {
        console.log(`   ✓ Created: ${student.full_name} (${student.school_name})`);
        created++;
      } else {
        skipped++;
        console.log(`   ⏭  Skipped: ${student.registration_no} (already exists)`);
      }
    } catch (error) {
      failed++;
      console.error(`   ✗ Failed: ${student.email} - ${error.message}`);
    }
  }

  console.log(`   ✅ Students: ${created} created, ${skipped} skipped, ${failed} failed\n`);
}

export default seedStudents;
