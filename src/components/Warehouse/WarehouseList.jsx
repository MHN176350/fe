import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/apis';
import { useAuth } from '../../hooks/useAuth';


const WarehouseList = ({ user, showModal, setShowModal }) => {
  useAuth('/');
  const [modalVisible, setModalVisible] = useState(false);
  const [warehouse, setWarehouse] = useState({ location: '', code: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [warehouses, setWarehouses] = useState([]);


  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await api.get('/api/warehouse/getall');
      if (response.data.statusCode === 200) {
        setWarehouses(response.data.data || []);
        setMessage('');
      } else {
        setWarehouses([]);
        setMessage(response.data.message || 'Failed to fetch warehouses.');
      }
    } catch (err) {
      setWarehouses([]);
      setMessage('Failed to fetch warehouses.');
    }
  };

  // Open modal with animation
  const openModal = () => {
    setModalVisible(true);
    setTimeout(() => setShowModal(true), 10);
  };

  // Close modal with fade-out animation
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setModalVisible(false), 200);
  };

  const handleWarehouseChange = (e) => {
    setWarehouse({ ...warehouse, [e.target.name]: e.target.value });
  };

  const handleWarehouseSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/api/warehouse/create',
        warehouse,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      closeModal();
      setWarehouse({ location: '', code: '' });
      fetchWarehouses();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to add warehouse.');
      closeModal();
      setTimeout(() => setMessage(''), 4000);
    }
  };

  // Optionally, you can fetch warehouse items here or in the detail page

  return (
    <>
      <div className={`flex-1 flex flex-col items-center justify-center ${modalVisible ? 'filter blur-sm pointer-events-none' : ''}`}>
        <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-4xl mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Warehouses</h2>
            <button
              className="px-6 py-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-200 text-gray-900 font-semibold shadow-md hover:from-gray-500 hover:to-gray-300 transition"
              onClick={openModal}
            >
              Add Warehouse
            </button>
          </div>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          {message && (
            <div className="mb-4 text-gray-900">{message}</div>
          )}
          <div className="overflow-x-auto rounded-2xl shadow-lg">
            <table className="min-w-full bg-white text-gray-900 rounded-2xl border border-gray-300">
              <thead>
                <tr>
                  <th className="py-3 px-4 bg-gray-100 border-b border-r border-gray-300 font-bold">#</th>
                  <th className="py-3 px-4 bg-gray-100 border-b border-r border-gray-300 font-bold">Code</th>
                  <th className="py-3 px-4 bg-gray-100 border-b border-r border-gray-300 font-bold">Location</th>
                  <th className="py-3 px-4 bg-gray-100 border-b border-r border-gray-300 font-bold">Products</th>
                  <th className="py-3 px-4 bg-gray-100 border-b border-r border-gray-300 font-bold">Owner</th>
                  <th className="py-3 px-4 bg-gray-100 border-b border-r border-gray-300 font-bold">Created</th>
                  <th className="py-3 px-4 bg-gray-100 border-b border-r border-gray-300 font-bold">Updated</th>
                  <th className="py-3 px-4 bg-gray-100 border-b border-gray-300 font-bold">Detail</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.length > 0 ? (
                  warehouses.map((wh, idx) => (
                    <tr key={wh.code || idx} className="hover:bg-gray-100 border-b border-gray-200 transition">
                      <td className="py-2 px-4 border-r border-gray-200">{idx + 1}</td>
                      <td className="py-2 px-4 border-r border-gray-200">{wh.code}</td>
                      <td className="py-2 px-4 border-r border-gray-200">{wh.location}</td>
                      <td className="py-2 px-4 border-r border-gray-200">{wh.itemCount}</td>
                      <td className="py-2 px-4 border-r border-gray-200">{wh.ownerName}</td>
                      <td className="py-2 px-4 border-r border-gray-200">{wh.createdDate}</td>
                      <td className="py-2 px-4 border-r border-gray-200">{wh.updatedDate}</td>
                      <td className="py-2 px-4">
                        <Link
                          to={`/warehouse/${wh.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Show Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-4xl text-gray-400 font-extrabold">
                      No Warehouses Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toast message at top right */}
      {message && (
        <div className="fixed top-6 right-8 z-50 bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {message}
        </div>
      )}

      {/* Modal with fade animation */}
      {modalVisible && (
        <div
          className={`
            fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-60
            transition-opacity duration-200
            ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          <form
            onSubmit={handleWarehouseSubmit}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-6 text-gray-900">Add Warehouse</h3>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 mb-2" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={warehouse.location}
                onChange={handleWarehouseChange}
                required
                className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="mb-6 w-full">
              <label className="block text-gray-700 mb-2" htmlFor="code">
                Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={warehouse.code}
                onChange={handleWarehouseChange}
                required
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
    </>
  );
};

export default WarehouseList;