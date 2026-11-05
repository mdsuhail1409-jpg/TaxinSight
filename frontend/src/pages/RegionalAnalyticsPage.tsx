import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { taxService } from '../services/taxService';
import { RegionalAnalyticsData } from '../types';
import KPICard from '../components/dashboard/KPICard';

const ZONAL_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
const ZONES = ['All', 'West', 'North', 'South', 'East', 'Central', 'North-East'];

export default function RegionalAnalyticsPage() {
  const [data, setData] = useState<RegionalAnalyticsData | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    taxService
      .getRegionalAnalytics('2022-23', selectedZone)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load regional data'))
      .finally(() => setLoading(false));
  }, [selectedZone]);

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
        Error loading regional analytics: {error}
      </div>
    );
  }

  const { top_contributing_states, zonal_breakdown, concentration_metrics, all_states } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Regional Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            State & Union Territory tax contribution rankings, zonal aggregations, and regional concentration
          </p>
        </div>

        {/* Zone Filter */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs">
          <span className="font-medium text-slate-500">Zone:</span>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
          >
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Concentration KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KPICard
          title="Top 3 States Share"
          value={`${concentration_metrics.top_3_states_share_pct}%`}
          subtitle="Maharashtra, Delhi, Karnataka"
        />
        <KPICard
          title="Top 5 States Share"
          value={`${concentration_metrics.top_5_states_share_pct}%`}
          subtitle="High geographic revenue concentration"
        />
        <KPICard
          title="Herfindahl-Hirschman Index (HHI)"
          value={concentration_metrics.herfindahl_hirschman_index.toFixed(1)}
          subtitle="Moderate-to-high market concentration"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 10 States Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Top Contributing States (₹ Crore)
            </h3>
            <p className="text-xs text-slate-500">Direct tax collection by state collection circles</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={top_contributing_states}
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k Cr`} />
                <YAxis dataKey="state" type="category" stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip formatter={(val: number) => [`₹ ${val.toLocaleString('en-IN')} Cr`, 'Collection']} />
                <Bar dataKey="total_collection" fill="#4f46e5" radius={[0, 4, 4, 0]} name="Total Collection" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zonal Breakdown Donut */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
            Zonal Revenue Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-3">Western & Northern zone dominance</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={zonal_breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="total"
                  nameKey="zone"
                >
                  {zonal_breakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={ZONAL_COLORS[index % ZONAL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => [`₹ ${val.toLocaleString('en-IN')} Cr`, '']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* State Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            All State & Union Territory Tax Collections (FY 2022-23)
          </h3>
          <span className="text-[11px] text-slate-500">Total: {all_states.length} Jurisdictions</span>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">State / Union Territory</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3 text-right">Corporation Tax</th>
                <th className="py-2.5 px-3 text-right">Personal Income Tax</th>
                <th className="py-2.5 px-3 text-right font-bold text-indigo-700">Total Collection</th>
                <th className="py-2.5 px-3 text-right">National Share %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {all_states.map((s) => (
                <tr key={s.state} className="hover:bg-slate-50 transition">
                  <td className="py-2 px-3 font-semibold text-slate-500">#{s.rank}</td>
                  <td className="py-2 px-3 font-semibold text-slate-800">{s.state}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                      {s.zone}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">{s.corporation_tax ? `₹ ${s.corporation_tax.toLocaleString('en-IN')}` : '-'}</td>
                  <td className="py-2 px-3 text-right">{s.personal_income_tax ? `₹ ${s.personal_income_tax.toLocaleString('en-IN')}` : '-'}</td>
                  <td className="py-2 px-3 text-right font-bold text-indigo-700">₹ {s.total_collection.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right font-semibold text-slate-700">{s.share_pct.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

