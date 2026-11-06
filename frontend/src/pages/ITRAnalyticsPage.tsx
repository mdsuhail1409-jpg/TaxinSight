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
import { FileText, ShieldAlert } from 'lucide-react';
import { taxService } from '../services/taxService';
import { ITRAnalyticsData } from '../types';
import KPICard from '../components/dashboard/KPICard';
import YearFilter from '../components/filters/YearFilter';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';

const FORM_COLORS = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#475569'];
const AY_OPTIONS = ['2023-24', '2022-23', '2021-22'];

export default function ITRAnalyticsPage() {
  const [data, setData] = useState<ITRAnalyticsData | null>(null);
  const [selectedAY, setSelectedAY] = useState<string>('2023-24');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    taxService
      .getITRAnalytics(selectedAY)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load ITR analytics'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [selectedAY]);

  if (loading && !data) {
    return <LoadingState message="Loading ITR Telemetry..." submessage="Parsing statutory return filings and entity classifications" />;
  }

  if (error || !data) {
    return <ErrorState error={error || 'Failed to load ITR analytics'} onRetry={fetchData} />;
  }

  const { form_distribution, category_distribution, total_filings_count, assessment_year, financial_year } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">ITR Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Returns filed across statutory ITR forms (ITR-1 Sahaj to ITR-7) and taxpayer legal classifications
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <KPICard
          title="Total Returns Filed"
          value={`${(total_filings_count / 10000000).toFixed(2)} Crore`}
          subtitle={`For AY ${assessment_year} (Income earned in FY ${financial_year})`}
        />
        <KPICard
          title="Dominant Form: ITR-1 (Sahaj)"
          value={`${form_distribution[0]?.share_pct || 48.8}%`}
          subtitle="Salaried & single house property owners"
        />
        <KPICard
          title="Individual Taxpayer Share"
          value={`${category_distribution[0]?.share_pct || 94.3}%`}
          subtitle="94%+ of all returns lodged in India are Individuals"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ITR Form Distribution */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Returns Filed by ITR Form (Count in Lakhs)
            </h3>
            <p className="text-[11px] text-slate-500">Distribution of electronic returns by statutory form code</p>
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
                <Bar dataKey="count_lakhs" fill="#4f46e5" radius={[3, 3, 0, 0]} name="Filings (Lakhs)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taxpayer Entity Category Donut */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Taxpayer Legal Category Breakdown
            </h3>
            <p className="text-[11px] text-slate-500">Individuals vs HUFs vs Firms vs Corporate entities</p>
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

      {/* Taxpayer vs Return Filer Distinction Callout */}
      <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-600">
        <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Domain Note: Taxpayers vs. Return Filers vs. Returns Filed</span>
          <p className="mt-0.5 leading-relaxed">
            • <strong>Returns Filed</strong> represents gross forms submitted (including revised and belated returns).<br />
            • <strong>Return Filers</strong> represents unique PAN entities filing returns (approx 65% of individual filers report nil tax liability due to Sec 87A rebate).<br />
            • <strong>Effective Taxpayers</strong> includes return filers plus persons whose income suffered TDS/TCS but who were legally exempt from filing an ITR.
          </p>
        </div>
      </div>

      {/* Statutory ITR Form Architecture Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Statutory Income Tax Return (ITR) Schedule & Eligibility Matrix
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">AY {assessment_year}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Form Designation</th>
                <th className="py-2.5 px-3 text-right">Returns Filed</th>
                <th className="py-2.5 px-3 text-right">Share %</th>
                <th className="py-2.5 px-4">Statutory Description & Eligibility Criteria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {form_distribution.map((f) => (
                <tr key={f.form} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-bold text-indigo-700 flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{f.form}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold font-mono text-slate-800">
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
