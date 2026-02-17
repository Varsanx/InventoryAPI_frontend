import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { transactionService } from '../../services/transactionService';

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching transaction:', id);
      const response = await transactionService.getById(id);
      console.log('Transaction response:', response.data);
      
      setTransaction(response.data);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.error
        || 'Error loading transaction';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transaction details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="mb-6">
          <button
            onClick={() => navigate('/transactions')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Transactions
          </button>
        </div>
        <div className="card bg-red-50 border border-red-200">
          <div className="text-red-700">
            <h3 className="text-lg font-bold mb-2">Error Loading Transaction</h3>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!transaction) {
    return (
      <Layout>
        <div className="text-center py-8 text-gray-500">
          Transaction not found
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <button
          onClick={() => navigate('/transactions')}
          className="text-blue-600 hover:text-blue-800 mb-4 font-medium"
        >
          ← Back to Transactions
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
      </div>

      <div className="card">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Transaction Type</p>
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                transaction.txnTypeCode === 'INWARD'
                  ? 'bg-green-100 text-green-800'
                  : transaction.txnTypeCode === 'OUTWARD'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {transaction.txnTypeDescription || transaction.txnTypeCode}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Transaction Date</p>
            <p className="text-lg font-medium">
              {new Date(transaction.txnDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Reference Number</p>
            <p className="text-lg font-medium">
              {transaction.referenceNo || '-'}
            </p>
          </div>
        </div>

        {transaction.remarks && (
          <div className="pb-6 border-b mb-6">
            <p className="text-sm text-gray-600 mb-1">Remarks</p>
            <p className="text-gray-900">{transaction.remarks}</p>
          </div>
        )}

        {/* Line Items */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Items ({transaction.lineCount || transaction.lines?.length || 0})
          </h3>

          {!transaction.lines || transaction.lines.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No items found in this transaction</p>
              <p className="text-sm text-gray-400 mt-2">
                Transaction ID: {transaction.txnId}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      UOM
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transaction.lines.map((line, index) => (
                    <tr key={line.lineId || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {line.itemCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {line.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {line.uomCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                        {line.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {line.unitPrice ? `₹${line.unitPrice.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                        {line.totalAmount ? `₹${line.totalAmount.toFixed(2)}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Debug Info (Remove this in production) */}
        <div className="mt-6 pt-6 border-t">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">Debug Info</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(transaction, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionDetails;

