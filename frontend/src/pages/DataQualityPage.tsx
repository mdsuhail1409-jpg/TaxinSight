import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { taxService } from '../services/taxService';
import { DataQualityAnalyticsData } from '../types';
import KPICard from '../components/dashboard/KPICard';

export default function DataQualityPage() {
  const [data, setData] = useState<DataQualityAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    taxService
      .getDataQualityAnalytics()
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load data quality metrics'))
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
        Error loading data quality audit: {error}
      </div>
    );
  }

  const { overall_health_score, metrics_evaluated, completeness_by_table, reconciliation_status, anomalies_detected } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Data Quality Intelligence</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Audit trails, completeness verification, missing value indicators, and reconciliation balance checks
        </p>
      </div>

      {/* Top Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KPICard
          title="Overall Data Health"
          value={`${overall_health_score}%`}
          subtitle="System schema integrity & verification"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <KPICard
          title="Audit Checks Evaluated"
          value={metrics_evaluated}
          subtitle="Completeness & constraint checks"
          icon={<FileSpreadsheet className="w-5 h-5 text-indigo-600" />}
        />
        <KPICard
          title="Reconciliation Status"
          value={reconciliation_status.status}
          subtitle={reconciliation_status.balance_equation}
          icon={<CheckCircle2 className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Reconciliation Ledger Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Direct Tax Reconciliation Equation: {reconciliation_status.balance_equation}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Every historical record across FY 2014-15 to FY 2022-23 was audited against official CBDT receipts.
              Verified {reconciliation_status.records_checked} time-series entries with {reconciliation_status.discrepancies_found} discrepancies.
            </p>
          </div>
        </div>
      </div>

      {/* Completeness by Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Table Completeness & Record Counts
          </h3>
        </div>
        <div className="divide-y divide-slate-200 text-xs">
          {completeness_by_table.map((tbl) => (
            <div key={tbl.table} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div>
                <span className="font-mono font-bold text-indigo-800 text-sm">{tbl.table}</span>
                <p className="text-slate-500 mt-0.5">Total records stored: {tbl.total_records}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${tbl.completeness_pct}%` }}
                  ></div>
                </div>
                <span className="font-bold text-slate-700">{tbl.completeness_pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomalies and Outliers Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Documented Statistical Variances & Macro Outliers
          </h3>
        </div>
        <div className="space-y-3">
          {anomalies_detected.map((a, idx) => (
            <div key={idx} className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">{a.type} ({a.financial_year})</span>
                <span className="font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">{a.metric}: {a.value}</span>
              </div>
              <p className="text-amber-800">{a.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
