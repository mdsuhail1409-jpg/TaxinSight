import { AlertOctagon, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="p-8 bg-rose-50/60 border border-rose-200 rounded-xl text-center flex flex-col items-center justify-center my-6">
      <div className="p-3 bg-rose-100 text-rose-700 rounded-full mb-3">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-rose-900">Telemetry Ingestion Error</h3>
      <p className="text-xs text-rose-700 mt-1 max-w-md font-mono">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
}

