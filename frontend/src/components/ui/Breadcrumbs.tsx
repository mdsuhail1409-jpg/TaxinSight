import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_NAMES: Record<string, string> = {
  '': 'Overview',
  'overview': 'Overview',
  'revenue': 'Revenue Analytics',
  'regional': 'Regional Analytics',
  'itr': 'ITR Analytics',
  'statistics': 'Statistical Analysis',
  'data-quality': 'Data Quality Intelligence',
  'datasets': 'Dataset Management',
  'reports': 'Reports & Exports',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
      <Link to="/" className="hover:text-slate-900 transition flex items-center space-x-1">
        <Home className="w-3.5 h-3.5" />
        <span>TaxInsight</span>
      </Link>
      {pathnames.length > 0 && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">
            {ROUTE_NAMES[pathnames[0]] || pathnames[0]}
          </span>
        </>
      )}
    </nav>
  );
}

