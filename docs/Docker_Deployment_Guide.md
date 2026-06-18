# Docker Deployment Guide — CampusConnect

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- At least 4GB of available RAM for containers

## Quick Start

### 1. Start all services
```bash
docker compose up --build -d
```

This command:
- Builds the **backend** (Node.js API) image
- Builds the **frontend** (React + Nginx) image
- Pulls the **MongoDB 7.0** image
- Creates a persistent volume for database data
- Starts all three containers on an internal Docker network

### 2. Access the application
| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React web application |
| Backend API | http://localhost:5000/api/health | Express API (direct access) |
| MongoDB | localhost:27017 | Database (use MongoDB Compass) |

### 3. Stop all services
```bash
docker compose down
```

### 4. Stop and remove all data
```bash
docker compose down -v
```

---

## Container Architecture

```
┌─ Docker Network: campusconnect-network ─────────────────────────┐
│                                                                   │
│  ┌──────────────────┐    /api     ┌──────────────────┐           │
│  │   Frontend        │──────────▶│   Backend          │           │
│  │   (Nginx:80)      │           │   (Node:5000)      │           │
│  │                    │           │                    │           │
│  │   Serves React    │           │   Express API      │           │
│  │   Proxies /api    │           │   JWT Auth         │           │
│  └──────────────────┘           │   bcrypt           │           │
│         ▲                        └────────┬───────────┘           │
│         │ :3000                           │                       │
│         │                                 ▼                       │
│                              ┌──────────────────┐                │
│                              │   MongoDB          │                │
│                              │   (Mongo:27017)    │                │
│                              │                    │                │
│                              │   Persistent Vol   │                │
│                              └──────────────────┘                │
└───────────────────────────────────────────────────────────────────┘
```

---

## Environment Configuration

Copy `.env.docker` to `.env` and customize:

```bash
cp .env.docker .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_ROOT_USER` | admin | MongoDB root username |
| `MONGO_ROOT_PASSWORD` | admin_password | MongoDB root password |
| `JWT_SECRET` | campusconnect_docker_secret_2025 | JWT signing secret |
| `JWT_EXPIRES_IN` | 7d | JWT token expiry |

---

## Useful Docker Commands

```bash
# View running containers
docker compose ps

# View logs for all services
docker compose logs

# View logs for a specific service
docker compose logs backend
docker compose logs frontend
docker compose logs mongodb

# Follow logs in real-time
docker compose logs -f backend

# Rebuild a specific service
docker compose up --build backend -d

# Access MongoDB shell
docker exec -it campusconnect-db mongosh -u admin -p admin_password

# Access backend container shell
docker exec -it campusconnect-api sh
```

---

## Verifying the Deployment (TODO 13)

After running `docker compose up --build -d`, verify:

### 1. Health Check
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","message":"CampusConnect API is running.","db":"connected"}
```

### 2. Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@campus.edu","password":"SecurePass123"}'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@campus.edu","password":"SecurePass123"}'
```

### 4. Frontend
Open http://localhost:3000 in your browser — the React app should load and be able to communicate with the backend through the Nginx reverse proxy.
