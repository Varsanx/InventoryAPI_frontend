import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { transactionService } from '../../services/transactionService';
import { itemService } from '../../services/itemService';

const TransactionForm = () => {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState('INWARD');
  const [formData, setFormData] = useState({
    txnDate: new Date().toISOString().split('T')[0],
    referenceNo: '',
    remarks: '',
  });

  const [items, setItems] = useState([]);
  const [lines, setLines] = useState([
    { itemId: '', quantity: '', unitPrice: '', remarks: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await itemService.getAll({ activeOnly: true });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Error loading items. Please refresh the page.');
    }
  };

  const handleAddLine = () => {
    setLines([...lines, { itemId: '', quantity: '', unitPrice: '', remarks: '' }]);
  };

  const handleRemoveLine = (index) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...lines];
    updatedLines[index][field] = value;
    setLines(updatedLines);
  };

  const validateForm = () => {
    // Check if all lines have items and quantities
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].itemId) {
        setError(`Please select an item for line ${i + 1}`);
        return false;
      }
      if (!lines[i].quantity || parseFloat(lines[i].quantity) <= 0) {
        setError(`Please enter a valid quantity for line ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data
      const data = {
        txnDate: formData.txnDate,
        referenceNo: formData.referenceNo || null,
        remarks: formData.remarks || null,
        lines: lines.map((line) => ({
          itemId: parseInt(line.itemId),
          quantity: parseFloat(line.quantity),
          unitPrice: line.unitPrice ? parseFloat(line.unitPrice) : null,
          remarks: line.remarks || null,
        })),
      };

      console.log('Sending transaction data:', data); // Debug log

      let response;
      if (transactionType === 'INWARD') {
        response = await transactionService.createInward(data);
        alert('✅ Inward transaction created successfully!');
      } else if (transactionType === 'OUTWARD') {
        response = await transactionService.createOutward(data);
        alert('✅ Outward transaction created successfully!');
      }

      console.log('Transaction response:', response); // Debug log
      navigate('/transactions');
    } catch (error) {
      console.error('Transaction error details:', error.response || error);
      
      // Extract error message
      let errorMessage = 'Error creating transaction';
      
      if (error.response) {
        // Server responded with error
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.title) {
            errorMessage = error.response.data.title;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      
      // Show specific alert for stock issues
      if (errorMessage.toLowerCase().includes('stock') || 
          errorMessage.toLowerCase().includes('insufficient')) {
        alert(`❌ Stock Error: ${errorMessage}\n\nPlease check item availability and try again.`);
      } else {
        alert(`❌ Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">New Stock Transaction</h2>
      </div>

      <div className="card">
        {error && (
          <div className="mb-4 bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <div>
                <div className="font-medium">Error</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="INWARD"
                  checked={transactionType === 'INWARD'}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">📥 Inward (Stock In)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="OUTWARD"
                  checked={transactionType === 'OUTWARD'}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">📤 Outward (Stock Out)</span>
              </label>
            </div>
            {transactionType === 'OUTWARD' && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                ⚠️ Note: Outward transactions will reduce stock. Make sure items have sufficient quantity.
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Date *
              </label>
              <input
                type="date"
                required
                className="input-field"
                value={formData.txnDate}
                onChange={(e) => setFormData({ ...formData, txnDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., PO-001, REQ-001"
                value={formData.referenceNo}
                onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              className="input-field"
              rows="2"
              placeholder="Optional notes about this transaction"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
          </div>

          {/* Line Items */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Items</h3>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {lines.map((line, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-12 md:col-span-5">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Item * {index + 1}
                      </label>
                      <select
                        required
                        className="input-field text-sm"
                        value={line.itemId}
                        onChange={(e) => handleLineChange(index, 'itemId', e.target.value)}
                      >
                        <option value="">Select Item</option>
                        {items.map((item) => (
                          <option key={item.itemId} value={item.itemId}>
                            {item.itemCode} - {item.itemName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        className="input-field text-sm"
                        placeholder="0.00"
                        value={line.quantity}
                        onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                      />
                    </div>

                    {transactionType === 'INWARD' && (
                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Unit Price
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="input-field text-sm"
                          placeholder="0.00"
                          value={line.unitPrice}
                          onChange={(e) => handleLineChange(index, 'unitPrice', e.target.value)}
                        />
                      </div>
                    )}

                    <div className={`col-span-12 ${transactionType === 'INWARD' ? 'md:col-span-2' : 'md:col-span-4'}`}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Remarks
                      </label>
                      <input
                        type="text"
                        className="input-field text-sm"
                        placeholder="Optional"
                        value={line.remarks}
                        onChange={(e) => handleLineChange(index, 'remarks', e.target.value)}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-1 flex items-end">
                      {lines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(index)}
                          className="w-full text-red-600 hover:text-red-800 text-sm font-medium py-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                `Create ${transactionType} Transaction`
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/transactions')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default TransactionForm;