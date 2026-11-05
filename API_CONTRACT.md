# TaxInsight – REST API Contract Specification (API_CONTRACT.md)

## 1. Global Specifications & Conventions

- **Base URL Prefix**: `/api` (or `/api/v1` with automatic redirects)
- **Content-Type**: `application/json` (except multipart file uploads and binary reports)
- **Standard Envelope**:
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2026-11-05T14:30:00Z"
}
```
- **Standard Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "detail": "Invalid financial year format. Expected YYYY-YY."
  },
  "timestamp": "2026-11-05T14:30:00Z"
}
```

---

## 2. Endpoints by Module

### 2.1 Health & Diagnostic
#### `GET /api/health`
- **Purpose**: Verify backend and database connectivity.
- **Query Parameters**: None
- **Response**:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-11-05T14:30:00Z"
}
```

---

### 2.2 Executive Dashboard Summary
#### `GET /api/dashboard/summary`
- **Purpose**: High-level KPIs and multi-year trajectory for the Executive Overview.
- **Query Parameters**:
  - `financial_year` (string, optional, default: latest available e.g., `"2022-23"`)
- **Response**:
```json
{
  "success": true,
  "data": {
    "selected_financial_year": "2022-23",
    "selected_assessment_year": "2023-24",
    "kpis": {
      "net_collection": {
        "value": 1661428.0,
        "unit": "₹ Crore",
        "yoy_growth_pct": 17.63,
        "is_positive": true
      },
      "corporation_tax": {
        "value": 825834.0,
        "unit": "₹ Crore",
        "share_of_direct_tax_pct": 49.71
      },
      "personal_income_tax": {
        "value": 833307.0,
        "unit": "₹ Crore",
        "share_of_direct_tax_pct": 50.16
      },
      "refunds_issued": {
        "value": 307352.0,
        "unit": "₹ Crore",
        "refund_to_gross_pct": 15.61
      },
      "total_filers": {
        "value": 7.40,
        "unit": "Crore Filers",
        "yoy_growth_pct": 6.8
      },
      "buoyancy_factor": 1.18
    },
    "historical_trend": [
      {
        "financial_year": "2020-21",
        "net_collection": 947176.0,
        "corporation_tax": 457719.0,
        "personal_income_tax": 487144.0,
        "refunds": 259648.0
      },
      {
        "financial_year": "2021-22",
        "net_collection": 1412422.0,
        "corporation_tax": 712037.0,
        "personal_income_tax": 696243.0,
        "refunds": 224462.0
      },
      {
        "financial_year": "2022-23",
        "net_collection": 1661428.0,
        "corporation_tax": 825834.0,
        "personal_income_tax": 833307.0,
        "refunds": 307352.0
      }
    ],
    "revenue_composition": [
      { "name": "Corporation Tax", "value": 825834.0, "pct": 49.71 },
      { "name": "Personal Income Tax", "value": 833307.0, "pct": 50.16 },
      { "name": "Other Direct Taxes (STT etc)", "value": 2287.0, "pct": 0.13 }
    ]
  }
}
```

---

### 2.3 Revenue Analytics
#### `GET /api/analytics/revenue`
- **Purpose**: Deep-dive revenue collections, refunds, growth rates, cost of collection, and tax-to-GDP buoyancy.
- **Query Parameters**:
  - `start_year` (string, optional, e.g., `"2014-15"`)
  - `end_year` (string, optional, e.g., `"2022-23"`)
- **Response**:
```json
{
  "success": true,
  "data": {
    "time_series": [
      {
        "financial_year": "2021-22",
        "gross_collection": 1636884.0,
        "refunds": 224462.0,
        "net_collection": 1412422.0,
        "corporation_tax": 712037.0,
        "personal_income_tax": 696243.0,
        "other_taxes": 4142.0,
        "cost_of_collection_pct": 0.53,
        "yoy_gross_growth": 32.8,
        "yoy_net_growth": 49.1
      }
    ],
    "buoyancy_analysis": [
      {
        "financial_year": "2021-22",
        "nominal_gdp_growth_pct": 18.4,
        "net_tax_growth_pct": 49.1,
        "buoyancy_ratio": 2.67
      }
    ],
    "collection_efficiency": {
      "average_cost_of_collection_pct": 0.54,
      "refund_disbursal_ratio_pct": 14.8
    }
  }
}
```

---

### 2.4 Regional Analytics
#### `GET /api/analytics/regional`
- **Purpose**: State and Union Territory breakdown, geographical zones, and national concentration ratios.
- **Query Parameters**:
  - `financial_year` (string, optional, default: `"2022-23"`)
  - `zone` (string, optional, e.g., `"West"`, `"North"`, `"South"`, `"East"`)
- **Response**:
```json
{
  "success": true,
  "data": {
    "financial_year": "2022-23",
    "top_contributing_states": [
      { "rank": 1, "state": "Maharashtra", "total_collection": 526310.0, "share_pct": 31.68, "zone": "West" },
      { "rank": 2, "state": "Delhi", "total_collection": 204560.0, "share_pct": 12.31, "zone": "North" },
      { "rank": 3, "state": "Karnataka", "total_collection": 168240.0, "share_pct": 10.13, "zone": "South" },
      { "rank": 4, "state": "Tamil Nadu", "total_collection": 107410.0, "share_pct": 6.46, "zone": "South" },
      { "rank": 5, "state": "Gujarat", "total_collection": 84190.0, "share_pct": 5.07, "zone": "West" }
    ],
    "zonal_breakdown": [
      { "zone": "West", "total": 632500.0, "share_pct": 38.07 },
      { "zone": "North", "total": 395100.0, "share_pct": 23.78 },
      { "zone": "South", "total": 389200.0, "share_pct": 23.42 },
      { "zone": "East", "total": 134500.0, "share_pct": 8.10 },
      { "zone": "Central", "total": 85100.0, "share_pct": 5.12 },
      { "zone": "North-East", "total": 25028.0, "share_pct": 1.51 }
    ],
    "concentration_metrics": {
      "top_3_states_share_pct": 54.12,
      "top_5_states_share_pct": 65.65,
      "herfindahl_hirschman_index": 1324.5
    },
    "all_states": []
  }
}
```

---

### 2.5 ITR Analytics
#### `GET /api/analytics/itr`
- **Purpose**: Filer distributions across ITR form types and legal taxpayer entities.
- **Query Parameters**:
  - `assessment_year` (string, optional, default: `"2023-24"`)
- **Response**:
```json
{
  "success": true,
  "data": {
    "assessment_year": "2023-24",
    "financial_year": "2022-23",
    "total_filings_count": 74012000,
    "form_distribution": [
      { "form": "ITR-1 (Sahaj)", "count": 36120000, "share_pct": 48.8, "description": "Salaried <= 50L" },
      { "form": "ITR-2", "count": 6450000, "share_pct": 8.7, "description": "Capital gains, multiple properties" },
      { "form": "ITR-3", "count": 11840000, "share_pct": 16.0, "description": "Business / Profession" },
      { "form": "ITR-4 (Sugam)", "count": 18230000, "share_pct": 24.6, "description": "Presumptive business" },
      { "form": "ITR-5", "count": 680000, "share_pct": 0.9, "description": "Firms & LLPs" },
      { "form": "ITR-6", "count": 482000, "share_pct": 0.7, "description": "Corporate entities" },
      { "form": "ITR-7", "count": 210000, "share_pct": 0.3, "description": "Trusts & Exempt institutions" }
    ],
    "category_distribution": [
      { "category": "Individual", "count": 69820000, "share_pct": 94.3 },
      { "category": "HUF", "count": 1210000, "share_pct": 1.6 },
      { "category": "Firms & LLPs", "count": 1420000, "share_pct": 1.9 },
      { "category": "Companies", "count": 982000, "share_pct": 1.3 },
      { "category": "AOP/BOI/Trusts", "count": 580000, "share_pct": 0.9 }
    ]
  }
}
```

---

### 2.6 Statistical Analysis
#### `GET /api/analytics/statistics`
- **Purpose**: SciPy moment computations (Mean, Median, Skewness, Kurtosis), Lorenz curve, Gini coefficient, and OLS regression forecast.
- **Query Parameters**:
  - `assessment_year` (string, optional, default: `"2023-24"`)
- **Response**:
```json
{
  "success": true,
  "data": {
    "assessment_year": "2023-24",
    "distribution_moments": {
      "mean_taxable_income_inr": 624500.0,
      "median_taxable_income_inr": 450000.0,
      "standard_deviation": 1425000.0,
      "skewness": 3.42,
      "kurtosis": 16.85
    },
    "inequality_metrics": {
      "gini_coefficient": 0.582,
      "palma_ratio": 3.84
    },
    "lorenz_curve": [
      { "cumulative_population_pct": 0.0, "cumulative_income_pct": 0.0, "line_of_equality": 0.0 },
      { "cumulative_population_pct": 20.0, "cumulative_income_pct": 4.1, "line_of_equality": 20.0 },
      { "cumulative_population_pct": 40.0, "cumulative_income_pct": 12.3, "line_of_equality": 40.0 },
      { "cumulative_population_pct": 60.0, "cumulative_income_pct": 24.8, "line_of_equality": 60.0 },
      { "cumulative_population_pct": 80.0, "cumulative_income_pct": 44.2, "line_of_equality": 80.0 },
      { "cumulative_population_pct": 100.0, "cumulative_income_pct": 100.0, "line_of_equality": 100.0 }
    ],
    "income_brackets": [
      { "range": "₹0 - ₹2.5 Lakh", "filers": 15400000, "income_share_pct": 5.2, "tax_share_pct": 0.0 },
      { "range": "₹2.5L - ₹5 Lakh", "filers": 32800000, "income_share_pct": 22.4, "tax_share_pct": 3.8 },
      { "range": "₹5L - ₹10 Lakh", "filers": 16200000, "income_share_pct": 26.8, "tax_share_pct": 18.4 },
      { "range": "₹10L - ₹20 Lakh", "filers": 6400000, "income_share_pct": 21.1, "tax_share_pct": 26.2 },
      { "range": "₹20L - ₹50 Lakh", "filers": 2100000, "income_share_pct": 12.3, "tax_share_pct": 22.1 },
      { "range": "> ₹50 Lakh", "filers": 1112000, "income_share_pct": 12.2, "tax_share_pct": 29.5 }
    ],
    "regression_forecast": {
      "slope": 142100.0,
      "intercept": 812000.0,
      "r_squared": 0.942,
      "projected_next_fy_collection": 1920000.0
    }
  }
}
```

---

### 2.7 Data Quality Intelligence
#### `GET /api/analytics/data-quality`
- **Purpose**: Field completeness, reconciliation checks, anomaly detection, and schema verification.
- **Query Parameters**: None
- **Response**:
```json
{
  "success": true,
  "data": {
    "overall_health_score": 98.4,
    "metrics_evaluated": 24,
    "completeness_by_table": [
      { "table": "direct_tax_collections", "total_records": 10, "completeness_pct": 100.0 },
      { "table": "state_tax_collections", "total_records": 360, "completeness_pct": 98.6 },
      { "table": "itr_filings", "total_records": 70, "completeness_pct": 99.1 },
      { "table": "income_slab_distributions", "total_records": 60, "completeness_pct": 100.0 }
    ],
    "reconciliation_status": {
      "balance_equation": "Gross Collection - Refunds == Net Collection",
      "records_checked": 10,
      "discrepancies_found": 0,
      "status": "PASSED"
    },
    "anomalies_detected": [
      {
        "type": "OUTLIER_GROWTH",
        "financial_year": "2021-22",
        "metric": "yoy_net_growth",
        "value": "+49.1%",
        "explanation": "Post-COVID base effect rebound acknowledged by official CBDT bulletin"
      }
    ],
    "missing_values_report": []
  }
}
```

---

### 2.8 Dataset Management
#### `POST /api/datasets/upload`
- **Purpose**: Upload `.csv` or `.xlsx` dataset with MIME validation and size constraint ($\le 15$ MB).
- **Request**: `multipart/form-data` with field `file` and optional `description`.
- **Response** (HTTP 201):
```json
{
  "success": true,
  "data": {
    "id": "c7a8b9f0-21a4-4f8e-90f2-b88d30e18921",
    "filename": "cbdt_state_collections_2023.csv",
    "file_type": "csv",
    "file_size_bytes": 45120,
    "status": "uploaded",
    "uploaded_at": "2026-11-05T14:35:00Z"
  }
}
```

#### `GET /api/datasets`
- **Purpose**: List all uploaded and system datasets.
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "system-default-cbdt-time-series",
      "filename": "official_cbdt_time_series_2014_2023.csv",
      "file_type": "csv",
      "file_size_bytes": 12840,
      "status": "processed",
      "record_count": 10,
      "description": "CBDT Official Direct Tax Historical Time Series",
      "uploaded_at": "2026-11-05T00:00:00Z"
    }
  ]
}
```

