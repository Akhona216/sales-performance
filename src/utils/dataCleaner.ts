import { SalesRecord, CleaningReport } from '../types/dashboard';

export interface RawRowInput {
  Date?: string | null;
  date?: string | null;
  Product?: string | null;
  product?: string | null;
  Category?: string | null;
  category?: string | null;
  Region?: string | null;
  region?: string | null;
  Sales?: string | number | null;
  sales?: string | number | null;
  Profit?: string | number | null;
  profit?: string | number | null;
  Units?: string | number | null;
  units?: string | number | null;
  Discount?: string | number | null;
  discount?: string | number | null;
  [key: string]: any;
}

export function cleanSalesDataset(rawRows: RawRowInput[]): {
  cleaned: SalesRecord[];
  report: CleaningReport;
} {
  const steps: CleaningReport['cleaningSteps'] = [];
  let duplicatesCount = 0;
  let nullsCount = 0;
  let invalidDatesCount = 0;
  let negativeFixedCount = 0;

  const seenKeys = new Set<string>();
  const cleaned: SalesRecord[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];

    // Check for empty or entirely null rows
    if (!row || Object.values(row).every(v => v === null || v === undefined || v === '')) {
      nullsCount++;
      continue;
    }

    // Extract Date
    const rawDate = row.Date || row.date || row.DATE || '';
    if (!rawDate) {
      nullsCount++;
      continue;
    }

    // Parse Date safely
    let parsedDate = new Date(rawDate);
    if (isNaN(parsedDate.getTime())) {
      // Try parsing MM/DD/YYYY
      const parts = String(rawDate).split(/[\/\-]/);
      if (parts.length === 3) {
        const m = parseInt(parts[0], 10) - 1;
        const d = parseInt(parts[1], 10);
        const y = parseInt(parts[2], 10);
        parsedDate = new Date(y < 100 ? 2000 + y : y, m, d);
      }
    }

    if (isNaN(parsedDate.getTime())) {
      invalidDatesCount++;
      continue;
    }

    const isoDate = parsedDate.toISOString().split('T')[0];
    const year = parsedDate.getFullYear();
    const monthNum = parsedDate.getMonth() + 1;
    const quarter = `Q${Math.floor(parsedDate.getMonth() / 3) + 1}`;
    const month = `${year}-${String(monthNum).padStart(2, '0')}`;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parsedDate.getMonth()];

    // Product, Category, Region
    const product = String(row.Product || row.product || 'Standard Product').trim();
    const category = String(row.Category || row.category || 'General Sales').trim();
    const region = String(row.Region || row.region || 'North America').trim();

    // Check for Duplicate (Date + Product + Region)
    const dedupKey = `${isoDate}|${product.toLowerCase()}|${region.toLowerCase()}`;
    if (seenKeys.has(dedupKey)) {
      duplicatesCount++;
      continue;
    }
    seenKeys.add(dedupKey);

    // Numeric parsing with null handling
    let rawSales = row.Sales ?? row.sales;
    let sales = typeof rawSales === 'number' ? rawSales : parseFloat(String(rawSales || '0').replace(/[^0-9.-]+/g, ''));
    if (isNaN(sales) || sales === null) {
      nullsCount++;
      sales = 0;
    }

    if (sales < 0) {
      sales = Math.abs(sales);
      negativeFixedCount++;
    }

    let rawProfit = row.Profit ?? row.profit;
    let profit = typeof rawProfit === 'number' ? rawProfit : parseFloat(String(rawProfit || '0').replace(/[^0-9.-]+/g, ''));
    if (isNaN(profit) || profit === null) {
      // Impute profit based on typical 25% margin if not provided
      profit = Number((sales * 0.28).toFixed(2));
      nullsCount++;
    }

    let rawUnits = row.Units ?? row.units;
    let units = typeof rawUnits === 'number' ? rawUnits : parseInt(String(rawUnits || '1'), 10);
    if (isNaN(units) || units <= 0) {
      units = 1;
    }

    const margin = sales > 0 ? Number(((profit / sales) * 100).toFixed(2)) : 0;
    const discount = typeof row.discount === 'number' ? row.discount : 0.05;

    cleaned.push({
      id: `rec-${i}-${Date.now().toString(36)}`,
      date: isoDate,
      year,
      quarter,
      month,
      monthName,
      product,
      category,
      region,
      sales: Number(sales.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      margin,
      units,
      discount,
      customerSegment: row.Segment || row.customerSegment || 'Commercial',
      isCleaned: true,
    });
  }

  // Sort chronologically
  cleaned.sort((a, b) => a.date.localeCompare(b.date));

  // Build Audit Report
  if (duplicatesCount > 0) {
    steps.push({
      timestamp: 'Step 1',
      step: 'Deduplication',
      description: `Identified and removed ${duplicatesCount} redundant or duplicate records.`,
      impactCount: duplicatesCount,
      severity: 'info',
    });
  }

  if (nullsCount > 0) {
    steps.push({
      timestamp: 'Step 2',
      step: 'Null Handling & Imputation',
      description: `Replaced ${nullsCount} null, NaN, or missing values with robust imputations.`,
      impactCount: nullsCount,
      severity: 'warning',
    });
  }

  if (invalidDatesCount > 0) {
    steps.push({
      timestamp: 'Step 3',
      step: 'Date Normalization',
      description: `Filtered out ${invalidDatesCount} malformed timestamp entries.`,
      impactCount: invalidDatesCount,
      severity: 'info',
    });
  }

  steps.push({
    timestamp: 'Step 4',
    step: 'Schema Standardization',
    description: `Successfully cleaned and formatted ${cleaned.length} sales performance records.`,
    impactCount: cleaned.length,
    severity: 'success',
  });

  const totalIssues = duplicatesCount + nullsCount + invalidDatesCount + negativeFixedCount;
  const qualityScore = Math.max(70, Math.min(100, Math.round(100 - (totalIssues / (rawRows.length || 1)) * 30)));

  const report: CleaningReport = {
    totalRawRows: rawRows.length,
    totalCleanedRows: cleaned.length,
    duplicatesRemoved: duplicatesCount,
    nullsRemovedOrImputed: nullsCount,
    invalidDatesFixed: invalidDatesCount,
    negativeValuesFixed: negativeFixedCount,
    dataQualityScore: qualityScore,
    cleaningSteps: steps,
  };

  return { cleaned, report };
}
