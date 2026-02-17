import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { itemService } from '../../services/itemService';
import { categoryService } from '../../services/categoryService';
import { uomService } from '../../services/uomService';

const ItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    categoryId: '',
    uomId: '',
    minStockLevel: 0,
    status: true,
  });

  const [categories, setCategories] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDropdownData();
    if (isEdit) {
      fetchItem();
    }
  }, [id]);

  const fetchDropdownData = async () => {
    try {
      const [categoriesRes, uomsRes] = await Promise.all([
        categoryService.getAll(),
        uomService.getAll(),
      ]);
      setCategories(categoriesRes.data);
      setUoms(uomsRes.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const fetchItem = async () => {
    try {
      const response = await itemService.getById(id);
      setFormData({
        itemCode: response.data.itemCode,
        itemName: response.data.itemName,
        categoryId: response.data.categoryId,
        uomId: response.data.uomId,
        minStockLevel: response.data.minStockLevel,
        status: response.data.status,
      });
    } catch (error) {
      console.error('Error fetching item:', error);
      alert('Error loading item');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        uomId: parseInt(formData.uomId),
        minStockLevel: parseFloat(formData.minStockLevel),
        createdBy: 1, // TODO: Get from auth context
      };

      if (isEdit) {
        await itemService.update(id, { ...data, itemId: parseInt(id) });
        alert('Item updated successfully');
      } else {
        await itemService.create(data);
        alert('Item created successfully');
      }
      navigate('/items');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Item' : 'Add New Item'}
        </h2>
      </div>

      <div className="card max-w-2xl">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Code *
            </label>
            <input
              type="text"
              name="itemCode"
              required
              className="input-field"
              value={formData.itemCode}
              onChange={handleChange}
              disabled={isEdit}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              name="itemName"
              required
              className="input-field"
              value={formData.itemName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="categoryId"
              required
              className="input-field"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit of Measure *
            </label>
            <select
              name="uomId"
              required
              className="input-field"
              value={formData.uomId}
              onChange={handleChange}
            >
              <option value="">Select UOM</option>
              {uoms.map((uom) => (
                <option key={uom.uomId} value={uom.uomId}>
                  {uom.uomCode} - {uom.uomDescription}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Stock Level *
            </label>
            <input
              type="number"
              name="minStockLevel"
              required
              min="0"
              step="0.01"
              className="input-field"
              value={formData.minStockLevel}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="status"
              id="status"
              className="mr-2"
              checked={formData.status}
              onChange={handleChange}
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Item' : 'Create Item'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/items')}
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

export default ItemForm;