#### `GET /api/datasets/{id}/preview`
- **Purpose**: Preview column headers and first 100 rows.
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "system-default-cbdt-time-series",
    "columns": ["financial_year", "assessment_year", "corporation_tax", "personal_income_tax", "gross_collection", "refunds", "net_collection"],
    "total_rows": 10,
    "preview_rows": [
      {
        "financial_year": "2022-23",
        "assessment_year": "2023-24",
        "corporation_tax": 825834.0,
        "personal_income_tax": 833307.0,
        "gross_collection": 1968780.0,
        "refunds": 307352.0,
        "net_collection": 1661428.0
      }
    ]
  }
}
```

#### `POST /api/datasets/{id}/process`
- **Purpose**: Validate and ingest staged dataset into the active database.
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "c7a8b9f0-21a4-4f8e-90f2-b88d30e18921",
    "status": "processed",
    "records_ingested": 36,
    "warnings": []
  }
}
```

---

### 2.9 Reporting & Dossier Generation
#### `GET /api/reports/pdf`
- **Purpose**: Stream executive PDF dossier generated via ReportLab.
- **Query Parameters**:
  - `financial_year` (string, optional, e.g., `"2022-23"`)
- **Headers**:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="TaxInsight_Executive_Briefing_2022-23.pdf"`

#### `GET /api/reports/excel`
- **Purpose**: Stream multi-tab Excel workbook generated via OpenPyXL.
- **Query Parameters**:
  - `financial_year` (string, optional, e.g., `"2022-23"`)
- **Headers**:
  - `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - `Content-Disposition: attachment; filename="TaxInsight_Analytics_Report_2022-23.xlsx"`
