import { parseCSVToRows } from '../utils/csvParser';
import { cleanSalesDataset, RawRowInput } from '../utils/dataCleaner';
import { SalesRecord, CleaningReport } from '../types/dashboard';

// Curated Enterprise Sales Dataset generator to provide rich categorical and regional coverage
export function generateEnterpriseSales(): RawRowInput[] {
  const regions = ['North America', 'EMEA', 'Asia Pacific', 'Latin America'];
  const categories = [
    { name: 'Enterprise Software', prods: ['Cloud ERP Suite', 'CRM Enterprise', 'Cybersecurity Guard', 'Analytics Pro'] },
    { name: 'Hardware & Devices', prods: ['Workstation Hub X', 'Network Switch 10G', 'Mobile POS Terminal', 'Server Rack Blade'] },
    { name: 'Professional Services', prods: ['Implementation Advisory', 'Support SLA Tier-1', 'Cloud Migration Service', 'Security Audit'] },
    { name: 'Office Technology', prods: ['Smart Ergonomic Desk', 'Conference Video Bar', 'Thermal Label Printer', 'Air Purifier Industrial'] }
  ];

  const rows: RawRowInput[] = [];
  const startDate = new Date('2021-01-01');
  const endDate = new Date('2024-12-31');
  
  let curr = new Date(startDate);
  let id = 1;

  // Generate 850+ realistic multi-year records across categories and regions
  while (curr <= endDate) {
    const dateStr = curr.toISOString().split('T')[0];
    const dayOfWeek = curr.getDay();

    // Business days higher probability
    const transactionsToday = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 2 + (id % 3);

    for (let t = 0; t < transactionsToday; t++) {
      const region = regions[(id + t) % regions.length];
      const catObj = categories[(id + t * 2) % categories.length];
      const product = catObj.prods[(id + t) % catObj.prods.length];

      // Seasonal growth trend over 2021-2024
      const yearFactor = 1 + (curr.getFullYear() - 2021) * 0.16;
      const monthFactor = 1 + Math.sin((curr.getMonth() / 12) * Math.PI * 2) * 0.18;
      const baseSales = 1200 + ((id * 37) % 8500);
      const sales = Math.round(baseSales * yearFactor * monthFactor);
      
      // Typical margin 22% - 48% depending on category
      const marginRate = catObj.name.includes('Software') ? 0.44 : catObj.name.includes('Services') ? 0.38 : 0.24;
      const profit = Math.round(sales * marginRate * (0.85 + ((id % 20) / 100)));
      const units = 1 + ((id * 3) % 24);

      rows.push({
        Date: dateStr,
        Product: product,
        Category: catObj.name,
        Region: region,
        Sales: sales,
        Profit: profit,
        Units: units,
        Segment: (id % 3 === 0) ? 'Corporate' : (id % 3 === 1) ? 'Enterprise' : 'Mid-Market',
      });
      id++;
    }

    // Step by 2-3 days
    curr.setDate(curr.getDate() + 2);
  }

  // Inject intentional anomalies for cleaner to fix (demonstrating user requirement: "remove nulls, duplicates")
  rows.push({ Date: '2023-04-15', Product: 'Cloud ERP Suite', Category: 'Enterprise Software', Region: 'North America', Sales: 4200, Profit: 1800, Units: 4 }); // Duplicate
  rows.push({ Date: '2023-04-15', Product: 'Cloud ERP Suite', Category: 'Enterprise Software', Region: 'North America', Sales: 4200, Profit: 1800, Units: 4 }); // Duplicate copy
  rows.push({ Date: '2023-07-22', Product: 'Network Switch 10G', Category: 'Hardware & Devices', Region: 'EMEA', Sales: '', Profit: null, Units: 3 }); // Null sales/profit
  rows.push({ Date: 'invalid-date', Product: 'Support SLA Tier-1', Category: 'Professional Services', Region: 'Asia Pacific', Sales: 1500, Profit: 500, Units: 1 }); // Invalid date
  rows.push({ Date: '2024-02-10', Product: 'CRM Enterprise', Category: 'Enterprise Software', Region: 'Latin America', Sales: -3400, Profit: 1200, Units: 2 }); // Negative sales

  return rows;
}

