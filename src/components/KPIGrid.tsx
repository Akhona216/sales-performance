import React from 'react';
import { KPIStats } from '../types/dashboard';
import { TrendingUp, TrendingDown, DollarSign, PieChart, ShoppingBag, Layers, Award } from 'lucide-react';

interface KPIGridProps {
  kpis: KPIStats;
  currencySymbol?: string;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ kpis, currencySymbol = '$' }) => {
  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) {
      return `${currencySymbol}${(val / 1_000_000).toFixed(2)}M`;
    }
    if (val >= 1_000) {
      return `${currencySymbol}${(val / 1_000).toFixed(1)}k`;
    }
    return `${currencySymbol}${val.toLocaleString()}`;
  };

  // Mini sparkline SVG generator
  const renderSparkline = (isPositive: boolean, colorClass: string) => {
    const points = isPositive
      ? '0,24 8,22 16,19 24,20 32,15 40,16 48,11 56,13 64,8 72,5'
      : '0,6 8,8 16,12 24,10 32,16 40,14 48,19 56,18 64,22 72,25';

    return (
      <svg className="w-16 h-7 overflow-visible" viewBox="0 0 72 28">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className={colorClass}
        />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* KPI 1: Total Revenue */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Total Sales Revenue</span>
          <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {formatCurrency(kpis.totalRevenue)}
          </span>
          {renderSparkline(kpis.revenueGrowthRate >= 0, kpis.revenueGrowthRate >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-500')}
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={`flex items-center font-medium font-mono tabular-nums ${
              kpis.revenueGrowthRate >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {kpis.revenueGrowthRate >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {kpis.revenueGrowthRate >= 0 ? `+${kpis.revenueGrowthRate}%` : `${kpis.revenueGrowthRate}%`}
          </span>
          <span className="text-slate-400">vs prior period</span>
        </div>
      </div>

      {/* KPI 2: Gross Profit */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Gross Profit</span>
          <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {formatCurrency(kpis.totalProfit)}
          </span>
          {renderSparkline(kpis.profitGrowthRate >= 0, 'text-emerald-600 dark:text-emerald-400')}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Margin: <strong className="text-slate-800 dark:text-slate-200 font-mono tabular-nums">{kpis.profitMargin}%</strong>
          </span>
          <span
            className={`font-mono tabular-nums ${
              kpis.profitGrowthRate >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {kpis.profitGrowthRate >= 0 ? `+${kpis.profitGrowthRate}%` : `${kpis.profitGrowthRate}%`}
          </span>
        </div>
      </div>

      {/* KPI 3: Units & Volume */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Total Units Sold</span>
          <div className="p-1.5 rounded-md bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {kpis.totalUnits.toLocaleString()}
          </span>
          {renderSparkline(true, 'text-violet-500')}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Avg Order Value:</span>
          <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200 font-semibold">
            {formatCurrency(kpis.averageOrderValue)}
          </span>
        </div>
      </div>

      {/* KPI 4: Top Performer Spotlight */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Leading Product</span>
          <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mb-2">
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            {kpis.topSellingProduct.name}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {formatCurrency(kpis.topSellingProduct.revenue)} generated
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Region: <strong className="text-slate-700 dark:text-slate-300">{kpis.topRegion.name}</strong></span>
          <span>Cat: <strong className="text-slate-700 dark:text-slate-300">{kpis.topCategory.name}</strong></span>
        </div>
      </div>

    </div>
  );
};
