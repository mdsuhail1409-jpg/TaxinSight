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
} from 'recharts';
import { taxService } from '../services/taxService';
import { RevenueAnalyticsData } from '../types';
import KPICard from '../components/dashboard/KPICard';

export default function RevenueAnalyticsPage() {
  const [data, setData] = useState<RevenueAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    taxService
      .getRevenueAnalytics()
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load revenue analytics'))
      .finally(() => setLoading(false));
  }, []);

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
        Error loading revenue analytics: {error}
      </div>
    );
  }

  const { time_series, buoyancy_analysis, collection_efficiency } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Revenue Analytics</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Gross vs Net collections, refund velocity, administrative cost efficiency, and tax-to-GDP buoyancy
        </p>
      </div>

      {/* Top Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KPICard
          title="Average Cost of Collection"
          value={`${collection_efficiency.average_cost_of_collection_pct}%`}
          subtitle="ITD administrative expenditure per ₹100 direct tax"
        />
        <KPICard
          title="Average Refund Disbursal Ratio"
          value={`${collection_efficiency.refund_disbursal_ratio_pct}%`}
          subtitle="Share of gross direct tax refunded"
        />
        <KPICard
          title="Peak Sovereign Fiscal Year"
          value={collection_efficiency.peak_collection_year}
          subtitle="Highest recorded net direct tax collection"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gross vs Refunds vs Net Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Gross Collections & Refunds Disbursed (₹ Cr)
            </h3>
            <p className="text-xs text-slate-500">Decomposition of sovereign tax flow</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={time_series} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="financial_year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L Cr`} />
                <Tooltip formatter={(val: number) => [`₹ ${val.toLocaleString('en-IN')} Cr`, '']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="gross_collection" fill="#3b82f6" name="Gross Collection" radius={[4, 4, 0, 0]} />
                <Bar dataKey="refunds" fill="#f59e0b" name="Refunds Disbursed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="net_collection" fill="#10b981" name="Net Sovereign Collection" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Buoyancy & YoY Growth Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              GDP Growth vs Tax Growth Elasticity
            </h3>
            <p className="text-xs text-slate-500">YoY % growth and resulting buoyancy ratio</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={buoyancy_analysis} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="financial_year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="net_tax_growth_pct" stroke="#4f46e5" strokeWidth={2} name="Net Tax Growth (%)" />
                <Line type="monotone" dataKey="nominal_gdp_growth_pct" stroke="#06b6d4" strokeWidth={2} name="Nominal GDP Growth (%)" />
                <Line type="monotone" dataKey="buoyancy_ratio" stroke="#f97316" strokeWidth={2} strokeDasharray="4 4" name="Buoyancy Ratio" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Structured Time Series Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            CBDT Time Series Ledger (FY 2014-15 to FY 2022-23)
          </h3>
          <span className="text-[11px] text-slate-500">Units in ₹ Crore</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">FY</th>
                <th className="py-2.5 px-3">AY</th>
                <th className="py-2.5 px-3 text-right">Corporation Tax</th>
                <th className="py-2.5 px-3 text-right">Personal Income Tax</th>
                <th className="py-2.5 px-3 text-right">Gross Collection</th>
                <th className="py-2.5 px-3 text-right">Refunds</th>
                <th className="py-2.5 px-3 text-right font-bold text-indigo-700">Net Collection</th>
                <th className="py-2.5 px-3 text-right">Cost %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {time_series.map((row) => (
                <tr key={row.financial_year} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{row.financial_year}</td>
                  <td className="py-2.5 px-3 text-slate-500">{row.assessment_year}</td>
                  <td className="py-2.5 px-3 text-right">₹ {row.corporation_tax.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right">₹ {row.personal_income_tax.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right">₹ {row.gross_collection.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right text-amber-700">₹ {row.refunds.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-indigo-700">₹ {row.net_collection.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right">{row.cost_of_collection_pct ? `${row.cost_of_collection_pct}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

