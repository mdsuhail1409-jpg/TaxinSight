# Data Dictionary

This document defines the schema, field descriptions, data types, and constraints used throughout TaxinSight.

| Field Name | Type | Description | Nullable | Example / Values |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string (UUID)` | Unique identifier for the record | No | `550e8400-e29b-41d4-a716-446655440000` |
| `timestamp` | `datetime` | Ingestion or event record timestamp | No | `2026-11-05T12:00:00Z` |
| `category` | `string` | Categorical classification | No | `Standard`, `Exempt`, `Supplemental` |
| `amount` | `float` | Base monetary or transactional quantity | No | `1250.75` |
| `tax_amount` | `float` | Calculated tax or surcharge value | No | `112.50` |
| `effective_rate` | `float` | Calculated percentage rate (`tax_amount / amount`) | Yes | `0.0899` |
| `status` | `string` | Record verification state | No | `pending`, `processed`, `flagged` |
| `metadata` | `json` | Arbitrary key-value metadata pairs | Yes | `{"region": "US-NY"}` |
