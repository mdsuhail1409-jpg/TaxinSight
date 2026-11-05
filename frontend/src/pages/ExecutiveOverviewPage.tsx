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
import { IndianRupee, Building2, User, RefreshCw, Users, Gauge } from 'lucide-react';
import { taxService } from '../services/taxService';
import { DashboardSummaryData } from '../types';
import KPICard from '../components/dashboard/KPICard';
import YearFilter from '../components/filters/YearFilter';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function ExecutiveOverviewPage() {
  const [data, setData] = useState<DashboardSummaryData | null>(null);
  const [selectedFY, setSelectedFY] = useState<string>('2022-23');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    taxService
      .getDashboardSummary(selectedFY)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to fetch executive summary.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedFY]);

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
        Error loading executive dashboard: {error}
      </div>
    );
  }

  const { kpis, historical_trend, revenue_composition } = data;

  return (
    <div className="space-y-6">
      {/* Title & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Overview</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Macro-level direct tax collection trajectory, composition, and macroeconomic buoyancy
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <YearFilter selectedYear={selectedFY} onYearChange={setSelectedFY} />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <KPICard
          title="Net Direct Tax Collection"
          value={`₹ ${(kpis.net_collection.value / 100000).toFixed(2)} Lakh Cr`}
          unit={`(₹ ${kpis.net_collection.value.toLocaleString('en-IN')} Cr)`}
          change={kpis.net_collection.yoy_growth_pct}
          isPositive={kpis.net_collection.is_positive}
          changeLabel="YoY Sovereign Growth"
          icon={<IndianRupee className="w-5 h-5" />}
        />

        <KPICard
          title="Corporation Tax (CIT)"
          value={`₹ ${(kpis.corporation_tax.value / 100000).toFixed(2)} Lakh Cr`}
          unit={`(${kpis.corporation_tax.share_of_direct_tax_pct}% of total)`}
          subtitle="Corporate tax returns"
          icon={<Building2 className="w-5 h-5" />}
        />

        <KPICard
          title="Personal Income Tax (PIT)"
          value={`₹ ${(kpis.personal_income_tax.value / 100000).toFixed(2)} Lakh Cr`}
          unit={`(${kpis.personal_income_tax.share_of_direct_tax_pct}% of total)`}
          subtitle="Individuals & non-corporates"
          icon={<User className="w-5 h-5" />}
        />

        <KPICard
          title="Tax Refunds Disbursed"
          value={`₹ ${(kpis.refunds_issued.value / 100000).toFixed(2)} Lakh Cr`}
          unit={`(${kpis.refunds_issued.refund_to_gross_pct}% of gross)`}
          subtitle="Automated refund processing"
          icon={<RefreshCw className="w-5 h-5" />}
        />

        <KPICard
          title="Returns Filed (ITR)"
          value={`${kpis.total_filers.value} Cr Filers`}
          unit="Cumulative returns"
          change={kpis.total_filers.yoy_growth_pct}
          changeLabel="YoY Filer Expansion"
          icon={<Users className="w-5 h-5" />}
        />

        <KPICard
          title="Direct Tax Buoyancy"
          value={kpis.buoyancy_factor ? kpis.buoyancy_factor.toFixed(2) : '1.18'}
          unit="Ratio to GDP Growth"
          subtitle="% Δ Tax / % Δ Nominal GDP"
          icon={<Gauge className="w-5 h-5" />}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Trendline Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Direct Tax Collection Time Series (₹ Crore)
              </h3>
              <p className="text-xs text-slate-500">Gross vs Net Collections across Financial Years</p>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              CBDT Historical Archive
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historical_trend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="corpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
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
                  formatter={(val: number) => [`₹ ${val.toLocaleString('en-IN')} Cr`, 'Collection']}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="net_collection" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#netGrad)" name="Net Collection" />
                <Area type="monotone" dataKey="corporation_tax" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#corpGrad)" name="Corporation Tax" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Composition Donut Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Direct Tax Mix ({data.selected_financial_year})
            </h3>
            <p className="text-xs text-slate-500 mb-4">Corporate vs Personal Income Tax parity</p>

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

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Assessment Year:</span>
              <span className="font-semibold text-slate-700">{data.selected_assessment_year}</span>
            </div>
            <div className="flex justify-between">
              <span>Domain Standard:</span>
              <span className="font-semibold text-slate-700">CBDT Methodological Schedule</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

