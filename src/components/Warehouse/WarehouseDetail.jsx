import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import api from '../../api/apis';

const WarehouseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Add this line
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
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen pt-12 bg-gradient-to-b from-gray-100 to-gray-300">
      
      <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-lg mt-6 relative">
        <button
          onClick={() => navigate(`/warehouses`)}
          className="absolute left-4 bottom-4 flex items-center justify-center w-24 h-8 rounded-2xl bg-transparent hover:bg-gray-300  transition"
          title="Back to Warehouse Detail"
        >
          <span className="text-2xl text-gray-600">&#8592;</span> <d
          className="text-gray-600 font-semibold ml-0.5">Back</d>
        </button>
        <div className="flex justify-between items-center mb-6">
          
          <h2 className="text-2xl font-bold text-gray-900">Warehouse Detail</h2>
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
          <div className="overflow-x-auto rounded-2xl shadow-lg">
            <table className="w-full min-w-max table-auto text-left bg-gray-50 text-gray-900 rounded-2xl border border-gray-300">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 text-gray-900 font-bold">#</th>
                  <th
                    className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 text-gray-900 font-bold cursor-pointer select-none"
                    onClick={handleSortByProductName}
                  >
                    Product Name
                    <span className="ml-1">{sortAsc ? '▲' : '▼'}</span>
                  </th>
                  <th className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 text-gray-900 font-bold">Image</th>
                  <th className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 text-gray-900 font-bold">Quantity</th>
                  <th className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 text-gray-900 font-bold">Price</th>
                  <th className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 text-gray-900 font-bold">Total Amount</th>
                  <th className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 text-gray-900 font-bold">Created</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 text-gray-900 font-bold">Updated</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.productName + idx} className="hover:bg-gray-200 transition">
                    <td className="py-2 px-4 border-b border-r border-gray-200">{idx + 1}</td>
                    <td className="py-2 px-4 border-b border-r border-gray-200">{item.productName}</td>
                    <td className="py-2 px-4 border-b border-r border-gray-200">
                      {item.productImage && item.productImage !== 'nun' ? (
                        <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <span className="text-gray-400 italic">No Image</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-r border-gray-200">{item.quantity}</td>
                    <td className="py-2 px-4 border-b border-r border-gray-200">{item.unitPrice?.toLocaleString('vi-VN')}₫</td>
                    <td className="py-2 px-4 border-b border-r border-gray-200">{item.totalAmount}</td>
                    <td className="py-2 px-4 border-b border-r border-gray-200">{item.createdAt}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{item.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !error && (
            <div className="text-4xl text-gray-400 font-extrabold text-right w-full select-none pointer-events-none">
              No Items Found
            </div>
          )
        )}
        {message && !error && (
          <div className="mt-4 text-green-600 text-center">{message}</div>
        )}
      </div>
    </div>
  );
};

export default WarehouseDetail;