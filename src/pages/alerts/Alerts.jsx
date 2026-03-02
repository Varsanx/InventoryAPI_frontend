import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { alertService } from '../../services/alertService';
import { useAuth } from '../../context/AuthContext';

const Alerts = () => {
  const { user } = useAuth();
  const [allAlerts, setAllAlerts] = useState([]);
  const [displayedAlerts, setDisplayedAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (showAcknowledged) {
      setDisplayedAlerts(allAlerts.filter(a => a.isAcknowledged));
    } else {
      setDisplayedAlerts(allAlerts.filter(a => !a.isAcknowledged));
    }
  }, [showAcknowledged, allAlerts]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const [unacknowledgedResponse, acknowledgedResponse] = await Promise.all([
        alertService.getAll({ acknowledged: false }),
        alertService.getAll({ acknowledged: true })
      ]);
      const allAlertsCombined = [
        ...unacknowledgedResponse.data,
        ...acknowledgedResponse.data
      ];
      setAllAlerts(allAlertsCombined);
      setDisplayedAlerts(unacknowledgedResponse.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      alert('Error loading alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId) => {
    try {
      await alertService.acknowledge(alertId, user.userId || 1);
      alert('Alert acknowledged successfully');
      fetchAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      alert('Error acknowledging alert');
    }
  };

  const handleGenerateAlerts = async () => {
    try {
      await alertService.generate();
      alert('Alerts generated successfully');
      fetchAlerts();
    } catch (error) {
      console.error('Error generating alerts:', error);
      alert('Error generating alerts');
    }
  };

  const isNewAlert = (alertDate) => {
    const now = new Date();
    const alert = new Date(alertDate);
    const diffHours = (now - alert) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  const totalAlerts = allAlerts.length;
  const newAlerts = allAlerts.filter(a => isNewAlert(a.alertDate) && !a.isAcknowledged).length;
  const unacknowledgedAlerts = allAlerts.filter(a => !a.isAcknowledged).length;
  const acknowledgedAlerts = allAlerts.filter(a => a.isAcknowledged).length;

  // Resolution rate percentage
  const resolutionRate = totalAlerts > 0
    ? Math.round((acknowledgedAlerts / totalAlerts) * 100)
    : 0;

  const summaryStats = [
    {
      label: 'Total Alerts',
      value: totalAlerts,
      sub: 'All time',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      accent: '#3b82f6',
      bg: '#eff6ff',
      border: '#bfdbfe',
    },
    {
      label: 'New (24h)',
      value: newAlerts,
      sub: newAlerts > 0 ? 'Requires attention' : 'No new alerts',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      accent: '#ef4444',
      bg: '#fef2f2',
      border: '#fecaca',
      pulse: newAlerts > 0,
    },
    {
      label: 'Pending',
      value: unacknowledgedAlerts,
      sub: 'Not acknowledged',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: '#f59e0b',
      bg: '#fffbeb',
      border: '#fde68a',
    },
    {
      label: 'Resolved',
      value: acknowledgedAlerts,
      sub: `${resolutionRate}% resolution rate`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: '#10b981',
      bg: '#ecfdf5',
      border: '#a7f3d0',
    },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stock Alerts</h2>
          <p className="text-sm text-gray-600 mt-1">
            {unacknowledgedAlerts > 0 && (
              <span className="text-red-600 font-medium">
                {unacknowledgedAlerts} unacknowledged alert(s)
              </span>
            )}
          </p>
        </div>
        <button onClick={handleGenerateAlerts} className="btn-primary">
          🔄 Generate Alerts
        </button>
      </div>

      {/* ── REDESIGNED SUMMARY SECTION ── */}
      <div className="mb-6">
        {/* Section label */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Alert Overview
          </span>
          {/* Resolution progress bar */}
          {totalAlerts > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Resolution</span>
              <div className="w-28 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${resolutionRate}%`,
                    background: resolutionRate >= 70
                      ? '#10b981'
                      : resolutionRate >= 40
                      ? '#f59e0b'
                      : '#ef4444'
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">{resolutionRate}%</span>
            </div>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {summaryStats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: stat.bg,
                borderColor: stat.border,
              }}
              className="relative rounded-xl border p-4 overflow-hidden group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Top row: icon + label */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: stat.accent }}
                >
                  {stat.label}
                </span>
                <span
                  className="p-1.5 rounded-lg"
                  style={{ color: stat.accent, backgroundColor: 'white', opacity: 0.85 }}
                >
                  {stat.icon}
                </span>
              </div>

              {/* Value */}
              <div className="flex items-end gap-2 mb-1">
                <span
                  className="text-3xl font-bold leading-none tracking-tight"
                  style={{ color: stat.accent }}
                >
                  {stat.value}
                </span>
                {/* Pulse dot for new alerts */}
                {stat.pulse && stat.value > 0 && (
                  <span className="mb-1 relative flex h-2 w-2">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: stat.accent }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: stat.accent }}
                    />
                  </span>
                )}
              </div>

              {/* Sub label */}
              <p className="text-xs text-gray-500">{stat.sub}</p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-full opacity-40 group-hover:opacity-100 transition-opacity duration-200"
                style={{ backgroundColor: stat.accent }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* ── END SUMMARY SECTION ── */}

      {/* Filter Checkbox */}
      <div className="card mb-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showAcknowledged}
            onChange={(e) => setShowAcknowledged(e.target.checked)}
            className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Show Acknowledged Alerts Only
          </span>
          <span className="ml-2 text-xs text-gray-500">
            ({showAcknowledged ? acknowledgedAlerts : unacknowledgedAlerts} alerts)
          </span>
        </label>
      </div>

      {/* Alerts Table */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {showAcknowledged ? 'Acknowledged Alerts' : 'Active Alerts'}
          </h3>
          <span className="text-sm text-gray-500">
            Showing {displayedAlerts.length} of {totalAlerts} total alerts
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading alerts...</p>
          </div>
        ) : displayedAlerts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">
              {showAcknowledged ? '✅' : '🎉'}
            </div>
            <p className="text-gray-600 text-lg font-medium">
              {showAcknowledged
                ? 'No acknowledged alerts yet'
                : 'No active alerts! All items have sufficient stock.'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {!showAcknowledged && 'Great job maintaining inventory levels!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty On Hand</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Min Level</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Shortage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alert Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedAlerts.map((alert) => {
                  const isNew = isNewAlert(alert.alertDate);
                  return (
                    <tr
                      key={alert.alertId}
                      className={`hover:bg-gray-50 ${isNew && !alert.isAcknowledged ? 'bg-yellow-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isNew && !alert.isAcknowledged ? (
                          <div className="flex items-center">
                            <span className="relative flex h-3 w-3 mr-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="px-2 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">NEW</span>
                          </div>
                        ) : alert.isAcknowledged ? (
                          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">✓ Done</span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.itemCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{alert.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{alert.categoryName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className="font-bold text-red-600">{alert.qtyOnHand}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">{alert.minStockLevel}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">{alert.shortage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>{new Date(alert.alertDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(alert.alertDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {isNew && !alert.isAcknowledged && (
                          <div className="text-xs text-red-600 font-medium mt-1">{"< 24 hours ago"}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!alert.isAcknowledged ? (
                          <button
                            onClick={() => handleAcknowledge(alert.alertId)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          >
                            ✓ Acknowledge
                          </button>
                        ) : (
                          <div className="text-green-600 text-xs">
                            <div className="font-medium">✓ Acknowledged</div>
                            {alert.acknowledgedByName && <div className="text-gray-500">by {alert.acknowledgedByName}</div>}
                            {alert.acknowledgedAt && <div className="text-gray-400">{new Date(alert.acknowledgedAt).toLocaleDateString()}</div>}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Alerts;
