import React from 'react';
import { FilterState } from '../types/dashboard';
import { Filter, RotateCcw, Search, Calendar, Globe2, Tag } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableRegions: string[];
  availableCategories: string[];
  totalRecordsCount: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  availableRegions,
  availableCategories,
  totalRecordsCount,
  filteredCount,
}) => {
  const hasActiveFilters =
    filters.selectedRegions.length > 0 ||
    filters.selectedCategories.length > 0 ||
    filters.selectedProducts.length > 0 ||
    filters.searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    onFilterChange({
      ...filters,
      selectedRegions: [],
      selectedCategories: [],
      selectedProducts: [],
      searchQuery: '',
    });
  };

  const toggleRegion = (region: string) => {
    const next = filters.selectedRegions.includes(region)
      ? filters.selectedRegions.filter((r) => r !== region)
      : [...filters.selectedRegions, region];
    onFilterChange({ ...filters, selectedRegions: next });
  };

  const toggleCategory = (category: string) => {
    const next = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter((c) => c !== category)
      : [...filters.selectedCategories, category];
    onFilterChange({ ...filters, selectedCategories: next });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Granularity and Slicers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Time Granularity Slicer */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 dark:bg-slate-800 rounded-lg text-xs">
            {(['monthly', 'quarterly', 'yearly'] as const).map((g) => (
              <button
                key={g}
                onClick={() => onFilterChange({ ...filters, granularity: g })}
                className={`px-2.5 py-1 font-medium capitalize rounded-md transition-all ${
                  filters.granularity === g
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 hidden sm:block" />

          {/* Region Slicer Dropdown / Quick filter */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300">
              <Globe2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Region:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {filters.selectedRegions.length === 0
                  ? 'All Regions'
                  : filters.selectedRegions.length === 1
                  ? filters.selectedRegions[0]
                  : `${filters.selectedRegions.length} Selected`}
              </span>
            </div>
            
            {/* Dropdown menu */}
            <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-2 z-30 hidden group-hover:block hover:block">
              <div className="text-[11px] font-semibold text-slate-400 mb-1 px-1">Filter Regions</div>
              {availableRegions.map((region) => {
                const isSelected = filters.selectedRegions.includes(region);
                return (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className="w-full text-left px-2 py-1 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between transition-colors"
                  >
                    <span className={isSelected ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}>
                      {region}
                    </span>
                    {isSelected && <span className="text-blue-600 text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Slicer Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>Category:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {filters.selectedCategories.length === 0
                  ? 'All Categories'
                  : filters.selectedCategories.length === 1
                  ? filters.selectedCategories[0]
                  : `${filters.selectedCategories.length} Selected`}
              </span>
            </div>

            <div className="absolute left-0 mt-1 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-2 z-30 hidden group-hover:block hover:block">
              <div className="text-[11px] font-semibold text-slate-400 mb-1 px-1">Filter Categories</div>
              {availableCategories.map((category) => {
                const isSelected = filters.selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className="w-full text-left px-2 py-1 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between transition-colors"
                  >
                    <span className={`truncate mr-2 ${isSelected ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {category}
                    </span>
                    {isSelected && <span className="text-amber-600 text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metric Selector Slicer */}
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Primary Metric:</span>
            <select
              value={filters.metric}
              onChange={(e) => onFilterChange({ ...filters, metric: e.target.value as any })}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
              aria-label="Select metric"
            >
              <option value="sales">Sales Revenue ($)</option>
              <option value="profit">Gross Profit ($)</option>
              <option value="margin">Margin Rate (%)</option>
              <option value="units">Units Volume</option>
            </select>
          </div>

        </div>

        {/* Right: Search, Result Stats, and Reset */}
        <div className="flex items-center gap-3">
          
          {/* Search query input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product, category..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-8 pr-3 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Records count & Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              {filteredCount} / {totalRecordsCount} rows
            </span>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline px-1.5 py-0.5"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
