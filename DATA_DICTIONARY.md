# TaxInsight – Domain Data Dictionary & Sources (DATA_DICTIONARY.md)

## 1. Domain Foundations: Indian Direct Taxation

### 1.1 Temporal Conventions: FY vs. AY
A foundational distinction in Indian public finance and taxation:
- **Financial Year (FY)**: The twelve-month period running from **1st April to 31st March** during which income is accrued or earned. For example, income earned between 1 April 2022 and 31 March 2023 belongs to **FY 2022-23**.
- **Assessment Year (AY)**: The immediately succeeding twelve-month period (1st April to 31st March) during which the income earned in the preceding Financial Year is evaluated, returns are filed, and assessment is completed.
  $$\text{Assessment Year} = \text{Financial Year} + 1 \text{ year}$$
  *Example*: Income earned in **FY 2022-23** is filed and assessed in **AY 2023-24**.

---

## 2. Tax Classification & Nomenclature

| Term | Domain Definition | Mathematical / Accounting Identity | Unit |
| :--- | :--- | :--- | :--- |
| **Gross Direct Tax Collection** | Total direct taxes collected prior to refund disbursement. | $\text{Gross} = \text{Net} + \text{Refunds}$ | ₹ Crore |
| **Tax Refunds** | Excess advance tax, TDS, or TCS returned to taxpayers upon assessment. | Disbursed by CBDT via SBI refund banker | ₹ Crore |
| **Net Direct Tax Collection** | Sovereign direct tax revenue retained in the Consolidated Fund of India. | $\text{Net} = \text{Gross} - \text{Refunds}$ | ₹ Crore |
| **Corporation Tax (CIT)** | Direct tax levied on the net taxable profits of domestic and foreign companies under the Income-tax Act, 1961. | Slabs under Sec 115BAA (22%), 115BAB (15%), or standard (25%/30%) + surcharge + cess | ₹ Crore |
| **Personal Income Tax (PIT)** | Direct tax levied on the income of individuals, HUFs, partnership firms, and associations. | Progressive tax slabs under Old & New Tax Regimes (Sec 115BAC) | ₹ Crore |
| **Securities Transaction Tax (STT)** | Turnover tax on transactions executed on recognized stock exchanges in equities and derivatives. | Levied at prescribed rates on purchase/sale value | ₹ Crore |
| **Cost of Collection** | Administrative expenditure of the Income Tax Department per ₹100 of direct tax revenue realized. | $(\text{Total ITD Expenditure} / \text{Total Direct Tax Collection}) \times 100$ | Percentage (%) |
| **Direct Tax Buoyancy** | Responsiveness of tax collections to economic expansion without adjusting for discretionary policy shifts. | $\text{Buoyancy} = \frac{\% \Delta \text{ Direct Tax Collection}}{\% \Delta \text{ Nominal GDP}}$ | Dimensionless Ratio |
| **Tax-to-GDP Ratio** | Macroeconomic indicator measuring the proportion of national output contributed by direct taxes. | $(\text{Net Direct Tax} / \text{Nominal GDP}) \times 100$ | Percentage (%) |

---

## 3. Statutory ITR Form Architecture

Indian tax returns are partitioned by income source complexity and taxpayer legal status:

| Form Designation | Statutory Title | Eligible Taxpayer Category | Income Eligibility Criteria |
| :--- | :--- | :--- | :--- |
| **ITR-1** | *Sahaj* | Resident Individuals | Total income up to ₹50 Lakh from Salary, One House Property, Other Sources (interest), and Agricultural income up to ₹5,000. |
| **ITR-2** | Non-Business Return | Individuals and HUFs | Income exceeding ₹50 Lakh, capital gains, foreign assets, or multiple house properties (no business/profession profits). |
| **ITR-3** | Business Proprietary | Individuals and HUFs | Taxpayers having taxable income derived from proprietary business or profession. |
| **ITR-4** | *Sugam* | Individuals, HUFs, Firms (other than LLP) | Small businesses and professionals opting for presumptive taxation schemes under Sec 44AD, 44ADA, or 44AE. |
| **ITR-5** | Non-Corporate Entities | Partnership Firms, LLPs, AOPs, BOIs, Estates | Artificial juridical persons, co-operative societies, and business trusts. |
| **ITR-6** | Corporate Return | Companies registered under Companies Act | All corporate entities other than those claiming charitable exemptions under Sec 11. |
| **ITR-7** | Institutional & Trust Return | Trusts, Political Parties, Colleges, Research Bodies | Entities furnishing returns under Sec 139(4A), 139(4B), 139(4C), or 139(4D). |

---

## 4. Inequality & Statistical Metrics

| Metric | Scientific Formulation | Analytical Interpretation |
| :--- | :--- | :--- |
| **Gini Coefficient ($G$)** | $G = \frac{\sum_{i=1}^n \sum_{j=1}^n |y_i - y_j|}{2n^2 \bar{y}}$ | Measures inequality in returned taxable income ($0.0 = \text{perfect equality}$, $1.0 = \text{extreme inequality}$). |
| **Lorenz Curve Coordinates** | $(L_p, L_y) = \left(\frac{i}{n}, \frac{\sum_{k=1}^i y_{(k)}}{\sum_{k=1}^n y_k}\right)$ | Cumulative percentage of filers vs. cumulative percentage of returned income. |
| **Palma Ratio** | $\frac{\text{Share of Top 10\% Income}}{\text{Share of Bottom 40\% Income}}$ | Structural disparity ratio focusing on the extreme tails of the distribution. |
| **Skewness ($\gamma_1$)** | $\mathbb{E}\left[\left(\frac{X - \mu}{\sigma}\right)^3\right]$ | Asymmetry of income distribution; positive skew ($\gamma_1 > 0$) signifies long right tail of high earners. |
| **Kurtosis ($\beta_2$)** | $\mathbb{E}\left[\left(\frac{X - \mu}{\sigma}\right)^4\right]$ | Leptokurtic concentration ($\beta_2 > 3$) indicating extreme outlier income clusters. |

---

## 5. Primary Official Sources & Citations

All baseline datasets bundled with TaxInsight are derived directly from published Indian statistical repositories:
1. **Central Board of Direct Taxes (CBDT)**:
   - *Time Series Data (Direct Taxes)*, Ministry of Finance, Government of India.
   - *Direct Tax Statistics Reports* (Annual Publications).
2. **Income Tax Department Directorate of Systems**:
   - Monthly & Annual E-Filing Statistics Bulletin.
3. **Ministry of Statistics and Programme Implementation (MOSPI)**:
   - Central Statistics Office (CSO) National Accounts Statistics (Nominal GDP estimates).
4. **Union Budget Documents**:
   - Ministry of Finance Receipt Budget (Annexure 1: Direct Taxes Trend).

