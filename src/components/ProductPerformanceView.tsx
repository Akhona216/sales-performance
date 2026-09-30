import React, { useState } from 'react';
import { ProductPerformanceItem } from '../types/dashboard';
import { Award, AlertTriangle, TrendingUp, TrendingDown, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface ProductPerformanceViewProps {
  topSelling: ProductPerformanceItem[];
  lowPerforming: ProductPerformanceItem[];
  allProducts: ProductPerformanceItem[];
  selectedProduct: string | null;
  onSelectProduct: (productName: string) => void;
}

export const ProductPerformanceView: React.FC<ProductPerformanceViewProps> = ({
  topSelling,
  lowPerforming,
  allProducts,
  selectedProduct,
  onSelectProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'split' | 'all'>('split');
  const [sortBy, setSortBy] = useState<'sales' | 'margin' | 'growth'>('sales');

  const sortedAll = [...allProducts].sort((a, b) => {
    if (sortBy === 'margin') return b.margin - a.margin;
    if (sortBy === 'growth') return b.growthRate - a.growthRate;
    return b.sales - a.sales;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs mb-6 transition-colors">
      
      {/* Title & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Product Performance Intelligence</span>
            <span className="text-xs font-normal text-slate-400">
              (Top Performers vs Underperforming Items)
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identify revenue drivers and products requiring pricing or volume intervention. Click any item to filter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('split')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'split'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Executive Split View
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Products ({allProducts.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section A: Top Selling Products */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Top-Selling Products (By Revenue)
                  </h4>
                  <span className="text-[11px] text-slate-500">Leading contributors to gross volume</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {topSelling.map((item, idx) => {
                const isSelected = selectedProduct === item.product;
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct(item.product)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {item.product}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                          ${item.sales.toLocaleString()}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                          {item.revenueShare}% share
                        </div>
                      </div>
                    </div>

                    {/* Progress bar of revenue contribution */}
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(8, item.revenueShare * 2))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Category: <strong className="text-slate-700 dark:text-slate-300">{item.category}</strong></span>
                      <span>Margin: <strong className="text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">{item.margin}%</strong></span>
                      <span className="flex items-center font-mono text-emerald-600">
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                        +{item.growthRate}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Low-Performing Items & Diagnostics */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Low-Performing Items & Alerts
                  </h4>
                  <span className="text-[11px] text-slate-500">Lagging velocity or compressed margins</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {lowPerforming.map((item) => {
                const isSelected = selectedProduct === item.product;
                const isCritical = item.margin < 15 || item.growthRate < 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct(item.product)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {item.product}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                              isCritical
                                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            {isCritical ? 'Under Review' : 'Low Velocity'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{item.category}</div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                          ${item.sales.toLocaleString()}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                          {item.units} units sold
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">
                        Margin: <strong className={`font-mono ${item.margin < 20 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>{item.margin}%</strong>
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        Diagnose: {item.margin < 15 ? 'Discount erosion' : 'Subscale volume'}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 flex items-center font-medium">
                        Slice <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* Full Product Data Table */
        <div className="overflow-x-auto">
          <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
            <span>Sort by:</span>
            {(['sales', 'margin', 'growth'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-2 py-0.5 rounded capitalize ${
                  sortBy === s
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Revenue ($)</th>
                <th className="py-2.5 px-3 text-right">Gross Profit ($)</th>
                <th className="py-2.5 px-3 text-right">Margin (%)</th>
                <th className="py-2.5 px-3 text-right">Units</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono tabular-nums">
              {sortedAll.map((p) => {
                const isSelected = selectedProduct === p.product;
                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProduct(p.product)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-white">
                      {p.product}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-500 dark:text-slate-400">
                      {p.category}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-900 dark:text-white">
                      ${p.sales.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                      ${p.profit.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                      {p.margin}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      {p.units.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] rounded font-medium ${
                          p.status === 'top_performer'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : p.status === 'critical'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
