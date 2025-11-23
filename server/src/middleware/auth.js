import jwt from 'jsonwebtoken';
import { getTokenFromCookie } from '../helpers/cookie.js';

/**
 * Authentication Middleware
 * Verifies JWT token from cookies (primary) or Authorization header (fallback)
 * Supports dual authentication for web browsers and mobile apps
 */

/**
 * Authenticate JWT token from HTTP-Only cookie or Authorization header
 * @middleware
 * @description Primary: HTTP-Only cookie (secure), Fallback: Authorization header (mobile/Postman)
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Priority 1: Get token from HTTP-Only cookie (more secure)
    let token = getTokenFromCookie(req);
    
    // Priority 2: Fallback to Authorization header (for mobile apps, Postman)
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      // Attach user data to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

/**
 * Authorize specific roles
 * @param {string[]} roles - Allowed roles
 * @returns {Function} Middleware function
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 * @middleware
 */
export const optionalAuth = (req, res, next) => {
  try {
    // Try cookie first
    let token = getTokenFromCookie(req);
    
    // Fallback to Authorization header
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1];
    }

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err) {
          req.user = decoded;
        }
      });
    }

    next();
  } catch (error) {
    next();
  }
};

export default {
  authenticateToken,
  authorizeRoles,
  optionalAuth
};
