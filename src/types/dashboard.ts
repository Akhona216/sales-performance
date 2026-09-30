export interface SalesRecord {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  year: number;
  quarter: string; // Q1, Q2, Q3, Q4
  month: string; // YYYY-MM
  monthName: string; // Jan, Feb...
  product: string;
  category: string;
  region: string;
  sales: number; // Revenue in USD
  profit: number; // Profit in USD
  margin: number; // Profit / Sales percentage
  units: number;
  discount?: number; // Discount rate (0 - 0.5)
  customerSegment?: string;
  isCleaned?: boolean;
}

export interface CleaningReport {
  totalRawRows: number;
  totalCleanedRows: number;
  duplicatesRemoved: number;
  nullsRemovedOrImputed: number;
  invalidDatesFixed: number;
  negativeValuesFixed: number;
  dataQualityScore: number; // 0 - 100%
  cleaningSteps: Array<{
    timestamp: string;
    step: string;
    description: string;
    impactCount: number;
    severity: 'success' | 'info' | 'warning';
  }>;
}

export interface KPIStats {
  totalRevenue: number;
  previousPeriodRevenue: number;
  revenueGrowthRate: number; // %
  totalProfit: number;
  profitMargin: number; // %
  previousPeriodProfit: number;
  profitGrowthRate: number; // %
  totalUnits: number;
  averageOrderValue: number;
  topSellingProduct: {
    name: string;
    revenue: number;
  };
  topRegion: {
    name: string;
    revenue: number;
  };
  topCategory: {
    name: string;
    revenue: number;
  };
}

export interface TrendDataPoint {
  period: string; // e.g. "2018-05" or "2018-Q2" or "2018"
  label: string;
  sales: number;
  profit: number;
  margin: number;
  units: number;
  previousSales?: number;
  growthRate?: number;
  maSales?: number; // Moving average
}

export interface ProductPerformanceItem {
  id: string;
  product: string;
  category: string;
  sales: number;
  profit: number;
  margin: number;
  units: number;
  growthRate: number;
  status: 'top_performer' | 'steady' | 'underperforming' | 'critical';
  revenueShare: number; // % of total
}

export interface RegionBreakdown {
  region: string;
  sales: number;
  profit: number;
  margin: number;
  units: number;
  percentage: number;
}

export interface CategoryBreakdown {
  category: string;
  sales: number;
  profit: number;
  margin: number;
  units: number;
  percentage: number;
}

export interface FilterState {
  dateRange: [string, string]; // [startDate, endDate]
  selectedRegions: string[];
  selectedCategories: string[];
  selectedProducts: string[];
  searchQuery: string;
  granularity: 'monthly' | 'quarterly' | 'yearly';
  metric: 'sales' | 'profit' | 'units' | 'margin';
}
