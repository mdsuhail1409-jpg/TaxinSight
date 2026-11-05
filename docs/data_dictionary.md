# Master Data Dictionary (docs/data_dictionary.md)

This data dictionary provides precise field-level definitions, measurement units, reporting temporalities, mathematical formulations, and source references for all processed datasets in TaxInsight.

---

## 1. Dataset: `annual_tax_collection.csv`

- **Location**: `data/processed/annual_tax_collection.csv`
- **Primary Key**: `financial_year`
- **Granularity**: Annual National Direct Tax Aggregates

| Field Name | Data Type | Measurement Unit | Reporting Period | Official Source | Definition & Accounting Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `financial_year` | String (YYYY-YY) | Temporal Code | Financial Year (1 Apr - 31 Mar) | CBDT Table 1.1 | The fiscal year during which sovereign direct taxes were collected into the Consolidated Fund of India. |
| `assessment_year` | String (YYYY-YY) | Temporal Code | Assessment Year (FY + 1) | Income-tax Act, 1961 | The immediately succeeding year in which returns are assessed. Identifies $\text{AY} = \text{FY} + 1$. |
| `corporation_tax_crore` | Float | ₹ Crore ($10^7$ INR) | Financial Year | CBDT Table 1.1 | Total direct taxes collected from corporate entities (domestic and multinational companies). |
| `personal_income_tax_crore` | Float | ₹ Crore ($10^7$ INR) | Financial Year | CBDT Table 1.1 | Direct taxes collected from individuals, HUFs, partnership firms, and non-corporate entities. |
| `other_direct_taxes_crore` | Float | ₹ Crore ($10^7$ INR) | Financial Year | CBDT Table 1.1 | Aggregate of Securities Transaction Tax (STT), Equalisation Levy, and historical wealth taxes. |
| `gross_collection_crore` | Float | ₹ Crore ($10^7$ INR) | Financial Year | CBDT Table 1.1 | Total tax receipts collected before refund deductions: $\text{Gross} = \text{Net} + \text{Refunds}$. |
| `refunds_crore` | Float | ₹ Crore ($10^7$ INR) | Financial Year | CBDT Table 1.1 | Total excess advance tax, TDS, and TCS disbursed back to taxpayers by CBDT. |
| `net_collection_crore` | Float | ₹ Crore ($10^7$ INR) | Financial Year | CBDT Table 1.1 | Net direct tax revenue retained: $\text{Net} = \text{Gross} - \text{Refunds}$. Reconciled strictly to ₹1 Crore. |
| `cost_of_collection_pct` | Float | Percentage (%) | Financial Year | CBDT Table 2.1 | Administrative expenditure of the Income Tax Department per ₹100 of direct tax collected. |
| `nominal_gdp_crore` | Float | ₹ Crore ($10^7$ INR) | Financial Year | CSO / MOSPI | Gross Domestic Product at current market prices. |
| `tax_to_gdp_ratio_pct` | Float | Percentage (%) | Financial Year | CBDT / MOSPI | Net Direct Tax Collection expressed as a percentage of Nominal GDP. |
| `direct_tax_buoyancy` | Float | Elasticity Ratio | Financial Year | CBDT Table 2.1 | Responsiveness ratio: $(\% \Delta \text{Net Direct Tax}) / (\% \Delta \text{Nominal GDP})$. |

---

## 2. Dataset: `state_tax_collection.csv`

- **Location**: `data/processed/state_tax_collection.csv`
- **Composite Key**: `(financial_year, state_ut_name)`
- **Granularity**: State / Union Territory Collection Circles

| Field Name | Data Type | Measurement Unit | Reporting Period | Official Source | Definition & Accounting Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `financial_year` | String (YYYY-YY) | Temporal Code | Financial Year | CBDT Table 3.1 | Financial Year of collection. |
| `assessment_year` | String (YYYY-YY) | Temporal Code | Assessment Year | Income-tax Act, 1961 | Assessment Year corresponding to FY ($\text{FY} + 1$). |
| `state_ut_name` | String | Geographic Name | State / UT | CBDT Table 3.1 | Standard administrative name of the Indian State or Union Territory. |
| `zone` | String | Categorical | Geographic Zone | Ministry of Home Affairs | Geo-administrative grouping: `West`, `North`, `South`, `East`, `Central`, `North-East`. |
| `corporation_tax_crore` | Float | ₹ Crore ($10^7$ INR) | Financial Year | CBDT Table 3.1 | Corporation tax booked in the state's assessing charge. Null if not reported separately. |
| `personal_income_tax_crore` | Float | ₹ Crore ($10^7$ INR) | Financial Year | CBDT Table 3.1 | Personal income tax booked in the state's assessing charge. |
| `other_direct_taxes_crore` | Float | ₹ Crore ($10^7$ INR) | Financial Year | CBDT Table 3.1 | STT and other minor taxes collected in the state. |
| `total_collection_crore` | Float | ₹ Crore ($10^7$ INR) | Financial Year | CBDT Table 3.1 | Sum of direct taxes collected in the state: $\text{CIT} + \text{PIT} + \text{Other}$. |
| `national_share_pct` | Float | Percentage (%) | Financial Year | Derived | State collection divided by total national collection ($\sum \text{National Share} = 100\%$). |

---

## 3. Dataset: `itr_filing_statistics.csv`

- **Location**: `data/processed/itr_filing_statistics.csv`
- **Composite Key**: `(assessment_year, itr_form, filer_category)`
- **Granularity**: Statutory Form by Filer Status

