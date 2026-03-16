import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Layout from '../../components/layout/Layout';

const AdjustmentForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    txnDate: new Date().toISOString().split('T')[0],
    referenceNo: `ADJ-${Date.now()}`,
    remarks: '',
  });

  const [items, setItems] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch items and reasons on mount
  useEffect(() => {
    fetchItems();
    fetchReasons();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/Items');
      setAllItems(response.data.filter(item => item.status));
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Error loading items');
    }
  };

  const fetchReasons = async () => {
    try {
      const response = await api.get('/Adjustment/Reasons');
      setReasons(response.data);
    } catch (error) {
      console.error('Error fetching reasons:', error);
      alert('Error loading adjustment reasons');
    }
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        itemId: '',
        quantity: '',
        adjustmentType: 'DECREASE',
        adjustmentReasonId: '',
        remarks: '',
        itemName: '',
        currentStock: 0
      }
    ]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = async (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // If item is selected, get its details
    if (field === 'itemId' && value) {
      const selectedItem = allItems.find(item => item.itemId === parseInt(value));
      if (selectedItem) {
        newItems[index].itemName = selectedItem.itemName;
        newItems[index].currentStock = selectedItem.qtyOnHand || 0;
      }
    }

    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (items.length === 0) {
      alert('Please add at least one item to adjust');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.itemId || !item.quantity || !item.adjustmentReasonId) {
        alert(`Please fill all fields for item ${i + 1}`);
        return;
      }

      if (parseFloat(item.quantity) <= 0) {
        alert(`Quantity must be greater than 0 for item ${i + 1}`);
        return;
      }

      // Check if decrease exceeds current stock
      if (item.adjustmentType === 'DECREASE' && parseFloat(item.quantity) > item.currentStock) {
        alert(`Cannot decrease by ${item.quantity}. Current stock is only ${item.currentStock} for ${item.itemName}`);
        return;
      }
    }

    setLoading(true);

    try {
      const adjustmentData = {
        txnDate: formData.txnDate,
        referenceNo: formData.referenceNo,
        remarks: formData.remarks,
        createdBy: user.userId,
        items: items.map(item => ({
          itemId: parseInt(item.itemId),
          quantity: parseFloat(item.quantity),
          adjustmentType: item.adjustmentType,
          adjustmentReasonId: parseInt(item.adjustmentReasonId),
          remarks: item.remarks
        }))
      };

      console.log('Submitting adjustment:', adjustmentData);

      const response = await api.post('/Adjustment/Create', adjustmentData);

      alert(`✅ ${response.data.message}`);
      navigate('/transactions');
    } catch (error) {
      console.error('Error creating adjustment:', error);
      alert(error.response?.data?.message || 'Error creating adjustment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Stock Adjustment</h2>

          <form onSubmit={handleSubmit}>
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.txnDate}
                  onChange={(e) => setFormData({ ...formData, txnDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference No *
                </label>
                <input
                  type="text"
                  value={formData.referenceNo}
                  onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ADJ-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional remarks"
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Items to Adjust</h3>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + Add Item
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No items added. Click "Add Item" to start.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        {/* Item Selection */}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Item *
                          </label>
                          <select
                            value={item.itemId}
                            onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select Item</option>
                            {allItems.map((dbItem) => (
                              <option key={dbItem.itemId} value={dbItem.itemId}>
                                {dbItem.itemCode} - {dbItem.itemName} (Stock: {dbItem.qtyOnHand || 0})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Adjustment Type */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Type *
                          </label>
                          <select
                            value={item.adjustmentType}
                            onChange={(e) => updateItem(index, 'adjustmentType', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="DECREASE">Decrease (-)</option>
                            <option value="INCREASE">Increase (+)</option>
                          </select>
                        </div>

                        {/* Quantity */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            step="0.01"
                            min="0.01"
                            required
                          />
                          {item.currentStock > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Current: {item.currentStock}
                            </p>
                          )}
                        </div>

                        {/* Reason */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Reason *
                          </label>
                          <select
                            value={item.adjustmentReasonId}
                            onChange={(e) => updateItem(index, 'adjustmentReasonId', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select Reason</option>
                            {reasons.map((reason) => (
                              <option key={reason.reasonId} value={reason.reasonId}>
                                {reason.reasonText}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Remarks */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Remarks
                          </label>
                          <input
                            type="text"
                            value={item.remarks}
                            onChange={(e) => updateItem(index, 'remarks', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="Optional"
                          />
                        </div>

                        {/* Remove Button */}
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeItemRow(index)}
                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/transactions')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                  loading || items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating...' : '✅ Create Adjustment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdjustmentForm;
