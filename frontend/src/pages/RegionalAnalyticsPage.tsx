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
import { Info, MapPin } from 'lucide-react';
import { taxService } from '../services/taxService';
import { RegionalAnalyticsData } from '../types';
import KPICard from '../components/dashboard/KPICard';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';

const ZONAL_COLORS = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2'];
const ZONES = ['All', 'West', 'North', 'South', 'East', 'Central', 'North-East'];

export default function RegionalAnalyticsPage() {
  const [data, setData] = useState<RegionalAnalyticsData | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    taxService
      .getRegionalAnalytics('2022-23', selectedZone)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load regional data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [selectedZone]);

  if (loading && !data) {
    return <LoadingState message="Loading Regional Telemetry..." submessage="Compiling 36 State and Union Territory collection circles" />;
  }

  if (error || !data) {
    return <ErrorState error={error || 'Failed to load regional analytics'} onRetry={fetchData} />;
  }

  const { top_contributing_states, zonal_breakdown, concentration_metrics, all_states } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Regional Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            State & Union Territory tax contribution rankings, zonal aggregations, and regional concentration
          </p>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200/90 shadow-xs text-xs">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-500">Zone Filter:</span>
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

      {/* Concentration KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <KPICard
          title="Top 3 States Share"
          value={`${concentration_metrics.top_3_states_share_pct}%`}
          subtitle="Maharashtra, Delhi, Karnataka"
        />
        <KPICard
          title="Top 5 States Share"
          value={`${concentration_metrics.top_5_states_share_pct}%`}
          subtitle="Combined share of top 5 contributor states"
        />
        <KPICard
          title="Herfindahl-Hirschman Index (HHI)"
          value={concentration_metrics.herfindahl_hirschman_index.toFixed(1)}
          subtitle="Moderate-to-high geographic concentration"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top 10 States Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Top Contributing States (₹ Crore)
            </h3>
            <p className="text-[11px] text-slate-500">Direct tax collection by state collection circles</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={top_contributing_states}
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k Cr`} />
                <YAxis dataKey="state" type="category" stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip formatter={(val: number) => [`₹ ${val.toLocaleString('en-IN')} Cr`, 'Collection']} />
                <Bar dataKey="total_collection" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Total Collection" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zonal Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
            Zonal Distribution Share
          </h3>
          <p className="text-[11px] text-slate-500 mb-3">Western & Northern zone collections</p>
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

      {/* Corporate Headquarters Effect Methodology Note */}
      <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-600">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Domain Caveat: Assessing Circle vs. Final Economic Incidence</span>
          <p className="mt-0.5 leading-relaxed">
            Direct tax revenue is credited to the location of the Principal Chief Commissioner of Income Tax (Pr. CCIT) where the taxpayer return is assessed.
            Because nationwide corporations cluster corporate headquarters in metro centers (e.g., Mumbai, New Delhi, Bengaluru), state collections reflect corporate administrative registration rather than regional economic consumption.
          </p>
        </div>
      </div>

      {/* State Ranking Ledger */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            All State & Union Territory Tax Collections (FY 2022-23)
          </h3>
          <span className="text-[11px] text-slate-500">Total: {all_states.length} Jurisdictions</span>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold sticky top-0 border-b border-slate-200">
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
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {s.zone}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono">{s.corporation_tax ? `₹ ${s.corporation_tax.toLocaleString('en-IN')}` : '-'}</td>
                  <td className="py-2 px-3 text-right font-mono">{s.personal_income_tax ? `₹ ${s.personal_income_tax.toLocaleString('en-IN')}` : '-'}</td>
                  <td className="py-2 px-3 text-right font-bold text-indigo-700 font-mono">₹ {s.total_collection.toLocaleString('en-IN')}</td>
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
