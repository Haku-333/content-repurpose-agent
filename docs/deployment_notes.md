# Production Deployment Documentation

This document explains the configuration, setup, and changes made to successfully deploy **Reprop.io** to production using **Render** (for the FastAPI backend) and **Vercel** (for the React frontend).

---

## 1. Backend Deployment (Render)

The FastAPI backend is deployed as a Web Service on Render.

### Infrastructure-as-Code (`render.yaml`)
A `render.yaml` file was created at the root of the repository to automate setting up the backend environment. Render automatically detects this file and configures the service:

```yaml
services:
  - type: web
    name: reprop-backend
    runtime: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
```

- **Uvicorn Start Command**: The command `uvicorn app.main:app --host 0.0.0.0 --port $PORT` is crucial. The `--host 0.0.0.0` flag binds the server to all network interfaces so it can receive public traffic, and `--port $PORT` dynamically listens to whatever port Render allocates.
- **Dependency Management**: We ran a virtual-environment-specific freeze to generate a complete `requirements.txt` containing exact package versions, including `supabase` and `slowapi`.

---

## 2. Frontend Deployment (Vercel)

The Vite/React frontend is deployed on Vercel as a Single Page Application (SPA).

### Client-Side Routing Rewrite (`vercel.json`)
Vercel is structured to serve static files. When using client-side routing (`react-router-dom`), navigating to paths like `/login` or `/project/new` directly will trigger a `404 Not Found` because Vercel looks for actual directories.

To resolve this, we added a [`vercel.json`](file:///Users/nacho/Desktop/content-repourposing-agent/frontend/vercel.json) file to route all URLs to `index.html`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Gitignore Correction
A critical issue was identified where the root `.gitignore` contained a recursive `lib/` directory rule. This was preventing `frontend/src/lib/` (which contains `supabase.js` and `utils.js`) from being tracked or pushed to GitHub.
- **Change**: Updated `.gitignore` line 19 from `lib/` to `/lib/` to only ignore a root Python-level library folder if present, keeping the nested frontend directory tracked.

---

## 3. Configuration & Security Lockdowns

### Dynamic API URLs
Instead of hardcoding URLs, the API calls in `api.js` retrieve the endpoint dynamically from a Vite environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

### CORS Policies (`main.py`)
To prevent unauthorized domains from hitting your API endpoints, the CORS policy list was locked down specifically to your live production frontend domain:

```python
ALLOWED_ORIGINS = [
    "http://localhost:5173",                       # Development
    "https://content-repurpose-agent.vercel.app",  # Production
]
```

---

## 4. Scaling Considerations (Future Checklist)

If you plan to scale the project in the future, keep these configurations in mind:

1. **Render Free Tier Spin-Down**:
   - The current free tier of Render spins down the backend container after 15 minutes of inactivity. The next visitor experiences a "cold start" delay of 30-50 seconds.
   - *Scale solution*: Upgrade to a basic paid Render Web Service ($7/month) to keep the backend permanently warm.

2. **Supabase Connection Pooling**:
   - In a massive traffic environment, direct PostgreSQL connections can get exhausted.
   - *Scale solution*: Modify the Python service to connect to Supabase's built-in database pooler port (session mode) instead of direct connection methods.

3. **Gemini API Limits**:
   - The Gemini free tier has a strict Rate Limit per Minute (RPM). 
   - *Scale solution*: Set up a billing account on Google AI Studio to unlock production tier quotas and ensure the API does not throw `429` (Quota Exceeded) errors during peak user times.