// User-provided Asset Portfolio Dataset (AMZN, DPZ, BTC, NFLX 2013-2019)
export const RAW_USER_DATASET_SNIPPET = `Date,AMZN,DPZ,BTC,NFLX
5/1/2013,248.22,51.19,106.25,30.41
5/2/2013,252.55,51.98,98.10,30.64
5/15/2013,266.55,54.00,118.20,34.77
6/3/2013,266.88,55.95,121.40,31.70
7/1/2013,282.10,56.31,90.41,32.04
8/1/2013,305.57,59.98,104.50,35.58
9/3/2013,288.79,57.77,132.50,41.28
10/1/2013,320.95,65.55,123.00,46.37
11/1/2013,359.00,63.07,213.42,47.03
12/2/2013,392.29,64.65,1096.56,51.98
1/2/2014,397.97,65.19,856.90,51.83
3/3/2014,359.77,74.49,662.17,63.65
5/1/2014,307.89,68.11,453.67,48.07
7/1/2014,332.39,70.47,645.71,67.58
9/2/2014,342.38,72.34,480.04,68.08
11/3/2014,305.72,85.52,324.23,55.48
1/2/2015,308.51,90.29,315.20,49.84
3/2/2015,385.66,100.01,273.75,68.60
5/1/2015,422.86,104.07,235.33,79.57
7/1/2015,437.39,110.34,254.88,93.63
9/1/2015,496.54,100.03,228.63,105.79
11/2/2015,628.34,105.05,359.27,107.63
1/4/2016,636.98,105.82,433.32,109.95
3/1/2016,579.03,129.96,434.04,98.30
5/2/2016,683.84,116.94,450.26,93.11
7/1/2016,725.67,129.20,698.05,96.66
9/1/2016,770.61,145.20,575.28,97.37
11/1/2016,785.40,163.70,726.76,123.30
1/3/2017,753.66,155.07,1033.30,127.48
3/1/2017,853.08,183.56,1222.66,142.64
5/1/2017,948.22,178.82,1445.93,155.35
7/3/2017,953.65,206.54,2617.32,146.16
9/1/2017,978.25,180.63,4573.79,174.74
11/1/2017,1103.68,174.82,6737.77,198.00
1/2/2018,1189.01,184.85,14754.12,201.07
3/1/2018,1493.44,220.33,10929.37,290.39
5/1/2018,1582.26,245.50,9232.19,313.29
7/2/2018,1713.78,279.09,6509.58,398.17
9/4/2018,2039.51,294.59,6705.02,363.60
11/1/2018,1665.53,264.76,6381.29,317.38
1/2/2019,1539.13,242.65,3961.01,267.66
3/1/2019,1671.72,250.06,3831.47,357.32
5/1/2019,1911.52,271.45,5500.72,378.80
5/14/2019,1840.11,272.85,8183.83,345.60`;

export function loadInitialDatasets(): {
  enterprise: { cleaned: SalesRecord[]; report: CleaningReport };
  userPortfolio: { cleaned: SalesRecord[]; report: CleaningReport };
} {
  // 1. Enterprise dataset
  const rawEnterprise = generateEnterpriseSales();
  const enterpriseCleaned = cleanSalesDataset(rawEnterprise);

  // 2. User Portfolio dataset
  const { rows: rawUserRows } = parseCSVToRows(RAW_USER_DATASET_SNIPPET);
  // Add intentional test duplicates to demonstrate cleaning on user dataset as well
  rawUserRows.push({ ...rawUserRows[0] });
  rawUserRows.push({ Date: '5/1/2013', Product: 'AMZN', Category: 'E-Commerce & Cloud', Region: 'North America', Sales: null, Profit: null, Units: 5 });
  const userPortfolioCleaned = cleanSalesDataset(rawUserRows);

  return {
    enterprise: enterpriseCleaned,
    userPortfolio: userPortfolioCleaned,
  };
}
