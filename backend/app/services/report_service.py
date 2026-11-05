import io
from datetime import datetime
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from sqlalchemy.orm import Session
from app.models.tax_data import (
    DirectTaxCollection,
    StateTaxCollection,
    ITRFiling,
    IncomeSlabDistribution,
)


def generate_pdf_report(db: Session, financial_year: str = None) -> io.BytesIO:
    fy = financial_year or "2022-23"
    collection = db.query(DirectTaxCollection).filter(DirectTaxCollection.financial_year == fy).first()
    if not collection:
        collection = db.query(DirectTaxCollection).order_by(DirectTaxCollection.financial_year.desc()).first()
        if collection:
            fy = collection.financial_year

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )
    elements = []
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1e3a8a"),  # Deep Navy
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#475569"),
    )
    section_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=12,
        spaceAfter=6,
    )

    # Header
    elements.append(Paragraph("TaxInsight – Executive Intelligence Briefing", title_style))
    elements.append(Paragraph(f"Official Direct Tax Analysis & Performance Dossier | Financial Year: {fy} (AY: {collection.assessment_year if collection else '2023-24'})", subtitle_style))
    elements.append(Paragraph(f"Generated on: {datetime.utcnow().strftime('%d %B %Y at %H:%M UTC')} | Source: Central Board of Direct Taxes (CBDT)", subtitle_style))
    elements.append(Spacer(1, 15))

    # Section 1: Macro KPIs
    elements.append(Paragraph("1. Macroeconomic Revenue Summary", section_style))
    kpi_data = [
        ["Metric Indicator", "Reported Value", "Unit / Metric", "Domain Context"],
        ["Gross Direct Tax Collection", f"₹ {collection.gross_collection:,.1f}", "₹ Crore", "Pre-refund sovereign collection"],
        ["Tax Refunds Disbursed", f"₹ {collection.refunds:,.1f}", "₹ Crore", "Advance tax / TDS refunds"],
        ["Net Direct Tax Collection", f"₹ {collection.net_collection:,.1f}", "₹ Crore", "Net sovereign retained revenue"],
        ["Corporation Tax (CIT)", f"₹ {collection.corporation_tax:,.1f}", "₹ Crore", f"{(collection.corporation_tax / collection.net_collection)*100:.1f}% of net direct tax"],
        ["Personal Income Tax (PIT)", f"₹ {collection.personal_income_tax:,.1f}", "₹ Crore", f"{(collection.personal_income_tax / collection.net_collection)*100:.1f}% of net direct tax"],
        ["Cost of Collection", f"{collection.cost_of_collection_pct:.2f}%" if collection.cost_of_collection_pct else "0.51%", "Percentage", "ITD administrative cost per ₹100"],
        ["Tax Buoyancy Factor", f"{collection.direct_tax_buoyancy:.2f}" if collection.direct_tax_buoyancy else "1.18", "Elasticity Ratio", "% Δ Tax Collection / % Δ GDP"],
    ]

    t_kpi = Table(kpi_data, colWidths=[160, 100, 100, 170])
    t_kpi.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
    ]))
    elements.append(t_kpi)
    elements.append(Spacer(1, 14))

    # Section 2: Regional Top States
    elements.append(Paragraph("2. Top Contributing States and Union Territories", section_style))
    states = db.query(StateTaxCollection).filter(StateTaxCollection.financial_year == fy).order_by(StateTaxCollection.total_collection.desc()).limit(5).all()
    if states:
        state_data = [["Rank", "State / UT", "Zone", "Collection (₹ Crore)", "National Share %"]]
        for rank, s in enumerate(states, 1):
            state_data.append([str(rank), s.state_ut_name, s.zone, f"₹ {s.total_collection:,.1f}", f"{s.national_share_pct:.2f}%" if s.national_share_pct else "-"])

        t_state = Table(state_data, colWidths=[40, 160, 100, 130, 100])
        t_state.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f766e")),  # Deep Teal
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8.5),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f0fdfa")]),
        ]))
        elements.append(t_state)

    elements.append(Spacer(1, 14))

    # Section 3: Statutory Methodology Note
    elements.append(Paragraph("3. Statutory Methodology & Disclaimer", section_style))
    disclaimer_text = (
        "This analytical briefing is synthesized directly from macro direct tax publications released by the "
        "Central Board of Direct Taxes (CBDT), Ministry of Finance, Government of India. In accordance with statutory norms, "
        "Financial Year (FY) represents the income accrual cycle, while Assessment Year (AY) represents the evaluation cycle. "
        "All figures are expressed in Indian Rupees (₹ Crore). No personally identifiable taxpayer information (PAN/identity) is accessed or processed."
    )
    elements.append(Paragraph(disclaimer_text, subtitle_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer


def generate_excel_report(db: Session, financial_year: str = None) -> io.BytesIO:
    fy = financial_year or "2022-23"
    wb = openpyxl.Workbook()
    # Remove default sheet
    wb.remove(wb.active)

    # Styles
    header_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    data_font = Font(name="Calibri", size=10)
    border_thin = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )

    # 1. Sheet: Time Series
    ws_time = wb.create_sheet(title="Revenue_TimeSeries")
    headers_time = ["Financial Year", "Assessment Year", "Corporation Tax (₹ Cr)", "Personal Income Tax (₹ Cr)", "Other Direct Taxes (₹ Cr)", "Gross Collection (₹ Cr)", "Refunds (₹ Cr)", "Net Collection (₹ Cr)", "Cost of Collection (%)", "GDP Current Prices (₹ Cr)", "Tax Buoyancy"]
    ws_time.append(headers_time)

    records = db.query(DirectTaxCollection).order_by(DirectTaxCollection.financial_year.asc()).all()
    for r in records:
        ws_time.append([
            r.financial_year,
            r.assessment_year,
            r.corporation_tax,
            r.personal_income_tax,
            r.other_direct_taxes or 0.0,
            r.gross_collection,
            r.refunds,
            r.net_collection,
            r.cost_of_collection_pct,
            r.gdp_current_prices,
            r.direct_tax_buoyancy
        ])

    # 2. Sheet: State Collections
    ws_state = wb.create_sheet(title="State_Collections")
    headers_state = ["Financial Year", "Assessment Year", "State / UT Name", "Zone", "Corporation Tax (₹ Cr)", "Personal Income Tax (₹ Cr)", "Total Collection (₹ Cr)", "National Share (%)"]
    ws_state.append(headers_state)
    state_records = db.query(StateTaxCollection).order_by(StateTaxCollection.total_collection.desc()).all()
    for s in state_records:
        ws_state.append([
            s.financial_year,
            s.assessment_year,
            s.state_ut_name,
            s.zone,
            s.corporation_tax,
            s.personal_income_tax,
            s.total_collection,
            s.national_share_pct
        ])

    # 3. Sheet: ITR Filings
    ws_itr = wb.create_sheet(title="ITR_Demographics")
    headers_itr = ["Assessment Year", "Financial Year", "ITR Form", "Filer Category", "Number of Returns", "Gross Income Reported (₹ Cr)", "Total Tax Payable (₹ Cr)"]
    ws_itr.append(headers_itr)
    itr_records = db.query(ITRFiling).all()
    for itr in itr_records:
        ws_itr.append([
            itr.assessment_year,
            itr.financial_year,
            itr.itr_form,
            itr.filer_category,
            itr.number_of_returns,
            itr.gross_income_reported,
            itr.total_tax_payable
        ])

    # 4. Sheet: Income Slabs
    ws_slabs = wb.create_sheet(title="Income_Slabs")
    headers_slabs = ["Assessment Year", "Income Bracket Label", "Min Range (₹)", "Max Range (₹)", "Number of Filers", "Total Taxable Income (₹ Cr)", "Total Tax Liability (₹ Cr)"]
    ws_slabs.append(headers_slabs)
    slab_records = db.query(IncomeSlabDistribution).all()
    for sl in slab_records:
        ws_slabs.append([
            sl.assessment_year,
            sl.slab_label,
            sl.slab_min,
            sl.slab_max,
            sl.number_of_filers,
            sl.total_taxable_income,
            sl.total_tax_liability
        ])

    # Format all sheets
    for ws in wb.worksheets:
        for col_idx, cell in enumerate(ws[1], 1):
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center")
        for row in ws.iter_rows(min_row=2):
            for cell in row:
                cell.font = data_font
                cell.border = border_thin
        # Auto-adjust column widths
        for col in ws.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = openpyxl.utils.get_column_letter(col[0].column)
            ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer
