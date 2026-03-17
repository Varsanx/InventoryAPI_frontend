import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Layout from '../../components/layout/Layout';

// ✅ STOCK DETAILS MODAL COMPONENT
const StockDetailsModal = ({ item, onClose }) => {
  if (!item) return null;

  const stockPercentage = item.minStockLevel > 0 
    ? Math.min(100, Math.round((item.qtyOnHand / item.minStockLevel) * 100))
    : 0;

  const getStockStatus = () => {
    if (item.qtyOnHand === 0) return { text: 'OUT OF STOCK', color: 'text-red-600', bg: 'bg-red-100' };
    if (item.qtyOnHand < item.minStockLevel) return { text: 'LOW STOCK', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'IN STOCK', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const status = getStockStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Stock Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Item Info */}
          <div className="mb-4">
            <div className="text-sm text-gray-500">Item Code</div>
            <div className="text-lg font-semibold text-gray-900">{item.itemCode}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500">Item Name</div>
            <div className="text-base font-medium text-gray-900">{item.itemName}</div>
          </div>

          {/* Stock Status Badge */}
          <div className="mb-4">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${status.bg} ${status.color}`}>
              {status.text}
            </span>
          </div>

          {/* Stock Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-xs text-blue-600 font-medium mb-1">Current Stock</div>
              <div className="text-2xl font-bold text-blue-700">{Math.round(item.qtyOnHand || 0)}</div>
              <div className="text-xs text-blue-500 mt-1">{item.uomCode}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 font-medium mb-1">Minimum Level</div>
              <div className="text-2xl font-bold text-gray-700">{item.minStockLevel}</div>
              <div className="text-xs text-gray-500 mt-1">{item.uomCode}</div>
            </div>
          </div>

          {/* Stock Level Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Stock Level</span>
              <span className="text-sm font-semibold text-gray-900">{stockPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  item.qtyOnHand === 0
                    ? 'bg-red-500'
                    : item.qtyOnHand < item.minStockLevel
                    ? 'bg-orange-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
          </div>

          {/* Shortage/Surplus */}
          {item.qtyOnHand < item.minStockLevel && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-red-700">Shortage Alert</div>
                  <div className="text-xs text-red-600">
                    Need {Math.round(item.minStockLevel - item.qtyOnHand)} {item.uomCode} more to reach minimum level
                  </div>
                </div>
              </div>
            </div>
          )}

          {item.qtyOnHand >= item.minStockLevel && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-green-700">Stock Sufficient</div>
                  <div className="text-xs text-green-600">
                    {item.qtyOnHand > item.minStockLevel 
                      ? `${Math.round(item.qtyOnHand - item.minStockLevel)} ${item.uomCode} above minimum level`
                      : 'At minimum stock level'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 font-medium text-gray-900">{item.categoryName}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className={`ml-2 font-medium ${item.status ? 'text-green-600' : 'text-red-600'}`}>
                  {item.status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ItemsList = () => {
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null); // ✅ For stock modal

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('itemCode');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, searchTerm, statusFilter, categoryFilter, stockFilter, sortBy, sortOrder]);

  const fetchItems = async () => {
    try {
      const response = await api.get('/Items');
      console.log('Items fetched:', response.data);
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/Categories');
      console.log('Categories fetched:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => 
        statusFilter === 'active' ? item.status : !item.status
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => {
        const selectedCategory = categories.find(cat => cat.categoryId === parseInt(categoryFilter));
        return item.categoryName === selectedCategory?.categoryName;
      });
    }

    if (stockFilter !== 'all') {
      filtered = filtered.filter(item => {
        const stockQty = item.qtyOnHand || 0;
        if (stockFilter === 'low') return stockQty > 0 && stockQty < item.minStockLevel;
        if (stockFilter === 'out') return stockQty === 0;
        if (stockFilter === 'available') return stockQty >= item.minStockLevel;
        return true;
      });
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredItems(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setStockFilter('all');
    setSortBy('itemCode');
    setSortOrder('asc');
  };

  const getStockColor = (qty, minLevel) => {
    if (qty === 0) return 'text-red-600 font-bold';
    if (qty < minLevel) return 'text-orange-600 font-semibold';
    return 'text-green-600';
  };

  // ✅ UPDATED STOCK BUTTON - SHOWS MODAL
  const handleStockClick = (item) => {
    setSelectedItem(item);
  };

  // ✅ UPDATED DELETE FUNCTION - REMOVES FROM UI IMMEDIATELY
  const handleDelete = async (itemId, itemName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${itemName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/Items/${itemId}`);
      
      // ✅ IMMEDIATELY REMOVE FROM STATE (UI updates instantly)
      setItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
      
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      if (error.response?.status === 400) {
        alert('Cannot delete this item. It may have associated transactions.');
      } else {
        alert('Error deleting item. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-full px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Items Management</h2>
          <button
            onClick={() => navigate('/items/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add New Item
          </button>
        </div>

        {/* STICKY FILTER SECTION */}
        <div className="bg-white shadow-md rounded-lg mb-6 sticky top-16 z-30">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search by item code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="p-4 grid grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">STATUS</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">CATEGORY</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">STOCK LEVEL</label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Stock Levels</option>
                <option value="available">Available</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">SORT BY</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="itemCode">Item Code</option>
                <option value="itemName">Item Name</option>
                <option value="qtyOnHand">Stock Qty</option>
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                {sortOrder === 'asc' ? '↑ A → Z' : '↓ Z → A'}
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* TABLE WITH STICKY HEADER */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Item Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">UOM</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Stock Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Min Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        <div className="text-4xl mb-2">📦</div>
                        <div className="text-lg font-medium">No items found</div>
                        <div className="text-sm mt-1">
                          {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || stockFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Add your first item to get started'}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.itemId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.itemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.categoryName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.uomCode}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStockColor(item.qtyOnHand || 0, item.minStockLevel)}`}>
                          {Math.round(item.qtyOnHand || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.minStockLevel}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button
                            onClick={() => navigate(`/items/edit/${item.itemId}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            title="Edit Item"
                          >
                            Edit
                          </button>
                          
                          <button 
                            onClick={() => handleStockClick(item)}
                            className="text-green-600 hover:text-green-800 font-medium"
                            title="View Stock Details"
                          >
                            Stock
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(item.itemId, item.itemName)}
                            className="text-red-600 hover:text-red-800 font-medium"
                            title="Delete Item"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </div>

        {/* ✅ STOCK DETAILS MODAL */}
        {selectedItem && (
          <StockDetailsModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </div>
    </Layout>
  );
};

export default ItemsList;