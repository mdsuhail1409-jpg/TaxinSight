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
import { Sigma, TrendingUp, AlertTriangle } from 'lucide-react';
import { taxService } from '../services/taxService';
import { StatisticalAnalyticsData } from '../types';
import KPICard from '../components/dashboard/KPICard';
import YearFilter from '../components/filters/YearFilter';

const AY_OPTIONS = ['2023-24', '2022-23'];

export default function StatisticalAnalysisPage() {
  const [data, setData] = useState<StatisticalAnalyticsData | null>(null);
  const [selectedAY, setSelectedAY] = useState<string>('2023-24');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    taxService
      .getStatisticalAnalytics(selectedAY)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load statistical analytics'))
      .finally(() => setLoading(false));
  }, [selectedAY]);

  if (loading && !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
        Error loading statistical analysis: {error}
      </div>
    );
  }

  const { distribution_moments, inequality_metrics, lorenz_curve, income_brackets, regression_forecast } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Statistical Analysis & Disparity</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            SciPy-calculated empirical moments, Gini coefficient inequality index, Lorenz curve, and OLS projection
          </p>
        </div>

        <YearFilter
          selectedYear={selectedAY}
          onYearChange={setSelectedAY}
          options={AY_OPTIONS}
          label="Assessment Year (AY)"
        />
      </div>

      {/* Top Statistical Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Gini Coefficient (Inequality)"
          value={inequality_metrics.gini_coefficient.toFixed(3)}
          subtitle="Income concentration (0 = equal, 1 = max disparity)"
          icon={<Sigma className="w-5 h-5 text-indigo-600" />}
        />
        <KPICard
          title="Distribution Skewness (γ1)"
          value={`+${distribution_moments.skewness.toFixed(2)}`}
          subtitle="Heavy right tail towards ultra-high earners"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />
        <KPICard
          title="Distribution Kurtosis (β2)"
          value={distribution_moments.kurtosis.toFixed(2)}
          subtitle="Leptokurtic peak around ₹2.5L - ₹5L slab"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        />
        <KPICard
          title="OLS Forecast (Next FY)"
          value={`₹ ${(regression_forecast.projected_next_fy_collection / 100000).toFixed(2)}L Cr`}
          subtitle={`R² = ${regression_forecast.r_squared.toFixed(3)} linear trend`}
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lorenz Curve Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Lorenz Curve (Taxable Income vs Filer Population)
            </h3>
            <p className="text-xs text-slate-500">Cumulative % of filers vs Cumulative % of reported taxable income</p>
          </div>
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
        </div>

        {/* Income Bracket Share vs Tax Share */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Income Share vs Tax Liability Share (%)
            </h3>
            <p className="text-xs text-slate-500">Progressive tax burden by returned income bracket</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={income_brackets} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="range" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip formatter={(val: number) => [`${val}%`, '']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="income_share_pct" fill="#3b82f6" name="Income Share %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tax_share_pct" fill="#f59e0b" name="Tax Liability Share %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Income Slab Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Taxable Income Bracket Distribution Ledger (AY {selectedAY})
          </h3>
          <span className="text-[11px] text-slate-500">
            Median Income: ₹ {distribution_moments.median_taxable_income_inr.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Returned Income Bracket</th>
                <th className="py-2.5 px-3 text-right">Taxpayer Filers</th>
                <th className="py-2.5 px-3 text-right">Share of Filers %</th>
                <th className="py-2.5 px-3 text-right">Taxable Income Share %</th>
                <th className="py-2.5 px-3 text-right font-bold text-amber-700">Tax Liability Share %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {income_brackets.map((b) => (
                <tr key={b.range} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{b.range}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{(b.filers / 100000).toFixed(1)} Lakh</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">
                    {((b.filers / income_brackets.reduce((a, c) => a + c.filers, 0)) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-blue-700 font-medium">{b.income_share_pct}%</td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-700">{b.tax_share_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

