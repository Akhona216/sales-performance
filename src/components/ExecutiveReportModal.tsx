import React from 'react';
import { KPIStats, TrendDataPoint, ProductPerformanceItem, RegionBreakdown } from '../types/dashboard';
import { X, Printer, CheckCircle, TrendingUp, Calendar, Award } from 'lucide-react';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpis: KPIStats;
  datasetName: string;
  topProducts: ProductPerformanceItem[];
  regions: RegionBreakdown[];
  trends: TrendDataPoint[];
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  kpis,
  datasetName,
  topProducts,
  regions,
  trends,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Executive Sales Performance Briefing
            </span>
            <span className="text-xs text-slate-400">· Ready for Board Review</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* Header Metadata */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Sales Performance Intelligence Report
                </h1>
                <div className="text-xs text-slate-500 mt-1">
                  Dataset Source: <strong className="text-slate-800 dark:text-slate-200 capitalize">{datasetName.replace('_', ' ')}</strong> · Generated on {new Date().toLocaleDateString()}
                </div>
              </div>
              <div className="text-right text-xs font-mono">
                <span className="text-emerald-600 font-bold">STATUS: AUDITED & CLEANED</span>
              </div>
            </div>
          </div>

          {/* Section 1: Executive KPI Grid */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Executive KPI Summary
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500">Total Net Revenue</div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  ${kpis.totalRevenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-600 font-mono mt-0.5">
                  +{kpis.revenueGrowthRate}% vs prior period
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500">Gross Operating Profit</div>
                <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
                  ${kpis.totalProfit.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Overall Margin: {kpis.profitMargin}%
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500">Total Unit Volume</div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {kpis.totalUnits.toLocaleString()} units
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  AOV: ${kpis.averageOrderValue}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Top Products & Regional Drivers */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                2. Top Product Drivers
              </h2>
              <div className="space-y-2">
                {topProducts.slice(0, 4).map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        #{idx + 1} {p.product}
                      </span>
                      <div className="text-[10px] text-slate-400">{p.category}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">${p.sales.toLocaleString()}</div>
                      <div className="text-[10px] text-emerald-600">{p.margin}% margin</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                3. Regional Territory Share
              </h2>
              <div className="space-y-2">
                {regions.map((r) => (
                  <div
                    key={r.region}
                    className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">{r.region}</span>
                      <div className="text-[10px] text-slate-400">{r.units.toLocaleString()} units</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">${r.sales.toLocaleString()}</div>
                      <div className="text-[10px] text-blue-600">{r.percentage}% of total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Key Strategic Insights */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900 text-xs">
            <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Executive Strategic Recommendation
            </h3>
            <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
              Sales performance exhibits stable upward momentum with a {kpis.profitMargin}% gross margin.
              Prioritize inventory and marketing allocation to leading product <strong>{kpis.topSellingProduct.name}</strong>,
              while conducting targeted price adjustments on underperforming lines to preserve net margins.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
