import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { reportService } from '../../services/reportService';
import { categoryService } from '../../services/categoryService';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // filter state
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  // monthly movement states
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchCurrentStock = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchFilter) params.search = searchFilter;
      if (categoryFilter) params.categoryId = categoryFilter;
      if (stockStatusFilter && stockStatusFilter !== 'all') params.stockStatus = stockStatusFilter;

      const response = await reportService.getCurrentStock(params);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Error loading report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getAll();
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };

    loadCategories();
  }, []);

  const fetchMonthlyMovement = async () => {
    if (!year || !month) {
      alert('Please select year and month');
      return;
    }

    try {
      setLoadingMonthly(true);
      const response = await reportService.getMonthlyMovement({ year, month });
      setMonthlyReport(response.data);
    } catch (error) {
      console.error('Error fetching monthly movement:', error);
      alert('Error loading monthly movement report');
    } finally {
      setLoadingMonthly(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (searchFilter) params.search = searchFilter;
      if (categoryFilter) params.categoryId = categoryFilter;
      if (stockStatusFilter && stockStatusFilter !== 'all') params.stockStatus = stockStatusFilter;

      const response = await reportService.exportCurrentStock(params);
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

  const handleExportMonthly = async () => {
    if (!year || !month) {
      alert('Please select year and month');
      return;
    }

    try {
      const response = await reportService.exportMonthlyMovement({ year, month });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `MonthlyMovement_${year}_${String(month).padStart(2, '0')}_${new Date()
          .toISOString()
          .split('T')[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting monthly report:', error);
      alert('Error exporting monthly report');
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
      </div>

      <div className="card mb-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Current Stock Report
        </h3>

        {/* filter row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              placeholder="Code or name…"
              className="input-field w-full"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              className="input-field w-full"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock Status
            </label>
            <select
              className="input-field w-full"
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="out">Out</option>
              <option value="available">Available</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button onClick={fetchCurrentStock} className="btn-primary" disabled={loading}>
            {loading ? 'Loading…' : 'Generate'}
          </button>
          {report && (
            <button onClick={handleExport} className="btn-primary bg-green-600 hover:bg-green-700">
              📥 Export to Excel
            </button>
          )}
        </div>
      </div>

      {/* Monthly movement section */}
      <div className="card mb-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Stock Movement Report
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              min="2000"
              max="2100"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              className="input-field w-full"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchMonthlyMovement}
              className="btn-primary"
              disabled={loadingMonthly}
            >
              {loadingMonthly ? 'Loading…' : 'Generate'}
            </button>
            {monthlyReport && (
              <button
                onClick={handleExportMonthly}
                className="btn-primary bg-green-600 hover:bg-green-700"
              >
                📥 Export
              </button>
            )}
          </div>
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

      {monthlyReport && (
        <div className="card mt-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Period: {monthlyReport.reportPeriod}
            </p>
            <p className="text-sm text-gray-600">
              Total Items: {monthlyReport.totalItems}
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
                    Opening
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Inward
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Outward
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Adjust
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Closing
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyReport.data.map((item) => (
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
                      {item.openingStock.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {item.inward.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {item.outward.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {item.adjustments.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {item.closingStock.toFixed(2)}
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
