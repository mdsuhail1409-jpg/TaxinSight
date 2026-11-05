import { ShieldCheck, Database, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
          CBDT Official Direct Tax Data
        </span>
        <span className="text-xs text-slate-400 hidden sm:inline">|</span>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Ministry of Finance, Government of India
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>API Connected</span>
        </div>

        <Link
          to="/reports"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition shadow-sm"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Export Reports</span>
        </Link>

        <a
          href="http://127.0.0.1:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium transition"
        >
          <Database className="w-3.5 h-3.5" />
          <span>FastAPI Docs</span>
        </a>
      </div>
    </header>
  );
}

