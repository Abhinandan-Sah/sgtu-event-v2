import express from 'express';
const router = express.Router();
import adminController from '../controllers/admin.controller.js';
import { authenticateToken } from '../middleware/auth.js';

/**
 * Admin Routes
 * All routes require authentication except login
 */

// Public routes
router.post('/login', adminController.login);

// Protected routes (require authentication)
router.post('/logout', authenticateToken, adminController.logout);
router.get('/profile', authenticateToken, adminController.getProfile);
router.put('/profile', authenticateToken, adminController.updateProfile);
router.get('/students', authenticateToken, adminController.getAllStudents);
router.get('/volunteers', authenticateToken, adminController.getAllVolunteers);
router.get('/stalls', authenticateToken, adminController.getAllStalls);
router.get('/stats', authenticateToken, adminController.getStats);

// School ranking results (Category 2 - ADMIN ONLY)
router.get('/top-schools', authenticateToken, adminController.getTopSchools);
router.get('/top-stalls', authenticateToken, adminController.getTopStalls);

export default router;
