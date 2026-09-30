import React from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  Database,
  Moon,
  Sun,
  ShieldCheck,
  Printer,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'trends' | 'products' | 'etl';
  onTabChange: (tab: 'dashboard' | 'trends' | 'products' | 'etl') => void;
  datasetName: string;
  onDatasetChange: (name: string) => void;
  qualityScore: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenReport: () => void;
  onExportCleanCSV: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  datasetName,
  onDatasetChange,
  qualityScore,
  isDark,
  onToggleTheme,
  onOpenReport,
  onExportCleanCSV,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element Brand mark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Vantage BI
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Sales Intelligence</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  {qualityScore}% Clean
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-line, quiet typography) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => onTabChange('trends')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                currentTab === 'trends'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Trends & Growth
            </button>
            <button
              onClick={() => onTabChange('products')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                currentTab === 'products'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Product Matrix
            </button>
            <button
              onClick={() => onTabChange('etl')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                currentTab === 'etl'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
              ETL & Data Cleaner
            </button>
          </nav>

          {/* Zone 3: Actions (Dataset picker, theme, export) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Dataset Selector */}
            <div className="relative flex items-center">
              <Database className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
              <select
                value={datasetName}
                onChange={(e) => onDatasetChange(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                aria-label="Select sales dataset"
              >
                <option value="enterprise">Global Enterprise Sales (2021-2024)</option>
                <option value="user_portfolio">Portfolio Sales: AMZN, DPZ, BTC, NFLX (2013-2019)</option>
                <option value="custom">Custom Cleaned Dataset</option>
              </select>
            </div>

            {/* Print / Report */}
            <button
              onClick={onOpenReport}
              title="Executive Report Preview"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Export Cleaned CSV */}
            <button
              onClick={onExportCleanCSV}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Export Clean CSV
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle visual theme"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
