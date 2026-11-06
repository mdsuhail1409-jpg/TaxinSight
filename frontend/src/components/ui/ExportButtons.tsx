import { useState } from 'react';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';
import { taxService } from '../../services/taxService';

interface ExportButtonsProps {
  financialYear?: string;
  className?: string;
}

export default function ExportButtons({ financialYear = '2022-23', className = '' }: ExportButtonsProps) {
  const [downloading, setDownloading] = useState<'pdf' | 'excel' | null>(null);

  const downloadPDF = () => {
    setDownloading('pdf');
    window.open(taxService.getPDFReportUrl(financialYear), '_blank');
    setTimeout(() => setDownloading(null), 1500);
  };

  const downloadExcel = () => {
    setDownloading('excel');
    window.open(taxService.getExcelReportUrl(financialYear), '_blank');
    setTimeout(() => setDownloading(null), 1500);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={downloadPDF}
        disabled={downloading === 'pdf'}
        title="Download Executive PDF Briefing"
        className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium shadow-sm transition inline-flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
      >
        <FileText className="w-3.5 h-3.5 text-red-600" />
        <span className="hidden sm:inline">Export PDF</span>
        {downloading === 'pdf' ? <Download className="w-3 h-3 animate-bounce" /> : null}
      </button>

      <button
        onClick={downloadExcel}
        disabled={downloading === 'excel'}
        title="Download Structured Excel Workbook"
        className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium shadow-sm transition inline-flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">Export Excel</span>
        {downloading === 'excel' ? <Download className="w-3 h-3 animate-bounce" /> : null}
      </button>
    </div>
  );
}

