# Role-Based Access Control (RBAC) Design (TODO 7)

This design document outlines the future Role-Based Access Control (RBAC) model for the **CampusConnect** platform, categorizing permissions for **Students**, **Faculty Members**, and **Administrators**.

---

## 1. Access Control Roles

We define three core roles in the system:

1. **Student**: Regular campus users who manage their personal task trackers and view announcements.
2. **Faculty Member**: Teachers and advisors who can publish announcements and assign tasks to students.
3. **Administrator**: Platform superusers who manage accounts, configure roles, and audit system logs.

---

## 2. Resource & Permission Matrix

| Resource | Action / Endpoint | Student | Faculty Member | Administrator |
|---|---|---|---|---|
| **Announcements** | Create / Edit / Delete | ❌ Denied |  Allowed |  Allowed |
| | Read / View |  Allowed |  Allowed |  Allowed |
| **Tasks** | Create Tasks |  Allowed (Self) |  Allowed (Any) |  Allowed (Any) |
| | Read Tasks |  Allowed (Self) |  Allowed (All) |  Allowed (All) |
| | Update Status |  Allowed (Self) |  Allowed (All) |  Allowed (All) |
| | Delete Tasks |  Allowed (Self) |  Allowed (All) |  Allowed (All) |
| **User Profiles** | Read Own Profile |  Allowed |  Allowed |  Allowed |
| | Update Own Profile |  Allowed |  Allowed |  Allowed |
| | Read All Profiles | ❌ Denied |  Allowed |  Allowed |
| | Delete Users | ❌ Denied | ❌ Denied |  Allowed |

---

## 3. Implementation Design Pattern

To support these roles, we will extend our Express authentication middleware to include authorization filters.

### Proposed Backend Middleware: `authorize`
```javascript
/**
 * Express middleware to verify user roles.
 * Must be executed after the protect middleware (which attaches req.user).
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role (${req.user.role}) is unauthorized to access this resource.` 
      });
    }
    
    next();
  };
};

module.exports = authorize;
```

### Proposed Endpoint Routing
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Only Faculty and Admins can create announcements
router.post('/announcements', protect, authorize('faculty', 'admin'), createAnnouncement);

// Only Admins can delete user profiles
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
```
