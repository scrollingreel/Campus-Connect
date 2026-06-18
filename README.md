# CampusConnect — Student Activity Management Portal

A full-stack MERN application for managing student activities, tasks, and announcements across university campuses.

## 🏗️ Architecture

```
Frontend (React + Vite)  →  Backend (Express + Node.js)  →  Database (MongoDB)
      Vercel                      Railway                    MongoDB Atlas
```

## 📁 Project Structure

```
CampusConnect/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React Context (AuthContext)
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service wrappers
│   │   ├── utils/              # Utility functions
│   │   ├── api.js              # Centralized Axios instance
│   │   └── App.jsx             # Root component
│   ├── Dockerfile              # Frontend container config
│   ├── nginx.conf              # Production Nginx config
│   └── vercel.json             # Vercel deployment config
├── server/                     # Express Backend
│   ├── config/                 # Centralized configuration
│   ├── controllers/            # Route handlers (business logic)
│   ├── middleware/             # Auth, authorize, error handler
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Slim route definitions
│   ├── utils/                  # Logger, AppError, API response
│   ├── tests/                  # Security verification tests
│   ├── Dockerfile              # Backend container config
│   └── railway.json            # Railway deployment config
├── docs/                       # Project documentation
├── docker-compose.yml          # Full-stack Docker orchestration
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/CampusConnect.git
cd CampusConnect

# 2. Setup backend
cd server
cp .env.example .env          # Configure environment variables
npm install
npm run dev                    # Starts on http://localhost:5000

# 3. Setup frontend (new terminal)
cd client
npm install
npm run dev                    # Starts on http://localhost:5173
```

### Docker Deployment

```bash
docker compose up --build -d
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# MongoDB:  localhost:27017
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: 7-day token expiry, signed with secret key
- **Route Protection**: `protect` middleware verifies JWT on all sensitive endpoints
- **Role-Based Access**: `authorize` middleware restricts actions by role (student/faculty/admin)
- **CORS Whitelist**: Production CORS only allows the deployed frontend origin
- **No Password Leaks**: `.select('-password')` on all user queries

## ☁️ Cloud Deployment

| Service | Platform | Purpose |
|---------|----------|---------|
| Frontend | Vercel | React SPA hosting with global CDN |
| Backend | Railway | Express API with auto-deploy |
| Database | MongoDB Atlas | Managed MongoDB with free M0 tier |

See [Cloud Deployment Guide](docs/Cloud_Deployment_Guide.md) for step-by-step instructions.

## 📖 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ✗ | Register new user |
| POST | `/api/auth/login` | ✗ | Login user |
| GET | `/api/users` | ✓ | List all users |
| GET | `/api/users/:id` | ✓ | Get user by ID |
| PUT | `/api/users/:id` | ✓ | Update user profile |
| DELETE | `/api/users/:id` | ✓ Admin | Delete user |
| GET | `/api/tasks` | ✓ | List tasks |
| POST | `/api/tasks` | ✓ | Create task |
| PUT | `/api/tasks/:id` | ✓ | Update task |
| DELETE | `/api/tasks/:id` | ✓ | Delete task |
| GET | `/api/announcements` | ✗ | List announcements |
| GET | `/api/health` | ✗ | Health check |

## 🔧 Environment Variables

### Backend (`server/.env`)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Server port |
| `MONGO_URI` | Yes | localhost | MongoDB connection string |
| `JWT_SECRET` | Yes | — | JWT signing secret |
| `JWT_EXPIRES_IN` | No | 7d | Token expiry duration |
| `NODE_ENV` | No | development | Environment mode |
| `CLIENT_URL` | No | localhost:5173 | Frontend URL for CORS |

### Frontend (Vercel Environment / `.env`)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Production | /api | Backend API URL |

## 📋 Documentation

- [Architecture Review](docs/Architecture_Review.md)
- [Application Dependencies](docs/Application_Dependencies.md)
- [Cloud Deployment Architecture](docs/Cloud_Deployment_Architecture.md)
- [Cloud Deployment Guide](docs/Cloud_Deployment_Guide.md)
- [Docker Deployment Guide](docs/Docker_Deployment_Guide.md)
- [Authentication Gaps Analysis](docs/Authentication_Gaps_Analysis.md)
- [Role-Based Access Control Design](docs/Role_Based_Access_Control_Design.md)

## 📝 License

ISC
