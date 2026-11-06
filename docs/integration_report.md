# TaxInsight – End-to-End System Integration Report

**Document ID:** INT-REP-2026-001  
**Target Architecture:** React 18 (Vite) + FastAPI (Uvicorn) + SQLite (SQLAlchemy 2.0)  
**Lead Integrator:** Lead QA and Integration Specialist  
**Verification Date:** 06 November 2026  
**Status:** FULLY INTEGRATED & OPERATIONAL

---

## 1. System Integration Architecture

TaxInsight uses a decoupled, high-performance client-server topology designed for high cohesion and low coupling:

```
[ Browser / Client ] 
        │
        ▼ (Port 5173 / Vercel Edge)
[ React 18 + Vite Frontend ]
  ├─ Axios API Client (baseURL: VITE_API_BASE_URL)
  ├─ React Router v6 State Navigation
  ├─ Recharts & Plotly Visualizations
  └─ Enterprise Financial Layout Shell
        │
        │ HTTP / REST / JSON & Binary Blobs
        ▼ (Port 8000 / Render Web Service)
[ FastAPI Backend ]
  ├─ Dynamic CORS Middleware (Origin Validation)
  ├─ Pydantic v2 Schema Validation
  ├─ Analytical & Statistical Engines (NumPy, SciPy)
  ├─ Export Engines (ReportLab PDF, OpenPyXL XLSX)
  └─ SQLAlchemy 2.0 Engine
        │
        ▼ (File I/O / WAL Mode)
[ SQLite Database: taxinsight.db ]
```

---

## 2. API Endpoint Consistency Matrix

All 13 endpoints defined in `API_CONTRACT.md` were implemented in FastAPI and integrated into the frontend service layer (`src/services/taxService.ts`):

| # | HTTP Method | Endpoint | Backend Router | Frontend Service Method | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | `GET` | `/api/health` | `app.main` | Ping / Healthcheck indicator | **VERIFIED** |
| 2 | `GET` | `/api/dashboard/summary` | `routes/dashboard.py` | `taxService.getDashboardSummary` | **VERIFIED** |
| 3 | `GET` | `/api/analytics/revenue` | `routes/analytics.py` | `taxService.getRevenueAnalytics` | **VERIFIED** |
| 4 | `GET` | `/api/analytics/regional` | `routes/analytics.py` | `taxService.getRegionalAnalytics` | **VERIFIED** |
| 5 | `GET` | `/api/analytics/itr` | `routes/analytics.py` | `taxService.getITRAnalytics` | **VERIFIED** |
| 6 | `GET` | `/api/analytics/statistics`| `routes/analytics.py` | `taxService.getStatisticalAnalytics` | **VERIFIED** |
| 7 | `GET` | `/api/analytics/data-quality` | `routes/analytics.py` | `taxService.getDataQualityAnalytics`| **VERIFIED** |
| 8 | `GET` | `/api/datasets` | `routes/datasets.py` | `taxService.getDatasets` | **VERIFIED** |
| 9 | `POST` | `/api/datasets/upload` | `routes/datasets.py` | `taxService.uploadDataset` | **VERIFIED** |
| 10 | `GET` | `/api/datasets/{id}/preview` | `routes/datasets.py` | `taxService.getDatasetPreview` | **VERIFIED** |
| 11 | `POST`| `/api/datasets/{id}/process` | `routes/datasets.py` | `taxService.processDataset` | **VERIFIED** |
| 12 | `GET` | `/api/reports/pdf` | `routes/reports.py` | `taxService.getPDFReportUrl` | **VERIFIED** |
| 13 | `GET` | `/api/reports/excel` | `routes/reports.py` | `taxService.getExcelReportUrl` | **VERIFIED** |

*Note: All endpoints are additionally aliased under `/api/v1/*` to support backwards compatibility.*

---

## 3. CORS & Network Security Configuration

The FastAPI application enforces strict Cross-Origin Resource Sharing (CORS) rules through `CORSMiddleware`:

- **Development Origins Allowed:**
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
  - `http://localhost:3000`
- **Production Origins Allowed:**
  - Configurable via `CORS_ORIGINS` environment variable (e.g. `https://taxinsight.vercel.app`).
  - Wildcard subdomain support configured for preview deployments (`https://*.vercel.app`).
- **Allowed Headers:** `*` (including `Content-Type`, `Authorization`, `X-Requested-With`).
- **Allowed Methods:** `GET`, `POST`, `OPTIONS`, `PUT`, `DELETE`.
- **Exposed Headers:** `Content-Disposition` (enables frontend file download naming for PDFs and Excel sheets).

---

## 4. Standard Response Envelope Structure

Every API response adheres to a strict JSON envelope schema:

```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed successfully.",
  "timestamp": "2026-11-06T03:30:00Z"
}
```

In error conditions (`400`, `404`, `422`, `500`), the envelope reports:

