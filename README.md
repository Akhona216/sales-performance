Vantage BI — Sales Performance Dashboard
An executive-grade sales performance intelligence and analytics dashboard built to Power BI and Tableau standards. Features automated data cleaning (deduplication, null imputation, timestamp standardization), granular time-series trend modeling, product profitability diagnostics, regional market share analysis, and interactive cross-filtering.
Project Specification & Deliverables
This project fulfills all criteria specified in Project - 1 (Sales Performance Dashboard):

Import and Clean Raw Sales Dataset: Automated pipeline detecting and pruning duplicates, imputing missing/null values, repairing malformed dates, and generating a transparent audit report.

Monthly, Quarterly, and Yearly Trends: Granular time-series visualization with dual-metric plotting, 3-period moving average (SMA), and period-over-period delta growth rates.

Top-Selling & Low-Performing Products: Ranked leaderboard with revenue contribution percentages alongside diagnostic early-warning alerts for subscale or margin-compressed items.

Region-Wise & Category-Wise Comparisons: Interactive multi-territory breakdowns and category performance matrices with cross-filtering.

Executive KPIs: Total Net Revenue, Gross Operating Profit, Profit Margin (%), Total Unit Volume, Average Order Value (AOV), and Sales Velocity deltas with inline sparklines.

Power BI & Tableau Grade Interactivity: Global slicers, cross-filtering across charts, dark/light theme switching, executive report generation, and CSV export.
Included Dataset Files
The repository includes pre-built physical data files in /public/:
public/sales_data.csv (1,576 rows)
Raw time-series portfolio dataset covering AMZN, DPZ, BTC, NFLX from May 2013 to May 2019.
Contains daily market/sales values, timestamps, and test anomalies for automated cleaning demonstration.
public/cleaned_sales_dataset.csv (1,725 rows)
Standardized multi-category enterprise sales ledger across Technology, Hardware, Services, and Office Products across 4 global regions (North America, EMEA, Asia Pacific, Latin America).
Both files can be downloaded directly from the dashboard header or loaded into the analytics engine via the ETL & Data Cleaner Studio.
Key Features
1. Data Cleaning & ETL Studio
Automated Hygiene Engine: Validates every record for missing values, duplicates, and invalid dates.
Audit Trail: Real-time Data Quality Scorecard (0–100%) tracking duplicate drops, imputations, and normalization steps.
Raw vs. Cleaned Data Viewer: Dual table view for data quality inspection.
Custom Ingestion: Drag-and-drop or paste any custom CSV (both standard row format and wide asset/product matrix formats).
Export: One-click download of the cleaned and normalized dataset as .csv.
2. Time-Series Trend Modeling
Granularity Switcher: Toggle between Monthly, Quarterly, and Yearly views.
Metric Selector: Compare Sales Revenue, Gross Profit, Profit Margin (%), or Units Volume.
Moving Averages & Growth: 3-period moving average curve and period-over-period percentage indicators.
Interactive Scrubber: Hover any data point to inspect exact historical sales, margins, and deltas.
3. Product Performance Intelligence
Top Performers: Leaderboard ranking products by gross revenue, volume, and margin health.
Underperforming Diagnostic Alert: Identifies products experiencing volume stagnation or margin erosion with actionable diagnosis notes.
Product Filter: Click any product card or row in the table to cross-filter the entire dashboard.
4. Geographic & Category Comparisons
Region-Wise Comparison: Performance bars displaying revenue, operating profit, and volume per region.
Category-Wise Matrix: Market share percentages and margin profiles across business lines.
Cross-Filtering: Clicking any region or category slices all widgets across the application.
5. Executive Briefing & Export
Printable Briefing Modal: Boardroom-ready executive summary sheet ready to print or save to PDF.
Theme Support: Seamless toggle between Dark Mode (Executive Slate) and Light Mode (Clean Tableau White).
Technology Stack
Framework: React 19 (TypeScript)
Styling: Tailwind CSS
Visualization: Custom Mathematical SVG Data Visualizations (High-DPI, interactive tooltips, moving averages)
Icons: Lucide React
Build Tool: Vite
Getting Started
Prerequisites
Node.js (v18 or higher recommended)
npm or bun
Installation
code
Bash
# Install dependencies
npm install

# Start local development server
npm run dev
The application will be available at http://localhost:3000.
Building for Production
code
Bash
# Compile and build production assets
npm run build

# Type check and lint codebase
npm run lint
Project Structure
code
Code
├── public/
│   ├── sales_data.csv             # Raw portfolio sales dataset (1,576 rows)
│   └── cleaned_sales_dataset.csv  # Standardized enterprise sales dataset (1,725 rows)
├── scripts/
│   └── generate_sales_file.js     # Data generator script for public files
├── src/
│   ├── components/
│   │   ├── Header.tsx             # 3-Zone top navigation & file download menu
│   │   ├── FilterBar.tsx          # Power BI style interactive slicer bar
│   │   ├── KPIGrid.tsx            # KPI metric cards with sparkline charts
│   │   ├── SalesTrendChart.tsx    # Interactive SVG trend and growth chart
│   │   ├── ProductPerformanceView.tsx # Top-selling vs low-performing matrix
│   │   ├── RegionCategoryView.tsx # Region and category breakdown bars
│   │   ├── ETLStudio.tsx          # Data cleaning, audit log, & file repository
│   │   └── ExecutiveReportModal.tsx # Printable executive briefing modal
│   ├── data/
│   │   └── sampleDatasets.ts      # Preloaded enterprise & portfolio datasets
│   ├── types/
│   │   └── dashboard.ts           # TypeScript interfaces for sales records & KPIs
│   ├── utils/
│   │   ├── analytics.ts           # KPI, trend, moving average, and ranking math
│   │   ├── csvParser.ts           # Matrix and standard CSV parsing logic
│   │   └── dataCleaner.ts         # Deduplication, imputation, and validation engine
│   ├── App.tsx                    # Main dashboard container & cross-filter state
│   ├── index.css                  # Tailwind CSS import
│   └── main.tsx                   # React root entry point
├── metadata.json
├── package.json
└── tsconfig.json
