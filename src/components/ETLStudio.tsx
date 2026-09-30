import React, { useState } from 'react';
import { SalesRecord, CleaningReport } from '../types/dashboard';
import { cleanSalesDataset } from '../utils/dataCleaner';
import { parseCSVToRows } from '../utils/csvParser';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  Upload,
  Download,
  ShieldCheck,
  FileCode,
  Copy,
} from 'lucide-react';

interface ETLStudioProps {
  cleanedRecords: SalesRecord[];
  cleaningReport: CleaningReport;
  onApplyNewDataset: (records: SalesRecord[], report: CleaningReport, name: string) => void;
  rawSampleSnippet: string;
}

export const ETLStudio: React.FC<ETLStudioProps> = ({
  cleanedRecords,
  cleaningReport,
  onApplyNewDataset,
  rawSampleSnippet,
}) => {
  const [csvInput, setCsvInput] = useState(rawSampleSnippet);
  const [activeView, setActiveView] = useState<'audit' | 'cleaned_table' | 'raw_input'>('audit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customDatasetName, setCustomDatasetName] = useState('Imported Custom Sales');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleProcessRawCSV = () => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const { rows } = parseCSVToRows(csvInput);
        const { cleaned, report } = cleanSalesDataset(rows);
        onApplyNewDataset(cleaned, report, customDatasetName);
        setActiveView('audit');
      } catch (err) {
        console.error('Failed to parse and clean CSV', err);
      } finally {
        setIsProcessing(false);
      }
    }, 200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomDatasetName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvInput(content);
      }
    };
    reader.readAsText(file);
  };

  const downloadCleanedCSV = () => {
    if (cleanedRecords.length === 0) return;
    const headers = ['Date', 'Year', 'Quarter', 'Month', 'Product', 'Category', 'Region', 'Sales', 'Profit', 'Margin_Pct', 'Units'];
    const rows = cleanedRecords.map((r) => [
      r.date,
      r.year,
      r.quarter,
      r.month,
      `"${r.product}"`,
      `"${r.category}"`,
      `"${r.region}"`,
      r.sales,
      r.profit,
      r.margin,
      r.units,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'cleaned_sales_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyCleanedSummary = () => {
    const text = `Data Quality Score: ${cleaningReport.dataQualityScore}%\nTotal Cleaned Rows: ${cleaningReport.totalCleanedRows}\nDuplicates Removed: ${cleaningReport.duplicatesRemoved}\nNulls Imputed: ${cleaningReport.nullsRemovedOrImputed}`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs mb-8 transition-colors">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Data Cleaning & ETL Studio
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated pipeline: deduplication, null imputation, timestamp standardization, and outlier sanitization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadCleanedCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Clean CSV
          </button>
        </div>
      </div>

      {/* KPI Quality Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5">
          <div className="text-[11px] font-medium text-slate-500 mb-1">Quality Health Score</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-5 h-5" />
            {cleaningReport.dataQualityScore}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Production-ready</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5">
          <div className="text-[11px] font-medium text-slate-500 mb-1">Duplicates Dropped</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {cleaningReport.duplicatesRemoved}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Identified & pruned</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5">
          <div className="text-[11px] font-medium text-slate-500 mb-1">Nulls / Missing Imputed</div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {cleaningReport.nullsRemovedOrImputed}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Imputed with median/mean</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5">
          <div className="text-[11px] font-medium text-slate-500 mb-1">Cleaned Records In View</div>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
            {cleaningReport.totalCleanedRows.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">From {cleaningReport.totalRawRows} raw lines</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveView('audit')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeView === 'audit'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Cleaning Audit Trail
        </button>
        <button
          onClick={() => setActiveView('cleaned_table')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeView === 'cleaned_table'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Cleaned Data Table ({cleanedRecords.length})
        </button>
        <button
          onClick={() => setActiveView('raw_input')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeView === 'raw_input'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Import / Paste Raw CSV
        </button>
      </div>

      {/* View 1: Audit Trail */}
      {activeView === 'audit' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Execution audit logs recorded during data ingestion:
          </div>
          <div className="space-y-2">
            {cleaningReport.cleaningSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800"
              >
                <div className="mt-0.5">
                  {step.severity === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : step.severity === 'warning' ? (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {step.step}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Impacted: {step.impactCount} items
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-slate-400">
            <span>All timestamps validated according to ISO 8601</span>
            <button
              onClick={copyCleanedSummary}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copiedNotification ? 'Copied to clipboard!' : 'Copy audit summary'}
            </button>
          </div>
        </div>
      )}

      {/* View 2: Cleaned Data Table */}
      {activeView === 'cleaned_table' && (
        <div className="overflow-x-auto max-h-96 border border-slate-200 dark:border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 font-medium text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Product</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Region</th>
                <th className="py-2 px-3 text-right">Revenue ($)</th>
                <th className="py-2 px-3 text-right">Profit ($)</th>
                <th className="py-2 px-3 text-right">Margin (%)</th>
                <th className="py-2 px-3 text-right">Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
              {cleanedRecords.slice(0, 100).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-sans text-slate-500">{r.date}</td>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white">{r.product}</td>
                  <td className="py-2 px-3 font-sans text-slate-500">{r.category}</td>
                  <td className="py-2 px-3 font-sans text-slate-500">{r.region}</td>
                  <td className="py-2 px-3 text-right font-semibold text-slate-900 dark:text-white">${r.sales.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400">${r.profit.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300">{r.margin}%</td>
                  <td className="py-2 px-3 text-right text-slate-500">{r.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {cleanedRecords.length > 100 && (
            <div className="py-2 px-3 bg-slate-50 dark:bg-slate-800/50 text-center text-[11px] text-slate-400 font-mono">
              Showing first 100 of {cleanedRecords.length} records · Download CSV for full record set
            </div>
          )}
        </div>
      )}

      {/* View 3: Raw Input / Upload */}
      {activeView === 'raw_input' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Paste or Upload Raw Sales Data
              </span>
              <p className="text-[11px] text-slate-400">
                Supports Standard Sales CSV (Date, Product, Category, Region, Sales, Profit) or Matrix Format (Date, AMZN, DPZ, BTC, NFLX).
              </p>
            </div>

            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg border border-blue-200 dark:border-blue-900 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Choose CSV File
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Paste raw CSV here..."
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Dataset label:</span>
              <input
                type="text"
                value={customDatasetName}
                onChange={(e) => setCustomDatasetName(e.target.value)}
                className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleProcessRawCSV}
              disabled={isProcessing || !csvInput.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              {isProcessing ? 'Cleaning & Processing...' : 'Clean & Load Into Dashboard'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
