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

