# Security Architecture - Role-Based Access Control (RBAC)

## Overview
This application uses a **two-layer security architecture** for all API routes:
1. **Authentication** - Validates JWT token
2. **Authorization** - Enforces role-based access control

---

## Authentication Flow

```
Client Request
     ↓
[authenticateToken Middleware]
     ↓
Token Valid? → YES → Extract req.user = { id, email, role }
             ↓ NO
        401/403 Error
     ↓
[authorizeRoles Middleware]
     ↓
Role Matches? → YES → Continue to Controller
              ↓ NO
         403 Error
```

---

## Middleware Architecture

### 1. `authenticateToken` - Token Validation Only
**Purpose:** Verifies JWT token is valid and not expired

**Does:**
- ✅ Checks token exists (cookie or header)
- ✅ Verifies signature with JWT_SECRET
- ✅ Checks expiration
- ✅ Extracts payload to `req.user`

**Does NOT:**
- ❌ Check user role
- ❌ Validate specific permissions

**Code:**
```javascript
export const authenticateToken = (req, res, next) => {
  // Priority 1: HTTP-Only cookie (web browsers)
  let token = getTokenFromCookie(req);
  
  // Priority 2: Authorization header (mobile/API clients)
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = decoded; // { id, email, role }
    next();
  });
};
```

---

### 2. `authorizeRoles` - Role-Based Authorization
**Purpose:** Enforces role-based access control

**Does:**
- ✅ Checks if `req.user.role` matches allowed roles
- ✅ Supports multiple roles
- ✅ Provides clear error messages

**Code:**
```javascript
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
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
```

---

## DRY Principle Implementation

### Router-Level Middleware (Recommended)

Instead of repeating middleware on every route:

❌ **Bad (Repetitive):**
```javascript
router.get('/profile', authenticateToken, authorizeRoles('ADMIN'), controller.getProfile);
router.get('/stats', authenticateToken, authorizeRoles('ADMIN'), controller.getStats);
router.get('/users', authenticateToken, authorizeRoles('ADMIN'), controller.getUsers);
```

✅ **Good (DRY):**
```javascript
// Public routes first
router.post('/login', controller.login);

// Apply middleware to all routes below
router.use(authenticateToken);
router.use(authorizeRoles('ADMIN'));

// All routes below are automatically protected
router.get('/profile', controller.getProfile);
router.get('/stats', controller.getStats);
router.get('/users', controller.getUsers);
```

---

## Route Security by Role

### 🔴 ADMIN Routes (`/api/admin/*`)
**Access:** ADMIN role only

```javascript
// admin.route.js
router.post('/login', adminController.login); // Public

router.use(authenticateToken);
router.use(authorizeRoles('ADMIN'));

router.get('/students', adminController.getAllStudents);
router.get('/volunteers', adminController.getAllVolunteers);
router.get('/stats', adminController.getStats);
router.get('/top-schools', adminController.getTopSchools);
```

**Endpoints:**
- GET `/api/admin/students` - View all students
- GET `/api/admin/volunteers` - View all volunteers
- GET `/api/admin/stalls` - View all stalls
- GET `/api/admin/stats` - System statistics
- GET `/api/admin/top-schools` - School rankings

---

### 🟢 STUDENT Routes (`/api/student/*`)
**Access:** STUDENT role only

```javascript
// student.route.js
router.post('/login', studentController.login); // Public
router.post('/register', studentController.register); // Public

router.use(authenticateToken);
router.use(authorizeRoles('STUDENT'));

router.get('/profile', studentController.getProfile);
router.get('/qr-code', studentController.getQRCode);
router.post('/scan-stall', studentController.scanStall);
router.post('/submit-feedback', studentController.submitFeedback);
```

**Endpoints:**
- GET `/api/student/profile` - Student's own profile
- GET `/api/student/qr-code` - Student's QR code for entry
- GET `/api/student/check-in-history` - Check-in/out history
- POST `/api/student/scan-stall` - Scan stall QR inside event
- POST `/api/student/submit-feedback` - Submit stall feedback
- GET `/api/student/my-school-stalls` - View own school's stalls
- POST `/api/student/submit-school-ranking` - Rank school stalls

---

### 🔵 VOLUNTEER Routes (`/api/volunteer/*`)
**Access:** VOLUNTEER role only

```javascript
// volunteer.route.js
router.post('/login', volunteerController.login); // Public
router.post('/register', volunteerController.register); // Public

router.use(authenticateToken);
router.use(authorizeRoles('VOLUNTEER'));

router.get('/profile', volunteerController.getProfile);
router.post('/scan/student', volunteerController.scanStudentQR);
router.post('/scan/stall', volunteerController.scanStallQR);
router.get('/history', volunteerController.getHistory);
```

**Endpoints:**
- GET `/api/volunteer/profile` - Volunteer's profile
- POST `/api/volunteer/scan/student` - Scan student QR for entry/exit
- POST `/api/volunteer/scan/stall` - Verify stall QR
- GET `/api/volunteer/history` - Scan history

---

## Critical Bug Fix: Volunteer Scanning

### ❌ The Original Bug

**Problem:** Volunteers couldn't scan student QR codes due to incorrect logic:

```javascript
// WRONG: Tried to find volunteer ID in students table
const loggedInStudent = await Student.findById(req.user.id, query);

if (!loggedInStudent) {
  return errorResponse(res, 'Only students can scan their own QR codes', 403);
}

if (loggedInStudent.qr_code_token !== qr_code_token) {
  return errorResponse(res, 'You can only scan your own QR code', 403);
}
```

