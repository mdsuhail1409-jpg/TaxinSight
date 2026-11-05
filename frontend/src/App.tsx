import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-bold text-slate-800">TaxinSight</h1>
      </header>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Welcome to TaxinSight</h2>
          <p className="text-slate-600">Platform initialized and ready for feature implementation.</p>
        </div>
      </main>
    </div>
  );
}
