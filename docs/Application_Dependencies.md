# Application Dependencies Analysis (TODO 9)

This document identifies all runtime requirements for containerizing CampusConnect.

---

## Frontend — React Application

### Build Dependencies
| Dependency | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime for build process |
| Vite | ^8.0.12 | Build tool and dev server |
| @vitejs/plugin-react | ^6.0.1 | React support for Vite |
| ESLint + plugins | ^10.3.0 | Code linting (dev only) |

### Runtime Dependencies
| Dependency | Version | Purpose |
|-----------|---------|---------|
| react | ^19.2.6 | UI library |
| react-dom | ^19.2.6 | DOM rendering |
| react-router-dom | ^7.17.0 | Client-side routing |
| axios | ^1.18.0 | HTTP client for API calls |

### Runtime Environment
| Requirement | Value |
|------------|-------|
| Web server | Nginx (to serve static build output) |
| Build output | `dist/` directory (HTML, JS, CSS) |
| API proxy | Nginx reverse proxy `/api` → backend:5000 |

---

## Backend — Express API Server

### Runtime Dependencies
| Dependency | Version | Purpose |
|-----------|---------|---------|
| express | ^4.18.2 | Web framework |
| mongoose | ^7.3.1 | MongoDB ODM |
| bcrypt | ^6.0.0 | Password hashing |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| cors | ^2.8.5 | Cross-origin resource sharing |
| dotenv | ^16.0.3 | Environment variable loading |

### Dev Dependencies (not needed in container)
| Dependency | Version | Purpose |
|-----------|---------|---------|
| nodemon | ^3.0.1 | Auto-restart in development |

### Runtime Environment
| Requirement | Value |
|------------|-------|
| Node.js | 18+ LTS |
| Port | 5000 (configurable via `PORT` env var) |
| Environment variables | `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV` |

---

## Database — MongoDB

### Requirements
| Requirement | Value |
|------------|-------|
| MongoDB version | 7.0+ |
| Default port | 27017 |
| Database name | `campusconnect` |
| Authentication | Optional (configured via env vars) |
| Data persistence | Docker volume required |

### Environment Variables
| Variable | Purpose |
|----------|---------|
| `MONGO_INITDB_ROOT_USERNAME` | Root admin username |
| `MONGO_INITDB_ROOT_PASSWORD` | Root admin password |
| `MONGO_INITDB_DATABASE` | Initial database name |

---

## Container Communication Map

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend      │     │    Backend       │     │    MongoDB       │
│  (Nginx:80)      │────▶│  (Node:5000)     │────▶│  (Mongo:27017)   │
│                  │/api │                  │     │                  │
│  Static files    │     │  Express API     │     │  Data storage    │
│  Reverse proxy   │     │  JWT Auth        │     │  Persistent vol  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲
         │
    Port 3000 (host)
```
