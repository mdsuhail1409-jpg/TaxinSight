# API Documentation

The TaxinSight API provides high-performance analytics endpoints powered by FastAPI.

## Interactive Documentation
When running the backend server (`uvicorn app.main:app --reload`), view interactive schemas at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Authentication & Headers
- `Content-Type: application/json`
- `Accept: application/json`
- *(Optional future extension: `Authorization: Bearer <token>`)*

## Key Routes
- `GET /health`: Healthcheck endpoint
- `GET /api/v1/metrics/summary`: Aggregate metrics across filters
- `GET /api/v1/analytics/timeseries`: Temporal trend data for charts
- `GET /api/v1/analytics/breakdown`: Segmented breakdown data

