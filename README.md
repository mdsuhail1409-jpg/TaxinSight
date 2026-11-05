# TaxinSight

TaxinSight is a full-stack platform designed for comprehensive data analytics, visualization, and insights.

## Project Structure

```
TaxinSight/
├── frontend/             # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/   # UI, layout, dashboard, filters, charts
│   │   ├── pages/        # Application view pages
│   │   ├── services/     # API integration clients
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript interfaces & types
│   └── package.json
├── backend/              # FastAPI Python backend
│   ├── app/
│   │   ├── api/routes/   # REST endpoint routers
│   │   ├── core/         # Config and security
│   │   ├── database/     # DB connections and sessions
│   │   ├── models/       # ORM / domain data models
│   │   ├── schemas/      # Pydantic schemas (request / response)
│   │   └── services/     # Business logic & computation
│   └── requirements.txt
├── data/                 # Raw, processed, and sample datasets
├── docs/                 # Architecture, methodology, API, data dictionary
├── reports/              # Generated reports and exports
├── PROJECT_SPEC.md       # Product specifications and goals
└── API_CONTRACT.md       # Frontend-backend API specifications
```

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be accessible at: `http://localhost:8000/docs`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend development server will run at: `http://localhost:5173`

