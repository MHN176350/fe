import React, { useEffect, useState } from 'react';
import api from '../../api/apis';

const CustList = () => {
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/api/cust/getall');
        if (response.data.statusCode === 200) {
          setCustomers(response.data.data || []);
          setMessage(response.data.message);
        } else {
          setError(response.data.message || 'Failed to fetch customers.');
        }
      } catch (err) {
        setError('Failed to fetch customers.');
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen pt-12">
      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-6">Customer List</h2>
        {error && (
          <div className="mb-4 text-red-400 text-center">{error}</div>
        )}
        {customers.length > 0 ? (
          <table className="w-full text-left bg-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Points</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust, idx) => (
                <tr key={cust.id} className="border-t border-gray-600">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{cust.name}</td>
                  <td className="py-2 px-4">{cust.phoneNumber}</td>
                  <td className="py-2 px-4">{cust.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !error && (
            <div className="text-4xl text-white/30 font-extrabold text-right w-full select-none pointer-events-none">
              No Customers Found
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

export default CustList;