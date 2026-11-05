import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number | null;
  changeLabel?: string;
  isPositive?: boolean | null;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function KPICard({
  title,
  value,
  unit,
  change,
  changeLabel = 'vs last period',
  isPositive,
  subtitle,
  icon,
}: KPICardProps) {
  const showChange = change !== undefined && change !== null;
  const isUp = isPositive ?? (change ? change >= 0 : true);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline space-x-2">
        <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </span>
        {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
      </div>

      {(showChange || subtitle) && (
        <div className="mt-3 flex items-center space-x-2 text-xs">
          {showChange && (
            <span
              className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-full ${
                isUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {change > 0 ? `+${change}%` : `${change}%`}
            </span>
          )}
          <span className="text-slate-400 truncate">{subtitle || changeLabel}</span>
        </div>
      )}
    </div>
  );
}

