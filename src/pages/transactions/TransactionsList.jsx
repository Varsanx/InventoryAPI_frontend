import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { transactionService } from '../../services/transactionService';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    txnTypeCode: '',
    sortBy: 'txnDate',
    sortDir: 'desc',
  });
  const navigate = useNavigate();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...(filter.txnTypeCode && { txnTypeCode: filter.txnTypeCode }),
        sortBy: filter.sortBy,
        sortDir: filter.sortDir,
      };
      const response = await transactionService.getAll(params);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('Error loading transactions');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilter({ txnTypeCode: '', sortBy: 'txnDate', sortDir: 'desc' });
  };

  const toggleSortDir = () => {
    setFilter((prev) => ({
      ...prev,
      sortDir: prev.sortDir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSortByColumn = (column) => {
    setFilter((prev) => ({
      ...prev,
      sortBy: column,
      sortDir: prev.sortBy === column && prev.sortDir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ column }) => {
    if (filter.sortBy !== column)
      return <span className="ml-1 text-gray-300">↕</span>;
    return (
      <span className="ml-1 text-blue-500">
        {filter.sortDir === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Stock Transactions</h2>
        <button
          onClick={() => navigate('/transactions/create')}
          className="btn-primary"
        >
          + New Transaction
        </button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="card mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Transaction Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Transaction Type
            </label>
            <select
              value={filter.txnTypeCode}
              onChange={(e) => handleFilterChange('txnTypeCode', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
            >
              <option value="">All Types</option>
              <option value="INWARD">Inward</option>
              <option value="OUTWARD">Outward</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Sort By
            </label>
            <select
              value={filter.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
            >
              <option value="txnDate">Date</option>
              <option value="totalQuantity">Total Quantity</option>
              <option value="txnTypeCode">Type</option>
            </select>
          </div>

          {/* Sort Direction */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Order
            </label>
            <button
              onClick={toggleSortDir}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex items-center gap-2 min-w-[140px]"
            >
              <span>{filter.sortDir === 'desc' ? '↓' : '↑'}</span>
              <span>{filter.sortDir === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>

          {/* Reset */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide opacity-0">
              Reset
            </label>
            <button
              onClick={handleReset}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            >
              Reset Filters
            </button>
          </div>

          {/* Active Filter Badge */}
          {filter.txnTypeCode && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide opacity-0">
                Badge
              </label>
              <div className="flex items-center gap-2 px-3 py-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    filter.txnTypeCode === 'INWARD'
                      ? 'bg-green-100 text-green-800'
                      : filter.txnTypeCode === 'OUTWARD'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {filter.txnTypeCode}
                </span>
                <button
                  onClick={() => handleFilterChange('txnTypeCode', '')}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                  title="Clear type filter"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transactions found
            {filter.txnTypeCode && (
              <span className="block text-sm mt-1">
                for type{' '}
                <strong>{filter.txnTypeCode}</strong>
              </span>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSortByColumn('txnDate')}
                  >
                    Date <SortIcon column="txnDate" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSortByColumn('txnTypeCode')}
                  >
                    Type <SortIcon column="txnTypeCode" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reference No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSortByColumn('totalQuantity')}
                  >
                    Total Qty <SortIcon column="totalQuantity" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <tr key={txn.txnId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(txn.txnDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          txn.txnTypeCode === 'INWARD'
                            ? 'bg-green-100 text-green-800'
                            : txn.txnTypeCode === 'OUTWARD'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {txn.txnTypeCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {txn.referenceNo || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {txn.lineCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {txn.totalQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => navigate(`/transactions/${txn.txnId}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Row Count */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
              Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
              {filter.txnTypeCode ? ` · Filtered by: ${filter.txnTypeCode}` : ''}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionsList;
