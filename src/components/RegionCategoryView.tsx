import React from 'react';
import { RegionBreakdown, CategoryBreakdown } from '../types/dashboard';
import { Globe2, Layers, Filter } from 'lucide-react';

interface RegionCategoryViewProps {
  regions: RegionBreakdown[];
  categories: CategoryBreakdown[];
  selectedRegions: string[];
  selectedCategories: string[];
  onToggleRegion: (region: string) => void;
  onToggleCategory: (category: string) => void;
}

export const RegionCategoryView: React.FC<RegionCategoryViewProps> = ({
  regions,
  categories,
  selectedRegions,
  selectedCategories,
  onToggleRegion,
  onToggleCategory,
}) => {
  const maxRegionSales = Math.max(...regions.map((r) => r.sales), 1);
  const maxCatSales = Math.max(...categories.map((c) => c.sales), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      {/* 1. Region-Wise Comparison */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Region-Wise Sales Comparison
              </h3>
              <p className="text-[11px] text-slate-500">Cross-filter by geographical territory</p>
            </div>
          </div>
          {selectedRegions.length > 0 && (
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              Filtered: {selectedRegions.join(', ')}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {regions.map((reg) => {
            const isSelected = selectedRegions.includes(reg.region);
            const barWidth = Math.round((reg.sales / maxRegionSales) * 100);

            return (
              <div
                key={reg.region}
                onClick={() => onToggleRegion(reg.region)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {reg.region}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      ${reg.sales.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({reg.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Relative Performance Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Profit: <strong className="font-mono text-emerald-600 dark:text-emerald-400">${reg.profit.toLocaleString()}</strong></span>
                  <span>Margin: <strong className="font-mono text-slate-700 dark:text-slate-300">{reg.margin}%</strong></span>
                  <span>Volume: <strong className="font-mono text-slate-700 dark:text-slate-300">{reg.units.toLocaleString()}</strong> units</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Category-Wise Comparison */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Category-Wise Sales Comparison
              </h3>
              <p className="text-[11px] text-slate-500">Revenue concentration & margin profile</p>
            </div>
          </div>
          {selectedCategories.length > 0 && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              Filtered: {selectedCategories.join(', ')}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.category);
            const barWidth = Math.round((cat.sales / maxCatSales) * 100);

            return (
              <div
                key={cat.category}
                onClick={() => onToggleCategory(cat.category)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 ring-1 ring-amber-500'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white truncate mr-2">
                    {cat.category}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      ${cat.sales.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({cat.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Relative Performance Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Profit: <strong className="font-mono text-emerald-600 dark:text-emerald-400">${cat.profit.toLocaleString()}</strong></span>
                  <span>Margin: <strong className="font-mono text-slate-700 dark:text-slate-300">{cat.margin}%</strong></span>
                  <span>Volume: <strong className="font-mono text-slate-700 dark:text-slate-300">{cat.units.toLocaleString()}</strong> units</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
