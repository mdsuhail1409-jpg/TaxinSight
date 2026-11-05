import React, { useState, useEffect } from 'react';
import { UploadCloud, FileSpreadsheet, Check, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { taxService } from '../services/taxService';
import { DatasetItem, DatasetPreviewData } from '../types';

export default function DatasetManagementPage() {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<DatasetPreviewData | null>(null);

  const fetchDatasets = () => {
    setLoading(true);
    taxService
      .getDatasets()
      .then((res) => setDatasets(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) {
        setUploadError('File exceeds 15MB limit.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      await taxService.uploadDataset(selectedFile, description);
      setUploadSuccess(`Successfully uploaded "${selectedFile.name}"!`);
      setSelectedFile(null);
      setDescription('');
      fetchDatasets();
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (id: string) => {
    try {
      const data = await taxService.getDatasetPreview(id);
      setPreview(data);
    } catch (err: any) {
      alert('Could not preview dataset: ' + (err.message || ''));
    }
  };

  const handleProcess = async (id: string) => {
    try {
      await taxService.processDataset(id);
      alert('Dataset processed and schema staged successfully.');
      fetchDatasets();
    } catch (err: any) {
      alert('Failed to process dataset: ' + (err.message || ''));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dataset Management</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Upload, validate, inspect, and stage official CBDT macro tables (.csv and .xlsx up to 15MB)
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          Upload Official Income Tax Dataset
        </h3>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer">
            <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <label className="block text-xs font-medium text-slate-700 cursor-pointer">
              <span className="text-indigo-600 font-semibold underline">Click to select file</span> or drag & drop
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-400 mt-1">Supported formats: CSV, XLSX (Max 15MB)</p>
            {selectedFile && (
              <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                <FileSpreadsheet className="w-4 h-4" />
                <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dataset description / source tag (e.g., CBDT FY 2023-24 State Returns)"
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center justify-center space-x-2 shrink-0"
            >
              {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              <span>{uploading ? 'Validating...' : 'Upload & Validate'}</span>
            </button>
          </div>

          {uploadSuccess && (
            <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
              <Check className="w-4 h-4" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {uploadError && (
            <div className="flex items-center space-x-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{uploadError}</span>
            </div>
          )}
        </form>
      </div>

      {/* Dataset List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Registered Datasets & Repositories
          </h3>
          <button
            onClick={fetchDatasets}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading datasets...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Filename</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {datasets.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{d.filename}</td>
                    <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-slate-500">{d.file_type}</td>
                    <td className="py-2.5 px-3 text-slate-500">{(d.file_size_bytes / 1024).toFixed(1)} KB</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          d.status === 'processed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-xs">{d.description || '-'}</td>
                    <td className="py-2.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => handlePreview(d.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                      {d.status !== 'processed' && (
                        <button
                          onClick={() => handleProcess(d.id)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[11px] font-medium transition"
                        >
                          Process
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {preview && (
        <div className="bg-white rounded-xl border border-indigo-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Data Preview (First {preview.preview_rows.length} rows of {preview.total_rows})
              </h3>
              <p className="text-xs text-slate-500">Columns: {preview.columns.join(', ')}</p>
            </div>
            <button
              onClick={() => setPreview(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close Preview
            </button>
          </div>

          <div className="overflow-x-auto max-h-64 border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 sticky top-0 font-semibold border-b border-slate-200">
                <tr>
                  {preview.columns.map((col) => (
                    <th key={col} className="py-2 px-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {preview.preview_rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {preview.columns.map((col) => (
                      <td key={col} className="py-1.5 px-3 whitespace-nowrap">
                        {String(row[col] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
