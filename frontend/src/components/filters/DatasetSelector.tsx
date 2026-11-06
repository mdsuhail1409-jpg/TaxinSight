import { Database } from 'lucide-react';

interface DatasetSelectorProps {
  selectedDataset: string;
  onDatasetChange: (dataset: string) => void;
  options?: { id: string; label: string }[];
}

const DEFAULT_OPTIONS = [
  { id: 'cbdt-official-time-series', label: 'CBDT Official Direct Tax Archive (2010–2024)' },
  { id: 'state-collections-audited', label: 'State & UT Assessing Circles (36 Jurisdictions)' },
  { id: 'itr-efiling-portal', label: 'Income Tax e-Filing Portal Telemetry' },
];

export default function DatasetSelector({
  selectedDataset,
  onDatasetChange,
  options = DEFAULT_OPTIONS,
}: DatasetSelectorProps) {
  return (
    <div className="flex items-center space-x-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/90 shadow-xs text-xs">
      <Database className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
      <span className="font-medium text-slate-500 hidden xl:inline">Dataset:</span>
      <select
        value={selectedDataset}
        onChange={(e) => onDatasetChange(e.target.value)}
        className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer max-w-[200px] truncate"
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

