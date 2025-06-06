import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/apis';

const ExportList = () => {
  const { id } = useParams(); // warehouse id
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExports = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/export/${id}`);
        if (res.data.statusCode === 200) {
          setExports(res.data.data || []);
          setMessage(res.data.message);
        } else {
          setExports([]);
          setError(res.data.message || 'Failed to fetch export list.');
        }
      } catch {
        setExports([]);
        setError('Failed to fetch export list.');
      } finally {
        setLoading(false);
      }
    };
    fetchExports();
  }, [id]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-12">
      <div className="w-full max-w-3xl bg-black/70 p-8 rounded-2xl shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Export Invoices</h2>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : exports.length > 0 ? (
          <table className="w-full text-left bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Created By</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">More</th>
              </tr>
            </thead>
            <tbody>
              {exports.map((exp, idx) => (
                <tr key={exp.id} className="border-t border-gray-700">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{exp.customerName}</td>
                  <td className="py-2 px-4">{exp.discount?.toLocaleString('vi-VN')}₫</td>
                  <td className="py-2 px-4">{exp.total?.toLocaleString('vi-VN')}₫</td>
                  <td className="py-2 px-4">{exp.createdBy}</td>
                  <td className="py-2 px-4">{new Date(exp.createdDate).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/export/${exp.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      Show Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-4xl text-white/30 font-extrabold text-center select-none pointer-events-none">
            No Export Invoices Found
          </div>
        )}
        {message && !error && (
          <div className="mt-4 text-green-400 text-center">{message}</div>
        )}
      </div>
    </div>
  );
};

export default ExportList;