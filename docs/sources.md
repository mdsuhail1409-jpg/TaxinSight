# Data Sources & Ingestion Pipeline

This document outlines primary data sources, ingestion frequencies, and protocols for TaxinSight.

## Primary Sources
1. **Internal Transaction Logs**:
   - Location: `data/raw/`
   - Format: CSV / Parquet
   - Updates: Batch ingestion
2. **Reference Tax Schedules & Rate Tables**:
   - Regulatory schedules and threshold tables used by calculation engines.
3. **Synthetic / Benchmark Datasets**:
   - Location: `data/sample/`
   - Used for development, testing, and UI preview rendering.

## Ingestion Guidelines
- Raw data stored in `data/raw/` must remain immutable.
- Transformation scripts clean, validate, and write output to `data/processed/`.
- Schema validation is enforced via Pydantic schemas prior to ingestion into the serving layer.
