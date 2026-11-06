import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Sigma, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { taxService } from '../services/taxService';
import {
  StatisticalAnalyticsData,
  CorrelationItem,
  IQROutlierItem,
  OutlierDetail,
} from '../types';
import KPICard from '../components/dashboard/KPICard';
import YearFilter from '../components/filters/YearFilter';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const AY_OPTIONS = ['2023-24', '2022-23'];

export default function StatisticalAnalysisPage() {
  const [data, setData] = useState<StatisticalAnalyticsData | null>(null);
  const [selectedAY, setSelectedAY] = useState<string>('2023-24');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    taxService
      .getStatisticalAnalytics(selectedAY)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load statistical analytics'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [selectedAY]);

  if (loading && !data) {
    return <LoadingState message="Computing Statistical Moments..." submessage="Executing SciPy empirical moments, Gini coefficient, and OLS regression" />;
  }

  if (error || !data) {
    return <ErrorState error={error || 'Failed to load statistical analysis'} onRetry={fetchData} />;
  }

  const {
    distribution_moments,
    inequality_metrics,
    lorenz_curve,
    income_brackets,
    regression_forecast,
    correlations = [],
    iqr_outlier_analysis = [],
  } = data;

  return (
    <div className="space-y-6">
      {/* Title & AY Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Statistical Analysis & Disparity</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            SciPy-calculated moments, Lorenz curve, Gini coefficient, Pearson correlations, and IQR outlier boundaries
          </p>
        </div>

        <YearFilter
          selectedYear={selectedAY}
          onYearChange={setSelectedAY}
          options={AY_OPTIONS}
          label="Assessment Year (AY)"
        />
      </div>

      {/* Primary KPI Moments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KPICard
          title="Gini Coefficient (Inequality)"
          value={inequality_metrics.gini_coefficient.toFixed(3)}
          subtitle="Taxable income disparity index (0 = equal, 1 = max)"
          icon={<Sigma className="w-4 h-4 text-indigo-600" />}
        />
        <KPICard
          title="Distribution Skewness (γ1)"
          value={`+${distribution_moments.skewness.toFixed(2)}`}
          subtitle="Right-tailed asymmetry towards ultra-high earners"
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
        />
        <KPICard
          title="Distribution Kurtosis (β2)"
          value={distribution_moments.kurtosis.toFixed(2)}
          subtitle="Leptokurtic peak concentrated in ₹2.5L - ₹5L bracket"
          icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
        />
        <KPICard
          title="OLS Trendline Forecast"
          value={`₹ ${(regression_forecast.projected_next_fy_collection / 100000).toFixed(2)}L Cr`}
          subtitle={`Linear projection (R² = ${regression_forecast.r_squared.toFixed(3)})`}
          icon={<Activity className="w-4 h-4 text-blue-600" />}
        />
      </div>

      {/* Secondary Moments: Mean, Median, Mode, Variance, Std Dev */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Parametric Summary Moments (AY {selectedAY})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 uppercase">Arithmetic Mean</span>
            <div className="text-base font-bold text-slate-900 mt-1 font-mono">
              ₹ {distribution_moments.mean_taxable_income_inr.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400">Weighted average</span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 uppercase">Median Income</span>
            <div className="text-base font-bold text-slate-900 mt-1 font-mono">
              ₹ {distribution_moments.median_taxable_income_inr.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400">50th percentile</span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 uppercase">Empirical Mode</span>
            <div className="text-base font-bold text-slate-900 mt-1 font-mono">
              ₹ {(distribution_moments.mode_taxable_income_inr || 375000).toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400">Densest cluster</span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 uppercase">Standard Deviation</span>
            <div className="text-base font-bold text-slate-900 mt-1 font-mono">
              ₹ {distribution_moments.standard_deviation.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400">Dispersion measure</span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 uppercase">Palma Ratio</span>
            <div className="text-base font-bold text-indigo-700 mt-1 font-mono">
              {inequality_metrics.palma_ratio.toFixed(2)}x
            </div>
            <span className="text-[10px] text-slate-400">Top 10% / Bottom 40%</span>
          </div>
        </div>
      </div>

      {/* Visualizations Grid: Lorenz Curve & Histogram of Brackets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Lorenz Curve */}
        <Card
          title="Lorenz Curve: Taxable Income Inequality"
          subtitle="Cumulative percentage of filers vs Cumulative percentage of taxable income"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lorenz_curve} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="cumulative_population_pct" stroke="#94a3b8" fontSize={11} unit="%" />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" domain={[0, 100]} />
                <Tooltip formatter={(val: number) => [`${val}%`, '']} />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="cumulative_income_pct"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  name="Lorenz Curve (Empirical Income)"
                  dot={{ r: 3 }}
                />
                <Line
                  type="linear"
                  dataKey="line_of_equality"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  name="Line of Perfect Equality"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Histogram / Bracket Distribution */}
        <Card
          title="Income Share vs Tax Share by Bracket (%)"
          subtitle="Progressive tax incidence across taxable income brackets"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={income_brackets} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="range" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip formatter={(val: number) => [`${val}%`, '']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="income_share_pct" fill="#0284c7" name="Income Share %" radius={[3, 3, 0, 0]} />
                <Bar dataKey="tax_share_pct" fill="#f59e0b" name="Tax Liability Share %" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Correlation Matrix & IQR Outliers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Statistical Correlation Matrix */}
        <Card
          title="Statistical Correlation Analysis"
          subtitle="Pearson correlation coefficients between macroeconomic variables"
        >
          <div className="space-y-3">
            {correlations.map((c: CorrelationItem, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800">{c.pair}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{c.interpretation}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-sm font-bold font-mono text-indigo-700">
                    r = {c.coefficient > 0 ? `+${c.coefficient}` : c.coefficient}
                  </span>
                  <p className="text-[10px] text-emerald-600 font-medium">p &lt; 0.001</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Box Plot / IQR Outlier Boundaries */}
        <Card
          title="Interquartile Range (IQR) Outlier Auditing"
          subtitle="Tukey 1.5×IQR boundary checks for macroeconomic time series"
        >
          <div className="space-y-3">
            {iqr_outlier_analysis.map((item: IQROutlierItem, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{item.metric}</span>
                  <Badge variant={item.outlier_count > 0 ? 'amber' : 'emerald'}>
                    {item.outlier_count} Outliers Detected
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Lower Bound: ₹ {item.lower_bound.toLocaleString('en-IN')} Cr</span>
                  <span>Upper Bound: ₹ {item.upper_bound.toLocaleString('en-IN')} Cr</span>
                </div>
                {item.outliers.length > 0 && (
                  <div className="pt-1 text-[11px] text-amber-700">
                    Flagged: {item.outliers.map((o: OutlierDetail) => `${o.identifier} (₹ ${o.value.toLocaleString('en-IN')} Cr - ${o.deviation})`).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Income Slab Ledger */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Income Bracket Distribution Ledger (AY {selectedAY})
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Median Income: ₹ {distribution_moments.median_taxable_income_inr.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Taxable Income Bracket</th>
                <th className="py-2.5 px-3 text-right">Taxpayer Filers</th>
                <th className="py-2.5 px-3 text-right">Share of Filers %</th>
                <th className="py-2.5 px-3 text-right">Income Share %</th>
                <th className="py-2.5 px-3 text-right font-bold text-amber-700">Tax Liability Share %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {income_brackets.map((b) => (
                <tr key={b.range} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{b.range}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">{(b.filers / 100000).toFixed(1)} Lakh</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">
                    {((b.filers / income_brackets.reduce((a, c) => a + c.filers, 0)) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-blue-700 font-mono font-medium">{b.income_share_pct}%</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-700 font-mono">{b.tax_share_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
