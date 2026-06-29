# Deployment Checklist: Render (Backend) + Vercel (Frontend)

This is your step-by-step guide to deploying Reprop.io to production.

---

## Phase 1: Pre-Deployment Preparation (Local)

### 1.1 — Freeze Python Dependencies
Your `requirements.txt` is currently missing several packages that were installed via pip but not tracked. Run this to update it:

```bash
cd backend
source venv/bin/activate
pip freeze > requirements.txt
```

This is critical. Render uses `requirements.txt` to install your packages on their servers.

### 1.2 — Create a `render.yaml` (Optional but recommended)
Create this file at the root of your repo for one-click Render deployments:

```yaml
# render.yaml
services:
  - type: web
    name: reprop-backend
    runtime: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    rootDir: backend
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
```

> [!WARNING]
> `sync: false` means Render will ask you to manually enter the value in the dashboard. **Never hardcode secrets in this file.**

### 1.3 — Confirm `.env` is in `.gitignore`
Your `.env` file with secret keys **must never be committed to Git**. Confirm this in your root `.gitignore`:
```
.env
.env.*
backend/.env
```

### 1.4 — Push all latest changes to GitHub
```bash
git add .
git commit -m "Security hardening: 4-layer security model implemented"
git push origin main
```

---

## Phase 2: Deploy Backend to Render

### 2.1 — Create a New Web Service
1. Go to [render.com](https://render.com) → **Dashboard** → **New** → **Web Service**
2. Connect your GitHub account and select your `content-repourposing-agent` repository
3. Configure the service:

| Setting | Value |
|---|---|
| **Name** | `reprop-backend` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

### 2.2 — Set Environment Variables on Render
Go to your service → **Environment** tab → Add the following. **Do not copy from your `.env` file manually; type them in directly:**

| Key | Where to find the value |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio |
| `SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` (click Reveal) |

### 2.3 — Deploy and Get Your Backend URL
1. Click **Create Web Service** and wait for the build to complete (~2-3 minutes).
2. Render will give you a URL like: `https://reprop-backend.onrender.com`
3. **Save this URL** — you will need it for the frontend configuration.

### 2.4 — Test the Backend is Alive
Open your browser and visit: `https://reprop-backend.onrender.com/`

You should see: `{"message": "Welcome to the reprop.io API"}`

---

## Phase 3: Deploy Frontend

> Whether you deploy to **Vercel**, **Netlify**, or another service, the steps are similar.

### 3.1 — Update the API URL in `frontend/src/services/api.js`
Change the `API_URL` constant from `localhost` to your new Render backend URL:

```javascript
// BEFORE (local development)
const API_URL = "http://localhost:8000";

// AFTER (production)
const API_URL = "https://reprop-backend.onrender.com";
```

> [!TIP]
> A better long-term approach is to use an environment variable: `const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"` and then set `VITE_API_URL` in Vercel's dashboard. This lets you switch between dev and prod easily.

### 3.2 — Set Frontend Environment Variables
In your hosting platform's dashboard (e.g., Vercel), add:

| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://hspuzzaklmlnwsvwxuiq.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(your anon key from Supabase)* |

### 3.3 — Deploy the Frontend
**For Vercel:**
1. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
2. Set **Root Directory** to `frontend`
3. Vercel will auto-detect Vite — click **Deploy**
4. Save your deployment URL (e.g., `https://reprop.vercel.app`)

---

## Phase 4: Post-Deployment Security Lockdown

### 4.1 — Update CORS in `backend/app/main.py`
Add your live frontend URL to `ALLOWED_ORIGINS`:

```python
ALLOWED_ORIGINS = [
    "http://localhost:5173",      # Keep for local dev
    "https://reprop.vercel.app",  # Your production frontend URL
]
```

Commit and push this change → Render will auto-redeploy.

### 4.2 — Update Supabase Auth Redirect URLs
1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your production frontend URL to **Site URL** and **Redirect URLs**:
   - Site URL: `https://reprop.vercel.app`
   - Redirect URLs: `https://reprop.vercel.app/**`

### 4.3 — Final Security Verification

- `[ ]` Visit `https://reprop-backend.onrender.com/projects` in the browser → should return `401 Unauthorized` (not your data!)
- `[ ]` Try sending more than 5 `/generate` requests in 1 minute → should receive `429 Too Many Requests`
- `[ ]` Verify CORS: Try calling your backend from a random domain → should be blocked
- `[ ]` Confirm Supabase RLS is enabled: Dashboard → Table Editor → `projects` → RLS should show a green lock 🔒
- `[ ]` Check that `.env` files are NOT present in your GitHub repository

---

## Quick Reference: URLs & Commands

| Service | Development | Production |
|---|---|---|
| **Frontend** | `http://localhost:5173` | `https://your-app.vercel.app` |
| **Backend** | `http://localhost:8000` | `https://reprop-backend.onrender.com` |
| **Supabase** | Same for both environments | [supabase.com](https://supabase.com) |

> [!NOTE]
> Render's free tier spins down after 15 minutes of inactivity. The first request after inactivity may take 30-50 seconds to respond (cold start). Upgrading to a paid plan ($7/month) removes this limitation.
