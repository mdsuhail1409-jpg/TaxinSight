# TaxinSight - API Contract

## Base URL
- Local: `http://localhost:8000/api/v1`
- OpenAPI Specification: `http://localhost:8000/docs`

## Standard Response Format

All responses follow a consistent envelope structure:

```json
{
  "success": true,
  "data": {},
  "message": null,
  "timestamp": "2026-11-05T14:15:00Z"
}
```

Error response structure:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILTER",
    "detail": "Date range cannot exceed 365 days."
  },
  "timestamp": "2026-11-05T14:15:00Z"
}
```

## Core Endpoints

### 1. Health & Status
- **`GET /health`**
  - **Description**: Verifies service status.
  - **Response**: `{ "status": "healthy" }`

### 2. Overview Metrics
- **`GET /api/v1/metrics/summary`**
  - **Query Params**:
    - `start_date` (ISO Date string, optional)
    - `end_date` (ISO Date string, optional)
    - `category` (string, optional)
  - **Response**: Aggregate KPIs (total volume, average metrics, trend deltas).

### 3. Time Series Analytics
- **`GET /api/v1/analytics/timeseries`**
  - **Query Params**:
    - `interval` (`daily` | `weekly` | `monthly`)
    - `metric` (string)
  - **Response**: Array of timestamped data points for chart rendering.

### 4. Categorical Breakdown
- **`GET /api/v1/analytics/breakdown`**
  - **Query Params**:
    - `dimension` (string)
  - **Response**: Sliced dataset with proportions and totals.

### 5. Report Generation
- **`POST /api/v1/reports/export`**
  - **Payload**: Filter configuration and format (`csv` | `pdf` | `json`).
  - **Response**: File download stream or URL.

