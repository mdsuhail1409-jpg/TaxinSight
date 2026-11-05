import { BarChart3, Database, FileSpreadsheet, LayoutDashboard } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">TaxinSight</h1>
            <p className="text-xs text-slate-500">Analytics & Intelligence Platform</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            System Ready
          </span>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Dashboard</p>
              <h3 className="text-xl font-semibold text-slate-800 mt-1">Interactive Analytics</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Data Sources</p>
              <h3 className="text-xl font-semibold text-slate-800 mt-1">Pipelines & Reports</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Backend API</p>
              <h3 className="text-xl font-semibold text-slate-800 mt-1">FastAPI Engine</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Frontend Initialized Successfully</h2>
          <p className="text-slate-600 text-sm">
            All dependencies (Axios, Recharts, Plotly.js, Lucide React, React Router DOM, Tailwind CSS) are installed and ready.
          </p>
        </div>
      </main>
    </div>
  );
}
