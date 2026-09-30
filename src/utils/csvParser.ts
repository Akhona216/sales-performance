import { RawRowInput } from './dataCleaner';

/**
 * Parses raw CSV string into RawRowInput array.
 * Handles both regular row-based sales (Date, Product, Category, Region, Sales, Profit)
 * and Wide time-series matrices like the user's provided (Date, AMZN, DPZ, BTC, NFLX).
 */
export function parseCSVToRows(csvText: string): { rows: RawRowInput[]; format: 'standard' | 'matrix' } {
  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) return { rows: [], format: 'standard' };

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const headerLower = headers.map(h => h.toLowerCase());

  // Check if this is a wide matrix like the user's input (Date, AMZN, DPZ, BTC, NFLX)
  const isDateFirst = headerLower[0].includes('date');
  const otherHeaders = headers.slice(1);
  const isMatrixFormat = isDateFirst && otherHeaders.length > 0 && !headerLower.includes('sales') && !headerLower.includes('revenue');

  const rows: RawRowInput[] = [];

  if (isMatrixFormat) {
    // Transform wide asset/product matrix into normalized rows
    const productMeta: Record<string, { category: string; region: string; marginFactor: number }> = {
      AMZN: { category: 'E-Commerce & Cloud', region: 'North America', marginFactor: 0.32 },
      DPZ: { category: 'Food & Quick Service', region: 'Americas', marginFactor: 0.28 },
      BTC: { category: 'Digital Commerce', region: 'Global / APAC', marginFactor: 0.45 },
      NFLX: { category: 'Media & Subscriptions', region: 'EMEA', marginFactor: 0.38 },
    };

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      const dateStr = cols[0];
      if (!dateStr) continue;

      for (let j = 1; j < headers.length; j++) {
        const prodName = headers[j];
        const valStr = cols[j];
        if (valStr === undefined || valStr === '' || valStr === 'null') {
          // intentional missing row for cleaner to catch
          continue;
        }

        const value = parseFloat(valStr);
        if (isNaN(value)) continue;

        const meta = productMeta[prodName] || {
          category: 'Consumer Products',
          region: 'North America',
          marginFactor: 0.30,
        };

        // Scale value to represent reasonable sales transaction volume / revenue
        const sales = Number((value * 12).toFixed(2));
        const profit = Number((sales * meta.marginFactor).toFixed(2));
        const units = Math.max(1, Math.round(value / 15));

        rows.push({
          Date: dateStr,
          Product: prodName,
          Category: meta.category,
          Region: meta.region,
          Sales: sales,
          Profit: profit,
          Units: units,
        });
      }
    }

    return { rows, format: 'matrix' };
  }

  // Standard row format
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length < headers.length) continue;

    const rowObj: RawRowInput = {};
    headers.forEach((h, idx) => {
      rowObj[h] = cols[idx];
    });
    rows.push(rowObj);
  }

  return { rows, format: 'standard' };
}
