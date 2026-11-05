# TaxinSight - Project Specification

## 1. Overview
TaxinSight provides an interactive dashboard and data pipeline for analytical modeling, insights, and decision support.

## 2. Objectives
- Provide intuitive, high-performance dashboards for multi-dimensional data exploration.
- Enable granular filtering and statistical aggregation.
- Deliver clear API endpoints adhering to a well-defined contract.
- Support automated report generation and export capabilities.

## 3. Architecture & Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts / Charting library, Vite.
- **Backend**: FastAPI, Pydantic v2, Pandas, NumPy, Uvicorn.
- **Data Pipeline**: Raw ingest (`data/raw`), cleaning/aggregation (`data/processed`), quick mock & evaluation data (`data/sample`).
- **Documentation**: OpenAPI/Swagger auto-docs, Architecture decision records, Data Dictionary.

## 4. Key Milestones
1. **Repository & Workspace Setup**: Directory scaffold, package definitions, base application entry points.
2. **Data Pipeline & Schema Design**: Ingestion, schema definitions, sample data generation.
3. **Backend Service & Route Implementation**: Core computational endpoints, filters, aggregation services.
4. **Frontend UI & Visualizations**: Layout, interactive filter bars, metric KPI cards, dynamic charts.
5. **Testing & Integration**: End-to-end integration tests, performance benchmarking, documentation finalization.
