export interface KPIItem {
  value: number;
  unit: string;
  yoy_growth_pct?: number | null;
  is_positive?: boolean | null;
  share_of_direct_tax_pct?: number | null;
  refund_to_gross_pct?: number | null;
}

export interface ExecutiveKPIs {
  net_collection: KPIItem;
  corporation_tax: KPIItem;
  personal_income_tax: KPIItem;
  refunds_issued: KPIItem;
  total_filers: KPIItem;
  buoyancy_factor?: number | null;
}

export interface HistoricalTrendItem {
  financial_year: string;
  net_collection: number;
  corporation_tax: number;
  personal_income_tax: number;
  refunds: number;
}

export interface RevenueCompositionItem {
  name: string;
  value: number;
  pct: number;
}

export interface DashboardSummaryData {
  selected_financial_year: string;
  selected_assessment_year: string;
  kpis: ExecutiveKPIs;
  historical_trend: HistoricalTrendItem[];
  revenue_composition: RevenueCompositionItem[];
}

export interface RevenueTimeSeriesItem {
  financial_year: string;
  assessment_year: string;
  gross_collection: number;
  refunds: number;
  net_collection: number;
  corporation_tax: number;
  personal_income_tax: number;
  other_taxes: number;
  cost_of_collection_pct?: number | null;
  yoy_gross_growth?: number | null;
  yoy_net_growth?: number | null;
}

export interface BuoyancyItem {
  financial_year: string;
  nominal_gdp_growth_pct?: number | null;
  net_tax_growth_pct?: number | null;
  buoyancy_ratio?: number | null;
}

export interface RevenueAnalyticsData {
  time_series: RevenueTimeSeriesItem[];
  buoyancy_analysis: BuoyancyItem[];
  collection_efficiency: {
    average_cost_of_collection_pct: number;
    refund_disbursal_ratio_pct: number;
    peak_collection_year: string;
  };
}

export interface StateContributionItem {
  rank: number;
  state: string;
  total_collection: number;
  share_pct: number;
  zone: string;
  corporation_tax?: number | null;
  personal_income_tax?: number | null;
}

export interface ZonalBreakdownItem {
  zone: string;
  total: number;
  share_pct: number;
}

export interface ConcentrationMetrics {
  top_3_states_share_pct: number;
  top_5_states_share_pct: number;
  herfindahl_hirschman_index: number;
}

export interface RegionalAnalyticsData {
  financial_year: string;
  top_contributing_states: StateContributionItem[];
  zonal_breakdown: ZonalBreakdownItem[];
  concentration_metrics: ConcentrationMetrics;
  all_states: StateContributionItem[];
}

export interface ITRFormDistributionItem {
  form: string;
  count: number;
  share_pct: number;
  description: string;
}

export interface ITRCategoryDistributionItem {
  category: string;
  count: number;
  share_pct: number;
}

export interface ITRAnalyticsData {
  assessment_year: string;
  financial_year: string;
  total_filings_count: number;
  form_distribution: ITRFormDistributionItem[];
  category_distribution: ITRCategoryDistributionItem[];
}

export interface DistributionMoments {
  mean_taxable_income_inr: number;
  median_taxable_income_inr: number;
  mode_taxable_income_inr?: number;
  variance?: number;
  standard_deviation: number;
  skewness: number;
  kurtosis: number;
}

export interface InequalityMetrics {
  gini_coefficient: number;
  palma_ratio: number;
}

export interface LorenzCurvePoint {
  cumulative_population_pct: number;
  cumulative_income_pct: number;
  line_of_equality: number;
}

export interface IncomeBracketItem {
  range: string;
  filers: number;
  income_share_pct: number;
  tax_share_pct: number;
}

export interface RegressionForecast {
  slope: number;
  intercept: number;
  r_squared: number;
  projected_next_fy_collection: number;
}

export interface CorrelationItem {
  pair: string;
  coefficient: number;
  interpretation: string;
}

export interface OutlierDetail {
  identifier: string;
  value: number;
  deviation: string;
}

export interface IQROutlierItem {
  metric: string;
  lower_bound: number;
  upper_bound: number;
  outlier_count: number;
  outliers: OutlierDetail[];
}

export interface StatisticalAnalyticsData {
  assessment_year: string;
  distribution_moments: DistributionMoments;
  inequality_metrics: InequalityMetrics;
  lorenz_curve: LorenzCurvePoint[];
  income_brackets: IncomeBracketItem[];
  regression_forecast: RegressionForecast;
  correlations?: CorrelationItem[];
  iqr_outlier_analysis?: IQROutlierItem[];
}

export interface CompletenessTableItem {
  table: string;
  total_records: number;
  completeness_pct: number;
}

export interface ReconciliationStatus {
  balance_equation: string;
  records_checked: number;
  discrepancies_found: number;
  status: string;
}

export interface AnomalyItem {
  type: string;
  financial_year: string;
  metric: string;
  value: string;
  explanation: string;
}

export interface DataQualityAnalyticsData {
  overall_health_score: number;
  metrics_evaluated: number;
  completeness_by_table: CompletenessTableItem[];
  reconciliation_status: ReconciliationStatus;
  anomalies_detected: AnomalyItem[];
  missing_values_report: Record<string, unknown>[];
}

export interface DatasetItem {
  id: string;
  filename: string;
  file_type: string;
  file_size_bytes: number;
  status: string;
  record_count?: number | null;
  description?: string | null;
  uploaded_at: string;
}

export interface DatasetPreviewData {
  id: string;
  columns: string[];
  total_rows: number;
  preview_rows: Record<string, unknown>[];
}

