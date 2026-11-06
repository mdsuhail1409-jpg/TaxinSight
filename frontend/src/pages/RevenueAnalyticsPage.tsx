import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { taxService } from '../services/taxService';
import { RevenueAnalyticsData } from '../types';
import KPICard from '../components/dashboard/KPICard';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';

export default function RevenueAnalyticsPage() {
  const [data, setData] = useState<RevenueAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    taxService
      .getRevenueAnalytics()
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load revenue analytics'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !data) {
    return <LoadingState message="Loading Revenue Telemetry..." submessage="Synthesizing annual direct tax collection and refund time-series" />;
  }

  if (error || !data) {
    return <ErrorState error={error || 'Failed to load revenue analytics'} onRetry={fetchData} />;
  }

  const { time_series, buoyancy_analysis, collection_efficiency } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Revenue Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Annual collection decomposition, corporate vs personal revenue contribution, and economic buoyancy
        </p>
      </div>

      {/* Top Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <KPICard
          title="Average Cost of Collection"
          value={`${collection_efficiency.average_cost_of_collection_pct}%`}
          subtitle="ITD operational cost per ₹100 direct tax collected"
        />
        <KPICard
          title="Average Refund Disbursal Ratio"
          value={`${collection_efficiency.refund_disbursal_ratio_pct}%`}
          subtitle="Share of gross sovereign collections refunded"
        />
        <KPICard
          title="Peak Sovereign Fiscal Year"
          value={collection_efficiency.peak_collection_year}
          subtitle="Highest recorded annual direct tax realization"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Annual Collection Decomposition */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Gross Collections & Refund Disbursals (₹ Crore)
            </h3>
            <p className="text-[11px] text-slate-500">Gross revenue vs Refunds = Net retained sovereign tax</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={time_series} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="financial_year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L Cr`} />
                <Tooltip formatter={(val: number) => [`₹ ${val.toLocaleString('en-IN')} Cr`, '']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="gross_collection" fill="#0284c7" name="Gross Collection" radius={[3, 3, 0, 0]} />
                <Bar dataKey="refunds" fill="#f59e0b" name="Refunds Disbursed" radius={[3, 3, 0, 0]} />
                <Bar dataKey="net_collection" fill="#10b981" name="Net Direct Tax" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Corporate vs Personal Tax Contribution Shares */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Corporate vs Personal Tax Contribution Share (%)
            </h3>
            <p className="text-[11px] text-slate-500">Evolution of direct tax structural shares over time</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={time_series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="financial_year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" domain={[30, 70]} tickLine={false} />
                <Tooltip formatter={(val: number) => [`${val}%`, '']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="corporate_tax_contribution_pct" stroke="#2563eb" fill="#93c5fd" fillOpacity={0.4} name="Corporate Tax Share %" />
                <Area type="monotone" dataKey="personal_tax_contribution_pct" stroke="#16a34a" fill="#86efac" fillOpacity={0.4} name="Personal Income Tax Share %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Comparison Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              YoY Growth Rates (%) & GDP Buoyancy Elasticity
            </h3>
            <p className="text-[11px] text-slate-500">Net tax collection growth vs Nominal GDP growth</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={buoyancy_analysis} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="financial_year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip formatter={(val: number) => [`${val}%`, '']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="net_tax_growth_pct" stroke="#4f46e5" strokeWidth={2} name="Net Tax Growth YoY (%)" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="nominal_gdp_growth_pct" stroke="#0ea5e9" strokeWidth={2} name="Nominal GDP Growth (%)" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="buoyancy_ratio" stroke="#f97316" strokeWidth={2} strokeDasharray="4 4" name="Buoyancy Ratio" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Structured Time Series Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Official Annual Collection Ledger (FY 2010-11 to FY 2023-24)
          </h3>
          <span className="text-[11px] text-slate-500">Amounts in ₹ Crore</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Financial Year</th>
                <th className="py-2.5 px-3">Assessment Year</th>
                <th className="py-2.5 px-3 text-right">Corporation Tax</th>
                <th className="py-2.5 px-3 text-right">Personal Income Tax</th>
                <th className="py-2.5 px-3 text-right">Gross Collection</th>
                <th className="py-2.5 px-3 text-right">Refunds</th>
                <th className="py-2.5 px-3 text-right font-bold text-indigo-700">Net Collection</th>
                <th className="py-2.5 px-3 text-right">YoY Net %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {time_series.map((row) => (
                <tr key={row.financial_year} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{row.financial_year}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">{row.assessment_year}</td>
                  <td className="py-2.5 px-3 text-right font-mono">₹ {row.corporation_tax.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-mono">₹ {row.personal_income_tax.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-mono">₹ {row.gross_collection.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right text-amber-700 font-mono">₹ {row.refunds.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-indigo-700 font-mono">₹ {row.net_collection.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-semibold">
                    {row.yoy_net_growth !== null && row.yoy_net_growth !== undefined
                      ? `${row.yoy_net_growth > 0 ? '+' : ''}${row.yoy_net_growth}%`
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
