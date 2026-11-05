from sqlalchemy.orm import Session
from app.models.tax_data import ITRFiling
from app.schemas.tax_schemas import (
    ITRAnalyticsData,
    ITRFormDistributionItem,
    ITRCategoryDistributionItem,
)

FORM_DESCRIPTIONS = {
    "ITR-1 (Sahaj)": "Resident Individuals with income <= ₹50 Lakh (Salary/House Property)",
    "ITR-2": "Individuals & HUFs not having income from business/profession",
    "ITR-3": "Individuals & HUFs having income from proprietary business/profession",
    "ITR-4 (Sugam)": "Presumptive business/profession income (Sec 44AD/ADA/AE)",
    "ITR-5": "Partnership firms, LLPs, AOPs, BOIs, Co-operatives",
    "ITR-6": "Companies other than those claiming Sec 11 exemption",
    "ITR-7": "Charitable/religious trusts, political parties, research bodies",
}


def get_itr_analytics(db: Session, assessment_year: str = None) -> ITRAnalyticsData:
    ay = assessment_year or "2023-24"
    records = db.query(ITRFiling).filter(ITRFiling.assessment_year == ay).all()
    if not records:
        records = db.query(ITRFiling).order_by(ITRFiling.assessment_year.desc()).all()
        if records:
            ay = records[0].assessment_year
            records = [r for r in records if r.assessment_year == ay]

    total_returns = sum(r.number_of_returns for r in records) or 1
    fy = records[0].financial_year if records else "2022-23"

    # Aggregate by Form
    form_map = {}
    for r in records:
        form_map[r.itr_form] = form_map.get(r.itr_form, 0) + r.number_of_returns

    form_distribution = [
        ITRFormDistributionItem(
            form=form,
            count=cnt,
            share_pct=round((cnt / total_returns) * 100, 2),
            description=FORM_DESCRIPTIONS.get(form, "Statutory Income Tax Return"),
        )
        for form, cnt in sorted(form_map.items(), key=lambda x: x[1], reverse=True)
    ]

    # Aggregate by Category
    cat_map = {}
    for r in records:
        cat_map[r.filer_category] = cat_map.get(r.filer_category, 0) + r.number_of_returns

    category_distribution = [
        ITRCategoryDistributionItem(
            category=cat,
            count=cnt,
            share_pct=round((cnt / total_returns) * 100, 2),
        )
        for cat, cnt in sorted(cat_map.items(), key=lambda x: x[1], reverse=True)
    ]

    return ITRAnalyticsData(
        assessment_year=ay,
        financial_year=fy,
        total_filings_count=total_returns,
        form_distribution=form_distribution,
        category_distribution=category_distribution,
    )
