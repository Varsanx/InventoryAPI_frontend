import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { reportService } from '../../services/reportService';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCurrentStock = async () => {
    try {
      setLoading(true);
      const response = await reportService.getCurrentStock();
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Error loading report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await reportService.exportCurrentStock();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CurrentStock_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error exporting report');
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
      </div>

      <div className="card mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Stock Report</h3>
        <div className="flex gap-4">
          <button onClick={fetchCurrentStock} className="btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
          {report && (
            <button onClick={handleExport} className="btn-primary bg-green-600 hover:bg-green-700">
              📥 Export to Excel
            </button>
          )}
        </div>
      </div>

      {report && (
        <div className="card">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Report Date: {new Date(report.reportDate).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Items: {report.totalItems}</p>
            <p className="text-sm text-gray-600">
              Total Stock Quantity: {report.totalStockQty.toFixed(2)}
            </p>
          </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    UOM
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Qty On Hand
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Min Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.data.map((item) => (
                  <tr key={item.itemId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.itemCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.uomCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {item.qtyOnHand.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                      {item.minStockLevel.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.stockStatus === 'OUT OF STOCK'
                            ? 'bg-red-100 text-red-800'
                            : item.stockStatus === 'LOW STOCK'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {item.stockStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Reports;