**Why It Failed:**
1. `req.user.id` contains the **volunteer's ID** (from JWT)
2. Code tried to find a **student** with that volunteer ID
3. No student found → Always returned 403 error

---

### ✅ The Fix

**Correct Logic:** Volunteers scan ANY student's QR code

```javascript
// 1. Decode QR token to get student registration number
const decoded = await QRCodeService.verifyStudentQRToken(qr_code_token);

// 2. Find student using registration number from QR token
const student = await Student.findByRegistrationNo(decoded.registration_no, query);

// 3. Optional: Verify volunteer is active
const volunteer = await Volunteer.findById(req.user.id, query);
if (volunteer && !volunteer.is_active) {
  return errorResponse(res, 'Your volunteer account is inactive', 403);
}

// 4. Process check-in/out for the student
const action = student.is_inside_event ? 'EXIT' : 'ENTRY';
const updatedStudent = await Student.processCheckInOut(student.id, query);

// 5. Update volunteer's scan count
await query(
  'UPDATE volunteers SET total_scans_performed = total_scans_performed + 1 WHERE id = $1',
  [req.user.id]
);
```

**Key Insights:**
- ✅ JWT identifies the **volunteer** (who is scanning)
- ✅ QR token identifies the **student** (who is being scanned)
- ✅ No ownership check needed (volunteers scan others)
- ✅ Role check happens at middleware level

---

## Security Benefits

### 1. Defense in Depth
Multiple layers prevent unauthorized access:
```
Request → [Rate Limiter] → [authenticateToken] → [authorizeRoles] → [Controller]
```

### 2. Clear Separation of Concerns
- **authenticateToken**: "Who are you?"
- **authorizeRoles**: "Are you allowed here?"
- **Controller**: "What do you want to do?"

### 3. Scalability
Adding new roles or routes is simple:

```javascript
// Add new role
router.use(authenticateToken);
router.use(authorizeRoles('ADMIN', 'MANAGER')); // Multiple roles

// Add mixed-role endpoints
router.get('/reports', 
  authenticateToken, 
  authorizeRoles('ADMIN', 'VOLUNTEER'), 
  controller.getReports
);
```

### 4. Maintainability
- Single source of truth for auth logic
- No code duplication
- Easy to audit and test

---

## Testing Guide

### 1. Login as Different Roles

**Admin:**
```bash
POST /api/admin/login
{ "email": "admin@test.com", "password": "password" }
```

**Student:**
```bash
POST /api/student/login
{ "email": "student@test.com", "password": "password" }
```

**Volunteer:**
```bash
POST /api/volunteer/login
{ "email": "volunteer@test.com", "password": "password" }
```

---

### 2. Test Role Restrictions

**Try accessing admin endpoint with student token:**
```bash
GET /api/admin/students
Authorization: Bearer <student_token>

Expected: 403 Forbidden
Message: "Access denied. Required roles: ADMIN"
```

**Try accessing volunteer scan with admin token:**
```bash
POST /api/volunteer/scan/student
Authorization: Bearer <admin_token>

Expected: 403 Forbidden
Message: "Access denied. Required roles: VOLUNTEER"
```

---

### 3. Verify Volunteer Scanning

**Login as volunteer:**
```bash
POST /api/volunteer/login
{ "email": "volunteer@test.com", "password": "password" }
```

**Scan student QR:**
```bash
POST /api/volunteer/scan/student
Authorization: Bearer <volunteer_token>
{
  "qr_code_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Expected: 201 Created (ENTRY) or 200 OK (EXIT)
```

---

## Error Responses

| Status | Error | Cause | Solution |
|--------|-------|-------|----------|
| 401 | Access token required | No token provided | Login and include token |
| 403 | Invalid or expired token | Token signature/expiration failed | Login again |
| 403 | Access denied. Required roles: X | Wrong role | Use correct user type |
| 404 | Resource not found | Valid token, no data | Check database |

---

## Best Practices

### ✅ DO:
1. Use `router.use()` for role-specific routers
2. Keep public routes BEFORE `router.use(auth)`
3. Document which roles can access each endpoint
4. Use descriptive error messages
5. Log authentication failures

### ❌ DON'T:
1. Repeat middleware on every route
2. Check roles in controllers (do it in middleware)
3. Store sensitive data in JWT payload
4. Skip token verification for "admin" users
5. Use the same JWT_SECRET in dev and production

---

## Future Enhancements

### 1. Permission-Based Access Control
```javascript
// Instead of just roles, check specific permissions
router.get('/sensitive-data', 
  authenticateToken, 
  requirePermission('read:sensitive'), 
  controller.getSensitiveData
);
```

### 2. API Key Authentication
```javascript
// For service-to-service communication
router.post('/webhook', 
  authenticateAPIKey, 
  controller.handleWebhook
);
```

### 3. Rate Limiting by Role
```javascript
// Different limits for different roles
const adminLimiter = rateLimit({ max: 1000 });
const userLimiter = rateLimit({ max: 100 });

router.use((req, res, next) => {
  if (req.user?.role === 'ADMIN') return adminLimiter(req, res, next);
  return userLimiter(req, res, next);
});
```

---

## Summary

✅ **Two-layer security** (authentication + authorization)  
✅ **DRY principle** with router-level middleware  
✅ **Clear role separation** (ADMIN, STUDENT, VOLUNTEER)  
✅ **Scalable architecture** for adding new roles/routes  
✅ **Fixed critical bug** in volunteer scanning logic  
✅ **Production-ready** with proper error handling  

**The system is now secure, maintainable, and ready for production deployment.**
