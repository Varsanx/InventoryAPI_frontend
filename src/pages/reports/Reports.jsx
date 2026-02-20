import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { reportService } from '../../services/reportService';

const Reports = () => {
  const [reportType, setReportType] = useState('current');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Date filters
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekStartDate, setWeekStartDate] = useState(getWeekStart());
  const [weekEndDate, setWeekEndDate] = useState(today);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Helper function to get Monday of current week
  function getWeekStart() {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff)).toISOString().split('T')[0];
  }

  const fetchCurrentStock = async () => {
    try {
      setLoading(true);
      const response = await reportService.getCurrentStock();
      setReport(response.data);
      setReportType('current');
    } catch (error) {
      console.error('Error:', error);
      alert('Error loading report');
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyReport = async () => {
    try {
      setLoading(true);
      const response = await reportService.getCurrentStock({
        asOfDate: selectedDate
      });
      setReport({
        ...response.data,
        periodDescription: `Daily Report - ${new Date(selectedDate).toLocaleDateString()}`
      });
      setReportType('daily');
    } catch (error) {
      console.error('Error:', error);
      alert('Error loading daily report');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyReport = async () => {
    try {
      setLoading(true);
      
      // Calculate week number
      const start = new Date(weekStartDate);
      const end = new Date(weekEndDate);
      const weekNum = Math.ceil((end - new Date(end.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
      
      const response = await reportService.getCurrentStock({
        asOfDate: weekEndDate
      });
      
      setReport({
        ...response.data,
        periodDescription: `Weekly Report - Week ${weekNum}, ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`
      });
      setReportType('weekly');
    } catch (error) {
      console.error('Error:', error);
      alert('Error loading weekly report');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyReport = async () => {
    try {
      setLoading(true);
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      
      // Get last day of selected month
      const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
      const asOfDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      
      const response = await reportService.getMonthlyMovement(selectedYear, selectedMonth);
      
      setReport({
        ...response.data,
        periodDescription: `Monthly Report - ${monthNames[selectedMonth - 1]} ${selectedYear}`
      });
      setReportType('monthly');
    } catch (error) {
      console.error('Error:', error);
      alert('Error loading monthly report');
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlyReport = async () => {
    try {
      setLoading(true);
      
      const asOfDate = `${selectedYear}-12-31`;
      const response = await reportService.getCurrentStock({
        asOfDate: asOfDate
      });
      
      setReport({
        ...response.data,
        periodDescription: `Yearly Report - ${selectedYear}`
      });
      setReportType('yearly');
    } catch (error) {
      console.error('Error:', error);
      alert('Error loading yearly report');
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
      const filename = `${reportType}_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error exporting report');
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Stock Reports</h2>
        <p className="text-sm text-gray-600 mt-1">Generate and export inventory reports</p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <button
          onClick={() => setReportType('current-setup')}
          className={`p-4 rounded-lg border-2 transition-all ${
            reportType === 'current' || reportType === 'current-setup'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="text-2xl mb-2">📊</div>
          <div className="font-medium">Current Stock</div>
          <div className="text-xs text-gray-500">Real-time</div>
        </button>

        <button
          onClick={() => setReportType('daily-setup')}
          className={`p-4 rounded-lg border-2 transition-all ${
            reportType === 'daily' || reportType === 'daily-setup'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="text-2xl mb-2">📅</div>
          <div className="font-medium">Daily</div>
          <div className="text-xs text-gray-500">Single day</div>
        </button>

        <button
          onClick={() => setReportType('weekly-setup')}
          className={`p-4 rounded-lg border-2 transition-all ${
            reportType === 'weekly' || reportType === 'weekly-setup'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="text-2xl mb-2">📆</div>
          <div className="font-medium">Weekly</div>
          <div className="text-xs text-gray-500">7 days</div>
        </button>

        <button
          onClick={() => setReportType('monthly-setup')}
          className={`p-4 rounded-lg border-2 transition-all ${
            reportType === 'monthly' || reportType === 'monthly-setup'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="text-2xl mb-2">📈</div>
          <div className="font-medium">Monthly</div>
          <div className="text-xs text-gray-500">By month</div>
        </button>

        <button
          onClick={() => setReportType('yearly-setup')}
          className={`p-4 rounded-lg border-2 transition-all ${
            reportType === 'yearly' || reportType === 'yearly-setup'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="text-2xl mb-2">📊</div>
          <div className="font-medium">Yearly</div>
          <div className="text-xs text-gray-500">Annual</div>
        </button>
      </div>

      {/* Current Stock Setup */}
      {reportType === 'current-setup' && (
        <div className="card mb-6">
          <h3 className="text-lg font-medium mb-4">Current Stock Report</h3>
          <p className="text-sm text-gray-600 mb-4">
            View the current stock levels for all items as of right now.
          </p>
          <button onClick={fetchCurrentStock} className="btn-primary" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Current Stock Report'}
          </button>
        </div>
      )}

      {/* Daily Setup */}
      {reportType === 'daily-setup' && (
        <div className="card mb-6">
          <h3 className="text-lg font-medium mb-4">Daily Stock Report</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                className="input-field"
                value={selectedDate}
                max={today}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <button onClick={fetchDailyReport} className="btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Daily Report'}
            </button>
          </div>
        </div>
      )}

      {/* Weekly Setup */}
      {reportType === 'weekly-setup' && (
        <div className="card mb-6">
          <h3 className="text-lg font-medium mb-4">Weekly Stock Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Week Start Date (Monday)
              </label>
              <input
                type="date"
                className="input-field"
                value={weekStartDate}
                max={today}
                onChange={(e) => setWeekStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Week End Date (Sunday)
              </label>
              <input
                type="date"
                className="input-field"
                value={weekEndDate}
                max={today}
                onChange={(e) => setWeekEndDate(e.target.value)}
              />
            </div>
            <button onClick={fetchWeeklyReport} className="btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Weekly Report'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Stock levels as of the end of the week
          </p>
        </div>
      )}

      {/* Monthly Setup */}
      {reportType === 'monthly-setup' && (
        <div className="card mb-6">
          <h3 className="text-lg font-medium mb-4">Monthly Stock Movement Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                className="input-field"
                value={selectedYear}
                min="2020"
                max="2030"
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                className="input-field"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((month, i) => (
                  <option key={i + 1} value={i + 1}>{month}</option>
                ))}
              </select>
            </div>
            <button onClick={fetchMonthlyReport} className="btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Monthly Report'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Shows opening stock, inward, outward, adjustments, and closing stock
          </p>
        </div>
      )}

      {/* Yearly Setup */}
      {reportType === 'yearly-setup' && (
        <div className="card mb-6">
          <h3 className="text-lg font-medium mb-4">Yearly Stock Report</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Year
              </label>
              <input
                type="number"
                className="input-field"
                value={selectedYear}
                min="2020"
                max="2030"
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              />
            </div>
            <button onClick={fetchYearlyReport} className="btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Yearly Report'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Stock levels as of December 31, {selectedYear}
          </p>
        </div>
      )}

      {/* Report Display */}
      {report && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {report.periodDescription || `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Generated: {new Date().toLocaleString()}
              </p>
            </div>
            <button onClick={handleExport} className="btn-primary bg-green-600 hover:bg-green-700">
              📥 Export to Excel
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold">{report.totalItems || report.data?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Stock Qty</p>
              <p className="text-2xl font-bold">
                {(report.totalStockQty || report.data?.reduce((sum, item) => 
                  sum + (item.qtyOnHand || item.closingStock || 0), 0) || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Report Type</p>
              <p className="text-xl font-bold capitalize">{reportType.replace('-setup', '')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Period</p>
              <p className="text-sm font-medium">{report.periodDescription || 'Current'}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {reportType === 'monthly' ? (
              // Monthly Movement Table
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Opening</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Inward</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Outward</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Adjustments</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Closing</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.data?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium text-gray-900">{item.itemCode}</div>
                        <div className="text-gray-500 text-xs">{item.itemName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">{item.openingStock?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 text-sm text-right text-green-600 font-medium">
                        +{item.inward?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-red-600 font-medium">
                        -{item.outward?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">{item.adjustments?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 text-sm text-right font-bold">{item.closingStock?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Current Stock Table
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty On Hand</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Min Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.data?.map((item) => (
                    <tr key={item.itemId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{item.itemCode}</td>
                      <td className="px-6 py-4 text-sm">{item.itemName}</td>
                      <td className="px-6 py-4 text-sm">{item.categoryName}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium">{item.qtyOnHand?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-right">{item.minStockLevel?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.stockStatus === 'OUT OF STOCK' ? 'bg-red-100 text-red-800' :
                          item.stockStatus === 'LOW STOCK' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.stockStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Reports;