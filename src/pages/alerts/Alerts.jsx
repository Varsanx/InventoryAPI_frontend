import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { alertService } from '../../services/alertService';
import { useAuth } from '../../context/AuthContext';

const Alerts = () => {
  const { user } = useAuth();
  const [allAlerts, setAllAlerts] = useState([]); // Store ALL alerts for summary
  const [displayedAlerts, setDisplayedAlerts] = useState([]); // Alerts to show in table
  const [loading, setLoading] = useState(true);
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    // Filter displayed alerts when checkbox changes
    if (showAcknowledged) {
      setDisplayedAlerts(allAlerts.filter(a => a.isAcknowledged));
    } else {
      setDisplayedAlerts(allAlerts.filter(a => !a.isAcknowledged));
    }
  }, [showAcknowledged, allAlerts]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      // Fetch ALL alerts (both acknowledged and unacknowledged)
      const [unacknowledgedResponse, acknowledgedResponse] = await Promise.all([
        alertService.getAll({ acknowledged: false }),
        alertService.getAll({ acknowledged: true })
      ]);

      const allAlertsCombined = [
        ...unacknowledgedResponse.data,
        ...acknowledgedResponse.data
      ];

      setAllAlerts(allAlertsCombined);
      
      // Initially show unacknowledged alerts
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
      fetchAlerts(); // Refresh all alerts
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      alert('Error acknowledging alert');
    }
  };

  const handleGenerateAlerts = async () => {
    try {
      await alertService.generate();
      alert('Alerts generated successfully');
      fetchAlerts(); // Refresh all alerts
    } catch (error) {
      console.error('Error generating alerts:', error);
      alert('Error generating alerts');
    }
  };

  // Calculate if alert is new (created within last 24 hours)
  const isNewAlert = (alertDate) => {
    const now = new Date();
    const alert = new Date(alertDate);
    const diffHours = (now - alert) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  // Calculate summary stats from ALL alerts
  const totalAlerts = allAlerts.length;
  const newAlerts = allAlerts.filter(a => isNewAlert(a.alertDate) && !a.isAcknowledged).length;
  const unacknowledgedAlerts = allAlerts.filter(a => !a.isAcknowledged).length;
  const acknowledgedAlerts = allAlerts.filter(a => a.isAcknowledged).length;

  return (
    <Layout>
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

      {/* Summary Card - ALWAYS VISIBLE */}
      <div className="mb-6 card bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-4 flex items-center">
          <span className="text-xl mr-2">📊</span>
          Alert Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-blue-600 font-medium uppercase mb-1">Total Alerts</p>
            <p className="text-3xl font-bold text-blue-900">{totalAlerts}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-red-600 font-medium uppercase mb-1">New (24h)</p>
            <p className="text-3xl font-bold text-red-900">{newAlerts}</p>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-orange-600 font-medium uppercase mb-1">Pending</p>
            <p className="text-3xl font-bold text-orange-900">{unacknowledgedAlerts}</p>
            <p className="text-xs text-gray-500 mt-1">Not acknowledged</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-green-600 font-medium uppercase mb-1">Resolved</p>
            <p className="text-3xl font-bold text-green-900">{acknowledgedAlerts}</p>
            <p className="text-xs text-gray-500 mt-1">Acknowledged</p>
          </div>
        </div>
      </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Qty On Hand
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Min Level
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Shortage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Alert Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedAlerts.map((alert) => {
                  const isNew = isNewAlert(alert.alertDate);
                  
                  return (
                    <tr 
                      key={alert.alertId} 
                      className={`hover:bg-gray-50 ${
                        isNew && !alert.isAcknowledged ? 'bg-yellow-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isNew && !alert.isAcknowledged ? (
                          <div className="flex items-center">
                            <span className="relative flex h-3 w-3 mr-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="px-2 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">
                              NEW
                            </span>
                          </div>
                        ) : alert.isAcknowledged ? (
                          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                            ✓ Done
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {alert.itemCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {alert.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {alert.categoryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className="font-bold text-red-600">
                          {alert.qtyOnHand}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                        {alert.minStockLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                        {alert.shortage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>
                          {new Date(alert.alertDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(alert.alertDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {isNew && !alert.isAcknowledged && (
                          <div className="text-xs text-red-600 font-medium mt-1">
                            {"< 24 hours ago"}
                          </div>
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
                            {alert.acknowledgedByName && (
                              <div className="text-gray-500">
                                by {alert.acknowledgedByName}
                              </div>
                            )}
                            {alert.acknowledgedAt && (
                              <div className="text-gray-400">
                                {new Date(alert.acknowledgedAt).toLocaleDateString()}
                              </div>
                            )}
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