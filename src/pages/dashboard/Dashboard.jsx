import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { dashboardService } from '../../services/dashboardService';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {summary?.totalItems || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {summary?.lowStockCount || 0}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {summary?.outOfStockCount || 0}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {summary?.totalTransactions || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Low Stock Items</h3>
          {lowStock.length === 0 ? (
            <p className="text-gray-500">No low stock items</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((item) => (
                <div key={item.itemId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{item.itemCode}</p>
                    <p className="text-sm text-gray-600">{item.itemName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {item.qtyOnHand} {item.uomCode}
                    </p>
                    <p className="text-xs text-gray-500">Min: {item.minStockLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500">No recent transactions</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((txn) => (
                <div key={txn.txnId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{txn.txnTypeCode}</p>
                    <p className="text-sm text-gray-600">{txn.referenceNo || 'No reference'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{txn.itemCount} items</p>
                    <p className="text-xs text-gray-500">
                      {new Date(txn.txnDate).toLocaleDateString()}
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