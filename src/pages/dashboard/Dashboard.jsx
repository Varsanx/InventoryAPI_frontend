import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { dashboardService } from '../../services/dashboardService';

/* ── Inline SVG Icons (no emoji) ── */
const IconBox = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
  </svg>
);
const IconWarn = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);
const IconEmpty = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);
const IconTxn = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const IconArrowIn = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);
const IconArrowOut = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);
const IconAdjust = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

/* ── Stat Card ── */
const StatCard = ({ label, value, icon: Icon, accent, delay = 0 }) => (
  <div
    style={{
      animationDelay: `${delay}ms`,
      borderLeft: `3px solid ${accent}`,
    }}
    className="animate-fadeIn bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
  >
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value ?? '—'}
      </p>
    </div>
    <div
      className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${accent}15` }}
    >
      <Icon className="w-5 h-5" style={{ color: accent }} />
    </div>
  </div>
);

/* ── Stock Level Bar ── */
const StockBar = ({ qty, min }) => {
  const pct = min > 0 ? Math.min((qty / min) * 100, 100) : 0;
  const color = qty === 0 ? '#ef4444' : qty < min ? '#f59e0b' : '#10b981';
  return (
    <div className="flex items-center gap-2 w-24">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono font-semibold" style={{ color }}>{qty}</span>
    </div>
  );
};

/* ── Transaction Type Badge ── */
const TxnBadge = ({ type }) => {
  const map = {
    INWARD:  { bg: '#ecfdf5', color: '#059669', Icon: IconArrowIn,  label: 'Inward' },
    OUTWARD: { bg: '#fef2f2', color: '#dc2626', Icon: IconArrowOut, label: 'Outward' },
    ADJUST:  { bg: '#eff6ff', color: '#2563eb', Icon: IconAdjust,   label: 'Adjust' },
  };
  const cfg = map[type] || { bg: '#f9fafb', color: '#6b7280', Icon: IconTxn, label: type };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <cfg.Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

/* ════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
════════════════════════════════════════ */
const Dashboard = () => {
  const [summary, setSummary]               = useState(null);
  const [lowStock, setLowStock]             = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [now, setNow]                       = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, lowStockRes, transactionsRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getLowStock(5),
        dashboardService.getRecentTransactions(5),
      ]);
      setSummary(summaryRes.data);
      setLowStock(lowStockRes.data);
      setRecentTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-blue-600" />
            <p className="text-xs text-gray-400 tracking-widest uppercase">Loading dashboard</p>
          </div>
        </div>
      </Layout>
    );
  }

  const statsConfig = [
    { label: 'Total Items',    value: summary?.totalItems,        icon: IconBox,   accent: '#3b82f6', delay: 0   },
    { label: 'Low Stock',      value: summary?.lowStockCount,     icon: IconWarn,  accent: '#f59e0b', delay: 60  },
    { label: 'Out of Stock',   value: summary?.outOfStockCount,   icon: IconEmpty, accent: '#ef4444', delay: 120 },
    { label: 'Transactions',   value: summary?.totalTransactions, icon: IconTxn,   accent: '#10b981', delay: 180 },
  ];

  const criticalAlert = (summary?.lowStockCount || 0) + (summary?.outOfStockCount || 0);

  return (
    <Layout>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease both;
        }
      `}</style>

      {/* ── Page Header ── */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            &nbsp;·&nbsp;
            {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Critical alert pill */}
        {criticalAlert > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            {criticalAlert} item{criticalAlert !== 1 ? 's' : ''} need attention
          </div>
        )}
      </div>

      {/* ── KPI Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {statsConfig.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Two Column Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

{/* Low Stock Panel */}
<div className="bg-white rounded-lg border border-gray-100 shadow-sm animate-fadeIn" style={{ animationDelay: '240ms' }}>

  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
    <div className="flex items-center gap-2">
      <div className="w-1 h-4 rounded-full bg-amber-400" />
      {/* Normal font for title */}
      <h3 className="text-sm font-normal text-gray-800 tracking-tight">Low Stock Items</h3>
    </div>
    <span className="text-xs text-gray-400">{lowStock.length} items</span>
  </div>

  {lowStock.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-12 text-gray-300">
      <IconBox className="w-10 h-10 mb-3" />
      <p className="text-xs">All items have sufficient stock</p>
    </div>
  ) : (
    <div className="divide-y divide-gray-50">
      {lowStock.map((item, idx) => (
        <div
          key={item.itemId}
          className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors duration-150 animate-fadeIn"
          style={{ animationDelay: `${300 + idx * 50}ms` }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {/* Item code stays bold */}
              <span className="text-xs font-bold text-gray-700">{item.itemCode}</span>
              {item.stockStatus === 'OUT OF STOCK' && (
                <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase tracking-wide">
                  Out
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate mt-0.5">{item.itemName}</p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <StockBar qty={item.qtyOnHand} min={item.minStockLevel} />
            <div className="text-right w-16">
              <p className="text-xs text-red-600">min</p>
              {/* Normal font for min stock */}
              <p className="text-xs font-normal text-gray-700">{item.minStockLevel} {item.uomCode}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
        {/* Recent Transactions Panel */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-blue-400" />
              <h3 className="text-sm font-bold text-gray-800 tracking-tight">Recent Transactions</h3>
            </div>
            <span className="text-xs text-gray-400">{recentTransactions.length} entries</span>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-300">
              <IconTxn className="w-10 h-10 mb-3" />
              <p className="text-xs">No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentTransactions.map((txn, idx) => (
                <div
                  key={txn.txnId}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors duration-150 animate-fadeIn"
                  style={{ animationDelay: `${360 + idx * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <TxnBadge type={txn.txnTypeCode} />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">
                        {txn.referenceNo || <span className="text-gray-300 font-normal italic">No reference</span>}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {txn.itemCount} line{txn.itemCount !== 1 ? 's' : ''}
                        {txn.totalQuantity != null && ` · ${txn.totalQuantity} units`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-gray-600">
                      {new Date(txn.txnDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {new Date(txn.txnDate).toLocaleDateString('en-IN', { year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;