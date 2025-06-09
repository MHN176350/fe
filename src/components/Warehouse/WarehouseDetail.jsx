import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/apis';

const WarehouseDetail = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  // Fetch warehouse items
  const fetchItems = async () => {
    try {
      const response = await api.get(`/api/item/storage/${id}`);
      if (response.data.statusCode === 200) {
        setItems(response.data.data || []);
        setMessage(response.data.message);
      } else {
        setError(response.data.message || 'Failed to fetch items.');
      }
    } catch (err) {
      setError('Failed to fetch items.');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [id]);

  // Sort by product name
  const handleSortByProductName = () => {
    setSortAsc(!sortAsc);
    setItems(prev =>
      [...prev].sort((a, b) =>
        sortAsc
          ? a.productName.localeCompare(b.productName)
          : b.productName.localeCompare(a.productName)
      )
    );
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen pt-12">
      <div className="w-full max-w-5xl bg-gray-800 p-8 rounded-2xl shadow-lg mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Warehouse Detail</h2>
          <div className="flex gap-4">
            <Link
              to={`/import/${id}`}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-800 transition"
            >
              View Import Invoices
            </Link>
            <Link
              to={`/export/${id}`}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition"
            >
              View Export Invoices
            </Link>
          </div>
        </div>
        {error && (
          <div className="mb-4 text-red-400 text-center">{error}</div>
        )}
        {items.length > 0 ? (
          <table className="w-full text-left bg-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4">#</th>
                <th
                  className="py-3 px-4 cursor-pointer select-none"
                  onClick={handleSortByProductName}
                >
                  Product Name
                  <span className="ml-1">{sortAsc ? '▲' : '▼'}</span>
                </th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.productName + idx} className="border-t border-gray-600">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{item.productName}</td>
                  <td className="py-2 px-4">
                    {item.productImage && item.productImage !== 'nun' ? (
                      <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">{item.unitPrice?.toLocaleString('vi-VN')}₫</td>
                  <td className="py-2 px-4">{item.totalAmount}</td>
                  <td className="py-2 px-4">{item.createdAt}</td>
                  <td className="py-2 px-4">{item.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !error && (
            <div className="text-4xl text-white/30 font-extrabold text-right w-full select-none pointer-events-none">
              No Items Found
            </div>
          )
        )}
        {message && !error && (
          <div className="mt-4 text-green-400 text-center">{message}</div>
        )}
      </div>
    </div>
  );
};

export default WarehouseDetail;