import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/apis';

const ImportDetail = () => {
  const { id } = useParams(); // import invoice id
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImportDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/import/importDetail/${id}`);
        if (res.data.statusCode === 200) {
          setDetails(res.data.data || []);
          setMessage(res.data.message);
        } else {
          setDetails([]);
          setError(res.data.message || 'Failed to fetch import detail.');
        }
      } catch {
        setDetails([]);
        setError('Failed to fetch import detail.');
      } finally {
        setLoading(false);
      }
    };
    fetchImportDetail();
  }, [id]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-12">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg mt-6 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/import/${id}`)}
          className="absolute left-4 bottom-4 flex items-center justify-center w-24 h-8 rounded-2xl bg-transparent hover:bg-gray-300 transition"
          title="Back to Import List"
        >
          <span className="text-2xl text-gray-600">&#8592;</span>
          <span className="text-gray-600 font-semibold ml-0.5">Back</span>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Import Invoice Detail</h2>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {loading ? (
          <div className="text-gray-900 text-center">Loading...</div>
        ) : details.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl shadow-lg">
            <table className="w-full text-left bg-gray-50 text-gray-900 rounded-2xl border border-gray-300">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 font-bold">#</th>
                  <th className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 font-bold">Item Name</th>
                  <th className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 font-bold">Item Code</th>
                  <th className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 font-bold">Unit Price</th>
                  <th className="py-3 px-4 border-b border-r border-gray-300 bg-gray-100 font-bold">Quantity</th>
                  <th className="py-3 px-4 border-b border-gray-300 bg-gray-100 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {details.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-200 transition">
                    <td className="py-2 px-4 border-b border-r border-gray-200">{idx + 1}</td>
                    <td className="py-2 px-4 border-b border-r border-gray-200">{item.itemName}</td>
                    <td className="py-2 px-4 border-b border-r border-gray-200">{item.itemCode}</td>
                    <td className="py-2 px-4 border-b border-r border-gray-200">{item.unitPrice?.toLocaleString('vi-VN')}₫</td>
                    <td className="py-2 px-4 border-b border-r border-gray-200">{item.quantity}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{item.total?.toLocaleString('vi-VN')}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-4xl text-gray-400 font-extrabold text-center select-none pointer-events-none">
            No Details Found
          </div>
        )}
        {message && !error && (
          <div className="mt-4 text-green-600 text-center">{message}</div>
        )}
      </div>
    </div>
  );
};

export default ImportDetail;