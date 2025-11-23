import express from 'express';
const router = express.Router();
import volunteerController from '../controllers/volunteer.controller.js';
import { authenticateToken } from '../middleware/auth.js';

/**
 * Volunteer Routes
 * Mix of public (login, register) and protected routes
 */

// Public routes
router.post('/login', volunteerController.login);
router.post('/register', volunteerController.register);

// Protected routes (require authentication)
router.post('/logout', authenticateToken, volunteerController.logout);
router.get('/profile', authenticateToken, volunteerController.getProfile);

// ✨ Smart QR scanning - Auto-detects entry/exit
router.post('/scan/student', authenticateToken, volunteerController.scanStudentQR);
router.post('/scan/stall', authenticateToken, volunteerController.scanStallQR);

// History route
router.get('/history', authenticateToken, volunteerController.getHistory);

export default router;
