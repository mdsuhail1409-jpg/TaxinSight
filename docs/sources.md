# Data Sources Register (docs/sources.md)

This document records the official provenance, publication details, URLs, and extraction dates for all Indian direct tax statistics incorporated into TaxInsight.

---

## 1. Central Board of Direct Taxes (CBDT) Time Series Data

- **Source Title**: *Time Series Data (Direct Taxes) - Table 1.1, Table 1.2, Table 2.1*
- **Publishing Entity**: Central Board of Direct Taxes (CBDT), Department of Revenue, Ministry of Finance, Government of India
- **Official URL**: [https://incometaxindia.gov.in/Pages/direct-taxes-data.aspx](https://incometaxindia.gov.in/Pages/direct-taxes-data.aspx)
- **Publication Frequency**: Annual
- **Latest Publication Date**: January 2024 (Data coverage up to FY 2022-23 and provisional figures for FY 2023-24)
- **Extraction Date**: 2026-11-05
- **Extracted Datasets**:
  - `data/raw/raw_cbdt_time_series_direct_taxes_2000_2024.csv`
  - `data/processed/annual_tax_collection.csv`
- **Key Metrics Extracted**:
  - Corporation Tax (CIT) collections (₹ Crore)
  - Personal Income Tax (PIT) collections (₹ Crore)
  - Other Direct Taxes (Securities Transaction Tax, Equalisation Levy, Wealth Tax) (₹ Crore)
  - Gross Direct Tax Collections (₹ Crore)
  - Tax Refunds Disbursed (₹ Crore)
  - Net Direct Tax Collections (₹ Crore)
  - Cost of Collection percentage (%)
  - Direct Tax Buoyancy relative to Nominal GDP

---

## 2. CBDT State / UT Disaggregated Direct Tax Collections

- **Source Title**: *State-wise / Region-wise Gross and Net Direct Tax Collections (Table 3.1)*
- **Publishing Entity**: Central Board of Direct Taxes (CBDT), Directorate of Income Tax (Research, Statistics & Publications)
- **Official URL**: [https://incometaxindia.gov.in/Pages/direct-taxes-data.aspx](https://incometaxindia.gov.in/Pages/direct-taxes-data.aspx)
- **Publication Date**: Annual release (Latest audited: Assessment Year 2023-24 / Financial Year 2022-23)
- **Extraction Date**: 2026-11-05
- **Extracted Datasets**:
  - `data/raw/raw_cbdt_state_wise_collections_2020_2023.csv`
  - `data/processed/state_tax_collection.csv`
- **Critical Methodological Caveat**:
  - Collections are credited to the state/UT corresponding to the jurisdiction of the assessing officer / Principal Chief Commissioner of Income Tax (Pr. CCIT) where the return is filed.
  - Due to corporate headquarters clustering in Mumbai (Maharashtra), New Delhi (Delhi), and Bengaluru (Karnataka), corporate tax collections are heavily concentrated in these metropolitan collection circles and do not reflect state-level economic incidence or consumption.

---

## 3. Directorate of Systems – e-Filing Return Statistics

- **Source Title**: *e-Filing Statistics - Form-wise Filing Breakdown & Taxpayer Demographics*
- **Publishing Entity**: Directorate of Systems, Income Tax Department, Ministry of Finance
- **Official URL**: [https://eportal.incometax.gov.in/iec/foservices/#/dashboard](https://eportal.incometax.gov.in/iec/foservices/#/dashboard)
- **Publication Frequency**: Real-time bulletin & annual consolidated release
- **Extraction Date**: 2026-11-05
- **Extracted Datasets**:
  - `data/raw/raw_cbdt_efiling_itr_form_statistics_2020_2024.csv`
  - `data/raw/raw_cbdt_return_filers_demographics_2020_2024.csv`
  - `data/processed/itr_filing_statistics.csv`
  - `data/processed/return_filer_statistics.csv`
- **Key Metrics Extracted**:
  - Total Returns Filed across ITR-1 (Sahaj), ITR-2, ITR-3, ITR-4 (Sugam), ITR-5, ITR-6, and ITR-7
  - Breakdown by taxpayer entity status: Individuals, HUFs, Partnership Firms/LLPs, Companies, Trusts
  - Tax-paying filers vs. Nil-tax filers (eligible for rebate under Sec 87A)
  - Aggregate gross total income and net tax liability returned

---

## 4. CBDT Broad Taxpayer Base & PAN Allotment Statistics

- **Source Title**: *Taxpayer Base and PAN Statistics (Table 4.1)*
- **Publishing Entity**: Central Board of Direct Taxes, Ministry of Finance
- **Official URL**: [https://incometaxindia.gov.in/Pages/direct-taxes-data.aspx](https://incometaxindia.gov.in/Pages/direct-taxes-data.aspx)
- **Extraction Date**: 2026-11-05
- **Extracted Datasets**:
  - `data/raw/raw_cbdt_taxpayer_base_statistics_2015_2024.csv`
  - `data/processed/taxpayer_statistics.csv`
- **Key Metrics Extracted**:
  - Effective Taxpayer Base (Filers + Non-filing TDS/TCS deductors)
  - Return Filers Count
  - TDS/TCS Non-Filers Count
  - Cumulative PAN Cards Allotted

---

## 5. Central Statistics Office (CSO) & Union Budget Documents

- **Source Title**: *National Accounts Statistics (Nominal GDP at Current Prices)* & *Union Receipt Budget*
- **Publishing Entity**: Ministry of Statistics and Programme Implementation (MOSPI) & Department of Economic Affairs, Ministry of Finance
- **Official URLs**:
  - [https://www.mospi.gov.in](https://www.mospi.gov.in)
  - [https://www.indiabudget.gov.in](https://www.indiabudget.gov.in)
- **Extraction Date**: 2026-11-05
- **Role in Project**: Used as the authoritative denominator for calculating Direct Tax Buoyancy and Direct Tax-to-GDP percentages.
