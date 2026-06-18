# Architecture Review — CampusConnect (TODO 1)

This document reviews the existing CampusConnect application and identifies areas for improvement across folder organization, configuration management, error handling, and maintainability.

---

## 1. Folder Organization Issues

### Backend (`server/`)
| Issue | Current State | Recommendation |
|-------|--------------|----------------|
| No controllers directory | All business logic (DB queries, bcrypt hashing, JWT signing) is embedded directly inside route files | Extract controller functions into a `controllers/` directory |
| No config module | Configuration values are read from `process.env` in scattered locations | Create a centralized `config/index.js` module |
| No utilities directory | No shared helper functions for responses, errors, or logging | Create a `utils/` directory with reusable modules |
| Inline error handling | Each route handler has its own `try/catch` with inconsistent error responses | Create centralized error handler middleware |

**Current backend structure:**
```
server/
├── index.js          ← Entry point + DB connection + error handler
├── middleware/        ← Only auth middleware
├── models/           ← Mongoose schemas
├── routes/           ← Routes + controller logic combined
└── .env
```

### Frontend (`client/src/`)
| Issue | Current State | Recommendation |
|-------|--------------|----------------|
| No state management layer | Auth state managed with `useState` in `App.jsx`, passed via prop drilling | Create a React Context for auth state |
| No service layer | API calls made directly from page components | Create a `services/` directory to wrap API calls with error normalization |
| Monolithic Dashboard | `Dashboard.jsx` is 430+ lines with heavy inline styling | Consider breaking into smaller sub-components |

---

## 2. Hardcoded Configurations

| Location | Hardcoded Value | Risk |
|----------|----------------|------|
| `server/index.js` line 24 | MongoDB fallback URI: `mongodb://localhost:27017/campusconnect` | Not configurable per environment |
| `server/routes/auth.js` line 7 | `SALT_ROUNDS = 10` | Should be configurable |
| `server/routes/auth.js` line 14 | `{ expiresIn: '7d' }` JWT expiry | Should come from environment |
| `server/middleware/auth.js` line 17 | `process.env.JWT_SECRET` read directly | Should use centralized config |
| `client/src/api.js` line 8 | `baseURL: '/api'` | Works with Vite proxy but not in production without reverse proxy |

---

## 3. Error Handling Inconsistencies

| Route File | Error Pattern | Issue |
|------------|--------------|-------|
| `routes/auth.js` | Catches `ValidationError` specifically, returns 400; others get 500 | Good but not centralized |
| `routes/users.js` | Same pattern but different error messages | Duplicated logic |
| `routes/tasks.js` | Same duplicated pattern | Duplicated logic |
| `routes/announcements.js` | No error handling at all (static data) | Missing |
| `index.js` | Generic 500 handler | Doesn't distinguish error types |

**Key problems:**
- Mongoose `CastError` (invalid ObjectId) is not handled — returns generic 500
- JWT errors in middleware are handled differently than in routes
- Duplicate key errors (MongoDB 11000) are not consistently caught
- No structured error class — errors are constructed ad-hoc

---

## 4. Maintainability Improvements

### Missing Logging Infrastructure
- Only a basic request logger exists (timestamp + method + URL)
- No logging for: registration events, login attempts, failed authentications, DB errors
- No log levels (info, warn, error)
- Debugging production issues would be extremely difficult

### Inconsistent Export Patterns
- `middleware/auth.js` uses named export: `module.exports = { protect }`
- `middleware/authorize.js` uses default export: `module.exports = authorize`
- This inconsistency confuses new developers

### No `.env.example` File
- New team members have no reference for required environment variables
- They must read source code to discover what's needed

### Server Not Exported
- `app.listen()` is called directly in `index.js`
- The Express `app` instance cannot be imported for integration testing

---

## 5. Recommended Architecture

### Backend
```
server/
├── config/
│   └── index.js              ← Centralized environment config
├── controllers/
│   ├── authController.js     ← Auth business logic
│   ├── userController.js     ← User CRUD logic
│   ├── taskController.js     ← Task CRUD logic
│   └── announcementController.js
├── middleware/
│   ├── auth.js               ← JWT verification
│   ├── authorize.js          ← Role-based access
│   └── errorHandler.js       ← Centralized error handling
├── models/
│   ├── User.js
│   └── Task.js
├── routes/
│   ├── auth.js               ← Slim routing definitions only
│   ├── users.js
│   ├── tasks.js
│   └── announcements.js
├── utils/
│   ├── apiResponse.js        ← Standardized response helpers
│   ├── AppError.js           ← Custom error class
│   └── logger.js             ← Structured logging
├── .env
├── .env.example
└── index.js
```

### Frontend
```
client/src/
├── components/               ← Reusable UI components
├── context/
│   └── AuthContext.jsx        ← Auth state via React Context
├── pages/                     ← Page-level components
├── services/
│   ├── authService.js         ← Auth API wrappers
│   ├── taskService.js         ← Task API wrappers
│   └── userService.js         ← User API wrappers
├── utils/
│   └── dataProcessor.js       ← Data processing helpers
├── api.js                     ← Axios instance + interceptors
├── App.jsx
├── main.jsx
└── index.css
```
