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
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { name: 'Executive Overview', path: '/', icon: LayoutDashboard },
  { name: 'Revenue Analytics', path: '/revenue', icon: TrendingUp },
  { name: 'Regional Analytics', path: '/regional', icon: MapPin },
  { name: 'ITR Analytics', path: '/itr', icon: FileSpreadsheet },
  { name: 'Statistical Analysis', path: '/statistics', icon: Sigma },
  { name: 'Data Quality', path: '/data-quality', icon: CheckCircle2 },
  { name: 'Dataset Management', path: '/datasets', icon: FolderArchive },
  { name: 'Reports & Dossiers', path: '/reports', icon: Download },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0a1128] text-slate-300 flex flex-col shrink-0 transition-transform duration-300 ease-in-out border-r border-slate-800/80 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/90">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">TaxInsight</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Direct Tax Intelligence
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
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
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Institutional Baseline Footer */}
        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>Jurisdiction</span>
            <span className="text-slate-300 font-medium">India (CBDT)</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span>Methodology</span>
            <span className="text-slate-400 font-mono">AY = FY + 1</span>
          </div>
        </div>
      </aside>
    </>
  );
}
