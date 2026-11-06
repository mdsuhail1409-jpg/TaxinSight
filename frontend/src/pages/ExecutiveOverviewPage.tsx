import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { IndianRupee, Building2, User, RefreshCw, Users, Gauge, Lightbulb } from 'lucide-react';
import { taxService } from '../services/taxService';
import { DashboardSummaryData } from '../types';
import KPICard from '../components/dashboard/KPICard';
import YearFilter from '../components/filters/YearFilter';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function ExecutiveOverviewPage() {
  const [data, setData] = useState<DashboardSummaryData | null>(null);
  const [selectedFY, setSelectedFY] = useState<string>('2022-23');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    taxService
      .getDashboardSummary(selectedFY)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to fetch executive summary.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [selectedFY]);

  if (loading && !data) {
    return <LoadingState message="Loading Executive Dashboard..." submessage="Querying macro direct tax time-series telemetry" />;
  }

  if (error || !data) {
    return <ErrorState error={error || 'Failed to load executive summary'} onRetry={fetchData} />;
  }

  const { kpis, historical_trend, revenue_composition } = data;

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Executive Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Macro-level direct tax collections, corporate vs personal parity, and GDP buoyancy
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <YearFilter selectedYear={selectedFY} onYearChange={setSelectedFY} />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <KPICard
          title="Total Net Direct Tax"
          value={`₹ ${(kpis.net_collection.value / 100000).toFixed(2)} Lakh Cr`}
          unit={`(₹ ${kpis.net_collection.value.toLocaleString('en-IN')} Cr)`}
          change={kpis.net_collection.yoy_growth_pct}
          isPositive={kpis.net_collection.is_positive}
          changeLabel="YoY Sovereign Growth"
          icon={<IndianRupee className="w-4 h-4 text-indigo-600" />}
        />

        <KPICard
          title="Corporation Tax (CIT)"
          value={`₹ ${(kpis.corporation_tax.value / 100000).toFixed(2)} Lakh Cr`}
          unit={`(${kpis.corporation_tax.share_of_direct_tax_pct}% of total)`}
          subtitle="Corporate income returns"
          icon={<Building2 className="w-4 h-4 text-blue-600" />}
        />

        <KPICard
          title="Personal Income Tax (PIT)"
          value={`₹ ${(kpis.personal_income_tax.value / 100000).toFixed(2)} Lakh Cr`}
          unit={`(${kpis.personal_income_tax.share_of_direct_tax_pct}% of total)`}
          subtitle="Individuals & non-corporates"
          icon={<User className="w-4 h-4 text-emerald-600" />}
        />

        <KPICard
          title="Tax Refunds Disbursed"
          value={`₹ ${(kpis.refunds_issued.value / 100000).toFixed(2)} Lakh Cr`}
          unit={`(${kpis.refunds_issued.refund_to_gross_pct}% of gross)`}
          subtitle="Automated refund processing"
          icon={<RefreshCw className="w-4 h-4 text-amber-600" />}
        />

        <KPICard
          title="Returns Filed (ITR)"
          value={`${kpis.total_filers.value} Cr Filers`}
          unit="Cumulative returns"
          change={kpis.total_filers.yoy_growth_pct}
          changeLabel="YoY Filer Expansion"
          icon={<Users className="w-4 h-4 text-purple-600" />}
        />

        <KPICard
          title="Direct Tax Buoyancy"
          value={kpis.buoyancy_factor ? kpis.buoyancy_factor.toFixed(2) : '1.18'}
          unit="Elasticity Ratio"
          subtitle="% Δ Tax / % Δ Nominal GDP"
          icon={<Gauge className="w-4 h-4 text-cyan-600" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Historical Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Direct Tax Revenue Trajectory (₹ Crore)
              </h3>
              <p className="text-[11px] text-slate-500">Gross vs Net collections across Financial Years</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              CBDT Historical Archive
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historical_trend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="corpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="financial_year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L Cr`}
                />
                <Tooltip
                  formatter={(val: number) => [`₹ ${val.toLocaleString('en-IN')} Cr`, '']}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="net_collection" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#netGrad)" name="Net Direct Tax" />
                <Area type="monotone" dataKey="corporation_tax" stroke="#0ea5e9" strokeWidth={1.5} fillOpacity={1} fill="url(#corpGrad)" name="Corporation Tax" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tax Composition Donut */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Revenue Composition ({data.selected_financial_year})
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">CIT vs PIT vs Other Direct Taxes share</p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenue_composition}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {revenue_composition.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => [`₹ ${val.toLocaleString('en-IN')} Cr`, 'Share']} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Assessment Year:</span>
              <span className="font-semibold text-slate-700">{data.selected_assessment_year}</span>
            </div>
            <div className="flex justify-between">
              <span>Accounting Basis:</span>
              <span className="font-semibold text-slate-700">Gross − Refunds = Net</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Analytical Insights Callout */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-lg shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Key Strategic Findings ({data.selected_financial_year})
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              • <strong>CIT vs. PIT Parity</strong>: In FY {data.selected_financial_year}, Personal Income Tax collections (₹ {(kpis.personal_income_tax.value / 100000).toFixed(2)} Lakh Cr) reached parity with Corporate Tax (₹ {(kpis.corporation_tax.value / 100000).toFixed(2)} Lakh Cr), reflecting expanding formal individual taxpayer participation and digital TDS coverage.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              • <strong>Buoyancy Coefficient ({kpis.buoyancy_factor ?? '1.18'})</strong>: A direct tax buoyancy factor exceeding 1.0 indicates that tax collections expanded faster than nominal GDP, signifying robust structural tax elasticity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
