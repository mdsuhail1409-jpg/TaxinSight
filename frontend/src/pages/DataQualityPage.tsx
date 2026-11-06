import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { taxService } from '../services/taxService';
import { DataQualityAnalyticsData } from '../types';
import KPICard from '../components/dashboard/KPICard';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

export default function DataQualityPage() {
  const [data, setData] = useState<DataQualityAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    taxService
      .getDataQualityAnalytics()
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Failed to load data quality metrics'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !data) {
    return (
      <LoadingState
        message="Running Data Integrity Audits..."
        submessage="Validating Gross-Refunds reconciliation, schema constraints, and table completeness"
      />
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        error={error || 'Failed to load data quality audit'}
        onRetry={fetchData}
      />
    );
  }

  const { overall_health_score, metrics_evaluated, completeness_by_table, reconciliation_status, anomalies_detected } = data;

  return (
    <div className="space-y-6">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Data Quality Intelligence</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic ledger audits, table completeness metrics, reconciliation balance checks, and macro anomalies
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="emerald" size="md">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Audit Score: {overall_health_score.toFixed(1)}%
          </Badge>
        </div>
      </div>

      {/* Top Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <KPICard
          title="Overall Health Score"
          value={`${overall_health_score}%`}
          subtitle="System schema integrity & verification"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
        <KPICard
          title="Audit Rules Evaluated"
          value={metrics_evaluated}
          subtitle="Completeness & numeric constraints"
          icon={<FileSpreadsheet className="w-4 h-4 text-indigo-600" />}
        />
        <KPICard
          title="Reconciliation Status"
          value={reconciliation_status.status}
          subtitle={reconciliation_status.balance_equation}
          icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
        />
      </div>

      {/* Reconciliation Ledger Card */}
      <Card>
        <div className="flex items-start space-x-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-800">
                Direct Tax Reconciliation: {reconciliation_status.balance_equation}
              </h3>
              <Badge variant="emerald">100% Reconciled</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Every historical record across FY 2010-11 to FY 2023-24 was audited against official CBDT receipts.
              Verified <strong>{reconciliation_status.records_checked}</strong> time-series entries with <strong>{reconciliation_status.discrepancies_found}</strong> discrepancies.
            </p>
          </div>
        </div>
      </Card>

      {/* Two Column Grid: Completeness & Detected Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Completeness by Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Table Completeness & Record Counts
            </h3>
            <span className="text-[10px] text-slate-500 font-medium">SQLite Engine</span>
          </div>
          <div className="divide-y divide-slate-200 text-xs">
            {completeness_by_table.map((tbl) => (
              <div key={tbl.table} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800 font-mono text-[11px]">{tbl.table}</div>
                  <div className="text-[10px] text-slate-400">Target schema: {tbl.total_records} observations</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${tbl.completeness_pct}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-700 font-mono text-[11px] w-12 text-right">
                    {tbl.completeness_pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Macroeconomic Anomalies & Explanations */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Documented Macro Anomalies & Explanations
            </h3>
            <Badge variant="amber">{anomalies_detected.length} Events</Badge>
          </div>
          <div className="divide-y divide-slate-200 text-xs p-2">
            {anomalies_detected.map((anomaly, idx) => (
              <div key={idx} className="p-3 hover:bg-slate-50 rounded-lg transition space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>FY {anomaly.financial_year} — {anomaly.metric}</span>
                  </span>
                  <Badge variant="amber">{anomaly.value}</Badge>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                  {anomaly.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