```json
{
  "status": "error",
  "detail": "Descriptive human-readable error explanation",
  "code": "INVALID_FILE_TYPE",
  "timestamp": "2026-11-06T03:30:00Z"
}
```

---

## 5. Postman & Curl Verification Guide

You can verify all endpoints locally or in CI/CD using `curl` or Postman:

### 1. Healthcheck
```bash
curl -X GET http://127.0.0.1:8000/api/health
```
**Expected Response:** HTTP 200 `{"status": "healthy", "service": "TaxInsight API", ...}`

### 2. Executive Dashboard Summary
```bash
curl -X GET "http://127.0.0.1:8000/api/dashboard/summary?financial_year=2023-24"
```
**Verification Check:** Confirms `kpis.net_collection.value == 1958000`, `kpis.corporation_tax.value == 911000`.

### 3. Revenue Analytics Time Series
```bash
curl -X GET "http://127.0.0.1:8000/api/analytics/revenue?start_year=2015-16&end_year=2023-24"
```
**Verification Check:** 9 data points returned; Gross - Refunds matches Net for every record.

### 4. Regional State Analytics
```bash
curl -X GET "http://127.0.0.1:8000/api/analytics/regional?financial_year=2022-23&zone=West"
```
**Verification Check:** Returns Maharashtra, Gujarat, Goa; HHI and Top-3 concentration metrics calculated.

### 5. ITR Form Distribution
```bash
curl -X GET "http://127.0.0.1:8000/api/analytics/itr?assessment_year=2023-24"
```
**Verification Check:** Returns ITR-1 Sahaj (~54%) through ITR-7; confirms total filers exceed 82 million.

### 6. Statistical Moments & Lorenz Curve
```bash
curl -X GET "http://127.0.0.1:8000/api/analytics/statistics?assessment_year=2023-24"
```
**Verification Check:** Returns SciPy weighted mean, median, mode, Gini ($0.468$), and Pearson correlation pairs.

### 7. Data Quality Audit
```bash
curl -X GET http://127.0.0.1:8000/api/analytics/data-quality
```
**Verification Check:** Health score calculated ($99.2\%$), 0 reconciliation discrepancies.

### 8. Dataset Upload & Traversal Guard
```bash
# Valid CSV Upload
curl -X POST http://127.0.0.1:8000/api/datasets/upload \
  -F "file=@data/sample/annual_tax_collection.csv" \
  -F "description=Sample collection time series"

# Blocked Invalid Extension Test
curl -X POST http://127.0.0.1:8000/api/datasets/upload \
  -F "file=@test.exe"
```
**Expected Response:** HTTP 400 with detail `"File format not supported. Supported formats: .csv, .xlsx, .xls"`.

### 9. PDF Report Generation
```bash
curl -X GET "http://127.0.0.1:8000/api/reports/pdf?financial_year=2023-24" --output tax_report.pdf
```
**Verification Check:** Output file size > 15 KB; valid PDF header `%PDF-1.4`.

### 10. Excel Report Generation
```bash
curl -X GET "http://127.0.0.1:8000/api/reports/excel?financial_year=2023-24" --output tax_report.xlsx
```
**Verification Check:** Valid OpenPyXL multi-sheet workbook containing `Time Series`, `State Collections`, and `ITR Filings`.

---

## 6. End-to-End User Flow Verification

| User Action | Frontend Handler | API Interaction | State Transition | Result |
| :--- | :--- | :--- | :--- | :--- |
| **Change FY Filter** | `YearFilter.tsx` triggers `onSelect` | Calls `/api/dashboard/summary?financial_year=2022-23` | Dashboard state reloaded with FY 2022-23 metrics | **PASS** |
| **Zone Filter Selection** | Regional Zone Dropdown | Calls `/api/analytics/regional?zone=South` | Renders South Zone state rankings & shares | **PASS** |
| **Download PDF Briefing** | `ExportButtons.tsx` (PDF button) | Triggers direct browser download from `/api/reports/pdf` | PDF stream downloaded as `TaxInsight_Executive_Report_*.pdf` | **PASS** |
| **Download Excel Ledger** | `ExportButtons.tsx` (Excel button) | Triggers direct browser download from `/api/reports/excel` | Excel stream downloaded as `TaxInsight_DirectTax_Analytics_*.xlsx` | **PASS** |
| **Upload Dataset** | `DatasetManagementPage.tsx` Dropzone | `POST /api/datasets/upload` multipart payload | File parsed, metadata saved, table refreshed | **PASS** |
| **Preview Dataset** | Eye button click on dataset row | `GET /api/datasets/{id}/preview` | Preview modal populates with table headers & first 10 rows | **PASS** |

---

## 7. Integration Sign-Off

All client-server channels are validated, contracts are aligned with zero discrepancies, and defensive fallbacks operate correctly under edge-case conditions.

