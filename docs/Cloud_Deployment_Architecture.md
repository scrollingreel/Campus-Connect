# Cloud Deployment Architecture — CampusConnect (TODO 17)

## Architecture Overview

CampusConnect uses a three-tier cloud deployment architecture where each layer is hosted independently on a purpose-built cloud platform:

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET                                  │
└────────────┬───────────────────────────────────┬─────────────────┘
             │                                   │
             ▼                                   ▼
┌─────────────────────┐              ┌─────────────────────┐
│   VERCEL             │              │   Students /         │
│   (Frontend Hosting) │              │   Faculty            │
│                      │              │   Browsers           │
│   React SPA          │              └─────────────────────┘
│   Static CDN         │
│   Auto HTTPS         │
│   Global Edge        │
└──────────┬───────────┘
           │ HTTPS API calls
           │ VITE_API_URL=https://campusconnect-api.railway.app/api
           ▼
┌─────────────────────┐
│   RAILWAY            │
│   (Backend Hosting)  │
│                      │
│   Express API        │
│   Node.js Runtime    │
│   JWT Auth           │
│   Auto Deploy        │
└──────────┬───────────┘
           │ MongoDB connection string
           │ MONGO_URI=mongodb+srv://...
           ▼
┌─────────────────────┐
│   MONGODB ATLAS      │
│   (Database Hosting) │
│                      │
│   M0 Free Cluster    │
│   Auto Backups       │
│   Network Whitelist  │
│   Encrypted Storage  │
└─────────────────────┘
```

---

## Platform Selection Rationale

### Frontend: Vercel
| Feature | Benefit |
|---------|---------|
| Zero-config React/Vite deployment | Auto-detects framework and builds |
| Global CDN | Low latency for users worldwide |
| Free HTTPS | Automatic SSL certificate provisioning |
| Preview deployments | Every git push creates a preview URL |
| Environment variables | Secure configuration management |
| SPA routing support | `vercel.json` rewrites handle React Router |

### Backend: Railway
| Feature | Benefit |
|---------|---------|
| Node.js auto-detection | Nixpacks builder detects Express app |
| Persistent deployment | Always-on server (not serverless) |
| Health checks | Auto-restart on failure |
| Environment variables | Secure secrets management |
| Automatic HTTPS | SSL termination built-in |
| GitHub integration | Auto-deploy on push |

### Database: MongoDB Atlas
| Feature | Benefit |
|---------|---------|
| M0 free tier | 512 MB storage, no cost |
| Managed backups | Automatic daily snapshots |
| Network whitelist | IP-based access control |
| Connection encryption | TLS/SSL by default |
| Monitoring dashboard | Query performance insights |
| Multi-region | Deploy close to Railway server |

---

## Data Flow

```mermaid
sequenceDiagram
    participant U as User Browser
    participant V as Vercel (Frontend)
    participant R as Railway (Backend)
    participant M as MongoDB Atlas

    U->>V: GET https://campusconnect.vercel.app
    V-->>U: Serve React SPA (HTML/JS/CSS)
    
    U->>R: POST /api/auth/login {email, password}
    R->>M: db.users.findOne({email})
    M-->>R: User document
    R->>R: bcrypt.compare(password, hash)
    R->>R: jwt.sign(payload, secret)
    R-->>U: {token, user}
    
    U->>R: GET /api/tasks (Authorization: Bearer token)
    R->>R: jwt.verify(token, secret)
    R->>M: db.tasks.find().populate('assignedUser')
    M-->>R: Task documents
    R-->>U: {tasks: [...]}
```

---

## Security Architecture

| Layer | Security Measure |
|-------|-----------------|
| Frontend → Backend | HTTPS encryption, CORS whitelist |
| Backend → Database | MongoDB connection string with credentials, IP whitelist |
| Authentication | JWT tokens (7-day expiry), bcrypt password hashing |
| Environment | Secrets stored in platform env vars, never in code |
| Network | MongoDB Atlas IP whitelist, Railway firewall |

---

## Environment Variables by Platform

### Vercel (Frontend)
| Variable | Example Value |
|----------|---------------|
| `VITE_API_URL` | `https://campusconnect-api.up.railway.app/api` |

### Railway (Backend)
| Variable | Example Value |
|----------|---------------|
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/campusconnect` |
| `JWT_SECRET` | `<strong-random-secret>` |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://campusconnect.vercel.app` |

### MongoDB Atlas
| Setting | Value |
|---------|-------|
| Cluster tier | M0 (Free) |
| Region | Same as Railway (e.g., US-East) |
| Database user | `campusconnect_app` |
| Network access | `0.0.0.0/0` (allow all) or Railway's IP |
