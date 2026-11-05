import { Calendar } from 'lucide-react';

interface YearFilterProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  options?: string[];
  label?: string;
}

const DEFAULT_YEARS = [
  '2022-23',
  '2021-22',
  '2020-21',
  '2019-20',
  '2018-19',
  '2017-18',
  '2016-17',
  '2015-16',
  '2014-15',
];

export default function YearFilter({
  selectedYear,
  onYearChange,
  options = DEFAULT_YEARS,
  label = 'Financial Year (FY)',
}: YearFilterProps) {
  return (
    <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs">
      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="font-medium text-slate-500 whitespace-nowrap">{label}:</span>
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer pr-2"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
