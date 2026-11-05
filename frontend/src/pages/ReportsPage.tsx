import { useState } from 'react';
import { FileText, FileSpreadsheet, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { taxService } from '../services/taxService';
import YearFilter from '../components/filters/YearFilter';

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Briefing Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Executive PDF Dossier</h3>
                <p className="text-xs text-slate-500">Publication-grade ReportLab document</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Synthesizes macro revenue collections, Gross vs Net trajectories, refunds velocity, top 5 contributing states,
              and formal CBDT methodological citations formatted for policy presentations and academic review.
            </p>

            <ul className="text-xs text-slate-600 space-y-2 mb-6">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Macro KPI summary table with ₹ Crore standardization</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zonal and regional ranking breakdown</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Assessment Year vs Financial Year domain disclaimer</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingPDF ? 'Generating PDF...' : `Download PDF Dossier (${selectedFY})`}</span>
          </button>
        </div>

        {/* Excel Workbook Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Multi-Sheet Excel Workbook</h3>
                <p className="text-xs text-slate-500">Styled OpenPyXL spreadsheet (.xlsx)</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Provides raw, structured, and audit-ready statistical sheets with custom header styles, auto-formatted column
              widths, and un-truncated financial records ready for advanced modeling in Excel or Python.
            </p>

            <ul className="text-xs text-slate-600 space-y-2 mb-6">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tab 1: <code>Revenue_TimeSeries</code> (FY 2014-15 to FY 2022-23)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tab 2: <code>State_Collections</code> (36 States & UTs with Zonal tags)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tab 3: <code>ITR_Demographics</code> (ITR-1 through ITR-7 filer volumes)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tab 4: <code>Income_Slabs</code> (Empirical income bracket distribution)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center space-x-2"
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
