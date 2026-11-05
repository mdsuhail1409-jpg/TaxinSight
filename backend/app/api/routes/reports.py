from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.report_service import generate_pdf_report, generate_excel_report

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/pdf")
def export_pdf_report(
    financial_year: str = Query(None, description="Financial Year (e.g., 2022-23)"),
    db: Session = Depends(get_db)
):
    pdf_buffer = generate_pdf_report(db=db, financial_year=financial_year)
    fy_str = financial_year or "2022-23"
    filename = f"TaxInsight_Executive_Briefing_{fy_str}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/excel")
def export_excel_report(
    financial_year: str = Query(None, description="Financial Year (e.g., 2022-23)"),
    db: Session = Depends(get_db)
):
    excel_buffer = generate_excel_report(db=db, financial_year=financial_year)
    fy_str = financial_year or "2022-23"
    filename = f"TaxInsight_Analytics_Report_{fy_str}.xlsx"
    return StreamingResponse(
        excel_buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
