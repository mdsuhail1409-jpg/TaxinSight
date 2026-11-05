# TaxInsight – Multi-Agent Role & Task Assignments (TASK_ASSIGNMENTS.md)

## 1. Multi-Agent Allocation Matrix

To guarantee modularity, prevent race conditions, and ensure rapid, error-free execution, responsibilities are partitioned across four specialized technical agent profiles:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LEAD ARCHITECT / PM                             │
│       System Architecture, API Contracts, Integration & Release        │
└───────┬───────────────────┬───────────────────┬─────────────────┬──────┘
        │                   │                   │                 │
        ▼                   ▼                   ▼                 ▼
 ┌───────────────┐   ┌───────────────┐   ┌───────────────┐  ┌───────────┐
 │    AGENT 1    │   │    AGENT 2    │   │    AGENT 3    │  │  AGENT 4  │
 │     DATA      │   │    BACKEND    │   │   FRONTEND    │  │  QA &     │
 │  ENGINEERING  │   │  DEVELOPMENT  │   │  DEVELOPMENT  │  │  TESTING  │
 └───────────────┘   └───────────────┘   └───────────────┘  └───────────┘
```

---

## 2. Agent Responsibilities & Designated File Trees

### Agent 1: Data Engineering
- **Domain Scope**: Authoritative Indian direct tax datasets, CSV/XLSX structuring, database seeding, schema validation rules.
- **Designated Working Directories**:
  - `data/raw/` (unmodified historical reference tables)
  - `data/processed/` (cleaned, normalized tables)
  - `data/sample/` (reproducible seed datasets)
  - `backend/app/database/seed_data.py` (database population script)
- **Key Deliverables**:
  1. Compile CBDT official direct tax collection time series (FY 2014-15 to FY 2022-23).
  2. Compile state/UT-level collection breakdown with regional zonal tags.
  3. Compile ITR-1 to ITR-7 filing distributions and entity demographics.
  4. Compile taxable income slab distributions for empirical Lorenz curve calculation.
  5. Implement `seed_data.py` ensuring database auto-initialization on startup.

### Agent 2: Backend Development
- **Domain Scope**: FastAPI routes, SQLAlchemy ORM persistence, Pydantic schemas, computational analytics, and report generators.
- **Designated Working Directories**:
  - `backend/app/models/` (database entities)
  - `backend/app/schemas/` (Pydantic models)
  - `backend/app/api/routes/` (modular API routers)
  - `backend/app/services/` (business logic, SciPy statistical engine, ReportLab & OpenPyXL)
  - `backend/app/main.py` (FastAPI application orchestrator)
- **Key Deliverables**:
  1. Implement ORM models adhering to `DATABASE_SCHEMA.md`.
  2. Implement Pydantic v2 schemas adhering to `API_CONTRACT.md`.
  3. Implement statistical engine in `app/services/statistical_service.py` using SciPy (moments, Gini, Lorenz).
  4. Implement PDF report generator via ReportLab (`app/services/report_service.py`).
  5. Implement multi-sheet Excel generator via OpenPyXL.
  6. Register all 13 required endpoints under `/api`.

### Agent 3: Frontend Development
- **Domain Scope**: React 18 single-page application, Tailwind styling, navigation, Recharts & Plotly dashboards, dataset uploads.
- **Designated Working Directories**:
  - `frontend/src/components/` (`layout/`, `dashboard/`, `charts/`, `filters/`, `ui/`)
  - `frontend/src/pages/` (all 8 module page views)
  - `frontend/src/services/` (API client & data fetching)
  - `frontend/src/types/` (TypeScript interfaces matching API contracts)
  - `frontend/src/App.tsx` (Route registration)
- **Key Deliverables**:
  1. Responsive header and navigation sidebar supporting all 8 core modules.
  2. Recharts and Plotly visualization components.
  3. Dynamic filter bar (Financial Year / Assessment Year / Zone selector).
  4. File upload interface with drag-and-drop, progress status, and schema preview modal.
  5. Single-click PDF and Excel export triggers with loading states.

### Agent 4: QA, Verification & Deployment
- **Domain Scope**: Test automation, API validation, build verification, and deployment configurations.
- **Designated Working Directories**:
  - `backend/tests/` (Pytest test suite)
  - `frontend/` (Vite production build verification)
  - `render.yaml` & `frontend/vercel.json` (Production deployment configs)
- **Key Deliverables**:
  1. Comprehensive Pytest test cases (`test_api.py`, `test_services.py`, `test_reports.py`).
  2. Verify math correctness of Gini coefficient, buoyancy factors, and reconciliation equations.
  3. Configure production deployment manifests (`render.yaml` for Render, `vercel.json` for Vercel).
  4. Audit frontend build (`npm run build`) ensuring zero TypeScript and bundle errors.
