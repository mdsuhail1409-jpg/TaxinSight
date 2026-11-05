import os
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
        # Determine base directory for data files
        # Check current dir, ../data, ../../data
        candidate_dirs = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "sample")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "sample")),
            os.path.abspath(os.path.join(os.getcwd(), "data", "sample")),
            os.path.abspath(os.path.join(os.getcwd(), "..", "data", "sample")),
        ]
        sample_dir = None
        for d in candidate_dirs:
            if os.path.isdir(d):
                sample_dir = d
                break

        if not sample_dir:
            print("Warning: Sample data directory not located. Skipping CSV seed.")
            return

        # 1. Seed Direct Tax Collections
        if db.query(DirectTaxCollection).count() == 0:
            csv_path = os.path.join(sample_dir, "official_cbdt_time_series.csv")
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                for _, row in df.iterrows():
                    obj = DirectTaxCollection(
                        financial_year=str(row["financial_year"]),
                        assessment_year=str(row["assessment_year"]),
                        corporation_tax=float(row["corporation_tax"]),
                        personal_income_tax=float(row["personal_income_tax"]),
                        other_direct_taxes=float(row.get("other_direct_taxes", 0.0)) if pd.notna(row.get("other_direct_taxes")) else 0.0,
                        gross_collection=float(row["gross_collection"]),
                        refunds=float(row["refunds"]),
                        net_collection=float(row["net_collection"]),
                        cost_of_collection_pct=float(row["cost_of_collection_pct"]) if pd.notna(row.get("cost_of_collection_pct")) else None,
                        gdp_current_prices=float(row["gdp_current_prices"]) if pd.notna(row.get("gdp_current_prices")) else None,
                        direct_tax_buoyancy=float(row["direct_tax_buoyancy"]) if pd.notna(row.get("direct_tax_buoyancy")) else None,
                    )
                    db.add(obj)
                db.commit()
                print(f"Seeded {len(df)} records into DirectTaxCollection.")

        # 2. Seed State Tax Collections
        if db.query(StateTaxCollection).count() == 0:
            csv_path = os.path.join(sample_dir, "state_collections.csv")
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                for _, row in df.iterrows():
                    obj = StateTaxCollection(
                        financial_year=str(row["financial_year"]),
                        assessment_year=str(row["assessment_year"]),
                        state_ut_name=str(row["state_ut_name"]),
                        zone=str(row["zone"]),
                        corporation_tax=float(row["corporation_tax"]) if pd.notna(row.get("corporation_tax")) else None,
                        personal_income_tax=float(row["personal_income_tax"]) if pd.notna(row.get("personal_income_tax")) else None,
                        total_collection=float(row["total_collection"]),
                        national_share_pct=float(row["national_share_pct"]) if pd.notna(row.get("national_share_pct")) else None,
                    )
                    db.add(obj)
                db.commit()
                print(f"Seeded {len(df)} records into StateTaxCollection.")

        # 3. Seed ITR Filings
        if db.query(ITRFiling).count() == 0:
            csv_path = os.path.join(sample_dir, "itr_filings.csv")
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                for _, row in df.iterrows():
                    obj = ITRFiling(
                        assessment_year=str(row["assessment_year"]),
                        financial_year=str(row["financial_year"]),
                        itr_form=str(row["itr_form"]),
                        filer_category=str(row["filer_category"]),
                        number_of_returns=int(row["number_of_returns"]),
                        gross_income_reported=float(row["gross_income_reported"]) if pd.notna(row.get("gross_income_reported")) else None,
                        total_tax_payable=float(row["total_tax_payable"]) if pd.notna(row.get("total_tax_payable")) else None,
                    )
                    db.add(obj)
                db.commit()
                print(f"Seeded {len(df)} records into ITRFiling.")

        # 4. Seed Income Slab Distributions
        if db.query(IncomeSlabDistribution).count() == 0:
            csv_path = os.path.join(sample_dir, "income_slabs.csv")
            if os.path.exists(csv_path):
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
                print(f"Seeded {len(df)} records into IncomeSlabDistribution.")

        # 5. Default Dataset Metadata
        if db.query(DatasetMetadata).count() == 0:
            meta = DatasetMetadata(
                id="cbdt-official-time-series-baseline",
                filename="official_cbdt_time_series.csv",
                file_type="csv",
                file_size_bytes=1024,
                status="processed",
                record_count=9,
                description="CBDT Official Direct Tax Time Series Baseline (FY 2014-15 to FY 2022-23)",
                validation_log='{"status": "VALID", "reconciliation": "PASSED"}'
            )
            db.add(meta)
            db.commit()

    finally:
        if close_at_end:
            db.close()


if __name__ == "__main__":
    seed_database()
