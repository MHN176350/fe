import React, { useEffect, useState } from 'react';
import api from '../../api/apis';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phoneNumber: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/api/supplier/getsup');
      if (response.data.statusCode === 200) {
        setSuppliers(response.data.data || []);
        setMessage(response.data.message);
      } else {
        setError(response.data.message || 'Failed to fetch suppliers.');
      }
    } catch (err) {
      setError('Failed to fetch suppliers.');
    }
  };

  // Modal open/close logic
  const openModal = () => {
    setModalVisible(true);
    setTimeout(() => setShowModal(true), 10);
  };
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setModalVisible(false), 200);
    setForm({ name: '', address: '', phoneNumber: '' });
  };

  // Form change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Phone number validation (simple: only digits, length 8-15)
  const isValidPhone = (phone) => /^[0-9]{8,15}$/.test(phone);

  // Submit new supplier
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPhone(form.phoneNumber)) {
      setMessage('Phone number must be 8-15 digits.');
      setTimeout(() => setMessage(''), 4000);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/api/supplier/create',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      closeModal();
      fetchSuppliers();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to add supplier.');
      closeModal();
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen pt-12 bg-gradient-to-b from-gray-100 to-gray-300">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg mt-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
          <button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-200 text-gray-900 font-semibold shadow-md hover:from-gray-500 hover:to-gray-300 transition"
            onClick={openModal}
          >
            Add Supplier
          </button>
        </div>
        {error && (
          <div className="mb-4 text-red-400 text-center">{error}</div>
        )}
        {suppliers.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl shadow-lg">
            <table className="w-full min-w-max table-auto text-left bg-gray-50 text-gray-900 rounded-2xl border border-gray-300">
              <thead>
                <tr>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">#</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Name</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Phone Number</th>
                  <th className="border-b border-r border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Address</th>
                  <th className="border-b border-gray-300 p-4 bg-gray-100 text-gray-900 text-left font-bold">Added Date</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((sup, idx) => (
                  <tr key={sup.name + idx} className="hover:bg-gray-200 transition">
                    <td className="p-4 border-b border-r border-gray-200">{idx + 1}</td>
                    <td className="p-4 border-b border-r border-gray-200">{sup.name}</td>
                    <td className="p-4 border-b border-r border-gray-200">{sup.phoneNumber}</td>
                    <td className="p-4 border-b border-r border-gray-200">{sup.address}</td>
                    <td className="p-4 border-b border-gray-200">{sup.addedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !error && (
            <div className="text-4xl text-gray-400 font-extrabold text-center w-full select-none pointer-events-none">
              No Suppliers Found
            </div>
          )
        )}
        {message && !error && (
          <div className="mt-4 text-green-600 text-center">{message}</div>
        )}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div
          className={`
            fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-60
            transition-opacity duration-200
            ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-6 text-gray-900">Add Supplier</h3>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 mb-2" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="mb-6 w-full">
              <label className="block text-gray-700 mb-2" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{8,15}"
                title="Phone number must be 8-15 digits"
                className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="flex w-full justify-between">
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-gray-300 text-gray-700 font-semibold mr-2 hover:bg-gray-400 transition"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-500 text-white font-semibold hover:from-gray-800 hover:to-gray-600 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Supplier;