from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.revenue_service import get_dashboard_summary
from app.schemas.tax_schemas import APIResponse

router = APIRouter(tags=["Executive Dashboard"])


@router.get("/dashboard/summary", response_model=APIResponse)
def dashboard_summary(
    financial_year: str = Query(None, description="Financial Year (e.g., 2022-23)"),
    db: Session = Depends(get_db)
):
    data = get_dashboard_summary(db=db, financial_year=financial_year)
    return APIResponse(data=data.model_dump())