| Field Name | Data Type | Measurement Unit | Reporting Period | Official Source | Definition & Accounting Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `assessment_year` | String (YYYY-YY) | Temporal Code | Assessment Year | e-Filing Portal | Assessment Year in which returns were submitted. |
| `financial_year` | String (YYYY-YY) | Temporal Code | Financial Year | Income-tax Act, 1961 | Financial Year in which the reported income was earned ($\text{AY} - 1$). |
| `itr_form` | String | Statutory Designation | Form Type | Income Tax Rules, 1962 | Return form code: `ITR-1 (Sahaj)`, `ITR-2`, `ITR-3`, `ITR-4 (Sugam)`, `ITR-5`, `ITR-6`, `ITR-7`. |
| `filer_category` | String | Legal Entity Status | Taxpayer Status | Income-tax Act, 1961 | Legal constitution: `Individual`, `HUF`, `Firms and LLPs`, `Companies`, `Trusts and Institutions`. |
| `number_of_returns_filed`| Integer | Count | Assessment Year | e-Filing Portal | Total count of successfully verified returns submitted using this form. |
| `gross_income_reported_crore`| Float | ₹ Crore ($10^7$ INR) | Assessment Year | e-Filing Portal | Aggregate Gross Total Income (GTI) declared before Chapter VI-A deductions. |
| `total_tax_payable_crore` | Float | ₹ Crore ($10^7$ INR) | Assessment Year | e-Filing Portal | Net aggregate tax liability payable after rebates and relief under Sec 87A/89. |
| `filing_mode` | String | Channel Code | Filing Channel | e-Filing Portal | Standardized as `e-Filing` (100% electronic return submission). |

---

## 4. Dataset: `return_filer_statistics.csv`

- **Location**: `data/processed/return_filer_statistics.csv`
- **Composite Key**: `(assessment_year, taxpayer_entity_type)`
- **Granularity**: Taxpayer Legal Entity Class

| Field Name | Data Type | Measurement Unit | Reporting Period | Official Source | Definition & Accounting Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `assessment_year` | String (YYYY-YY) | Temporal Code | Assessment Year | CBDT e-Filing | Assessment Year of return lodgement. |
| `financial_year` | String (YYYY-YY) | Temporal Code | Financial Year | Income-tax Act, 1961 | Financial Year of earned income ($\text{AY} - 1$). |
| `taxpayer_entity_type` | String | Entity Class | Taxpayer Category | CBDT Table 4.1 | Classification: `Individual`, `HUF`, `Partnership_Firm`, `Company`, `AOP_BOI_Trust`. |
| `unique_return_filers` | Integer | Entity Count | Assessment Year | CBDT e-Filing | Number of unique PAN holders who submitted at least one return. |
| `total_returns_filed` | Integer | Form Count | Assessment Year | CBDT e-Filing | Gross returns lodged (includes original, revised under Sec 139(5), and belated returns). |
| `tax_paying_filers` | Integer | Entity Count | Assessment Year | CBDT e-Filing | Unique filers whose computed net tax liability after deductions and Sec 87A rebate is $> 0$. |
| `nil_tax_filers` | Integer | Entity Count | Assessment Year | CBDT e-Filing | Unique filers with zero net tax payable (income within exemption threshold or rebate covered). |
| `nil_tax_filers_pct` | Float | Percentage (%) | Assessment Year | Derived | $(\text{Nil Tax Filers} / \text{Unique Return Filers}) \times 100$. Approx 65% for Individuals. |
| `aggregate_returned_income_crore`| Float | ₹ Crore ($10^7$ INR) | Assessment Year | CBDT e-Filing | Total taxable income returned by this legal entity class. |
| `aggregate_tax_payable_crore` | Float | ₹ Crore ($10^7$ INR) | Assessment Year | CBDT e-Filing | Total net tax payable assessed across this legal entity class. |

---

## 5. Dataset: `taxpayer_statistics.csv`

- **Location**: `data/processed/taxpayer_statistics.csv`
- **Primary Key**: `assessment_year`
- **Granularity**: Macro Taxpayer Universe

| Field Name | Data Type | Measurement Unit | Reporting Period | Official Source | Definition & Accounting Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `assessment_year` | String (YYYY-YY) | Temporal Code | Assessment Year | CBDT Table 4.1 | Assessment Year. |
| `financial_year` | String (YYYY-YY) | Temporal Code | Financial Year | Income-tax Act, 1961 | Corresponding Financial Year ($\text{AY} - 1$). |
| `effective_taxpayer_base_crore`| Float | Crore Persons ($10^7$) | Assessment Year | CBDT Table 4.1 | Broader taxpayer base: $\text{Return Filers} + \text{TDS/TCS Non-Filers}$. |
| `return_filers_count_crore` | Float | Crore Persons ($10^7$) | Assessment Year | CBDT Table 4.1 | Number of unique entities filing an ITR in the Assessment Year. |
| `tds_tcs_non_filers_crore` | Float | Crore Persons ($10^7$) | Assessment Year | CBDT Table 4.1 | Persons who suffered TDS/TCS during the FY but were legally exempt from filing an ITR. |
| `pan_allotted_cumulative_crore`| Float | Crore Cards ($10^7$) | End of Fiscal Year | CBDT Table 4.1 | Cumulative Permanent Account Numbers allotted by the Income Tax Department. |
| `individual_taxpayers_pct` | Float | Percentage (%) | Assessment Year | CBDT Table 4.1 | Proportion of total effective taxpayers who are natural individuals (~96%). |
| `corporate_taxpayers_pct` | Float | Percentage (%) | Assessment Year | CBDT Table 4.1 | Proportion of total effective taxpayers who are corporate entities (~0.9% - 1.2%). |
