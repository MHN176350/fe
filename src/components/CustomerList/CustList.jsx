import React, { useEffect, useState } from 'react';
import api from '../../api/apis';

const CustList = () => {
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    email: ''
  });

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
  }, [message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phoneNumber || !form.address || !form.email) {
      setMessage('Please fill all fields.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    try {
      const res = await api.post('/api/cust/create', form);
      setMessage(res.data.message || 'Customer created!');
      setShowModal(false);
      setForm({
        name: '',
        phoneNumber: '',
        address: '',
        email: ''
      });
    } catch {
      setMessage('Failed to create customer.');
      setShowModal(false);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen pt-12 bg-gradient-to-b from-gray-100 to-gray-300">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Customer List</h2>
          <button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-200 text-gray-900 font-semibold shadow-md hover:from-gray-500 hover:to-gray-300 transition"
            onClick={() => setShowModal(true)}
          >
            + Create Customer
          </button>
        </div>
        {error && (
          <div className="mb-4 text-red-400 text-center">{error}</div>
        )}
        {customers.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl shadow-lg">
            <table className="w-full min-w-max table-auto text-left bg-gray-50 text-gray-900 rounded-2xl border border-gray-300">
              <thead>
                <tr>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">#</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Name</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Phone Number</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Address</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Email</th>
                  <th className="border-b border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Points</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust, idx) => (
                  <tr key={cust.id} className="hover:bg-gray-200 transition">
                    <td className="p-4 border-b border-r border-gray-200">{idx + 1}</td>
                    <td className="p-4 border-b border-r border-gray-200">{cust.name}</td>
                    <td className="p-4 border-b border-r border-gray-200">{cust.phoneNumber}</td>
                    <td className="p-4 border-b border-r border-gray-200">{cust.address}</td>
                    <td className="p-4 border-b border-r border-gray-200">{cust.email}</td>
                    <td className="p-4 border-b border-gray-200">{cust.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !error && (
            <div className="text-4xl text-gray-400 font-extrabold text-center w-full select-none pointer-events-none">
              No Customers Found
            </div>
          )
        )}
        {message && !error && (
          <div className="mt-4 text-green-600 text-center">{message}</div>
        )}
      </div>

      {/* Popup Modal for Create Customer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60">
          <form
            onSubmit={handleSubmit}
            className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center"
          >
            <h3 className="text-2xl font-bold mb-6">Create Customer</h3>
            <div className="mb-4 w-full">
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="mb-6 w-full">
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="flex w-full justify-between">
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-500 text-white font-semibold hover:from-gray-800 hover:to-gray-600 transition"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustList;