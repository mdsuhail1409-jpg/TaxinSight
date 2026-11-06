import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export default function LoadingState({
  message = 'Loading analytical telemetry...',
  submessage = 'Querying SQLite engine and executing statistical models',
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3 animate-spin">
        <Loader2 className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{message}</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-sm">{submessage}</p>
    </div>
  );
}

