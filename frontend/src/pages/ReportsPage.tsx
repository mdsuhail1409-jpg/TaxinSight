import { useState } from 'react';
import { FileText, FileSpreadsheet, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { taxService } from '../services/taxService';
import YearFilter from '../components/filters/YearFilter';
import Badge from '../components/ui/Badge';

export default function ReportsPage() {
  const [selectedFY, setSelectedFY] = useState<string>('2022-23');
  const [downloadingPDF, setDownloadingPDF] = useState<boolean>(false);
  const [downloadingExcel, setDownloadingExcel] = useState<boolean>(false);

  const handleDownloadPDF = () => {
    setDownloadingPDF(true);
    const url = taxService.getPDFReportUrl(selectedFY);
    window.open(url, '_blank');
    setTimeout(() => setDownloadingPDF(false), 1500);
  };

  const handleDownloadExcel = () => {
    setDownloadingExcel(true);
    const url = taxService.getExcelReportUrl(selectedFY);
    window.open(url, '_blank');
    setTimeout(() => setDownloadingExcel(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">PDF & Excel Reports Studio</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated generation of formal executive briefing dossiers (ReportLab) and multi-tab statistical workbooks (OpenPyXL)
          </p>
        </div>

        <YearFilter selectedYear={selectedFY} onYearChange={setSelectedFY} />
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* PDF Briefing Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Executive PDF Dossier</h3>
                  <p className="text-[11px] text-slate-500">Publication-grade ReportLab document</p>
                </div>
              </div>
              <Badge variant="rose">Vector PDF</Badge>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Synthesizes macro revenue collections, Gross vs Net trajectories, refunds velocity, top 5 contributing states,
              and formal CBDT methodological citations formatted for policy presentations and academic defense.
            </p>

            <ul className="text-xs text-slate-600 space-y-2 mb-6">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Macro KPI summary table with ₹ Crore standardization</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zonal and regional ranking breakdown</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Assessment Year vs Financial Year accounting disclaimer</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white rounded-lg text-xs font-semibold transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingPDF ? 'Generating Document...' : `Download PDF Dossier (${selectedFY})`}</span>
          </button>
        </div>

        {/* Excel Workbook Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Multi-Sheet Excel Workbook</h3>
                  <p className="text-[11px] text-slate-500">Styled OpenPyXL spreadsheet (.xlsx)</p>
                </div>
              </div>
              <Badge variant="emerald">OpenPyXL / XLSX</Badge>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Provides raw, structured, and audit-ready statistical sheets with custom header styles, auto-formatted column
              widths, and un-truncated financial records ready for advanced modeling in Excel or Python.
            </p>

            <ul className="text-xs text-slate-600 space-y-2 mb-6">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tab 1: <code>Revenue_TimeSeries</code> (14 Fiscal Years)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tab 2: <code>State_Collections</code> (36 States & UTs with Zonal tags)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tab 3: <code>ITR_Demographics</code> (ITR-1 through ITR-7 filer volumes)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tab 4: <code>Income_Slabs</code> (Empirical income bracket distribution)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-lg text-xs font-semibold transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingExcel ? 'Generating Workbook...' : `Download Multi-Tab Excel (${selectedFY})`}</span>
          </button>
        </div>
      </div>

      {/* Assurance Notice */}
      <div className="bg-slate-100 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Academic & Portfolio Demonstration Note:</span>
          <p className="mt-0.5">
            All data exported in these dossiers is extracted from publicly released publications of the Central Board of Direct Taxes,
            Department of Revenue, Ministry of Finance, Government of India. Figures represent macro aggregates and carry zero private taxpayer information.
          </p>
        </div>
      </div>
    </div>
  );
}

