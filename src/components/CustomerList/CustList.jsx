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
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen pt-12">
      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-lg mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold mb-6">Customer List</h2>
          <button
            className="px-6 py-2 rounded-full bg-black text-white border border-white font-semibold shadow-md hover:bg-white hover:text-black transition"
            onClick={() => setShowModal(true)}
          >
            + Create Customer
          </button>
        </div>
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
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Points</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust, idx) => (
                <tr key={cust.id} className="border-t border-gray-600">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{cust.name}</td>
                  <td className="py-2 px-4">{cust.phoneNumber}</td>
                  <td className="py-2 px-4">{cust.address}</td>
                  <td className="py-2 px-4">{cust.email}</td>
                  <td className="py-2 px-4">{cust.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !error && (
            <div className="text-4xl text-white/30 font-extrabold text-center w-full select-none pointer-events-none">
              No Customers Found
            </div>
          )
        )}
        {message && !error && (
          <div className="mt-4 text-green-400 text-center">{message}</div>
        )}
      </div>

      {/* Popup Modal for Create Customer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <form
            onSubmit={handleSubmit}
            className="bg-white text-gray-500 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center"
          >
            <h3 className="text-2xl font-bold mb-6 hover:bg">Create Customer</h3>
            <div className="mb-4 w-full">
              <label className="block mb-2 font-semibold" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-500 text-white border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block mb-2 font-semibold" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded  bg-gray-500 text-white border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block mb-2 font-semibold" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-500 text-white border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="mb-6 w-full">
              <label className="block mb-2 font-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded  bg-gray-500 text-white border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex w-full justify-between">
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-black text-white border border-black font-semibold hover:bg-white hover:text-red-400 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-black text-white border border-black font-semibold hover:bg-white hover:text-green-300 transition"
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