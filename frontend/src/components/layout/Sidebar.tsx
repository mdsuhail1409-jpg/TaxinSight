import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  MapPin,
  FileSpreadsheet,
  Sigma,
  CheckCircle2,
  FolderArchive,
  Download,
  IndianRupee,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Executive Overview', path: '/', icon: LayoutDashboard },
  { name: 'Revenue Analytics', path: '/revenue', icon: TrendingUp },
  { name: 'Regional Analytics', path: '/regional', icon: MapPin },
  { name: 'ITR Analytics', path: '/itr', icon: FileSpreadsheet },
  { name: 'Statistical Analysis', path: '/statistics', icon: Sigma },
  { name: 'Data Quality', path: '/data-quality', icon: CheckCircle2 },
  { name: 'Dataset Management', path: '/datasets', icon: FolderArchive },
  { name: 'PDF & Excel Reports', path: '/reports', icon: Download },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
          <IndianRupee className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">TaxInsight</h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Direct Tax Intelligence
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Analytical Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>Release</span>
          <span className="text-slate-300 font-mono">v1.0-CBDT</span>
        </div>
        <p className="text-slate-400 leading-tight">
          Public Macro Data &copy; 2026 CBDT / Ministry of Finance
        </p>
      </div>
    </aside>
  );
}
