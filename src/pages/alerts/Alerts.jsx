import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { alertService } from '../../services/alertService';
import { useAuth } from '../../context/AuthContext';

const Alerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [showAcknowledged]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const params = { acknowledged: showAcknowledged };
      const response = await alertService.getAll(params);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      alert('Error loading alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId) => {
    try {
      await alertService.acknowledge(alertId, user.userId);
      alert('Alert acknowledged');
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

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Stock Alerts</h2>
        <button onClick={handleGenerateAlerts} className="btn-primary">
          Generate Alerts
        </button>
      </div>

      <div className="card mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showAcknowledged}
            onChange={(e) => setShowAcknowledged(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Show Acknowledged Alerts
          </span>
        </label>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No alerts found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
  {alerts.map((alert) => (
    <tr key={alert.alertId} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {alert.itemCode}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {alert.itemName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {alert.categoryName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
        {alert.qtyOnHand}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
        {alert.minStockLevel}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
        {alert.shortage}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {new Date(alert.alertDate).toLocaleDateString()}
        <div className="text-xs text-gray-400">
          {alert.alertAge} days ago
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {!alert.isAcknowledged ? (
          <button
            onClick={() => handleAcknowledge(alert.alertId)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Acknowledge
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
  ))}
</tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Alerts;
