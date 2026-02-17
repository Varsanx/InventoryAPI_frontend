import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { itemService } from '../../services/itemService';

const ItemStock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStock();
  }, [id]);

  const fetchStock = async () => {
    try {
      const response = await itemService.getStock(id);
      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock:', error);
      alert('Error loading stock data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <button
          onClick={() => navigate('/items')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Items
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Item Stock Details</h2>
      </div>

      <div className="card max-w-2xl">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Item Code</p>
            <p className="text-lg font-medium">{stockData.itemCode}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Item Name</p>
            <p className="text-lg font-medium">{stockData.itemName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">UOM</p>
            <p className="text-lg font-medium">{stockData.uomCode}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Quantity on Hand</p>
              <p className="text-2xl font-bold text-gray-900">{stockData.qtyOnHand}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Minimum Stock Level</p>
              <p className="text-2xl font-bold text-gray-900">{stockData.minStockLevel}</p>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-600">Stock Status</p>
            <p
              className={`text-lg font-bold ${
                stockData.stockStatus === 'OUT OF STOCK'
                  ? 'text-red-600'
                  : stockData.stockStatus === 'LOW STOCK'
                  ? 'text-orange-600'
                  : 'text-green-600'
              }`}
            >
              {stockData.stockStatus}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemStock;
