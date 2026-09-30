import React, { useState, useMemo, useEffect } from 'react';
import { SalesRecord, FilterState, CleaningReport } from './types/dashboard';
import { loadInitialDatasets, RAW_USER_DATASET_SNIPPET } from './data/sampleDatasets';
import {
  filterRecords,
  computeKPIs,
  computeSalesTrends,
  computeProductPerformance,
  computeRegionBreakdown,
  computeCategoryBreakdown,
} from './utils/analytics';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KPIGrid } from './components/KPIGrid';
import { SalesTrendChart } from './components/SalesTrendChart';
import { ProductPerformanceView } from './components/ProductPerformanceView';
import { RegionCategoryView } from './components/RegionCategoryView';
import { ETLStudio } from './components/ETLStudio';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Sync dark class on document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Initial datasets
  const initialData = useMemo(() => loadInitialDatasets(), []);

  // Active dataset selection
  const [datasetKey, setDatasetKey] = useState<'enterprise' | 'user_portfolio' | 'custom'>('enterprise');
  const [cleanedRecords, setCleanedRecords] = useState<SalesRecord[]>(initialData.enterprise.cleaned);
  const [cleaningReport, setCleaningReport] = useState<CleaningReport>(initialData.enterprise.report);

  // View Navigation
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'trends' | 'products' | 'etl'>('dashboard');

  // Report Modal
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    dateRange: ['', ''],
    selectedRegions: [],
    selectedCategories: [],
    selectedProducts: [],
    searchQuery: '',
    granularity: 'monthly',
    metric: 'sales',
  });

  // Switch dataset handler
  const handleDatasetChange = (key: string) => {
    if (key === 'enterprise') {
      setDatasetKey('enterprise');
      setCleanedRecords(initialData.enterprise.cleaned);
      setCleaningReport(initialData.enterprise.report);
    } else if (key === 'user_portfolio') {
      setDatasetKey('user_portfolio');
      setCleanedRecords(initialData.userPortfolio.cleaned);
      setCleaningReport(initialData.userPortfolio.report);
    }
    // Reset selection filters when changing dataset
    setFilters((prev) => ({
      ...prev,
      selectedRegions: [],
      selectedCategories: [],
      selectedProducts: [],
      searchQuery: '',
    }));
  };

  // Custom dataset imported via ETL Studio
  const handleApplyNewDataset = (newCleaned: SalesRecord[], newReport: CleaningReport, name: string) => {
    setCleanedRecords(newCleaned);
    setCleaningReport(newReport);
    setDatasetKey('custom');
    setFilters((prev) => ({
      ...prev,
      selectedRegions: [],
      selectedCategories: [],
      selectedProducts: [],
      searchQuery: '',
    }));
  };

  // Available metadata for slicers
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    cleanedRecords.forEach((r) => set.add(r.region));
    return Array.from(set).sort();
  }, [cleanedRecords]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    cleanedRecords.forEach((r) => set.add(r.category));
    return Array.from(set).sort();
  }, [cleanedRecords]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return filterRecords(cleanedRecords, filters);
  }, [cleanedRecords, filters]);

  // Analytics outputs
  const kpis = useMemo(() => computeKPIs(filteredRecords), [filteredRecords]);
  const trends = useMemo(
    () => computeSalesTrends(filteredRecords, filters.granularity),
    [filteredRecords, filters.granularity]
  );
  const productPerformance = useMemo(
    () => computeProductPerformance(filteredRecords),
    [filteredRecords]
  );
  const regionBreakdown = useMemo(
    () => computeRegionBreakdown(filteredRecords),
    [filteredRecords]
  );
  const categoryBreakdown = useMemo(
    () => computeCategoryBreakdown(filteredRecords),
    [filteredRecords]
  );

  // Cross-filtering helpers
  const handleToggleRegion = (region: string) => {
    setFilters((prev) => {
      const next = prev.selectedRegions.includes(region)
        ? prev.selectedRegions.filter((r) => r !== region)
        : [...prev.selectedRegions, region];
      return { ...prev, selectedRegions: next };
    });
  };

  const handleToggleCategory = (category: string) => {
    setFilters((prev) => {
      const next = prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category];
      return { ...prev, selectedCategories: next };
    });
  };

  const handleSelectProduct = (product: string) => {
    setFilters((prev) => {
      const next = prev.selectedProducts.includes(product)
        ? prev.selectedProducts.filter((p) => p !== product)
        : [product];
      return { ...prev, selectedProducts: next };
    });
  };

  // Export clean CSV
  const handleExportCleanCSV = () => {
    if (filteredRecords.length === 0) return;
    const headers = ['Date', 'Year', 'Quarter', 'Month', 'Product', 'Category', 'Region', 'Sales', 'Profit', 'Margin_Pct', 'Units'];
    const rows = filteredRecords.map((r) => [
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
    link.setAttribute('download', `sales_performance_${datasetKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* 1. Header (Navigation & Top Bar Contract) */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        datasetName={datasetKey}
        onDatasetChange={handleDatasetChange}
        qualityScore={cleaningReport.dataQualityScore}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenReport={() => setIsReportOpen(true)}
        onExportCleanCSV={handleExportCleanCSV}
      />

      {/* 2. Interactive Slicer & Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        availableRegions={availableRegions}
        availableCategories={availableCategories}
        totalRecordsCount={cleanedRecords.length}
        filteredCount={filteredRecords.length}
      />

      {/* Main Workspace Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Executive Dashboard (Summary, Trends, Products, Regions) */}
        {currentTab === 'dashboard' && (
          <div>
            <KPIGrid kpis={kpis} />
            
            <SalesTrendChart
              data={trends}
              granularity={filters.granularity}
              onGranularityChange={(g) => setFilters({ ...filters, granularity: g })}
              activeMetric={filters.metric}
              onMetricChange={(m) => setFilters({ ...filters, metric: m })}
            />

            <ProductPerformanceView
              topSelling={productPerformance.topSelling}
              lowPerforming={productPerformance.lowPerforming}
              allProducts={productPerformance.all}
              selectedProduct={filters.selectedProducts[0] || null}
              onSelectProduct={handleSelectProduct}
            />

            <RegionCategoryView
              regions={regionBreakdown}
              categories={categoryBreakdown}
              selectedRegions={filters.selectedRegions}
              selectedCategories={filters.selectedCategories}
              onToggleRegion={handleToggleRegion}
              onToggleCategory={handleToggleCategory}
            />
          </div>
        )}

        {/* Tab 2: Deep Trends & Time Series */}
        {currentTab === 'trends' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Historical Trend & Trajectory Modeling
              </h2>
              <p className="text-xs text-slate-500">
                Detailed quarterly, monthly, and annual sales velocity with period-over-period delta rates.
              </p>
            </div>

            <KPIGrid kpis={kpis} />

            <SalesTrendChart
              data={trends}
              granularity={filters.granularity}
              onGranularityChange={(g) => setFilters({ ...filters, granularity: g })}
              activeMetric={filters.metric}
              onMetricChange={(m) => setFilters({ ...filters, metric: m })}
            />

            {/* Granular Period Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Period-By-Period Financial Audit Table
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                      <th className="py-2 px-3">Period</th>
                      <th className="py-2 px-3 text-right">Revenue ($)</th>
                      <th className="py-2 px-3 text-right">Gross Profit ($)</th>
                      <th className="py-2 px-3 text-right">Margin (%)</th>
                      <th className="py-2 px-3 text-right">Units</th>
                      <th className="py-2 px-3 text-right">Growth Rate (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
                    {trends.map((t) => (
                      <tr key={t.period} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                          {t.label}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                          ${t.sales.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                          ${t.profit.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                          {t.margin}%
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500">
                          {t.units.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {t.growthRate !== undefined ? (
                            <span className={t.growthRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                              {t.growthRate >= 0 ? `+${t.growthRate}%` : `${t.growthRate}%`}
                            </span>
                          ) : (
                            <span className="text-slate-400">Base</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Product Performance Matrix */}
        {currentTab === 'products' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Product Line Profitability & Volume Diagnostics
              </h2>
              <p className="text-xs text-slate-500">
                Rankings of revenue contributors, profit margin health, and early warning for subscale products.
              </p>
            </div>

            <ProductPerformanceView
              topSelling={productPerformance.topSelling}
              lowPerforming={productPerformance.lowPerforming}
              allProducts={productPerformance.all}
              selectedProduct={filters.selectedProducts[0] || null}
              onSelectProduct={handleSelectProduct}
            />

            <RegionCategoryView
              regions={regionBreakdown}
              categories={categoryBreakdown}
              selectedRegions={filters.selectedRegions}
              selectedCategories={filters.selectedCategories}
              onToggleRegion={handleToggleRegion}
              onToggleCategory={handleToggleCategory}
            />
          </div>
        )}

        {/* Tab 4: ETL & Data Cleaning Studio */}
        {currentTab === 'etl' && (
          <ETLStudio
            cleanedRecords={cleanedRecords}
            cleaningReport={cleaningReport}
            onApplyNewDataset={handleApplyNewDataset}
            rawSampleSnippet={RAW_USER_DATASET_SNIPPET}
          />
        )}

      </main>

      {/* Executive Briefing Modal */}
      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        kpis={kpis}
        datasetName={datasetKey}
        topProducts={productPerformance.topSelling}
        regions={regionBreakdown}
        trends={trends}
      />

    </div>
  );
}
