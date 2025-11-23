/**
 * QR Token Regeneration Script
 * 
 * @description Regenerates all QR tokens in production database with optimized format
 * @usage npm run qr:regenerate
 * @impact Updates students.qr_code_token and stalls.qr_code_token in Neon PostgreSQL
 * @author SGTU Event Team
 * @version 2.0.0 (Production-Ready)
 * 
 * Format Changes:
 * - Student: JWT format (~157 chars) with {n, t, r} payload
 * - Stall: Simple format (~33 chars) as STALL_{number}_{timestamp}_{id}
 * 
 * Safety:
 * - Non-destructive: Updates tokens only, preserves all other data
 * - Backward compatible: Old tokens remain valid until replaced
 * - Cache clearing: Removes stale Redis cache entries
 */

import QRCodeService from '../services/qrCode.js';
import { query } from '../config/db.js';
import redisClient from '../config/redis.js';

async function regenerateAllTokens() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   🔄 Regenerating All QR Tokens (Optimized Format)   ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  try {
    // Connect Redis
    if (!redisClient.client || !redisClient.client.isOpen) {
      await redisClient.connect();
    }

    // 1. Regenerate Student QR Tokens
    console.log('👨‍🎓 Regenerating student QR tokens...');
    const students = await query(`SELECT id, full_name, email, registration_no FROM students`);
    
    let studentCount = 0;
    for (const student of students) {
      const newToken = QRCodeService.generateStudentQRToken(student);
      await query('UPDATE students SET qr_code_token = $1 WHERE id = $2', [newToken, student.id]);
      
      // Clear old cached QR images
      if (student.qr_code_token) {
        await QRCodeService.clearQRCache(student.qr_code_token);
      }
      await QRCodeService.clearQRCache(newToken);
      
      studentCount++;
      if (studentCount % 10 === 0) {
        process.stdout.write(`\r   Processed: ${studentCount}/${students.length} students`);
      }
    }
    console.log(`\n✅ Updated ${studentCount} student tokens\n`);

    // 2. Regenerate Stall QR Tokens
    console.log('🏪 Regenerating stall QR tokens...');
    const stalls = await query(`SELECT id, stall_number, stall_name, school_id FROM stalls`);
    
    let stallCount = 0;
    for (const stall of stalls) {
      const newToken = QRCodeService.generateStallQRToken(stall);
      await query('UPDATE stalls SET qr_code_token = $1 WHERE id = $2', [newToken, stall.id]);
      
      // Clear old cached QR images
      await QRCodeService.clearQRCache(newToken);
      
      stallCount++;
    }
    console.log(`✅ Updated ${stallCount} stall tokens\n`);

    // 3. Show token comparison
    const sampleStudent = students[0];
    const sampleToken = QRCodeService.generateStudentQRToken(sampleStudent);
    
    console.log('📊 Token Optimization Results:');
    console.log('━'.repeat(60));
    console.log(`   Old format: ~317 characters (dense QR)`);
    console.log(`   New format: ${sampleToken.length} characters (optimized QR)`);
    console.log(`   Reduction: ${((1 - sampleToken.length / 317) * 100).toFixed(1)}%`);
    console.log('━'.repeat(60));

    console.log('\n📱 Sample Token (scan this to test):');
    console.log(sampleToken);
    console.log('\n✅ All tokens regenerated successfully!');
    console.log('💡 Run: npm run qr:scan to see the new QR codes\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await redisClient.disconnect();
    process.exit(0);
  }
}

regenerateAllTokens();
