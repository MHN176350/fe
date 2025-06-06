import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/apis';

const ImportList = () => {
  const { id } = useParams(); 
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImports = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/import/${id}`);
        if (res.data.statusCode === 200) {
          setImports(res.data.data || []);
          setMessage(res.data.message);
        } else {
          setImports([]);
          setError(res.data.message || 'Failed to fetch import list.');
        }
      } catch {
        setImports([]);
        setError('Failed to fetch import list.');
      } finally {
        setLoading(false);
      }
    };
    fetchImports();
  }, [id]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-12">
      <div className="w-full max-w-3xl bg-black/70 p-8 rounded-2xl shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Import Invoices</h2>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : imports.length > 0 ? (
          <table className="w-full text-left bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Created By</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">More</th>
              </tr>
            </thead>
            <tbody>
              {imports.map((imp, idx) => (
                <tr key={imp.id} className="border-t border-gray-700">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{imp.createdBy}</td>
                  <td className="py-2 px-4">{new Date(imp.createdDate).toLocaleString()}</td>
                  <td className="py-2 px-4">{imp.total.toLocaleString('vi-VN')}₫</td>
                  <td className="py-2 px-4">{imp.supplier}</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/import/detail/${imp.id}`}
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
            No Import Invoices Found
          </div>
        )}
        {message && !error && (
          <div className="mt-4 text-green-400 text-center">{message}</div>
        )}
      </div>
    </div>
  );
};

export default ImportList;