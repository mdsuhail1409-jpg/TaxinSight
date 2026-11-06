# TaxInsight – DevOps & Production Deployment Report

**Document ID:** DEP-REP-2026-001  
**Lead Engineer:** Senior DevOps & Deployment Engineer  
**Source Repository:** `https://github.com/mdsuhail1409-jpg/TaxinSight`  
**Frontend Host:** Vercel (React + Vite SPA)  
**Backend Host:** Render (FastAPI + Python Web Service)  
**Verification Date:** 06 November 2026  
**Status:** PRODUCTION READY

---

## 1. Deployment Topology

The TaxInsight platform is architected for dual-cloud deployment with automated Continuous Integration / Continuous Deployment (CI/CD):

```
                       [ GitHub Repository ]
                   mdsuhail1409-jpg/TaxinSight
                         /             \
             (Push to main)           (Push to main)
                       /                 \
                      ▼                   ▼
            [ Vercel Edge CDN ]    [ Render Cloud Service ]
            React + TypeScript     FastAPI + Python 3.12
            Base: frontend/        Base: backend/
            Build: npm run build   Build: pip install -r requirements.txt
            URL: https://...app    URL: https://...onrender.com
                      \                   /
                       \                 /
                        ▼               ▼
                   CORS Authenticated REST API
```

---

## 2. Backend Deployment Specification (Render)

### A. Service Settings
- **Service Type:** Web Service
- **Environment:** `Python 3`
- **Region:** Oregon (US West) or Frankfurt (EU Central)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Build Command:**
  ```bash
  pip install -r requirements.txt && python app/database/seed_data.py
  ```
- **Start Command:**
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

### B. Production Environment Variables

| Variable Name | Production Value | Purpose |
| :--- | :--- | :--- |
| `APP_ENV` | `production` | Enables production optimizations, disables docs hot-reloads |
| `DATABASE_URL` | `sqlite:///./taxinsight.db` | Local SQLite database file path |
| `CORS_ORIGINS` | `https://taxinsight.vercel.app,https://*.vercel.app` | Authorizes deployed Vercel frontend |
| `MAX_UPLOAD_SIZE_MB` | `15` | Enforces upload security boundary |

### C. Persistent Storage & Ephemeral Filesystem Analysis

> [!IMPORTANT]
> **Ephemeral Filesystem Disclosure:**
> Render Free Web Services operate on ephemeral container filesystems. Any new files created at runtime (such as newly uploaded datasets) are discarded when the container sleeps or redeploys.

**TaxInsight Resilience Architecture:**
1. **Zero Cold-Boot Data Loss:** The application's `lifespan` handler (`app/main.py`) and the deployment build command invoke `seed_database()` during initialization. Even if a container restarts after idling, all 14 fiscal years of official CBDT statistics, state rankings, and ITR form distributions are immediately recreated and populated.
2. **Persistent Disk Upgrade Path:** For enterprise environments requiring persistence of arbitrary user uploads across container cycles:
   - Attach a **Render Persistent Disk** mounted at `/var/data/taxinsight`.
   - Configure `UPLOAD_DIR=/var/data/taxinsight/uploads` and `DATABASE_URL=sqlite:////var/data/taxinsight/taxinsight.db`.
3. **Managed PostgreSQL Compatibility:** All SQLAlchemy models are written in standard ANSI SQL syntax without SQLite-only quirks. Transitioning to a managed Render PostgreSQL database requires only changing `DATABASE_URL=postgresql://user:password@host/taxinsight`.

---

## 3. Frontend Deployment Specification (Vercel)

### A. Project Configuration
- **Framework Preset:** `Vite`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node.js Version:** `20.x` or `22.x`

### B. Single Page Application (SPA) Routing Configuration
Configured in `frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
*Guarantees that deep links (such as `/revenue`, `/regional`, `/reports`) resolve properly without 404 errors on browser refresh.*

### C. Frontend Environment Variables

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://taxinsight-backend.onrender.com` | Production URL of the FastAPI backend |

---

## 4. Security & Secret Management

- [x] **Zero Secrets in Repository:** No API keys, database credentials, passwords, or cloud tokens are committed to GitHub.
- [x] **Sanitized Git Tree:** `.gitignore` strictly excludes `.env`, `*.db`, `__pycache__`, `node_modules/`, `dist/`, and `uploads/`.
- [x] **File Traversal Defense:** Dataset uploads are sanitized with strict character whitelisting to block directory traversal attacks.
- [x] **CORS Origin Whitelisting:** Cross-origin requests from unapproved domains are rejected by FastAPI.

---

## 5. Post-Deployment Verification Checklist

Following initial deployment, execute this verification runbook:

1. **Backend Health Check:**
   ```bash
   curl -s -f https://taxinsight-backend.onrender.com/api/health | grep '"status":"healthy"'
   ```
2. **Verify CORS Headers:**
   ```bash
   curl -I -X OPTIONS https://taxinsight-backend.onrender.com/api/dashboard/summary \
     -H "Origin: https://taxinsight.vercel.app" \
     -H "Access-Control-Request-Method: GET"
   ```
   *Confirm `Access-Control-Allow-Origin: https://taxinsight.vercel.app` is returned.*
3. **Frontend Edge Routing:**
   - Navigate to `https://taxinsight.vercel.app/`
   - Refresh on `/regional` and `/reports` to verify SPA rewrite rules.
4. **Live Data & Visualization Check:**
   - Confirm all 5 KPI cards display formatted INR figures.
   - Verify Recharts rendered lines and bars for Gross vs. Net collection.
5. **Binary Report Download Check:**
   - Click "Executive PDF Briefing" and verify the browser downloads an authentic PDF file.
   - Click "Excel Analytics Ledger" and verify the generated multi-sheet workbook opens cleanly.

---

## 6. Local Quickstart Commands

To run the full stack locally for development or demonstration:

```bash
# Terminal 1: Backend
cd backend
.\.venv\Scripts\activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev -- --port 5173
```

- **Frontend Application:** `http://localhost:5173`
- **FastAPI Interactive Docs:** `http://127.0.0.1:8000/docs`
- **API Healthcheck:** `http://127.0.0.1:8000/api/health`

