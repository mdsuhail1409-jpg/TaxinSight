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
import { ITRAnalyticsData } from '../types';
import KPICard from '../components/dashboard/KPICard';
import YearFilter from '../components/filters/YearFilter';

const FORM_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];
const AY_OPTIONS = ['2023-24', '2022-23'];

export default function ITRAnalyticsPage() {
  const [data, setData] = useState<ITRAnalyticsData | null>(null);
  const [selectedAY, setSelectedAY] = useState<string>('2023-24');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    taxService
      .getITRAnalytics(selectedAY)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load ITR analytics'))
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
        Error loading ITR analytics: {error}
      </div>
    );
  }

  const { form_distribution, category_distribution, total_filings_count, assessment_year, financial_year } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">ITR Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Returns filed across statutory ITR Forms (ITR-1 Sahaj to ITR-7) and taxpayer legal entities
          </p>
        </div>

        <YearFilter
          selectedYear={selectedAY}
          onYearChange={setSelectedAY}
          options={AY_OPTIONS}
          label="Assessment Year (AY)"
        />
      </div>

      {/* Top Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KPICard
          title="Total Returns Filed"
          value={`${(total_filings_count / 10000000).toFixed(2)} Crore`}
          subtitle={`For AY ${assessment_year} (Income earned in FY ${financial_year})`}
        />
        <KPICard
          title="Dominant Form: ITR-1 (Sahaj)"
          value={`${form_distribution[0]?.share_pct || 48.8}%`}
          subtitle="Salaried & small property owners"
        />
        <KPICard
          title="Individual Taxpayer Share"
          value={`${category_distribution[0]?.share_pct || 94.3}%`}
          subtitle="94%+ of all return filers in India are Individuals"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ITR Form Distribution Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Returns Filed by ITR Form (Count in Lakhs)
            </h3>
            <p className="text-xs text-slate-500">Form-wise volume distribution</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={form_distribution.map((f) => ({ ...f, count_lakhs: (f.count / 100000).toFixed(1) }))}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="form" stroke="#64748b" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" height={40} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}L`} />
                <Tooltip formatter={(val: number) => [`${val} Lakh Returns`, 'Filings']} />
                <Bar dataKey="count_lakhs" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Filings (Lakhs)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taxpayer Entity Category Donut */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Taxpayer Legal Category Breakdown
            </h3>
            <p className="text-xs text-slate-500">Individuals vs HUFs vs Firms vs Corporate entities</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={category_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="category"
                >
                  {category_distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={FORM_COLORS[index % FORM_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => [`${(val / 100000).toFixed(1)} Lakh Returns`, '']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Statutory Form Architecture Guide Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Statutory Income Tax Return (ITR) Reference Schedule
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Form</th>
                <th className="py-2.5 px-3 text-right">Returns Filed</th>
                <th className="py-2.5 px-3 text-right">Share %</th>
                <th className="py-2.5 px-4">Statutory Description & Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {form_distribution.map((f) => (
                <tr key={f.form} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-bold text-indigo-700">{f.form}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                    {(f.count / 100000).toFixed(1)} Lakh
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-600">{f.share_pct}%</td>
                  <td className="py-2.5 px-4 text-slate-600">{f.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
