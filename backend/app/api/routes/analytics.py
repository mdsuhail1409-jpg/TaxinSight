from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.tax_schemas import APIResponse
from app.services.revenue_service import get_revenue_analytics
from app.services.regional_service import get_regional_analytics
from app.services.itr_service import get_itr_analytics
from app.services.statistical_service import get_statistical_analytics
from app.services.data_quality_service import get_data_quality_analytics

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/revenue", response_model=APIResponse)
def revenue_analytics(
    start_year: str = Query(None, description="Start Financial Year (e.g., 2014-15)"),
    end_year: str = Query(None, description="End Financial Year (e.g., 2022-23)"),
    db: Session = Depends(get_db)
):
    data = get_revenue_analytics(db=db, start_year=start_year, end_year=end_year)
    return APIResponse(data=data.model_dump())


@router.get("/regional", response_model=APIResponse)
def regional_analytics(
    financial_year: str = Query(None, description="Financial Year (e.g., 2022-23)"),
    zone: str = Query(None, description="Zone filter (West, North, South, East, Central, North-East)"),
    db: Session = Depends(get_db)
):
    data = get_regional_analytics(db=db, financial_year=financial_year, zone=zone)
    return APIResponse(data=data.model_dump())


@router.get("/itr", response_model=APIResponse)
def itr_analytics(
    assessment_year: str = Query(None, description="Assessment Year (e.g., 2023-24)"),
    db: Session = Depends(get_db)
):
    data = get_itr_analytics(db=db, assessment_year=assessment_year)
    return APIResponse(data=data.model_dump())


@router.get("/statistics", response_model=APIResponse)
def statistical_analytics(
    assessment_year: str = Query(None, description="Assessment Year (e.g., 2023-24)"),
    db: Session = Depends(get_db)
):
    data = get_statistical_analytics(db=db, assessment_year=assessment_year)
    return APIResponse(data=data.model_dump())


@router.get("/data-quality", response_model=APIResponse)
def data_quality_analytics(db: Session = Depends(get_db)):
    data = get_data_quality_analytics(db=db)
    return APIResponse(data=data.model_dump())
