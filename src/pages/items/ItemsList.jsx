import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { itemService } from '../../services/itemService';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    status: '',        // '' = All, 'true' = Active, 'false' = Inactive
    category: '',      // category name filter
    stockLevel: '',    // '' = All, 'low' = Low Stock, 'out' = Out of Stock, 'ok' = OK
    sortBy: 'itemCode',
    sortDir: 'asc',
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...(search && { search }),
        ...(filter.status !== '' && { status: filter.status }),
        ...(filter.category && { category: filter.category }),
        sortBy: filter.sortBy,
        sortDir: filter.sortDir,
      };
      const response = await itemService.getAll(params);
      const data = response.data;
      setItems(data);

      // Extract unique categories for the filter dropdown
      const uniqueCategories = [...new Set(data.map((i) => i.categoryName).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Error loading items');
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSearch('');
    setFilter({
      status: '',
      category: '',
      stockLevel: '',
      sortBy: 'itemCode',
      sortDir: 'asc',
    });
  };

  const handleSortByColumn = (column) => {
    setFilter((prev) => ({
      ...prev,
      sortBy: column,
      sortDir: prev.sortBy === column && prev.sortDir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = async (id, itemCode) => {
    if (!window.confirm(`Are you sure you want to delete ${itemCode}?`)) return;
    try {
      await itemService.delete(id);
      alert('Item deleted successfully');
      fetchItems();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting item');
    }
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

  // Client-side stock level filter (since stock comes from joined data)
  const filteredItems = items.filter((item) => {
    if (filter.stockLevel === 'out') return (item.qtyOnHand ?? 0) === 0;
    if (filter.stockLevel === 'low')
      return (item.qtyOnHand ?? 0) > 0 && (item.qtyOnHand ?? 0) < item.minStockLevel;
    if (filter.stockLevel === 'ok') return (item.qtyOnHand ?? 0) >= item.minStockLevel;
    return true;
  });

  const activeFiltersCount = [
    filter.status !== '',
    filter.category !== '',
    filter.stockLevel !== '',
    search !== '',
  ].filter(Boolean).length;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Items Management</h2>
        <button
          onClick={() => navigate('/items/create')}
          className="btn-primary"
        >
          + Add New Item
        </button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="card mb-4 p-4">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by item code or name..."
            className="input-field w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Category
            </label>
            <select
              value={filter.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Stock Level Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Stock Level
            </label>
            <select
              value={filter.stockLevel}
              onChange={(e) => handleFilterChange('stockLevel', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="">All Stock Levels</option>
              <option value="out">Out of Stock</option>
              <option value="low">Low Stock</option>
              <option value="ok">OK</option>
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
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="itemCode">Item Code</option>
              <option value="itemName">Item Name</option>
              <option value="categoryName">Category</option>
              <option value="qtyOnHand">Stock Qty</option>
              <option value="minStockLevel">Min Level</option>
            </select>
          </div>

          {/* Sort Direction */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Order
            </label>
            <button
              onClick={() =>
                handleFilterChange('sortDir', filter.sortDir === 'asc' ? 'desc' : 'asc')
              }
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex items-center gap-2 min-w-[120px]"
            >
              <span>{filter.sortDir === 'asc' ? '↑' : '↓'}</span>
              <span>{filter.sortDir === 'asc' ? 'A → Z' : 'Z → A'}</span>
            </button>
          </div>

          {/* Reset */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide opacity-0">
              Reset
            </label>
            <button
              onClick={handleReset}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 transition flex items-center gap-2"
            >
              Reset
              {activeFiltersCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No items found
            {activeFiltersCount > 0 && (
              <span className="block text-sm mt-1">
                Try adjusting your filters or{' '}
                <button onClick={handleReset} className="text-blue-500 underline">
                  reset all
                </button>
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
                    onClick={() => handleSortByColumn('itemCode')}
                  >
                    Item Code <SortIcon column="itemCode" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSortByColumn('itemName')}
                  >
                    Item Name <SortIcon column="itemName" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSortByColumn('categoryName')}
                  >
                    Category <SortIcon column="categoryName" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    UOM
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSortByColumn('qtyOnHand')}
                  >
                    Stock Qty <SortIcon column="qtyOnHand" />
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSortByColumn('minStockLevel')}
                  >
                    Min Level <SortIcon column="minStockLevel" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSortByColumn('status')}
                  >
                    Status <SortIcon column="status" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.itemId} className={`hover:bg-gray-50 ${!item.status ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.itemCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.uomCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span
                        className={`font-bold ${
                          (item.qtyOnHand ?? 0) === 0
                            ? 'text-red-600'
                            : (item.qtyOnHand ?? 0) < item.minStockLevel
                            ? 'text-orange-500'
                            : 'text-green-600'
                        }`}
                      >
                        {item.qtyOnHand != null ? Math.round(item.qtyOnHand) : 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                      {item.minStockLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
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
                      <button
                        onClick={() => navigate(`/items/${item.itemId}/stock`)}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Stock
                      </button>
                      <button
                        onClick={() => handleDelete(item.itemId, item.itemCode)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
              <span>
                Showing {filteredItems.length} of {items.length} item{items.length !== 1 ? 's' : ''}
              </span>
              <span className="flex gap-3">
                <span className="text-red-500">● Out of Stock: {items.filter(i => (i.qtyOnHand ?? 0) === 0).length}</span>
                <span className="text-orange-500">● Low Stock: {items.filter(i => (i.qtyOnHand ?? 0) > 0 && (i.qtyOnHand ?? 0) < i.minStockLevel).length}</span>
                <span className="text-green-600">● OK: {items.filter(i => (i.qtyOnHand ?? 0) >= i.minStockLevel).length}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ItemsList;
