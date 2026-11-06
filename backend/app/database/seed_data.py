import os
import sys

# Ensure backend root is in sys.path so 'import app...' works regardless of invocation method
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.abspath(os.path.join(current_dir, "..", ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

import pandas as pd
from sqlalchemy.orm import Session
from app.database.session import engine, Base, SessionLocal
from app.models.tax_data import (
    DirectTaxCollection,
    StateTaxCollection,
    ITRFiling,
    IncomeSlabDistribution,
)
from app.models.dataset import DatasetMetadata


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_database(db: Session = None):
    init_db()
    close_at_end = False
    if db is None:
        db = SessionLocal()
        close_at_end = True

    try:
        # Determine candidate directories for data files (processed first, then sample)
        candidate_dirs = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "sample")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "sample")),
            os.path.abspath(os.path.join(os.getcwd(), "data", "processed")),
            os.path.abspath(os.path.join(os.getcwd(), "data", "sample")),
        ]
        target_dir = None
        for d in candidate_dirs:
            if os.path.isdir(d):
                target_dir = d
                break

        if not target_dir:
            print("Warning: Processed/sample data directory not located. Skipping seed.")
            return

        # Helper to find file by candidates
        def find_file(filenames):
            for fname in filenames:
                for base in candidate_dirs:
                    p = os.path.join(base, fname)
                    if os.path.exists(p):
                        return p
            return None

        # 1. Seed Direct Tax Collections
        if db.query(DirectTaxCollection).count() == 0:
            csv_path = find_file(["annual_tax_collection.csv", "official_cbdt_time_series.csv"])
            if csv_path:
                df = pd.read_csv(csv_path)
                for _, row in df.iterrows():
                    corp = row.get("corporation_tax_crore", row.get("corporation_tax"))
                    pit = row.get("personal_income_tax_crore", row.get("personal_income_tax"))
                    other = row.get("other_direct_taxes_crore", row.get("other_direct_taxes", 0.0))
                    gross = row.get("gross_collection_crore", row.get("gross_collection"))
                    refunds = row.get("refunds_crore", row.get("refunds"))
                    net = row.get("net_collection_crore", row.get("net_collection"))
                    gdp = row.get("nominal_gdp_crore", row.get("gdp_current_prices"))
                    
                    obj = DirectTaxCollection(
                        financial_year=str(row["financial_year"]),
                        assessment_year=str(row["assessment_year"]),
                        corporation_tax=float(corp),
                        personal_income_tax=float(pit),
                        other_direct_taxes=float(other) if pd.notna(other) else 0.0,
                        gross_collection=float(gross),
                        refunds=float(refunds),
                        net_collection=float(net),
                        cost_of_collection_pct=float(row["cost_of_collection_pct"]) if pd.notna(row.get("cost_of_collection_pct")) else None,
                        gdp_current_prices=float(gdp) if pd.notna(gdp) else None,
                        direct_tax_buoyancy=float(row["direct_tax_buoyancy"]) if pd.notna(row.get("direct_tax_buoyancy")) else None,
                    )
                    db.add(obj)
                db.commit()
                print(f"Seeded {len(df)} records into DirectTaxCollection from {os.path.basename(csv_path)}.")

        # 2. Seed State Tax Collections
        if db.query(StateTaxCollection).count() == 0:
            csv_path = find_file(["state_tax_collection.csv", "state_collections.csv"])
            if csv_path:
                df = pd.read_csv(csv_path)
                for _, row in df.iterrows():
                    corp = row.get("corporation_tax_crore", row.get("corporation_tax"))
                    pit = row.get("personal_income_tax_crore", row.get("personal_income_tax"))
                    total = row.get("total_collection_crore", row.get("total_collection"))
                    
                    obj = StateTaxCollection(
                        financial_year=str(row["financial_year"]),
                        assessment_year=str(row["assessment_year"]),
                        state_ut_name=str(row["state_ut_name"]),
                        zone=str(row["zone"]),
                        corporation_tax=float(corp) if pd.notna(corp) else None,
                        personal_income_tax=float(pit) if pd.notna(pit) else None,
                        total_collection=float(total),
                        national_share_pct=float(row["national_share_pct"]) if pd.notna(row.get("national_share_pct")) else None,
                    )
                    db.add(obj)
                db.commit()
                print(f"Seeded {len(df)} records into StateTaxCollection from {os.path.basename(csv_path)}.")

        # 3. Seed ITR Filings
        if db.query(ITRFiling).count() == 0:
            csv_path = find_file(["itr_filing_statistics.csv", "itr_filings.csv"])
            if csv_path:
                df = pd.read_csv(csv_path)
                for _, row in df.iterrows():
                    cnt = row.get("number_of_returns_filed", row.get("number_of_returns"))
                    inc = row.get("gross_income_reported_crore", row.get("gross_income_reported"))
                    tax = row.get("total_tax_payable_crore", row.get("total_tax_payable"))

                    obj = ITRFiling(
                        assessment_year=str(row["assessment_year"]),
                        financial_year=str(row["financial_year"]),
                        itr_form=str(row["itr_form"]),
                        filer_category=str(row["filer_category"]),
                        number_of_returns=int(cnt),
                        gross_income_reported=float(inc) if pd.notna(inc) else None,
                        total_tax_payable=float(tax) if pd.notna(tax) else None,
                    )
                    db.add(obj)
                db.commit()
                print(f"Seeded {len(df)} records into ITRFiling from {os.path.basename(csv_path)}.")

        # 4. Seed Income Slab Distributions
        if db.query(IncomeSlabDistribution).count() == 0:
            csv_path = find_file(["income_slabs.csv"])
            if csv_path:
                df = pd.read_csv(csv_path)
                for _, row in df.iterrows():
                    obj = IncomeSlabDistribution(
                        assessment_year=str(row["assessment_year"]),
                        slab_label=str(row["slab_label"]),
                        slab_min=float(row["slab_min"]),
                        slab_max=float(row["slab_max"]) if pd.notna(row.get("slab_max")) else None,
                        number_of_filers=int(row["number_of_filers"]),
                        total_taxable_income=float(row["total_taxable_income"]),
                        total_tax_liability=float(row["total_tax_liability"]),
                    )
                    db.add(obj)
                db.commit()
                print(f"Seeded {len(df)} records into IncomeSlabDistribution from {os.path.basename(csv_path)}.")

        # 5. Default Datasets Metadata
        if db.query(DatasetMetadata).count() <= 1:
            default_meta_items = [
                ("annual_tax_collection.csv", "CBDT Official Direct Tax Time Series (FY 2010-11 to FY 2023-24)", 14),
                ("state_tax_collection.csv", "CBDT State & UT Direct Tax Collections by Assessing Circles", 36),
                ("itr_filing_statistics.csv", "CBDT e-Filing Portal Returns Filed by ITR Form & Entity Status", 24),
                ("return_filer_statistics.csv", "Return Filers, Tax-Paying Filers & Nil-Tax Return Statistics", 15),
                ("taxpayer_statistics.csv", "Effective Taxpayer Base, TDS Non-Filers & Cumulative PAN Allotments", 9),
            ]
            for fname, desc, cnt in default_meta_items:
                fid = f"cbdt-official-{fname.replace('.csv', '')}"
                if not db.query(DatasetMetadata).filter(DatasetMetadata.id == fid).first():
                    meta = DatasetMetadata(
                        id=fid,
                        filename=fname,
                        file_type="csv",
                        file_size_bytes=2048,
                        status="processed",
                        record_count=cnt,
                        description=desc,
                        validation_log='{"status": "VALID", "reconciliation": "PASSED"}'
                    )
                    db.add(meta)
            db.commit()

    finally:
        if close_at_end:
            db.close()


if __name__ == "__main__":
    seed_database()
