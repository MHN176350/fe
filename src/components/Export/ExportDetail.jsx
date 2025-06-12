import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/apis';

const ExportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExportDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/export/exportDetail/${id}`);
        if (res.data.statusCode === 200) {
          setDetails(res.data.data || []);
          setMessage(res.data.message);
        } else {
          setDetails([]);
          setError(res.data.message || 'Failed to fetch export detail.');
        }
      } catch {
        setDetails([]);
        setError('Failed to fetch export detail.');
      } finally {
        setLoading(false);
      }
    };
    fetchExportDetail();
  }, [id]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-12">
      <div className="w-full max-w-2xl bg-black/70 p-8 rounded-2xl shadow-lg mt-6 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/export/${id}`)}
          className="absolute left-4 bottom-4 flex items-center justify-center w-24 h-8 rounded-2xl bg-transparent hover:bg-gray-300 transition"
          title="Back to Export List"
        >
          <span className="text-2xl text-gray-200">&#8592;</span>
          <span className="text-gray-200 font-semibold ml-0.5">Back</span>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">Export Invoice Detail</h2>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : details.length > 0 ? (
          <table className="w-full text-left bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Product Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {details.map((item, idx) => (
                <tr key={item.id} className="border-t border-gray-700">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{item.productCode}</td>
                  <td className="py-2 px-4">{item.productName}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">{item.unitPrice?.toLocaleString('vi-VN')}₫</td>
                  <td className="py-2 px-4">{(item.quantity * item.unitPrice).toLocaleString('vi-VN')}₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-4xl text-white/30 font-extrabold text-center select-none pointer-events-none">
            No Details Found
          </div>
        )}
        {message && !error && (
          <div className="mt-4 text-green-400 text-center">{message}</div>
        )}
      </div>
    </div>
  );
};

export default ExportDetail;