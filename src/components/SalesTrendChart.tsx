import React, { useState } from 'react';
import { TrendDataPoint } from '../types/dashboard';
import { TrendingUp, TrendingDown, Calendar, BarChart2, Activity } from 'lucide-react';

interface SalesTrendChartProps {
  data: TrendDataPoint[];
  granularity: 'monthly' | 'quarterly' | 'yearly';
  onGranularityChange: (g: 'monthly' | 'quarterly' | 'yearly') => void;
  activeMetric: 'sales' | 'profit' | 'margin' | 'units';
  onMetricChange: (m: 'sales' | 'profit' | 'margin' | 'units') => void;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  data,
  granularity,
  onGranularityChange,
  activeMetric,
  onMetricChange,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500">
        No sales data available for the selected filters.
      </div>
    );
  }

  // Calculate scales
  const values = data.map((d) => d[activeMetric]);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);

  const chartHeight = 240;
  const chartWidth = 800;
  const paddingX = 40;
  const paddingY = 30;

  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  const getX = (index: number) => {
    if (data.length === 1) return paddingX + usableWidth / 2;
    return paddingX + (index / (data.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const range = maxValue - minValue || 1;
    const norm = (val - minValue) / range;
    return chartHeight - paddingY - norm * usableHeight;
  };

  // Generate SVG path for primary metric line
  const points = data.map((d, i) => `${getX(i)},${getY(d[activeMetric])}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${getX(data.length - 1)},${chartHeight - paddingY} L ${getX(0)},${chartHeight - paddingY} Z`;

  // Secondary line: Moving average for sales/profit
  const maPoints = data.map((d, i) => `${getX(i)},${getY(d.maSales || d[activeMetric])}`);
  const maLinePath = `M ${maPoints.join(' L ')}`;

  const activePoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];

  const formatVal = (num: number) => {
    if (activeMetric === 'margin') return `${num.toFixed(1)}%`;
    if (activeMetric === 'units') return num.toLocaleString();
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}k`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs mb-6 transition-colors">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Sales Performance & Growth Trends
            </h3>
            <span className="text-xs text-slate-400 capitalize">({granularity} aggregation)</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare period-over-period sales velocity and 3-period moving average.
          </div>
        </div>

        {/* Granularity & Metric Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {(['monthly', 'quarterly', 'yearly'] as const).map((g) => (
              <button
                key={g}
                onClick={() => onGranularityChange(g)}
                className={`px-2.5 py-1 font-medium capitalize rounded-md transition-all ${
                  granularity === g
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {(['sales', 'profit', 'margin'] as const).map((m) => (
              <button
                key={m}
                onClick={() => onMetricChange(m)}
                className={`px-2 py-1 font-medium capitalize rounded-md transition-all ${
                  activeMetric === m
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active scrubber preview pill */}
      {activePoint && (
        <div className="flex flex-wrap items-center gap-4 py-2 px-3 mb-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>Period:</span>
            <strong className="text-slate-900 dark:text-white">{activePoint.label}</strong>
          </div>
          <div>
            Sales: <strong className="font-mono tabular-nums text-slate-900 dark:text-white">${activePoint.sales.toLocaleString()}</strong>
          </div>
          <div>
            Profit: <strong className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">${activePoint.profit.toLocaleString()}</strong>
          </div>
          <div>
            Margin: <strong className="font-mono tabular-nums text-slate-800 dark:text-slate-200">{activePoint.margin}%</strong>
          </div>
          {activePoint.growthRate !== undefined && (
            <div className="flex items-center gap-1">
              <span>Growth:</span>
              <span
                className={`font-semibold font-mono tabular-nums flex items-center ${
                  activePoint.growthRate >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {activePoint.growthRate >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {activePoint.growthRate >= 0 ? `+${activePoint.growthRate}%` : `${activePoint.growthRate}%`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Responsive SVG Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-56 sm:h-64"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = chartHeight - paddingY - pct * usableHeight;
            const val = minValue + pct * (maxValue - minValue);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-slate-200 dark:text-slate-800"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {formatVal(val)}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#trendGradient)" />

          {/* Moving Average dashed line */}
          {activeMetric === 'sales' && (
            <path
              d={maLinePath}
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          )}

          {/* Primary Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data point dots & scrubber interaction */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d[activeMetric]);
            const isHovered = hoverIndex === i;

            return (
              <g key={i}>
                {/* Invisible hover trigger column */}
                <rect
                  x={cx - (usableWidth / data.length) / 2}
                  y={0}
                  width={usableWidth / data.length}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                />

                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={chartHeight - paddingY}
                    stroke="#3B82F6"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : data.length > 30 ? 2 : 4}
                  className={`${
                    isHovered
                      ? 'fill-blue-600 stroke-white dark:stroke-slate-900 stroke-2'
                      : 'fill-white dark:fill-slate-900 stroke-blue-600 stroke-2'
                  }`}
                />

                {/* X axis labels (sparse for readability) */}
                {(data.length <= 14 || i % Math.ceil(data.length / 10) === 0 || i === data.length - 1) && (
                  <text
                    x={cx}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-500 font-medium font-mono"
                  >
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
            <span className="capitalize">{activeMetric} Velocity</span>
          </div>
          {activeMetric === 'sales' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
              <span>3-Period Moving Average</span>
            </div>
          )}
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Interactive Scrubber Enabled · Hover any point to inspect
        </div>
      </div>

    </div>
  );
};
