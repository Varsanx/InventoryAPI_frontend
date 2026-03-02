import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { reportService } from '../../services/reportService';
import { categoryService } from '../../services/categoryService';

/* ── SVG Icons ── */
const IconSearch = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);
const IconDownload = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
  </svg>
);
const IconCalendar = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconStock = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const IconFilter = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2M13 16h-2" />
  </svg>
);
const IconChevron = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const IconArrowIn = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);
const IconArrowOut = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);
const IconSpinner = ({ className }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ── Helpers ── */
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];

const fmt = (n) => (n ?? 0).toFixed(2);

const StockBadge = ({ status }) => {
  const cfg = {
    'OUT OF STOCK': { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444', label: 'Out of Stock' },
    'LOW STOCK':    { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b', label: 'Low Stock'    },
    'IN STOCK':     { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e', label: 'In Stock'     },
  };
  const c = cfg[status] || cfg['IN STOCK'];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {c.label}
    </span>
  );
};

/* ── Section Header ── */
const SectionHeader = ({ icon: Icon, title, accent, children }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}18` }}>
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h3>
      </div>
    </div>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

/* ── Field Label ── */
const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
    {children}
  </label>
);

/* ── Input styles ── */
const inputCls = "w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-300 transition";
const selectCls = "w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer";

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
const Reports = () => {
  const [report, setReport]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [categories, setCategories]     = useState([]);

  const [monthlyReport, setMonthlyReport]   = useState(null);
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear]   = useState(new Date().getFullYear());

  // which panel is expanded
  const [activePanel, setActivePanel] = useState('stock'); // 'stock' | 'monthly'

  useEffect(() => {
    categoryService.getAll()
      .then(r => setCategories(r.data))
      .catch(e => console.error('Failed to load categories', e));
  }, []);

  const fetchCurrentStock = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchFilter) params.search = searchFilter;
      if (categoryFilter) params.categoryId = categoryFilter;
      if (stockStatusFilter !== 'all') params.stockStatus = stockStatusFilter;
      const res = await reportService.getCurrentStock(params);
      setReport(res.data);
      setActivePanel('stock');
    } catch { alert('Error loading report'); }
    finally { setLoading(false); }
  };

  const fetchMonthlyMovement = async () => {
    if (!year || !month) return alert('Please select year and month');
    try {
      setLoadingMonthly(true);
      const res = await reportService.getMonthlyMovement({ year, month });
      setMonthlyReport(res.data);
      setActivePanel('monthly');
    } catch { alert('Error loading monthly report'); }
    finally { setLoadingMonthly(false); }
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (searchFilter) params.search = searchFilter;
      if (categoryFilter) params.categoryId = categoryFilter;
      if (stockStatusFilter !== 'all') params.stockStatus = stockStatusFilter;
      const res = await reportService.exportCurrentStock(params);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = Object.assign(document.createElement('a'), {
        href: url,
        download: `CurrentStock_${new Date().toISOString().split('T')[0]}.xlsx`
      });
      document.body.appendChild(a); a.click(); a.remove();
    } catch { alert('Error exporting report'); }
  };

  const handleExportMonthly = async () => {
    if (!year || !month) return alert('Please select year and month');
    try {
      const res = await reportService.exportMonthlyMovement({ year, month });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = Object.assign(document.createElement('a'), {
        href: url,
        download: `MonthlyMovement_${year}_${String(month).padStart(2,'0')}.xlsx`
      });
      document.body.appendChild(a); a.click(); a.remove();
    } catch { alert('Error exporting monthly report'); }
  };

  /* summary pills for current stock */
  const stockSummary = report ? [
    { label: 'Total Items',    value: report.totalItems,              color: '#3b82f6' },
    { label: 'Total Qty',      value: fmt(report.totalStockQty),      color: '#6366f1' },
    { label: 'In Stock',       value: report.data.filter(i => i.stockStatus === 'IN STOCK').length,    color: '#16a34a' },
    { label: 'Low Stock',      value: report.data.filter(i => i.stockStatus === 'LOW STOCK').length,   color: '#d97706' },
    { label: 'Out of Stock',   value: report.data.filter(i => i.stockStatus === 'OUT OF STOCK').length,color: '#dc2626' },
  ] : [];

  return (
    <Layout>
      <style>{`
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .slide-down { animation: slideDown .3s ease both; }
        @keyframes fadeRow {
          from { opacity:0; }
          to   { opacity:1; }
        }
        .fade-row { animation: fadeRow .25s ease both; }
      `}</style>

      {/* ── Page Header ── */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h2>
          <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">
            Inventory Analytics &amp; Export
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          Live data
        </div>
      </div>

      {/* ── Report Type Tabs ── */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'stock',   label: 'Current Stock',         Icon: IconStock    },
          { key: 'monthly', label: 'Monthly Movement',      Icon: IconCalendar },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActivePanel(key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
            style={activePanel === key
              ? { background: '#1e3a5f', color: '#fff' }
              : { background: '#f1f5f9', color: '#64748b' }
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════
          PANEL A — Current Stock Report
      ══════════════════════════════════ */}
      {activePanel === 'stock' && (
        <div className="slide-down">
          {/* Filter Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-blue-500" />
                <span className="text-sm font-bold text-gray-800">Current Stock Report</span>
              </div>
              <IconFilter className="w-4 h-4 text-gray-300" />
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {/* Search */}
                <div className="relative">
                  <Label>Search</Label>
                  <div className="relative">
                    <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Item code or name…"
                      className={inputCls + ' pl-9'}
                      value={searchFilter}
                      onChange={e => setSearchFilter(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="relative">
                  <Label>Category</Label>
                  <div className="relative">
                    <select className={selectCls} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                      <option value="">All Categories</option>
                      {categories.map(c => (
                        <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                      ))}
                    </select>
                    <IconChevron className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Stock Status */}
                <div className="relative">
                  <Label>Stock Status</Label>
                  <div className="relative">
                    <select className={selectCls} value={stockStatusFilter} onChange={e => setStockStatusFilter(e.target.value)}>
                      <option value="all">All Statuses</option>
                      <option value="available">In Stock</option>
                      <option value="low">Low Stock</option>
                      <option value="out">Out of Stock</option>
                    </select>
                    <IconChevron className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchCurrentStock}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                  style={{ background: '#1e3a5f' }}
                >
                  {loading ? <IconSpinner className="w-4 h-4" /> : <IconSearch className="w-4 h-4" />}
                  {loading ? 'Generating…' : 'Generate Report'}
                </button>

                {report && (
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity"
                    style={{ background: '#059669' }}
                  >
                    <IconDownload className="w-4 h-4" />
                    Export Excel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          {report && (
            <div className="slide-down bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Summary strip */}
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-x-6 gap-y-1 items-center">
                <span className="text-xs text-gray-400 font-medium mr-2">
                  {new Date(report.reportDate).toLocaleString()}
                </span>
                {stockSummary.map(s => (
                  <span key={s.label} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: s.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label}: {s.value}
                  </span>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-50">
                  <thead>
                    <tr className="bg-gray-50">
                      {['Item Code','Item Name','Category','UOM','Qty On Hand','Min Level','Status'].map(h => (
                        <th key={h} className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${h.includes('Qty') || h.includes('Min') ? 'text-right' : 'text-left'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {report.data.map((item, idx) => (
                      <tr key={item.itemId}
                        className="hover:bg-blue-50 transition-colors fade-row"
                        style={{ animationDelay: `${idx * 20}ms` }}
                      >
                        <td className="px-5 py-3 text-xs font-mono font-bold text-gray-700 whitespace-nowrap">{item.itemCode}</td>
                        <td className="px-5 py-3 text-sm text-gray-800 whitespace-nowrap">{item.itemName}</td>
                        <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">{item.categoryName}</td>
                        <td className="px-5 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{item.uomCode}</td>
                        <td className="px-5 py-3 text-sm font-bold text-right whitespace-nowrap" style={{
                          color: item.stockStatus === 'OUT OF STOCK' ? '#dc2626' :
                                 item.stockStatus === 'LOW STOCK'    ? '#d97706' : '#16a34a'
                        }}>
                          {fmt(item.qtyOnHand)}
                        </td>
                        <td className="px-5 py-3 text-sm text-right text-gray-500 whitespace-nowrap">{fmt(item.minStockLevel)}</td>
                        <td className="px-5 py-3 whitespace-nowrap"><StockBadge status={item.stockStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════
          PANEL B — Monthly Movement Report
      ══════════════════════════════════ */}
      {activePanel === 'monthly' && (
        <div className="slide-down">
          {/* Filter Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-indigo-500" />
                <span className="text-sm font-bold text-gray-800">Monthly Stock Movement</span>
              </div>
              <IconCalendar className="w-4 h-4 text-gray-300" />
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 items-end">
                {/* Year */}
                <div>
                  <Label>Year</Label>
                  <input
                    type="number" min="2000" max="2100"
                    value={year}
                    onChange={e => setYear(parseInt(e.target.value, 10))}
                    className={inputCls}
                  />
                </div>

                {/* Month */}
                <div className="relative">
                  <Label>Month</Label>
                  <div className="relative">
                    <select className={selectCls} value={month} onChange={e => setMonth(parseInt(e.target.value, 10))}>
                      {MONTH_NAMES.map((name, i) => (
                        <option key={i + 1} value={i + 1}>{name}</option>
                      ))}
                    </select>
                    <IconChevron className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Period preview */}
                <div className="col-span-2 flex items-end">
                  <div className="w-full bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 flex items-center gap-2">
                    <IconCalendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-indigo-700">
                      {MONTH_NAMES[month - 1]} {year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchMonthlyMovement}
                  disabled={loadingMonthly}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                  style={{ background: '#4f46e5' }}
                >
                  {loadingMonthly ? <IconSpinner className="w-4 h-4" /> : <IconStock className="w-4 h-4" />}
                  {loadingMonthly ? 'Generating…' : 'Generate Report'}
                </button>

                {monthlyReport && (
                  <button
                    onClick={handleExportMonthly}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                    style={{ background: '#059669' }}
                  >
                    <IconDownload className="w-4 h-4" />
                    Export Excel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Results */}
          {monthlyReport && (
            <div className="slide-down bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Summary strip */}
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-x-6 items-center">
                <span className="text-xs font-semibold text-indigo-600 mr-2">
                  Period: {monthlyReport.reportPeriod}
                </span>
                <span className="text-xs text-gray-400">
                  {monthlyReport.totalItems} items
                </span>
                {/* Aggregate totals */}
                {[
                  { label: 'Total Inward',  value: monthlyReport.data.reduce((s, i) => s + i.inward, 0),      color: '#16a34a', Icon: IconArrowIn  },
                  { label: 'Total Outward', value: monthlyReport.data.reduce((s, i) => s + i.outward, 0),     color: '#dc2626', Icon: IconArrowOut },
                ].map(s => (
                  <span key={s.label} className="flex items-center gap-1 text-xs font-semibold ml-2" style={{ color: s.color }}>
                    <s.Icon className="w-3 h-3" />
                    {s.label}: {fmt(s.value)}
                  </span>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-50">
                  <thead>
                    <tr className="bg-gray-50">
                      {[
                        { h: 'Item Code', right: false },
                        { h: 'Item Name', right: false },
                        { h: 'Category',  right: false },
                        { h: 'UOM',       right: false },
                        { h: 'Opening',   right: true  },
                        { h: 'Inward',    right: true  },
                        { h: 'Outward',   right: true  },
                        { h: 'Adjust',    right: true  },
                        { h: 'Closing',   right: true  },
                      ].map(({ h, right }) => (
                        <th key={h} className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${right ? 'text-right' : 'text-left'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {monthlyReport.data.map((item, idx) => {
                      const net = item.closingStock - item.openingStock;
                      return (
                        <tr key={item.itemId}
                          className="hover:bg-indigo-50 transition-colors fade-row"
                          style={{ animationDelay: `${idx * 20}ms` }}
                        >
                          <td className="px-5 py-3 text-xs font-mono font-bold text-gray-700 whitespace-nowrap">{item.itemCode}</td>
                          <td className="px-5 py-3 text-sm text-gray-800 whitespace-nowrap">{item.itemName}</td>
                          <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">{item.categoryName}</td>
                          <td className="px-5 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{item.uomCode}</td>
                          <td className="px-5 py-3 text-sm text-right text-gray-600 whitespace-nowrap">{fmt(item.openingStock)}</td>
                          <td className="px-5 py-3 text-sm text-right font-semibold text-green-600 whitespace-nowrap">
                            {item.inward > 0 ? `+${fmt(item.inward)}` : fmt(item.inward)}
                          </td>
                          <td className="px-5 py-3 text-sm text-right font-semibold text-red-500 whitespace-nowrap">
                            {item.outward > 0 ? `-${fmt(item.outward)}` : fmt(item.outward)}
                          </td>
                          <td className="px-5 py-3 text-sm text-right text-blue-500 whitespace-nowrap">{fmt(item.adjustments)}</td>
                          <td className="px-5 py-3 text-sm text-right font-bold whitespace-nowrap"
                            style={{ color: net >= 0 ? '#16a34a' : '#dc2626' }}>
                            {fmt(item.closingStock)}
                            {net !== 0 && (
                              <span className="text-[10px] ml-1 font-normal" style={{ color: net > 0 ? '#16a34a' : '#dc2626' }}>
                                ({net > 0 ? '+' : ''}{fmt(net)})
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Reports;