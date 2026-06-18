# Cloud Deployment Guide — CampusConnect (TODOs 15–23)

Complete step-by-step guide to deploy CampusConnect on Vercel + Railway + MongoDB Atlas.

---

## Step 1: MongoDB Atlas Setup (TODO 21)

### 1.1 Create Account & Cluster
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up with Google or email
3. Click **"Build a Database"**
4. Select **M0 FREE** tier
5. Choose provider: **AWS** → Region: **US East (N. Virginia)**
6. Cluster name: `CampusConnect`
7. Click **"Create Deployment"**

### 1.2 Create Database User
1. In the setup wizard → **Database Access**
2. Username: `campusconnect_app`
3. Password: Generate a strong password → **copy and save it**
4. Role: **Read and write to any database**
5. Click **"Add User"**

### 1.3 Configure Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (`0.0.0.0/0`)
   > This is necessary for Railway's dynamic IPs
3. Click **"Confirm"**

### 1.4 Get Connection String
1. Go to **Database** → Click **"Connect"**
2. Choose **"Drivers"** → Node.js
3. Copy the connection string:
   ```
   mongodb+srv://campusconnect_app:<password>@campusconnect.xxxxx.mongodb.net/campusconnect?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your database user password

---

## Step 2: Prepare Git Repository (TODO 15 & 16)

### 2.1 Initialize Git
```bash
cd "c:\Users\utkar\OneDrive\Desktop\MERN Bootcamp\Assignment 1"
git init
git add .
git commit -m "Initial commit: CampusConnect MERN application"
```

### 2.2 Create GitHub Repository
1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `CampusConnect`
3. Visibility: **Public**
4. Do NOT initialize with README (we already have one)
5. Click **"Create repository"**

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/CampusConnect.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Railway (TODO 19)

### 3.1 Create Railway Account
1. Go to [https://railway.app](https://railway.app)
2. Sign up with **GitHub** (recommended for auto-deploy)

### 3.2 Create New Project
1. Click **"New Project"** → **"Deploy from GitHub Repo"**
2. Select your `CampusConnect` repository
3. Railway will detect a monorepo — select the `server/` directory as the root
   > If Railway doesn't ask, you can set the root directory in Service Settings

### 3.3 Configure Environment Variables (TODO 22)
In Railway dashboard → Your service → **Variables** tab, add:

| Variable | Value |
|----------|-------|
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb+srv://campusconnect_app:<password>@campusconnect.xxxxx.mongodb.net/campusconnect?retryWrites=true&w=majority` |
| `JWT_SECRET` | `campusconnect_prod_secret_2025_xyz` (use a strong random string) |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | *(leave blank for now — we'll update after Vercel deploy)* |

### 3.4 Generate Domain
1. Go to **Settings** → **Networking** → **Generate Domain**
2. Railway will give you a URL like: `campusconnect-api-production.up.railway.app`
3. **Copy this URL** — you'll need it for the frontend

### 3.5 Verify Backend Deployment
Open in browser:
```
https://YOUR-RAILWAY-URL.up.railway.app/api/health
```
Expected response:
```json
{"status":"ok","message":"CampusConnect API is running.","db":"connected"}
```

---

## Step 4: Deploy Frontend to Vercel (TODO 20)

### 4.1 Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with **GitHub**

### 4.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your `CampusConnect` GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.3 Configure Environment Variables (TODO 22)
In the Vercel setup screen → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://YOUR-RAILWAY-URL.up.railway.app/api` |

> ⚠️ Replace `YOUR-RAILWAY-URL` with the actual Railway domain from Step 3.4

4. Click **"Deploy"**

### 4.4 Get Frontend URL
After deployment, Vercel gives you a URL like:
```
https://campus-connect-xxxx.vercel.app
```

### 4.5 Update Railway's CLIENT_URL
Go back to Railway → **Variables** → Update:
| Variable | Value |
|----------|-------|
| `CLIENT_URL` | `https://campus-connect-xxxx.vercel.app` |

This enables the production CORS whitelist.

---

## Step 5: Validate End-to-End Deployment (TODO 23)

Open the Vercel frontend URL and test each operation:

### Validation Checklist

| # | Test | Expected Result | Status |
|---|------|----------------|--------|
| 1 | Open frontend URL | React app loads, Home page visible | ☐ |
| 2 | Click "Register" | Registration form loads | ☐ |
| 3 | Register new account | Success message, redirected to dashboard | ☐ |
| 4 | Logout and login | Login successful, dashboard loads | ☐ |
| 5 | View dashboard | Announcements, user list, task summary visible | ☐ |
| 6 | Search students | Dynamic search filters users by name/email | ☐ |
| 7 | Navigate to Tasks | Task list loads | ☐ |
| 8 | Create a new task | Task appears in list with "pending" status | ☐ |
| 9 | Update task status | Status changes to "in-progress" or "completed" | ☐ |
| 10 | Delete a task | Task removed from list | ☐ |
| 11 | Filter tasks by status | Only matching tasks shown | ☐ |
| 12 | API health check | `https://RAILWAY-URL/api/health` returns `{"status":"ok","db":"connected"}` | ☐ |

### API Verification Commands
```bash
# Health check
curl https://YOUR-RAILWAY-URL.up.railway.app/api/health

# Register
curl -X POST https://YOUR-RAILWAY-URL.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Cloud Test","email":"cloud@campus.edu","password":"SecurePass123"}'

# Login
curl -X POST https://YOUR-RAILWAY-URL.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cloud@campus.edu","password":"SecurePass123"}'

# Protected route (replace TOKEN with actual JWT)
curl https://YOUR-RAILWAY-URL.up.railway.app/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Frontend shows CORS error | Verify `CLIENT_URL` in Railway matches your Vercel URL exactly |
| API returns "MongoDB connection error" | Check `MONGO_URI` in Railway, verify Atlas network access allows `0.0.0.0/0` |
| Login fails in production | Verify `JWT_SECRET` is set in Railway variables |
| Vercel build fails | Check that Root Directory is set to `client` |
| Railway build fails | Check that Root Directory is set to `server` |
| Frontend can't reach API | Verify `VITE_API_URL` in Vercel points to correct Railway URL with `/api` suffix |

---

## Deployed URLs Summary

Fill in after deployment:

| Service | URL |
|---------|-----|
| Frontend (Vercel) | `https://________________________.vercel.app` |
| Backend (Railway) | `https://________________________.up.railway.app` |
| Database (Atlas) | `mongodb+srv://________________________.mongodb.net` |
| API Health Check | `https://________________________.up.railway.app/api/health` |
