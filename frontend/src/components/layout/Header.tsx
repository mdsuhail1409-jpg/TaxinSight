import { useState } from 'react';
import { Database, Menu, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../ui/Breadcrumbs';
import ExportButtons from '../ui/ExportButtons';
import DatasetSelector from '../filters/DatasetSelector';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [selectedDataset, setSelectedDataset] = useState('cbdt-official-time-series');

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center space-x-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Breadcrumbs />
      </div>

      {/* Center / Right: Dataset Selector, Source Pill, Export Controls */}
      <div className="flex items-center space-x-3">
        <div className="hidden lg:block">
          <DatasetSelector
            selectedDataset={selectedDataset}
            onDatasetChange={setSelectedDataset}
          />
        </div>

        <div className="hidden 2xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>CBDT Official Statistics</span>
        </div>

        <ExportButtons financialYear="2022-23" />

        <a
          href="http://127.0.0.1:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition"
        >
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          <span>API Docs</span>
        </a>
      </div>
    </header>
  );
}
