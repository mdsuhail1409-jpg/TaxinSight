from sqlalchemy.orm import Session
from app.models.tax_data import StateTaxCollection
from app.schemas.tax_schemas import (
    RegionalAnalyticsData,
    StateContributionItem,
    ZonalBreakdownItem,
    ConcentrationMetrics,
)


def get_regional_analytics(db: Session, financial_year: str = None, zone: str = None) -> RegionalAnalyticsData:
    fy = financial_year or "2022-23"
    query = db.query(StateTaxCollection).filter(StateTaxCollection.financial_year == fy)
    if zone:
        query = query.filter(StateTaxCollection.zone == zone)
    
    records = query.order_by(StateTaxCollection.total_collection.desc()).all()
    if not records:
        # Fallback to any available financial year
        records = db.query(StateTaxCollection).order_by(StateTaxCollection.total_collection.desc()).all()
        if records:
            fy = records[0].financial_year

    total_national = sum(r.total_collection for r in records) or 1.0

    state_items = []
    for rank, r in enumerate(records, 1):
        share = round((r.total_collection / total_national) * 100, 2)
        state_items.append(
            StateContributionItem(
                rank=rank,
                state=r.state_ut_name,
                total_collection=r.total_collection,
                share_pct=share,
                zone=r.zone,
                corporation_tax=r.corporation_tax,
                personal_income_tax=r.personal_income_tax,
            )
        )

    top_states = state_items[:10]

    # Zonal aggregation
    zonal_map = {}
    for r in records:
        z = r.zone or "Other"
        zonal_map[z] = zonal_map.get(z, 0.0) + r.total_collection

    zonal_breakdown = [
        ZonalBreakdownItem(
            zone=z,
            total=round(tot, 2),
            share_pct=round((tot / total_national) * 100, 2),
        )
        for z, tot in sorted(zonal_map.items(), key=lambda item: item[1], reverse=True)
    ]

    # Concentration metrics
    top_3_share = round(sum(s.share_pct for s in state_items[:3]), 2)
    top_5_share = round(sum(s.share_pct for s in state_items[:5]), 2)
    
    # Herfindahl-Hirschman Index (HHI)
    hhi = round(sum((s.share_pct) ** 2 for s in state_items), 2)

    return RegionalAnalyticsData(
        financial_year=fy,
        top_contributing_states=top_states,
        zonal_breakdown=zonal_breakdown,
        concentration_metrics=ConcentrationMetrics(
            top_3_states_share_pct=top_3_share,
            top_5_states_share_pct=top_5_share,
            herfindahl_hirschman_index=hhi,
        ),
        all_states=state_items,
    )
