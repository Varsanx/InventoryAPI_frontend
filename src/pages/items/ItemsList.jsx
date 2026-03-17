import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Layout from '../../components/layout/Layout';
import { useLanguage } from '../../contexts/LanguageContext';


const ItemsList = () => {
  const { t } = useLanguage(); 
  
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
      filtered = filtered.filter(item => 
        item.categoryId === parseInt(categoryFilter)
      );
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

        {/* ✅ STICKY FILTER SECTION */}
        <div className="bg-white shadow-md rounded-lg mb-6 sticky top-16 z-30">
          {/* Search Bar */}
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search by item code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filters Row */}
          <div className="p-4 grid grid-cols-5 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                STATUS
              </label>
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

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                CATEGORY
              </label>
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

            {/* Stock Level */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                STOCK LEVEL
              </label>
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

            {/* Sort By */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                SORT BY
              </label>
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

            {/* Order & Reset */}
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

        {/* ✅ TABLE WITH STICKY HEADER */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* ✅ STICKY TABLE HEADER */}
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Item Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      UOM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Stock Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Min Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.itemId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.itemCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.categoryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.uomCode}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStockColor(item.qtyOnHand || 0, item.minStockLevel)}`}>
                        {Math.round(item.qtyOnHand || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.minStockLevel}
                      </td>
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
                        >
                          Edit
                        </button>
                        <button className="text-green-600 hover:text-green-800 font-medium">
                          Stock
                        </button>
                        <button className="text-red-600 hover:text-red-800 font-medium">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Items Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>
    </Layout>
  );
};

export default ItemsList;