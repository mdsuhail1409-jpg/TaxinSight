from sqlalchemy import Column, Integer, String, Float
from app.database.session import Base


class DirectTaxCollection(Base):
    __tablename__ = "direct_tax_collections"

    financial_year = Column(String(10), primary_key=True, index=True)
    assessment_year = Column(String(10), nullable=False, index=True)
    corporation_tax = Column(Float, nullable=False)
    personal_income_tax = Column(Float, nullable=False)
    other_direct_taxes = Column(Float, nullable=True, default=0.0)
    gross_collection = Column(Float, nullable=False)
    refunds = Column(Float, nullable=False)
    net_collection = Column(Float, nullable=False)
    cost_of_collection_pct = Column(Float, nullable=True)
    gdp_current_prices = Column(Float, nullable=True)
    direct_tax_buoyancy = Column(Float, nullable=True)


class StateTaxCollection(Base):
    __tablename__ = "state_tax_collections"

    id = Column(Integer, primary_key=True, autoincrement=True)
    financial_year = Column(String(10), nullable=False, index=True)
    assessment_year = Column(String(10), nullable=False, index=True)
    state_ut_name = Column(String(100), nullable=False, index=True)
    zone = Column(String(50), nullable=False, index=True)
    corporation_tax = Column(Float, nullable=True)
    personal_income_tax = Column(Float, nullable=True)
    other_direct_taxes = Column(Float, nullable=True, default=0.0)
    total_collection = Column(Float, nullable=False)
    national_share_pct = Column(Float, nullable=True)


class ITRFiling(Base):
    __tablename__ = "itr_filings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    assessment_year = Column(String(10), nullable=False, index=True)
    financial_year = Column(String(10), nullable=False, index=True)
    itr_form = Column(String(20), nullable=False, index=True)
    filer_category = Column(String(50), nullable=False, index=True)
    number_of_returns = Column(Integer, nullable=False)
    gross_income_reported = Column(Float, nullable=True)
    total_tax_payable = Column(Float, nullable=True)
    filing_mode = Column(String(20), nullable=True, default="e-Filing")


class ReturnFilerStatistic(Base):
    __tablename__ = "return_filer_statistics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    assessment_year = Column(String(10), nullable=False, index=True)
    financial_year = Column(String(10), nullable=False, index=True)
    taxpayer_entity_type = Column(String(50), nullable=False, index=True)
    unique_return_filers = Column(Integer, nullable=False)
    total_returns_filed = Column(Integer, nullable=False)
    tax_paying_filers = Column(Integer, nullable=False)
    nil_tax_filers = Column(Integer, nullable=False)
    nil_tax_filers_pct = Column(Float, nullable=False)
    aggregate_returned_income_crore = Column(Float, nullable=True)
    aggregate_tax_payable_crore = Column(Float, nullable=True)


class TaxpayerStatistic(Base):
    __tablename__ = "taxpayer_statistics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    assessment_year = Column(String(10), nullable=False, index=True)
    financial_year = Column(String(10), nullable=False, index=True)
    effective_taxpayer_base_crore = Column(Float, nullable=False)
    return_filers_count_crore = Column(Float, nullable=False)
    tds_tcs_non_filers_crore = Column(Float, nullable=False)
    pan_allotted_cumulative_crore = Column(Float, nullable=False)
    individual_taxpayers_pct = Column(Float, nullable=True)
    corporate_taxpayers_pct = Column(Float, nullable=True)


class IncomeSlabDistribution(Base):
    __tablename__ = "income_slab_distributions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    assessment_year = Column(String(10), nullable=False, index=True)
    slab_label = Column(String(50), nullable=False)
    slab_min = Column(Float, nullable=False)
    slab_max = Column(Float, nullable=True)
    number_of_filers = Column(Integer, nullable=False)
    total_taxable_income = Column(Float, nullable=False)
    total_tax_liability = Column(Float, nullable=False)
