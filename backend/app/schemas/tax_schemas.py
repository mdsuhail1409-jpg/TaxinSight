from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class APIResponse(BaseModel):
    success: bool = True
    data: Any
    message: Optional[str] = "Operation completed successfully"
    timestamp: str = Field(default_factory=lambda: "2026-11-05T20:20:00Z")


class KPIItem(BaseModel):
    value: float
    unit: str
    yoy_growth_pct: Optional[float] = None
    is_positive: Optional[bool] = None
    share_of_direct_tax_pct: Optional[float] = None
    refund_to_gross_pct: Optional[float] = None


class ExecutiveKPIs(BaseModel):
    net_collection: KPIItem
    corporation_tax: KPIItem
    personal_income_tax: KPIItem
    refunds_issued: KPIItem
    total_filers: KPIItem
    buoyancy_factor: Optional[float] = None


class HistoricalTrendItem(BaseModel):
    financial_year: str
    net_collection: float
    corporation_tax: float
    personal_income_tax: float
    refunds: float


class RevenueCompositionItem(BaseModel):
    name: str
    value: float
    pct: float


class DashboardSummaryData(BaseModel):
    selected_financial_year: str
    selected_assessment_year: str
    kpis: ExecutiveKPIs
    historical_trend: List[HistoricalTrendItem]
    revenue_composition: List[RevenueCompositionItem]


class RevenueTimeSeriesItem(BaseModel):
    financial_year: str
    assessment_year: str
    gross_collection: float
    refunds: float
    net_collection: float
    corporation_tax: float
    personal_income_tax: float
    other_taxes: float
    cost_of_collection_pct: Optional[float] = None
    yoy_gross_growth: Optional[float] = None
    yoy_net_growth: Optional[float] = None
    corporate_tax_contribution_pct: Optional[float] = None
    personal_tax_contribution_pct: Optional[float] = None


class BuoyancyItem(BaseModel):
    financial_year: str
    nominal_gdp_growth_pct: Optional[float] = None
    net_tax_growth_pct: Optional[float] = None
    buoyancy_ratio: Optional[float] = None


class RevenueAnalyticsData(BaseModel):
    time_series: List[RevenueTimeSeriesItem]
    buoyancy_analysis: List[BuoyancyItem]
    collection_efficiency: Dict[str, Any]


class StateContributionItem(BaseModel):
    rank: int
    state: str
    total_collection: float
    share_pct: float
    zone: str
    corporation_tax: Optional[float] = None
    personal_income_tax: Optional[float] = None


class ZonalBreakdownItem(BaseModel):
    zone: str
    total: float
    share_pct: float


class ConcentrationMetrics(BaseModel):
    top_3_states_share_pct: float
    top_5_states_share_pct: float
    herfindahl_hirschman_index: float


class RegionalAnalyticsData(BaseModel):
    financial_year: str
    top_contributing_states: List[StateContributionItem]
    zonal_breakdown: List[ZonalBreakdownItem]
    concentration_metrics: ConcentrationMetrics
    all_states: List[StateContributionItem]


class ITRFormDistributionItem(BaseModel):
    form: str
    count: int
    share_pct: float
    description: str


class ITRCategoryDistributionItem(BaseModel):
    category: str
    count: int
    share_pct: float


class ITRAnalyticsData(BaseModel):
    assessment_year: str
    financial_year: str
    total_filings_count: int
    form_distribution: List[ITRFormDistributionItem]
    category_distribution: List[ITRCategoryDistributionItem]


class DistributionMoments(BaseModel):
    mean_taxable_income_inr: float
    median_taxable_income_inr: float
    mode_taxable_income_inr: Optional[float] = None
    variance: float
    standard_deviation: float
    skewness: float
    kurtosis: float


class InequalityMetrics(BaseModel):
    gini_coefficient: float
    palma_ratio: float


class LorenzCurvePoint(BaseModel):
    cumulative_population_pct: float
    cumulative_income_pct: float
    line_of_equality: float


class IncomeBracketItem(BaseModel):
    range: str
    filers: int
    income_share_pct: float
    tax_share_pct: float


class RegressionForecast(BaseModel):
    slope: float
    intercept: float
    r_squared: float
    projected_next_fy_collection: float


class CorrelationItem(BaseModel):
    pair: str
    coefficient: float
    interpretation: str


class IQROutlierItem(BaseModel):
    metric: str
    lower_bound: float
    upper_bound: float
    outlier_count: int
    outliers: List[Dict[str, Any]]


class StatisticalAnalyticsData(BaseModel):
    assessment_year: str
    distribution_moments: DistributionMoments
    inequality_metrics: InequalityMetrics
    lorenz_curve: List[LorenzCurvePoint]
    income_brackets: List[IncomeBracketItem]
    regression_forecast: RegressionForecast
    correlations: List[CorrelationItem]
    iqr_outlier_analysis: List[IQROutlierItem]


class CompletenessTableItem(BaseModel):
    table: str
    total_records: int
    completeness_pct: float
    missing_fields_count: int


class ReconciliationStatus(BaseModel):
    balance_equation: str
    records_checked: int
    discrepancies_found: int
    status: str


class AnomalyItem(BaseModel):
    type: str
    financial_year: str
    metric: str
    value: str
    explanation: str


class DataQualityAnalyticsData(BaseModel):
    overall_health_score: float
    metrics_evaluated: int
    duplicates_detected: int
    completeness_by_table: List[CompletenessTableItem]
    reconciliation_status: ReconciliationStatus
    anomalies_detected: List[AnomalyItem]
    missing_values_report: List[Dict[str, Any]]
