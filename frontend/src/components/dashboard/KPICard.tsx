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
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
          {icon && <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-100">{icon}</div>}
        </div>

        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </span>
          {unit && <span className="text-[11px] font-medium text-slate-500">{unit}</span>}
        </div>
      </div>

      {(showChange || subtitle) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center space-x-2 text-xs">
          {showChange && (
            <span
              className={`inline-flex items-center font-semibold text-[11px] px-1.5 py-0.5 rounded-md border ${
                isUp
                  ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60'
                  : 'bg-rose-50/80 text-rose-700 border-rose-200/60'
              }`}
            >
              {isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {change > 0 ? `+${change}%` : `${change}%`}
            </span>
          )}
          <span className="text-[11px] text-slate-500 truncate">{subtitle || changeLabel}</span>
        </div>
      )}
    </div>
  );
}

