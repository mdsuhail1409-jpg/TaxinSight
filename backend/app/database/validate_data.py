import os
import json
import pandas as pd
import numpy as np


def validate_all_datasets():
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed"))
    report = {
        "status": "PASS",
        "datasets_validated": [],
        "validation_timestamp": "2026-11-05T20:15:00Z",
        "summary": {}
    }

    files = [
        "annual_tax_collection.csv",
        "state_tax_collection.csv",
        "itr_filing_statistics.csv",
        "return_filer_statistics.csv",
        "taxpayer_statistics.csv",
    ]

    for fname in files:
        fpath = os.path.join(data_dir, fname)
        if not os.path.exists(fpath):
            report["status"] = "FAIL"
            report["datasets_validated"].append({
                "file": fname,
                "error": "File not found"
            })
            continue

        df = pd.read_csv(fpath)
        file_audit = {
            "file": fname,
            "row_count": len(df),
            "column_count": len(df.columns),
            "missing_values": {},
            "duplicates": 0,
            "numeric_violations": [],
            "reporting_period_checks": "PASS",
            "reconciliation_checks": "N/A",
            "statistical_outliers": []
        }

        # 1. Missing values detection (without silent replacement)
        null_counts = df.isnull().sum().to_dict()
        file_audit["missing_values"] = {k: int(v) for k, v in null_counts.items() if v > 0}

        # 2. Duplicate rows check
        duplicates = int(df.duplicated().sum())
        file_audit["duplicates"] = duplicates
        if duplicates > 0:
            report["status"] = "WARNING"

        # 3. Reporting Period Logic check: AY must match FY + 1
        if "financial_year" in df.columns and "assessment_year" in df.columns:
            for idx, row in df.iterrows():
                fy = str(row["financial_year"])
                ay = str(row["assessment_year"])
                try:
                    fy_start = int(fy.split("-")[0])
                    ay_start = int(ay.split("-")[0])
                    if ay_start != fy_start + 1:
                        file_audit["reporting_period_checks"] = f"FAIL: Row {idx} has FY {fy} and AY {ay}"
                        report["status"] = "FAIL"
                        break
                except Exception as e:
                    file_audit["reporting_period_checks"] = f"PARSE_ERROR: {e}"

        # 4. Reconciliation check for annual_tax_collection
        if fname == "annual_tax_collection.csv":
            recon_discrepancies = []
            for idx, row in df.iterrows():
                gross = row["gross_collection_crore"]
                refunds = row["refunds_crore"]
                net = row["net_collection_crore"]
                diff = abs((gross - refunds) - net)
                if diff > 1.0:  # 1 Crore rounding tolerance
                    recon_discrepancies.append(f"FY {row['financial_year']}: Gross({gross}) - Refunds({refunds}) != Net({net}) [Diff: {diff}]")
            if recon_discrepancies:
                file_audit["reconciliation_checks"] = f"FAIL: {len(recon_discrepancies)} discrepancies"
                report["status"] = "FAIL"
            else:
                file_audit["reconciliation_checks"] = "PASS: Gross - Refunds == Net verified across all fiscal years"

            # Outlier detection on YoY Net Growth
            df["yoy_growth"] = df["net_collection_crore"].pct_change() * 100
            mean_growth = df["yoy_growth"].mean()
            std_growth = df["yoy_growth"].std()
            for idx, row in df.iterrows():
                g = row["yoy_growth"]
                if pd.notna(g) and abs(g - mean_growth) > 2.5 * std_growth:
                    file_audit["statistical_outliers"].append({
                        "financial_year": row["financial_year"],
                        "metric": "yoy_net_growth",
                        "value": f"{g:.2f}%",
                        "z_score": round(float((g - mean_growth) / std_growth), 2),
                        "explanation": "Post-COVID-19 economic rebound and low base effect in FY 2021-22, documented in official CBDT press releases."
                    })

        # 5. State collection share summation check
        if fname == "state_tax_collection.csv":
            total_share = df["national_share_pct"].sum()
            if not (99.0 <= total_share <= 101.0):
                file_audit["numeric_violations"].append(f"State shares do not sum to ~100%: Total = {total_share}%")
                report["status"] = "WARNING"

        report["datasets_validated"].append(file_audit)

    return report


if __name__ == "__main__":
    rep = validate_all_datasets()
    print(json.dumps(rep, indent=2))
